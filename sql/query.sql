-- pastikan schema sbs ada
create schema if not exists sbs;

set search_path to sbs, public;
create type user_role as enum ('admin','kasir');
create type trx_status as enum ('menunggu','selesai','dibatalkan');
create type pay_method as enum ('tunai','non_tunai','cicilan');
create type ar_status as enum ('aktif','lunas','tunggakan','gagal');

--BATAS

create table if not exists pengguna (
id_pengguna char(7) primary key check (id_pengguna ~ '^[0-9]{3}-[A-Z]{2,4}$'),
nama varchar(100) not null,
email varchar(50) unique,
telepon varchar(20),
kata_sandi char(60), -- legacy
user_id uuid unique references auth.users(id) on delete cascade,
role user_role not null default 'kasir',
terakhir_login timestamptz,
created_at timestamptz default now(),
updated_at timestamptz default now()
);

--BATAS

create table if not exists pelanggan (
id_pelanggan varchar(4) primary key check (id_pelanggan ~ '^P[0-9]{3}$'),
nama varchar(100) not null,
email varchar(50) unique,
telepon varchar(20), kota varchar(50), alamat text,
aktif boolean not null default true,
tanggal_daftar date default current_date,
allow_installment boolean not null default false,
credit_limit numeric(12,2) not null default 0.00,
max_tenor_bulan smallint not null default 0,
trust_score numeric(5,2) not null default 0,
created_at timestamptz default now(), updated_at timestamptz default now()
);

--BATAS

