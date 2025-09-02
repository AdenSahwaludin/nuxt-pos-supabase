// bun run testLogin.js
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" }, auth: { persistSession: false } }
);

const testLoginWithEmail = async (email, password) => {
  console.log(`\n🔐 Testing login with email: ${email}`);

  try {
    // Get user by email
    const { data, error } = await supabase
      .from("pengguna")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error("Email tidak ditemukan");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, data.kata_sandi);
    if (!isPasswordValid) {
      throw new Error("Password salah");
    }

    console.log("✅ Login berhasil!");
    console.log(`👤 Nama: ${data.nama}`);
    console.log(`🆔 ID: ${data.id_pengguna}`);
    console.log(`👑 Role: ${data.role}`);

    return data;
  } catch (error) {
    console.error("❌ Login gagal:", error.message);
    return null;
  }
};

const testLoginWithId = async (id_pengguna, password) => {
  console.log(`\n🔐 Testing login with ID: ${id_pengguna}`);

  try {
    // Get user by id_pengguna
    const { data, error } = await supabase
      .from("pengguna")
      .select("*")
      .eq("id_pengguna", id_pengguna)
      .single();

    if (error || !data) {
      throw new Error("ID Pengguna tidak ditemukan");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, data.kata_sandi);
    if (!isPasswordValid) {
      throw new Error("Password salah");
    }

    console.log("✅ Login berhasil!");
    console.log(`👤 Nama: ${data.nama}`);
    console.log(`📧 Email: ${data.email}`);
    console.log(`👑 Role: ${data.role}`);

    return data;
  } catch (error) {
    console.error("❌ Login gagal:", error.message);
    return null;
  }
};

const run = async () => {
  console.log("🚀 Testing Login System\n");

  // First, let's check what user exists and try to determine the correct password
  console.log("📋 Checking existing user data...");

  try {
    const { data: users, error } = await supabase
      .from("pengguna")
      .select("id_pengguna, email, nama, role")
      .limit(5);

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    console.log("👥 Available users:");
    users.forEach((user) => {
      console.log(`   - ${user.id_pengguna} (${user.email}) - ${user.role}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }

  // Test with some common passwords (you'll need to replace with actual password)
  const testPasswords = [
    "password",
    "12345678",
    "admin123",
    "kasir123",
    "password123",
  ];

  console.log("\n🔑 Testing common passwords...");

  for (const password of testPasswords) {
    console.log(`\nTesting password: "${password}"`);

    // Test with email
    await testLoginWithEmail("test@test.test", password);

    // Test with ID
    await testLoginWithId("001-ADN", password);
  }

  console.log("\n🏁 Test selesai!");
  console.log("\n💡 Tip: Jika semua test gagal, Anda perlu:");
  console.log("   1. Mengetahui password yang benar dari database admin");
  console.log("   2. Atau membuat user baru dengan script terpisah");
};

run();
