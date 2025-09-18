BEGIN;

-- =========================================================
-- 1) HEADER: sbs.transaksi
-- =========================================================
CREATE TABLE IF NOT EXISTS sbs.transaksi (
  -- PRIMARY KEY pakai nomor INV-YYYY-MM-<PEL>-SEQ (contoh: INV-2025-09-P001-001)
  nomor_transaksi       VARCHAR(40) PRIMARY KEY,

  -- Relasi ke master
  id_pelanggan          VARCHAR NOT NULL REFERENCES sbs.pelanggan(id_pelanggan) ON DELETE RESTRICT,
  id_kasir              VARCHAR NOT NULL REFERENCES sbs.pengguna(id_pengguna)   ON DELETE RESTRICT,

  -- Waktu & ringkasan
  tanggal               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_item            INT NOT NULL DEFAULT 0,              -- diisi dari detail (trigger)
  subtotal              NUMERIC(15,2) NOT NULL DEFAULT 0,    -- diisi dari detail (trigger)

  -- Diskon & pajak: nominal saja (satu kolom)
  diskon                NUMERIC(15,2) NOT NULL DEFAULT 0,
  pajak                 NUMERIC(15,2) NOT NULL DEFAULT 0,

  -- Biaya & total (pakai nama kolom kamu: biaya_pengiriman, total)
  biaya_pengiriman      NUMERIC(15,2) NOT NULL DEFAULT 0,
  total                 NUMERIC(15,2) NOT NULL DEFAULT 0,    -- subtotal - diskon + pajak + biaya_pengiriman

  -- Pembayaran / Midtrans
  metode_bayar          VARCHAR(32) NOT NULL DEFAULT 'TUNAI',
  status_pembayaran     VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING | PAID | FAILED | VOID
  paid_at               TIMESTAMPTZ,                               -- diisi saat status jadi PAID

  midtrans_order_id       VARCHAR(255),
  midtrans_transaction_id VARCHAR(255),
  midtrans_status         VARCHAR(50),

  -- Lock minimal
  is_locked             BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at             TIMESTAMPTZ,

  -- Audit minimal
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Validasi format & nilai
  CONSTRAINT chk_nomor_transaksi_fmt CHECK (
    nomor_transaksi ~ '^INV-[0-9]{4}-[0-9]{2}-P[0-9]{3}-[0-9]{3}$'
  ),
  CONSTRAINT chk_status_valid CHECK (
    status_pembayaran IN ('PENDING','PAID','FAILED','VOID')
  ),
  CONSTRAINT chk_metode_bayar_valid CHECK (
    metode_bayar IN (
      'TUNAI','QRIS',
      'VA_BCA','VA_BNI','VA_BRI','VA_PERMATA','VA_MANDIRI',
      'GOPAY','OVO','DANA','LINKAJA','SHOPEEPAY',
      'CREDIT_CARD','MANUAL_TRANSFER'
    )
  ),
  CONSTRAINT chk_nonnegatives CHECK (
    subtotal >= 0 AND diskon >= 0 AND pajak >= 0
    AND biaya_pengiriman >= 0 AND total >= 0
  ),
  CONSTRAINT chk_total_formula CHECK (
    total = ROUND((subtotal - diskon + pajak + biaya_pengiriman)::numeric, 2)
  )
);

-- Indeks penting
CREATE INDEX IF NOT EXISTS idx_trx_tanggal      ON sbs.transaksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_trx_status       ON sbs.transaksi(status_pembayaran);
CREATE INDEX IF NOT EXISTS idx_trx_status_date  ON sbs.transaksi(status_pembayaran, tanggal);
CREATE INDEX IF NOT EXISTS idx_trx_kasir        ON sbs.transaksi(id_kasir);
CREATE INDEX IF NOT EXISTS idx_trx_pelanggan    ON sbs.transaksi(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_trx_metode       ON sbs.transaksi(metode_bayar);

-- Unik parsial untuk Midtrans
CREATE UNIQUE INDEX IF NOT EXISTS ux_midtrans_order_id
  ON sbs.transaksi(midtrans_order_id) WHERE midtrans_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_midtrans_transaction_id
  ON sbs.transaksi(midtrans_transaction_id) WHERE midtrans_transaction_id IS NOT NULL;

-- =========================================================
-- 2) DETAIL: sbs.transaksi_detail (ikuti konvensi nama tabel kamu)
-- =========================================================
CREATE TABLE IF NOT EXISTS sbs.transaksi_detail (
  id_detail            BIGSERIAL PRIMARY KEY,

  -- FK ke header via nomor_transaksi
  nomor_transaksi      VARCHAR(40) NOT NULL
                        REFERENCES sbs.transaksi(nomor_transaksi) ON DELETE CASCADE,

  -- Produk (EAN-13) mengikuti master
  id_produk            VARCHAR NOT NULL REFERENCES sbs.produk(id_produk) ON DELETE RESTRICT,
  CONSTRAINT chk_produk_ean13 CHECK (id_produk ~ '^[0-9]{13}$'),

  -- Snapshot item
  nama_produk          VARCHAR(255) NOT NULL,
  harga_satuan         NUMERIC(15,2) NOT NULL,
  jumlah               INT NOT NULL CHECK (jumlah > 0),

  -- Unit/Pack snapshot (opsional tapi berguna)
  mode_qty             TEXT NOT NULL DEFAULT 'unit',         -- 'unit' | 'pack'
  pack_size_snapshot   INT  NOT NULL DEFAULT 1 CHECK (pack_size_snapshot > 0),

  -- Diskon item (nominal satu kolom)
  diskon_item          NUMERIC(15,2) NOT NULL DEFAULT 0,

  -- Subtotal item (auto via trigger)
  subtotal             NUMERIC(15,2) NOT NULL,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_mode_qty CHECK (mode_qty IN ('unit','pack'))
);

