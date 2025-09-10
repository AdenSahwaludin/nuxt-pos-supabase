// Test script for kategori functionality
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testKategori() {
  console.log("🧪 Testing Kategori CRUD operations...");

  try {
    // Test 1: Create a new category
    console.log("\n1. Testing category creation...");
    const { data: newCategory, error: createError } = await supabase
      .schema("sbs")
      .from("kategori")
      .insert([{ nama: "Test Category " + Date.now() }])
      .select()
      .single();

    if (createError) {
      console.error("❌ Create error:", createError);
      return;
    }
    console.log("✅ Category created:", newCategory);

    // Test 2: Read categories
    console.log("\n2. Testing category reading...");
    const { data: categories, error: readError } = await supabase
      .schema("sbs")
      .from("kategori")
      .select("*")
      .limit(5);

    if (readError) {
      console.error("❌ Read error:", readError);
      return;
    }
    console.log("✅ Categories fetched:", categories.length);

    // Test 3: Update category
    console.log("\n3. Testing category update...");
    const { data: updatedCategory, error: updateError } = await supabase
      .schema("sbs")
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

    // Test 4: Get category with product count
    console.log("\n4. Testing category with product stats...");
    const { data: products, error: productError } = await supabase
      .schema("sbs")
      .from("produk")
      .select("harga, stok")
      .eq("id_kategori", newCategory.id_kategori);

    if (!productError) {
      const jumlah_produk = products?.length || 0;
      const total_aset =
        products?.reduce(
          (total, produk) => total + produk.harga * produk.stok,
          0
        ) || 0;

      console.log("✅ Product stats calculated:", {
        jumlah_produk,
        total_aset,
      });
    }

    // Test 5: Delete category
    console.log("\n5. Testing category deletion...");
    const { error: deleteError } = await supabase
      .schema("sbs")
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

// Run tests if called directly
if (require.main === module) {
  testKategori();
}

module.exports = { testKategori };
