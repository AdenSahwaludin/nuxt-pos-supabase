<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <p class="text-gray-600 mt-1">
          Kelola data pengguna sistem Point of Sale
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
      >
        <UserPlus :size="20" />
        <span>Tambah Pengguna</span>
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cari Pengguna</label
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
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Role Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Filter Role</label
          >
          <select
            v-model="filters.role"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="onFilterChange"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
          </select>
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
          <h2 class="text-lg font-semibold text-gray-900">Daftar Pengguna</h2>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span
              >{{ pagination.from }}-{{ pagination.to }} dari
              {{ pagination.total }}</span
            >
            <select
              v-model="pagination.perPage"
              class="px-3 py-1 border border-gray-300 rounded text-sm"
              @change="onPerPageChange"
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
                :class="
                  sorting.field === 'nama' ? 'bg-gray-100 text-gray-700' : ''
                "
                @click="sortBy('nama')"
              >
                <div class="flex items-center space-x-1">
                  <span>Nama</span>
                  <component :is="getSortIcon('nama')" :size="14" />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                :class="
                  sorting.field === 'email' ? 'bg-gray-100 text-gray-700' : ''
                "
                @click="sortBy('email')"
              >
                <div class="flex items-center space-x-1">
                  <span>Email</span>
                  <component :is="getSortIcon('email')" :size="14" />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                :class="
                  sorting.field === 'created_at'
                    ? 'bg-gray-100 text-gray-700'
                    : ''
                "
                @click="sortBy('created_at')"
              >
                <div class="flex items-center space-x-1">
                  <span>Dibuat</span>
                  <component :is="getSortIcon('created_at')" :size="14" />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Terakhir Login
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
                <div class="animate-pulse bg-gray-200 h-6 rounded w-16"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-6 rounded w-16"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
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
              v-else-if="penggunaList.length > 0"
              v-for="pengguna in penggunaList.filter((p) => p && p.id)"
              :key="pengguna?.id || Math.random()"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-semibold text-sm mr-3"
                  >
                    {{ getPenggunaInitials(pengguna) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ pengguna?.nama || "-" }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ pengguna?.id_pengguna || "-" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ pengguna?.email || "-" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ pengguna?.telepon || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    pengguna?.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  "
                >
                  {{ pengguna?.role || "unknown" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    pengguna?.status === 'aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ pengguna?.status || "unknown" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(pengguna?.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="pengguna?.terakhir_login">
                  {{ formatDate(pengguna.terakhir_login) }}
                </div>
                <div v-else class="text-gray-400 italic">
                  Belum pernah login
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewPengguna(pengguna)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye :size="16" />
                  </button>
                  <button
                    @click="editPengguna(pengguna)"
                    class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit :size="16" />
                  </button>
                  <button
                    @click="deletePengguna(pengguna)"
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
                    <Users :size="32" class="text-gray-400" />
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pengguna
                  </h3>
                  <p class="text-gray-500 mb-4">
                    Belum ada data pengguna yang sesuai dengan filter.
                  </p>
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <UserPlus :size="16" class="mr-2" />
                    Tambah Pengguna Pertama
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="penggunaList.length > 0"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Menampilkan {{ pagination.from }} - {{ pagination.to }} dari
            {{ pagination.total }} pengguna
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
                @click="changePage(page as number)"
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
    <PenggunaCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePenggunaCreated"
    />

    <PenggunaEditModal
      v-if="showEditModal && selectedPengguna"
      :pengguna="selectedPengguna"
      @close="showEditModal = false"
      @updated="handlePenggunaUpdated"
    />

    <PenggunaDetailModal
      v-if="showDetailModal && selectedPengguna"
      :pengguna="selectedPengguna"
      @close="showDetailModal = false"
      @edit="editPengguna"
    />

    <ConfirmDeleteModal
      v-if="showDeleteModal && pendingDeletePengguna"
      :item-name="pendingDeletePengguna.nama"
      :item-details="pendingDeletePengguna"
      :loading="deleteLoading"
      @confirm="confirmDeletePengguna"
      @cancel="cancelDeletePengguna"
    />
  </div>
</template>

<script setup lang="ts">
import { supabase } from "~~/lib/supabaseClient";
// @ts-nocheck
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
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { watch } from "vue";

// Import supabase composable - auto-imported by Nuxt

// Page meta
definePageMeta({
  layout: "admin",
  middleware: "role",
  auth: true,
  requiredRole: "admin",
});

// Types
interface Pengguna {
  id: string;
  id_pengguna: string;
  nama: string;
  email: string;
  telepon?: string;
  role: "admin" | "kasir";
  status: "aktif" | "nonaktif";
  created_at: string;
  updated_at: string;
  terakhir_login?: string;
}

// Reactive state
const loading = ref(false);
const searchQuery = ref("");
const allPengguna = ref<Pengguna[]>([]); // Raw data from database
const selectedPengguna = ref<Pengguna | null>(null);
const authStore = useAuthStore();

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const pendingDeletePengguna = ref<Pengguna | null>(null);
const deleteLoading = ref(false);

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
  role: "",
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
  field: "created_at",
  direction: "desc",
});

// Computed properties
const filteredPengguna = computed(() => {
  let filtered = [...allPengguna.value];

  // Apply role filter
  if (filters.role) {
    filtered = filtered.filter((pengguna) => pengguna.role === filters.role);
  }

  // Apply status filter
  if (filters.status) {
    filtered = filtered.filter(
      (pengguna) => pengguna.status === filters.status
    );
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (pengguna) =>
        pengguna.nama?.toLowerCase().includes(query) ||
        pengguna.email?.toLowerCase().includes(query) ||
        pengguna.id_pengguna?.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (sorting.field) {
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Get values for comparison based on field
      switch (sorting.field) {
        case "nama":
          aValue = a.nama?.toLowerCase() || "";
          bValue = b.nama?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "created_at":
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        case "id_pengguna":
          aValue = a.id_pengguna?.toLowerCase() || "";
          bValue = b.id_pengguna?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      // Compare values
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      // Apply direction
      return sorting.direction === "desc" ? comparison * -1 : comparison;
    });
  }

  return filtered;
});

const penggunaList = computed(() => {
  const filtered = filteredPengguna.value;
  const startIndex = (pagination.currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;
  return filtered.slice(startIndex, endIndex);
});

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
const updatePagination = () => {
  const total = filteredPengguna.value.length;
  pagination.total = total;
  pagination.totalPages = Math.ceil(total / pagination.perPage);
  pagination.from =
    total > 0
      ? Math.min((pagination.currentPage - 1) * pagination.perPage + 1, total)
      : 0;
  pagination.to = Math.min(pagination.currentPage * pagination.perPage, total);
};

const loadPengguna = async () => {
  loading.value = true;
  console.log("🔄 Loading pengguna data from database...");

  try {
    // Query pengguna from database
    console.log("📡 Fetching from pengguna table...");
    const { data: penggunaData, error } = await supabase
      .schema("sbs")
      .from("pengguna")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase query error:", error);
      throw error;
    }

    console.log("📝 Database data received:", penggunaData);

    if (penggunaData && penggunaData.length > 0) {
      // Transform database data to match interface
      const transformedData: Pengguna[] = penggunaData.map((item: any) => {
        // Determine status based on terakhir_login
        let status: "aktif" | "nonaktif" = "nonaktif"; // Default to nonaktif

        if (item.terakhir_login) {
          const lastLogin = new Date(item.terakhir_login);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          // Status aktif if last login was within 7 days
          if (lastLogin >= sevenDaysAgo) {
            status = "aktif";
          }
        }

        return {
          id: item.id_pengguna, // Use id_pengguna as the id
          id_pengguna: item.id_pengguna,
          nama: item.nama,
          email: item.email,
          telepon: item.telepon || undefined,
          role: item.role as "admin" | "kasir",
          status: status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          terakhir_login: item.terakhir_login,
        };
      });

      console.log("🔄 Transformed data:", transformedData);
      allPengguna.value = transformedData;
      console.log("✅ Database data assigned to allPengguna.value");
    } else {
      console.log("📭 No data found in database, using mock data");
      // Fallback to mock data if database is empty
      const mockData: Pengguna[] = [
        {
          id: "1",
          id_pengguna: "001-ADN",
          nama: "Admin Utama",
          email: "admin@sbs.com",
          telepon: "081234567890",
          role: "admin" as const,
          status: "aktif" as const,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
        },
        {
          id: "2",
          id_pengguna: "002-KSR",
          nama: "Kasir Satu",
          email: "kasir1@sbs.com",
          telepon: "081234567891",
          role: "kasir" as const,
          status: "aktif" as const,
          created_at: "2025-01-02T00:00:00Z",
          updated_at: "2025-01-02T00:00:00Z",
        },
      ];
      allPengguna.value = mockData;
      console.log("📝 Mock data assigned as fallback");
    }

    // Update pagination after data is loaded
    updatePagination();

    console.log("📊 Pagination updated:", {
      total: pagination.total,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
    });
  } catch (error) {
    console.error("❌ Error loading pengguna:", error);

    // Show error toast
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.error(
        "Gagal memuat data pengguna: " + (error as Error).message,
        "Gagal Memuat Data"
      );
    }

    // Fallback to empty array on error
    allPengguna.value = [];
  } finally {
    loading.value = false;
    console.log("🏁 Loading completed");
  }
};