CREATE INDEX IF NOT EXISTS idx_trxdet_nomor   ON sbs.transaksi_detail(nomor_transaksi);
CREATE INDEX IF NOT EXISTS idx_trxdet_produk  ON sbs.transaksi_detail(id_produk);

-- =========================================================
-- 3) Generator nomor: INV-YYYY-MM-<PEL>-SEQ(3)
-- =========================================================
CREATE OR REPLACE FUNCTION sbs.generate_nomor_transaksi(p_id_pelanggan TEXT, p_tanggal TIMESTAMPTZ)
RETURNS TEXT AS $$
DECLARE
  ym TEXT; prefix TEXT; seq INT;
BEGIN
  IF p_id_pelanggan IS NULL OR p_id_pelanggan !~ '^P[0-9]{3}$' THEN
    RAISE EXCEPTION 'id_pelanggan harus format P000';
  END IF;

  ym := TO_CHAR(p_tanggal, 'YYYY-MM');
  prefix := 'INV-' || ym || '-' || p_id_pelanggan || '-';

  SELECT COALESCE(
           MAX( CAST( REGEXP_REPLACE(nomor_transaksi, '^'||prefix, '') AS INT) ), 0
         ) + 1
    INTO seq
    FROM sbs.transaksi
   WHERE nomor_transaksi LIKE prefix || '%';

  RETURN prefix || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- 4) Trigger util: updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION sbs.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trx_set_updated_at ON sbs.transaksi;
CREATE TRIGGER trg_trx_set_updated_at
  BEFORE UPDATE ON sbs.transaksi
  FOR EACH ROW
  EXECUTE FUNCTION sbs.set_updated_at();

DROP TRIGGER IF EXISTS trg_trxdet_set_updated_at ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_set_updated_at
  BEFORE UPDATE ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.set_updated_at();

-- =========================================================
-- 5) Hitung subtotal_item (DETAIL) & Recalc HEADER
-- =========================================================
-- Subtotal item = harga_satuan*jumlah - diskon_item
CREATE OR REPLACE FUNCTION sbs.calc_item_subtotal()
RETURNS TRIGGER AS $$
BEGIN
  NEW.diskon_item := COALESCE(NEW.diskon_item, 0);
  NEW.subtotal    := ROUND( (NEW.harga_satuan * NEW.jumlah) - NEW.diskon_item, 2 );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trxdet_calc_before_insupd ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_calc_before_insupd
  BEFORE INSERT OR UPDATE ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.calc_item_subtotal();

-- Recalc header (total_item, subtotal, total) setelah perubahan detail
CREATE OR REPLACE FUNCTION sbs.recalc_transaksi_header(p_nomor TEXT)
RETURNS void AS $$
DECLARE
  v_items INT;
  v_sub   NUMERIC(15,2);
  v_diskon NUMERIC(15,2);
  v_pajak  NUMERIC(15,2);
  v_biaya  NUMERIC(15,2);
  v_total  NUMERIC(15,2);
