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
-- Fix pengguna table permissions for UPDATE operations
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS sbs_admin_update_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_delete_pengguna ON sbs.pengguna;

-- Create comprehensive admin policies for pengguna table
-- Admin can UPDATE any pengguna record
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

-- Admin can INSERT new pengguna records
CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can DELETE pengguna records
CREATE POLICY sbs_admin_delete_pengguna ON sbs.pengguna
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Also add policies for pelanggan table management (admin needs this too)
DROP POLICY IF EXISTS sbs_admin_write_pelanggan ON sbs.pelanggan;

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

-- Verify the policies are created
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY tablename, policyname;
