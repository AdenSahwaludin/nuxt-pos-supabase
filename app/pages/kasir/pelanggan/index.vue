<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
          <p class="mt-1 text-sm text-gray-500">
            Kelola data pelanggan untuk transaksi POS
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button
            @click="refreshData"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon class="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Tambah Pelanggan
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-6 bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cari Pelanggan
          </label>
          <div class="relative">
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan nama, email, atau telepon..."
              class="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Filter Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Filter Status
          </label>
          <select
            v-model="selectedStatus"
            @change="handleSearch"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non-Aktif</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Pelanggan
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.total || 0 }}
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
              <CheckCircleIcon class="h-6 w-6 text-emerald-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Pelanggan Aktif
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.aktif || 0 }}
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
              <XCircleIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Non-Aktif
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.nonaktif || 0 }}
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
              <CalendarDaysIcon class="h-6 w-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Baru Bulan Ini
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.newThisMonth || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Daftar Pelanggan
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ filteredPelanggan?.length || 0 }} dari
          {{ pelangganList?.length || 0 }} pelanggan
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data pelanggan...</p>
      </div>

      <!-- Table -->
      <div v-else-if="filteredPelanggan.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pelanggan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kontak
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bergabung
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
              v-for="pelanggan in paginatedPelanggan"
              :key="pelanggan.id_pelanggan"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-emerald-700">
                        {{ getInitials(pelanggan.nama) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ pelanggan.nama }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ pelanggan.id_pelanggan }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ pelanggan.email || "-" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ pelanggan.telepon || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    pelanggan.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                >
                  {{ pelanggan.status || "nonaktif" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(pelanggan.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="selectForTransaction(pelanggan)"
                    class="text-emerald-600 hover:text-emerald-900"
                    title="Pilih untuk transaksi"
                  >
                    <ShoppingCartIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="viewPelanggan(pelanggan)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat detail"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="editPelanggan(pelanggan)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Edit pelanggan"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 text-center">
        <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Tidak ada pelanggan
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            searchQuery
              ? "Tidak ada pelanggan yang sesuai dengan pencarian."
              : "Mulai dengan menambahkan pelanggan pertama."
          }}
        </p>
        <div class="mt-6">
          <button
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Tambah Pelanggan
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredPelanggan.length > itemsPerPage"
        class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"
      >
        <div class="flex items-center justify-between">
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
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan
                <span class="font-medium">{{
                  (currentPage - 1) * itemsPerPage + 1
                }}</span>
                sampai
                <span class="font-medium">{{
                  Math.min(currentPage * itemsPerPage, filteredPelanggan.length)
                }}</span>
                dari
                <span class="font-medium">{{ filteredPelanggan.length }}</span>
                hasil
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
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <PelangganModal
      v-if="showModal"
      :is-open="showModal"
      :pelanggan="selectedPelanggan"
      :mode="modalMode"
      @close="closeModal"
      @saved="handlePelangganSaved"
    />

    <!-- View Detail Modal -->
    <PelangganDetailModal
      v-if="showDetailModal"
      :is-open="showDetailModal"
      :pelanggan="selectedPelanggan"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, watch, onMounted } from "vue";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

// Import components
import PelangganModal from "~/components/pelanggan/PelangganModal.vue";
import PelangganDetailModal from "~/components/pelanggan/PelangganDetailModal.vue";

// Layout
definePageMeta({
  layout: "kasir",
});

// Reactive state
const loading = ref(true);
const pelangganList = ref([]);
const searchQuery = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const showDetailModal = ref(false);
const selectedPelanggan = ref(null);
const modalMode = ref("add"); // 'add' or 'edit'

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Stats
const stats = ref({
  total: 0,
  aktif: 0,
  nonaktif: 0,
  newThisMonth: 0,
});

// Computed
const filteredPelanggan = computed(() => {
  let filtered = pelangganList.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nama?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.telepon?.includes(query) ||
        p.id_pelanggan?.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter((p) => p.status === selectedStatus.value);
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredPelanggan.value.length / itemsPerPage.value)
);

const paginatedPelanggan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPelanggan.value.slice(start, end);
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
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...", total);
    } else if (current >= total - 3) {
      pages.push(1, "...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, "...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...", total);
    }
  }

  return pages.filter(
    (p) => p !== "..." || pages.indexOf(p) === pages.lastIndexOf(p)
  );
});

// Methods
const fetchPelanggan = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/kasir/pelanggan");

    if (response.success) {
      pelangganList.value = response.data || [];
      calculateStats();
    }
  } catch (error) {
    console.error("Error fetching pelanggan:", error);
    // Show error toast
    const toast = useToast();
    toast.error("Gagal", "Terjadi kesalahan saat memuat data pelanggan");
  } finally {
    loading.value = false;
  }
};

const calculateStats = () => {
  const total = pelangganList.value.length;
  const aktif = pelangganList.value.filter((p) => p.status === "aktif").length;
  const nonaktif = total - aktif;

  // Calculate new this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newThisMonth = pelangganList.value.filter(
    (p) => new Date(p.created_at) >= thisMonth
  ).length;

  stats.value = {
    total,
    aktif,
    nonaktif,
    newThisMonth,
  };
};

const handleSearch = () => {
  currentPage.value = 1;
};

const refreshData = () => {
  fetchPelanggan();
};

const openAddModal = () => {
  selectedPelanggan.value = null;
  modalMode.value = "add";
  showModal.value = true;
};

const editPelanggan = (pelanggan) => {
  selectedPelanggan.value = pelanggan;
  modalMode.value = "edit";
  showModal.value = true;
};

const viewPelanggan = (pelanggan) => {
  selectedPelanggan.value = pelanggan;
  showDetailModal.value = true;
};

const selectForTransaction = async (pelanggan) => {
  try {
    // Store selected customer in session or store
    sessionStorage.setItem("selectedCustomer", JSON.stringify(pelanggan));

    // Navigate to POS with customer selected
    await navigateTo("/kasir/pos?customer=" + pelanggan.id_pelanggan);
  } catch (error) {
    console.error("Error selecting customer:", error);
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedPelanggan.value = null;
};

const handlePelangganSaved = () => {
  closeModal();
  fetchPelanggan();
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

const goToPage = (page) => {
  if (typeof page === "number") {
    currentPage.value = page;
  }
};

// Utility methods
const getInitials = (name) => {
  return (
    name
      ?.split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Lifecycle
onMounted(() => {
  fetchPelanggan();
});

// Watch for route changes to reset pagination
watch(
  () => searchQuery.value,
  () => {
    currentPage.value = 1;
  }
);

watch(
  () => selectedStatus.value,
  () => {
    currentPage.value = 1;
  }
);
</script>