const debouncedSearch = () => {
  pagination.currentPage = 1;
  updatePagination();
};

const onFilterChange = () => {
  pagination.currentPage = 1;
  updatePagination();
};

const onPerPageChange = () => {
  pagination.currentPage = 1;
  updatePagination();
};

const sortBy = (field: string) => {
  if (sorting.field === field) {
    sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
  } else {
    sorting.field = field;
    sorting.direction = "asc";
  }
  // Reset to first page when sorting changes
  pagination.currentPage = 1;
  updatePagination();
};

const getSortIcon = (field: string) => {
  if (sorting.field !== field) return ArrowUpDown;
  return sorting.direction === "asc" ? ArrowUp : ArrowDown;
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.currentPage = page;
    updatePagination();
  }
};

const getPenggunaInitials = (pengguna: Pengguna) => {
  if (!pengguna) return "?";

  if (pengguna.id_pengguna) {
    const parts = pengguna.id_pengguna.split("-");
    return parts.length > 1
      ? parts[1]
      : pengguna.nama?.charAt(0).toUpperCase() || "?";
  }

  if (!pengguna.nama) return "?";

  const names = pengguna.nama.split(" ");
  if (names.length > 1 && names[0] && names[1]) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }
  return names[0]?.charAt(0).toUpperCase() || "?";
};

