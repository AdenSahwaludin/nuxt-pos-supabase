// testing/testAdminDeleteUser.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables");
  console.log("NUXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.log("NUXT_SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey);
  process.exit(1);
}

const admin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test data for endpoint testing
const testEndpoint = async (identifier) => {
  console.log("\n🧪 Testing admin delete endpoint...");
  console.log("📝 Test identifier:", identifier);

  try {
    // Simulate the endpoint call (in real app this would be $fetch)
    const response = await fetch(
      "http://localhost:3000/api/admin/delete-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(identifier),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Endpoint response:", JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("❌ Endpoint test failed:", error.message);
    return null;
  }
};

// Test direct deletion (for comparison)
const testDirectDeletion = async (userId) => {
  console.log("\n🔧 Testing direct deletion...");

  try {
    // Delete from pengguna table
    const { error: penggunaError } = await admin
      .from("pengguna")
      .delete()
      .eq("user_id", userId);

    if (penggunaError) {
      console.error("❌ Pengguna delete error:", penggunaError);
      return false;
    }

    // Delete from auth
    const { error: authError } = await admin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("❌ Auth delete error:", authError);
      return false;
    }

    console.log("✅ Direct deletion successful");
    return true;
  } catch (error) {
    console.error("❌ Direct deletion failed:", error);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log("🚀 Starting admin delete user tests...");

  // Get some test data first
  console.log("\n📋 Getting test users...");
  const { data: users, error } = await admin
    .from("pengguna")
    .select("*")
    .limit(3);

  if (error) {
    console.error("❌ Failed to get test users:", error);
    return;
  }

  if (!users || users.length === 0) {
    console.log("ℹ️ No users found for testing");
    return;
  }

  console.log(`📝 Found ${users.length} users for testing`);
  users.forEach((user, index) => {
    console.log(
      `${index + 1}. ${user.id_pengguna} - ${user.nama} (${user.email})`
    );
  });

  // Test different identifier types
  const testUser = users[0];
  console.log(
    `\n🎯 Using test user: ${testUser.id_pengguna} (${testUser.nama})`
  );

  // Test 1: by id_pengguna
  console.log("\n--- Test 1: Delete by id_pengguna ---");
  await testEndpoint({
    id_pengguna: testUser.id_pengguna,
    hard: true,
  });

  // Test 2: by email (if user still exists)
  if (users.length > 1) {
    console.log("\n--- Test 2: Delete by email ---");
    await testEndpoint({
      email: users[1].email,
      hard: false,
    });
  }

  // Test 3: by user_id (if user still exists)
  if (users.length > 2) {
    console.log("\n--- Test 3: Delete by user_id ---");
    await testEndpoint({
      user_id: users[2].user_id,
      hard: true,
    });
  }

  console.log("\n🏁 Tests completed");
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testEndpoint, testDirectDeletion, runTests };