create table if not exists produk (
id_produk char(13) primary key,
kategori varchar(100) not null,
nama varchar(100) not null,
gambar varchar(255), nomor_bpom varchar(50),
harga numeric(12,2) not null check (harga >= 0),
biaya_produk numeric(12,2) not null default 0 check (biaya_produk >= 0),
stok integer not null default 0, batas_stok integer not null default 0,
-- pricing pack & tier (tanpa tabel tambahan)
unit varchar(20) default 'pcs',
pack_unit varchar(20) default 'karton',
pack_size int not null default 1, -- isi per karton (mis. 144)
harga_pack numeric(12,2), -- harga per karton (total)
qty_tier1 int, harga_tier1 numeric(12,2), -- tier pcs: min qty & harga/pcs
harga_tier_qty int, -- ambang karton untuk tier pack (opsional)
harga_tier_pack numeric(12,2), -- harga per karton khusus jika >= ambang
created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_produk_kategori on produk(kategori);

--BATAS

create table if not exists transaksi (
id_transaksi varchar(28) primary key,
id_pengguna char(7) not null references pengguna(id_pengguna),
id_pelanggan varchar(4) not null references pelanggan(id_pelanggan),
tanggal timestamptz not null default now(),
status trx_status not null default 'menunggu',
total numeric(12,2) not null check (total >= 0),
diskon numeric(12,2) check (diskon is null or diskon >= 0),
pajak numeric(12,2) check (pajak is null or pajak >= 0),
biaya_pengiriman numeric(12,2) default 0 check (biaya_pengiriman >= 0),
is_credit boolean not null default false,
dp_amount numeric(12,2) default 0 check (dp_amount >= 0),
tenor_bulan smallint, due_date date,
outstanding numeric(12,2) default 0 check (outstanding >= 0),
ar_status ar_status,
created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_transaksi_tanggal on transaksi(tanggal);
create index if not exists idx_transaksi_pelanggan on transaksi(id_pelanggan);

--BATAS

create table if not exists transaksi_detail (
id_detail bigserial primary key,
id_transaksi varchar(28) not null references transaksi(id_transaksi) on delete cascade,
id_produk char(13) not null references produk(id_produk),
jumlah integer not null check (jumlah > 0),
harga_satuan numeric(12,2) not null check (harga_satuan >= 0),
subtotal numeric(14,2) generated always as ((jumlah::numeric * harga_satuan)) stored
);
create index if not exists idx_trx_detail_trx on transaksi_detail(id_transaksi);
create index if not exists idx_trx_detail_produk on transaksi_detail(id_produk);

--BATAS

create table if not exists piutang (
id_piutang varchar(30) primary key,
id_transaksi varchar(28) not null unique references transaksi(id_transaksi) on delete cascade,
id_pelanggan varchar(4) not null references pelanggan(id_pelanggan),
tenor_bulan smallint not null check (tenor_bulan > 0),
dp_amount numeric(12,2) not null default 0 check (dp_amount >= 0),
principal numeric(12,2) not null check (principal >= 0),
bunga_persen numeric(5,2) not null default 0 check (bunga_persen >= 0),
total_tagihan numeric(12,2) not null check (total_tagihan >= 0),
outstanding numeric(12,2) not null check (outstanding >= 0),
start_date date not null default current_date, end_date date,
jadwal jsonb not null check (jsonb_typeof(jadwal)='array'), -- [{termin_ke,due_date,amount_due,amount_paid,paid_date,denda,status}]
status ar_status not null default 'aktif',
approved_by char(7) references pengguna(id_pengguna),
created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_piutang_pelanggan on piutang(id_pelanggan);
create index if not exists idx_piutang_status on piutang(status);

--BATAS

create table if not exists pembayaran (
id_pembayaran char(20) primary key,
id_transaksi varchar(28) not null references transaksi(id_transaksi),
metode pay_method not null,
jumlah numeric(12,2) not null check (jumlah > 0),
tanggal timestamptz not null default now(),
keterangan varchar(255),
id_piutang varchar(30) references piutang(id_piutang),
termin_ke smallint
);
create index if not exists idx_pembayaran_trx on pembayaran(id_transaksi);
create index if not exists idx_pembayaran_piutang on pembayaran(id_piutang);
create index if not exists idx_pembayaran_tanggal on pembayaran(tanggal);

--BATAS

alter table pengguna enable row level security;
alter table pelanggan enable row level security;
alter table produk enable row level security;
alter table transaksi enable row level security;
alter table transaksi_detail enable row level security;
alter table piutang enable row level security;
alter table pembayaran enable row level security;


create or replace view sbs_pengguna_view as select p.* from pengguna p where p.user_id = auth.uid();


create policy r_all_pengguna on pengguna for select using (auth.uid() is not null);
create policy r_all_pelanggan on pelanggan for select using (auth.uid() is not null);
create policy r_all_produk on produk for select using (auth.uid() is not null);
create policy r_all_trx on transaksi for select using (auth.uid() is not null);
create policy r_all_detail on transaksi_detail for select using (auth.uid() is not null);
create policy r_all_piutang on piutang for select using (auth.uid() is not null);
create policy r_all_bayar on pembayaran for select using (auth.uid() is not null);


-- create policy w_admin_produk on produk for all using (exists (select 1 from pengguna where user_id=auth.uid() and role='admin')) with check (exists (select 1 from pengguna where user_id=auth.uid() and role='admin'));

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

-- Admin policies for pengguna table
-- CREATE POLICY sbs_admin_update_pengguna ON sbs.pengguna
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM sbs.pengguna 
--       WHERE user_id = auth.uid() AND role = 'admin'
--     )
--   )
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM sbs.pengguna 
--       WHERE user_id = auth.uid() AND role = 'admin'
--     )
--   );

-- -- CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM sbs.pengguna 
--       WHERE user_id = auth.uid() AND role = 'admin'
--     )
--   );

CREATE POLICY sbs_admin_delete_pengguna ON sbs.pengguna
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin policies for pelanggan table  
CREATE POLICY sbs_admin_write_pelanggan ON sbs.pelanggan
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

create policy w_kasir_trx on transaksi for insert with check (exists (select 1 from pengguna where user_id=auth.uid() and role in ('kasir','admin')));
create policy w_kasir_bayar on pembayaran for insert with check (exists (select 1 from pengguna where user_id=auth.uid() and role in ('kasir','admin')));

-- UPDATE sbs.pengguna 
-- SET user_id = '6f48b5b4-b01b-4668-9f8b-71b720ed2c71' 
-- WHERE id_pengguna = '001-ADN';
-- Tabel schema sbs
create or replace function public.list_tables(schema_name text default 'sbs')
returns table(table_name text)
language sql
security definer
set search_path = public
as $$
  select table_name
  from information_schema.tables
  where table_schema = schema_name
    and table_type = 'BASE TABLE'
  order by table_name;
