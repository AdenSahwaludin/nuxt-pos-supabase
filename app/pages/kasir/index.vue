<template>
  <div>
    <!-- Today's Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Transaksi Hari Ini
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ myStats.todayTransactions }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Penjualan
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ formatCurrency(myStats.todayRevenue) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Rata-rata per Transaksi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ formatCurrency(myStats.averageTransaction) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Aksi Cepat
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink
            to="/pos"
            class="block p-6 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:shadow-lg transition-all bg-emerald-50"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 text-lg">
                  Buat Transaksi Baru
                </h4>
                <p class="text-gray-600">Mulai transaksi penjualan baru</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/kasir/history"
            class="block p-6 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-lg transition-all"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 text-lg">
                  Riwayat Transaksi
                </h4>
                <p class="text-gray-600">Lihat transaksi yang telah dibuat</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Transaksi Terbaru
        </h3>
        <div v-if="recentTransactions.length === 0" class="text-center py-8">
          <p class="text-gray-500">Belum ada transaksi hari ini</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID Transaksi
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pelanggan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="trx in recentTransactions" :key="trx.id_transaksi">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ trx.id_transaksi }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ trx.pelanggan?.nama || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(Number(trx.total)) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(trx.status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ getStatusText(trx.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatTime(trx.tanggal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "~/lib/supabaseClient";

definePageMeta({
  layout: "kasir",
  middleware: ["role"],
  role: "kasir",
});

const authStore = useAuthStore();

const myStats = reactive({
  todayTransactions: 0,
  todayRevenue: 0,
  averageTransaction: 0,
});

const recentTransactions = ref([]);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "selesai":
      return "bg-green-100 text-green-800";
    case "menunggu":
      return "bg-yellow-100 text-yellow-800";
    case "dibatalkan":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "selesai":
      return "Selesai";
    case "menunggu":
      return "Menunggu";
    case "dibatalkan":
      return "Dibatalkan";
    default:
      return status;
  }
};

const loadMyStats = async () => {
  try {
    if (!authStore.profile?.id_pengguna) return;

    const today = new Date().toISOString().split("T")[0];

    // Load today's transactions by this cashier
    const { data: todayTrx, count } = await supabase
      .from("transaksi")
      .select("total", { count: "exact" })
      .eq("id_pengguna", authStore.profile.id_pengguna)
      .gte("tanggal", `${today}T00:00:00`)
      .lt("tanggal", `${today}T23:59:59`);

    myStats.todayTransactions = count || 0;
    const totalRevenue =
      todayTrx?.reduce((sum: number, trx: any) => sum + Number(trx.total), 0) ||
      0;
    myStats.todayRevenue = totalRevenue;
    myStats.averageTransaction =
      myStats.todayTransactions > 0
        ? totalRevenue / myStats.todayTransactions
        : 0;
  } catch (error) {
    console.error("Error loading my stats:", error);
  }
};

const loadRecentTransactions = async () => {
  try {
    if (!authStore.profile?.id_pengguna) return;

    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("transaksi")
      .select(
        `
        id_transaksi,
        total,
        status,
        tanggal,
        pelanggan:id_pelanggan (
          nama
        )
      `
      )
      .eq("id_pengguna", authStore.profile.id_pengguna)
      .gte("tanggal", `${today}T00:00:00`)
      .lt("tanggal", `${today}T23:59:59`)
      .order("tanggal", { ascending: false })
      .limit(10);

    recentTransactions.value = data || [];
  } catch (error) {
    console.error("Error loading recent transactions:", error);
  }
};

onMounted(() => {
  loadMyStats();
  loadRecentTransactions();
});
</script>
