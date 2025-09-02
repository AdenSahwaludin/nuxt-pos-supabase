// Run: node getSchema.js
// 1) npm i @supabase/supabase-js
// 2) Jika Node < 18: npm i node-fetch@3

import { createClient } from "@supabase/supabase-js";

// ==== POLYFILL untuk Node < 18 (yang belum punya global fetch) ====
if (typeof fetch === "undefined") {
  const { default: nodeFetch } = await import("node-fetch");
  globalThis.fetch = nodeFetch;
}

// ==== KONFIG ====
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://mjxhddjoaoekdlhnqbhy.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss"; // anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  try {
    console.log("Bun:", Bun.version);
    console.log("Supabase URL:", SUPABASE_URL);

    // --- Panggil RPC: daftar tabel ---
    const { data: tables, error: tErr } = await supabase.rpc("list_tables", {
      schema_name: "sbs",
    });
    if (tErr) throw tErr;
    console.log("\n📋 Tables in schema `sbs`:");
    console.table(tables);

    // --- Panggil RPC: daftar kolom ---
    const { data: columns, error: cErr } = await supabase.rpc("list_columns", {
      schema_name: "sbs",
    });
    if (cErr) throw cErr;
    console.log("\n📋 Columns in schema `sbs`:");
    console.table(columns);

    // --- Grouping per tabel ---
    const grouped = columns.reduce((acc, r) => {
      acc[r.table_name] = acc[r.table_name] || [];
      acc[r.table_name].push({
        column: r.column_name,
        type: r.data_type,
        nullable: r.is_nullable,
        default: r.column_default,
      });
      return acc;
    }, {});

    console.log("\n🗂️ Detail per tabel:");
    for (const [tbl, cols] of Object.entries(grouped)) {
      console.log(`\n== ${tbl} ==`);
      console.table(cols);
    }
  } catch (e) {
    console.error("\n🔥 Failed:", e?.message || e);
  }
}

main();

