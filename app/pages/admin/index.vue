<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p class="text-gray-600 mt-1">
          Selamat datang di sistem Point of Sale SBS
        </p>
      </div>
      <div class="text-sm text-gray-500">
        {{ currentDateTime }}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Pengguna -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats.totalPengguna }}
            </div>
            <div class="text-sm text-gray-600">Total Pengguna</div>
          </div>
          <div
            class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"
          >
            <Users :size="24" class="text-emerald-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <TrendingUp :size="16" class="text-emerald-500 mr-1" />
          <span class="text-emerald-500">+12%</span>
          <span class="text-gray-500 ml-1">dari bulan lalu</span>
        </div>
      </div>

      <!-- Total Pelanggan -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats.totalPelanggan }}
            </div>
            <div class="text-sm text-gray-600">Total Pelanggan</div>
          </div>
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <UserCheck :size="24" class="text-blue-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <TrendingUp :size="16" class="text-emerald-500 mr-1" />
          <span class="text-emerald-500">+8%</span>
          <span class="text-gray-500 ml-1">dari bulan lalu</span>
        </div>
      </div>

      <!-- Total Produk -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats.totalProduk }}
            </div>
            <div class="text-sm text-gray-600">Total Produk</div>
          </div>
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <Package :size="24" class="text-purple-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <TrendingDown :size="16" class="text-red-500 mr-1" />
          <span class="text-red-500">-2%</span>
          <span class="text-gray-500 ml-1">dari bulan lalu</span>
        </div>
      </div>

      <!-- Total Transaksi -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats.totalTransaksi }}
            </div>
            <div class="text-sm text-gray-600">Transaksi Bulan Ini</div>
          </div>
          <div
            class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
          >
            <ShoppingCart :size="24" class="text-orange-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <TrendingUp :size="16" class="text-emerald-500 mr-1" />
          <span class="text-emerald-500">+24%</span>
          <span class="text-gray-500 ml-1">dari bulan lalu</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          to="/admin/pengguna"
          class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
        >
          <div
            class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors"
          >
            <UserPlus :size="20" class="text-emerald-600" />
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">Tambah Pengguna</div>
            <div class="text-xs text-gray-500">Buat akun pengguna baru</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/pelanggan"
          class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div
            class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors"
          >
            <UserPlus :size="20" class="text-blue-600" />
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">
              Tambah Pelanggan
            </div>
            <div class="text-xs text-gray-500">Daftarkan pelanggan baru</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/produk"
          class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
        >
          <div
            class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors"
          >
            <Plus :size="20" class="text-purple-600" />
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">Tambah Produk</div>
            <div class="text-xs text-gray-500">Kelola inventory produk</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/laporan"
          class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
        >
          <div
            class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors"
          >
            <BarChart3 :size="20" class="text-orange-600" />
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">Lihat Laporan</div>
            <div class="text-xs text-gray-500">Analisis penjualan</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Transactions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Transaksi Terbaru</h2>
          <NuxtLink
            to="/admin/transaksi"
            class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Lihat Semua
          </NuxtLink>
        </div>
        <div class="space-y-4">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"
              >
                <ShoppingCart :size="16" class="text-emerald-600" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ transaction.id }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ transaction.customer }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-900">
                {{ formatCurrency(transaction.amount) }}
              </div>
              <div class="text-xs text-gray-500">{{ transaction.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Status Sistem</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Database Connection</span>
            </div>
            <span class="text-sm text-emerald-600 font-medium">Online</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Authentication Service</span>
            </div>
            <span class="text-sm text-emerald-600 font-medium">Active</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Backup Status</span>
            </div>
            <span class="text-sm text-yellow-600 font-medium">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, computed } from "vue";
import {
  Users,
  UserCheck,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Plus,
  BarChart3,
} from "lucide-vue-next";

// Page meta
definePageMeta({
  layout: "admin",
  middleware: ["role"],
  auth: true,
  requiredRole: "admin",
});

// Reactive data
const stats = ref({
  totalPengguna: 0,
  totalPelanggan: 0,
  totalProduk: 0,
  totalTransaksi: 0,
});

const recentTransactions = ref([
  {
    id: "INV-2025-01-001",
    customer: "P001 - Andi Wijaya",
    amount: 150000,
    time: "2 menit lalu",
  },
  {
    id: "INV-2025-01-002",
    customer: "P002 - Sari Dewi",
    amount: 250000,
    time: "15 menit lalu",
  },
  {
    id: "INV-2025-01-003",
    customer: "P003 - Budi Santoso",
    amount: 175000,
    time: "1 jam lalu",
  },
]);

// Computed properties
const currentDateTime = computed(() => {
  return new Date().toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const loadDashboardData = async () => {
  try {
    // Simulate API calls for now
    stats.value = {
      totalPengguna: 24,
      totalPelanggan: 156,
      totalProduk: 342,
      totalTransaksi: 89,
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

// Lifecycle
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
/* Custom animations for cards */
.stats-card {
  transition: transform 0.2s ease, shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Smooth hover effects */
.group:hover .group-hover\:bg-emerald-200 {
  background-color: rgb(167 243 208);
}

.group:hover .group-hover\:bg-blue-200 {
  background-color: rgb(191 219 254);
}

.group:hover .group-hover\:bg-purple-200 {
  background-color: rgb(221 214 254);
}

.group:hover .group-hover\:bg-orange-200 {
  background-color: rgb(254 215 170);
}
</style>
