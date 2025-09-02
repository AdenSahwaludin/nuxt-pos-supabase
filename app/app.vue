<template>
  <NuxtPage />
</template>

<script setup>
// Initialize auth store
import { useAuthStore } from "@/stores/auth"; // <- tambahkan ini
const authStore = useAuthStore();
// Initialize authentication state on app startup
onMounted(async () => {
  await authStore.initAuth();
});
</script>
