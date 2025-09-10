<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
            <p class="text-gray-600 text-sm mt-1">
              Kelola kategori produk untuk mengorganisir inventori Anda
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Export Button -->
            <button
              @click="exportData"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Download :size="16" class="mr-2" />
              Export
            </button>
            <!-- Add Category Button -->
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Plus :size="16" class="mr-2" />
              Tambah Kategori
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Search & Filter Bar -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <Search
                :size="16"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari kategori..."
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Sort -->
          <div class="w-full sm:w-48">
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              @change="fetchCategories"
            >
              <option value="nama">Urutkan: Nama A-Z</option>
              <option value="nama-desc">Urutkan: Nama Z-A</option>
              <option value="jumlah_produk">Urutkan: Jumlah Produk</option>
              <option value="updated_at">Urutkan: Terbaru</option>
              <option value="updated_at-desc">Urutkan: Terlama</option>
            </select>
          </div>

          <!-- Page Size -->
          <div class="w-full sm:w-32">
            <select
              v-model="pageSize"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              @change="changePageSize"
            >
              <option value="10">10 / halaman</option>
              <option value="25">25 / halaman</option>
              <option value="50">50 / halaman</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div
        v-if="selectedCategories.length > 0"
        class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <CheckSquare :size="16" class="text-emerald-600 mr-2" />
            <span class="text-emerald-800 font-medium">
              {{ selectedCategories.length }} kategori dipilih
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="bulkDelete"
              class="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              <Trash2 :size="14" class="mr-1" />
              Hapus Terpilih
            </button>
            <button
              @click="clearSelection"
              class="inline-flex items-center px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- Categories Table -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"
          ></div>
          <span class="ml-3 text-gray-600">Memuat kategori...</span>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="categories.length === 0 && !searchQuery"
          class="text-center py-12"
        >
          <Package :size="48" class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Belum ada kategori
          </h3>
          <p class="text-gray-600 mb-4">
            Mulai dengan membuat kategori pertama untuk mengorganisir produk
            Anda
          </p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            <Plus :size="16" class="mr-2" />
            Tambah Kategori
          </button>
        </div>

        <!-- No Search Results -->
        <div
          v-else-if="categories.length === 0 && searchQuery"
          class="text-center py-12"
        >
          <Search :size="48" class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Tidak ada hasil
          </h3>
          <p class="text-gray-600">
            Tidak ditemukan kategori dengan kata kunci "{{ searchQuery }}"
          </p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Kategori
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah Produk
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Aset
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Terakhir Diperbarui
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="kategori in categories"
                :key="kategori.id_kategori"
                class="hover:bg-gray-50 cursor-pointer"
                @click="openDetailModal(kategori)"
              >
                <td class="px-6 py-4 whitespace-nowrap" @click.stop>
                  <input
                    type="checkbox"
                    :checked="selectedCategories.includes(kategori.id_kategori)"
                    @change="toggleSelect(kategori.id_kategori)"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ kategori.nama }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ kategori.jumlah_produk || 0 }} produk
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatCurrency(kategori.total_aset || 0) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(kategori.updated_at) }}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  @click.stop
                >
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="openEditModal(kategori)"
                      class="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                      title="Edit kategori"
                    >
                      <Edit :size="16" />
                    </button>
                    <button
                      @click="confirmDelete(kategori)"
                      class="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Hapus kategori"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="bg-gray-50 px-6 py-3 border-t border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
              {{ Math.min(currentPage * pageSize, totalItems) }} dari
              {{ totalItems }} kategori
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft :size="16" />
              </button>

              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="currentPage = page"
                  :class="[
                    'px-3 py-1 border rounded text-sm',
                    page === currentPage
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-gray-300 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 text-gray-500">...</span>
              </template>

              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <KategoriCreateModal
      v-if="showCreateModal"
      @close="closeCreateModal"
      @created="handleCategoryCreated"
    />

    <KategoriEditModal
      v-if="showEditModal && selectedCategory"
      :kategori="selectedCategory"
      @close="closeEditModal"
      @updated="handleCategoryUpdated"
    />

    <KategoriDetailModal
      v-if="showDetailModal && selectedCategory"
      :kategori="selectedCategory"
      @close="closeDetailModal"
    />

    <ConfirmDeleteModal
      v-if="showDeleteModal"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />

    <!-- Toast Notifications -->
    <AdminToast />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted, watch } from "vue";
