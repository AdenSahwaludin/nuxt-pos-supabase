<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Pelanggan</h1>
        <p class="text-gray-600 mt-1">
          Kelola data pelanggan sistem Point of Sale
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
      >
        <UserPlus :size="20" />
        <span>Tambah Pelanggan</span>
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cari Pelanggan</label
          >
          <div class="relative">
            <Search
              :size="20"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan nama, email, atau telepon..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Filter Status</label
          >
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="loadPelanggan"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non-Aktif</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Daftar Pelanggan</h2>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span
              >{{ pagination.from }}-{{ pagination.to }} dari
              {{ pagination.total }}</span
            >
            <select
              v-model="pagination.perPage"
              class="px-3 py-1 border border-gray-300 rounded text-sm"
              @change="loadPelanggan"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('nama')"
              >
                <div class="flex items-center space-x-1">
                  <span>Nama</span>
                  <ArrowUpDown :size="14" />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kontak
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lokasi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('tanggal_daftar')"
              >
                <div class="flex items-center space-x-1">
                  <span>Tgl Daftar</span>
                  <ArrowUpDown :size="14" />
                </div>
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading Skeleton -->
            <tr v-if="loading" v-for="i in 5" :key="i">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-32"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-6 rounded w-16"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                  <div class="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                  <div class="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-else-if="pelangganList.length > 0"
              v-for="pelanggan in pelangganList.filter((p) => p && p.id)"
              :key="pelanggan?.id || Math.random()"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm mr-3"
                  >
                    {{ getPelangganInitials(pelanggan) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ pelanggan?.nama || "-" }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ pelanggan?.id_pelanggan || "-" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ pelanggan?.telepon || "-" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ pelanggan?.email || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ pelanggan?.kota || "-" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ pelanggan?.alamat || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit"
                    :class="
                      pelanggan?.aktif
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ pelanggan?.aktif ? "Aktif" : "Non-Aktif" }}
                  </span>
                  <span
                    v-if="pelanggan?.allow_installment"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 w-fit"
                  >
                    Kredit
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  formatDate(pelanggan?.tanggal_daftar || pelanggan?.created_at)
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewPelanggan(pelanggan)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye :size="16" />
                  </button>
                  <button
                    @click="editPelanggan(pelanggan)"
                    class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit :size="16" />
                  </button>
                  <button
                    @click="deletePelanggan(pelanggan)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else>
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <UserCheck :size="32" class="text-gray-400" />
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pelanggan
                  </h3>
                  <p class="text-gray-500 mb-4">
                    Belum ada data pelanggan yang sesuai dengan filter.
                  </p>
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <UserPlus :size="16" class="mr-2" />
                    Tambah Pelanggan Pertama
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pelangganList.length > 0"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Menampilkan {{ pagination.from }} - {{ pagination.to }} dari
            {{ pagination.total }} pelanggan
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft :size="16" />
            </button>

            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                class="px-3 py-2 border rounded-lg text-sm"
                :class="
                  page === pagination.currentPage
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-300 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-gray-500">...</span>
            </template>

            <button
              @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.totalPages"
              class="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PelangganCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePelangganCreated"
    />

    <PelangganEditModal
      v-if="showEditModal && selectedPelanggan"
      :pelanggan="selectedPelanggan"
      @close="showEditModal = false"
      @updated="handlePelangganUpdated"
    />

    <PelangganDetailModal
      v-if="showDetailModal && selectedPelanggan"
      :pelanggan="selectedPelanggan"
      @close="showDetailModal = false"
      @edit="editPelanggan"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted, watch } from "vue";
import {
  UserPlus,
  Search,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

// Page meta
definePageMeta({
  layout: "admin",
  middleware: ["role"],
  auth: true,
  requiredRole: "admin",
});

// Types
interface Pelanggan {
  idx?: number;
  id: string;
  id_pelanggan: string;
  nama: string;
  email?: string;
  telepon?: string;
  kota?: string;
  alamat?: string;
  aktif: boolean;
  tanggal_daftar: string;
  allow_installment?: boolean;
  credit_limit?: string;
  max_tenor_bulan?: number;
  trust_score?: string;
  created_at: string;
  updated_at: string;
}

// Reactive state
const loading = ref(false);
const searchQuery = ref("");
const pelangganList = ref<Pelanggan[]>([]);
const selectedPelanggan = ref<Pelanggan | null>(null);

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);

// Filters
const filters = reactive({
  status: "",
});

// Pagination
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0,
  totalPages: 0,
  from: 0,
  to: 0,
});

