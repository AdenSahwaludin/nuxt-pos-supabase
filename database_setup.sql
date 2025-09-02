-- SBS Database Setup Script for Supabase
-- Run this script in your Supabase SQL Editor

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS sbs;
SET search_path TO sbs, public;

-- 2. Create enum types
CREATE TYPE sbs.user_role AS ENUM ('admin','kasir');
CREATE TYPE sbs.trx_status AS ENUM ('menunggu','selesai','dibatalkan');
CREATE TYPE sbs.pay_method AS ENUM ('tunai','non_tunai');
CREATE TYPE sbs.ar_status AS ENUM ('aktif','lunas','tunggakan','gagal');
CREATE TYPE sbs.reminder_channel AS ENUM ('wa','sms','telp','email','lainnya');
CREATE TYPE sbs.yesno AS ENUM ('Y','N');

-- 3. Create pengguna table
CREATE TABLE IF NOT EXISTS sbs.pengguna (
  id_pengguna CHAR(7) PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(50) UNIQUE,
  telepon VARCHAR(20),
  kata_sandi CHAR(60), -- Legacy field, NOT used for auth
  role sbs.user_role NOT NULL DEFAULT 'kasir',
  terakhir_login TIMESTAMPTZ,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ck_id_pengguna_format CHECK (id_pengguna ~ '^[0-9]{3}-[A-Z]{2,4}$')
);

-- 4. Create pelanggan table
CREATE TABLE IF NOT EXISTS sbs.pelanggan (
  id_pelanggan VARCHAR(4) PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(50) UNIQUE,
  telepon VARCHAR(20),
  kota VARCHAR(50),
  alamat TEXT,
  status sbs.yesno NOT NULL DEFAULT 'Y',
  tanggal_daftar DATE DEFAULT CURRENT_DATE,
  allow_installment BOOLEAN NOT NULL DEFAULT false,
  credit_limit NUMERIC(12,2) NOT NULL DEFAULT 0,
  max_tenor_bulan SMALLINT NOT NULL DEFAULT 0,
  trust_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ck_id_pelanggan_format CHECK (id_pelanggan ~ '^P[0-9]{3}$')
);

-- 5. Create kategori table
CREATE TABLE IF NOT EXISTS sbs.kategori (
  id_kategori SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama VARCHAR(100) NOT NULL
);

