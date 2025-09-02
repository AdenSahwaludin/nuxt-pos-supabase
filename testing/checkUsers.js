// bun run checkUsers.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" }, auth: { persistSession: false } }
);

const checkUsers = async () => {
  console.log("🔍 Checking users in database...\n");
  
  try {
    // Get all users from pengguna table
    const { data: users, error } = await supabase
      .from("pengguna")
      .select("id_pengguna, nama, email, role, created_at")
      .order("id_pengguna");

    if (error) {
      console.error("❌ Error fetching users:", error);
      return;
    }

    if (!users || users.length === 0) {
      console.log("⚠️  No users found in database!");
      return;
    }

    console.log(`✅ Found ${users.length} users:`);
    console.log("═══════════════════════════════════════════════");
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id_pengguna}`);
      console.log(`   Nama: ${user.nama}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.created_at}`);
      console.log("   ─────────────────────────────────────");
    });

    // Test specific ID search
    console.log("\n🔎 Testing specific ID searches:");
    
    const testIds = ["001-ADN", "002-KSR"];
    
    for (const testId of testIds) {
      console.log(`\nSearching for ID: ${testId}`);
      
      const { data: user, error: searchError } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id_pengguna", testId)
        .single();

      if (searchError) {
        console.log(`❌ Error: ${searchError.message}`);
      } else if (user) {
        console.log(`✅ Found: ${user.nama} (${user.email})`);
      } else {
        console.log(`❌ Not found`);
      }
    }

  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
};

checkUsers();