import { supabase } from "~~/lib/supabaseClient";
import { useToast } from "~~/composables/useToast";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Package,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

// Page Meta
definePageMeta({
  layout: "admin",
  middleware: "role",
});

// Composables
const toast = useToast();

// State
const loading = ref(false);
const categories = ref([]);
const searchQuery = ref("");
const sortBy = ref("nama");
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const selectedCategories = ref([]);

// Modals
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const selectedCategory = ref(null);

// Delete confirmation
const deleteModalTitle = ref("");
const deleteModalMessage = ref("");
const deleteAction = ref(null);

// Computed
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const isAllSelected = computed(() => {
  return (
    categories.value.length > 0 &&
    selectedCategories.value.length === categories.value.length
  );
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

// Methods
const fetchCategories = async () => {
  loading.value = true;
  try {
    // Get count first for pagination
    let countQuery = supabase
      .schema("sbs")
      .from("kategori")
      .select("*", { count: "exact", head: true });

    if (searchQuery.value) {
      countQuery = countQuery.ilike("nama", `%${searchQuery.value}%`);
    }

    const { count } = await countQuery;
    totalItems.value = count || 0;

    // Main query for data
    let query = supabase
      .schema("sbs")
      .from("kategori")
      .select("id_kategori, nama, created_at, updated_at");

    // Search
    if (searchQuery.value) {
      query = query.ilike("nama", `%${searchQuery.value}%`);
    }

    // Apply sorting
    const [field, direction] = sortBy.value.includes("-desc")
      ? [sortBy.value.replace("-desc", ""), false]
      : [sortBy.value, true];

    query = query.order(field, { ascending: direction });

    // Pagination
    const from = (currentPage.value - 1) * pageSize.value;
    const to = from + pageSize.value - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;

    // Get product stats for each category
    const categoriesWithStats = await Promise.all(
      (data || []).map(async (kategori) => {
        const { data: products, error: prodError } = await supabase
          .schema("sbs")
          .from("produk")
          .select("harga, stok")
          .eq("id_kategori", kategori.id_kategori);

        if (prodError) {
          console.warn("Error fetching products for category:", prodError);
          return {
            ...kategori,
            jumlah_produk: 0,
            total_aset: 0,
          };
        }

        const jumlah_produk = products?.length || 0;
        const total_aset =
          products?.reduce(
            (total, produk) => total + produk.harga * produk.stok,
            0
          ) || 0;

        return {
          ...kategori,
          jumlah_produk,
          total_aset,
        };
      })
    );

    categories.value = categoriesWithStats;
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Gagal memuat data kategori");
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchCategories();
}, 300);

const changePageSize = () => {
  currentPage.value = 1;
  fetchCategories();
};

// Modal handlers
const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (kategori) => {
  selectedCategory.value = kategori;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedCategory.value = null;
};

const openDetailModal = (kategori) => {
  selectedCategory.value = kategori;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedCategory.value = null;
};

// CRUD handlers
const handleCategoryCreated = (newCategory) => {
  toast.success("Kategori berhasil ditambahkan");
  fetchCategories();
  closeCreateModal();
};

const handleCategoryUpdated = (updatedCategory) => {
  toast.success("Kategori berhasil diperbarui");
  fetchCategories();
  closeEditModal();
};

// Delete handlers
const confirmDelete = (kategori) => {
  selectedCategory.value = kategori;
  deleteModalTitle.value = "Hapus Kategori";
  deleteModalMessage.value = `Apakah Anda yakin ingin menghapus kategori "${kategori.nama}"? Tindakan ini tidak dapat dibatalkan.`;
  deleteAction.value = "single";
  showDeleteModal.value = true;
};

const bulkDelete = () => {
  if (selectedCategories.value.length === 0) return;

  deleteModalTitle.value = "Hapus Kategori Terpilih";
  deleteModalMessage.value = `Apakah Anda yakin ingin menghapus ${selectedCategories.value.length} kategori yang dipilih? Tindakan ini tidak dapat dibatalkan.`;
  deleteAction.value = "bulk";
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    if (deleteAction.value === "single") {
      // Check if category has products
      const { data: products, error: checkError } = await supabase
        .schema("sbs")
        .from("produk")
        .select("id_produk")
        .eq("id_kategori", selectedCategory.value.id_kategori)
        .limit(1);

      if (checkError) throw checkError;

      if (products && products.length > 0) {
        toast.error(
          "Tidak dapat menghapus kategori yang masih memiliki produk"
        );
        closeDeleteModal();
        return;
      }

      const { error } = await supabase
        .schema("sbs")
        .from("kategori")
        .delete()
        .eq("id_kategori", selectedCategory.value.id_kategori);

      if (error) throw error;
      toast.success("Kategori berhasil dihapus");
    } else if (deleteAction.value === "bulk") {
      // Check if any categories have products
      const { data: productsCheck, error: checkError } = await supabase
        .schema("sbs")
        .from("produk")
        .select("id_kategori")
        .in("id_kategori", selectedCategories.value);

      if (checkError) throw checkError;

      if (productsCheck && productsCheck.length > 0) {
        const categoriesWithProducts = [
          ...new Set(productsCheck.map((p) => p.id_kategori)),
        ];
        toast.error(
          `Tidak dapat menghapus ${categoriesWithProducts.length} kategori yang masih memiliki produk`
        );
        closeDeleteModal();
        return;
      }

      const { error } = await supabase
        .schema("sbs")
        .from("kategori")
        .delete()
        .in("id_kategori", selectedCategories.value);

      if (error) throw error;
      toast.success(
        `${selectedCategories.value.length} kategori berhasil dihapus`
      );
      selectedCategories.value = [];
    }

    fetchCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error.message?.includes("foreign key")) {
      toast.error(
        "Tidak dapat menghapus kategori yang masih digunakan oleh produk"
      );
    } else {
      toast.error("Gagal menghapus kategori");
    }
  }

  closeDeleteModal();
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedCategory.value = null;
  deleteAction.value = null;
};

