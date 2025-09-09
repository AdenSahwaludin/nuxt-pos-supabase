// Update existing user with known password for testing
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role for updates
  { db: { schema: "sbs" } }
);

const updateUserPassword = async () => {
  console.log("🔧 Updating user password for testing...\n");

  const testPassword = "test123";
  const userId = "005-POI"; // User we'll update

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log("✅ Password hashed successfully");

    // Update user's password
    const { data, error } = await supabase
      .from("pengguna")
      .update({ kata_sandi: hashedPassword })
      .eq("id_pengguna", userId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating password:", error);
      return;
    }

    console.log("✅ Password updated successfully!");
    console.log("📋 Test credentials:");
    console.log(`   User ID: ${userId}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   Role: ${data.role}`);

    // Test the login to verify it works
    console.log("\n🧪 Testing login...");
    const loginTest = await bcrypt.compare(testPassword, hashedPassword);
    console.log(
      loginTest ? "✅ Login test successful!" : "❌ Login test failed!"
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
};

updateUserPassword();