// Sorting
const sorting = reactive({
  field: "tanggal_daftar",
  direction: "desc",
});

// Computed properties
const visiblePages = computed(() => {
  const pages = [];
  const totalPages = pagination.totalPages;
  const current = pagination.currentPage;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (current >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
});

// Methods
const loadPelanggan = async () => {
  loading.value = true;
  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // Mock data for now
    pelangganList.value = [
      {
        id: "1",
        id_pelanggan: "P001",
        nama: "Andi Wijaya",
        email: "andi.wijaya@gmail.com",
        telepon: "081234567890",
        kota: "Jakarta",
        alamat: "Jl. Sudirman No. 123, Jakarta",
        aktif: true,
        tanggal_daftar: "2025-01-01T00:00:00Z",
        allow_installment: true,
        credit_limit: "5000000",
        max_tenor_bulan: 12,
        trust_score: "A",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "2",
        id_pelanggan: "P002",
        nama: "Sari Dewi",
        email: "sari.dewi@gmail.com",
        telepon: "081234567891",
        kota: "Bandung",
        alamat: "Jl. Gatot Subroto No. 456, Bandung",
        aktif: false,
        tanggal_daftar: "2025-01-02T00:00:00Z",
        allow_installment: false,
        credit_limit: "2000000",
        max_tenor_bulan: 6,
        trust_score: "B",
        created_at: "2025-01-02T00:00:00Z",
        updated_at: "2025-01-02T00:00:00Z",
      },
    ];

    pagination.total = pelangganList.value.length;
    pagination.totalPages = Math.ceil(pagination.total / pagination.perPage);
    pagination.from = Math.min(
      (pagination.currentPage - 1) * pagination.perPage + 1,
      pagination.total
    );
    pagination.to = Math.min(
      pagination.currentPage * pagination.perPage,
      pagination.total
    );
  } catch (error) {
    console.error("Error loading pelanggan:", error);
    window.$toast?.error("Gagal memuat data pelanggan");
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = useDebounceFn(() => {
  pagination.currentPage = 1;
  loadPelanggan();
}, 300);

const sortBy = (field: string) => {
  if (sorting.field === field) {
    sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
  } else {
    sorting.field = field;
    sorting.direction = "asc";
  }
  loadPelanggan();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.currentPage = page;
    loadPelanggan();
  }
};

const getPelangganInitials = (pelanggan: Pelanggan) => {
  if (!pelanggan) return "?";

  // Extract number from ID like P001 -> 001
  if (pelanggan.id_pelanggan?.startsWith("P")) {
    return pelanggan.id_pelanggan.substring(1);
  }

  if (!pelanggan.nama) return "?";

  const names = pelanggan.nama.split(" ");
  return names.length > 1
    ? (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
    : names[0].charAt(0).toUpperCase();
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

const viewPelanggan = (pelanggan: Pelanggan) => {
  selectedPelanggan.value = pelanggan;
  showDetailModal.value = true;
};

const editPelanggan = (pelanggan: Pelanggan) => {
  selectedPelanggan.value = pelanggan;
  showEditModal.value = true;
  showDetailModal.value = false;
};

const deletePelanggan = async (pelanggan: Pelanggan) => {
  if (
    confirm(`Apakah Anda yakin ingin menghapus pelanggan "${pelanggan.nama}"?`)
  ) {
    try {
      // TODO: Implement delete API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove from list
      const index = pelangganList.value.findIndex((p) => p.id === pelanggan.id);
      if (index !== -1) {
        pelangganList.value.splice(index, 1);
      }

      window.$toast?.success("Pelanggan berhasil dihapus");
      loadPelanggan(); // Reload to update pagination
    } catch (error) {
      console.error("Error deleting pelanggan:", error);
      window.$toast?.error("Gagal menghapus pelanggan");
    }
  }
};

const handlePelangganCreated = (newPelanggan: Pelanggan) => {
  showCreateModal.value = false;
  window.$toast?.success("Pelanggan berhasil dibuat");
  loadPelanggan();
};

const handlePelangganUpdated = (updatedPelanggan: Pelanggan) => {
  showEditModal.value = false;
  selectedPelanggan.value = null;
  window.$toast?.success("Pelanggan berhasil diperbarui");
  loadPelanggan();
};

// Lifecycle
onMounted(() => {
  loadPelanggan();
});

// Watch for search changes
watch(searchQuery, () => {
  debouncedSearch();
});
</script>

<style scoped>
/* Table hover effects */
tbody tr:hover {
  background-color: rgb(249 250 251);
}

/* Loading skeleton animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
