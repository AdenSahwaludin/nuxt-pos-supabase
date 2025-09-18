<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Daftar Transaksi</h1>
      <p class="text-gray-600 mt-1">Kelola dan pantau semua transaksi</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
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
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Transaksi</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ summary.totalTransaksi }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600"
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
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Omzet</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(summary.totalOmzet) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Rata-rata Transaksi</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(summary.rataRata) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">
              Transaksi Bermasalah
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ summary.transaksiPending }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Pencarian -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Pencarian</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="ID transaksi, nama pelanggan..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Filter Tanggal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Periode</label
          >
          <select
            v-model="filters.periode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua</option>
            <option value="today">Hari Ini</option>
            <option value="yesterday">Kemarin</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="VOID">Void</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <!-- Metode Bayar -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Metode Bayar</label
          >
          <select
            v-model="filters.metodeBayar"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Metode</option>
            <option value="TUNAI">Tunai</option>
            <option value="QRIS">QRIS</option>
            <option value="VA_BCA">VA BCA</option>
            <option value="VA_BNI">VA BNI</option>
            <option value="GOPAY">GoPay</option>
            <option value="OVO">OVO</option>
          </select>
        </div>

        <!-- Aksi Filter -->
        <div class="flex items-end gap-2">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            @click="exportData"
            class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Ekspor
          </button>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div
        v-if="filters.periode === 'custom'"
        class="grid grid-cols-2 gap-4 mt-4"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Dari Tanggal</label
          >
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Sampai Tanggal</label
          >
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Tabel Transaksi -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nomor Transaksi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pelanggan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kasir
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Metode Bayar
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="transaksi in transaksiList"
              :key="transaksi.nomor_transaksi"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ transaksi.nomor_transaksi }}
                </div>
                <div
                  v-if="transaksi.is_locked"
                  class="text-xs text-orange-600 flex items-center"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Locked
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(transaksi.tanggal) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(transaksi.tanggal) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ transaksi.pelanggan?.nama || "-" }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ transaksi.pelanggan?.telepon || "-" }}
                  }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ transaksi.kasir?.nama || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(transaksi.total) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ transaksi.total_item }} item
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getMetodeBayarClass(transaksi.metode_bayar)"
                >
                  {{ transaksi.metode_bayar }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(transaksi.status_pembayaran)"
                >
                  {{ transaksi.status_pembayaran }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
              >
                <button
                  @click="showDetail(transaksi)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Detail
                </button>
                <button
                  @click="printStruk(transaksi)"
                  class="text-green-600 hover:text-green-900"
                >
                  Cetak
                </button>
                <button
                  v-if="transaksi.status_pembayaran === 'PENDING'"
                  @click="refreshStatus(transaksi)"
                  class="text-yellow-600 hover:text-yellow-900"
                >
                  Refresh
                </button>
                <button
                  v-if="canVoid(transaksi)"
                  @click="voidTransaksi(transaksi)"
                  class="text-red-600 hover:text-red-900"
                >
                  Void
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{
                (currentPage - 1) * pageSize + 1
              }}</span>
              to
              <span class="font-medium">{{
                Math.min(currentPage * pageSize, totalRecords)
              }}</span>
              of
              <span class="font-medium">{{ totalRecords }}</span>
              results
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            >
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
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
        <p class="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>

    <!-- Modal Detail (akan dibuat terpisah) -->
    <TransaksiDetailModal
      v-if="showDetailModal"
      :transaksi="selectedTransaksi"
      @close="showDetailModal = false"
      @print="printStruk"
      @void="voidTransaksi"
      @refresh="refreshStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

// Definisikan types sesuai struktur database baru
interface Transaksi {
  nomor_transaksi: string; // Primary key
  tanggal: string;
  total: number;
  total_item: number;
  subtotal: number;
  diskon: number;
  pajak: number;
  biaya_pengiriman: number;
  metode_bayar: string;
  status_pembayaran: string;
  is_locked: boolean;
  paid_at?: string;
  id_pelanggan: string;
  id_kasir: string;
  pelanggan?: {
    nama: string;
    telepon: string;
  };
  kasir?: {
    nama: string;
  };
  midtrans_order_id?: string;
  midtrans_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// Reactive data
const loading = ref(false);
const transaksiList = ref<Transaksi[]>([]);
const selectedTransaksi = ref<Transaksi | null>(null);
const showDetailModal = ref(false);

// Filters
const filters = ref({
  search: "",
  periode: "",
  status: "",
  metodeBayar: "",
  dateFrom: "",
  dateTo: "",
});

// Pagination
const currentPage = ref(1);
const pageSize = ref(20);
const totalRecords = ref(0);

// Summary
const summary = ref({
  totalTransaksi: 0,
  totalOmzet: 0,
  rataRata: 0,
  transaksiPending: 0,
});

// Computed
const totalPages = computed(() =>
  Math.ceil(totalRecords.value / pageSize.value)
);

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const fetchTransaksi = async () => {
  loading.value = true;
  try {
    const supabase = useSupabase();

    let query = supabase.from("transaksi").select(`
        *,
        pelanggan:id_pelanggan(nama, telepon),
        kasir:id_kasir(nama)
      `);

    // Apply filters
    if (filters.value.search) {
      query = query.or(
        `nomor_transaksi.ilike.%${filters.value.search}%`
      );
    }

    if (filters.value.status) {
      query = query.eq("status_pembayaran", filters.value.status);
    }

    if (filters.value.metodeBayar) {
      query = query.eq("metode_bayar", filters.value.metodeBayar);
    }

    // Apply date filters
    if (filters.value.periode) {
      const now = new Date();
      let startDate: Date;

      switch (filters.value.periode) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          query = query.gte("tanggal_transaksi", startDate.toISOString());
          break;
        case "yesterday":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
          );
          const endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          query = query
            .gte("tanggal_transaksi", startDate.toISOString())
            .lt("tanggal_transaksi", endDate.toISOString());
          break;
        case "week":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 7
          );
          query = query.gte("tanggal_transaksi", startDate.toISOString());
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          query = query.gte("tanggal_transaksi", startDate.toISOString());
          break;
        case "custom":
          if (filters.value.dateFrom) {
            query = query.gte("tanggal_transaksi", filters.value.dateFrom);
          }
          if (filters.value.dateTo) {
            query = query.lte(
              "tanggal_transaksi",
              filters.value.dateTo + "T23:59:59"
            );
          }
          break;
      }
    }

    // Pagination
    const from = (currentPage.value - 1) * pageSize.value;
    const to = from + pageSize.value - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order("tanggal", { ascending: false });

    if (error) throw error;

    transaksiList.value = data || [];
    totalRecords.value = count || 0;

    // Fetch summary
    await fetchSummary();
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    // Use toast from useToast composable
    const { $toast } = useNuxtApp();
    $toast.error("Gagal memuat data transaksi");
  } finally {
    loading.value = false;
  }
};

