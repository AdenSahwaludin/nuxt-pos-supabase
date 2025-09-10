// Test script for kategori functionality
import { createClient } from "@supabase/supabase-js";

// Use the same configuration as the app
const supabase = createClient(
  "https://mjxhddjoaoekdlhnqbhy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss",
  {
    db: {
      schema: "sbs",
    },
  }
);

async function testKategori() {
  console.log("🧪 Testing Kategori CRUD operations...");

  try {
    // Test 1: Check if kategori table exists
    console.log("\n1. Testing kategori table access...");
    const { data: categories, error: readError } = await supabase
      .from("kategori")
      .select("*")
      .limit(1);

    if (readError) {
      console.error("❌ Read error:", readError);
      console.log(
        "💡 Make sure kategori table exists and RLS policies are set"
      );
      return;
    }
    console.log("✅ Kategori table accessible");

    // Test 2: Create a new category
    console.log("\n2. Testing category creation...");
    const testName = "Test Category " + Date.now();
    const { data: newCategory, error: createError } = await supabase
      .from("kategori")
      .insert([{ nama: testName }])
      .select()
      .single();

    if (createError) {
      console.error("❌ Create error:", createError);
      return;
    }
    console.log("✅ Category created:", newCategory);

    // Test 3: Read categories
    console.log("\n3. Testing category reading...");
    const { data: allCategories, error: readError2 } = await supabase
      .from("kategori")
      .select("*")
      .limit(5);

    if (readError2) {
      console.error("❌ Read error:", readError2);
      return;
    }
    console.log("✅ Categories fetched:", allCategories?.length || 0);

    // Test 4: Update category
    console.log("\n4. Testing category update...");
    const { data: updatedCategory, error: updateError } = await supabase
      .from("kategori")
      .update({ nama: "Updated Test Category" })
      .eq("id_kategori", newCategory.id_kategori)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Update error:", updateError);
      return;
    }
    console.log("✅ Category updated:", updatedCategory);

    // Test 5: Get category with product count
    console.log("\n5. Testing category with product stats...");
    const { data: products, error: productError } = await supabase
      .from("produk")
      .select("harga, stok")
      .eq("id_kategori", newCategory.id_kategori);

    if (!productError) {
      const jumlah_produk = products?.length || 0;
      const total_aset =
        products?.reduce(
          (total, produk) => total + (produk.harga || 0) * (produk.stok || 0),
          0
        ) || 0;

      console.log("✅ Product stats calculated:", {
        jumlah_produk,
        total_aset,
      });
    } else {
      console.log("ℹ️ Product table not accessible or empty");
    }

    // Test 6: Delete category
    console.log("\n6. Testing category deletion...");
    const { error: deleteError } = await supabase
      .from("kategori")
      .delete()
      .eq("id_kategori", newCategory.id_kategori);

    if (deleteError) {
      console.error("❌ Delete error:", deleteError);
      return;
    }
    console.log("✅ Category deleted successfully");

    console.log("\n🎉 All kategori tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testKategori();
