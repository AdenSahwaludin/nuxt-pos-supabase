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
        class="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Tambah Pengguna Baru
            </h3>
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
          <!-- Generated ID Preview -->
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div class="text-sm font-medium text-emerald-800 mb-1">
              ID Pengguna yang akan dibuat:
            </div>
            <div class="text-lg font-bold text-emerald-900">
              {{ generatedId }}
            </div>
            <div class="text-xs text-emerald-600 mt-1">
              Format: {{ nextNumber }}-{{ form.idSuffix || "XXX" }}
            </div>
          </div>

          <!-- ID Suffix -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Suffix ID <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.idSuffix"
              type="text"
              placeholder="Contoh: ADN, KSR"
              maxlength="4"
              pattern="[A-Z]{2,4}"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
              :class="
                errors.idSuffix
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
              required
            />
            <div v-if="errors.idSuffix" class="mt-1 text-sm text-red-600">
              {{ errors.idSuffix }}
            </div>
            <div class="mt-1 text-xs text-gray-500">
              2-4 huruf kapital untuk identifikasi pengguna
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

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
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
                required
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

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Ulangi password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
              required
            />
            <div
              v-if="errors.confirmPassword"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.confirmPassword }}
            </div>
          </div>

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
              <UserPlus v-else :size="16" />
              <span>{{ loading ? "Menyimpan..." : "Buat Pengguna" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted, watch } from "vue";
import { X, Eye, EyeOff, UserPlus } from "lucide-vue-next";

const emit = defineEmits<{
  close: [];
  created: [pengguna: any];
}>();

// Reactive state
const loading = ref(false);
const showPassword = ref(false);
const submitError = ref("");
const nextNumber = ref("001");

const form = reactive({
  idSuffix: "",
  nama: "",
  email: "",
  telepon: "",
  role: "",
  password: "",
  confirmPassword: "",
  status: "aktif",
});

const errors = reactive({
  idSuffix: "",
  nama: "",
  email: "",
  telepon: "",
  role: "",
  password: "",
  confirmPassword: "",
});

// Computed properties
const generatedId = computed(() => {
  return form.idSuffix
    ? `${nextNumber.value}-${form.idSuffix}`
    : `${nextNumber.value}-XXX`;
});

// Methods
const getNextNumber = async () => {
  try {
    // TODO: Get next number from API
    // For now, simulate getting next available number
    nextNumber.value = "003"; // This would come from API
  } catch (error) {
    console.error("Error getting next number:", error);
    nextNumber.value = "001";
  }
};

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  // ID Suffix validation
  if (!form.idSuffix) {
    errors.idSuffix = "Suffix ID wajib diisi";
    isValid = false;
  } else if (!/^[A-Z]{2,4}$/.test(form.idSuffix)) {
    errors.idSuffix = "Suffix harus 2-4 huruf kapital";
    isValid = false;
  }

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

  // Password validation
  if (!form.password || form.password.length < 6) {
    errors.password = "Password harus minimal 6 karakter";
    isValid = false;
  }

  // Confirm password validation
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password tidak cocok";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  submitError.value = "";

  try {
    // TODO: Implement API call to create user
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

    const newPengguna = {
      id: Date.now().toString(),
      id_pengguna: generatedId.value,
      nama: form.nama,
      email: form.email,
      telepon: form.telepon || undefined,
      role: form.role,
      status: form.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Emit success
    emit("created", newPengguna);
  } catch (error: any) {
    console.error("Error creating pengguna:", error);
    submitError.value =
      error.message || "Gagal membuat pengguna. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

// Auto-convert ID suffix to uppercase
watch(
  () => form.idSuffix,
  (newValue) => {
    form.idSuffix = newValue.toUpperCase();
  }
);

// Lifecycle
onMounted(() => {
  getNextNumber();
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
