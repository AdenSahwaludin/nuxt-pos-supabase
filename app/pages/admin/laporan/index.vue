<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header with Animation -->
    <div class="mb-8 text-center">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg"
      >
        <svg
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
      </div>
      <h1
        class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent"
      >
        Laporan Penjualan
      </h1>
      <p class="text-gray-600 mt-2 text-lg">
        Analisis dan monitor performa bisnis Anda
      </p>
    </div>

    <!-- Global Filters with Enhanced Design -->
    <div
      class="bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-6 mb-8 backdrop-blur-sm"
    >
      <div class="flex items-center mb-6">
        <div class="p-2 bg-blue-100 rounded-lg mr-3">
          <svg
            class="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h.01a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h.01a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h.01a1 1 0 010 2H4a1 1 0 01-1-1zm4-8a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900">Filter Global</h3>
        <div class="ml-auto">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            {{
              appliedFilters.periode === "today"
                ? "Hari Ini"
                : appliedFilters.periode === "yesterday"
                ? "Kemarin"
                : appliedFilters.periode === "week"
                ? "Minggu Ini"
                : appliedFilters.periode === "month"
                ? "Bulan Ini"
                : "Custom"
            }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
        <!-- Periode -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Periode</label
          >
          <select
            v-model="globalFilters.periode"
            @change="updateDateFromPeriode"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
          >
            <option value="today">🌅 Hari Ini</option>
            <option value="yesterday">🌇 Kemarin</option>
            <option value="week">📅 Minggu Ini</option>
            <option value="month">🗓️ Bulan Ini</option>
            <option value="custom">⚙️ Kustom</option>
          </select>
        </div>

        <!-- Tanggal Mulai -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Tanggal Mulai</label
          >
          <input
            v-model="globalFilters.dateFrom"
            type="date"
            :disabled="globalFilters.periode !== 'custom'"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
          />
        </div>

        <!-- Tanggal Selesai -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Tanggal Selesai</label
          >
          <input
            v-model="globalFilters.dateTo"
            type="date"
            :disabled="globalFilters.periode !== 'custom'"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
          />
        </div>

        <!-- Kasir -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Kasir</label
          >
          <select
            v-model="globalFilters.kasir"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
          >
            <option value="">👥 Semua Kasir</option>
            <option
              v-for="kasir in kasirList"
              :key="kasir.id_pengguna"
              :value="kasir.id_pengguna"
            >
              {{ kasir.nama }}
            </option>
          </select>
        </div>

        <!-- Metode Bayar -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Metode Bayar</label
          >
          <select
            v-model="globalFilters.metodeBayar"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
          >
            <option value="">💳 Semua Metode</option>
            <option value="TUNAI">💵 Tunai</option>
            <option value="QRIS">📱 QRIS</option>
            <option value="VA_BCA">🏛️ VA BCA</option>
            <option value="VA_BNI">🏛️ VA BNI</option>
            <option value="GOPAY">🟢 GoPay</option>
            <option value="OVO">🟣 OVO</option>
          </select>
        </div>

        <!-- Status -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Status</label
          >
          <select
            v-model="globalFilters.status"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
          >
            <option value="">🎯 Semua Status</option>
            <option value="PAID">✅ Paid</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="FAILED">❌ Failed</option>
            <option value="VOID">🚫 Void</option>
          </select>
        </div>
      </div>

      <!-- Filter Actions with Enhanced Styling -->
      <div
        class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200"
      >
        <div class="flex gap-3">
          <button
            @click="resetFilters"
            class="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
          >
            🔄 Reset Filter
          </button>
          <button
            @click="applyFilters"
            class="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
          >
            ✨ Terapkan Filter
          </button>
        </div>

        <div class="flex gap-3">
          <button
            @click="exportPDF"
            class="px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
          >
            📄 Ekspor PDF
          </button>
          <button
            @click="exportExcel"
            class="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
          >
            📊 Ekspor Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Report Tabs with Modern Design -->
    <div
      class="bg-white/90 rounded-2xl shadow-2xl border border-gray-200 backdrop-blur-sm overflow-hidden"
    >
      <!-- Tab Navigation with Gradient -->
      <div
        class="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200"
      >
        <nav class="flex overflow-x-auto px-6 py-2" aria-label="Tabs">
          <button
            v-for="tab in reportTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'whitespace-nowrap py-4 px-6 border-b-4 font-semibold text-sm transition-all duration-300 relative group',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-white/50',
            ]"
          >
            {{ tab.name }}
            <!-- Active indicator -->
            <div
              v-if="activeTab === tab.id"
              class="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            ></div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Ringkasan Penjualan (Dashboard) -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <RingkasanPenjualan
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Tren Penjualan -->
        <div v-else-if="activeTab === 'trend'" class="space-y-6">
          <TrenPenjualan
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Penjualan per Kategori -->
        <div v-else-if="activeTab === 'category'" class="space-y-6">
          <PenjualanKategori
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Penjualan per Produk -->
        <div v-else-if="activeTab === 'product'" class="space-y-6">
          <PenjualanProduk
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Waktu Ramai -->
        <div v-else-if="activeTab === 'peak'" class="space-y-6">
          <WaktuRamai :filters="appliedFilters" @drilldown="handleDrilldown" />
        </div>

        <!-- Metode Pembayaran -->
        <div v-else-if="activeTab === 'payment'" class="space-y-6">
          <MetodePembayaran
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Transaksi Bermasalah -->
        <div v-else-if="activeTab === 'problem'" class="space-y-6">
          <TransaksiBermasalah
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Fast vs Slow Moving -->
        <div v-else-if="activeTab === 'moving'" class="space-y-6">
          <FastSlowMoving
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Nilai Stok -->
        <div v-else-if="activeTab === 'stock'" class="space-y-6">
          <NilaiStok :filters="appliedFilters" @drilldown="handleDrilldown" />
        </div>

        <!-- Margin -->
        <div v-else-if="activeTab === 'margin'" class="space-y-6">
          <MarginAnalysis
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Penjualan per Pelanggan -->
        <div v-else-if="activeTab === 'customer'" class="space-y-6">
          <PenjualanPelanggan
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Performa Kasir -->
        <div v-else-if="activeTab === 'cashier'" class="space-y-6">
          <PerformaKasir
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Monitoring Pajak -->
        <div v-else-if="activeTab === 'tax'" class="space-y-6">
          <MonitoringPajak
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Rekonsiliasi -->
        <div v-else-if="activeTab === 'reconcile'" class="space-y-6">
          <RekonsiliasiBayar
            :filters="appliedFilters"
            @drilldown="handleDrilldown"
          />
        </div>

        <!-- Default/Loading State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-500">
            <svg
              class="w-12 h-12 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p>Pilih laporan dari tab di atas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-2 text-gray-600">Memuat laporan...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSupabase } from "~~/composables/useSupabase";
