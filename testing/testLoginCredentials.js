// Test login functionality with different passwords
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" } }
);

const testLogin = async (identifier, password) => {
  console.log(`\n🔐 Testing login: ${identifier} / ${password}`);

  try {
    // Convert identifier to uppercase for consistency
    const normalizedIdentifier = identifier.toUpperCase();

    // Check if identifier is email or user ID format
    const isEmail = identifier.includes("@");

    let query = supabase.schema("sbs").from("pengguna").select("*");

    if (isEmail) {
      query = query.eq("email", identifier);
    } else {
      query = query.eq("id_pengguna", normalizedIdentifier);
    }

    const { data: userData, error } = await query.single();

    if (error || !userData) {
      console.log("❌ User not found");
      return false;
    }

    console.log(`   User found: ${userData.nama} (${userData.role})`);

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, userData.kata_sandi);

    if (isPasswordValid) {
      console.log("✅ Login successful!");
      return true;
    } else {
      console.log("❌ Password incorrect");
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
};

// Test different combinations
const runTests = async () => {
  console.log("🧪 Testing login functionality...");

  const testCases = [
    // Test with 005-POI user that has hashed password
    {
      user: "005-poi",
      passwords: ["poipoi"],
    },
    // Test with 003-ASD user
    {
      user: "003-asd",
      passwords: ["asdasd"],
    },
    // Test with 002-KSR user
    {
      user: "002-ksr",
      passwords: ["kasir123"],
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing user: ${testCase.user}`);
    for (const password of testCase.passwords) {
      const success = await testLogin(testCase.user, password);
      if (success) {
        console.log(
          `🎉 FOUND WORKING CREDENTIALS: ${testCase.user} / ${password}`
        );
        break;
      }
    }
  }
};

runTests();