/*
PS D:\nuxt\nuxt-pos-supabase> bun run .\test.js
Bun: 1.2.21
Supabase URL: https://mjxhddjoaoekdlhnqbhy.supabase.co

📋 Tables in schema `sbs`:
┌───┬──────────────────┐
│   │ table_name       │
├───┼──────────────────┤
│ 0 │ pelanggan        │
│ 1 │ pembayaran       │
│ 2 │ pengguna         │
│ 3 │ piutang          │
│ 4 │ produk           │
│ 5 │ transaksi        │
│ 6 │ transaksi_detail │
└───┴──────────────────┘

📋 Columns in schema `sbs`:
┌────┬───────────────────┬───────────────────┬──────────────────────────┬─────────────┬─────────────────────────────────────────────────────────┐
│    │ table_name        │ column_name       │ data_type                │ is_nullable │ column_default                                          │
├────┼───────────────────┼───────────────────┼──────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│  0 │ pelanggan         │ id_pelanggan      │ character varying        │ NO          │ null                                                    │
│  1 │ pelanggan         │ nama              │ character varying        │ NO          │ null                                                    │
│  2 │ pelanggan         │ email             │ character varying        │ YES         │ null                                                    │
│  3 │ pelanggan         │ telepon           │ character varying        │ YES         │ null                                                    │
│  4 │ pelanggan         │ kota              │ character varying        │ YES         │ null                                                    │
│  5 │ pelanggan         │ alamat            │ text                     │ YES         │ null                                                    │
│  6 │ pelanggan         │ aktif             │ boolean                  │ NO          │ true                                                    │
│  7 │ pelanggan         │ tanggal_daftar    │ date                     │ YES         │ CURRENT_DATE                                            │
│  8 │ pelanggan         │ allow_installment │ boolean                  │ NO          │ false                                                   │
│  9 │ pelanggan         │ credit_limit      │ numeric                  │ NO          │ 0.00                                                    │
│ 10 │ pelanggan         │ max_tenor_bulan   │ smallint                 │ NO          │ 0                                                       │
│ 11 │ pelanggan         │ trust_score       │ numeric                  │ NO          │ 0                                                       │
│ 12 │ pelanggan         │ created_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 13 │ pelanggan         │ updated_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 14 │ pembayaran        │ id_pembayaran     │ character                │ NO          │ null                                                    │
│ 15 │ pembayaran        │ id_transaksi      │ character varying        │ NO          │ null                                                    │
│ 16 │ pembayaran        │ metode            │ USER-DEFINED             │ NO          │ null                                                    │
│ 17 │ pembayaran        │ jumlah            │ numeric                  │ NO          │ null                                                    │
│ 18 │ pembayaran        │ tanggal           │ timestamp with time zone │ NO          │ now()                                                   │
│ 19 │ pembayaran        │ keterangan        │ character varying        │ YES         │ null                                                    │
│ 20 │ pembayaran        │ id_piutang        │ character varying        │ YES         │ null                                                    │
│ 21 │ pembayaran        │ termin_ke         │ smallint                 │ YES         │ null                                                    │
│ 22 │ pengguna          │ id_pengguna       │ character                │ NO          │ null                                                    │
│ 23 │ pengguna          │ nama              │ character varying        │ NO          │ null                                                    │
│ 24 │ pengguna          │ email             │ character varying        │ YES         │ null                                                    │
│ 25 │ pengguna          │ telepon           │ character varying        │ YES         │ null                                                    │
│ 26 │ pengguna          │ kata_sandi        │ character                │ YES         │ null                                                    │
│ 27 │ pengguna          │ user_id           │ uuid                     │ YES         │ null                                                    │
│ 28 │ pengguna          │ role              │ USER-DEFINED             │ NO          │ 'kasir'::sbs.user_role                                  │
│ 29 │ pengguna          │ terakhir_login    │ timestamp with time zone │ YES         │ null                                                    │
│ 30 │ pengguna          │ created_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 31 │ pengguna          │ updated_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 32 │ piutang           │ id_piutang        │ character varying        │ NO          │ null                                                    │
│ 33 │ piutang           │ id_transaksi      │ character varying        │ NO          │ null                                                    │
│ 34 │ piutang           │ id_pelanggan      │ character varying        │ NO          │ null                                                    │
│ 35 │ piutang           │ tenor_bulan       │ smallint                 │ NO          │ null                                                    │
│ 36 │ piutang           │ dp_amount         │ numeric                  │ NO          │ 0                                                       │
│ 37 │ piutang           │ principal         │ numeric                  │ NO          │ null                                                    │
│ 38 │ piutang           │ bunga_persen      │ numeric                  │ NO          │ 0                                                       │
│ 39 │ piutang           │ total_tagihan     │ numeric                  │ NO          │ null                                                    │
│ 40 │ piutang           │ outstanding       │ numeric                  │ NO          │ null                                                    │
│ 41 │ piutang           │ start_date        │ date                     │ NO          │ CURRENT_DATE                                            │
│ 42 │ piutang           │ end_date          │ date                     │ YES         │ null                                                    │
│ 43 │ piutang           │ jadwal            │ jsonb                    │ NO          │ null                                                    │
│ 44 │ piutang           │ status            │ USER-DEFINED             │ NO          │ 'aktif'::sbs.ar_status                                  │
│ 45 │ piutang           │ approved_by       │ character                │ YES         │ null                                                    │
│ 46 │ piutang           │ created_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 47 │ piutang           │ updated_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 48 │ produk            │ id_produk         │ character                │ NO          │ null                                                    │
│ 49 │ produk            │ kategori          │ character varying        │ NO          │ null                                                    │
│ 50 │ produk            │ nama              │ character varying        │ NO          │ null                                                    │
│ 51 │ produk            │ gambar            │ character varying        │ YES         │ null                                                    │
│ 52 │ produk            │ nomor_bpom        │ character varying        │ YES         │ null                                                    │
│ 53 │ produk            │ harga             │ numeric                  │ NO          │ null                                                    │
│ 54 │ produk            │ biaya_produk      │ numeric                  │ NO          │ 0                                                       │
│ 55 │ produk            │ stok              │ integer                  │ NO          │ 0                                                       │
│ 56 │ produk            │ batas_stok        │ integer                  │ NO          │ 0                                                       │
│ 57 │ produk            │ unit              │ character varying        │ YES         │ 'pcs'::character varying                                │
│ 58 │ produk            │ pack_unit         │ character varying        │ YES         │ 'karton'::character varying                             │
│ 59 │ produk            │ pack_size         │ integer                  │ NO          │ 1                                                       │
│ 60 │ produk            │ harga_pack        │ numeric                  │ YES         │ null                                                    │
│ 61 │ produk            │ qty_tier1         │ integer                  │ YES         │ null                                                    │
│ 62 │ produk            │ harga_tier1       │ numeric                  │ YES         │ null                                                    │
│ 63 │ produk            │ harga_tier_qty    │ integer                  │ YES         │ null                                                    │
│ 64 │ produk            │ harga_tier_pack   │ numeric                  │ YES         │ null                                                    │
│ 65 │ produk            │ created_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 66 │ produk            │ updated_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 67 │ sbs_pengguna_view │ id_pengguna       │ character                │ YES         │ null                                                    │
│ 68 │ sbs_pengguna_view │ nama              │ character varying        │ YES         │ null                                                    │
│ 69 │ sbs_pengguna_view │ email             │ character varying        │ YES         │ null                                                    │
│ 70 │ sbs_pengguna_view │ telepon           │ character varying        │ YES         │ null                                                    │
│ 71 │ sbs_pengguna_view │ kata_sandi        │ character                │ YES         │ null                                                    │
│ 72 │ sbs_pengguna_view │ user_id           │ uuid                     │ YES         │ null                                                    │
│ 73 │ sbs_pengguna_view │ role              │ USER-DEFINED             │ YES         │ null                                                    │
│ 74 │ sbs_pengguna_view │ terakhir_login    │ timestamp with time zone │ YES         │ null                                                    │
│ 75 │ sbs_pengguna_view │ created_at        │ timestamp with time zone │ YES         │ null                                                    │
│ 76 │ sbs_pengguna_view │ updated_at        │ timestamp with time zone │ YES         │ null                                                    │
│ 77 │ transaksi         │ id_transaksi      │ character varying        │ NO          │ null                                                    │
│ 78 │ transaksi         │ id_pengguna       │ character                │ NO          │ null                                                    │
│ 79 │ transaksi         │ id_pelanggan      │ character varying        │ NO          │ null                                                    │
│ 80 │ transaksi         │ tanggal           │ timestamp with time zone │ NO          │ now()                                                   │
│ 81 │ transaksi         │ status            │ USER-DEFINED             │ NO          │ 'menunggu'::sbs.trx_status                              │
│ 82 │ transaksi         │ total             │ numeric                  │ NO          │ null                                                    │
│ 83 │ transaksi         │ diskon            │ numeric                  │ YES         │ null                                                    │
│ 84 │ transaksi         │ pajak             │ numeric                  │ YES         │ null                                                    │
│ 85 │ transaksi         │ biaya_pengiriman  │ numeric                  │ YES         │ 0                                                       │
│ 86 │ transaksi         │ is_credit         │ boolean                  │ NO          │ false                                                   │
│ 87 │ transaksi         │ dp_amount         │ numeric                  │ YES         │ 0                                                       │
│ 88 │ transaksi         │ tenor_bulan       │ smallint                 │ YES         │ null                                                    │
│ 89 │ transaksi         │ due_date          │ date                     │ YES         │ null                                                    │
│ 90 │ transaksi         │ outstanding       │ numeric                  │ YES         │ 0                                                       │
│ 91 │ transaksi         │ ar_status         │ USER-DEFINED             │ YES         │ null                                                    │
│ 92 │ transaksi         │ created_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 93 │ transaksi         │ updated_at        │ timestamp with time zone │ YES         │ now()                                                   │
│ 94 │ transaksi_detail  │ id_detail         │ bigint                   │ NO          │ nextval('sbs.transaksi_detail_id_detail_seq'::regclass) │
│ 95 │ transaksi_detail  │ id_transaksi      │ character varying        │ NO          │ null                                                    │
│ 96 │ transaksi_detail  │ id_produk         │ character                │ NO          │ null                                                    │
│ 97 │ transaksi_detail  │ jumlah            │ integer                  │ NO          │ null                                                    │
│ 98 │ transaksi_detail  │ harga_satuan      │ numeric                  │ NO          │ null                                                    │
│ 99 │ transaksi_detail  │ subtotal          │ numeric                  │ YES         │ null                                                    │
└────┴───────────────────┴───────────────────┴──────────────────────────┴─────────────┴─────────────────────────────────────────────────────────┘

🗂️ Detail per tabel:

== pelanggan ==
┌────┬───────────────────┬──────────────────────────┬──────────┬──────────────┐    
│    │ column            │ type                     │ nullable │ default      │    
├────┼───────────────────┼──────────────────────────┼──────────┼──────────────┤    
│  0 │ id_pelanggan      │ character varying        │ NO       │ null         │    
│  1 │ nama              │ character varying        │ NO       │ null         │    
│  2 │ email             │ character varying        │ YES      │ null         │    
│  3 │ telepon           │ character varying        │ YES      │ null         │    
│  4 │ kota              │ character varying        │ YES      │ null         │    
│  5 │ alamat            │ text                     │ YES      │ null         │    
│  6 │ aktif             │ boolean                  │ NO       │ true         │    
│  7 │ tanggal_daftar    │ date                     │ YES      │ CURRENT_DATE │    
│  8 │ allow_installment │ boolean                  │ NO       │ false        │    
│  9 │ credit_limit      │ numeric                  │ NO       │ 0.00         │    
│ 10 │ max_tenor_bulan   │ smallint                 │ NO       │ 0            │    
│ 11 │ trust_score       │ numeric                  │ NO       │ 0            │    
│ 12 │ created_at        │ timestamp with time zone │ YES      │ now()        │    
│ 13 │ updated_at        │ timestamp with time zone │ YES      │ now()        │    
└────┴───────────────────┴──────────────────────────┴──────────┴──────────────┘    

== pembayaran ==
┌───┬───────────────┬──────────────────────────┬──────────┬─────────┐
│   │ column        │ type                     │ nullable │ default │
├───┼───────────────┼──────────────────────────┼──────────┼─────────┤
│ 0 │ id_pembayaran │ character                │ NO       │ null    │
│ 1 │ id_transaksi  │ character varying        │ NO       │ null    │
│ 2 │ metode        │ USER-DEFINED             │ NO       │ null    │
│ 3 │ jumlah        │ numeric                  │ NO       │ null    │
│ 4 │ tanggal       │ timestamp with time zone │ NO       │ now()   │
│ 5 │ keterangan    │ character varying        │ YES      │ null    │
│ 6 │ id_piutang    │ character varying        │ YES      │ null    │
│ 7 │ termin_ke     │ smallint                 │ YES      │ null    │
└───┴───────────────┴──────────────────────────┴──────────┴─────────┘

== pengguna ==
┌───┬────────────────┬──────────────────────────┬──────────┬────────────────────────┐
│   │ column         │ type                     │ nullable │ default               
 │
├───┼────────────────┼──────────────────────────┼──────────┼────────────────────────┤
│ 0 │ id_pengguna    │ character                │ NO       │ null                  
 │
│ 1 │ nama           │ character varying        │ NO       │ null                  
 │
│ 2 │ email          │ character varying        │ YES      │ null                  
 │
│ 3 │ telepon        │ character varying        │ YES      │ null                  
 │
│ 4 │ kata_sandi     │ character                │ YES      │ null                  
 │
│ 5 │ user_id        │ uuid                     │ YES      │ null                  
 │
│ 6 │ role           │ USER-DEFINED             │ NO       │ 'kasir'::sbs.user_role │
│ 7 │ terakhir_login │ timestamp with time zone │ YES      │ null                  
 │
│ 8 │ created_at     │ timestamp with time zone │ YES      │ now()                 
 │
│ 9 │ updated_at     │ timestamp with time zone │ YES      │ now()                 
 │
└───┴────────────────┴──────────────────────────┴──────────┴────────────────────────┘

== piutang ==
┌────┬───────────────┬──────────────────────────┬──────────┬────────────────────────┐
│    │ column        │ type                     │ nullable │ default               
 │
├────┼───────────────┼──────────────────────────┼──────────┼────────────────────────┤
│  0 │ id_piutang    │ character varying        │ NO       │ null                  
 │
│  1 │ id_transaksi  │ character varying        │ NO       │ null                  
 │
│  2 │ id_pelanggan  │ character varying        │ NO       │ null                  
 │
│  3 │ tenor_bulan   │ smallint                 │ NO       │ null                  
 │
│  4 │ dp_amount     │ numeric                  │ NO       │ 0                     
 │
│  5 │ principal     │ numeric                  │ NO       │ null                  
 │
│  6 │ bunga_persen  │ numeric                  │ NO       │ 0                     
 │
│  7 │ total_tagihan │ numeric                  │ NO       │ null                  
 │
│  8 │ outstanding   │ numeric                  │ NO       │ null                  
 │
│  9 │ start_date    │ date                     │ NO       │ CURRENT_DATE          
 │
│ 10 │ end_date      │ date                     │ YES      │ null                  
 │
│ 11 │ jadwal        │ jsonb                    │ NO       │ null                  
 │
│ 12 │ status        │ USER-DEFINED             │ NO       │ 'aktif'::sbs.ar_status │
│ 13 │ approved_by   │ character                │ YES      │ null                  
 │
│ 14 │ created_at    │ timestamp with time zone │ YES      │ now()                 
 │
│ 15 │ updated_at    │ timestamp with time zone │ YES      │ now()                 
 │
└────┴───────────────┴──────────────────────────┴──────────┴────────────────────────┘

== produk ==
┌────┬─────────────────┬──────────────────────────┬──────────┬─────────────────────────────┐
│    │ column          │ type                     │ nullable │ default             
        │
├────┼─────────────────┼──────────────────────────┼──────────┼─────────────────────────────┤
│  0 │ id_produk       │ character                │ NO       │ null                
        │
│  1 │ kategori        │ character varying        │ NO       │ null                
        │
│  2 │ nama            │ character varying        │ NO       │ null                
        │
│  3 │ gambar          │ character varying        │ YES      │ null                
        │
│  4 │ nomor_bpom      │ character varying        │ YES      │ null                
        │
│  5 │ harga           │ numeric                  │ NO       │ null                
        │
│  6 │ biaya_produk    │ numeric                  │ NO       │ 0                   
        │
│  7 │ stok            │ integer                  │ NO       │ 0                   
        │
│  8 │ batas_stok      │ integer                  │ NO       │ 0                   
        │
│  9 │ unit            │ character varying        │ YES      │ 'pcs'::character varying    │
│ 10 │ pack_unit       │ character varying        │ YES      │ 'karton'::character varying │
│ 11 │ pack_size       │ integer                  │ NO       │ 1                   
        │
│ 12 │ harga_pack      │ numeric                  │ YES      │ null                
        │
│ 13 │ qty_tier1       │ integer                  │ YES      │ null                
        │
│ 14 │ harga_tier1     │ numeric                  │ YES      │ null                
        │
│ 15 │ harga_tier_qty  │ integer                  │ YES      │ null                
        │
│ 16 │ harga_tier_pack │ numeric                  │ YES      │ null                
        │
│ 17 │ created_at      │ timestamp with time zone │ YES      │ now()               
        │
│ 18 │ updated_at      │ timestamp with time zone │ YES      │ now()               
        │
└────┴─────────────────┴──────────────────────────┴──────────┴─────────────────────────────┘

== sbs_pengguna_view ==
┌───┬────────────────┬──────────────────────────┬──────────┬─────────┐
│   │ column         │ type                     │ nullable │ default │
├───┼────────────────┼──────────────────────────┼──────────┼─────────┤
│ 0 │ id_pengguna    │ character                │ YES      │ null    │
│ 1 │ nama           │ character varying        │ YES      │ null    │
│ 2 │ email          │ character varying        │ YES      │ null    │
│ 3 │ telepon        │ character varying        │ YES      │ null    │
│ 4 │ kata_sandi     │ character                │ YES      │ null    │
│ 5 │ user_id        │ uuid                     │ YES      │ null    │
│ 6 │ role           │ USER-DEFINED             │ YES      │ null    │
│ 7 │ terakhir_login │ timestamp with time zone │ YES      │ null    │
│ 8 │ created_at     │ timestamp with time zone │ YES      │ null    │
│ 9 │ updated_at     │ timestamp with time zone │ YES      │ null    │
└───┴────────────────┴──────────────────────────┴──────────┴─────────┘

== transaksi ==
┌────┬──────────────────┬──────────────────────────┬──────────┬────────────────────────────┐
│    │ column           │ type                     │ nullable │ default            
        │
├────┼──────────────────┼──────────────────────────┼──────────┼────────────────────────────┤
│  0 │ id_transaksi     │ character varying        │ NO       │ null               
        │
│  1 │ id_pengguna      │ character                │ NO       │ null               
        │
│  2 │ id_pelanggan     │ character varying        │ NO       │ null               
        │
│  3 │ tanggal          │ timestamp with time zone │ NO       │ now()              
        │
│  4 │ status           │ USER-DEFINED             │ NO       │ 'menunggu'::sbs.trx_status │
│  5 │ total            │ numeric                  │ NO       │ null               
        │
│  6 │ diskon           │ numeric                  │ YES      │ null               
        │
│  7 │ pajak            │ numeric                  │ YES      │ null               
        │
│  8 │ biaya_pengiriman │ numeric                  │ YES      │ 0                  
        │
│  9 │ is_credit        │ boolean                  │ NO       │ false              
        │
│ 10 │ dp_amount        │ numeric                  │ YES      │ 0                  
        │
│ 11 │ tenor_bulan      │ smallint                 │ YES      │ null               
        │
│ 12 │ due_date         │ date                     │ YES      │ null               
        │
│ 13 │ outstanding      │ numeric                  │ YES      │ 0                  
        │
│ 14 │ ar_status        │ USER-DEFINED             │ YES      │ null               
        │
│ 15 │ created_at       │ timestamp with time zone │ YES      │ now()              
        │
│ 16 │ updated_at       │ timestamp with time zone │ YES      │ now()              
        │
└────┴──────────────────┴──────────────────────────┴──────────┴────────────────────────────┘

== transaksi_detail ==
┌───┬──────────────┬───────────────────┬──────────┬─────────────────────────────────────────────────────────┐
│   │ column       │ type              │ nullable │ default                        
                         │
├───┼──────────────┼───────────────────┼──────────┼─────────────────────────────────────────────────────────┤
│ 0 │ id_detail    │ bigint            │ NO       │ nextval('sbs.transaksi_detail_id_detail_seq'::regclass) │
│ 1 │ id_transaksi │ character varying │ NO       │ null                           
                         │
│ 2 │ id_produk    │ character         │ NO       │ null                           
                         │
│ 3 │ jumlah       │ integer           │ NO       │ null                                                    │
│ 4 │ harga_satuan │ numeric           │ NO       │ null                                                    │
│ 5 │ subtotal     │ numeric           │ YES      │ null                                                    │
└───┴──────────────┴───────────────────┴──────────┴─────────────────────────────────────────────────────────┘
*/
