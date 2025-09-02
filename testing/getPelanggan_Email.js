// bun run getPelanggan_Email.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" }, auth: { persistSession: false } }
);

const ID = "P001";

const run = async () => {
  const { data, error } = await supabase
    .from("pelanggan")
    .select("email")
    .eq("id_pelanggan", ID)
    .single();

  if (error) {
    console.error("🔥 Error:", error.message);
    return;
  }
  console.log(`Email pelanggan ${ID}:`, data.email);
};

run();

/**
 Email pelanggan P001: sekha12111@gmail.com
 */
