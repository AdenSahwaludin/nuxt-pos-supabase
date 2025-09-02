// bun run createTestUser.js
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { db: { schema: "sbs" }, auth: { persistSession: false } }
);

const createTestUser = async () => {
  console.log("🔐 Creating test user...");

  const testUser = {
    id_pengguna: "TEST-001",
    nama: "Test User",
    email: "testuser@example.com",
    telepon: "081234567890",
    kata_sandi: "password123",
    user_id: "test-user-id-12345",
    role: "kasir",
  };

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.kata_sandi, 12);

    // Insert user
    const { data, error } = await supabase
      .from("pengguna")
      .insert({
        id_pengguna: testUser.id_pengguna,
        nama: testUser.nama,
        email: testUser.email,
        telepon: testUser.telepon,
        kata_sandi: hashedPassword,
        user_id: testUser.user_id,
        role: testUser.role,
        terakhir_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log("✅ Test user created successfully!");
    console.log("📋 User details:");
    console.log(`   ID: ${testUser.id_pengguna}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.kata_sandi}`);
    console.log(`   Role: ${testUser.role}`);
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
  }
};

createTestUser();
