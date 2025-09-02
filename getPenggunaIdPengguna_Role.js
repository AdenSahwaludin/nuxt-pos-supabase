// bun run getPenggunaIdPengguna_Role.js
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
  console.log("📋 Data lengkap pengguna:", data);
  console.log("🧩 Role:", data.role);
};

run();
