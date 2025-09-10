<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 modal-backdrop transition-opacity"
      @click="$emit('cancel')"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle :size="24" class="text-red-500 mr-3" />
              {{ title || 'Konfirmasi Hapus' }}
            </h3>
            <button
              @click="$emit('cancel')"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Warning Icon & Message -->
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Trash2 :size="32" class="text-red-600" />
            </div>
            <h4 class="text-lg font-medium text-gray-900 mb-2">
              {{ confirmTitle || `Hapus ${entityType}?` }}
            </h4>
            <p class="text-gray-600">
              {{ message || `Anda yakin ingin menghapus ${entityType.toLowerCase()} "${itemName}"?` }}
            </p>
          </div>

          <!-- Item Details (if provided) -->
          <div v-if="itemDetails" class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-semibold text-sm"
              >
                {{ getInitials(itemDetails) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ getPrimaryText(itemDetails) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ getSecondaryText(itemDetails) }}
                </div>
                <div v-if="getTertiaryText(itemDetails)" class="text-xs text-gray-400 mt-1">
                  {{ getTertiaryText(itemDetails) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-start space-x-3">
              <AlertTriangle
                :size="20"
                class="text-red-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h5 class="text-sm font-medium text-red-800 mb-1">
                  Peringatan!
                </h5>
                <p class="text-sm text-red-700">
                  {{ warningMessage || `Tindakan ini tidak dapat dibatalkan. Semua data terkait ${entityType.toLowerCase()} ini akan hilang secara permanen.` }}
                </p>
              </div>
            </div>
          </div>

          <!-- Confirmation Input -->
          <div v-if="requireConfirmation" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ketik
              <span class="font-mono bg-gray-100 px-1 rounded">{{ confirmationKeyword }}</span>
              untuk mengonfirmasi:
            </label>
            <input
              v-model="confirmationText"
              type="text"
              :placeholder="`Ketik ${confirmationKeyword}`"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
              :class="
                confirmationText === confirmationKeyword ? 'border-red-300 bg-red-50' : ''
              "
            />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('cancel')"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              :disabled="isLoading"
            >
              Batal
            </button>
            <button
              @click="handleConfirm"
              :disabled="shouldDisableConfirm"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span
                v-if="isLoading"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <Trash2 v-else :size="16" />
              <span>{{ isLoading ? "Menghapus..." : (confirmText || `Hapus ${entityType}`) }}</span>
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
import { X, AlertTriangle, Trash2 } from "lucide-vue-next";

interface Props {
  // Basic props
  title?: string;
  entityType: string; // "Pengguna", "Kategori", "Pelanggan", "Produk", etc.
  itemName: string;
  
  // Content customization
  message?: string;
  confirmTitle?: string;
  warningMessage?: string;
  confirmText?: string;
  
  // Item details (optional for showing additional info)
  itemDetails?: any;
  
  // Confirmation settings
  requireConfirmation?: boolean;
  confirmationKeyword?: string;
  
  // Loading state
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  requireConfirmation: true,
  confirmationKeyword: "HAPUS",
  isLoading: false,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const confirmationText = ref("");

// Computed property to determine if confirm button should be disabled
const shouldDisableConfirm = computed(() => {
  if (props.isLoading) return true;
  if (props.requireConfirmation) {
    return confirmationText.value !== props.confirmationKeyword;
  }
  return false;
});

// Helper functions to extract display text from itemDetails
const getInitials = (itemDetails: any) => {
  if (!itemDetails) return "?";
  
  // For different entity types, extract initials differently
  if (props.entityType === "Pengguna") {
    if (itemDetails.id_pengguna) {
      const parts = itemDetails.id_pengguna.split("-");
      return parts.length > 1 ? parts[1] : parts[0];
    }
    if (itemDetails.nama) {
      const names = itemDetails.nama.split(" ");
      return names.length > 1 
        ? (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
  }
  
  if (props.entityType === "Pelanggan") {
    if (itemDetails.id_pelanggan?.startsWith("P")) {
      return itemDetails.id_pelanggan.substring(1);
    }
    if (itemDetails.nama) {
      const names = itemDetails.nama.split(" ");
      return names.length > 1 
        ? (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
  }
  
  if (props.entityType === "Kategori") {
    if (itemDetails.nama) {
      return itemDetails.nama
        .split(" ")
        .map((word: string) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  }
  
  // Default fallback
  if (itemDetails.nama) {
    return itemDetails.nama.charAt(0).toUpperCase();
  }
  
  return "?";
};

const getPrimaryText = (itemDetails: any) => {
  return itemDetails?.nama || itemDetails?.title || props.itemName || "-";
};

const getSecondaryText = (itemDetails: any) => {
  if (props.entityType === "Pengguna") {
    const parts = [];
    if (itemDetails?.email) parts.push(itemDetails.email);
    if (itemDetails?.id_pengguna) parts.push(itemDetails.id_pengguna);
    return parts.join(" • ") || "-";
  }
  
  if (props.entityType === "Pelanggan") {
    const parts = [];
    if (itemDetails?.email) parts.push(itemDetails.email);
    if (itemDetails?.id_pelanggan) parts.push(itemDetails.id_pelanggan);
    if (itemDetails?.telepon) parts.push(itemDetails.telepon);
    return parts.join(" • ") || "-";
  }
  
  if (props.entityType === "Kategori") {
    return itemDetails?.id_kategori ? `ID: ${itemDetails.id_kategori}` : "-";
  }
  
  // Default fallback
  return itemDetails?.id || itemDetails?.code || "-";
};

const getTertiaryText = (itemDetails: any) => {
  if (props.entityType === "Pengguna") {
    return itemDetails?.role ? `Role: ${itemDetails.role}` : null;
  }
  
  if (props.entityType === "Pelanggan") {
    const parts = [];
    if (itemDetails?.kota) parts.push(`Kota: ${itemDetails.kota}`);
    if (itemDetails?.allow_installment) parts.push("Kredit diizinkan");
    return parts.join(" • ") || null;
  }
  
  if (props.entityType === "Kategori") {
    const parts = [];
    if (itemDetails?.total_products !== undefined) {
      parts.push(`${itemDetails.total_products} produk`);
    }
    return parts.join(" • ") || null;
  }
  
  return null;
};

const handleConfirm = () => {
  if (!shouldDisableConfirm.value) {
    emit("confirm");
  }
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
