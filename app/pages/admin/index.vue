<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-gray-600 mt-1">
              Selamat datang, {{ authStore.profile?.nama }}
            </p>
          </div>
          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Admin Content -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Admin Panel</h2>
        <p class="text-gray-600">
          Ini adalah halaman khusus admin. Kasir tidak bisa mengakses halaman
          ini.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: "role",
  role: "admin",
});

const authStore = useAuthStore();

const logout = async () => {
  await authStore.signOut();
};
</script>