$$;

create or replace function public.list_columns(schema_name text default 'sbs')
returns table(
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
)
language sql
security definer
set search_path = public
as $$
  select table_name, column_name, data_type, is_nullable, column_default
  from information_schema.columns
  where table_schema = schema_name
  order by table_name, ordinal_position;
$$;

-- izinkan dipanggil dari client
grant execute on function public.list_tables(text)  to anon, authenticated;
grant execute on function public.list_columns(text) to anon, authenticated;

alter database postgres set "supabase.rest.schema" = 'public,sbs';

-- view di schema public, expose ke REST by default
create or replace view public.v_pengguna as
  select
    id_pengguna, nama, email, telepon, role, terakhir_login, created_at, updated_at
  from sbs.pengguna;

-- izinkan dibaca dari client
grant select on public.v_pengguna to anon, authenticated;

--Pisah kategori

-- =========================================
-- 1) MASTER KATEGORI (baru)
-- =========================================
create table if not exists sbs.kategori (
  id_kategori smallint generated always as identity primary key,
  nama varchar(100) not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- akses API (kalau perlu)
grant usage on schema sbs to anon, authenticated;
grant select on all tables in schema sbs to anon, authenticated;
grant usage, select on all sequences in schema sbs to anon, authenticated;

alter table sbs.kategori enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='sbs' and tablename='kategori' and policyname='r_kategori_read'
  ) then
    create policy r_kategori_read on sbs.kategori
      for select to anon, authenticated using (true);
  end if;
end $$;

-- =========================================
-- 2) TAMBAH KOLOM FK DI PRODUK
-- =========================================
do $$
begin
  -- tambahkan kolom id_kategori kalau belum ada
  if not exists (
    select 1 from information_schema.columns 
    where table_schema='sbs' and table_name='produk' and column_name='id_kategori'
  ) then
    alter table sbs.produk add column id_kategori smallint;
  end if;
end $$;

-- =========================================
-- 3) SEED TABEL KATEGORI DARI KOLOM LAMA PRODUK.kategori
-- =========================================
-- (insert distinct kategori lama -> sbs.kategori)
insert into sbs.kategori (nama)
select distinct p.kategori
from sbs.produk p
where p.kategori is not null
  and not exists (
    select 1 from sbs.kategori k where k.nama = p.kategori
  );

-- map id_kategori sesuai nama kategori lama
update sbs.produk p
set id_kategori = k.id_kategori
from sbs.kategori k
where p.kategori is not null
  and k.nama = p.kategori
  and (p.id_kategori is null or p.id_kategori <> k.id_kategori);

-- =========================================
-- 4) KUNCIIN: NOT NULL + FOREIGN KEY, INDEX
-- =========================================
-- pastikan semua baris sudah terisi
-- (kalau masih ada null, berarti ada produk tanpa kategori; assign default dulu sebelum langkah ini)
alter table sbs.produk
  alter column id_kategori set not null;

-- tambahkan FK (kalau belum ada)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_schema='sbs' and table_name='produk' and constraint_name='produk_id_kategori_fkey'
  ) then
    alter table sbs.produk
      add constraint produk_id_kategori_fkey
      foreign key (id_kategori) references sbs.kategori(id_kategori);
  end if;
end $$;

-- index untuk query cepat
create index if not exists idx_produk_id_kategori on sbs.produk(id_kategori);

-- =========================================
-- 5) BERSIHIN KOLOM LAMA
-- =========================================
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_schema='sbs' and table_name='produk' and column_name='kategori'
  ) then
    alter table sbs.produk drop column kategori;
  end if;
end $$;


--DISABLE RLS

