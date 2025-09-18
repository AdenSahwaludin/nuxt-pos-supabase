<template>
  <header
    class="bg-white/80 backdrop-blur-md border-b border-emerald-200/50 shadow-sm"
  >
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Mobile Menu Toggle & Breadcrumbs -->
      <div class="flex items-center space-x-4">
        <!-- Mobile Menu Button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
        >
          <Menu :size="20" />
        </button>

        <!-- Breadcrumbs -->
        <nav class="flex items-center space-x-2 text-sm">
          <template
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="breadcrumb.path"
          >
            <div class="flex items-center space-x-2">
              <!-- Home icon for first breadcrumb -->
              <Home v-if="index === 0" :size="16" class="text-emerald-600" />

              <!-- Breadcrumb Link -->
              <NuxtLink
                v-if="!breadcrumb.isLast"
                :to="breadcrumb.path"
                class="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                {{ breadcrumb.label }}
              </NuxtLink>

              <!-- Current Page (no link) -->
              <span v-else class="text-emerald-900 font-semibold">
                {{ breadcrumb.label }}
              </span>

              <!-- Separator -->
              <ChevronRight
                v-if="!breadcrumb.isLast"
                :size="16"
                class="text-gray-400"
              />
            </div>
          </template>
        </nav>
      </div>

      <!-- Right Side - User Menu -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button
          class="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
        >
          <Bell :size="20" />
          <!-- Notification badge -->
          <span
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            3
          </span>
        </button>

        <!-- User Menu Dropdown -->
        <div class="relative" ref="userMenuRef">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          >
            <!-- User Avatar -->
            <div
              class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
            >
              {{ userInitials }}
            </div>

            <!-- User Info -->
            <div class="hidden md:block text-left">
              <div class="text-sm font-semibold text-gray-900">
                {{ authStore.profile?.nama || "Admin User" }}
              </div>
              <div class="text-xs text-gray-500">
                {{ authStore.profile?.role || "admin" }}
              </div>
            </div>

            <!-- Dropdown Icon -->
            <ChevronDown
              :size="16"
              class="transition-transform duration-200"
              :class="showUserMenu ? 'rotate-180' : ''"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-emerald-200 py-2 z-50"
            @click.stop
          >
            <!-- Profile Link -->
            <NuxtLink
              to="/admin/profile"
              class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              @click="showUserMenu = false"
            >
              <User :size="16" />
              <span>Profil Saya</span>
            </NuxtLink>

            <!-- Settings Link -->
            <NuxtLink
              to="/admin/settings"
              class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              @click="showUserMenu = false"
            >
              <Settings :size="16" />
              <span>Pengaturan</span>
            </NuxtLink>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-2"></div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut :size="16" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  Menu,
  Home,
  ChevronRight,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-vue-next";

interface Breadcrumb {
  label: string;
  path: string;
  isLast: boolean;
}

interface Props {
  sidebarCollapsed: boolean;
  breadcrumbs: Breadcrumb[];
}

defineProps<Props>();
defineEmits<{
  "toggle-sidebar": [];
}>();

// Reactive state
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement>();
const authStore = useAuthStore();

// Computed properties
const userInitials = computed(() => {
  const profile = authStore.profile;
  if (!profile?.nama) return "AD";

  // Extract initials from name or use ID format
  if (profile.id_pengguna) {
    // For ID format like "001-ADN", extract "ADN"
    const parts = profile.id_pengguna.split("-");
    return parts.length > 1 ? parts[1] : profile.nama.charAt(0).toUpperCase();
  }

  // Fallback to name initials
  const names = profile.nama.split(" ");
  return names.length > 1
    ? (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
    : names[0].charAt(0).toUpperCase();
});

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  try {
    await authStore.signOut();
    await navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    showUserMenu.value = false;
  }
};

const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Backdrop blur fallback */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Smooth dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
