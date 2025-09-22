<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100/50">
    <!-- Sidebar -->
    <KasirSidebar
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
      <KasirTopNav
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        :breadcrumbs="breadcrumbs"
      />

      <!-- Page Content -->
      <main class="">
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
    <KasirToast />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

// Page meta
definePageMeta({
  middleware: ["role"],
  auth: true,
  requiredRole: "kasir",
});

// Reactive state
const sidebarCollapsed = ref(false);
const isMobile = ref(false);
const route = useRoute();
const authStore = useAuthStore();

// Computed properties
const activeMenu = computed(() => {
  const path = route.path;
  if (path.includes("/kasir/pos")) return "pos";
  if (path.includes("/kasir/transaksi")) return "transaksi";
  if (path.includes("/kasir/pelanggan")) return "pelanggan";
  if (path.includes("/kasir/produk")) return "produk";
  return "dashboard";
});

const breadcrumbs = computed(() => {
  const path = route.path;
  const pathSegments = path.split("/").filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    kasir: "Kasir",
    dashboard: "Dashboard",
    pos: "Point of Sale",
    transaksi: "Transaksi",
    pelanggan: "Pelanggan",
    produk: "Produk",
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
  const savedState = localStorage.getItem("kasir-sidebar-collapsed");
  if (savedState && !isMobile.value) {
    sidebarCollapsed.value = JSON.parse(savedState);
  }
});

// Watch sidebar state and save to localStorage
watch(sidebarCollapsed, (newValue) => {
  if (!isMobile.value) {
    localStorage.setItem("kasir-sidebar-collapsed", JSON.stringify(newValue));
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
