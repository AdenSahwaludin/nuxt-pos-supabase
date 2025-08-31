<template>
  <div class="min-h-screen flex items-center justify-center bg-emerald-50">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"
      ></div>
      <p class="text-emerald-700">Mengarahkan ke dashboard...</p>
    </div>
  </div>
</template>

<script setup>
// Simulate role detection and redirect
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: Get actual user role from auth store
  // For demo purposes, redirect to admin dashboard
  await navigateTo("/admin");
});

definePageMeta({
  auth: false, // Remove this when auth is implemented
});
</script>
