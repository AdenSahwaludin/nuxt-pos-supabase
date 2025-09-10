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
            <h3 class="text-lg font-semibold text-gray-900">Edit Kategori</h3>
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
              ID Kategori:
            </div>
            <div class="text-lg font-bold text-gray-900">
              {{ kategori.id_kategori }}
            </div>
          </div>

          <!-- Nama Kategori -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nama"
              type="text"
              placeholder="Masukkan nama kategori"
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
            <div class="mt-1 text-xs text-gray-500">
              Minimal 3 karakter, nama harus unik
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
              <Edit2 v-else :size="16" />
              <span>{{ loading ? "Menyimpan..." : "Update Kategori" }}</span>
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
import { supabase } from "~~/lib/supabaseClient";
import { X, Edit2 } from "lucide-vue-next";

interface Props {
  kategori: {
    id_kategori: number;
    nama: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updated: [kategori: any];
}>();

// Reactive state
const loading = ref(false);
const submitError = ref("");

const form = reactive({
  nama: "",
});

const errors = reactive({
  nama: "",
});

// Methods
const loadFormData = () => {
  form.nama = props.kategori.nama;
};

const validateForm = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  // Nama validation
  if (!form.nama || form.nama.length < 3) {
    errors.nama = "Nama kategori harus minimal 3 karakter";
    isValid = false;
  } else {
    // Check uniqueness (exclude current category)
    try {
      const { data, error } = await supabase
        .schema("sbs")
        .from("kategori")
        .select("id_kategori")
        .ilike("nama", form.nama)
        .neq("id_kategori", props.kategori.id_kategori)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        errors.nama = "Nama kategori sudah digunakan";
        isValid = false;
      }
    } catch (error) {
      console.error("Error checking category name:", error);
      errors.nama = "Gagal memvalidasi nama kategori";
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!(await validateForm())) return;

  loading.value = true;
  submitError.value = "";

  try {
    console.log("📝 Updating category...");

    // Prepare data for Supabase
    const kategoriData = {
      nama: form.nama.trim(),
      updated_at: new Date().toISOString(),
    };

    console.log("📤 Sending update to Supabase:", kategoriData);

    // Update in sbs.kategori table
    const { data, error } = await supabase
      .schema("sbs")
      .from("kategori")
      .update(kategoriData)
      .eq("id_kategori", props.kategori.id_kategori)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase update error:", error);
      throw new Error(`Gagal memperbarui kategori: ${error.message}`);
    }

    console.log("✅ Category updated successfully:", data);

    // Emit success
    emit("updated", data);
  } catch (error: any) {
    console.error("Error updating category:", error);

    // Handle specific error cases
    if (error.message?.includes("duplicate key")) {
      submitError.value = "Nama kategori sudah digunakan";
    } else {
      submitError.value =
        error.message || "Gagal memperbarui kategori. Silakan coba lagi.";
    }
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
input:focus {
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
