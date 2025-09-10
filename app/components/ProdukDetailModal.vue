<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 modal-backdrop transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-xl shadow-xl max-w-4xl w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Eye :size="24" class="text-blue-500 mr-3" />
              Detail Produk
            </h3>
            <div class="flex items-center space-x-2">
              <button
                @click="$emit('edit', produk)"
                class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Edit Produk"
              >
                <Edit :size="20" />
              </button>
              <button
                @click="$emit('close')"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X :size="20" class="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Product Image & Quick Info -->
            <div class="space-y-6">
              <!-- Product Image -->
              <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  v-if="produk.gambar_url"
                  :src="produk.gambar_url"
                  :alt="produk.nama"
                  class="w-full h-full object-cover"
                  @error="imageError = true"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <div class="text-center">
                    <Package :size="64" class="text-gray-400 mx-auto mb-2" />
                    <p class="text-gray-500 text-sm">Tidak ada gambar</p>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                <h4
                  class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                >
                  Informasi Cepat
                </h4>

                <div class="space-y-3">
                  <!-- Stock Status -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Status Stok</span>
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="stockStatusClass"
                    >
                      {{ stockStatusText }}
                    </span>
                  </div>

                  <!-- Stock Level -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Level Stok</span>
                    <div class="flex items-center space-x-2">
                      <div class="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          class="h-2 rounded-full transition-all duration-300"
                          :class="stockLevelClass"
                          :style="{ width: stockLevelPercentage + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-900"
                        >{{ stockLevelPercentage }}%</span
                      >
                    </div>
                  </div>

                  <!-- Value -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Nilai Total</span>
                    <span class="text-sm font-bold text-emerald-600">
                      {{ formatCurrency(produk.harga * produk.stok) }}
                    </span>
                  </div>

                  <!-- Days in Inventory -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Umur Produk</span>
                    <span class="text-sm text-gray-900"
                      >{{ daysInInventory }} hari</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Detailed Information -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Basic Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <h4
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <Info :size="20" class="text-blue-500 mr-2" />
                  Informasi Dasar
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >SKU</label
                    >
                    <p
                      class="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded"
                    >
                      {{ produk.sku }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Barcode</label
                    >
                    <p
                      class="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded"
                    >
                      {{ produk.barcode || "Tidak ada" }}
                    </p>
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Nama Produk</label
                    >
                    <p class="text-lg font-semibold text-gray-900">
                      {{ produk.nama }}
                    </p>
                  </div>

                  <div class="md:col-span-2" v-if="produk.deskripsi">
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Deskripsi</label
                    >
                    <p
                      class="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded"
                    >
                      {{ produk.deskripsi }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Kategori</label
                    >
                    <span
                      class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {{ produk.kategori_nama || "Tanpa Kategori" }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Satuan</label
                    >
                    <p class="text-sm text-gray-900">
                      {{ produk.satuan || "Tidak ditentukan" }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Pricing & Inventory -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <h4
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <DollarSign :size="20" class="text-emerald-500 mr-2" />
                  Harga & Inventori
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Harga Jual</label
                    >
                    <p class="text-xl font-bold text-emerald-600">
                      {{ formatCurrency(produk.harga) }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Stok Tersedia</label
                    >
                    <div class="flex items-center space-x-2">
                      <p class="text-xl font-bold text-gray-900">
                        {{ produk.stok }}
                      </p>
                      <span class="text-sm text-gray-500">{{
                        produk.satuan || "unit"
                      }}</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Stok Minimum</label
                    >
                    <p class="text-lg font-semibold text-orange-600">
                      {{ produk.stok_minimum || 5 }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Berat</label
                    >
                    <p class="text-sm text-gray-900">
                      {{
                        produk.berat
                          ? `${produk.berat} gram`
                          : "Tidak ditentukan"
                      }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Nilai Total Stok</label
                    >
                    <p class="text-lg font-bold text-gray-900">
                      {{ formatCurrency(produk.harga * produk.stok) }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Status</label
                    >
                    <span
                      class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                      :class="
                        produk.aktif
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ produk.aktif ? "Aktif" : "Nonaktif" }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Activity & Timestamps -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <h4
                  class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <Clock :size="20" class="text-gray-500 mr-2" />
                  Riwayat & Aktivitas
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Dibuat Pada</label
                    >
                    <div class="flex items-center space-x-2">
                      <Calendar :size="16" class="text-gray-400" />
                      <p class="text-sm text-gray-900">
                        {{ formatDate(produk.created_at) }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Terakhir Diperbarui</label
                    >
                    <div class="flex items-center space-x-2">
                      <RefreshCw :size="16" class="text-gray-400" />
                      <p class="text-sm text-gray-900">
                        {{ formatDate(produk.updated_at) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Stock History Placeholder -->
                <div
                  class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div class="flex items-center space-x-2 mb-2">
                    <TrendingUp :size="16" class="text-blue-600" />
                    <h5 class="text-sm font-medium text-blue-800">
                      Riwayat Stok
                    </h5>
                  </div>
                  <p class="text-sm text-blue-700">
                    Fitur riwayat perubahan stok akan tersedia segera. Anda
                    dapat melihat log masuk/keluar barang dan adjustment di
                    sini.
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">
                  Aksi Cepat
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    @click="$emit('edit', produk)"
                    class="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Edit :size="16" />
                    <span>Edit Produk</span>
                  </button>

                  <button
                    @click="adjustStock"
                    class="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Package :size="16" />
                    <span>Adjust Stok</span>
                  </button>

                  <button
                    @click="duplicateProduct"
                    class="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Copy :size="16" />
                    <span>Duplikasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  X,
  Eye,
  Edit,
  Package,
  Info,
  DollarSign,
  Clock,
  Calendar,
  RefreshCw,
  TrendingUp,
  Copy,
} from "lucide-vue-next";

interface Props {
  produk: {
    id: string;
    sku: string;
    barcode?: string;
    nama: string;
    deskripsi?: string;
    kategori_id: string;
    kategori_nama?: string;
    harga: number;
    stok: number;
    stok_minimum?: number;
    satuan?: string;
    berat?: number;
    gambar_url?: string;
    aktif: boolean;
    created_at: string;
    updated_at: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  edit: [produk: any];
}>();

const imageError = ref(false);

// Computed properties
const stockStatusClass = computed(() => {
  if (props.produk.stok <= 0) return "bg-red-100 text-red-800";
  if (props.produk.stok <= (props.produk.stok_minimum || 5))
    return "bg-orange-100 text-orange-800";
  return "bg-emerald-100 text-emerald-800";
});

const stockStatusText = computed(() => {
  if (props.produk.stok <= 0) return "Habis";
  if (props.produk.stok <= (props.produk.stok_minimum || 5))
    return "Stok Rendah";
  return "Tersedia";
});

const stockLevelPercentage = computed(() => {
  const minStock = props.produk.stok_minimum || 5;
  const maxStock = Math.max(minStock * 3, props.produk.stok, 100); // Estimate reasonable max
  return Math.min(Math.round((props.produk.stok / maxStock) * 100), 100);
});

const stockLevelClass = computed(() => {
  const percentage = stockLevelPercentage.value;
  if (percentage <= 20) return "bg-red-500";
  if (percentage <= 50) return "bg-orange-500";
  return "bg-emerald-500";
});

const daysInInventory = computed(() => {
  const created = new Date(props.produk.created_at);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Methods
const formatCurrency = (amount: number) => {
  if (!amount && amount !== 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
};

const adjustStock = () => {
  const toast = useToast();
  toast.info("Fitur adjust stok akan tersedia dari halaman utama");
};

const duplicateProduct = () => {
  const toast = useToast();
  toast.info("Fitur duplikasi produk akan segera tersedia");
};

// Prevent background scroll
onMounted(() => {
  document.body.style.overflow = "hidden";
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

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
