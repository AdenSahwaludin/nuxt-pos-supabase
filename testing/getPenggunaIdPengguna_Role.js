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
/**
 * 📋 Data lengkap pengguna: {
  id_pengguna: "001-ADN",
  nama: "Aden Sahwaludin",
  email: "test@test.test",
  telepon: "081292596948",
  kata_sandi: "$2a$12$lax60545phX1dkkJz3T4iuRepfh61yzpPR0gf8VmD6apySXZ.uST.",
  user_id: "6f48b5b4-b01b-4668-9f8b-71b720ed2c71",
  role: "admin",
  terakhir_login: "2025-09-02T06:35:28+00:00",
  created_at: "2025-09-02T06:35:33+00:00",
  updated_at: "2025-09-02T06:35:36+00:00",
}
🧩 Role: admin
 */