-- 1) Matikan RLS untuk semua tabel biasa (relkind='r') di schema sbs
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema, c.relname AS tbl
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'sbs'
      AND c.relkind = 'r'         -- only ordinary tables
  LOOP
    EXECUTE format('ALTER TABLE %I.%I DISABLE ROW LEVEL SECURITY;', r.schema, r.tbl);
    EXECUTE format('ALTER TABLE %I.%I NO FORCE ROW LEVEL SECURITY;', r.schema, r.tbl);
  END LOOP;
END $$;

-- 2) Cek statusnya
SELECT n.nspname AS schema, c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'sbs' AND c.relkind='r'
ORDER BY table_name;

--Policy
-- Bootstrap Admin and Fix RLS Policies for Pengguna Creation
-- Run this in your Supabase SQL Editor

-- STEP 1: Check current admin users
SELECT id_pengguna, nama, email, role, user_id 
FROM sbs.pengguna 
WHERE role = 'admin';

-- STEP 2: Get current authenticated user details
SELECT 
    auth.uid() as current_user_id,
    auth.email() as current_email,
    auth.role() as current_role;

-- STEP 3: Temporarily disable RLS to insert/update admin user
ALTER TABLE sbs.pengguna DISABLE ROW LEVEL SECURITY;

-- STEP 4: Update existing user to be admin or insert if needed
-- First, find the current user's record and make them admin
UPDATE sbs.pengguna 
SET role = 'admin', updated_at = NOW()
WHERE user_id = auth.uid();

-- If no record exists, you need to insert manually
-- INSERT INTO sbs.pengguna (
--     id_pengguna, 
--     nama, 
--     email, 
--     role, 
--     user_id, 
--     created_at, 
--     updated_at
-- ) VALUES (
--     '001-ADM',
--     'Admin Bootstrap', 
--     auth.email(),
--     'admin',
--     auth.uid(),
--     NOW(),
--     NOW()
-- ) ON CONFLICT (id_pengguna) DO NOTHING;

-- STEP 5: Re-enable RLS
ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create improved INSERT policy that allows admin to create users
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;

CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    -- Allow if current user is admin
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR 
    -- Allow service_role for admin operations
    auth.role() = 'service_role'
  );

-- STEP 7: Verify setup
SELECT 'Bootstrap Complete' as status;

SELECT id_pengguna, nama, email, role, user_id 
FROM sbs.pengguna 
WHERE role = 'admin';

SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY policyname;


--Test basic
-- Diagnose Supabase Schema and RLS Issues
-- Run this in your Supabase SQL Editor to check current state

-- 1. Check current search_path
SHOW search_path;

-- 2. Check if sbs schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'sbs';

-- 3. Check if pengguna table exists in sbs schema
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'pengguna';

-- 4. Check RLS status on pengguna table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'sbs' AND tablename = 'pengguna';

-- 5. Check existing RLS policies
SELECT schemaname, tablename, policyname, cmd, permissive, qual, with_check
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY policyname;

-- 6. Check if user has proper permissions
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'sbs' AND table_name = 'pengguna';

-- 7. Test basic select (this will show permission denied if RLS is blocking)
SELECT * FROM sbs.pengguna LIMIT 1;

-- Comprehensive fix for SBS schema and pengguna table
-- Run this STEP BY STEP in your Supabase SQL Editor

-- STEP 1: Check if data exists in public.pengguna vs sbs.pengguna
SELECT 'PUBLIC SCHEMA' as schema_name, count(*) as row_count FROM sbs.pengguna
UNION ALL
SELECT 'SBS SCHEMA' as schema_name, count(*) as row_count FROM sbs.pengguna;

-- STEP 2: If data is in public.pengguna, migrate it to sbs.pengguna
-- First, ensure sbs.pengguna table exists (from database_setup.sql)
-- Then copy data if needed:

-- INSERT INTO sbs.pengguna (id_pengguna, nama, email, telepon, role, user_id, created_at, updated_at)
-- SELECT id_pengguna, nama, email, telepon, role, user_id, created_at, updated_at 
-- FROM public.pengguna
-- ON CONFLICT (id_pengguna) DO NOTHING;

-- STEP 3: Set default search path to include sbs first
ALTER DATABASE postgres SET search_path TO sbs, public;

