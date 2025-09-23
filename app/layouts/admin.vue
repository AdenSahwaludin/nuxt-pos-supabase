<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100/50">
    <!-- Sidebar -->
    <AdminSidebar
      :is-collapsed="sidebarCollapsed"
      @toggle="toggleSidebar"
      :active-menu="activeMenu"
    />

    <!-- Main Content -->
    <div
      class="transition-all duration-300 ease-in-out min-h-screen"
      :class="[sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64']"
    >
      <!-- Top Navigation -->
      <AdminTopNav
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        :breadcrumbs="breadcrumbs"
      />

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="!sidebarCollapsed && isMobile"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Toast Notifications -->
    <AdminToast />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

// Note: definePageMeta() should not be used in layouts
// Middleware should be defined in individual pages that use this layout

// Reactive state
const sidebarCollapsed = ref(false);
const isMobile = ref(false);
const route = useRoute();
const authStore = useAuthStore();

// Computed properties
const activeMenu = computed(() => {
  const path = route.path;
  if (path.includes("/admin/pengguna")) return "pengguna";
  if (path.includes("/admin/pelanggan")) return "pelanggan";
  if (path.includes("/admin/produk")) return "produk";
  if (path.includes("/admin/kategori")) return "kategori";
  if (path.includes("/admin/transaksi")) return "transaksi";
  if (path.includes("/admin/laporan")) return "laporan";
  return "dashboard";
});

const breadcrumbs = computed(() => {
  const path = route.path;
  const pathSegments = path.split("/").filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    admin: "Admin",
    dashboard: "Dashboard",
    pengguna: "Pengguna",
    pelanggan: "Pelanggan",
    produk: "Produk",
    kategori: "Kategori",
    transaksi: "Transaksi",
    laporan: "Laporan",
  };

  return pathSegments.map((segment, index) => ({
    label: breadcrumbMap[segment] || segment,
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
    isLast: index === pathSegments.length - 1,
  }));
});

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  if (isMobile.value && !sidebarCollapsed.value) {
    // On mobile, when opening sidebar, show it as overlay
    sidebarCollapsed.value = false;
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) {
    sidebarCollapsed.value = true;
  }
};

// Lifecycle
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);

  // Load sidebar state from localStorage
  const savedState = localStorage.getItem("admin-sidebar-collapsed");
  if (savedState && !isMobile.value) {
    sidebarCollapsed.value = JSON.parse(savedState);
  }
});

// Watch sidebar state and save to localStorage
watch(sidebarCollapsed, (newValue) => {
  if (!isMobile.value) {
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newValue));
  }
});

// Auto-collapse sidebar on mobile route changes
watch(
  () => route.path,
  () => {
    if (isMobile.value) {
      sidebarCollapsed.value = true;
    }
  }
);

const logout = async () => {
  try {
    await authStore.signOut();
    await navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>

<style scoped>
/* Smooth transitions for layout changes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
