<template>
  <aside
    class="fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out"
    :class="[
      isCollapsed ? 'w-16' : 'w-64',
      'bg-white border-r border-emerald-200 shadow-lg',
    ]"
  >
    <!-- Logo Section -->
    <div class="flex items-center h-16 px-4 border-b border-emerald-200/50">
      <div
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600"
      >
        <NuxtImg
          src="/Logo_Cap_Daun_Kayu_Putih_Transparent.png"
          alt="Logo"
          class="w-6 h-6 object-contain"
          loading="lazy"
        />
      </div>
      <div
        v-if="!isCollapsed"
        class="ml-3 transition-opacity duration-200"
        :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
      >
        <h1 class="text-lg font-bold text-emerald-900">SBS Kasir</h1>
        <p class="text-xs text-emerald-600">Point of Sale</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="mt-6 px-3">
      <ul class="space-y-2">
        <!-- Dashboard -->
        <li>
          <NuxtLink
            to="/kasir"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
            :class="[
              activeMenu === 'dashboard'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900',
            ]"
          >
            <LayoutDashboard
              :size="20"
              class="shrink-0"
              :class="
                activeMenu === 'dashboard'
                  ? 'text-emerald-600'
                  : 'text-gray-400 group-hover:text-emerald-600'
              "
            />
            <span
              v-if="!isCollapsed"
              class="ml-3 transition-opacity duration-200"
              :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
            >
              Dashboard
            </span>
            <div
              v-if="activeMenu === 'dashboard'"
              class="ml-auto w-2 h-2 bg-emerald-600 rounded-full"
              :class="isCollapsed ? 'hidden' : 'block'"
            ></div>
          </NuxtLink>
        </li>

        <!-- POS Section -->
        <li v-if="!isCollapsed" class="px-3 pt-6 pb-2">
          <p
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            Point of Sale
          </p>
        </li>

        <!-- Point of Sale -->
        <li>
          <NuxtLink
            to="/kasir/pos"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
            :class="[
              activeMenu === 'pos'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900',
            ]"
          >
            <Calculator
              :size="20"
              class="shrink-0"
              :class="
                activeMenu === 'pos'
                  ? 'text-emerald-600'
                  : 'text-gray-400 group-hover:text-emerald-600'
              "
            />
            <span
              v-if="!isCollapsed"
              class="ml-3 transition-opacity duration-200"
              :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
            >
              Point of Sale
            </span>
            <div
              v-if="activeMenu === 'pos'"
              class="ml-auto w-2 h-2 bg-emerald-600 rounded-full"
              :class="isCollapsed ? 'hidden' : 'block'"
            ></div>
          </NuxtLink>
        </li>

        <!-- Transaksi -->
        <li>
          <NuxtLink
            to="/kasir/transaksi"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
            :class="[
              activeMenu === 'transaksi'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900',
            ]"
          >
            <Receipt
              :size="20"
              class="shrink-0"
              :class="
                activeMenu === 'transaksi'
                  ? 'text-emerald-600'
                  : 'text-gray-400 group-hover:text-emerald-600'
              "
            />
            <span
              v-if="!isCollapsed"
              class="ml-3 transition-opacity duration-200"
              :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
            >
              Riwayat Transaksi
            </span>
            <div
              v-if="activeMenu === 'transaksi'"
              class="ml-auto w-2 h-2 bg-emerald-600 rounded-full"
              :class="isCollapsed ? 'hidden' : 'block'"
            ></div>
          </NuxtLink>
        </li>

        <!-- Data Section -->
        <li v-if="!isCollapsed" class="px-3 pt-6 pb-2">
          <p
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            Data Management
          </p>
        </li>

        <!-- Pelanggan -->
        <li>
          <NuxtLink
            to="/kasir/pelanggan"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
            :class="[
              activeMenu === 'pelanggan'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900',
            ]"
          >
            <UserCheck
              :size="20"
              class="shrink-0"
              :class="
                activeMenu === 'pelanggan'
                  ? 'text-emerald-600'
                  : 'text-gray-400 group-hover:text-emerald-600'
              "
            />
            <span
              v-if="!isCollapsed"
              class="ml-3 transition-opacity duration-200"
              :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
            >
              Data Pelanggan
            </span>
            <div
              v-if="activeMenu === 'pelanggan'"
              class="ml-auto w-2 h-2 bg-emerald-600 rounded-full"
              :class="isCollapsed ? 'hidden' : 'block'"
            ></div>
          </NuxtLink>
        </li>

        <!-- Produk -->
        <li>
          <NuxtLink
            to="/kasir/produk"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
            :class="[
              activeMenu === 'produk'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900',
            ]"
          >
            <Package
              :size="20"
              class="shrink-0"
              :class="
                activeMenu === 'produk'
                  ? 'text-emerald-600'
                  : 'text-gray-400 group-hover:text-emerald-600'
              "
            />
            <span
              v-if="!isCollapsed"
              class="ml-3 transition-opacity duration-200"
              :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
            >
              Katalog Produk
            </span>
            <div
              v-if="activeMenu === 'produk'"
              class="ml-auto w-2 h-2 bg-emerald-600 rounded-full"
              :class="isCollapsed ? 'hidden' : 'block'"
            ></div>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Toggle Button -->
    <div class="absolute top-4 -right-3 hidden lg:block">
      <button
        @click="$emit('toggle')"
        class="flex items-center justify-center w-6 h-6 bg-white border-2 border-emerald-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-300"
      >
        <ChevronLeft
          :size="14"
          class="text-emerald-600 transition-transform duration-200"
          :class="isCollapsed ? 'rotate-180' : ''"
        />
      </button>
    </div>

    <!-- User Info Section -->
    <SidebarUserInfo
      :is-collapsed="isCollapsed"
      :name="authStore.profile?.nama || 'Kasir'"
      role="Kasir"
    />
  </aside>
</template>

<script setup lang="ts">
// @ts-nocheck
import { useAuthStore } from "~/stores/auth";
import SidebarUserInfo from "~/components/SidebarUserInfo.vue";
import {
  LayoutDashboard,
  Calculator,
  Receipt,
  UserCheck,
  Package,
  ChevronLeft,
} from "lucide-vue-next";

interface Props {
  isCollapsed: boolean;
  activeMenu: string;
}

defineProps<Props>();
defineEmits<{
  toggle: [];
}>();

const authStore = useAuthStore();

const userInitials = computed(() => {
  const name = authStore.profile?.nama || "Kasir";
  return name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>

<style scoped>
/* Custom scrollbar for navigation */
nav {
  scrollbar-width: thin;
  scrollbar-color: #34d399 transparent;
}

nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background-color: #34d399;
  border-radius: 2px;
}

/* Active link animation */
.router-link-active {
  position: relative;
}

/* Smooth transitions */
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
