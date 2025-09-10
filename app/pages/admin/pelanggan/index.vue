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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              placeholder="Cari berdasarkan nama, email, atau ID..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
            @change="onFilterChange"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>

        <!-- Credit Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Filter Kredit</label
          >
          <select
            v-model="filters.allow_installment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="onFilterChange"
          >
            <option value="">Semua</option>
            <option value="true">Diizinkan</option>
            <option value="false">Tidak Diizinkan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Pelanggan</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ allPelanggan.length }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <Users :size="24" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pelanggan Aktif</p>
            <p class="text-2xl font-bold text-emerald-600">
              {{ stats.aktif }}
            </p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <UserCheck :size="24" class="text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pelanggan Kredit</p>
            <p class="text-2xl font-bold text-purple-600">
              {{ stats.krediterized }}
            </p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <CreditCard :size="24" class="text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Baru Bulan Ini</p>
            <p class="text-2xl font-bold text-orange-600">
              {{ stats.newThisMonth }}
            </p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <TrendingUp :size="24" class="text-orange-600" />
          </div>
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
                @click="sortByColumn('id_pelanggan')"
              >
                <div class="flex items-center space-x-1">
                  <span>ID Pelanggan</span>
                  <component
                    :is="getSortIcon('id_pelanggan')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('nama')"
              >
                <div class="flex items-center space-x-1">
                  <span>Nama</span>
                  <component
                    :is="getSortIcon('nama')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kontak
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('aktif')"
              >
                <div class="flex items-center space-x-1">
                  <span>Status</span>
                  <component
                    :is="getSortIcon('aktif')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('created_at')"
              >
                <div class="flex items-center space-x-1">
                  <span>Tgl Daftar</span>
                  <component
                    :is="getSortIcon('created_at')"
                    :size="14"
                    class="text-gray-400"
                  />
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
                <div class="animate-pulse bg-gray-200 h-4 rounded w-16"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-32"></div>
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
              <!-- ID Pelanggan -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm mr-3"
                  >
                    {{ getPelangganInitials(pelanggan) }}
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ pelanggan?.id_pelanggan || "-" }}
                  </div>
                </div>
              </td>

              <!-- Nama -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ pelanggan?.nama || "-" }}
                </div>
              </td>

              <!-- Kontak -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ pelanggan?.telepon || "-" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ pelanggan?.email || "-" }}
                </div>
              </td>

              <!-- Status -->
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
                    {{ pelanggan?.aktif ? "Aktif" : "Nonaktif" }}
                  </span>
                  <span
                    v-if="pelanggan?.allow_installment"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 w-fit"
                  >
                    Kredit
                  </span>
                </div>
              </td>

              <!-- Tanggal Daftar -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  formatDate(pelanggan?.tanggal_daftar || pelanggan?.created_at)
                }}
              </td>

              <!-- Actions -->
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

    <ConfirmDeleteModal
      v-if="showDeleteModal && pelangganToDelete"
      entityType="Pelanggan"
      :itemName="pelangganToDelete.nama"
      :itemDetails="pelangganToDelete"
      :isLoading="isDeleting"
      @confirm="confirmDeletePelanggan"
      @cancel="cancelDeletePelanggan"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted, watch } from "vue";
import { supabase } from "~~/lib/supabaseClient";
import {
  UserPlus,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
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
const allPelanggan = ref<Pelanggan[]>([]);
const selectedPelanggan = ref<Pelanggan | null>(null);

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const pelangganToDelete = ref<Pelanggan | null>(null);
const isDeleting = ref(false);

// Prevent background scroll when modals open
watch(
  [showCreateModal, showEditModal, showDetailModal, showDeleteModal],
  ([create, edit, detail, deleteModal]) => {
    document.body.style.overflow =
      create || edit || detail || deleteModal ? "hidden" : "";
  }
);

// Filters
const filters = reactive({
  status: "",
  allow_installment: "",
});

// Sorting
const sortBy = ref("created_at");
const sortDirection = ref<"asc" | "desc">("desc");

// Pagination
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0,
  totalPages: 0,
  from: 0,
  to: 0,
});

// Computed properties for filtering and sorting like pengguna
const filteredPelanggan = computed(() => {
  let result = [...allPelanggan.value];

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (pelanggan) =>
        pelanggan.nama?.toLowerCase().includes(query) ||
        pelanggan.email?.toLowerCase().includes(query) ||
        pelanggan.id_pelanggan?.toLowerCase().includes(query) ||
        pelanggan.telepon?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filters.status !== "") {
    const isActive = filters.status === "true";
    result = result.filter((pelanggan) => pelanggan.aktif === isActive);
  }

  // Apply installment filter
  if (filters.allow_installment !== "") {
    const allowInstallment = filters.allow_installment === "true";
    result = result.filter(
      (pelanggan) => pelanggan.allow_installment === allowInstallment
    );
  }

  return result;
});

