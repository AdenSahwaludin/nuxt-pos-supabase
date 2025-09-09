// Create test user with known password
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role for admin operations
  { db: { schema: "sbs" } }
);

console.log("🔧 Creating test user...\n");

// Test user data
const testUser = {
  id_pengguna: "999-TEST",
  nama: "Test User",
  email: "test@test.com",
  telepon: "081234567890",
  role: "kasir",
  kata_sandi: "test123", // Plain password that will be hashed
  status: "aktif",
};

try {
  // Hash the password
  const hashedPassword = await bcrypt.hash(testUser.kata_sandi, 12);

  // Insert user with hashed password
  const { data, error } = await supabase
    .from("pengguna")
    .insert({
      id_pengguna: testUser.id_pengguna,
      nama: testUser.nama,
      email: testUser.email,
      telepon: testUser.telepon,
      role: testUser.role,
      kata_sandi: hashedPassword,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      console.log("ℹ️  Test user already exists, updating password...");

      // Update existing user's password
      const { data: updateData, error: updateError } = await supabase
        .from("pengguna")
        .update({ kata_sandi: hashedPassword })
        .eq("id_pengguna", testUser.id_pengguna)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Error updating user:", updateError);
      } else {
        console.log("✅ Test user password updated!");
        console.log("📋 Login credentials:");
        console.log(`   ID: ${testUser.id_pengguna}`);
        console.log(`   Password: ${testUser.kata_sandi}`);
      }
    } else {
      console.error("❌ Error creating user:", error);
    }
  } else {
    console.log("✅ Test user created successfully!");
    console.log("📋 Login credentials:");
    console.log(`   ID: ${testUser.id_pengguna}`);
    console.log(`   Password: ${testUser.kata_sandi}`);
  }
} catch (error) {
  console.error("❌ Unexpected error:", error);
}
