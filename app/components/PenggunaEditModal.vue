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
        class="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Edit Pengguna</h3>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Current ID Display -->
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="text-sm font-medium text-gray-700 mb-1">
              ID Pengguna:
            </div>
            <div class="text-lg font-bold text-gray-900">
              {{ pengguna.id_pengguna }}
            </div>
          </div>

          <!-- Nama -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.nama
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
              required
            />
            <div v-if="errors.nama" class="mt-1 text-sm text-red-600">
              {{ errors.nama }}
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="user@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
              required
            />
            <div v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </div>
          </div>

          <!-- Telepon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <input
              v-model="form.telepon"
              type="tel"
              placeholder="081234567890"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.telepon
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
            />
            <div v-if="errors.telepon" class="mt-1 text-sm text-red-600">
              {{ errors.telepon }}
            </div>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.role
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
              required
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="kasir">Kasir</option>
            </select>
            <div v-if="errors.role" class="mt-1 text-sm text-red-600">
              {{ errors.role }}
            </div>
          </div>

          <!-- Change Password Toggle -->
          <div class="flex items-center">
            <input
              id="changePassword"
              v-model="changePassword"
              type="checkbox"
              class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label for="changePassword" class="ml-2 text-sm text-gray-700">
              Ubah password
            </label>
          </div>

          <!-- Password Fields (only show if changePassword is true) -->
          <template v-if="changePassword">
            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password Baru <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Minimal 6 karakter"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="
                    errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  "
                  :required="changePassword"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="showPassword" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </div>
              <div v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </div>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="Ulangi password baru"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :class="
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                "
                :required="changePassword"
              />
              <div
                v-if="errors.confirmPassword"
                class="mt-1 text-sm text-red-600"
              >
                {{ errors.confirmPassword }}
              </div>
            </div>
          </template>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non-Aktif</option>
            </select>
          </div>

          <!-- Error Message -->
          <div
            v-if="submitError"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="text-sm text-red-600">{{ submitError }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              :disabled="loading"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <Edit v-else :size="16" />
              <span>{{ loading ? "Menyimpan..." : "Update Pengguna" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { X, Eye, EyeOff, Edit } from "lucide-vue-next";
import { supabase } from "~~/lib/supabaseClient";

interface Props {
  pengguna: {
    id: string;
    id_pengguna: string;
    nama: string;
    email: string;
    telepon?: string;
    role: "admin" | "kasir";
    status: "aktif" | "nonaktif";
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updated: [pengguna: any];
}>();

// Reactive state
const loading = ref(false);
const showPassword = ref(false);
const changePassword = ref(false);
const submitError = ref("");

const form = reactive({
  nama: "",
  email: "",
  telepon: "",
  role: "",
  password: "",
  confirmPassword: "",
  status: "aktif",
});

const errors = reactive({
  nama: "",
  email: "",
  telepon: "",
  role: "",
  password: "",
  confirmPassword: "",
});

// Methods
const loadFormData = () => {
  form.nama = props.pengguna.nama;
  form.email = props.pengguna.email;
  form.telepon = props.pengguna.telepon || "";
  form.role = props.pengguna.role;
  form.status = props.pengguna.status;
};

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  // Nama validation
  if (!form.nama || form.nama.length < 3) {
    errors.nama = "Nama harus minimal 3 karakter";
    isValid = false;
  }

  // Email validation
  if (!form.email) {
    errors.email = "Email wajib diisi";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format email tidak valid";
    isValid = false;
  }

  // Telepon validation (optional but must be valid if provided)
  if (form.telepon && !/^(\+62|62|0)[0-9]{9,13}$/.test(form.telepon)) {
    errors.telepon = "Format nomor telepon tidak valid";
    isValid = false;
  }

  // Role validation
  if (!form.role) {
    errors.role = "Role wajib dipilih";
    isValid = false;
  }

  // Password validation (only if changing password)
  if (changePassword.value) {
    if (!form.password || form.password.length < 6) {
      errors.password = "Password harus minimal 6 karakter";
      isValid = false;
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak cocok";
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  submitError.value = "";

  try {
    console.log("🔧 Updating pengguna:", props.pengguna.id_pengguna);

    // Prepare update data
    const updateData = {
      nama: form.nama,
      email: form.email,
      role: form.role,
      updated_at: new Date().toISOString(),
    };

    // Add telepon if provided
    if (form.telepon) {
      updateData.telepon = form.telepon;
    }

    // Update pengguna record
    const { data, error } = await supabase
      .from("pengguna")
      .update(updateData)
      .eq("id_pengguna", props.pengguna.id_pengguna)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating pengguna:", error);
      throw new Error(`Gagal update pengguna: ${error.message}`);
    }

    console.log("✅ Pengguna updated successfully:", data);

    // If changing password, update password hash in database
    if (changePassword.value && form.password) {
      console.log("🔧 Updating user password...");

      // Hash the password using bcrypt (you'll need to install bcryptjs)
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(form.password, 12);

      // Update password hash in pengguna table
      const { error: passwordError } = await supabase
        .from("pengguna")
        .update({ kata_sandi: hashedPassword })
        .eq("id_pengguna", props.pengguna.id_pengguna);

      if (passwordError) {
        console.warn("⚠️ Password update failed:", passwordError);

        // Show warning toast for password update failure
        if (typeof window !== "undefined" && (window as any).$toast) {
          (window as any).$toast.warning(
            "Data pengguna berhasil diperbarui, namun password gagal diubah",
            "Peringatan"
          );
        }
      } else {
        console.log("✅ Password updated successfully");

        // Show success toast for password update
        if (typeof window !== "undefined" && (window as any).$toast) {
          (window as any).$toast.success(
            "Password berhasil diperbarui",
            "Password Diperbarui"
          );
        }
      }
    }

    const updatedPengguna = {
      ...props.pengguna,
      nama: data.nama,
      email: data.email,
      telepon: data.no_hp || undefined,
      role: data.role,
      status: data.status,
      updated_at: data.updated_at,
    };

    // Emit success
    emit("updated", updatedPengguna);
  } catch (error: any) {
    console.error("❌ Error updating pengguna:", error);

    // Show error toast
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.error(
        error.message || "Gagal memperbarui pengguna. Silakan coba lagi.",
        "Gagal Memperbarui Pengguna"
      );
    }

    submitError.value =
      error.message || "Gagal memperbarui pengguna. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.body.style.overflow = "hidden";
  loadFormData();
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

/* Form animations */
input:focus,
select:focus {
  transition: all 0.2s ease;
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
