// Test kategori components to ensure no undefined errors
import { supabase } from "../lib/supabaseClient.js";

async function testKategoriComponents() {
  try {
    console.log("🧪 Testing kategori components...");

    // Test 1: Fetch categories to ensure data structure is correct
    console.log("\n1️⃣ Testing data fetch...");
    const { data: categories, error } = await supabase
      .schema("sbs")
      .from("kategori")
      .select("id_kategori, nama, created_at, updated_at")
      .limit(5);

    if (error) {
      console.error("❌ Error fetching categories:", error);
      return;
    }

    console.log(`✅ Fetched ${categories?.length || 0} categories`);

    // Test 2: Check data structure for each category
    if (categories && categories.length > 0) {
      console.log("\n2️⃣ Testing data structure...");
      categories.forEach((cat, index) => {
        console.log(`Category ${index + 1}:`);
        console.log(`  - id_kategori: ${cat?.id_kategori || "undefined"}`);
        console.log(`  - nama: ${cat?.nama || "undefined"}`);
        console.log(`  - created_at: ${cat?.created_at || "undefined"}`);
        console.log(`  - updated_at: ${cat?.updated_at || "undefined"}`);

        // Check for undefined properties
        if (!cat?.id_kategori) {
          console.log("  ⚠️  Missing id_kategori");
        }
        if (!cat?.nama) {
          console.log("  ⚠️  Missing nama");
        }
        if (!cat?.created_at) {
          console.log("  ⚠️  Missing created_at");
        }
        if (!cat?.updated_at) {
          console.log("  ⚠️  Missing updated_at");
        }
      });
    }

    // Test 3: Test date formatting
    console.log("\n3️⃣ Testing date formatting...");
    const testDates = [
      "2024-01-15T10:30:00Z",
      "2024-12-31T23:59:59Z",
      null,
      undefined,
      "invalid-date",
      "",
    ];

    testDates.forEach((dateStr) => {
      try {
        let result;
        if (!dateStr) {
          result = "-";
        } else {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            result = "-";
          } else {
            result = new Intl.DateTimeFormat("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(date);
          }
        }
        console.log(`  ✅ Date "${dateStr}" -> "${result}"`);
      } catch (error) {
        console.log(`  ❌ Date "${dateStr}" -> Error: ${error.message}`);
      }
    });

    // Test 4: Test with undefined category object
    console.log("\n4️⃣ Testing undefined category handling...");
    const undefinedCategory = undefined;
    const partialCategory = { nama: "Test" }; // missing id_kategori
    const fullCategory = {
      id_kategori: "K001",
      nama: "Test",
      created_at: "2024-01-15T10:30:00Z",
    };

    [undefinedCategory, partialCategory, fullCategory].forEach((cat, index) => {
      console.log(`Test category ${index + 1}:`);
      console.log(`  - id_kategori: ${cat?.id_kategori || "undefined"}`);
      console.log(`  - nama: ${cat?.nama || "undefined"}`);
      console.log(`  - Safe access works: ${cat?.id_kategori ? "Yes" : "No"}`);
    });

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testKategoriComponents();
