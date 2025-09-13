import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://mjxhddjoaoekdlhnqbhy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0NjIwOTgsImV4cCI6MjA0NjAzODA5OH0.EkS1XY7B8iJmVMVYCn-kDKZcE8vlSGf7SJF4LOb8pgg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProdukCreate() {
  console.log("🧪 Testing Produk Create Operation...");

  try {
    // Test data
    const testProduk = {
      id_produk: "1234567890123", // EAN-13 barcode
      nomor_bpom: "MD 224510107023",
      nama: "Test Produk " + Date.now(),
      id_kategori: 1, // Assuming kategori 1 exists
      harga: 15000,
      stok: 100,
      batas_stok: 10,
      unit: "pcs",
      gambar: null,
    };

    console.log("📋 Test data:", testProduk);

    // Check if barcode already exists
    const { data: existing, error: checkError } = await supabase
      .schema("sbs")
      .from("produk")
      .select("id_produk")
      .eq("id_produk", testProduk.id_produk)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error checking existing produk:", checkError);
      return;
    }

    if (existing) {
      console.log("⚠️  Barcode already exists, using random one...");
      testProduk.id_produk = Math.floor(
        Math.random() * 9000000000000 + 1000000000000
      ).toString();
    }

    // Insert produk
    const { data, error } = await supabase
      .schema("sbs")
      .from("produk")
      .insert([testProduk])
      .select()
      .single();

    if (error) {
      console.error("❌ Insert error:", error);
      return;
    }

    console.log("✅ Produk created successfully:");
    console.log("📦 ID:", data.id_produk);
    console.log("📝 Nama:", data.nama);
    console.log("💰 Harga:", data.harga);
    console.log("📊 Stok:", data.stok);
    console.log("🏷️  Kategori ID:", data.id_kategori);

    // Clean up test data
    const { error: deleteError } = await supabase
      .schema("sbs")
      .from("produk")
      .delete()
      .eq("id_produk", data.id_produk);

    if (deleteError) {
      console.error("⚠️  Could not clean up test data:", deleteError);
    } else {
      console.log("🧹 Test data cleaned up successfully");
    }
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

// Run the test
testProdukCreate();
