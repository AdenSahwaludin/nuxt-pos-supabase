// Execute storage policies using service role
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mjxhddjoaoekdlhnqbhy.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1ODExNCwiZXhwIjoyMDY5NzM0MTE0fQ.BUYry-FcE7BeWrRAsSSF0f4OygFCJMWRklH1I1EGhy8";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupPolicies() {
  try {
    console.log("🔄 Setting up storage policies...");

    const policies = [
      // Allow authenticated uploads
      `CREATE POLICY "Allow authenticated uploads" ON storage.objects
       FOR INSERT TO authenticated
       WITH CHECK (bucket_id = 'produk-images')`,

      // Allow public access
      `CREATE POLICY "Allow public access" ON storage.objects
       FOR SELECT TO public
       USING (bucket_id = 'produk-images')`,

      // Allow authenticated updates
      `CREATE POLICY "Allow authenticated updates" ON storage.objects
       FOR UPDATE TO authenticated
       USING (bucket_id = 'produk-images')`,

      // Allow authenticated deletes
      `CREATE POLICY "Allow authenticated deletes" ON storage.objects
       FOR DELETE TO authenticated
       USING (bucket_id = 'produk-images')`,
    ];

    for (let i = 0; i < policies.length; i++) {
      const policy = policies[i];
      console.log(`📝 Creating policy ${i + 1}/${policies.length}...`);

      try {
        const { data, error } = await supabase.rpc("exec_sql", {
          sql: policy,
        });

        if (error) {
          console.log(`⚠️  Policy ${i + 1} may already exist:`, error.message);
        } else {
          console.log(`✅ Policy ${i + 1} created successfully`);
        }
      } catch (err) {
        console.log(`⚠️  Policy ${i + 1} error:`, err.message);
      }
    }

    console.log("\n🧪 Testing upload after policy setup...");
    await testUpload();
  } catch (error) {
    console.error("❌ Setup error:", error.message);
    console.log("\n💡 Manual setup required:");
    console.log("1. Go to Supabase Dashboard > SQL Editor");
    console.log("2. Run the SQL from sql/setup_storage.sql");
  }
}

async function testUpload() {
  try {
    // Test with image file (PNG)
    const testImageContent =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    // Convert base64 to blob
    const response = await fetch(testImageContent);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from("produk-images")
      .upload(`test-${Date.now()}.png`, blob);

    if (error) {
      console.error("❌ Upload test failed:", error.message);
    } else {
      console.log("✅ Upload test successful:", data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("produk-images")
        .getPublicUrl(data.path);

      console.log("🔗 Public URL:", urlData.publicUrl);

      // Clean up
      await supabase.storage.from("produk-images").remove([data.path]);

      console.log("🧹 Test file cleaned up");
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

setupPolicies();
