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
        class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Edit :size="24" class="text-emerald-500 mr-3" />
              Edit Produk
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
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- SKU (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                :value="produk.sku"
                type="text"
                readonly
                class="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600"
              />
              <p class="mt-1 text-sm text-gray-500">SKU tidak dapat diubah</p>
            </div>

            <!-- Barcode -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Barcode
              </label>
              <input
                v-model="form.barcode"
                type="text"
                :class="errors.barcode ? 'border-red-300' : 'border-gray-300'"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Scan atau ketik barcode"
              />
              <p v-if="errors.barcode" class="mt-1 text-sm text-red-600">
                {{ errors.barcode }}
              </p>
            </div>
          </div>

          <!-- Nama Produk -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nama"
              type="text"
              required
              :class="errors.nama ? 'border-red-300' : 'border-gray-300'"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Masukkan nama produk"
            />
            <p v-if="errors.nama" class="mt-1 text-sm text-red-600">
              {{ errors.nama }}
            </p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              :class="errors.deskripsi ? 'border-red-300' : 'border-gray-300'"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Deskripsi produk (opsional)"
            ></textarea>
            <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">
              {{ errors.deskripsi }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kategori -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.kategori_id"
                required
                :class="
                  errors.kategori_id ? 'border-red-300' : 'border-gray-300'
                "
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Pilih Kategori</option>
                <option
                  v-for="kat in kategoriList"
                  :key="kat.id_kategori"
                  :value="kat.id_kategori"
                >
                  {{ kat.nama }}
                </option>
              </select>
              <p v-if="errors.kategori_id" class="mt-1 text-sm text-red-600">
                {{ errors.kategori_id }}
              </p>
            </div>

            <!-- Satuan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Satuan
              </label>
              <select
                v-model="form.satuan"
                :class="errors.satuan ? 'border-red-300' : 'border-gray-300'"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Pilih Satuan</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="gram">Gram (g)</option>
                <option value="liter">Liter (L)</option>
                <option value="ml">Mililiter (ml)</option>
                <option value="meter">Meter (m)</option>
                <option value="cm">Centimeter (cm)</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
                <option value="lusin">Lusin</option>
              </select>
              <p v-if="errors.satuan" class="mt-1 text-sm text-red-600">
                {{ errors.satuan }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Harga -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Harga <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >Rp</span
                >
                <input
                  v-model.number="form.harga"
                  type="number"
                  min="0"
                  step="100"
                  required
                  :class="errors.harga ? 'border-red-300' : 'border-gray-300'"
                  class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
              <p v-if="errors.harga" class="mt-1 text-sm text-red-600">
                {{ errors.harga }}
              </p>
            </div>

            <!-- Stok -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Stok <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.stok"
                type="number"
                min="0"
                required
                :class="errors.stok ? 'border-red-300' : 'border-gray-300'"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
              />
              <p v-if="errors.stok" class="mt-1 text-sm text-red-600">
                {{ errors.stok }}
              </p>
            </div>

            <!-- Stok Minimum -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Stok Minimum
              </label>
              <input
                v-model.number="form.stok_minimum"
                type="number"
                min="0"
                :class="
                  errors.stok_minimum ? 'border-red-300' : 'border-gray-300'
                "
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="5"
              />
              <p v-if="errors.stok_minimum" class="mt-1 text-sm text-red-600">
                {{ errors.stok_minimum }}
              </p>
            </div>
          </div>

          <!-- Berat -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Berat (gram)
              </label>
              <input
                v-model.number="form.berat"
                type="number"
                min="0"
                step="0.1"
                :class="errors.berat ? 'border-red-300' : 'border-gray-300'"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
              />
              <p v-if="errors.berat" class="mt-1 text-sm text-red-600">
                {{ errors.berat }}
              </p>
            </div>

            <!-- Status Aktif -->
            <div
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <label class="text-sm font-medium text-gray-700"
                  >Status Produk</label
                >
                <p class="text-sm text-gray-500">
                  Produk dapat dijual dan ditampilkan
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.aktif"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
                ></div>
              </label>
            </div>
          </div>

          <!-- URL Gambar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              URL Gambar
            </label>
            <input
              v-model="form.gambar_url"
              type="url"
              :class="errors.gambar_url ? 'border-red-300' : 'border-gray-300'"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://example.com/image.jpg"
            />
            <p v-if="errors.gambar_url" class="mt-1 text-sm text-red-600">
              {{ errors.gambar_url }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              URL gambar produk (opsional). Fitur upload gambar akan tersedia
              segera.
            </p>
          </div>

          <!-- Changes Summary -->
          <div
            v-if="hasChanges"
            class="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h4 class="text-sm font-medium text-blue-800 mb-2">
              Perubahan yang akan disimpan:
            </h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li v-for="change in changesList" :key="change">
                • {{ change }}
              </li>
            </ul>
          </div>
        </form>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('close')"
              type="button"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              :disabled="isSubmitting"
            >
              Batal
            </button>
            <button
              @click="handleSubmit"
              type="button"
              :disabled="isSubmitting || !isFormValid || !hasChanges"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <Edit v-else :size="16" />
              <span>{{
                isSubmitting ? "Menyimpan..." : "Simpan Perubahan"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { X, Edit } from "lucide-vue-next";
import { supabase } from "~~/lib/supabaseClient";

interface Props {
  produk: {
    id: string;
    sku: string;
    barcode?: string;
    nama: string;
    deskripsi?: string;
    kategori_id: string;
    kategori_nama?: string;
    harga: number;
    stok: number;
    stok_minimum?: number;
    satuan?: string;
    berat?: number;
    gambar_url?: string;
    aktif: boolean;
    created_at: string;
    updated_at: string;
  };
  kategoriList: Array<{ id_kategori: string; nama: string }>;
}

interface Produk {
  id: string;
  sku: string;
  barcode?: string;
  nama: string;
  deskripsi?: string;
  kategori_id: string;
  kategori_nama?: string;
  harga: number;
  stok: number;
  stok_minimum?: number;
  satuan?: string;
  berat?: number;
  gambar_url?: string;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updated: [produk: Produk];
}>();

// Form state
const form = reactive({
  barcode: props.produk.barcode || "",
  nama: props.produk.nama || "",
  deskripsi: props.produk.deskripsi || "",
  kategori_id: props.produk.kategori_id || "",
  harga: props.produk.harga || 0,
  stok: props.produk.stok || 0,
  stok_minimum: props.produk.stok_minimum || 5,
  satuan: props.produk.satuan || "",
  berat: props.produk.berat || 0,
  gambar_url: props.produk.gambar_url || "",
  aktif: props.produk.aktif !== false,
});

const errors = reactive({
  barcode: "",
  nama: "",
  deskripsi: "",
  kategori_id: "",
  harga: "",
  stok: "",
  stok_minimum: "",
  satuan: "",
  berat: "",
  gambar_url: "",
});

const isSubmitting = ref(false);

// Computed properties
const isFormValid = computed(() => {
  return (
    form.nama.trim() !== "" &&
    form.kategori_id !== "" &&
    form.harga >= 0 &&
    form.stok >= 0 &&
    !Object.values(errors).some((error) => error !== "")
  );
});

const hasChanges = computed(() => {
  return (
    form.barcode !== (props.produk.barcode || "") ||
    form.nama !== props.produk.nama ||
    form.deskripsi !== (props.produk.deskripsi || "") ||
    form.kategori_id !== props.produk.kategori_id ||
    form.harga !== props.produk.harga ||
    form.stok !== props.produk.stok ||
    form.stok_minimum !== (props.produk.stok_minimum || 5) ||
    form.satuan !== (props.produk.satuan || "") ||
    form.berat !== (props.produk.berat || 0) ||
    form.gambar_url !== (props.produk.gambar_url || "") ||
    form.aktif !== (props.produk.aktif !== false)
  );
});

const changesList = computed(() => {
  const changes = [];

  if (form.barcode !== (props.produk.barcode || "")) {
    changes.push(
      `Barcode: "${props.produk.barcode || "Kosong"}" → "${
        form.barcode || "Kosong"
      }"`
    );
  }
  if (form.nama !== props.produk.nama) {
    changes.push(`Nama: "${props.produk.nama}" → "${form.nama}"`);
  }
  if (form.deskripsi !== (props.produk.deskripsi || "")) {
    changes.push(
      `Deskripsi: "${props.produk.deskripsi || "Kosong"}" → "${
        form.deskripsi || "Kosong"
      }"`
    );
  }
  if (form.kategori_id !== props.produk.kategori_id) {
    const oldKat =
      props.kategoriList.find((k) => k.id_kategori === props.produk.kategori_id)
        ?.nama || "Tidak dikenal";
    const newKat =
      props.kategoriList.find((k) => k.id_kategori === form.kategori_id)
        ?.nama || "Tidak dikenal";
    changes.push(`Kategori: "${oldKat}" → "${newKat}"`);
  }
  if (form.harga !== props.produk.harga) {
    changes.push(
      `Harga: Rp ${props.produk.harga.toLocaleString(
        "id-ID"
      )} → Rp ${form.harga.toLocaleString("id-ID")}`
    );
  }
  if (form.stok !== props.produk.stok) {
    changes.push(`Stok: ${props.produk.stok} → ${form.stok}`);
  }
  if (form.stok_minimum !== (props.produk.stok_minimum || 5)) {
    changes.push(
      `Stok Minimum: ${props.produk.stok_minimum || 5} → ${form.stok_minimum}`
    );
  }
  if (form.satuan !== (props.produk.satuan || "")) {
    changes.push(
      `Satuan: "${props.produk.satuan || "Kosong"}" → "${
        form.satuan || "Kosong"
      }"`
    );
  }
  if (form.berat !== (props.produk.berat || 0)) {
    changes.push(`Berat: ${props.produk.berat || 0}g → ${form.berat}g`);
  }
  if (form.gambar_url !== (props.produk.gambar_url || "")) {
    changes.push(
      `URL Gambar: "${props.produk.gambar_url ? "Ada" : "Kosong"}" → "${
        form.gambar_url ? "Ada" : "Kosong"
      }"`
    );
  }
  if (form.aktif !== (props.produk.aktif !== false)) {
    changes.push(
      `Status: ${props.produk.aktif !== false ? "Aktif" : "Nonaktif"} → ${
        form.aktif ? "Aktif" : "Nonaktif"
      }`
    );
  }

  return changes;
});

// Methods
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  // Validate nama
  if (!form.nama.trim()) {
    errors.nama = "Nama produk wajib diisi";
    isValid = false;
  }

  // Validate kategori
  if (!form.kategori_id) {
    errors.kategori_id = "Kategori wajib dipilih";
    isValid = false;
  }

  // Validate harga
  if (form.harga < 0) {
    errors.harga = "Harga tidak boleh negatif";
    isValid = false;
  }

  // Validate stok
  if (form.stok < 0) {
    errors.stok = "Stok tidak boleh negatif";
    isValid = false;
  }

  // Validate stok minimum
  if (form.stok_minimum !== undefined && form.stok_minimum < 0) {
    errors.stok_minimum = "Stok minimum tidak boleh negatif";
    isValid = false;
  }

  // Validate berat
  if (form.berat !== undefined && form.berat < 0) {
    errors.berat = "Berat tidak boleh negatif";
    isValid = false;
  }

  // Validate URL gambar
  if (form.gambar_url && !isValidUrl(form.gambar_url)) {
    errors.gambar_url = "URL gambar tidak valid";
    isValid = false;
  }

  return isValid;
};

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm() || !hasChanges.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    console.log("🔄 Updating produk:", props.produk.sku, form);

    // Prepare data for update
    const updateData = {
      barcode: form.barcode?.trim() || null,
      nama: form.nama.trim(),
      deskripsi: form.deskripsi?.trim() || null,
      kategori_id: form.kategori_id,
      harga: form.harga,
      stok: form.stok,
      stok_minimum: form.stok_minimum || 5,
      satuan: form.satuan || null,
      berat: form.berat || null,
      gambar_url: form.gambar_url?.trim() || null,
      aktif: form.aktif,
      updated_at: new Date().toISOString(),
    };

    // Update produk
    const { data, error } = await supabase
      .schema("sbs")
      .from("produk")
      .update(updateData)
      .eq("sku", props.produk.sku)
      .select(
        `
        *,
        kategori:kategori_id (
          id_kategori,
          nama
        )
      `
      )
      .single();

    if (error) {
      console.error("❌ Supabase update error:", error);
      throw new Error(`Gagal memperbarui produk: ${error.message}`);
    }

    console.log("✅ Produk updated successfully:", data);

    // Transform data to match interface
    const updatedProduk: Produk = {
      id: data.sku,
      sku: data.sku,
      barcode: data.barcode,
      nama: data.nama,
      deskripsi: data.deskripsi,
      kategori_id: data.kategori_id,
      kategori_nama: data.kategori?.nama || "Tanpa Kategori",
      harga: data.harga,
      stok: data.stok,
      stok_minimum: data.stok_minimum,
      satuan: data.satuan,
      berat: data.berat,
      gambar_url: data.gambar_url,
      aktif: data.aktif,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    emit("updated", updatedProduk);
  } catch (error: any) {
    console.error("❌ Error updating produk:", error);

    const toast = useToast();
    toast.error(
      error.message || "Gagal memperbarui produk. Silakan coba lagi."
    );
  } finally {
    isSubmitting.value = false;
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

/* Toggle switch styles */
.peer:checked ~ .peer-checked\:bg-emerald-600 {
  background-color: rgb(5 150 105);
}
</style>
