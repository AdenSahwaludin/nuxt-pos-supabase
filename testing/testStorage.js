// Test storage bucket - standalone script
// Jalankan: node testing/testStorage.js

import { createClient } from "@supabase/supabase-js";

// Baca dari environment atau set manual
const supabaseUrl =
  process.env.SUPABASE_URL || "https://mjxhddjoaoekdlhnqbhy.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss";

// Test with service role key too
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1ODExNCwiZXhwIjoyMDY5NzM0MTE0fQ.BUYry-FcE7BeWrRAsSSF0f4OygFCJMWRklH1I1EGhy8";

console.log("🔧 Supabase URL:", supabaseUrl.substring(0, 30) + "...");
console.log("🔑 Using anon key:", supabaseAnonKey.substring(0, 20) + "...");

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function testStorage() {
  try {
    console.log("\n🔄 Testing storage connection with anon key...");

    // Test with anon key first
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Anon storage connection failed:", listError.message);
    } else {
      console.log("✅ Anon storage connection successful");
      console.log(
        "📋 Buckets visible to anon:",
        buckets.map((b) => b.name)
      );
    }

    console.log("\n🔄 Testing storage connection with service role...");

    // Test with service role
    const { data: adminBuckets, error: adminError } =
      await supabaseAdmin.storage.listBuckets();

    if (adminError) {
      console.error("❌ Admin storage connection failed:", adminError.message);
      return;
    }

    console.log("✅ Admin storage connection successful");
    console.log(
      "📋 Buckets visible to admin:",
      adminBuckets.map((b) => b.name)
    );

    // Check for produk-images bucket
    const produkBucket = adminBuckets.find((b) => b.name === "produk-images");

    if (produkBucket) {
      console.log('✅ Bucket "produk-images" exists');
      console.log("📊 Bucket details:", {
        id: produkBucket.id,
        name: produkBucket.name,
        public: produkBucket.public,
      });

      // Test upload with anon key (this is what the app will use)
      await testUploadWithAnon();
    } else {
      console.log('❌ Bucket "produk-images" NOT FOUND');
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function createBucket() {
  try {
    console.log("\n🔄 Attempting to create bucket...");

    const { data, error } = await supabase.storage.createBucket(
      "produk-images",
      {
        public: true,
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ],
        fileSizeLimit: 5242880, // 5MB
      }
    );

    if (error) {
      console.error("❌ Failed to create bucket:", error.message);
      console.log("💡 Create manually in Supabase Dashboard");
    } else {
      console.log("✅ Bucket created successfully!");
      await testUpload();
    }
  } catch (error) {
    console.error("❌ Create bucket error:", error.message);
  }
}

async function testUploadWithAnon() {
  try {
    console.log("\n🧪 Testing upload with anon key...");

    const testContent = "test-upload-" + Date.now();
    const testFile = new Blob([testContent], { type: "text/plain" });
    const fileName = `test-anon-${Date.now()}.txt`;

    const { data, error } = await supabase.storage
      .from("produk-images")
      .upload(fileName, testFile);

    if (error) {
      console.error("❌ Anon upload failed:", error.message);
      console.log("💡 Need to set up storage policies for anon uploads");

      console.log("\n🔧 Setting up storage policies...");
      await setupStoragePolicies();
    } else {
      console.log("✅ Anon upload successful:", data.path);

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
    console.error("❌ Upload test error:", error.message);
  }
}

async function setupStoragePolicies() {
  try {
    console.log("🔄 Setting up storage policies...");

    // Using service role to set up policies
    const policies = [
      {
        name: "Allow authenticated uploads",
        definition: `CREATE POLICY "Allow authenticated uploads" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'produk-images');`,
      },
      {
        name: "Allow public access",
        definition: `CREATE POLICY "Allow public access" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'produk-images');`,
      },
    ];

    for (const policy of policies) {
      console.log(`📝 Creating policy: ${policy.name}`);
      // Note: Direct SQL execution would need rpc or edge function
      // For now, show what needs to be done
    }

    console.log("💡 Execute these SQL commands in Supabase SQL Editor:");
    console.log(`
-- Allow authenticated uploads  
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'produk-images');

-- Allow public access
CREATE POLICY "Allow public access" ON storage.objects  
FOR SELECT TO public
USING (bucket_id = 'produk-images');

-- Allow authenticated updates
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'produk-images');

-- Allow authenticated deletes
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated  
USING (bucket_id = 'produk-images');
    `);
  } catch (error) {
    console.error("❌ Policy setup error:", error.message);
  }
}

console.log("🚀 Supabase Storage Test\n");
testStorage();
