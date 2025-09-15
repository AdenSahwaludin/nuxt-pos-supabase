// Test dengan authenticated user (bukan service role)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mjxhddjoaoekdlhnqbhy.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss";

const supabase = createClient(supabaseUrl, anonKey);

async function testAuthenticatedUpload() {
  try {
    console.log("🔄 Testing upload as authenticated user...");

    // Login with test user (ganti dengan user yang ada)
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "admin@test.com", // ganti dengan email admin yang ada
        password: "password123", // ganti dengan password yang benar
      });

    if (authError) {
      console.error("❌ Login failed:", authError.message);
      console.log("💡 Create test user or check credentials");
      return;
    }

    console.log("✅ Login successful:", authData.user.email);

    // Test upload sebagai authenticated user
    const testImageContent =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const response = await fetch(testImageContent);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from("produk-images")
      .upload(`test-auth-${Date.now()}.png`, blob);

    if (error) {
      console.error("❌ Authenticated upload failed:", error.message);
      console.log("💡 Need to setup storage policies manually");
      console.log(
        "📝 Go to Supabase Dashboard > Storage > produk-images > Settings > Policies"
      );
      console.log("   Add policy: Allow INSERT for authenticated users");
    } else {
      console.log("✅ Authenticated upload successful:", data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("produk-images")
        .getPublicUrl(data.path);

      console.log("🔗 Public URL:", urlData.publicUrl);

      // Clean up
      await supabase.storage.from("produk-images").remove([data.path]);

      console.log("🧹 Test file cleaned up");
    }

    // Logout
    await supabase.auth.signOut();
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

async function showManualSteps() {
  console.log("\n📋 Manual Setup Steps:");
  console.log("1. Go to Supabase Dashboard > Storage");
  console.log('2. Click on "produk-images" bucket');
  console.log('3. Go to "Policies" tab');
  console.log('4. Click "Add Policy"');
  console.log('5. Choose "For full customization"');
  console.log("6. Add these policies:");
  console.log("");
  console.log("   Policy 1 - Allow authenticated uploads:");
  console.log("   - Name: Allow authenticated uploads");
  console.log("   - Allowed operation: INSERT");
  console.log("   - Target roles: authenticated");
  console.log("   - USING expression: true");
  console.log("   - WITH CHECK expression: bucket_id = 'produk-images'");
  console.log("");
  console.log("   Policy 2 - Allow public access:");
  console.log("   - Name: Allow public access");
  console.log("   - Allowed operation: SELECT");
  console.log("   - Target roles: public");
  console.log("   - USING expression: bucket_id = 'produk-images'");
  console.log("");
  console.log("🔧 Alternative: Run SQL manually in Supabase SQL Editor:");
  console.log("   See content in sql/setup_storage.sql");
}

testAuthenticatedUpload();
showManualSteps();