-- STEP 4: Grant basic permissions to authenticated users
GRANT USAGE ON SCHEMA sbs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA sbs TO authenticated;

-- STEP 5: Create comprehensive RLS policies for pengguna table
-- Drop existing policies first
DROP POLICY IF EXISTS sbs_read_all_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_update_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_delete_pengguna ON sbs.pengguna;

-- Enable RLS
ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;

-- Read policy - any authenticated user can read
CREATE POLICY sbs_read_all_pengguna ON sbs.pengguna
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admin policies for write operations
CREATE POLICY sbs_admin_update_pengguna ON sbs.pengguna
  FOR UPDATE USING (
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

CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY sbs_admin_delete_pengguna ON sbs.pengguna
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- STEP 6: Verify setup
SELECT 'RLS Policies Created' as status;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY policyname;

--Fix add pengguna 
-- Quick fix for INSERT pengguna RLS policy issue
-- This allows admin users to create new pengguna records
-- Run this in your Supabase SQL Editor

-- First, check current user and their role
SELECT 
    auth.uid() as current_user_id,
    p.id_pengguna,
    p.nama,
    p.role
FROM sbs.pengguna p 
WHERE p.user_id = auth.uid();

-- Fix: Update INSERT policy to be more permissive for admin operations
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;

-- Option 1: Allow any authenticated admin to insert
-- This checks if the current user has admin role OR if this is the first user being created
CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    -- Allow if user is already an admin
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    -- Allow if this is the first user being created (bootstrap scenario)
    NOT EXISTS (SELECT 1 FROM sbs.pengguna WHERE role = 'admin')
    OR
    -- Allow service role (for admin operations)
    auth.role() = 'service_role'
  );

-- Alternative: Temporarily disable RLS for initial setup if needed
-- ALTER TABLE sbs.pengguna DISABLE ROW LEVEL SECURITY;
-- -- Insert your admin user manually
-- -- Then re-enable RLS
-- ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;

-- Verify the policy
SELECT schemaname, tablename, policyname, cmd, with_check
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna' AND policyname = 'sbs_admin_insert_pengguna';

-- Function to delete user from auth.users table by email
CREATE OR REPLACE FUNCTION delete_user_by_email(user_email text)
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_by_email(text) TO authenticated;

-- ==== 0) Opsional: lihat definisi view sebelum di-drop (buat backup)
-- select pg_get_viewdef('sbs.sbs_pengguna_view'::regclass, true);

BEGIN;

-- ==== 1) Drop view yang refer kolom user_id
DROP VIEW IF EXISTS sbs.sbs_pengguna_view;

-- ==== 2) Matikan RLS & drop policies yang nyantol ke user_id
-- (kamu memang mau non-RLS, jadi sekalian bersih)
ALTER TABLE sbs.produk       DISABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.transaksi    DISABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.pembayaran   DISABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.pelanggan    DISABLE ROW LEVEL SECURITY;
ALTER TABLE sbs.pengguna     DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS w_admin_produk           ON sbs.produk;
DROP POLICY IF EXISTS sbs_write_admin_produk   ON sbs.produk;

DROP POLICY IF EXISTS w_kasir_trx              ON sbs.transaksi;

DROP POLICY IF EXISTS w_kasir_bayar            ON sbs.pembayaran;

DROP POLICY IF EXISTS sbs_admin_write_pelanggan ON sbs.pelanggan;

DROP POLICY IF EXISTS sbs_admin_update_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_delete_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;

-- ==== 3) Baru drop kolom user_id
ALTER TABLE sbs.pengguna
  DROP COLUMN IF EXISTS user_id;

COMMIT;

