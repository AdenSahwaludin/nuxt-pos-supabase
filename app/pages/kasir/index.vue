<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <div
        class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">
              Selamat Datang, {{ authStore.profile?.nama || "Kasir" }}!
            </h1>
            <p class="text-emerald-100 mt-1">
              {{ getCurrentGreeting() }} - {{ getCurrentDate() }}
            </p>
          </div>
          <div class="hidden md:block">
            <div class="bg-white/20 rounded-lg p-4">
              <CalculatorIcon class="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <NuxtLink
        to="/kasir/pos"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-emerald-500"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-emerald-100">
            <CalculatorIcon class="h-6 w-6 text-emerald-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Mulai Transaksi</h3>
            <p class="text-gray-500 text-sm">Buka POS untuk transaksi baru</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/kasir/pelanggan"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <UsersIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Data Pelanggan</h3>
            <p class="text-gray-500 text-sm">Kelola data pelanggan</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/kasir/transaksi"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-purple-500"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <DocumentTextIcon class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Riwayat Transaksi
            </h3>
            <p class="text-gray-500 text-sm">Lihat transaksi terdahulu</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/kasir/produk"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-orange-500"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100">
            <CubeIcon class="h-6 w-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Katalog Produk</h3>
            <p class="text-gray-500 text-sm">Jelajahi produk tersedia</p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Today's Summary -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Ringkasan Hari Ini</h3>
          <p class="text-sm text-gray-500">{{ getCurrentDate() }}</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-emerald-600">
                {{ todayStats.totalTransaksi }}
              </div>
              <div class="text-sm text-gray-500">Total Transaksi</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-emerald-600">
                {{ formatCurrency(todayStats.totalPenjualan) }}
              </div>
              <div class="text-sm text-gray-500">Total Penjualan</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Aktivitas Terbaru</h3>
        </div>
        <div class="p-6">
          <div v-if="recentActivities.length === 0" class="text-center py-8">
            <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">
              Belum ada aktivitas hari ini
            </p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="activity in recentActivities.slice(0, 5)"
              :key="activity.id"
              class="flex items-center space-x-3"
            >
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center"
                >
                  <CheckIcon class="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ activity.description }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatTime(activity.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from "vue";
import {
  CalculatorIcon,
  UsersIcon,
  DocumentTextIcon,
  CubeIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
  middleware: "role",
  role: "kasir",
});

// Store
const authStore = useAuthStore();

// Reactive data
const todayStats = ref({
  totalTransaksi: 0,
  totalPenjualan: 0,
});

const recentActivities = ref<any[]>([]);

// Methods
const getCurrentGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const loadTodayStats = async () => {
  try {
    const { $supabase } = useNuxtApp();
    const today = new Date().toISOString().split("T")[0];

    // Get today's transactions
    const { data: transaksi, error } = await $supabase
      .from("transaksi")
      .select("total_harga")
      .gte("created_at", `${today}T00:00:00.000Z`)
      .lt("created_at", `${today}T23:59:59.999Z`);

    if (!error && transaksi) {
      todayStats.value.totalTransaksi = transaksi.length;
      todayStats.value.totalPenjualan = transaksi.reduce(
        (sum: number, t: any) => sum + (t.total_harga || 0),
        0
      );
    }
  } catch (error) {
    console.error("Error loading today stats:", error);
  }
};

const loadRecentActivities = async () => {
  try {
    const { $supabase } = useNuxtApp();
    const today = new Date().toISOString().split("T")[0];

    // Get recent transactions as activities
    const { data: transaksi, error } = await $supabase
      .from("transaksi")
      .select(
        `
        id_transaksi,
        total_harga,
        created_at,
        pelanggan:id_pelanggan(nama)
      `
      )
      .gte("created_at", `${today}T00:00:00.000Z`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && transaksi) {
      recentActivities.value = transaksi.map((t: any) => ({
        id: t.id_transaksi,
        description: `Transaksi ${formatCurrency(t.total_harga || 0)} ${
          t.pelanggan?.nama ? `- ${t.pelanggan.nama}` : ""
        }`,
        created_at: t.created_at,
      }));
    }
  } catch (error) {
    console.error("Error loading recent activities:", error);
  }
};

const logout = async () => {
  await authStore.signOut();
};

// Lifecycle
onMounted(() => {
  loadTodayStats();
  loadRecentActivities();
});
</script>
