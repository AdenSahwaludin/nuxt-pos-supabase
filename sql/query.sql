-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE sbs.kategori (
  id_kategori smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama character varying NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT kategori_pkey PRIMARY KEY (id_kategori)
);
CREATE TABLE sbs.pelanggan (
  id_pelanggan character varying NOT NULL CHECK (id_pelanggan::text ~ '^P[0-9]{3}$'::text),
  nama character varying NOT NULL,
  email character varying UNIQUE,
  telepon character varying,
  kota character varying,
  alamat text,
  aktif boolean NOT NULL DEFAULT true,
  tanggal_daftar date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pelanggan_pkey PRIMARY KEY (id_pelanggan)
);
CREATE TABLE sbs.pembayaran (
  id_pembayaran character NOT NULL,
  id_transaksi character varying NOT NULL,
  metode USER-DEFINED NOT NULL,
  jumlah numeric NOT NULL CHECK (jumlah > 0::numeric),
  tanggal timestamp with time zone NOT NULL DEFAULT now(),
  keterangan character varying,
  CONSTRAINT pembayaran_pkey PRIMARY KEY (id_pembayaran)
);
CREATE TABLE sbs.pengguna (
  id_pengguna character NOT NULL CHECK (id_pengguna ~ '^[0-9]{3}-[A-Z]{2,4}$'::text),
  nama character varying NOT NULL,
  email character varying UNIQUE,
  telepon character varying,
  kata_sandi character,
  role USER-DEFINED NOT NULL DEFAULT 'kasir'::sbs.user_role,
  terakhir_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pengguna_pkey PRIMARY KEY (id_pengguna)
);
CREATE TABLE sbs.produk (
  id_produk character NOT NULL,
  nama character varying NOT NULL,
  gambar character varying,
  nomor_bpom character varying,
  harga numeric NOT NULL CHECK (harga >= 0::numeric),
  biaya_produk numeric NOT NULL DEFAULT 0 CHECK (biaya_produk >= 0::numeric),
  stok integer NOT NULL DEFAULT 0,
  batas_stok integer NOT NULL DEFAULT 0,
  unit character varying DEFAULT 'pcs'::character varying,
  pack_unit character varying DEFAULT 'karton'::character varying,
  pack_size integer NOT NULL DEFAULT 1,
  harga_pack numeric,
  qty_tier1 integer,
  harga_tier1 numeric,
  harga_tier_qty integer,
  harga_tier_pack numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  id_kategori smallint NOT NULL,
  CONSTRAINT produk_pkey PRIMARY KEY (id_produk),
  CONSTRAINT produk_id_kategori_fkey FOREIGN KEY (id_kategori) REFERENCES sbs.kategori(id_kategori)
);
CREATE TABLE sbs.transaksi (
  nomor_transaksi character varying NOT NULL CHECK (nomor_transaksi::text ~ '^INV-[0-9]{4}-[0-9]{2}-P[0-9]{3}-[0-9]{3}$'::text),
  id_pelanggan character varying NOT NULL,
  id_kasir character varying NOT NULL,
  tanggal timestamp with time zone NOT NULL DEFAULT now(),
  total_item integer NOT NULL DEFAULT 0,
  subtotal numeric NOT NULL DEFAULT 0,
  diskon numeric NOT NULL DEFAULT 0,
  pajak numeric NOT NULL DEFAULT 0,
  biaya_pengiriman numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  metode_bayar character varying NOT NULL DEFAULT 'TUNAI'::character varying CHECK (metode_bayar::text = ANY (ARRAY['TUNAI'::character varying, 'QRIS'::character varying, 'VA_BCA'::character varying, 'VA_BNI'::character varying, 'VA_BRI'::character varying, 'VA_PERMATA'::character varying, 'VA_MANDIRI'::character varying, 'GOPAY'::character varying, 'OVO'::character varying, 'DANA'::character varying, 'LINKAJA'::character varying, 'SHOPEEPAY'::character varying, 'CREDIT_CARD'::character varying, 'MANUAL_TRANSFER'::character varying]::text[])),
  status_pembayaran character varying NOT NULL DEFAULT 'PENDING'::character varying CHECK (status_pembayaran::text = ANY (ARRAY['PENDING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'VOID'::character varying]::text[])),
  paid_at timestamp with time zone,
  midtrans_order_id character varying,
  midtrans_transaction_id character varying,
  midtrans_status character varying,
  is_locked boolean NOT NULL DEFAULT false,
  locked_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transaksi_pkey PRIMARY KEY (nomor_transaksi),
  CONSTRAINT transaksi_id_pelanggan_fkey FOREIGN KEY (id_pelanggan) REFERENCES sbs.pelanggan(id_pelanggan),
  CONSTRAINT transaksi_id_kasir_fkey FOREIGN KEY (id_kasir) REFERENCES sbs.pengguna(id_pengguna)
);
CREATE TABLE sbs.transaksi_detail (
  id_detail bigint NOT NULL DEFAULT nextval('sbs.transaksi_detail_id_detail_seq'::regclass),
  nomor_transaksi character varying NOT NULL,
  id_produk character varying NOT NULL CHECK (id_produk::text ~ '^[0-9]{13}$'::text),
  nama_produk character varying NOT NULL,
  harga_satuan numeric NOT NULL,
  jumlah integer NOT NULL CHECK (jumlah > 0),
  mode_qty text NOT NULL DEFAULT 'unit'::text CHECK (mode_qty = ANY (ARRAY['unit'::text, 'pack'::text])),
  pack_size_snapshot integer NOT NULL DEFAULT 1 CHECK (pack_size_snapshot > 0),
  diskon_item numeric NOT NULL DEFAULT 0,
  subtotal numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transaksi_detail_pkey PRIMARY KEY (id_detail),
  CONSTRAINT transaksi_detail_nomor_transaksi_fkey FOREIGN KEY (nomor_transaksi) REFERENCES sbs.transaksi(nomor_transaksi),
  CONSTRAINT transaksi_detail_id_produk_fkey FOREIGN KEY (id_produk) REFERENCES sbs.produk(id_produk)
);