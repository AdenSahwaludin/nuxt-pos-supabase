<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 modal-backdrop" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Detail Pelanggan
            </h3>
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
          <!-- Customer Avatar & Basic Info -->
          <div class="flex items-center space-x-4 mb-6">
            <div
              class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg"
            >
              {{ getCustomerInitials() }}
            </div>
            <div>
              <h4 class="text-xl font-semibold text-gray-900">
                {{ pelanggan.nama }}
              </h4>
              <p class="text-sm text-gray-500">{{ pelanggan.id_pelanggan }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    pelanggan.aktif
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ pelanggan.aktif ? "Aktif" : "Nonaktif" }}
                </span>
                <span
                  v-if="pelanggan.allow_installment"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800"
                >
                  Kredit Diizinkan
                </span>
              </div>
            </div>
          </div>

          <!-- Detailed Information -->
          <div class="space-y-4">
            <!-- Personal Information -->
            <div>
              <h5
                class="text-sm font-semibold text-gray-900 mb-3 flex items-center"
              >
                <User :size="16" class="mr-2 text-gray-600" />
                Informasi Personal
              </h5>
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Nama Lengkap</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    pelanggan.nama
                  }}</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Nomor HP</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{
                      pelanggan.no_hp || "-"
                    }}</span>
                    <button
                      v-if="pelanggan.no_hp"
                      @click="copyToClipboard(pelanggan.no_hp)"
                      class="p-1 hover:bg-gray-100 rounded"
                      title="Salin nomor HP"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
                    <button
                      v-if="pelanggan.no_hp"
                      @click="openWhatsApp(pelanggan.no_hp)"
                      class="p-1 hover:bg-green-100 rounded"
                      title="Buka WhatsApp"
                    >
                      <MessageCircle :size="12" class="text-green-600" />
                    </button>
                  </div>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Email</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{
                      pelanggan.email || "-"
                    }}</span>
                    <button
                      v-if="pelanggan.email"
                      @click="copyToClipboard(pelanggan.email)"
                      class="p-1 hover:bg-gray-100 rounded"
                      title="Salin email"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div
                  class="flex justify-between items-start py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Alamat</span>
                  <div class="flex items-start space-x-2 text-right max-w-xs">
                    <span class="text-sm font-medium text-gray-900">{{
                      pelanggan.alamat || "-"
                    }}</span>
                    <button
                      v-if="pelanggan.alamat"
                      @click="copyToClipboard(pelanggan.alamat)"
                      class="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                      title="Salin alamat"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Credit Information -->
            <div v-if="pelanggan.allow_installment">
              <h5
                class="text-sm font-semibold text-gray-900 mb-3 flex items-center"
              >
                <CreditCard :size="16" class="mr-2 text-gray-600" />
                Informasi Kredit
              </h5>
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Status Kredit</span>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800"
                  >
                    Diizinkan
                  </span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Limit Kredit</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    formatCurrency(pelanggan.credit_limit || 0)
                  }}</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Tenor Maksimal</span>
                  <span class="text-sm font-medium text-gray-900"
                    >{{ pelanggan.max_tenor_bulan || 3 }} Bulan</span
                  >
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Trust Score</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :class="getTrustScoreColor(pelanggan.trust_score || 75)"
                        :style="{ width: `${pelanggan.trust_score || 75}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900"
                      >{{ pelanggan.trust_score || 75 }}/100</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- System Information -->
            <div>
              <h5
                class="text-sm font-semibold text-gray-900 mb-3 flex items-center"
              >
                <Settings :size="16" class="mr-2 text-gray-600" />
                Informasi Sistem
              </h5>
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">ID Pelanggan</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900 font-mono">{{
                      pelanggan.id_pelanggan
                    }}</span>
                    <button
                      @click="copyToClipboard(pelanggan.id_pelanggan)"
                      class="p-1 hover:bg-gray-100 rounded"
                      title="Salin ID pelanggan"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Status</span>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="
                      pelanggan.aktif
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ pelanggan.aktif ? "Aktif" : "Nonaktif" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Audit Information -->
            <div>
              <h5
                class="text-sm font-semibold text-gray-900 mb-3 flex items-center"
              >
                <Clock :size="16" class="mr-2 text-gray-600" />
                Informasi Audit
              </h5>
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Dibuat</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    formatDateTime(pelanggan.created_at)
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600">Diperbarui</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    formatDateTime(pelanggan.updated_at)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Tutup
            </button>
            <button
              @click="
                () => {
                  $emit('edit', pelanggan);
                  $emit('close');
                }
              "
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Edit :size="16" />
              <span>Edit Pelanggan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  X,
  User,
  Settings,
  Clock,
  Copy,
  Edit,
  CreditCard,
  MessageCircle,
} from "lucide-vue-next";

interface Props {
  pelanggan: {
    id: string;
    id_pelanggan: string;
    nama: string;
    no_hp?: string;
    email?: string;
    alamat?: string;
    aktif: boolean;
    allow_installment?: boolean;
    credit_limit?: number;
    max_tenor_bulan?: number;
    trust_score?: number;
    created_at: string;
    updated_at: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  edit: [pelanggan: any];
}>();

// Methods
const getCustomerInitials = () => {
  if (props.pelanggan.id_pelanggan?.startsWith("P")) {
    return props.pelanggan.id_pelanggan.substring(1);
  }

  const names = props.pelanggan.nama.split(" ");
  return names.length > 1
    ? (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
    : names[0].charAt(0).toUpperCase();
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getTrustScoreColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    window.$toast?.success("Berhasil disalin ke clipboard");
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    window.$toast?.error("Gagal menyalin ke clipboard");
  }
};

const openWhatsApp = (phoneNumber: string) => {
  // Clean phone number and format for WhatsApp
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const waNumber = cleanNumber.startsWith("62")
    ? cleanNumber
    : `62${cleanNumber.substring(1)}`;
  const waUrl = `https://wa.me/${waNumber}`;
  window.open(waUrl, "_blank");
};
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
