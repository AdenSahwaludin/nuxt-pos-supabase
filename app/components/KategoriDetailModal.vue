<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 modal-backdrop" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-xl shadow-xl max-w-4xl w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                Detail Kategori: {{ kategori?.nama || "Tanpa Nama" }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                ID: {{ kategori?.id_kategori || "-" }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Category Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-blue-600 text-sm font-medium">Total Produk</div>
              <div class="text-2xl font-bold text-blue-900">
                {{ productStats.totalProducts }}
              </div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-green-600 text-sm font-medium">Total Stok</div>
              <div class="text-2xl font-bold text-green-900">
                {{ productStats.totalStock }}
              </div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="text-yellow-600 text-sm font-medium">Total Aset</div>
              <div class="text-2xl font-bold text-yellow-900">
                {{ formatCurrency(productStats.totalAsset) }}
              </div>
            </div>
          </div>

          <!-- Products Table -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold text-gray-900">Daftar Produk</h4>
              <div class="text-sm text-gray-600">
                {{ products.length }} produk ditemukan
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-8">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"
              ></div>
              <span class="ml-3 text-gray-600">Memuat produk...</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="products.length === 0" class="text-center py-8">
              <Package :size="48" class="mx-auto text-gray-400 mb-3" />
              <p class="text-gray-600">Belum ada produk dalam kategori ini</p>
            </div>

            <!-- Products List -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th
                      class="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      ID Produk
                    </th>
                    <th
                      class="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      Nama Produk
                    </th>
                    <th
                      class="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      Harga
                    </th>
                    <th
                      class="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      Stok
                    </th>
                    <th
                      class="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      Total Nilai
                    </th>
                    <th
                      class="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="produk in products"
                    :key="produk.id_produk"
                    class="hover:bg-gray-50"
                  >
                    <td class="py-3 px-3">
                      <div class="text-sm font-mono text-gray-900">
                        {{ produk.id_produk }}
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ produk.nama }}
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="text-sm text-gray-900">
                        {{ formatCurrency(produk.harga) }}
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="text-sm text-gray-900">{{ produk.stok }}</div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="text-sm text-gray-900">
                        {{ formatCurrency(produk.harga * produk.stok) }}
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <span
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          produk.stok > produk.batas_stok
                            ? 'bg-green-100 text-green-800'
                            : produk.stok > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{
                          produk.stok > produk.batas_stok
                            ? "Stok Aman"
                            : produk.stok > 0
                            ? "Stok Rendah"
                            : "Stok Habis"
                        }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Category Info -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Informasi Kategori</h5>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Dibuat:</span>
                  <span class="text-gray-900">{{
                    formatDate(kategori?.created_at)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Terakhir Diperbarui:</span>
                  <span class="text-gray-900">{{
                    formatDate(kategori?.updated_at)
                  }}</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Ringkasan Stok</h5>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Produk Stok Aman:</span>
                  <span class="text-green-600 font-medium">{{
                    stockSummary.safe
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Produk Stok Rendah:</span>
                  <span class="text-yellow-600 font-medium">{{
                    stockSummary.low
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Produk Stok Habis:</span>
                  <span class="text-red-600 font-medium">{{
                    stockSummary.empty
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex justify-end">
            <button
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "~~/lib/supabaseClient";
import { X, Package } from "lucide-vue-next";

interface Props {
  kategori: {
    id_kategori: number;
    nama: string;
    created_at: string;
    updated_at: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

// State
const loading = ref(false);
const products = ref([]);

// Computed
const productStats = computed(() => {
  const totalProducts = products.value.length;
  const totalStock = products.value.reduce((sum, p) => sum + p.stok, 0);
  const totalAsset = products.value.reduce(
    (sum, p) => sum + p.harga * p.stok,
    0
  );

  return {
    totalProducts,
    totalStock,
    totalAsset,
  };
});

const stockSummary = computed(() => {
  const safe = products.value.filter((p) => p.stok > p.batas_stok).length;
  const low = products.value.filter(
    (p) => p.stok > 0 && p.stok <= p.batas_stok
  ).length;
  const empty = products.value.filter((p) => p.stok === 0).length;

  return { safe, low, empty };
});

// Methods
const fetchProducts = async () => {
  if (!props.kategori?.id_kategori) {
    console.warn("No kategori ID provided");
    return;
  }

  loading.value = true;
  try {
    const { data, error } = await supabase
      .schema("sbs")
      .from("produk")
      .select("id_produk, nama, harga, stok, batas_stok")
      .eq("id_kategori", props.kategori.id_kategori)
      .order("nama");

    if (error) throw error;

    products.value = data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {};

// Lifecycle
onMounted(() => {
  document.body.style.overflow = "hidden";
  fetchProducts();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