-- Salinan Dari database sekarang
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
  allow_installment boolean NOT NULL DEFAULT false,
  credit_limit numeric NOT NULL DEFAULT 0.00,
  max_tenor_bulan smallint NOT NULL DEFAULT 0,
  trust_score numeric NOT NULL DEFAULT 0,
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
  id_piutang character varying,
  termin_ke smallint,
  CONSTRAINT pembayaran_pkey PRIMARY KEY (id_pembayaran),
  CONSTRAINT pembayaran_id_transaksi_fkey FOREIGN KEY (id_transaksi) REFERENCES sbs.transaksi(id_transaksi),
  CONSTRAINT pembayaran_id_piutang_fkey FOREIGN KEY (id_piutang) REFERENCES sbs.piutang(id_piutang)
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
CREATE TABLE sbs.piutang (
  id_piutang character varying NOT NULL,
  id_transaksi character varying NOT NULL UNIQUE,
  id_pelanggan character varying NOT NULL,
  tenor_bulan smallint NOT NULL CHECK (tenor_bulan > 0),
  dp_amount numeric NOT NULL DEFAULT 0 CHECK (dp_amount >= 0::numeric),
  principal numeric NOT NULL CHECK (principal >= 0::numeric),
  bunga_persen numeric NOT NULL DEFAULT 0 CHECK (bunga_persen >= 0::numeric),
  total_tagihan numeric NOT NULL CHECK (total_tagihan >= 0::numeric),
  outstanding numeric NOT NULL CHECK (outstanding >= 0::numeric),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  jadwal jsonb NOT NULL CHECK (jsonb_typeof(jadwal) = 'array'::text),
  status USER-DEFINED NOT NULL DEFAULT 'aktif'::sbs.ar_status,
  approved_by character,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT piutang_pkey PRIMARY KEY (id_piutang),
  CONSTRAINT piutang_id_pelanggan_fkey FOREIGN KEY (id_pelanggan) REFERENCES sbs.pelanggan(id_pelanggan),
  CONSTRAINT piutang_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES sbs.pengguna(id_pengguna),
  CONSTRAINT piutang_id_transaksi_fkey FOREIGN KEY (id_transaksi) REFERENCES sbs.transaksi(id_transaksi)
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
  id_transaksi character varying NOT NULL,
  id_pengguna character NOT NULL,
  id_pelanggan character varying NOT NULL,
  tanggal timestamp with time zone NOT NULL DEFAULT now(),
  status USER-DEFINED NOT NULL DEFAULT 'menunggu'::sbs.trx_status,
  total numeric NOT NULL CHECK (total >= 0::numeric),
  diskon numeric CHECK (diskon IS NULL OR diskon >= 0::numeric),
  pajak numeric CHECK (pajak IS NULL OR pajak >= 0::numeric),
  biaya_pengiriman numeric DEFAULT 0 CHECK (biaya_pengiriman >= 0::numeric),
  is_credit boolean NOT NULL DEFAULT false,
  dp_amount numeric DEFAULT 0 CHECK (dp_amount >= 0::numeric),
  tenor_bulan smallint,
  due_date date,
  outstanding numeric DEFAULT 0 CHECK (outstanding >= 0::numeric),
  ar_status USER-DEFINED,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transaksi_pkey PRIMARY KEY (id_transaksi),
  CONSTRAINT transaksi_id_pengguna_fkey FOREIGN KEY (id_pengguna) REFERENCES sbs.pengguna(id_pengguna),
  CONSTRAINT transaksi_id_pelanggan_fkey FOREIGN KEY (id_pelanggan) REFERENCES sbs.pelanggan(id_pelanggan)
);
CREATE TABLE sbs.transaksi_detail (
  id_detail bigint NOT NULL DEFAULT nextval('sbs.transaksi_detail_id_detail_seq'::regclass),
  id_transaksi character varying NOT NULL,
  id_produk character NOT NULL,
  jumlah integer NOT NULL CHECK (jumlah > 0),
  harga_satuan numeric NOT NULL CHECK (harga_satuan >= 0::numeric),
  subtotal numeric DEFAULT ((jumlah)::numeric * harga_satuan),
  CONSTRAINT transaksi_detail_pkey PRIMARY KEY (id_detail),
  CONSTRAINT transaksi_detail_id_produk_fkey FOREIGN KEY (id_produk) REFERENCES sbs.produk(id_produk),
  CONSTRAINT transaksi_detail_id_transaksi_fkey FOREIGN KEY (id_transaksi) REFERENCES sbs.transaksi(id_transaksi)
);