const fetchSummary = async () => {
  try {
    const supabase = useSupabase();

    // Get filtered summary
    let query = supabase
      .from("transaksi")
      .select("total_bayar, status_pembayaran");

    // Apply same filters as main query
    if (filters.value.status) {
      query = query.eq("status_pembayaran", filters.value.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data) {
      summary.value.totalTransaksi = data.length;
      summary.value.totalOmzet = data.reduce(
        (sum, t) => sum + Number(t.total_bayar),
        0
      );
      summary.value.rataRata =
        summary.value.totalTransaksi > 0
          ? summary.value.totalOmzet / summary.value.totalTransaksi
          : 0;
      summary.value.transaksiPending = data.filter(
        (t) => t.status_pembayaran === "PENDING"
      ).length;
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
};

// Event handlers
const showDetail = (transaksi: Transaksi) => {
  selectedTransaksi.value = transaksi;
  showDetailModal.value = true;
};

const printStruk = async (transaksi: Transaksi) => {
  try {
    console.log("Print struk:", transaksi.nomor_transaksi);

    // Sementara gunakan window print sederhana
    const printContent = `
      <div style="font-family: monospace; font-size: 12px; line-height: 1.4;">
        <div style="text-align: center; font-weight: bold;">CAP DAUN KAYU PUTIH</div>
        <div style="text-align: center;">================================</div>
        <div>No. Transaksi: ${transaksi.nomor_transaksi}</div>
        <div>Tanggal: ${formatDateTime(transaksi.tanggal_transaksi)}</div>
        <div>Kasir: ${transaksi.kasir?.nama || "-"}</div>
        <div>Pelanggan: ${
          transaksi.pelanggan?.nama || transaksi.nama_pelanggan_manual || "-"
        }</div>
        <div style="text-align: center;">================================</div>
        <div>Total Item: ${transaksi.total_item}</div>
        <div style="text-align: center;">================================</div>
        <div style="font-weight: bold;">TOTAL: ${formatCurrency(
          transaksi.total_bayar
        )}</div>
        <div>Pembayaran: ${transaksi.metode_bayar}</div>
        <div style="text-align: center;">================================</div>
        <div style="text-align: center;">TERIMA KASIH</div>
      </div>
    `;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Struk ${transaksi.nomor_transaksi}</title></head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    }

    const toast = useToast();
    toast.success("Struk berhasil dicetak");
  } catch (error) {
    console.error("Error printing struk:", error);
    const toast = useToast();
    toast.error("Gagal mencetak struk");
  }
};

const refreshStatus = async (transaksi: Transaksi) => {
  // TODO: Implement Midtrans status check
  console.log("Refresh status:", transaksi.nomor_transaksi);
  useToast().info("Status pembayaran di-refresh");
};

const voidTransaksi = (transaksi: Transaksi) => {
  // TODO: Implement void functionality
  console.log("Void transaksi:", transaksi.nomor_transaksi);
  useToast().info("Fitur void transaksi akan segera tersedia");
};

const canVoid = (transaksi: Transaksi): boolean => {
  return transaksi.status_pembayaran === "PAID" && !transaksi.is_locked;
};

const resetFilters = () => {
  filters.value = {
    search: "",
    periode: "",
    status: "",
    metodeBayar: "",
    dateFrom: "",
    dateTo: "",
  };
  currentPage.value = 1;
};

const exportData = () => {
  // TODO: Implement export functionality
  useToast().info("Fitur ekspor akan segera tersedia");
};

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

// Utility methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID");
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status: string): string => {
  const classes = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
    VOID: "bg-gray-100 text-gray-800",
    REFUNDED: "bg-purple-100 text-purple-800",
  };
  return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

const getMetodeBayarClass = (metode: string): string => {
  const classes = {
    TUNAI: "bg-blue-100 text-blue-800",
    QRIS: "bg-green-100 text-green-800",
    VA_BCA: "bg-blue-100 text-blue-800",
    VA_BNI: "bg-orange-100 text-orange-800",
    GOPAY: "bg-green-100 text-green-800",
    OVO: "bg-purple-100 text-purple-800",
  };
  return classes[metode as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

// Watchers
watch(
  [filters, currentPage],
  () => {
    fetchTransaksi();
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  fetchTransaksi();
});

// Page meta
definePageMeta({
  middleware: "role",
  requiredRole: "admin",
});
</script>
