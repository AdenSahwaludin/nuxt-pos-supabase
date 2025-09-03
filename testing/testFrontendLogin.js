// bun run testFrontendLogin.js
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Use the same configuration as frontend
const supabase = createClient(
  "https://mjxhddjoaoekdlhnqbhy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss",
  {
    db: {
      schema: "sbs",
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

const testFrontendLogin = async (identifier, password) => {
  console.log(`\n🔐 Testing frontend-style login: ${identifier}`);

  try {
    // Check if identifier is email or user ID format (001-ADN)
    const isEmail = identifier.includes("@");

    let userData;
    if (isEmail) {
      // Get user by email
      const { data, error } = await supabase
        .from("pengguna")
        .select("*")
        .eq("email", identifier)
        .single();

      if (error || !data) {
        throw new Error("Email tidak ditemukan");
      }
      userData = data;
    } else {
      // Get user by id_pengguna
      const { data, error } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id_pengguna", identifier)
        .single();

      if (error || !data) {
        throw new Error("ID Pengguna tidak ditemukan");
      }
      userData = data;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.kata_sandi);
    if (!isPasswordValid) {
      throw new Error("Password salah");
    }

    // Update last login
    await supabase
      .from("pengguna")
      .update({ terakhir_login: new Date().toISOString() })
      .eq("id_pengguna", userData.id_pengguna);

    console.log("✅ Login berhasil!");
    console.log(`👤 Nama: ${userData.nama}`);
    console.log(`🆔 ID: ${userData.id_pengguna}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`👑 Role: ${userData.role}`);

    return userData;
  } catch (error) {
    console.error("❌ Login gagal:", error.message);
    return null;
  }
};

const run = async () => {
  console.log("🌐 Testing Frontend Login Configuration");
  console.log("Using exact same config as supabaseClient.ts\n");

  const testCases = [
    { identifier: "test@test.test", password: "12345678" },
    { identifier: "001-ADN", password: "12345678" },
    { identifier: "kasir@kasir.kasir", password: "12345678" },
    { identifier: "002-KSR", password: "12345678" },
  ];

  for (const testCase of testCases) {
    await testFrontendLogin(testCase.identifier, testCase.password);
  }

  console.log("\n🏁 Frontend test completed!");
  console.log(
    "\n💡 If this works, the issue is likely in browser/session handling"
  );
};

run();