import { useToast } from "~~/composables/useToast";

// Types
interface GlobalFilters {
  periode: string;
  dateFrom: string;
  dateTo: string;
  kasir: string;
  metodeBayar: string;
  status: string;
}

interface Kasir {
  id_pengguna: string;
  nama: string;
}

// Reactive data
const loading = ref(false);
const activeTab = ref("dashboard");
const kasirList = ref<Kasir[]>([]);

// Filters
const globalFilters = ref<GlobalFilters>({
  periode: "today",
  dateFrom: "",
  dateTo: "",
  kasir: "",
  metodeBayar: "",
  status: "",
});

const appliedFilters = ref<GlobalFilters>({
  periode: "today",
  dateFrom: "",
  dateTo: "",
  kasir: "",
  metodeBayar: "",
  status: "",
});

// Report tabs configuration
const reportTabs = [
  { id: "dashboard", name: "Ringkasan Penjualan" },
  { id: "trend", name: "Tren Penjualan" },
  { id: "category", name: "Per Kategori" },
  { id: "product", name: "Per Produk" },
  { id: "peak", name: "Waktu Ramai" },
  { id: "payment", name: "Metode Bayar" },
  { id: "problem", name: "Transaksi Bermasalah" },
  { id: "moving", name: "Fast/Slow Moving" },
  { id: "stock", name: "Nilai Stok" },
  { id: "margin", name: "Margin" },
  { id: "customer", name: "Per Pelanggan" },
  { id: "cashier", name: "Performa Kasir" },
  { id: "tax", name: "Monitoring Pajak" },
  { id: "reconcile", name: "Rekonsiliasi" },
];

// Computed
const today = computed(() => {
  const date = new Date();
  return date.toISOString().split("T")[0];
});

// Methods
const fetchKasirList = async () => {
  try {
    const supabase = useSupabase();
    const { data, error } = await supabase
      .from("sbs.pengguna")
      .select("id_pengguna, nama")
      .eq("role", "kasir")
      .order("nama");

    if (error) throw error;
    kasirList.value = data || [];
  } catch (error) {
    console.error("Error fetching kasir list:", error);
    const toast = useToast();
    toast.error("Gagal memuat daftar kasir");
  }
};

const updateDateFromPeriode = () => {
  const now = new Date();
  const todayStr = now.toISOString().substring(0, 10);

  switch (globalFilters.value.periode) {
    case "today":
      globalFilters.value.dateFrom = todayStr;
      globalFilters.value.dateTo = todayStr;
      break;
    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().substring(0, 10);
      globalFilters.value.dateFrom = yesterdayStr;
      globalFilters.value.dateTo = yesterdayStr;
      break;
    case "week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      globalFilters.value.dateFrom = startOfWeek.toISOString().substring(0, 10);
      globalFilters.value.dateTo = todayStr;
      break;
    case "month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      globalFilters.value.dateFrom = startOfMonth
        .toISOString()
        .substring(0, 10);
      globalFilters.value.dateTo = todayStr;
      break;
    case "custom":
      // Keep current values
      break;
  }
};

const applyFilters = () => {
  appliedFilters.value = { ...globalFilters.value };
  const toast = useToast();
  toast.success("Filter berhasil diterapkan");
};

const resetFilters = () => {
  const todayStr = new Date().toISOString().substring(0, 10);
  globalFilters.value = {
    periode: "today",
    dateFrom: todayStr,
    dateTo: todayStr,
    kasir: "",
    metodeBayar: "",
    status: "",
  };
  updateDateFromPeriode();
  applyFilters();
};

const handleDrilldown = (filters: any) => {
  // Navigate to transaction list with applied filters
  const query = new URLSearchParams();

  // Merge current filters with drilldown filters
  const mergedFilters = { ...appliedFilters.value, ...filters };

  Object.entries(mergedFilters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value.toString());
    }
  });

  navigateTo(`/admin/transaksi?${query.toString()}`);
};

const exportPDF = async () => {
  const toast = useToast();
  toast.info("Fitur ekspor PDF akan segera tersedia");
  // TODO: Implement PDF export
};

const exportExcel = async () => {
  const toast = useToast();
  toast.info("Fitur ekspor Excel akan segera tersedia");
  // TODO: Implement Excel export
};

// Lifecycle
onMounted(() => {
  updateDateFromPeriode();
  applyFilters();
  fetchKasirList();
});

// Page meta
definePageMeta({
  middleware: "role",
  requiredRole: "admin",
});
</script>
