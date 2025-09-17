<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Manajemen Kategori Produk
        </h1>
        <p class="text-gray-600 mt-1">
          Kelola kategori produk sistem Point of Sale
        </p>
      </div>
      <!-- Export Button -->
      <div class="flex items-center space-x-4">
        <button
          @click="exportData"
          class="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download :size="16" />
          <span>Export</span>
        </button>
        <button
          @click="openCreateModal"
          class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus :size="20" />
          <span>Tambah Kategori</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Kategori</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ categories.length }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <FolderOpen :size="24" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Produk</p>
            <p class="text-2xl font-bold text-emerald-600">
              {{ analytics.totalProducts }}
            </p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <Package :size="24" class="text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Stok</p>
            <p class="text-2xl font-bold text-orange-600">
              {{ analytics.totalStock.toLocaleString("id-ID") }}
            </p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <BarChart3 :size="24" class="text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Nilai Aset</p>
            <p class="text-2xl font-bold text-purple-600">
              Rp {{ analytics.totalAsset.toLocaleString("id-ID") }}
            </p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <TrendingUp :size="24" class="text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cari Kategori</label
          >
          <div class="relative">
            <Search
              :size="20"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan nama kategori..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <!-- Sort Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Urutkan Berdasarkan</label
          >
          <select
            v-model="sorting.field"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="applySorting"
          >
            <option value="nama">Nama</option>
            <option value="created_at">Tanggal Dibuat</option>
            <option value="updated_at">Terakhir Diupdate</option>
            <option value="total_products">Jumlah Produk</option>
          </select>
        </div>

        <!-- Sort Direction -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Urutan</label
          >
          <select
            v-model="sorting.direction"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="applySorting"
          >
            <option value="asc">A-Z / Lama-Baru</option>
            <option value="desc">Z-A / Baru-Lama</option>
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
          <h2 class="text-lg font-semibold text-gray-900">Daftar Kategori</h2>
          <div
            v-if="selectedCategories.length === 0"
            class="flex items-center space-x-4 text-sm text-gray-600"
          >
            <span>{{ filteredCategories.length }} kategori</span>
          </div>
          <!-- Bulk Actions -->
          <div
            v-if="selectedCategories.length > 0"
            class="flex items-center space-x-2"
          >
            <span class="text-sm text-gray-600"
              >{{ selectedCategories.length }} dari
              {{ filteredCategories.length }} kategori dipilih</span
            >
            <button
              @click="clearSelection"
              class="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Batal Pilih
            </button>
            <button
              @click="bulkDelete"
              class="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors"
            >
              <Trash2 :size="14" class="inline mr-1" />
              Hapus Terpilih
            </button>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full">
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                :class="
                  sorting.field === 'nama' ? 'bg-gray-100 text-gray-700' : ''
                "
                @click="sortBy('nama')"
              >
                <div class="flex items-center space-x-1">
                  <span>Nama Kategori</span>
                  <component :is="getSortIcon('nama')" :size="14" />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Produk
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Stok
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nilai Aset
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
                <div class="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-32"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-16"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
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
              v-else-if="filteredCategories.length > 0"
              v-for="category in filteredCategories"
              :key="category.id_kategori"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :value="category.id_kategori"
                  v-model="selectedCategories"
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-semibold text-sm mr-3"
                  >
                    {{ getCategoryInitials(category.nama) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ category.nama }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ category.id_kategori }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ category.total_products }} produk
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ category.total_stock?.toLocaleString("id-ID") || 0 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  Rp {{ category.total_asset?.toLocaleString("id-ID") || 0 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(category.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="openDetailModal(category)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye :size="16" />
                  </button>
                  <button
                    @click="openEditModal(category)"
                    class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit :size="16" />
                  </button>
                  <button
                    @click="handleDelete(category)"
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
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <FolderOpen :size="32" class="text-gray-400" />
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Belum ada kategori
                  </h3>
                  <p class="text-gray-500 mb-6">
                    Mulai dengan menambahkan kategori produk pertama Anda
                  </p>
                  <button
                    @click="openCreateModal"
                    class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus :size="16" class="mr-2" />
                    Tambah Kategori
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <KategoriCreateModal
      v-if="showCreateModal"
      :isOpen="showCreateModal"
      @close="showCreateModal = false"
      @created="onCategoryCreated"
    />

    <KategoriEditModal
      v-if="showEditModal"
      :isOpen="showEditModal"
      :kategori="selectedCategory"
      @close="showEditModal = false"
      @updated="onCategoryUpdated"
    />

    <KategoriDetailModal
      v-if="showDetailModal"
      :isOpen="showDetailModal"
      :kategori="selectedCategory"
      @close="showDetailModal = false"
    />

    <ConfirmDeleteModal
      v-if="showDeleteModal"
      entity-type="Kategori"
      :item-name="selectedCategory?.nama || ''"
      :item-details="selectedCategory"
      :message="deleteMessage"
      :confirm-text="confirmDeleteText"
      :is-loading="deleteLoading"
      :require-confirmation="confirmDeleteText === 'Hapus Kategori'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Plus,
  Search,
  Download,
  FolderOpen,
  Package,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-vue-next";
import { supabase } from "~~/lib/supabaseClient";
import { useToast } from "~~/composables/useToast";

// Page meta
definePageMeta({
  layout: "admin",
  middleware: "role",
  auth: true,
  requiredRole: "admin",
});

// Types
interface Category {
  id_kategori: string;
  nama: string;
  created_at: string;
  updated_at: string;
  total_products: number;
  total_stock: number;
  total_asset: number;
}

interface Product {
  id_produk: string;
  stok: number;
  harga: number;
}

// Composables
const toast = useToast();

// Reactive data
const categories = ref<Category[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedCategories = ref<string[]>([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const selectedCategory = ref<Category | null>(null);
const deleteLoading = ref(false);
const deleteMessage = ref("");
const confirmDeleteText = ref("Hapus");

// Sorting
const sorting = ref({
  field: "nama" as keyof Category,
  direction: "asc" as "asc" | "desc",
});

// Computed
const analytics = computed(() => {
  return {
    totalProducts: categories.value.reduce(
      (sum, cat) => sum + (cat.total_products || 0),
      0
    ),
    totalStock: categories.value.reduce(
      (sum, cat) => sum + (cat.total_stock || 0),
      0
    ),
    totalAsset: categories.value.reduce(
      (sum, cat) => sum + (cat.total_asset || 0),
      0
    ),
  };
});

const filteredCategories = computed(() => {
  let filtered = categories.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (category) =>
        category.nama.toLowerCase().includes(query) ||
        category.id_kategori.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const isAllSelected = computed(() => {
  return (
    filteredCategories.value.length > 0 &&
    selectedCategories.value.length === filteredCategories.value.length
  );
});

// Methods
const fetchCategories = async () => {
  try {
    loading.value = true;

    // Fetch categories with product statistics
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("kategori")
      .select(
        `
        id_kategori,
        nama,
        created_at,
        updated_at
      `
      )
      .order(sorting.value.field, {
        ascending: sorting.value.direction === "asc",
      });

    if (categoriesError) throw categoriesError;

    // For each category, calculate statistics
    const categoriesWithStats = await Promise.all(
      (categoriesData || []).map(async (category: any) => {
        const { data: products } = await supabase
          .from("produk")
          .select("stok, harga")
          .eq("id_kategori", category.id_kategori);

        const total_products = products?.length || 0;
        const total_stock =
          products?.reduce((sum: number, p: any) => sum + (p.stok || 0), 0) ||
          0;
        const total_asset =
          products?.reduce(
            (sum: number, p: any) => sum + (p.stok || 0) * (p.harga || 0),
            0
          ) || 0;

        return {
          ...category,
          total_products,
          total_stock,
          total_asset,
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

const sortBy = (field: keyof Category) => {
  if (sorting.value.field === field) {
    sorting.value.direction =
      sorting.value.direction === "asc" ? "desc" : "asc";
  } else {
    sorting.value.field = field;
    sorting.value.direction = "asc";
  }
  applySorting();
};

const getSortIcon = (field: keyof Category) => {
  if (sorting.value.field !== field) return ArrowUpDown;
  return sorting.value.direction === "asc" ? ArrowUp : ArrowDown;
};

const applySorting = () => {
  categories.value.sort((a, b) => {
    const aVal = a[sorting.value.field];
    const bVal = b[sorting.value.field];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return sorting.value.direction === "asc" ? comparison : -comparison;
  });
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCategories.value = [];
  } else {
    selectedCategories.value = filteredCategories.value.map(
      (cat) => cat.id_kategori
    );
  }
};

const clearSelection = () => {
  selectedCategories.value = [];
};

const getCategoryInitials = (nama: string) => {
  return nama
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Modal functions
const openCreateModal = () => {
  showCreateModal.value = true;
};

const openEditModal = (category: Category) => {
  selectedCategory.value = category;
  showEditModal.value = true;
};

const openDetailModal = (category: Category) => {
  selectedCategory.value = category;
  showDetailModal.value = true;
};

const handleDelete = async (category: Category) => {
  selectedCategory.value = category;

  // Check if category has products
  const { data: products } = await supabase
    .from("produk")
    .select("id_produk")
    .eq("id_kategori", category.id_kategori);

  if (products && products.length > 0) {
    deleteMessage.value = `Kategori ini memiliki ${products.length} produk. Hapus semua produk terlebih dahulu sebelum menghapus kategori.`;
    confirmDeleteText.value = "Mengerti";
  } else {
    deleteMessage.value =
      "Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.";
    confirmDeleteText.value = "Hapus Kategori";
  }

  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!selectedCategory.value) return;

  // Check again if category has products (prevent deletion)
  const { data: products } = await supabase
    .from("produk")
    .select("id_produk")
    .eq("id_kategori", selectedCategory.value.id_kategori);

  if (products && products.length > 0) {
    showDeleteModal.value = false;
    return;
  }

  try {
    deleteLoading.value = true;

    const { error } = await supabase
      .from("kategori")
      .delete()
      .eq("id_kategori", selectedCategory.value.id_kategori);

    if (error) throw error;

    toast.success(`Kategori '${selectedCategory.value.nama}' berhasil dihapus`);

    await fetchCategories();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Gagal menghapus kategori");
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  selectedCategory.value = null;
};

const bulkDelete = async () => {
  if (selectedCategories.value.length === 0) return;

  // Check if any selected categories have products
  const { data: products } = await supabase
    .from("produk")
    .select("id_kategori")
    .in("id_kategori", selectedCategories.value);

  if (products && products.length > 0) {
    toast.error(
      "Beberapa kategori masih memiliki produk. Hapus produk terlebih dahulu."
    );
    return;
  }

  if (
    confirm(`Hapus ${selectedCategories.value.length} kategori yang dipilih?`)
  ) {
    try {
      const { error } = await supabase
        .from("kategori")
        .delete()
        .in("id_kategori", selectedCategories.value);

      if (error) throw error;

      toast.success(
        `${selectedCategories.value.length} kategori berhasil dihapus`
      );

      selectedCategories.value = [];
      await fetchCategories();
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
      toast.error("Gagal menghapus kategori");
    }
  }
};

const exportData = () => {
  const csvContent = [
    [
      "ID Kategori",
      "Nama",
      "Jumlah Produk",
      "Total Stok",
      "Nilai Aset",
      "Tanggal Dibuat",
    ],
    ...filteredCategories.value.map((cat) => [
      cat.id_kategori,
      cat.nama,
      cat.total_products,
      cat.total_stock,
      cat.total_asset,
      formatDate(cat.created_at),
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kategori-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Event handlers
const onCategoryCreated = () => {
  fetchCategories();
  showCreateModal.value = false;
};

const onCategoryUpdated = () => {
  fetchCategories();
  showEditModal.value = false;
};

// Lifecycle
onMounted(() => {
  // Reset all modal states to ensure they don't open automatically
  showCreateModal.value = false;
  showEditModal.value = false;
  showDetailModal.value = false;
  showDeleteModal.value = false;
  selectedCategory.value = null;

  fetchCategories();
});

// Watch for sorting changes
watch(
  () => [sorting.value.field, sorting.value.direction],
  () => {
    fetchCategories();
  }
);
</script>
