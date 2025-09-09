// Test pelanggan Supabase integration
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://nlqjbvoyuxwhuxqopngq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scWpidm95dXh3aHV4cW9wbmdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzgxMDg4OSwiZXhwIjoyMDUzMzg2ODg5fQ.5mKdFBOSjZHyuAqiRHGAKqbcJBzXjxXHq__1dUkcg2A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPelangganData() {
  console.log("🧪 Testing Pelanggan Supabase Integration");
  console.log("=".repeat(50));

  try {
    // Test 1: Fetch all pelanggan
    console.log("\n1️⃣ Testing fetch pelanggan data:");
    const { data: pelangganData, error: fetchError } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("❌ Error fetching pelanggan:", fetchError);
    } else {
      console.log(`✅ Found ${pelangganData.length} pelanggan records`);
      if (pelangganData.length > 0) {
        console.log("📋 Sample pelanggan data:");
        pelangganData.slice(0, 3).forEach((pelanggan, index) => {
          console.log(
            `   ${index + 1}. ${pelanggan.nama} (${pelanggan.email})`
          );
        });
      }
    }

    // Test 2: Create test pelanggan
    console.log("\n2️⃣ Testing create pelanggan:");
    const testPelanggan = {
      nama: "Test Pelanggan " + Date.now(),
      email: `test${Date.now()}@email.com`,
      telepon: "081234567890",
      alamat: "Jl. Test No. 123",
      aktif: true,
      allow_installment: false,
      credit_limit: 0,
    };

    const { data: createData, error: createError } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .insert([testPelanggan])
      .select();

    if (createError) {
      console.error("❌ Error creating pelanggan:", createError);
    } else {
      console.log("✅ Test pelanggan created successfully");
      console.log("📋 Created pelanggan:", createData[0]);

      // Test 3: Update test pelanggan
      console.log("\n3️⃣ Testing update pelanggan:");
      const updatedData = {
        nama: testPelanggan.nama + " (Updated)",
        telepon: "081987654321",
      };

      const { data: updateData, error: updateError } = await supabase
        .schema("sbs")
        .from("pelanggan")
        .update(updatedData)
        .eq("id_pelanggan", createData[0].id_pelanggan)
        .select();

      if (updateError) {
        console.error("❌ Error updating pelanggan:", updateError);
      } else {
        console.log("✅ Test pelanggan updated successfully");
        console.log("📋 Updated pelanggan:", updateData[0]);
      }

      // Test 4: Delete test pelanggan
      console.log("\n4️⃣ Testing delete pelanggan:");
      const { error: deleteError } = await supabase
        .schema("sbs")
        .from("pelanggan")
        .delete()
        .eq("id_pelanggan", createData[0].id_pelanggan);

      if (deleteError) {
        console.error("❌ Error deleting pelanggan:", deleteError);
      } else {
        console.log("✅ Test pelanggan deleted successfully");
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Pelanggan Supabase integration test completed!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the test
testPelangganData();
