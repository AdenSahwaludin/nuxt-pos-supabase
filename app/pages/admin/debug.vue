<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Debug Pengguna Page</h1>

    <!-- Auth Debug Info -->
    <div class="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
      <h2 class="font-semibold mb-2">🔐 Auth Debug Info:</h2>
      <pre class="text-sm">{{ authDebug }}</pre>
    </div>

    <!-- Page Debug Info -->
    <div class="bg-green-50 border border-green-200 rounded p-4 mb-4">
      <h2 class="font-semibold mb-2">📄 Page Debug Info:</h2>
      <pre class="text-sm">{{ pageDebug }}</pre>
    </div>

    <!-- Error Debug Info -->
    <div
      v-if="errors.length > 0"
      class="bg-red-50 border border-red-200 rounded p-4 mb-4"
    >
      <h2 class="font-semibold mb-2">❌ Errors:</h2>
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="text-sm text-red-600 mb-1"
      >
        {{ error }}
      </div>
    </div>

    <!-- Mock Data Test -->
    <div class="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
      <h2 class="font-semibold mb-2">📝 Mock Data Test:</h2>
      <div v-if="mockData.length > 0">
        <div
          v-for="pengguna in mockData"
          :key="pengguna.id"
          class="border p-2 mb-2 rounded"
        >
          <div><strong>ID:</strong> {{ pengguna.id }}</div>
          <div><strong>Nama:</strong> {{ pengguna.nama }}</div>
          <div><strong>Role:</strong> {{ pengguna.role }}</div>
          <div><strong>Status:</strong> {{ pengguna.status }}</div>
          <div><strong>Has Role:</strong> {{ !!pengguna.role }}</div>
          <div><strong>Role Type:</strong> {{ typeof pengguna.role }}</div>
        </div>
      </div>
      <div v-else>No mock data loaded</div>
    </div>

    <!-- Action Buttons -->
    <div class="space-x-2">
      <button
        @click="testLoadData"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Test Load Data
      </button>
      <button
        @click="testAuthStore"
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        Test Auth Store
      </button>
      <button
        @click="clearErrors"
        class="bg-gray-600 text-white px-4 py-2 rounded"
      >
        Clear Errors
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from "vue";

// Page meta
definePageMeta({
  layout: "admin",
  middleware: ["role"],
  auth: true,
  requiredRole: "admin",
});

// Reactive state
const errors = ref<string[]>([]);
const mockData = ref<any[]>([]);
const authStore = useAuthStore();

// Debug info
const authDebug = computed(() => {
  try {
    return {
      hasUser: !!authStore.user,
      hasProfile: !!authStore.profile,
      userRole: authStore.profile?.role,
      userEmail: authStore.profile?.email,
      loading: authStore.loading,
      profileKeys: authStore.profile ? Object.keys(authStore.profile) : [],
    };
  } catch (error) {
    errors.value.push(`Auth debug error: ${error.message}`);
    return { error: error.message };
  }
});

const pageDebug = computed(() => {
  return {
    timestamp: new Date().toISOString(),
    route: useRoute().path,
    mockDataLength: mockData.value.length,
    errorsCount: errors.value.length,
  };
});

// Methods
const testLoadData = () => {
  try {
    console.log("🔧 Testing data load...");

    const testData = [
      {
        id: "1",
        id_pengguna: "001-ADN",
        nama: "Admin Utama",
        email: "admin@sbs.com",
        telepon: "081234567890",
        role: "admin",
        status: "aktif",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "2",
        id_pengguna: "002-KSR",
        nama: "Kasir Satu",
        email: "kasir1@sbs.com",
        telepon: "081234567891",
        role: "kasir",
        status: "aktif",
        created_at: "2025-01-02T00:00:00Z",
        updated_at: "2025-01-02T00:00:00Z",
      },
    ];

    console.log("📝 Test data created:", testData);

    // Validate each item
    testData.forEach((item, index) => {
      console.log(`Validating item ${index}:`, {
        hasId: !!item.id,
        hasRole: !!item.role,
        roleValue: item.role,
        roleType: typeof item.role,
        hasStatus: !!item.status,
        statusValue: item.status,
      });

      // Test accessing role property
      try {
        const roleAccess = item.role;
        const roleComparison = item.role === "admin";
        console.log(`Role access test ${index}:`, {
          roleAccess,
          roleComparison,
        });
      } catch (error) {
        errors.value.push(
          `Role access error on item ${index}: ${error.message}`
        );
      }
    });

    mockData.value = testData;
    console.log("✅ Data loaded successfully");
  } catch (error) {
    console.error("❌ Error in testLoadData:", error);
    errors.value.push(`Load data error: ${error.message}`);
  }
};

const testAuthStore = () => {
  try {
    console.log("🔧 Testing auth store...");
    console.log("Auth store methods:", Object.getOwnPropertyNames(authStore));
    console.log("Auth store state:", {
      user: !!authStore.user,
      profile: !!authStore.profile,
      loading: authStore.loading,
    });

    if (authStore.profile) {
      console.log("Profile data:", authStore.profile);

      // Test accessing role from profile
      try {
        const profileRole = authStore.profile.role;
        console.log("Profile role access:", profileRole);
      } catch (error) {
        errors.value.push(`Profile role access error: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Error in testAuthStore:", error);
    errors.value.push(`Auth store error: ${error.message}`);
  }
};

const clearErrors = () => {
  errors.value = [];
  console.log("🧹 Errors cleared");
};

// Global error handler
const handleError = (error: any, context: string) => {
  console.error(`❌ ${context}:`, error);
  errors.value.push(`${context}: ${error.message || error}`);
};

// Lifecycle
onMounted(() => {
  try {
    console.log("🔧 Debug page mounted");
    console.log("Auth store on mount:", authDebug.value);

    // Auto-test data loading
    setTimeout(() => {
      testLoadData();
    }, 1000);
  } catch (error) {
    handleError(error, "Mount error");
  }
});

// Watch for errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args.length > 0 && typeof args[0] === "string") {
    errors.value.push(args.join(" "));
  }
  originalConsoleError.apply(console, args);
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