const formatDate = (dateString?: string) => {
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

const viewPengguna = (pengguna: Pengguna) => {
  selectedPengguna.value = pengguna;
  showDetailModal.value = true;
};

const editPengguna = (pengguna: Pengguna) => {
  selectedPengguna.value = pengguna;
  showEditModal.value = true;
  showDetailModal.value = false;
};

const deletePengguna = (pengguna: Pengguna) => {
  pendingDeletePengguna.value = pengguna;
  showDeleteModal.value = true;
};

const confirmDeletePengguna = async () => {
  if (!pendingDeletePengguna.value) return;

  deleteLoading.value = true;

  try {
    const pengguna = pendingDeletePengguna.value;
    console.log("🗑️ Deleting pengguna:", pengguna.id_pengguna);

    // Delete from sbs.pengguna table only
    const { error } = await supabase
      .schema("sbs")
      .from("pengguna")
      .delete()
      .eq("id_pengguna", pengguna.id_pengguna);

    if (error) {
      console.error("❌ Error deleting pengguna:", error);
      throw new Error(`Gagal hapus pengguna: ${error.message}`);
    }

    console.log("✅ Pengguna deleted successfully");

    // Show success toast
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.success(
        `Pengguna "${pengguna.nama}" berhasil dihapus`,
        "Berhasil Menghapus"
      );
    }

    // Close modal and reset state
    showDeleteModal.value = false;
    pendingDeletePengguna.value = null;

    loadPengguna(); // Reload to update data
  } catch (error: any) {
    console.error("❌ Error deleting pengguna:", error);

    // Show error toast
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.error(
        error.message || "Gagal menghapus pengguna. Silakan coba lagi.",
        "Gagal Menghapus"
      );
    }
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDeletePengguna = () => {
  showDeleteModal.value = false;
  pendingDeletePengguna.value = null;
};
const handlePenggunaCreated = (newPengguna: Pengguna) => {
  showCreateModal.value = false;

  // Show success toast
  if (typeof window !== "undefined" && (window as any).$toast) {
    (window as any).$toast.success(
      `Pengguna "${newPengguna.nama}" berhasil dibuat`,
      "Berhasil Menambah"
    );
  }

  loadPengguna();
};

const handlePenggunaUpdated = (updatedPengguna: Pengguna) => {
  showEditModal.value = false;
  selectedPengguna.value = null;

  // Show success toast
  if (typeof window !== "undefined" && (window as any).$toast) {
    (window as any).$toast.success(
      `Pengguna "${updatedPengguna.nama}" berhasil diperbarui`,
      "Berhasil Mengubah"
    );
  }

  loadPengguna();
};

// Lifecycle
onMounted(() => {
  console.log("🔧 Pengguna page mounted");
  console.log("👤 Auth store user:", !!authStore?.user);
  console.log("👤 Auth store profile:", authStore?.profile);
  console.log("👤 Auth store role:", authStore?.profile?.role);
  loadPengguna();
});

// Watch for search changes
watch(searchQuery, () => {
  debouncedSearch();
});

// Watch for filter changes
watch([() => filters.role, () => filters.status, filteredPengguna], () => {
  updatePagination();
});

// Watch for sorting changes
watch([() => sorting.field, () => sorting.direction], () => {
  updatePagination();
});
</script>

<style>
/* Modal backdrop */
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

/* Modal backdrop */
.modal-backdrop {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
