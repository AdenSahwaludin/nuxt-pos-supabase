<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100"
  >
    <div class="text-center">
      <!-- Loading Animation -->
      <div class="w-16 h-16 mx-auto mb-6">
        <div class="relative">
          <div
            class="w-16 h-16 rounded-full border-4 border-emerald-200 animate-spin border-t-emerald-600"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Text -->
      <h2 class="text-xl font-semibold text-gray-700 mb-2">
        Memeriksa Status Login...
      </h2>
      <p class="text-gray-500">Mohon tunggu sebentar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { useAuthStore } from "@/stores/auth";

// Disable layout for this page
definePageMeta({
  layout: false,
});

const authStore = useAuthStore();

onMounted(async () => {
  try {
    // Initialize auth and wait for completion
    await authStore.initAuth();

    // Give some time for auth state to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check auth status and redirect accordingly
    if (authStore.user && authStore.profile?.role) {
      const role = authStore.profile.role;

      if (role === "admin") {
        await navigateTo("/admin");
      } else if (role === "kasir") {
        await navigateTo("/kasir");
      } else {
        // Unknown role, redirect to login
        await navigateTo("/login");
      }
    } else {
      // Not authenticated, redirect to login
      await navigateTo("/login");
    }
  } catch (error) {
    console.error("Auth check error:", error);
    // On error, redirect to login
    await navigateTo("/login");
  }
});
</script>

<style scoped>
/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
