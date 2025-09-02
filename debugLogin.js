// bun run debugLogin.js
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" }, auth: { persistSession: false } }
);

const debugLogin = async (identifier) => {
  console.log(`\n🔍 Debug login untuk: "${identifier}"`);
  console.log(`Type: ${typeof identifier}, Length: ${identifier.length}`);

  // Check if identifier is email or user ID format
  const isEmail = identifier.includes("@");
  console.log(`Is Email: ${isEmail}`);

  try {
    if (!isEmail) {
      console.log(`\n📋 Searching by ID in pengguna table...`);

      // First, let's see what's in the table
      const { data: allUsers, error: allError } = await supabase
        .from("pengguna")
        .select("id_pengguna, nama")
        .limit(10);

      if (allError) {
        console.error("Error getting all users:", allError);
      } else {
        console.log("Available IDs in database:");
        allUsers.forEach((user) => {
          console.log(`  - "${user.id_pengguna}" (${user.nama})`);
        });
      }

      // Now try the specific search
      console.log(`\n🔎 Searching specifically for: "${identifier}"`);

      const { data, error } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id_pengguna", identifier)
        .single();

      console.log("Query result:");
      console.log("  Data:", data);
      console.log("  Error:", error);

      if (error) {
        console.log("  Error details:");
        console.log("    Code:", error.code);
        console.log("    Message:", error.message);
        console.log("    Details:", error.details);
        console.log("    Hint:", error.hint);
      }
    } else {
      console.log(`\n📧 Searching by email...`);
      const { data, error } = await supabase
        .from("pengguna")
        .select("*")
        .eq("email", identifier)
        .single();

      console.log("Query result:");
      console.log("  Data:", data);
      console.log("  Error:", error);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

const run = async () => {
  console.log("🐛 Login Debug Session");
  console.log("Environment check:");
  console.log(
    "  SUPABASE_URL:",
    process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "  SUPABASE_KEY:",
    process.env.SUPABASE_KEY ? "✅ Set" : "❌ Missing"
  );

  const testCases = ["001-ADN", "002-KSR", "test@test.test"];

  for (const testCase of testCases) {
    await debugLogin(testCase);
  }
};

run();