const pelangganList = computed(() => {
  let result = [...filteredPelanggan.value];

  // Apply sorting
  result.sort((a, b) => {
    const aVal = a[sortBy.value] || "";
    const bVal = b[sortBy.value] || "";

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
    } else {
      comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  // Update pagination totals
  pagination.total = result.length;
  pagination.totalPages = Math.ceil(result.length / pagination.perPage);
  pagination.from = (pagination.currentPage - 1) * pagination.perPage + 1;
  pagination.to = Math.min(
    pagination.currentPage * pagination.perPage,
    result.length
  );

  // Apply pagination
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const end = start + pagination.perPage;
  result = result.slice(start, end);

  // Add index for display
  return result.map((pelanggan, index) => ({
    ...pelanggan,
    idx: start + index + 1,
  }));
});

// Stats computed properties
const stats = computed(() => {
  const total = allPelanggan.value.length;
  const aktif = allPelanggan.value.filter((p) => p.aktif).length;
  const krediterized = allPelanggan.value.filter(
    (p) => p.allow_installment
  ).length;

  // Calculate new this month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newThisMonth = allPelanggan.value.filter((p) => {
    const createdAt = new Date(p.created_at);
    return (
      createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear
    );
  }).length;

  return {
    total,
    aktif,
    krediterized,
    newThisMonth,
  };
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
  console.log("🔄 Loading pelanggan data from database...");

  try {
    // Query pelanggan from database
    console.log("📡 Fetching from pelanggan table...");
    const { data: pelangganData, error } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase query error:", error);
      throw error;
    }

    console.log("📝 Database data received:", pelangganData);

    if (pelangganData && pelangganData.length > 0) {
      // Transform database data to match interface
      const transformedData: Pelanggan[] = pelangganData.map((item: any) => {
        return {
          id: item.id_pelanggan, // Use id_pelanggan as the id
          id_pelanggan: item.id_pelanggan,
          nama: item.nama,
          email: item.email || undefined,
          telepon: item.telepon || undefined,
          kota: item.kota || undefined,
          alamat: item.alamat || undefined,
          aktif: item.aktif,
          tanggal_daftar: item.tanggal_daftar || item.created_at,
          allow_installment: item.allow_installment || false,
          credit_limit: item.credit_limit?.toString() || "0",
          max_tenor_bulan: item.max_tenor_bulan || 0,
          trust_score: item.trust_score?.toString() || "0",
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });

      console.log("✅ Transformed data:", transformedData);
      allPelanggan.value = transformedData;
    } else {
      console.log("📭 No pelanggan data found");
      allPelanggan.value = [];
    }
  } catch (error: any) {
    console.error("❌ Error loading pelanggan:", error);
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.error(
        error.message || "Gagal memuat data pelanggan",
        "Error"
      );
    }
    // Fallback to empty array
    allPelanggan.value = [];
  } finally {
    loading.value = false;
  }
};

// Modal handlers
const viewPelanggan = (pelanggan: Pelanggan) => {
  selectedPelanggan.value = pelanggan;
  showDetailModal.value = true;
};

const editPelanggan = (pelanggan: Pelanggan) => {
  selectedPelanggan.value = pelanggan;
  showEditModal.value = true;
};

const deletePelanggan = (pelanggan: Pelanggan) => {
  pelangganToDelete.value = pelanggan;
  showDeleteModal.value = true;
};

const confirmDeletePelanggan = async () => {
  if (!pelangganToDelete.value) return;

  const pelanggan = pelangganToDelete.value;
  isDeleting.value = true;

  try {
    console.log("🗑️ Deleting pelanggan:", pelanggan.id_pelanggan);

    // Delete from sbs.pelanggan table
    const { error } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .delete()
      .eq("id_pelanggan", pelanggan.id_pelanggan);

    if (error) {
      console.error("❌ Error deleting pelanggan:", error);
      throw new Error(`Gagal hapus pelanggan: ${error.message}`);
    }

    console.log("✅ Pelanggan deleted successfully");

    const toast = useToast();
    toast.success(`Pelanggan "${pelanggan.nama}" berhasil dihapus`);

    // Close modal and reset state
    showDeleteModal.value = false;
    pelangganToDelete.value = null;

    // Reload data to get fresh data from server
    loadPelanggan();
  } catch (error: any) {
    console.error("❌ Error deleting pelanggan:", error);

    const toast = useToast();
    toast.error(
      error.message || "Gagal menghapus pelanggan. Silakan coba lagi."
    );
  } finally {
    isDeleting.value = false;
  }
};

const cancelDeletePelanggan = () => {
  showDeleteModal.value = false;
  pelangganToDelete.value = null;
  isDeleting.value = false;
};

// Handle modal events
const handlePelangganCreated = (newPelanggan: Pelanggan) => {
  // Add new pelanggan to the list
  allPelanggan.value.unshift(newPelanggan);
  showCreateModal.value = false;

  if (typeof window !== "undefined" && (window as any).$toast) {
    (window as any).$toast.success(
      `Pelanggan "${newPelanggan.nama}" berhasil ditambahkan`,
      "Berhasil"
    );
  }

  // Reload data to get fresh data from server
  loadPelanggan();
};

const handlePelangganUpdated = (updatedPelanggan: Pelanggan) => {
  // Update pelanggan in the list
  const index = allPelanggan.value.findIndex(
    (p) => p.id === updatedPelanggan.id
  );
  if (index !== -1) {
    allPelanggan.value[index] = updatedPelanggan;
  }
  showEditModal.value = false;

  if (typeof window !== "undefined" && (window as any).$toast) {
    (window as any).$toast.success(
      `Pelanggan "${updatedPelanggan.nama}" berhasil diperbarui`,
      "Berhasil"
    );
  }

  // Reload data to get fresh data from server
  loadPelanggan();
};

// Sorting function
const sortByColumn = (field: string) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDirection.value = "asc";
  }
  pagination.currentPage = 1; // Reset to first page when sorting
};

// Get sort icon component
const getSortIcon = (field: string) => {
  if (sortBy.value !== field) return ArrowUpDown;
  return sortDirection.value === "asc" ? ArrowUp : ArrowDown;
};

// Filter change handler
const onFilterChange = () => {
  pagination.currentPage = 1; // Reset to first page when filtering
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

// Lifecycle
onMounted(() => {
  // Reset modal states on page load
  showCreateModal.value = false;
  showEditModal.value = false;
  showDetailModal.value = false;
  showDeleteModal.value = false;
  selectedPelanggan.value = null;
  pelangganToDelete.value = null;
  isDeleting.value = false;

  loadPelanggan();
});
</script>

<style>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>

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
