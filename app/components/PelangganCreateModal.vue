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
              type="text"
              inputmode="numeric"
              placeholder="081234567890"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="
                errors.no_hp
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : ''
              "
              @input="onPhoneInput"
            />
            <div v-if="errors.no_hp" class="mt-1 text-sm text-red-600">
              {{ errors.no_hp }}
            </div>
            <div class="mt-1 text-xs text-gray-500">
              Format: 08xxxxxxxxxx atau +62xxxxxxxxxx (hanya angka)
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

          <!-- Status (default Non-Aktif, disabled) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              v-model="form.aktif"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              <option :value="false">Non-Aktif (Default)</option>
            </select>
            <div class="mt-1 text-xs text-gray-500">
              Status default untuk pelanggan baru
            </div>
          </div>

          <!-- Pengaturan Kredit (otomatis berdasarkan Limit Kredit) -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">
              Pengaturan Kredit
            </h4>

            <!-- Credit Limit -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Limit Kredit (Rp)
              </label>
              <input
                v-model.number="form.credit_limit"
                type="number"
                min="0"
                step="50000"
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div class="mt-1 text-xs text-gray-500">
                Kredit/cicilan aktif jika limit > 0
              </div>
            </div>

            <!-- Max Tenor -->
            <div v-if="form.credit_limit > 0" class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tenor Maksimal (Bulan) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.max_tenor_bulan"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :class="
                  errors.max_tenor_bulan
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                "
              >
                <option value="3">3 Bulan</option>
                <option value="6">6 Bulan</option>
                <option value="12">12 Bulan</option>
                <option value="24">24 Bulan</option>
              </select>
              <div
                v-if="errors.max_tenor_bulan"
                class="mt-1 text-sm text-red-600"
              >
                {{ errors.max_tenor_bulan }}
              </div>
            </div>

            <!-- Trust Score -->
            <div v-if="form.credit_limit > 0" class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Trust Score (1-100) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.trust_score"
                type="number"
                min="1"
                max="100"
                placeholder="75"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :class="
                  errors.trust_score
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                "
              />
              <div v-if="errors.trust_score" class="mt-1 text-sm text-red-600">
                {{ errors.trust_score }}
              </div>
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
const nextNumber = ref("P");

const form = reactive({
  nama: "",
  no_hp: "",
  email: "",
  alamat: "",
  aktif: false, // default nonaktif
  credit_limit: 0,
  max_tenor_bulan: 3,
  trust_score: 75,
});

const errors = reactive({
  nama: "",
  no_hp: "",
  email: "",
  alamat: "",
  max_tenor_bulan: "",
  trust_score: "",
});

// Computed properties
const generatedId = computed(() => {
  return nextNumber.value;
});

// Methods
const getNextNumber = async () => {
  try {
    const { data, error } = await supabase
      .schema("sbs")
      .from("pelanggan")
      .select("id_pelanggan")
      .order("id_pelanggan", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const lastId = data[0].id_pelanggan;
      const num = parseInt(lastId.slice(1), 10) + 1;
      nextNumber.value = `P${num.toString().padStart(3, "0")}`;
    } else {
      nextNumber.value = "P001";
    }
  } catch (error) {
    console.error("Error getting next number:", error);
    nextNumber.value = "P001";
  }
};

// Handle phone input: keep spaces visible while typing
// Rules:
// - If user types '+', auto-expand to '+628'
// - For '+62' numbers: display '+62' + 3-digit provider (e.g. 812), then groups of 4 (e.g. +62812 1234 1234)
// - For local numbers starting with '0': group every 4 digits (e.g. 0812 1234 1234)
const onPhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Auto-expand single '+' to '+628'
  if (value === "+") value = "+628";

  // Keep only digits and optional leading '+'
  value = value.replace(/[^\d+]/g, "");

  let formatted = "";
  if (value.startsWith("+")) {
    // Ensure '+62' country code
    if (!value.startsWith("+62")) {
      value = "+62" + value.replace(/^\+/, "");
    }
    const digits = value.replace(/\D/g, ""); // e.g., 62812...
    let rest = digits.slice(2); // drop '62'
    // First block after +62 is provider (up to 3 digits, e.g., 812)
    const firstBlock = rest.slice(0, 3);
    let tail = rest.slice(3);
    formatted = "+62" + firstBlock;
    if (tail.length) {
      const groups: string[] = [];
      if (tail.length <= 4) {
        groups.push(tail);
      } else {
        // Always take the first 4 digits
        groups.push(tail.slice(0, 4));
        tail = tail.slice(4);
        // Then chunk by 4, but avoid a trailing 1-digit group by merging to 5
        while (tail.length) {
          if (tail.length === 5) {
            groups.push(tail);
            break;
          }
          groups.push(tail.slice(0, 4));
          tail = tail.slice(4);
        }
      }
      formatted += " " + groups.join(" ");
    }
  } else {
    // Local format: group every 4 digits
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g) || (digits ? [digits] : []);
    formatted = groups.join(" ");
  }

  // Persist formatted string so spaces remain visible
  form.no_hp = formatted;
  input.value = formatted;
};

// Load next ID on mount
onMounted(() => {
  getNextNumber();
});

const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Convert Indonesian country code to leading zero
  if (cleaned.startsWith("62")) {
    return "0" + cleaned.slice(2);
  }
  // Ensure leading zero
  if (!cleaned.startsWith("0")) {
    return "0" + cleaned;
  }
  return cleaned;
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

  // Minimum phone length
  const digitsCount = form.no_hp.replace(/\D/g, "").length;
  if (form.no_hp && digitsCount < 10) {
    errors.no_hp = "Nomor HP minimal 10 digit";
    isValid = false;
  }
  // No HP validation (optional but must be valid if provided)
  if (form.no_hp) {
    const normalizedPhone = normalizePhoneNumber(form.no_hp);
    // After normalization we expect a leading '0' local number with 10-14 digits
    if (!/^0\d{9,13}$/.test(normalizedPhone)) {
      errors.no_hp = "Format nomor HP tidak valid";
      isValid = false;
    }
  }

  // Credit logic: tenor and trust score required if credit_limit > 0
  if (form.credit_limit > 0) {
    if (!form.max_tenor_bulan) {
      errors.max_tenor_bulan = "Tenor wajib diisi jika kredit aktif";
      isValid = false;
    }
    if (!form.trust_score || form.trust_score < 1 || form.trust_score > 100) {
      errors.trust_score = "Trust score wajib diisi (1-100) jika kredit aktif";
      isValid = false;
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

    // Normalize phone number on save
    const normalizedPhone = normalizePhoneNumber(form.no_hp);
    const pelangganData = {
      id_pelanggan: generatedId.value,
      nama: form.nama,
      email: form.email || null,
      telepon: normalizedPhone || null,
      alamat: form.alamat || null,
      aktif: form.aktif,
      allow_installment: form.credit_limit > 0,
      credit_limit: form.credit_limit,
      max_tenor_bulan: form.credit_limit > 0 ? form.max_tenor_bulan : 0,
      trust_score: form.credit_limit > 0 ? form.trust_score : 0,
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
