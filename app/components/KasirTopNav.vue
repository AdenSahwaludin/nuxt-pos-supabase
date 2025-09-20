<template>
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left Section: Toggle + Breadcrumbs -->
      <div class="flex items-center space-x-4">
        <!-- Sidebar Toggle -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <!-- Breadcrumbs -->
        <nav class="hidden md:flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li
              v-for="(breadcrumb, index) in breadcrumbs"
              :key="breadcrumb.path"
            >
              <div class="flex items-center">
                <svg
                  v-if="index > 0"
                  class="flex-shrink-0 h-4 w-4 text-gray-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <NuxtLink
                  v-if="!breadcrumb.isLast"
                  :to="breadcrumb.path"
                  class="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {{ breadcrumb.label }}
                </NuxtLink>
                <span v-else class="text-sm font-medium text-emerald-600">
                  {{ breadcrumb.label }}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Center Section: Quick Search -->
      <div class="hidden lg:flex flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            placeholder="Cari produk, pelanggan..."
            @keyup.enter="handleSearch"
          />
        </div>
      </div>

      <!-- Right Section: Actions + User -->
      <div class="flex items-center space-x-4">
        <!-- Quick Actions -->
        <div class="hidden md:flex items-center space-x-2">
          <!-- New Transaction Button -->
          <NuxtLink
            to="/kasir/pos"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Transaksi Baru
          </NuxtLink>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-5-5V9a5 5 0 10-10 0v3l-5 5h5a5 5 0 0010 0z"
              ></path>
            </svg>
            <!-- Notification Badge -->
            <span
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? "9+" : notificationCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            @click.stop
          >
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Notifikasi</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div
                v-if="notifications.length === 0"
                class="p-4 text-center text-gray-500 text-sm"
              >
                Tidak ada notifikasi
              </div>
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start space-x-3">
                  <div
                    class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    :class="
                      notification.type === 'warning'
                        ? 'bg-yellow-400'
                        : 'bg-emerald-400'
                    "
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">
                      {{ notification.title }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ notification.message }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ formatTime(notification.time) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="bg-emerald-600 rounded-full p-2">
              <span class="text-sm font-semibold text-white">
                {{ userInitials }}
              </span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900">
                {{ authStore.profile?.nama || "Kasir" }}
              </p>
              <p class="text-xs text-gray-500">Kasir Active</p>
            </div>
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <!-- User Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            @click.stop
          >
            <div class="py-1">
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">
                  {{ authStore.profile?.nama || "Kasir" }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ authStore.profile?.email || "kasir@sbs.com" }}
                </p>
              </div>

              <NuxtLink
                to="/kasir/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showUserMenu = false"
              >
                <svg
                  class="w-4 h-4 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Profil Saya
              </NuxtLink>

              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                <svg
                  class="w-4 h-4 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <div class="lg:hidden px-4 pb-4">
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          placeholder="Cari produk, pelanggan..."
          @keyup.enter="handleSearch"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  sidebarCollapsed: boolean;
  breadcrumbs: Array<{
    label: string;
    path: string;
    isLast: boolean;
  }>;
}

defineProps<Props>();
defineEmits<{
  "toggle-sidebar": [];
}>();

const authStore = useAuthStore();

// Reactive state
const searchQuery = ref("");
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notificationCount = ref(2);

// Sample notifications (in real app, fetch from API)
const notifications = ref([
  {
    id: 1,
    type: "warning",
    title: "Stok Menipis",
    message: 'Produk "Kopi Hitam" tersisa 5 unit',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: 2,
    type: "info",
    title: "Transaksi Baru",
    message: "Pelanggan P001 melakukan pembelian",
    time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
]);

// Computed
const userInitials = computed(() => {
  const name = authStore.profile?.nama || "Kasir";
  return name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search functionality
    console.log("Searching for:", searchQuery.value);
    // You can emit an event or navigate to search results
  }
};

const handleLogout = async () => {
  try {
    await authStore.signOut();
    await navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} menit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else {
    return `${days} hari yang lalu`;
  }
};

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showNotifications.value = false;
  showUserMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdowns);
});
</script>

<style scoped>
/* Custom dropdown animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
