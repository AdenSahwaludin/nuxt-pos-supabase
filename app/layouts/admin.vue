<template>
  <div class="min-h-screen grid grid-rows-[auto,1fr]">
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Title -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <NuxtImg
                src="/Logo_Cap_Daun_Kayu_Putih_Transparent.png"
                alt="Logo"
                class="h-8 w-8"
                loading="lazy"
              />
            </div>
            <h1 class="ml-3 text-xl font-semibold text-gray-900">
              SBS Admin Dashboard
            </h1>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink
              to="/admin"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/products"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Produk
            </NuxtLink>
            <NuxtLink
              to="/admin/customers"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Pelanggan
            </NuxtLink>
            <NuxtLink
              to="/admin/reports"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Laporan
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              {{ authStore.profile?.nama || "Admin" }}
            </div>
            <button
              @click="logout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const logout = async () => {
  try {
    await authStore.signOut();
    await navigateTo("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>
