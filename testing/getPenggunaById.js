// jalankan: bun run getPenggunaById.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" }, auth: { persistSession: false } }
);

const ID = "001-ADN";

const run = async () => {
  const { data, error } = await supabase
    .from("pengguna")
    .select("*")
    .eq("id_pengguna", ID)
    .single();

  if (error) {
    console.error("🔥 Error:", error.message);
    return;
  }

  console.log(`👤 Pengguna ${ID}`);
  console.log(`Nama   : ${data.nama}`);
  console.log(`Email  : ${data.email}`);
  console.log(`Telepon: ${data.telepon}`);
  console.log(`Role   : ${data.role}`);
  console.log(`Login terakhir: ${data.terakhir_login}`);
};

run();
/**
 👤 Pengguna 001-ADN
Nama   : Aden Sahwaludin
Email  : test@test.test
Telepon: 081292596948
Role   : admin
Login terakhir: 2025-09-02T06:35:28+00:00
 */
