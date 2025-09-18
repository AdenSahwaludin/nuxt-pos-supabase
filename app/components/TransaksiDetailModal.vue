<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Detail Transaksi</h2>
          <p class="text-sm text-gray-600">{{ transaksi.nomor_transaksi }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Informasi Umum -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Kiri: Info Transaksi -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">
              Informasi Transaksi
            </h3>

            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Nomor Transaksi:</span>
                <span class="text-sm font-medium text-gray-900">{{
                  transaksi.nomor_transaksi
                }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Tanggal:</span>
                <span class="text-sm font-medium text-gray-900">{{
                  formatDateTime(transaksi.tanggal)
                }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Status:</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(transaksi.status_pembayaran)"
                >
                  {{ transaksi.status_pembayaran }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Metode Bayar:</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getMetodeBayarClass(transaksi.metode_bayar)"
                >
                  {{ transaksi.metode_bayar }}
                </span>
              </div>

              <div v-if="transaksi.is_locked" class="flex justify-between">
                <span class="text-sm text-gray-600">Status Kunci:</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Terkunci
                </span>
              </div>

              <!-- Remove catatan section since it doesn't exist in new schema -->

              <div
                v-if="transaksi.midtrans_order_id"
                class="pt-2 border-t border-gray-200"
              >
                <span class="text-sm text-gray-600">Midtrans Order ID:</span>
                <p class="text-sm text-gray-900 mt-1">
                  {{ transaksi.midtrans_order_id }}
                </p>
              </div>
            </div>
          </div>

          <!-- Kanan: Info Pelanggan & Kasir -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">
              Informasi Pelanggan & Kasir
            </h3>

            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <!-- Pelanggan -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">
                  Pelanggan
                </h4>
                <div class="space-y-1">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Nama:</span>
                    <span class="text-sm font-medium text-gray-900">
                      {{ transaksi.pelanggan?.nama || "-" }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Telepon:</span>
                    <span class="text-sm font-medium text-gray-900">
                      {{ transaksi.pelanggan?.telepon || "-" }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Kasir -->
              <div class="pt-3 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Kasir</h4>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Nama:</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    transaksi.kasir?.nama || "-"
                  }}</span>
                </div>
              </div>

              <!-- Midtrans Info (jika ada) -->
              <div
                v-if="transaksi.midtrans_order_id"
                class="pt-3 border-t border-gray-200"
              >
                <h4 class="text-sm font-medium text-gray-700 mb-2">
                  Info Midtrans
                </h4>
                <div class="space-y-1">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Order ID:</span>
                    <span class="text-sm font-medium text-gray-900">{{
                      transaksi.midtrans_order_id
                    }}</span>
                  </div>
                  <div
                    v-if="transaksi.midtrans_transaction_id"
                    class="flex justify-between"
                  >
                    <span class="text-sm text-gray-600">Transaction ID:</span>
                    <span class="text-sm font-medium text-gray-900">{{
                      transaksi.midtrans_transaction_id
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daftar Item -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Daftar Item</h3>

          <div
            class="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Produk
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Harga Satuan
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jumlah
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Diskon
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in transaksiItems" :key="item.id_detail">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ item.nama_produk }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ formatCurrency(item.harga_satuan) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ item.jumlah }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      <span v-if="item.diskon_item > 0">
                        {{ formatCurrency(item.diskon_item) }}
                      </span>
                      <span v-else>-</span>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatCurrency(item.subtotal) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Pembayaran -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Rincian Pembayaran
          </h3>

          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600"
                >Subtotal ({{ transaksi.total_item }} item):</span
              >
              <span class="text-sm text-gray-900">{{
                formatCurrency(transaksi.subtotal)
              }}</span>
            </div>

            <div v-if="transaksi.diskon > 0" class="flex justify-between">
              <span class="text-sm text-gray-600">Diskon:</span>
              <span class="text-sm text-red-600"
                >-{{ formatCurrency(transaksi.diskon) }}</span
              >
            </div>

            <div v-if="transaksi.pajak > 0" class="flex justify-between">
              <span class="text-sm text-gray-600">Pajak:</span>
              <span class="text-sm text-gray-900">{{
                formatCurrency(transaksi.pajak)
              }}</span>
            </div>

            <div
              v-if="transaksi.biaya_pengiriman > 0"
              class="flex justify-between"
            >
              <span class="text-sm text-gray-600">Biaya Pengiriman:</span>
              <span class="text-sm text-gray-900">{{
                formatCurrency(transaksi.biaya_pengiriman)
              }}</span>
            </div>

            <div class="border-t border-gray-200 pt-2">
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900"
                  >Total Bayar:</span
                >
                <span class="text-base font-bold text-gray-900">{{
                  formatCurrency(transaksi.total)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit Trail (jika ada void) -->
        <div
          v-if="transaksi.status_pembayaran === 'VOID' && transaksi.void_reason"
          class="bg-red-50 rounded-lg p-4"
        >
          <h3 class="text-lg font-medium text-red-900 mb-2">Informasi Void</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-red-700">Alasan:</span>
              <span class="text-sm text-red-900">{{
                transaksi.void_reason
              }}</span>
            </div>
            <div v-if="transaksi.void_at" class="flex justify-between">
              <span class="text-sm text-red-700">Waktu Void:</span>
              <span class="text-sm text-red-900">{{
                formatDateTime(transaksi.void_at)
              }}</span>
            </div>
            <div v-if="transaksi.void_by_user" class="flex justify-between">
              <span class="text-sm text-red-700">Oleh:</span>
              <span class="text-sm text-red-900">{{
                transaksi.void_by_user?.nama || "-"
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div
        class="flex items-center justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200"
      >
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Tutup
        </button>

        <button
          @click="$emit('print', transaksi)"
          class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        >
          Cetak Struk
        </button>

        <button
          v-if="transaksi.status_pembayaran === 'PENDING'"
          @click="$emit('refresh', transaksi)"
          class="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors"
        >
          Refresh Status
        </button>

        <button
          v-if="canVoid"
          @click="$emit('void', transaksi)"
          class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Void Transaksi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSupabase } from "~~/composables/useSupabase";

interface TransaksiItem {
  id_detail: number;
  nama_produk: string;
  harga_satuan: number;
  jumlah: number;
  diskon_item: number;
  subtotal: number;
}

interface Transaksi {
  nomor_transaksi: string;
  tanggal: string;
  total: number;
  total_item: number;
  subtotal: number;
  diskon: number;
  pajak: number;
  biaya_pengiriman: number;
  metode_bayar: string;
  status_pembayaran: string;
  is_locked: boolean;
  paid_at?: string;
  id_pelanggan: string;
  id_kasir: string;
  pelanggan?: {
    nama: string;
    telepon: string;
  };
  kasir?: {
    nama: string;
  };
  midtrans_order_id?: string;
  midtrans_transaction_id?: string;
  created_at: string;
  updated_at: string;
  // Void info (if needed)
  void_reason?: string;
  void_at?: string;
  void_by_user?: {
    nama: string;
  };
}

// Props
const props = defineProps<{
  transaksi: Transaksi;
}>();

// Emits
defineEmits<{
  close: [];
  print: [transaksi: Transaksi];
  void: [transaksi: Transaksi];
  refresh: [transaksi: Transaksi];
}>();

// Reactive data
const transaksiItems = ref<TransaksiItem[]>([]);
const loading = ref(false);

// Computed
const canVoid = computed(() => {
  return (
    props.transaksi.status_pembayaran === "PAID" && !props.transaksi.is_locked
  );
});

// Methods
const fetchTransaksiItems = async () => {
  loading.value = true;
  try {
    const supabase = useSupabase();

    const { data, error } = await supabase
      .from("sbs.transaksi_detail")
      .select("*")
      .eq("nomor_transaksi", props.transaksi.nomor_transaksi)
      .order("id_detail");

    if (error) throw error;

    transaksiItems.value = data || [];
  } catch (error) {
    console.error("Error fetching transaksi items:", error);
    // Simple console log instead of toast for now
    console.log("Gagal memuat detail item transaksi");
  } finally {
    loading.value = false;
  }
};

// Utility methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status: string): string => {
  const classes = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
    VOID: "bg-gray-100 text-gray-800",
    REFUNDED: "bg-purple-100 text-purple-800",
  };
  return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

const getMetodeBayarClass = (metode: string): string => {
  const classes = {
    TUNAI: "bg-blue-100 text-blue-800",
    QRIS: "bg-green-100 text-green-800",
    VA_BCA: "bg-blue-100 text-blue-800",
    VA_BNI: "bg-orange-100 text-orange-800",
    GOPAY: "bg-green-100 text-green-800",
    OVO: "bg-purple-100 text-purple-800",
  };
  return classes[metode as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

// Lifecycle
onMounted(() => {
  fetchTransaksiItems();
});
</script>
