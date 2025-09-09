<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 modal-backdrop" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Tambah Pelanggan Baru
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
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="text-sm font-medium text-blue-800 mb-1">
              ID Pelanggan yang akan dibuat:
            </div>
            <div class="text-lg font-bold text-blue-900">{{ generatedId }}</div>
            <div class="text-xs text-blue-600 mt-1">
              Otomatis: {{ nextNumber }}
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

          <!-- Nomor HP -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomor HP
            </label>
            <input
              v-model="form.no_hp"
              type="tel"
              placeholder="081234567890"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.no_hp
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
            />
            <div v-if="errors.no_hp" class="mt-1 text-sm text-red-600">
              {{ errors.no_hp }}
            </div>
            <div class="mt-1 text-xs text-gray-500">
              Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
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
            />
            <div v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </div>
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Alamat
            </label>
            <textarea
              v-model="form.alamat"
              rows="3"
              placeholder="Masukkan alamat lengkap"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.alamat
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
            ></textarea>
            <div v-if="errors.alamat" class="mt-1 text-sm text-red-600">
              {{ errors.alamat }}
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              v-model="form.aktif"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Non-Aktif</option>
            </select>
          </div>

          <!-- Opsi Kredit -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">
              Pengaturan Kredit
            </h4>

            <!-- Allow Installment -->
            <div class="flex items-center mb-3">
              <input
                id="allowInstallment"
                v-model="form.allow_installment"
                type="checkbox"
                class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label for="allowInstallment" class="ml-2 text-sm text-gray-700">
                Boleh kredit/cicilan
              </label>
            </div>

            <!-- Credit Limit -->
            <div v-if="form.allow_installment">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Limit Kredit (Rp)
              </label>
              <input
                v-model="form.credit_limit"
                type="number"
                min="0"
                step="50000"
                placeholder="5000000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div class="mt-1 text-xs text-gray-500">
                Maksimal kredit yang diizinkan
              </div>
            </div>

            <!-- Max Tenor -->
            <div v-if="form.allow_installment" class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tenor Maksimal (Bulan)
              </label>
              <select
                v-model="form.max_tenor_bulan"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="3">3 Bulan</option>
                <option value="6">6 Bulan</option>
                <option value="12">12 Bulan</option>
                <option value="24">24 Bulan</option>
              </select>
            </div>

            <!-- Trust Score -->
            <div v-if="form.allow_installment" class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Trust Score (1-100)
              </label>
              <input
                v-model="form.trust_score"
                type="number"
                min="1"
                max="100"
                placeholder="75"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div class="mt-1 text-xs text-gray-500">
                Skor kepercayaan untuk evaluasi kredit
              </div>
            </div>
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
              <span>{{ loading ? "Menyimpan..." : "Buat Pelanggan" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from "vue";
import { supabase } from "~~/lib/supabaseClient";
import { X, UserPlus } from "lucide-vue-next";

const emit = defineEmits<{
  close: [];
  created: [pelanggan: any];
}>();

// Reactive state
const loading = ref(false);
const submitError = ref("");
const nextNumber = ref("P001");

const form = reactive({
  nama: "",
  no_hp: "",
  email: "",
  alamat: "",
  aktif: true,
  allow_installment: false,
  credit_limit: 0,
  max_tenor_bulan: 3,
  trust_score: 75,
});

const errors = reactive({
  nama: "",
  no_hp: "",
  email: "",
  alamat: "",
});

// Computed properties
const generatedId = computed(() => {
  return nextNumber.value;
});

// Methods
const getNextNumber = async () => {
  try {
    // TODO: Get next number from API
    // For now, simulate getting next available number
    nextNumber.value = "P003"; // This would come from API
  } catch (error) {
    console.error("Error getting next number:", error);
    nextNumber.value = "P001";
  }
};

const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Convert to +62 format
  if (cleaned.startsWith("08")) {
    return `+62${cleaned.substring(1)}`;
  } else if (cleaned.startsWith("62")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("8")) {
    return `+62${cleaned}`;
  }

  return phone;
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

  // No HP validation (optional but must be valid if provided)
  if (form.no_hp) {
    const normalizedPhone = normalizePhoneNumber(form.no_hp);
    if (!/^\+62[0-9]{9,13}$/.test(normalizedPhone)) {
      errors.no_hp = "Format nomor HP tidak valid";
      isValid = false;
    } else {
      // Update form with normalized phone
      form.no_hp = normalizedPhone;
    }
  }

  // Email validation (optional but must be valid if provided)
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format email tidak valid";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  submitError.value = "";

  try {
    console.log("📝 Creating new pelanggan...");

    // Prepare data for Supabase
    const pelangganData = {
      id_pelanggan: generatedId.value,
      nama: form.nama,
      email: form.email || null,
      telepon: form.no_hp || null,
      alamat: form.alamat || null,
      aktif: form.aktif,
      allow_installment: form.allow_installment,
      credit_limit: form.allow_installment ? form.credit_limit : 0,
      max_tenor_bulan: form.allow_installment ? form.max_tenor_bulan : 0,
      trust_score: form.allow_installment ? form.trust_score : 0,
    };

    console.log("📤 Sending data to Supabase:", pelangganData);

    // Insert into sbs.pelanggan table
    const { data, error } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .insert([pelangganData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw new Error(`Gagal membuat pelanggan: ${error.message}`);
    }

    console.log("✅ Pelanggan created successfully:", data);

    // Transform response data to match interface
    const newPelanggan = {
      id: data.id_pelanggan,
      id_pelanggan: data.id_pelanggan,
      nama: data.nama,
      email: data.email || undefined,
      telepon: data.telepon || undefined,
      alamat: data.alamat || undefined,
      aktif: data.aktif,
      tanggal_daftar: data.tanggal_daftar || data.created_at,
      allow_installment: data.allow_installment,
      credit_limit: data.credit_limit?.toString() || "0",
      max_tenor_bulan: data.max_tenor_bulan || 0,
      trust_score: data.trust_score?.toString() || "0",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    // Emit success
    emit("created", newPelanggan);
  } catch (error: any) {
    console.error("Error creating pelanggan:", error);
    submitError.value =
      error.message || "Gagal membuat pelanggan. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

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
select:focus,
textarea:focus {
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
