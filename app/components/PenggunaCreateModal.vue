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
              maxlength="3"
              pattern="[A-Z]{3}"
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
              Tepat 3 huruf kapital untuk identifikasi pengguna (contoh: ADN,
              KSR)
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
              @input="formatPhoneInput"
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
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
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
              <option value="nonaktif">Non-Aktif</option>
              <option value="aktif">Aktif</option>
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
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
} from "vue";
import { X, Eye, EyeOff, UserPlus } from "lucide-vue-next";
import { supabase } from "~~/lib/supabaseClient";
import bcrypt from "bcryptjs";

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
  role: "kasir", // Default to kasir
  password: "",
  confirmPassword: "",
  status: "nonaktif", // Default to nonaktif
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
    console.log("🔧 Getting next pengguna number...");

    // Get the latest pengguna to determine next number
    const { data: latestPengguna, error } = await supabase
      .from("pengguna")
      .select("id_pengguna")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("❌ Error getting latest pengguna:", error);
      nextNumber.value = "001"; // Default fallback
      return;
    }

    if (latestPengguna && latestPengguna.length > 0) {
      const lastId = latestPengguna[0].id_pengguna;
      console.log("📝 Latest ID:", lastId);

      // Extract number from format like "001-ABC" (7 characters total)
      const parts = lastId.split("-");
      if (
        parts.length === 2 &&
        parts[0].length === 3 &&
        parts[1].length === 3
      ) {
        const lastNumber = parseInt(parts[0]);
        const nextNum = lastNumber + 1;
        nextNumber.value = String(nextNum).padStart(3, "0");
      } else {
        console.log("⚠️ Invalid ID format, defaulting to 001");
        nextNumber.value = "001";
      }
    } else {
      console.log("📭 No existing pengguna found, starting with 001");
      nextNumber.value = "001";
    }

    console.log("✅ Next number:", nextNumber.value);
  } catch (error) {
    console.error("❌ Error getting next number:", error);
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
  } else if (!/^[A-Z]{3}$/.test(form.idSuffix)) {
    errors.idSuffix = "Suffix harus tepat 3 huruf kapital (contoh: ADN)";
    isValid = false;
  } else if (form.idSuffix.length > 3) {
    errors.idSuffix = "Suffix maksimal 3 karakter";
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

  // Telepon validation (must be numbers only if provided)
  if (form.telepon && !/^[0-9+\-\s()]+$/.test(form.telepon)) {
    errors.telepon = "Nomor telepon hanya boleh berisi angka";
    isValid = false;
  } else if (
    form.telepon &&
    !/^(\+62|62|0)[0-9]{9,13}$/.test(form.telepon.replace(/[\s\-()]/g, ""))
  ) {
    errors.telepon = "Format nomor telepon tidak valid (contoh: 081234567890)";
    isValid = false;
  }

  // Role validation (should always have a value since kasir is default)
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
    console.log("🔧 Creating new pengguna...");

    // Step 1: Create user in Supabase Auth
    console.log("📝 Creating auth user for:", form.email);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nama: form.nama,
          role: form.role,
        },
      },
    });

    if (authError) {
      console.error("❌ Auth creation error:", authError);
      throw new Error("Gagal membuat akun: " + authError.message);
    }

    if (!authData.user) {
      throw new Error("Gagal membuat user di sistem auth");
    }

    console.log("✅ Auth user created:", authData.user.id);

    // Step 2: Create profile in pengguna table
    console.log("📝 Creating pengguna profile...");
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(form.password, 10);
    const penggunaData = {
      user_id: authData.user.id,
      id_pengguna: generatedId.value,
      nama: form.nama,
      email: form.email,
      telepon: form.telepon || null,
      role: form.role,
      kata_sandi: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: profileData, error: profileError } = await supabase
      .from("pengguna")
      .insert([penggunaData])
      .select()
      .single();

    if (profileError) {
      console.error("❌ Profile creation error:", profileError);
      // Try to cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error("Gagal membuat profil pengguna: " + profileError.message);
    }

    console.log("✅ Pengguna profile created:", profileData);

    // Transform for component response
    const newPengguna = {
      id: profileData.id_pengguna,
      id_pengguna: profileData.id_pengguna,
      nama: profileData.nama,
      email: profileData.email,
      telepon: profileData.telepon || undefined,
      role: profileData.role,
      status: profileData.aktif ? "aktif" : "nonaktif",
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
    };

    console.log("🎉 New pengguna created successfully");

    // Emit success
    emit("created", newPengguna);
  } catch (error: any) {
    console.error("❌ Error creating pengguna:", error);

    // Show error toast
    if (typeof window !== "undefined" && (window as any).$toast) {
      (window as any).$toast.error(
        error.message || "Gagal membuat pengguna. Silakan coba lagi.",
        "Gagal Membuat Pengguna"
      );
    }

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

// Format phone input to only allow numbers
const formatPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  // Remove any non-numeric characters except + at the beginning
  value = value.replace(/[^\d+]/g, "");

  // Only allow + at the beginning
  if (value.includes("+") && !value.startsWith("+")) {
    value = value.replace(/\+/g, "");
  }

  // If it starts with +, ensure it's +62
  if (value.startsWith("+") && !value.startsWith("+62")) {
    value = "+62" + value.substring(1).replace(/\+/g, "");
  }

  form.telepon = value;
};

// Lifecycle
onMounted(() => {
  document.body.style.overflow = "hidden";
  getNextNumber();
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
