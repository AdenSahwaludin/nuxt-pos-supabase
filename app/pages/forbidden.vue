<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
        <p class="text-gray-600 mb-8">Anda tidak memiliki akses untuk halaman ini.</p>
      </div>
      
      <div class="space-y-4">
        <button
          @click="goBack"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors mr-4"
        >
          Kembali
        </button>
        <button
          @click="goHome"
          class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const goBack = () => {
  window.history.back();
};

const goHome = () => {
  navigateTo('/');
};
</script>
