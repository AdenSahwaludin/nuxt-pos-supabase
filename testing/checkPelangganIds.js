// Check pelanggan ID in database
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://nlqjbvoyuxwhuxqopngq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scWpidm95dXh3aHV4cW9wbmdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzgxMDg4OSwiZXhwIjoyMDUzMzg2ODg5fQ.5mKdFBOSjZHyuAqiRHGAKqbcJBzXjxXHq__1dUkcg2A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPelangganIds() {
  console.log("🔍 Checking existing pelanggan IDs...");

  try {
    const { data, error } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .select("id_pelanggan")
      .order("id_pelanggan", { ascending: false });

    if (error) {
      console.error("❌ Error fetching pelanggan:", error);
      return;
    }

    console.log("📋 Existing pelanggan IDs:");
    data.forEach((pelanggan, index) => {
      console.log(`   ${index + 1}. ${pelanggan.id_pelanggan}`);
    });

    if (data.length > 0) {
      const lastId = data[0].id_pelanggan;
      const num = parseInt(lastId.slice(1), 10) + 1;
      const nextId = `P${num.toString().padStart(3, "0")}`;
      console.log(`\n🔢 Last ID: ${lastId}`);
      console.log(`🆕 Next ID should be: ${nextId}`);
    } else {
      console.log("🆕 No existing pelanggan, next ID should be: P001");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the check
checkPelangganIds();
