/**
 * PANDUAN DEBUGGING ERROR 500 "Cannot read properties of undefined (reading 'role')"
 *
 * Jalankan langkah-langkah berikut untuk mengidentifikasi masalah:
 */

// 1. CEK BROWSER CONSOLE
// Buka http://localhost:3000/admin/pengguna
// Tekan F12 -> Console
// Cari error messages dan log debugging

// 2. CEK NETWORK TAB
// Buka F12 -> Network
// Reload halaman
// Lihat apakah ada request yang gagal (status 500)

// 3. JALANKAN DEBUGGING COMMANDS DI BROWSER CONSOLE:

// a) Cek Auth Store
console.log("=== AUTH DEBUG ===");
const authStore = window.$nuxt?.$pinia?.state?.value?.auth;
console.log("Auth User:", !!authStore?.user);
console.log("Auth Profile:", authStore?.profile);
console.log("Auth Role:", authStore?.profile?.role);

// b) Cek Component State
console.log("=== COMPONENT DEBUG ===");
// Ini hanya bisa dijalankan jika ada Vue DevTools
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  console.log("Vue DevTools tersedia - gunakan untuk inspect component state");
}

// c) Test Manual Data Creation
console.log("=== DATA TEST ===");
const testData = [
  {
    id: "1",
    nama: "Test User",
    role: "admin",
    status: "aktif",
  },
];

testData.forEach((item, index) => {
  try {
    console.log(`Item ${index}:`, {
      hasRole: !!item.role,
      roleValue: item.role,
      roleAccess: item.role,
      roleComparison: item.role === "admin",
    });
  } catch (error) {
    console.error(`Error accessing item ${index}:`, error);
  }
});

/**
 * 4. CEK MIDDLEWARE LOGS
 *
 * Middleware role.ts sudah ditambahkan logging.
 * Cek console browser untuk log:
 * - "🔧 Role middleware triggered for: /admin/pengguna"
 * - "👤 Auth check: ..."
 * - "🔐 Required role: ..."
 * - "✅ Role middleware passed" atau error messages
 */

/**
 * 5. LANGKAH TROUBLESHOOTING SISTEMATIS:
 */

// Step 1: Akses halaman tanpa middleware
// http://localhost:3000/admin/debug

// Step 2: Cek apakah masalah di middleware
// Jika halaman debug berjalan tapi /admin/pengguna error,
// masalah kemungkinan di middleware

// Step 3: Cek apakah masalah di template
// Jika middleware pass tapi template error,
// masalah kemungkinan di template binding

// Step 4: Cek apakah masalah di data
// Jika template binding pass tapi ada runtime error,
// masalah kemungkinan di mock data atau API response

/**
 * 6. EXPECTED LOGS SEQUENCE:
 *
 * 1. "🔧 Role middleware triggered for: /admin/pengguna"
 * 2. "👤 Auth check: { hasUser: true, hasProfile: true, profileRole: 'admin' }"
 * 3. "🔐 Required role: admin"
 * 4. "✅ Role middleware passed"
 * 5. "🔧 Pengguna page mounted"
 * 6. "🔄 Loading pengguna data..."
 * 7. "📝 Mock data created: [...]"
 * 8. "✅ Data assigned to penggunaList.value"
 * 9. "🏁 Loading completed"
 *
 * Jika sequence ini terputus, lokasi error ada di step yang tidak muncul.
 */

export default {
  name: "DebugGuide",
  description: "Panduan debugging error 500 pada halaman pengguna",
};