-- 6. Create produk table
CREATE TABLE IF NOT EXISTS sbs.produk (
  id_produk CHAR(13) PRIMARY KEY,
  id_kategori SMALLINT NOT NULL REFERENCES sbs.kategori(id_kategori),
  nama VARCHAR(100) NOT NULL,
  gambar VARCHAR(255),
  nomor_bpom VARCHAR(50),
  harga NUMERIC(12,2) NOT NULL CHECK (harga >= 0),
  biaya_produk NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (biaya_produk >= 0),
  stok INTEGER NOT NULL DEFAULT 0,
  batas_stok INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create transaksi table
CREATE TABLE IF NOT EXISTS sbs.transaksi (
  id_transaksi VARCHAR(28) PRIMARY KEY,
  id_pengguna CHAR(7) NOT NULL REFERENCES sbs.pengguna(id_pengguna),
  id_pelanggan VARCHAR(4) NOT NULL REFERENCES sbs.pelanggan(id_pelanggan),
  tanggal TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  status sbs.trx_status NOT NULL DEFAULT 'menunggu',
  catatan TEXT,
  diskon NUMERIC(12,2) CHECK (diskon IS NULL OR diskon >= 0),
  pajak NUMERIC(12,2) CHECK (pajak IS NULL OR pajak >= 0),
  biaya_pengiriman NUMERIC(12,2) DEFAULT 0 CHECK (biaya_pengiriman >= 0),
  tipe_pembayaran sbs.pay_method,
  is_credit BOOLEAN NOT NULL DEFAULT false,
  dp_amount NUMERIC(12,2) DEFAULT 0 CHECK (dp_amount >= 0),
  due_date DATE,
  outstanding NUMERIC(12,2) DEFAULT 0 CHECK (outstanding >= 0),
  ar_status sbs.ar_status,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create transaksi_detail table
CREATE TABLE IF NOT EXISTS sbs.transaksi_detail (
  id_detail BIGSERIAL PRIMARY KEY,
  id_transaksi VARCHAR(28) NOT NULL REFERENCES sbs.transaksi(id_transaksi) ON DELETE CASCADE,
  id_produk CHAR(13) NOT NULL REFERENCES sbs.produk(id_produk),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  harga_satuan NUMERIC(12,2) NOT NULL CHECK (harga_satuan >= 0),
  subtotal GENERATED ALWAYS AS (jumlah * harga_satuan) STORED
);

-- 9. Create pembayaran table
CREATE TABLE IF NOT EXISTS sbs.pembayaran (
  id_pembayaran CHAR(20) PRIMARY KEY,
  id_transaksi VARCHAR(28) NOT NULL REFERENCES sbs.transaksi(id_transaksi),
  metode sbs.pay_method NOT NULL,
  jumlah NUMERIC(12,2) NOT NULL CHECK (jumlah > 0),
  keterangan VARCHAR(255),
  tanggal TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Enable RLS
ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.pelanggan ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.transaksi_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.pembayaran ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies
-- Read policies (basic authentication required)
CREATE POLICY sbs_read_all_pengguna ON sbs.pengguna
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY sbs_read_all_pelanggan ON sbs.pelanggan 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY sbs_read_all_kategori ON sbs.kategori 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY sbs_read_all_produk ON sbs.produk 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY sbs_read_all_transaksi ON sbs.transaksi 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY sbs_read_all_detail ON sbs.transaksi_detail 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY sbs_read_all_pembayaran ON sbs.pembayaran 
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Write policies for admin
CREATE POLICY sbs_write_admin_produk ON sbs.produk
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Cashier permissions for transactions
CREATE POLICY sbs_kasir_insert_transaksi ON sbs.transaksi
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role IN ('kasir','admin')
    )
  );

CREATE POLICY sbs_kasir_insert_pembayaran ON sbs.pembayaran
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role IN ('kasir','admin')
    )
  );

-- 12. Insert sample data
INSERT INTO sbs.kategori (nama) VALUES 
('Umum'), 
('Elektronik'), 
('Sparepart'),
('Konsumsi'),
('Perawatan');

INSERT INTO sbs.pelanggan (id_pelanggan, nama, email, telepon, allow_installment, credit_limit, trust_score) VALUES 
('P001', 'Andi Wijaya', 'andi@example.com', '081234567890', true, 5000000, 85.5),
('P002', 'Budi Santoso', 'budi@example.com', '081234567891', false, 0, 45.0),
('P003', 'Citra Dewi', 'citra@example.com', '081234567892', true, 2000000, 72.3);

INSERT INTO sbs.produk (id_produk, id_kategori, nama, harga, biaya_produk, stok, batas_stok) VALUES
('8999999999999', 1, 'Produk Contoh 1', 50000, 35000, 100, 10),
('8888888888888', 2, 'Elektronik Sample', 120000, 90000, 50, 5),
('7777777777777', 3, 'Sparepart ABC', 75000, 50000, 25, 3);

-- 13. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_produk_kategori ON sbs.produk(id_kategori);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON sbs.transaksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_pelanggan ON sbs.transaksi(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_trx_detail_trx ON sbs.transaksi_detail(id_transaksi);
CREATE INDEX IF NOT EXISTS idx_trx_detail_produk ON sbs.transaksi_detail(id_produk);
CREATE INDEX IF NOT EXISTS idx_pembayaran_trx ON sbs.pembayaran(id_transaksi);
CREATE INDEX IF NOT EXISTS idx_pembayaran_tanggal ON sbs.pembayaran(tanggal);

-- 14. Note: After creating users in Supabase Auth, you need to manually insert their profile data
-- Example:
-- INSERT INTO sbs.pengguna (id_pengguna, nama, email, role, user_id) VALUES
-- ('001-ADM', 'Admin Toko', 'admin@example.com', 'admin', '[AUTH_USER_ID]'),
-- ('002-KSR', 'Kasir 1', 'kasir@example.com', 'kasir', '[AUTH_USER_ID]');
