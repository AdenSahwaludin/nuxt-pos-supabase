<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🧪 Simple Test Page (No Middleware)</h1>

    <div class="space-y-4">
      <!-- Test 1: Basic Data -->
      <div class="border p-4 rounded">
        <h2 class="font-semibold mb-2">Test 1: Basic Mock Data</h2>
        <div v-if="testData.length > 0">
          <div
            v-for="(item, index) in testData"
            :key="index"
            class="mb-2 p-2 bg-gray-50 rounded"
          >
            <div>Index: {{ index }}</div>
            <div>ID: {{ item?.id || "UNDEFINED" }}</div>
            <div>Name: {{ item?.nama || "UNDEFINED" }}</div>
            <div>Role: {{ item?.role || "UNDEFINED" }}</div>
            <div>Role Type: {{ typeof item?.role }}</div>
            <div>Has Role: {{ !!item?.role }}</div>
            <div class="mt-2 space-x-2">
              <span
                class="px-2 py-1 text-xs rounded"
                :class="
                  item?.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                "
              >
                Role: {{ item?.role }}
              </span>
              <span
                class="px-2 py-1 text-xs rounded"
                :class="
                  item?.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                Status: {{ item?.status }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500">No data loaded</div>
        <button
          @click="loadTestData"
          class="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Load Test Data
        </button>
      </div>

      <!-- Test 2: V-For with Filter -->
      <div class="border p-4 rounded">
        <h2 class="font-semibold mb-2">Test 2: V-For with Filter</h2>
        <div v-if="testData.length > 0">
          <div
            v-for="item in testData.filter((p) => p && p.id)"
            :key="item?.id || Math.random()"
            class="mb-2 p-2 bg-yellow-50 rounded"
          >
            <div>Filtered Item: {{ item?.nama }}</div>
            <div>Role Access Test: {{ item?.role || "NO ROLE" }}</div>
            <div>
              Safe Role Access:
              {{ item && item.role ? item.role : "SAFE ACCESS FAILED" }}
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500">No filtered data</div>
      </div>

      <!-- Test 3: Error Catching -->
      <div class="border p-4 rounded">
        <h2 class="font-semibold mb-2">Test 3: Error Logs</h2>
        <div v-if="errors.length > 0" class="space-y-1">
          <div
            v-for="(error, index) in errors"
            :key="index"
            class="text-red-600 text-sm"
          >
            {{ error }}
          </div>
        </div>
        <div v-else class="text-green-600">No errors detected</div>
        <button
          @click="clearErrors"
          class="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Clear Errors
        </button>
      </div>

      <!-- Test 4: Direct Property Access -->
      <div class="border p-4 rounded">
        <h2 class="font-semibold mb-2">Test 4: Direct Property Access</h2>
        <button
          @click="testDirectAccess"
          class="bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          Test Direct Access
        </button>
        <div v-if="directTestResult" class="mt-2 text-sm">
          <pre>{{ directTestResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue";

// No middleware, no auth requirements
definePageMeta({
  layout: "default",
});

// Reactive state
const testData = ref([]);
const errors = ref([]);
const directTestResult = ref(null);

// Global error handler
const captureError = (error, context) => {
  console.error(`❌ ${context}:`, error);
  errors.value.push(`${context}: ${error.message || error}`);
};

// Override console.error to capture errors
const originalConsoleError = console.error;
console.error = (...args) => {
  errors.value.push(args.join(" "));
  originalConsoleError.apply(console, args);
};

// Test methods
const loadTestData = () => {
  try {
    console.log("🔧 Loading test data...");

    const mockData = [
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
      // Add potentially problematic data
      null,
      undefined,
      {},
      { id: "3", nama: "Incomplete User" }, // Missing role
    ];

    console.log("📝 Mock data created:", mockData);
    testData.value = mockData;
    console.log("✅ Data assigned to reactive ref");
  } catch (error) {
    captureError(error, "Load Test Data");
  }
};

const testDirectAccess = () => {
  try {
    console.log("🔧 Testing direct property access...");

    const results = {};

    testData.value.forEach((item, index) => {
      try {
        const testResult = {
          index,
          exists: !!item,
          hasId: item?.id,
          hasRole: item?.role,
          roleValue: item?.role,
          roleType: typeof item?.role,
          roleComparison: item?.role === "admin",
          safeAccess: item && item.role ? item.role : "no role",
        };

        // Test potentially problematic access
        if (item) {
          testResult.directRole = item.role;
          testResult.directRoleComparison = item.role === "admin";
        }

        results[`item_${index}`] = testResult;
      } catch (error) {
        results[`item_${index}_error`] = error.message;
        captureError(error, `Direct access test item ${index}`);
      }
    });

    directTestResult.value = JSON.stringify(results, null, 2);
    console.log("📊 Direct access test results:", results);
  } catch (error) {
    captureError(error, "Direct Access Test");
  }
};

const clearErrors = () => {
  errors.value = [];
  console.log("🧹 Errors cleared");
};

// Auto-load test data on mount
onMounted(() => {
  console.log("🔧 Test page mounted");
  loadTestData();
});
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
