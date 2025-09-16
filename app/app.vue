<template>
  <NuxtLayout :name="layoutName" :key="$route.fullPath">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const layoutName = computed(() => {
  if (authStore.userRole === "admin") return "admin";
  if (authStore.userRole === "kasir") return "kasir";
  return "default";
});

onMounted(async () => {
  await authStore.initAuth();
});
</script>
