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
            <!-- ID Produk (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ID Produk (Barcode)
              </label>
              <input
                :value="produk.id_produk"
                type="text"
                readonly
                inputmode="numeric"
                class="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600 font-mono"
              />
              <p class="mt-1 text-sm text-gray-500">
                ID Produk tidak dapat diubah
              </p>
            </div>

            <!-- BPOM -->
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
                placeholder="Nomor registrasi BPOM"
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

          <!-- Deskripsi - DIHAPUS karena tidak ada di database -->

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kategori -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.id_kategori"
                required
                :class="
                  errors.id_kategori ? 'border-red-300' : 'border-gray-300'
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
              <p v-if="errors.id_kategori" class="mt-1 text-sm text-red-600">
                {{ errors.id_kategori }}
              </p>
            </div>

            <!-- Satuan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                v-model="form.unit"
                :class="errors.unit ? 'border-red-300' : 'border-gray-300'"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Pilih Unit</option>
                <option value="pcs">Pcs</option>
                <option value="liter">Liter</option>
              </select>
              <p v-if="errors.unit" class="mt-1 text-sm text-red-600">
                {{ errors.unit }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Harga -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Harga Jual <span class="text-red-500">*</span>
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

            <!-- Biaya Produk -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Biaya Produk
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >Rp</span
                >
                <input
                  v-model.number="form.biaya_produk"
                  type="number"
                  min="0"
                  step="100"
                  :class="
                    errors.biaya_produk ? 'border-red-300' : 'border-gray-300'
                  "
                  class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
              <p v-if="errors.biaya_produk" class="mt-1 text-sm text-red-600">
                {{ errors.biaya_produk }}
              </p>
              <p class="mt-1 text-sm text-gray-500">Harga beli/modal produk</p>
            </div>
          </div>

          <!-- Stok & Batas Stok -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <!-- Batas Stok -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Batas Stok Minimum
              </label>
              <input
                v-model.number="form.batas_stok"
                type="number"
                min="0"
                :class="
                  errors.batas_stok ? 'border-red-300' : 'border-gray-300'
                "
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="5"
              />
              <p v-if="errors.batas_stok" class="mt-1 text-sm text-red-600">
                {{ errors.batas_stok }}
              </p>
            </div>
          </div>

          <!-- Pack Information -->
          <div class="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">
              Informasi Kemasan
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Pack Unit -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Unit Kemasan
                </label>
                <select
                  v-model="form.pack_unit"
                  :class="
                    errors.pack_unit ? 'border-red-300' : 'border-gray-300'
                  "
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Pilih Unit Kemasan</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                  <option value="karton">Karton</option>
                </select>
                <p v-if="errors.pack_unit" class="mt-1 text-sm text-red-600">
                  {{ errors.pack_unit }}
                </p>
              </div>

              <!-- Pack Size -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Isi per Kemasan
                </label>
                <input
                  v-model.number="form.pack_size"
                  type="number"
                  min="1"
                  :class="
                    errors.pack_size ? 'border-red-300' : 'border-gray-300'
                  "
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="1"
                />
                <p v-if="errors.pack_size" class="mt-1 text-sm text-red-600">
                  {{ errors.pack_size }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Jumlah unit per kemasan
                </p>
              </div>

              <!-- Harga Pack -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Harga per Kemasan
                </label>
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >Rp</span
                  >
                  <input
                    v-model.number="form.harga_pack"
                    type="number"
                    min="0"
                    step="100"
                    :class="
                      errors.harga_pack ? 'border-red-300' : 'border-gray-300'
                    "
                    class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <p v-if="errors.harga_pack" class="mt-1 text-sm text-red-600">
                  {{ errors.harga_pack }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tier Pricing -->
          <div class="bg-blue-50 p-4 rounded-lg space-y-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">
              Harga Bertingkat (Tier Pricing)
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Qty Tier 1 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Minimal Beli (Unit)
                </label>
                <input
                  v-model.number="form.qty_tier1"
                  type="number"
                  min="0"
                  :class="
                    errors.qty_tier1 ? 'border-red-300' : 'border-gray-300'
                  "
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0"
                />
                <p v-if="errors.qty_tier1" class="mt-1 text-sm text-red-600">
                  {{ errors.qty_tier1 }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Minimum pembelian untuk harga tier 1
                </p>
              </div>

              <!-- Harga Tier 1 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Harga per Unit (Diskon)
                </label>
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >Rp</span
                  >
                  <input
                    v-model.number="form.harga_tier1"
                    type="number"
                    min="0"
                    step="100"
                    :class="
                      errors.harga_tier1 ? 'border-red-300' : 'border-gray-300'
                    "
                    class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <p v-if="errors.harga_tier1" class="mt-1 text-sm text-red-600">
                  {{ errors.harga_tier1 }}
                </p>
              </div>

              <!-- Harga Tier Qty -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Minimal Beli (Pack)
                </label>
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >Rp</span
                  >
                  <input
                    v-model.number="form.harga_tier_qty"
                    type="number"
                    min="0"
                    step="100"
                    :class="
                      errors.harga_tier_qty
                        ? 'border-red-300'
                        : 'border-gray-300'
                    "
                    class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <p
                  v-if="errors.harga_tier_qty"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.harga_tier_qty }}
                </p>
              </div>

              <!-- Harga Tier Pack -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Harga per Pack (Diskon)
                </label>
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >Rp</span
                  >
                  <input
                    v-model.number="form.harga_tier_pack"
                    type="number"
                    min="0"
                    step="100"
                    :class="
                      errors.harga_tier_pack
                        ? 'border-red-300'
                        : 'border-gray-300'
                    "
                    class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <p
                  v-if="errors.harga_tier_pack"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.harga_tier_pack }}
                </p>
              </div>
            </div>
          </div>

          <!-- Upload Gambar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk
            </label>

            <!-- File Upload Area -->
            <div class="space-y-4">
              <!-- Current Image Preview -->
              <div v-if="form.gambar || imagePreview" class="relative">
                <img
                  :src="imagePreview || form.gambar"
                  alt="Preview gambar produk"
                  class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  @click="removeImage"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X :size="16" />
                </button>
              </div>

              <!-- Upload Area -->
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />

                <div class="space-y-2">
                  <div
                    class="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>

                  <div>
                    <button
                      @click="$refs.fileInput.click()"
                      type="button"
                      class="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Klik untuk upload
                    </button>
                    <span class="text-gray-500"> atau drag & drop</span>
                  </div>

                  <p class="text-xs text-gray-500">PNG, JPG, JPEG hingga 5MB</p>
                </div>

                <!-- Upload Progress -->
                <div
                  v-if="uploadProgress > 0 && uploadProgress < 100"
                  class="mt-4"
                >
                  <div class="bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: uploadProgress + '%' }"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">
                    Uploading... {{ uploadProgress }}%
                  </p>
                </div>
              </div>

              <!-- URL Input Alternative -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">atau</span>
                </div>
              </div>

              <div>
                <input
                  v-model="form.gambar"
                  type="url"
                  :class="errors.gambar ? 'border-red-300' : 'border-gray-300'"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p v-if="errors.gambar" class="mt-1 text-sm text-red-600">
                  {{ errors.gambar }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Masukkan URL gambar secara manual
                </p>
              </div>
            </div>
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
import { supabaseStorage } from "~~/lib/supabaseStorageClient";
import { useToast } from "~~/composables/useToast";

interface Props {
  produk: {
    id: string;
    id_produk: string;
    nama: string;
    gambar?: string;
    nomor_bpom?: string;
    id_kategori: number;
    kategori_nama?: string;
    harga: number;
    biaya_produk?: number;
    stok: number;
    batas_stok?: number;
    unit?: string;
    pack_unit?: string;
    pack_size?: number;
    harga_pack?: number;
    qty_tier1?: number;
    harga_tier1?: number;
    harga_tier_qty?: number;
    harga_tier_pack?: number;
    created_at: string;
    updated_at: string;
  };
  kategoriList: Array<{ id_kategori: string; nama: string }>;
}

interface Produk {
  id: string;
  id_produk: string;
  nama: string;
  gambar?: string;
  nomor_bpom?: string;
  id_kategori: number;
  kategori_nama?: string;
  harga: number;
  biaya_produk?: number;
  stok: number;
  batas_stok?: number;
  unit?: string;
  pack_unit?: string;
  pack_size?: number;
  harga_pack?: number;
  qty_tier1?: number;
  harga_tier1?: number;
  harga_tier_qty?: number;
  harga_tier_pack?: number;
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
  id_produk: props.produk.id_produk || "",
  nama: props.produk.nama || "",
  nomor_bpom: props.produk.nomor_bpom || "",
  id_kategori: props.produk.id_kategori || 0,
  harga: props.produk.harga || 0,
  biaya_produk: props.produk.biaya_produk || 0,
  stok: props.produk.stok || 0,
  batas_stok: props.produk.batas_stok || 5,
  unit: props.produk.unit || "",
  pack_unit: props.produk.pack_unit || "",
  pack_size: props.produk.pack_size || 1,
  harga_pack: props.produk.harga_pack || 0,
  qty_tier1: props.produk.qty_tier1 || 0,
  harga_tier1: props.produk.harga_tier1 || 0,
  harga_tier_qty: props.produk.harga_tier_qty || 0,
  harga_tier_pack: props.produk.harga_tier_pack || 0,
  gambar: props.produk.gambar || "",
});

const errors = reactive({
  id_produk: "",
  nama: "",
  nomor_bpom: "",
  id_kategori: "",
  harga: "",
  biaya_produk: "",
  stok: "",
  batas_stok: "",
  unit: "",
  pack_unit: "",
  pack_size: "",
  harga_pack: "",
  qty_tier1: "",
  harga_tier1: "",
  harga_tier_qty: "",
  harga_tier_pack: "",
  gambar: "",
});

const isSubmitting = ref(false);
const imagePreview = ref("");
const uploadProgress = ref(0);
const fileInput = ref(null);

// Computed properties
const isFormValid = computed(() => {
  return (
    form.nama.trim() !== "" &&
    form.id_kategori !== 0 &&
    form.harga >= 0 &&
    form.stok >= 0 &&
    !Object.values(errors).some((error) => error !== "")
  );
});

const hasChanges = computed(() => {
  return (
    form.id_produk !== (props.produk.id_produk || "") ||
    form.nama !== props.produk.nama ||
    form.nomor_bpom !== (props.produk.nomor_bpom || "") ||
    form.id_kategori !== props.produk.id_kategori ||
    form.harga !== props.produk.harga ||
    form.biaya_produk !== (props.produk.biaya_produk || 0) ||
    form.stok !== props.produk.stok ||
    form.batas_stok !== (props.produk.batas_stok || 5) ||
    form.unit !== (props.produk.unit || "") ||
    form.pack_unit !== (props.produk.pack_unit || "") ||
    form.pack_size !== (props.produk.pack_size || 1) ||
    form.harga_pack !== (props.produk.harga_pack || 0) ||
    form.qty_tier1 !== (props.produk.qty_tier1 || 0) ||
    form.harga_tier1 !== (props.produk.harga_tier1 || 0) ||
    form.harga_tier_qty !== (props.produk.harga_tier_qty || 0) ||
    form.harga_tier_pack !== (props.produk.harga_tier_pack || 0) ||
    form.gambar !== (props.produk.gambar || "")
  );
});

const changesList = computed(() => {
  const changes = [];

  if (form.nama !== props.produk.nama) {
    changes.push(`Nama: "${props.produk.nama}" → "${form.nama}"`);
  }
  if (form.nomor_bpom !== (props.produk.nomor_bpom || "")) {
    changes.push(
      `Nomor BPOM: "${props.produk.nomor_bpom || "Kosong"}" → "${
        form.nomor_bpom || "Kosong"
      }"`
    );
  }
  if (form.id_kategori !== props.produk.id_kategori) {
    const oldKat =
      props.kategoriList.find((k) => k.id_kategori === props.produk.id_kategori)
        ?.nama || "Tidak dikenal";
    const newKat =
      props.kategoriList.find((k) => k.id_kategori === form.id_kategori)
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
  if (form.biaya_produk !== (props.produk.biaya_produk || 0)) {
    changes.push(
      `Biaya Produk: Rp ${(props.produk.biaya_produk || 0).toLocaleString(
        "id-ID"
      )} → Rp ${form.biaya_produk.toLocaleString("id-ID")}`
    );
  }
  if (form.stok !== props.produk.stok) {
    changes.push(`Stok: ${props.produk.stok} → ${form.stok}`);
  }
  if (form.batas_stok !== (props.produk.batas_stok || 5)) {
    changes.push(
      `Batas Stok: ${props.produk.batas_stok || 5} → ${form.batas_stok}`
    );
  }
  if (form.unit !== (props.produk.unit || "")) {
    changes.push(
      `Unit: "${props.produk.unit || "Kosong"}" → "${form.unit || "Kosong"}"`
    );
  }
  if (form.pack_unit !== (props.produk.pack_unit || "")) {
    changes.push(
      `Pack Unit: "${props.produk.pack_unit || "Kosong"}" → "${
        form.pack_unit || "Kosong"
      }"`
    );
  }
  if (form.pack_size !== (props.produk.pack_size || 1)) {
    changes.push(
      `Pack Size: ${props.produk.pack_size || 1} → ${form.pack_size}`
    );
  }
  if (form.harga_pack !== (props.produk.harga_pack || 0)) {
    changes.push(
      `Harga Pack: Rp ${(props.produk.harga_pack || 0).toLocaleString(
        "id-ID"
      )} → Rp ${form.harga_pack.toLocaleString("id-ID")}`
    );
  }
  if (form.qty_tier1 !== (props.produk.qty_tier1 || 0)) {
    changes.push(
      `Qty Tier 1: ${props.produk.qty_tier1 || 0} → ${form.qty_tier1}`
    );
  }
  if (form.harga_tier1 !== (props.produk.harga_tier1 || 0)) {
    changes.push(
      `Harga Tier 1: Rp ${(props.produk.harga_tier1 || 0).toLocaleString(
        "id-ID"
      )} → Rp ${form.harga_tier1.toLocaleString("id-ID")}`
    );
  }
  if (form.harga_tier_qty !== (props.produk.harga_tier_qty || 0)) {
    changes.push(
      `Harga Tier Qty: Rp ${(props.produk.harga_tier_qty || 0).toLocaleString(
        "id-ID"
      )} → Rp ${form.harga_tier_qty.toLocaleString("id-ID")}`
    );
  }
  if (form.harga_tier_pack !== (props.produk.harga_tier_pack || 0)) {
    changes.push(
      `Harga Tier Pack: Rp ${(props.produk.harga_tier_pack || 0).toLocaleString(
        "id-ID"
      )} → Rp ${form.harga_tier_pack.toLocaleString("id-ID")}`
    );
  }
  if (form.gambar !== (props.produk.gambar || "")) {
    changes.push(
      `Gambar: "${props.produk.gambar ? "Ada" : "Kosong"}" → "${
        form.gambar ? "Ada" : "Kosong"
      }"`
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
  if (!form.id_kategori) {
    errors.id_kategori = "Kategori wajib dipilih";
    isValid = false;
  }

  // Validate harga
  if (form.harga < 0) {
    errors.harga = "Harga tidak boleh negatif";
    isValid = false;
  }

  // Validate biaya produk
  if (form.biaya_produk < 0) {
    errors.biaya_produk = "Biaya produk tidak boleh negatif";
    isValid = false;
  }

  // Validate stok
  if (form.stok < 0) {
    errors.stok = "Stok tidak boleh negatif";
    isValid = false;
  }

  // Validate batas stok
  if (form.batas_stok !== undefined && form.batas_stok < 0) {
    errors.batas_stok = "Batas stok tidak boleh negatif";
    isValid = false;
  }

  // Validate pack size
  if (form.pack_size !== undefined && form.pack_size < 0) {
    errors.pack_size = "Pack size tidak boleh negatif";
    isValid = false;
  }

  // Validate harga pack
  if (form.harga_pack < 0) {
    errors.harga_pack = "Harga pack tidak boleh negatif";
    isValid = false;
  }

  // Validate qty tier1
  if (form.qty_tier1 < 0) {
    errors.qty_tier1 = "Qty tier 1 tidak boleh negatif";
    isValid = false;
  }

  // Validate harga tier1
  if (form.harga_tier1 < 0) {
    errors.harga_tier1 = "Harga tier 1 tidak boleh negatif";
    isValid = false;
  }

  // Validate harga tier qty
  if (form.harga_tier_qty < 0) {
    errors.harga_tier_qty = "Harga tier qty tidak boleh negatif";
    isValid = false;
  }

  // Validate harga tier pack
  if (form.harga_tier_pack < 0) {
    errors.harga_tier_pack = "Harga tier pack tidak boleh negatif";
    isValid = false;
  }

  // Validate URL gambar
  if (form.gambar && !isValidUrl(form.gambar)) {
    errors.gambar = "URL gambar tidak valid";
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

// Image upload methods
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    const toast = useToast();
    toast.error("File harus berupa gambar (PNG, JPG, JPEG)");
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    const toast = useToast();
    toast.error("Ukuran file maksimal 5MB");
    return;
  }

  try {
    uploadProgress.value = 10;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    uploadProgress.value = 30;

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${props.produk.id_produk}_${Date.now()}.${fileExt}`;

    uploadProgress.value = 50;

    // Upload to Supabase Storage using service role (temporary)
    const { data, error } = await supabaseStorage.storage
      .from("produk-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    uploadProgress.value = 80;

    // Get public URL using regular client
    const { data: urlData } = supabase.storage
      .from("produk-images")
      .getPublicUrl(fileName);

    form.gambar = urlData.publicUrl;
    uploadProgress.value = 100;

    const toast = useToast();
    toast.success("Gambar berhasil diupload");

    // Reset progress after a delay
    setTimeout(() => {
      uploadProgress.value = 0;
    }, 1000);
  } catch (error: any) {
    console.error("Error uploading image:", error);
    uploadProgress.value = 0;
    imagePreview.value = "";

    const toast = useToast();
    toast.error(error.message || "Gagal mengupload gambar");
  }
};

const removeImage = () => {
  form.gambar = "";
  imagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleSubmit = async () => {
  if (!validateForm() || !hasChanges.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    console.log("🔄 Updating produk:", props.produk.id_produk, form);

    // Prepare data for update
    const updateData = {
      nama: form.nama.trim(),
      nomor_bpom: form.nomor_bpom?.trim() || null,
      id_kategori: form.id_kategori,
      harga: form.harga,
      biaya_produk: form.biaya_produk || 0,
      stok: form.stok,
      batas_stok: form.batas_stok || 5,
      unit: form.unit || "pcs",
      pack_unit: form.pack_unit?.trim() || null,
      pack_size: form.pack_size || 1,
      harga_pack: form.harga_pack || null,
      qty_tier1: form.qty_tier1 || null,
      harga_tier1: form.harga_tier1 || null,
      harga_tier_qty: form.harga_tier_qty || null,
      harga_tier_pack: form.harga_tier_pack || null,
      gambar: form.gambar?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    // Update produk
    const { data, error } = await supabase
      .schema("sbs")
      .from("produk")
      .update(updateData)
      .eq("id_produk", props.produk.id_produk)
      .select(
        `
        *,
        kategori:id_kategori (
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
      id: data.id_produk,
      id_produk: data.id_produk,
      nama: data.nama,
      gambar: data.gambar,
      nomor_bpom: data.nomor_bpom,
      id_kategori: data.id_kategori,
      kategori_nama: data.kategori?.nama || "Tanpa Kategori",
      harga: data.harga,
      biaya_produk: data.biaya_produk,
      stok: data.stok,
      batas_stok: data.batas_stok,
      unit: data.unit,
      pack_unit: data.pack_unit,
      pack_size: data.pack_size,
      harga_pack: data.harga_pack,
      qty_tier1: data.qty_tier1,
      harga_tier1: data.harga_tier1,
      harga_tier_qty: data.harga_tier_qty,
      harga_tier_pack: data.harga_tier_pack,
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
