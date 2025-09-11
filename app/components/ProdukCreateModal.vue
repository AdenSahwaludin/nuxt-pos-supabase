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
              <Package :size="24" class="text-emerald-500 mr-3" />
              Tambah Produk Baru
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
            <!-- Barcode EAN-13 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Barcode EAN-13 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.id_produk"
                type="text"
                required
                maxlength="13"
                pattern="[0-9]{13}"
                :class="errors.id_produk ? 'border-red-300' : 'border-gray-300'"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                placeholder="1234567890123"
              />
              <p class="mt-1 text-xs text-gray-500">
                13 digit barcode EAN-13 (angka saja)
              </p>
              <p v-if="errors.id_produk" class="mt-1 text-sm text-red-600">
                {{ errors.id_produk }}
              </p>
            </div>

            <!-- Nomor BPOM -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nomor BPOM
              </label>
              <input
                v-model="form.nomor_bpom"
                type="text"
                :class="
                  errors.nomor_bpom ? 'border-red-300' : 'border-gray-300'
                "
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Contoh: MD 224510107023"
              />
              <p v-if="errors.nomor_bpom" class="mt-1 text-sm text-red-600">
                {{ errors.nomor_bpom }}
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
                Stok Awal <span class="text-red-500">*</span>
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
              :disabled="isSubmitting || !isFormValid"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <Package v-else :size="16" />
              <span>{{ isSubmitting ? "Menyimpan..." : "Simpan Produk" }}</span>
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
import { X, Package } from "lucide-vue-next";
import { supabase } from "~~/lib/supabaseClient";

interface Props {
  kategoriList: Array<{ id_kategori: string; nama: string }>;
}

interface Produk {
  sku: string;
  barcode?: string;
  nama: string;
  deskripsi?: string;
  kategori_id: string;
  harga: number;
  stok: number;
  stok_minimum?: number;
  satuan?: string;
  berat?: number;
  gambar_url?: string;
  aktif: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  created: [produk: Produk];
}>();

// Form state
const form = reactive({
  id_produk: "",
  nomor_bpom: "",
  nama: "",
  kategori: "",
  harga: 0,
  biaya_produk: 0,
  stok: 0,
  batas_stok: 5,
  unit: "pcs",
  pack_unit: "karton",
  pack_size: 1,
  harga_pack: 0,
  qty_tier1: 0,
  harga_tier1: 0,
  harga_tier_qty: 0,
  harga_tier_pack: 0,
  gambar: "",
});

const errors = reactive({
  id_produk: "",
  nomor_bpom: "",
  nama: "",
  kategori: "",
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
    form.sku.trim() !== "" &&
    form.nama.trim() !== "" &&
    form.kategori_id !== "" &&
    form.harga >= 0 &&
    form.stok >= 0 &&
    !Object.values(errors).some((error) => error !== "")
  );
});

// Methods
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  // Validate SKU
  if (!form.sku.trim()) {
    errors.sku = "SKU wajib diisi";
    isValid = false;
  }

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
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    console.log("🔄 Creating produk:", form);

    // Check if SKU already exists
    const { data: existingProduk, error: checkError } = await supabase
      .schema("sbs")
      .from("produk")
      .select("sku")
      .eq("sku", form.sku)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error checking SKU:", checkError);
      throw new Error("Gagal memeriksa SKU");
    }

    if (existingProduk) {
      errors.sku = "SKU sudah digunakan";
      return;
    }

    // Prepare data for insertion
    const produkData = {
      sku: form.sku.trim(),
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
    };

    // Insert produk
    const { data, error } = await supabase
      .schema("sbs")
      .from("produk")
      .insert([produkData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);

      if (error.code === "23505") {
        // Unique constraint violation
        errors.sku = "SKU sudah digunakan";
        return;
      }

      throw new Error(`Gagal menyimpan produk: ${error.message}`);
    }

    console.log("✅ Produk created successfully:", data);

    // Transform data to match interface
    const newProduk: Produk = {
      ...produkData,
      id: data.sku,
    };

    emit("created", newProduk);
  } catch (error: any) {
    console.error("❌ Error creating produk:", error);

    const toast = useToast();
    toast.error(error.message || "Gagal membuat produk. Silakan coba lagi.");
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
