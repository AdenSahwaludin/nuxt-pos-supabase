// testing/deleteAuthUserById.js
// Run: node testing/deleteAuthUserById.js <AUTH_UID> [--soft]
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON) {
  console.error("❌ SUPABASE_URL / SUPABASE_KEY missing in .env");
  process.exit(1);
}
if (!SERVICE) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY missing in .env (required for Admin API)"
  );
  process.exit(1);
}

const argId = process.argv[2];
const soft = process.argv.includes("--soft");
if (!argId) {
  console.error(
    "Usage: node testing/deleteAuthUserById.js <AUTH_UID> [--soft]"
  );
  process.exit(1);
}

// client public (optional, tak dipakai di hapus)
const db = createClient(URL, ANON, {
  db: { schema: "sbs" },
  auth: { persistSession: false },
});
// client admin (wajib)
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

async function deleteByAuthId(authId, { softDelete = false } = {}) {
  console.log(
    "🚀 Deleting by authId:",
    authId,
    softDelete ? "(soft delete)" : "(hard delete)"
  );
  if (!isUuid(authId)) {
    throw new Error("authId is not a valid UUID");
  }

  // 1) delete from sbs.pengguna (if any)
  const { error: delPenggunaErr } = await admin
    .from("pengguna")
    .delete()
    .eq("user_id", authId);
  if (delPenggunaErr) {
    console.warn(
      "⚠️ Delete sbs.pengguna failed:",
      delPenggunaErr.message,
      "(continue)"
    );
  } else {
    console.log("✅ Deleted related row(s) in sbs.pengguna (if existed)");
  }

  // 2) delete from Auth
  const { error: delAuthErr } = await admin.auth.admin.deleteUser(
    authId,
    softDelete ? { shouldSoftDelete: true } : undefined
  );
  if (delAuthErr) throw new Error(`Auth delete failed: ${delAuthErr.message}`);
  console.log("✅ Deleted in auth.users");

  // 3) verify
  const got = await admin.auth.admin.getUserById(authId);
  if (!got || got.error) {
    console.log("🔎 Verify: user not found → OK");
  } else {
    console.log("⚠️ Verify: user still exists:", got.data?.user?.email);
  }
}

deleteByAuthId(argId, { softDelete: soft })
  .then(() => console.log("🏁 Done"))
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  });
