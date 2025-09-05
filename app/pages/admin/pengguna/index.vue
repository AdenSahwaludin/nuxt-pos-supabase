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
            @change="loadPengguna"
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
            @change="loadPengguna"
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
              @change="loadPengguna"
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('email')"
              >
                <div class="flex items-center space-x-1">
                  <span>Email</span>
                  <ArrowUpDown :size="14" />
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
                @click="sortBy('created_at')"
              >
                <div class="flex items-center space-x-1">
                  <span>Dibuat</span>
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
                <div class="animate-pulse bg-gray-200 h-6 rounded w-16"></div>
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
  </div>
</template>

<script setup lang="ts">
import roleMiddleware from "~/middleware/role";
import { supabase } from "~~/lib/supabaseClient";
// @ts-nocheck
import {
  UserPlus,
  Search,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

// Import supabase composable - auto-imported by Nuxt

// Page meta
definePageMeta({
  layout: "admin",
  middleware: [roleMiddleware],
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
}

// Reactive state
const loading = ref(false);
const searchQuery = ref("");
const penggunaList = ref<Pengguna[]>([]);
const selectedPengguna = ref<Pengguna | null>(null);
const authStore = useAuthStore();

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);

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
const loadPengguna = async () => {
  loading.value = true;
  console.log("🔄 Loading pengguna data from database...");

  try {
    // Query pengguna from database
    console.log("📡 Fetching from pengguna table...");
    const { data: penggunaData, error } = await supabase
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
      const transformedData: Pengguna[] = penggunaData.map((item: any) => ({
        id: item.id_pengguna, // Use id_pengguna as the id
        id_pengguna: item.id_pengguna,
        nama: item.nama,
        email: item.email,
        telepon: item.telepon || undefined,
        role: item.role as "admin" | "kasir",
        status: "aktif", // Default to aktif since they exist in database
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      console.log("🔄 Transformed data:", transformedData);
      penggunaList.value = transformedData;
      console.log("✅ Database data assigned to penggunaList.value");
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
      penggunaList.value = mockData;
      console.log("� Mock data assigned as fallback");
    }

    // Apply filters if any
    if (filters.role || filters.status) {
      console.log("🔍 Applying filters:", filters);
      penggunaList.value = penggunaList.value.filter((pengguna) => {
        const roleMatch = !filters.role || pengguna.role === filters.role;
        const statusMatch =
          !filters.status || pengguna.status === filters.status;
        return roleMatch && statusMatch;
      });
    }

    // Apply search if any
    if (searchQuery.value.trim()) {
      console.log("🔍 Applying search:", searchQuery.value);
      const query = searchQuery.value.toLowerCase();
      penggunaList.value = penggunaList.value.filter(
        (pengguna) =>
          pengguna.nama?.toLowerCase().includes(query) ||
          pengguna.email?.toLowerCase().includes(query) ||
          pengguna.id_pengguna?.toLowerCase().includes(query)
      );
    }

    pagination.total = penggunaList.value.length;
    pagination.totalPages = Math.ceil(pagination.total / pagination.perPage);
    pagination.from = Math.min(
      (pagination.currentPage - 1) * pagination.perPage + 1,
      pagination.total
    );
    pagination.to = Math.min(
      pagination.currentPage * pagination.perPage,
      pagination.total
    );

    console.log("📊 Pagination updated:", {
      total: pagination.total,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
    });
  } catch (error) {
    console.error("❌ Error loading pengguna:", error);
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.error(
        "Gagal memuat data pengguna: " + (error as Error).message
      );
    }

    // Fallback to empty array on error
    penggunaList.value = [];
  } finally {
    loading.value = false;
    console.log("🏁 Loading completed");
  }
};

const debouncedSearch = () => {
  pagination.currentPage = 1;
  loadPengguna();
};

const sortBy = (field: string) => {
  if (sorting.field === field) {
    sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
  } else {
    sorting.field = field;
    sorting.direction = "asc";
  }
  loadPengguna();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.currentPage = page;
    loadPengguna();
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

const deletePengguna = async (pengguna: Pengguna) => {
  if (
    confirm(`Apakah Anda yakin ingin menghapus pengguna "${pengguna.nama}"?`)
  ) {
    try {
      console.log("🗑️ Deleting pengguna:", pengguna.id_pengguna);

      // Delete from pengguna table
      const { error } = await supabase
        .from("pengguna")
        .delete()
        .eq("id_pengguna", pengguna.id_pengguna);

      if (error) {
        console.error("❌ Error deleting pengguna:", error);
        throw new Error(`Gagal hapus pengguna: ${error.message}`);
      }

      console.log("✅ Pengguna deleted successfully");

      alert("Pengguna berhasil dihapus");
      loadPengguna(); // Reload to update data
    } catch (error: any) {
      console.error("❌ Error deleting pengguna:", error);
      alert(`Gagal menghapus pengguna: ${error.message}`);
    }
  }
};

const handlePenggunaCreated = (newPengguna: Pengguna) => {
  showCreateModal.value = false;
  alert("Pengguna berhasil dibuat");
  loadPengguna();
};

const handlePenggunaUpdated = (updatedPengguna: Pengguna) => {
  showEditModal.value = false;
  selectedPengguna.value = null;
  alert("Pengguna berhasil diperbarui");
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
