<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Detail Pengguna</h3>
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
          <!-- User Avatar & Basic Info -->
          <div class="flex items-center space-x-4 mb-6">
            <div
              class="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl"
            >
              {{ getUserInitials() }}
            </div>
            <div>
              <h4 class="text-xl font-semibold text-gray-900">
                {{ pengguna.nama }}
              </h4>
              <p class="text-sm text-gray-500">{{ pengguna.id_pengguna }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    pengguna.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  "
                >
                  {{ pengguna.role }}
                </span>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    pengguna.status === 'aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ pengguna.status }}
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
                    pengguna.nama
                  }}</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Email</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{
                      pengguna.email
                    }}</span>
                    <button
                      @click="copyToClipboard(pengguna.email)"
                      class="p-1 hover:bg-gray-100 rounded"
                      title="Salin email"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Nomor Telepon</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{
                      pengguna.telepon || "-"
                    }}</span>
                    <button
                      v-if="pengguna.telepon"
                      @click="copyToClipboard(pengguna.telepon)"
                      class="p-1 hover:bg-gray-100 rounded"
                      title="Salin nomor telepon"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
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
                  <span class="text-sm text-gray-600">ID Pengguna</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900 font-mono">{{
                      pengguna.id_pengguna
                    }}</span>
                    <button
                      @click="copyToClipboard(pengguna.id_pengguna)"
                      class="p-1 hover:bg-gray-100 rounded"
                      title="Salin ID pengguna"
                    >
                      <Copy :size="12" class="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Role</span>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="
                      pengguna.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    "
                  >
                    {{ pengguna.role }}
                  </span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Status</span>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="
                      pengguna.status === 'aktif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ pengguna.status }}
                  </span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm text-gray-600">Terakhir Login</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{
                      pengguna.terakhir_login
                        ? formatDateTime(pengguna.terakhir_login)
                        : "Belum pernah login"
                    }}
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
                    formatDateTime(pengguna.created_at)
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600">Diperbarui</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    formatDateTime(pengguna.updated_at)
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
              @click="$emit('edit', pengguna)"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Edit :size="16" />
              <span>Edit Pengguna</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { X, User, Settings, Clock, Copy, Edit } from "lucide-vue-next";

interface Props {
  pengguna: {
    id: string;
    id_pengguna: string;
    nama: string;
    email: string;
    telepon?: string;
    role: "admin" | "kasir";
    status: "aktif" | "nonaktif";
    created_at: string;
    updated_at: string;
    terakhir_login?: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  edit: [pengguna: any];
}>();

// Methods
const getUserInitials = () => {
  if (props.pengguna.id_pengguna) {
    const parts = props.pengguna.id_pengguna.split("-");
    return parts.length > 1
      ? parts[1]
      : props.pengguna.nama.charAt(0).toUpperCase();
  }

  const names = props.pengguna.nama.split(" ");
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

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    window.$toast?.success("Berhasil disalin ke clipboard");
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    window.$toast?.error("Gagal menyalin ke clipboard");
  }
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
