// Debug script untuk testing halaman pengguna
// Buka browser console dan jalankan script ini

console.log("🔧 Debug Pengguna Page Started");

// Test 1: Cek apakah ada error di console
console.log("1️⃣ Checking for errors...");
setTimeout(() => {
  const errors = window.performance.getEntriesByType("navigation")[0];
  console.log("Navigation timing:", errors);
}, 1000);

// Test 2: Cek auth store
console.log("2️⃣ Checking auth store...");
try {
  // Inject ke window untuk debugging
  window.debugAuth = () => {
    const authStore = window.$nuxt?.$pinia?.state?.value?.auth;
    console.log("Auth Store State:", {
      hasUser: !!authStore?.user,
      hasProfile: !!authStore?.profile,
      userRole: authStore?.profile?.role,
      loading: authStore?.loading,
    });
    return authStore;
  };

  setTimeout(() => {
    window.debugAuth();
  }, 2000);
} catch (error) {
  console.error("❌ Error accessing auth store:", error);
}

// Test 3: Cek reactive data
console.log("3️⃣ Checking reactive data...");
window.debugPengguna = () => {
  try {
    // Check if Vue devtools is available
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      console.log("Vue DevTools available");
    }

    // Check for any global Nuxt data
    if (window.$nuxt) {
      console.log("Nuxt app instance:", Object.keys(window.$nuxt));
    }

    return "Check complete";
  } catch (error) {
    console.error("❌ Error in debug:", error);
    return error;
  }
};

// Test 4: Monitor network requests
console.log("4️⃣ Monitoring network requests...");
const originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log("🌐 Fetch request:", args[0]);
  return originalFetch
    .apply(this, args)
    .then((response) => {
      console.log("✅ Fetch response:", response.status, args[0]);
      return response;
    })
    .catch((error) => {
      console.error("❌ Fetch error:", error, args[0]);
      throw error;
    });
};

// Test 5: Check for Vue errors
window.addEventListener("error", (event) => {
  console.error("💥 Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("💥 Unhandled promise rejection:", event.reason);
});

console.log(
  "🏁 Debug setup complete. Use window.debugAuth() and window.debugPengguna() to check state"
);
