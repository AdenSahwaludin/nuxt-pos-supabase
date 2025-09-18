<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="fixed inset-0 modal-backdrop transition-opacity"
      @click="$emit('close')"
    ></div>
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-xl max-w-4xl w-full">
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
        >
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Eye :size="22" class="text-blue-500 mr-3" />
            Detail Produk
          </h3>
          <div class="flex items-center gap-2">
            <button
              @click="$emit('edit', produk)"
              class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              title="Edit"
            >
              <Edit :size="18" />
            </button>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X :size="18" class="text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Image -->
          <div class="space-y-4">
            <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                v-if="produk.gambar"
                :src="produk.gambar"
                :alt="produk.nama"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-center"
              >
                <div>
                  <Package :size="56" class="text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500 text-sm">Tidak ada gambar</p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Status Stok</span>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="stockStatusClass"
                >
                  {{ stockStatusText }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Nilai Stok</span>
                <span class="text-sm font-bold text-emerald-600">{{
                  formatCurrency(produk.harga * produk.stok)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic Info -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Info :size="18" class="text-blue-500 mr-2" />
                Informasi Dasar
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Barcode (EAN-13)</label
                  >
                  <p class="text-sm font-mono bg-gray-50 rounded px-3 py-2">
                    {{ produk.id_produk }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Nomor BPOM</label
                  >
                  <p class="text-sm bg-gray-50 rounded px-3 py-2">
                    {{ produk.nomor_bpom || "-" }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Kategori</label
                  >
                  <span
                    class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
                    >{{ produk.kategori_nama || "Tanpa Kategori" }}</span
                  >
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Unit</label>
                  <p class="text-sm">{{ produk.unit || "pcs" }}</p>
                </div>
              </div>
            </div>

            <!-- Pricing & Stock -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <DollarSign :size="18" class="text-emerald-500 mr-2" />
                Harga & Stok
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Harga Jual</label
                  >
                  <p class="text-xl font-bold text-emerald-600">
                    {{ formatCurrency(produk.harga) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Biaya Produk</label
                  >
                  <p class="text-lg font-semibold text-gray-900">
                    {{ formatCurrency(produk.biaya_produk || 0) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Stok / Batas</label
                  >
                  <p class="text-lg font-semibold text-gray-900">
                    {{ produk.stok }} / {{ produk.batas_stok || 5 }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Pack Info -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                Informasi Pack
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Pack Unit</label
                  >
                  <p class="text-sm">{{ produk.pack_unit || "-" }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Pack Size</label
                  >
                  <p class="text-sm">{{ produk.pack_size ?? "-" }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Harga Pack</label
                  >
                  <p class="text-sm">
                    {{
                      produk.harga_pack != null
                        ? formatCurrency(produk.harga_pack)
                        : "-"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Tier Pricing -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                Tier Pricing
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Minimal Beli (Unit)</label
                  >
                  <p class="text-sm">{{ produk.qty_tier1 ?? "-" }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Harga per Unit (Diskon)</label
                  >
                  <p class="text-sm">
                    {{
                      produk.harga_tier1 != null
                        ? formatCurrency(produk.harga_tier1)
                        : "-"
                    }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Minimal Beli (Pack)</label
                  >
                  <p class="text-sm">
                    {{
                      produk.harga_tier_qty != null
                        ? formatCurrency(produk.harga_tier_qty)
                        : "-"
                    }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Harga per Pack (Diskon)</label
                  >
                  <p class="text-sm">
                    {{
                      produk.harga_tier_pack != null
                        ? formatCurrency(produk.harga_tier_pack)
                        : "-"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Timestamps -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Clock :size="18" class="text-gray-500 mr-2" />
                Riwayat
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Dibuat</label>
                  <div class="flex items-center gap-2">
                    <Calendar :size="16" class="text-gray-400" />
                    <p class="text-sm">{{ formatDate(produk.created_at) }}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1"
                    >Diperbarui</label
                  >
                  <div class="flex items-center gap-2">
                    <RefreshCw :size="16" class="text-gray-400" />
                    <p class="text-sm">{{ formatDate(produk.updated_at) }}</p>
                  </div>
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
import { computed } from "vue";
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
} from "lucide-vue-next";

interface ProdukDetail {
  id: string;
  id_produk: string;
  nama: string;
  gambar?: string;
  nomor_bpom?: string;
  kategori_id: number;
  kategori_nama?: string;
  harga: number;
  biaya_produk?: number;
  stok: number;
  batas_stok?: number;
  unit?: string;
  pack_unit?: string;
  pack_size?: number;
  harga_pack?: number;
  qty_tier1?: number;
  harga_tier1?: number;
  harga_tier_qty?: number;
  harga_tier_pack?: number;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{ produk: ProdukDetail }>();
defineEmits<{ close: []; edit: [produk: any] }>();

const stockStatusClass = computed(() => {
  if (props.produk.stok <= 0) return "bg-red-100 text-red-800";
  if (props.produk.stok <= (props.produk.batas_stok || 5))
    return "bg-orange-100 text-orange-800";
  return "bg-emerald-100 text-emerald-800";
});

const stockStatusText = computed(() => {
  if (props.produk.stok <= 0) return "Habis";
  if (props.produk.stok <= (props.produk.batas_stok || 5)) return "Stok Rendah";
  return "Tersedia";
});

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
}
</style>