BEGIN
  SELECT COALESCE(SUM(jumlah),0), COALESCE(SUM(subtotal),0)
    INTO v_items, v_sub
    FROM sbs.transaksi_detail
   WHERE nomor_transaksi = p_nomor;

  SELECT diskon, pajak, biaya_pengiriman
    INTO v_diskon, v_pajak, v_biaya
    FROM sbs.transaksi
   WHERE nomor_transaksi = p_nomor
   FOR UPDATE;

  v_diskon := COALESCE(v_diskon, 0);
  v_pajak  := COALESCE(v_pajak,  0);
  v_biaya  := COALESCE(v_biaya,  0);
  v_total  := ROUND( (v_sub - v_diskon + v_pajak + v_biaya), 2 );

  UPDATE sbs.transaksi
     SET total_item = v_items,
         subtotal   = v_sub,
         total      = v_total,
         updated_at = NOW()
   WHERE nomor_transaksi = p_nomor;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sbs.after_trxdet_change_recalc()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM sbs.recalc_transaksi_header(CASE WHEN TG_OP='DELETE' THEN OLD.nomor_transaksi ELSE NEW.nomor_transaksi END);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trxdet_after_insupd ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_after_insupd
  AFTER INSERT OR UPDATE ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.after_trxdet_change_recalc();

DROP TRIGGER IF EXISTS trg_trxdet_after_delete ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_after_delete
  AFTER DELETE ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.after_trxdet_change_recalc();

-- Pastikan PAID mengisi paid_at & total konsisten saat insert/update HEADER
CREATE OR REPLACE FUNCTION sbs.before_trx_insupd_calc()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status_pembayaran = 'PAID' AND NEW.paid_at IS NULL THEN
    NEW.paid_at := NOW();
  END IF;

  NEW.diskon           := COALESCE(NEW.diskon, 0);
  NEW.pajak            := COALESCE(NEW.pajak,  0);
  NEW.biaya_pengiriman := COALESCE(NEW.biaya_pengiriman, 0);
  NEW.total            := ROUND( (COALESCE(NEW.subtotal,0) - NEW.diskon + NEW.pajak + NEW.biaya_pengiriman), 2 );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trx_before_insupd ON sbs.transaksi;
CREATE TRIGGER trg_trx_before_insupd
  BEFORE INSERT OR UPDATE ON sbs.transaksi
  FOR EACH ROW
  EXECUTE FUNCTION sbs.before_trx_insupd_calc();

-- =========================================================
-- 6) Auto-lock 24 jam setelah dibayar
-- =========================================================
CREATE OR REPLACE FUNCTION sbs.auto_lock_paid_transactions()
RETURNS void AS $$
BEGIN
  UPDATE sbs.transaksi
     SET is_locked = TRUE,
         locked_at = NOW()
   WHERE is_locked = FALSE
     AND status_pembayaran = 'PAID'
     AND COALESCE(paid_at, tanggal) < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- 7) Proteksi: dilarang DELETE header; gunakan VOID
-- =========================================================
CREATE OR REPLACE FUNCTION sbs.prevent_delete_transaksi()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Transaksi tidak boleh dihapus. Gunakan status VOID.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trx_prevent_delete ON sbs.transaksi;
CREATE TRIGGER trg_trx_prevent_delete
  BEFORE DELETE ON sbs.transaksi
  FOR EACH ROW
  EXECUTE FUNCTION sbs.prevent_delete_transaksi();

-- =========================================================
-- 8) Blok perubahan detail saat header terkunci
-- =========================================================
CREATE OR REPLACE FUNCTION sbs.guard_trxdet_when_locked()
RETURNS TRIGGER AS $$
DECLARE
  v_locked BOOLEAN;
  v_nomor  TEXT;
BEGIN
  v_nomor := CASE WHEN TG_OP='DELETE' THEN OLD.nomor_transaksi ELSE NEW.nomor_transaksi END;
  SELECT is_locked INTO v_locked FROM sbs.transaksi WHERE nomor_transaksi = v_nomor;

  IF v_locked THEN
    RAISE EXCEPTION 'Transaksi terkunci (is_locked = true). Perubahan item tidak diperbolehkan.';
  END IF;

  IF TG_OP IN ('INSERT','UPDATE') THEN
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trxdet_guard_ins ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_guard_ins
  BEFORE INSERT ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.guard_trxdet_when_locked();

DROP TRIGGER IF EXISTS trg_trxdet_guard_upd ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_guard_upd
  BEFORE UPDATE ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.guard_trxdet_when_locked();

DROP TRIGGER IF EXISTS trg_trxdet_guard_del ON sbs.transaksi_detail;
CREATE TRIGGER trg_trxdet_guard_del
  BEFORE DELETE ON sbs.transaksi_detail
  FOR EACH ROW
  EXECUTE FUNCTION sbs.guard_trxdet_when_locked();

-- =========================================================
-- 9) Nonaktifkan RLS (sesuai permintaan)
-- =========================================================
ALTER TABLE sbs.transaksi        DISABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.transaksi_detail DISABLE ROW LEVEL SECURITY;

COMMIT;