// Selection handlers
const toggleSelect = (categoryId) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(categoryId);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCategories.value = [];
  } else {
    selectedCategories.value = categories.value.map((cat) => cat.id_kategori);
  }
};

const clearSelection = () => {
  selectedCategories.value = [];
};

// Export functionality
const exportData = async () => {
  try {
    const { data, error } = await supabase.schema("sbs").from("kategori")
      .select(`
        nama,
        produk:produk(count),
        produk!inner(harga, stok),
        updated_at
      `);

    if (error) throw error;

    const csvData = data.map((kategori) => ({
      "Nama Kategori": kategori.nama,
      "Jumlah Produk": kategori.produk?.[0]?.count || 0,
      "Total Aset":
        kategori.produk?.reduce(
          (total, produk) => total + produk.harga * produk.stok,
          0
        ) || 0,
      "Terakhir Diperbarui": formatDate(kategori.updated_at),
    }));

    downloadCSV(csvData, "kategori-export.csv");
    toast.success("Data berhasil diekspor");
  } catch (error) {
    console.error("Error exporting data:", error);
    toast.error("Gagal mengekspor data");
  }
};

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const downloadCSV = (data, filename) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

const convertToCSV = (data) => {
  if (!data.length) return "";

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
  ].join("\n");

  return csvContent;
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Watchers
watch(currentPage, fetchCategories);

// Lifecycle
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
