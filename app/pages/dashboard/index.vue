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

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

definePageMeta({
  layout: false,
  middleware: ["auth"], // pastikan user sudah login
});

onMounted(async () => {
  // jika profile belum ada, muat ulang
  if (!authStore.profile) {
    await authStore.loadProfile();
  }

  // opsional: delay kecil untuk UX spinner
  await new Promise((r) => setTimeout(r, 500));

  const role = authStore.profile?.role;
  if (role === "admin") {
    return navigateTo("/admin");
  }
  // fallback ke kasir
  return navigateTo("/kasir");
});
</script>
