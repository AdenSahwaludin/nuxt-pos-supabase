<template>
  <div>
    <!-- Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kasir Dashboard</h1>
          <p class="text-gray-600 mt-1">
            Selamat datang, {{ authStore.profile?.nama }}
          </p>
        </div>
      </div>
    </div>

    <!-- Kasir Content -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Kasir Panel</h2>
      <p class="text-gray-600">
        Ini adalah halaman khusus kasir. Admin tidak bisa mengakses halaman ini.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "role",
  role: "kasir",
});

const authStore = useAuthStore();
</script>
