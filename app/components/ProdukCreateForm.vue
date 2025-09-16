<template>
  <form
    @submit.prevent="handleSubmit"
    class="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Barcode EAN-13 <span class="text-red-500">*</span></label
        >
        <input
          v-model="form.id_produk"
          @input="form.id_produk = form.id_produk.replace(/\D/g, '')"
          inputmode="numeric"
          type="text"
          maxlength="13"
          pattern="\d{13}"
          required
          :class="errors.id_produk ? 'border-red-300' : 'border-gray-300'"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
          placeholder="1234567890123"
        />
        <p class="mt-1 text-xs text-gray-500">13 digit EAN-13 (angka saja)</p>
        <p v-if="errors.id_produk" class="mt-1 text-sm text-red-600">
          {{ errors.id_produk }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Nomor BPOM</label
        >
        <input
          v-model="form.nomor_bpom"
          type="text"
          :class="errors.nomor_bpom ? 'border-red-300' : 'border-gray-300'"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Contoh: MD 224510107023"
        />
        <p v-if="errors.nomor_bpom" class="mt-1 text-sm text-red-600">
          {{ errors.nomor_bpom }}
        </p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >Nama Produk <span class="text-red-500">*</span></label
      >
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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Kategori <span class="text-red-500">*</span></label
        >
        <select
          v-model="form.id_kategori"
          required
          :class="errors.id_kategori ? 'border-red-300' : 'border-gray-300'"
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
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Unit <span class="text-red-500">*</span></label
        >
        <select
          v-model="form.unit"
          required
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
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Harga Jual <span class="text-red-500">*</span></label
        >
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >Rp</span
          >
          <input
            v-model.number="form.harga"
            type="number"
            min="0"
            step="0.01"
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
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Biaya Produk <span class="text-red-500">*</span></label
        >
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >Rp</span
          >
          <input
            v-model.number="form.biaya_produk"
            type="number"
            min="0"
            step="0.01"
            required
            :class="errors.biaya_produk ? 'border-red-300' : 'border-gray-300'"
            class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
          />
        </div>
        <p v-if="errors.biaya_produk" class="mt-1 text-sm text-red-600">
          {{ errors.biaya_produk }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Stok <span class="text-red-500">*</span></label
        >
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
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Batas Stok Minimum <span class="text-red-500">*</span></label
        >
        <input
          v-model.number="form.batas_stok"
          type="number"
          min="0"
          required
          :class="errors.batas_stok ? 'border-red-300' : 'border-gray-300'"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="0"
        />
        <p v-if="errors.batas_stok" class="mt-1 text-sm text-red-600">
          {{ errors.batas_stok }}
        </p>
      </div>
    </div>

    <div class="bg-gray-50 p-4 rounded-lg space-y-4">
      <h4
        class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2"
      >
        Informasi Pack
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Pack Unit</label
          >
          <select
            v-model="form.pack_unit"
            :class="errors.pack_unit ? 'border-red-300' : 'border-gray-300'"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Pilih Pack Unit</option>
            <option value="pack">Pack</option>
            <option value="box">Box</option>
            <option value="karton">Karton</option>
          </select>
          <p v-if="errors.pack_unit" class="mt-1 text-sm text-red-600">
            {{ errors.pack_unit }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Pack Size</label
          >
          <input
            v-model.number="form.pack_size"
            type="number"
            min="0"
            :class="errors.pack_size ? 'border-red-300' : 'border-gray-300'"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
          />
          <p v-if="errors.pack_size" class="mt-1 text-sm text-red-600">
            {{ errors.pack_size }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Harga Pack</label
          >
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              >Rp</span
            >
            <input
              v-model.number="form.harga_pack"
              type="number"
              min="0"
              step="0.01"
              :class="errors.harga_pack ? 'border-red-300' : 'border-gray-300'"
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

    <div class="bg-blue-50 p-4 rounded-lg space-y-4">
      <h4
        class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2"
      >
        Tier Pricing
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Minimal Beli (Unit)</label
          >
          <input
            v-model.number="form.qty_tier1"
            type="number"
            min="0"
            :class="errors.qty_tier1 ? 'border-red-300' : 'border-gray-300'"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
          />
          <p v-if="errors.qty_tier1" class="mt-1 text-sm text-red-600">
            {{ errors.qty_tier1 }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Harga per Unit (Diskon)</label
          >
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              >Rp</span
            >
            <input
              v-model.number="form.harga_tier1"
              type="number"
              min="0"
              step="0.01"
              :class="errors.harga_tier1 ? 'border-red-300' : 'border-gray-300'"
              class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>
          <p v-if="errors.harga_tier1" class="mt-1 text-sm text-red-600">
            {{ errors.harga_tier1 }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Minimal Beli (Pack)</label
          >
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              >Rp</span
            >
            <input
              v-model.number="form.harga_tier_qty"
              type="number"
              min="0"
              step="0.01"
              :class="
                errors.harga_tier_qty ? 'border-red-300' : 'border-gray-300'
              "
              class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>
          <p v-if="errors.harga_tier_qty" class="mt-1 text-sm text-red-600">
            {{ errors.harga_tier_qty }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Harga per Pack (Diskon)</label
          >
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              >Rp</span
            >
            <input
              v-model.number="form.harga_tier_pack"
              type="number"
              min="0"
              step="0.01"
              :class="
                errors.harga_tier_pack ? 'border-red-300' : 'border-gray-300'
              "
              class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>
          <p v-if="errors.harga_tier_pack" class="mt-1 text-sm text-red-600">
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
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors w-8 h-8"
          >
            ✕
          </button>
        </div>

        <!-- Upload Area -->
        <div
          v-if="
            (!form.gambar && !imagePreview) ||
            (uploadProgress > 0 && uploadProgress < 100)
          "
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors"
          @click="uploadProgress === 0 ? $refs.fileInput.click() : null"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />

          <div class="space-y-2" v-if="uploadProgress === 0">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>

            <div>
              <button
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
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
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
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-2">
      <button
        type="button"
        @click="$emit('close')"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
        :disabled="isSubmitting"
      >
        Batal
      </button>
      <button
        type="submit"
        :disabled="isSubmitting || !isFormValid"
        class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? "Menyimpan..." : "Simpan Produk" }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
// @ts-nocheck
import { supabase } from "~~/lib/supabaseClient";
import { supabaseStorage } from "~~/lib/supabaseStorageClient";
import { useToast } from "~~/composables/useToast";

export default defineComponent({
  props: {
    kategoriList: { type: Array, default: () => [] },
  },
  emits: ["close", "created"],
  setup(props, { emit }) {
    const toast = useToast();

    const isSubmitting = ref(false);
    const kategoriList = ref<any[]>([]);
    const imagePreview = ref("");
    const uploadProgress = ref(0);
    const fileInput = ref(null);

    const form = reactive({
      id_produk: "",
      nama: "",
      harga: null as number | null,
      biaya_produk: null as number | null,
      stok: null as number | null,
      batas_stok: null as number | null,
      id_kategori: "",
      unit: "",
      nomor_bpom: "",
      gambar: "",
      pack_unit: "",
      pack_size: null as number | null,
      harga_pack: null as number | null,
      qty_tier1: null as number | null,
      harga_tier1: null as number | null,
      harga_tier_qty: null as number | null,
      harga_tier_pack: null as number | null,
    });

    const errors = reactive<Record<string, string>>({
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

    const isFormValid = computed(
      () =>
        !!(
          form.id_produk &&
          form.nama &&
          form.harga !== null &&
          form.biaya_produk !== null &&
          form.stok !== null &&
          form.batas_stok !== null &&
          form.id_kategori &&
          form.unit
        )
    );

    function clearErrors() {
      Object.keys(errors).forEach((k) => (errors[k] = ""));
    }

    function validateForm() {
      clearErrors();
      let ok = true;
      if (!form.id_produk) {
        errors.id_produk = "Barcode EAN-13 wajib diisi";
        ok = false;
      } else if (!/^\d{13}$/.test(form.id_produk)) {
        errors.id_produk = "Barcode harus 13 digit angka";
        ok = false;
      }

      if (!form.nama) {
        errors.nama = "Nama produk wajib diisi";
        ok = false;
      }

      if (form.harga === null || form.harga <= 0) {
        errors.harga = "Harga harus lebih dari 0";
        ok = false;
      }
      if (form.biaya_produk === null || form.biaya_produk <= 0) {
        errors.biaya_produk = "Biaya produk harus lebih dari 0";
        ok = false;
      }

      if (form.stok === null || form.stok < 0) {
        errors.stok = "Stok tidak boleh negatif";
        ok = false;
      }
      if (form.batas_stok === null || form.batas_stok < 0) {
        errors.batas_stok = "Batas stok tidak boleh negatif";
        ok = false;
      }

      if (!form.id_kategori) {
        errors.id_kategori = "Kategori wajib dipilih";
        ok = false;
      }
      if (!form.unit) {
        errors.unit = "Unit wajib dipilih";
        ok = false;
      }
      return ok;
    }

    async function loadKategoris() {
      try {
        const { data, error } = await supabase
          .schema("sbs")
          .from("kategori")
          .select("id_kategori, nama")
          .order("nama");
        if (error) throw error;
        kategoriList.value = data || [];
      } catch (e) {
        console.error(e);
        toast.error("Gagal memuat data kategori");
      }
    }

    // Image upload methods
    const handleImageUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar (PNG, JPG, JPEG)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
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

        // Generate unique filename using timestamp
        const fileExt = file.name.split(".").pop();
        const fileName = `${
          form.id_produk || Date.now()
        }_${Date.now()}.${fileExt}`;

        uploadProgress.value = 50;

        // Upload to Supabase Storage using service role (temporary)
        const { data, error } = await supabaseStorage.storage
          .from("produk-images")
          .upload(fileName, file);

        if (error) {
          throw new Error(`Upload gagal: ${error.message}`);
        }

        // Get public URL using regular client
        const { data: publicData } = supabase.storage
          .from("produk-images")
          .getPublicUrl(fileName);

        if (publicData?.publicUrl) {
          form.gambar = publicData.publicUrl;
          uploadProgress.value = 100;

          toast.success("Gambar berhasil diupload");

          // Reset progress after delay
          setTimeout(() => {
            uploadProgress.value = 0;
          }, 1000);
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || "Gagal upload gambar");
        uploadProgress.value = 0;
        imagePreview.value = "";
      }
    };

    const removeImage = () => {
      form.gambar = "";
      imagePreview.value = "";
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    };

    async function handleSubmit() {
      if (!validateForm()) {
        toast.error("Mohon periksa kembali form");
        return;
      }
      isSubmitting.value = true;
      try {
        const { data: existing, error: selErr } = await supabase
          .schema("sbs")
          .from("produk")
          .select("id_produk")
          .eq("id_produk", form.id_produk)
          .maybeSingle();
        if (selErr) throw selErr;
        if (existing) {
          errors.id_produk = "Barcode sudah digunakan";
          toast.error("Barcode sudah digunakan oleh produk lain");
          return;
        }

        const payload = {
          id_produk: form.id_produk,
          nama: form.nama,
          harga: form.harga,
          biaya_produk: form.biaya_produk,
          stok: form.stok,
          batas_stok: form.batas_stok,
          id_kategori: form.id_kategori,
          unit: form.unit,
          nomor_bpom: form.nomor_bpom || null,
          gambar: form.gambar || null,
          pack_unit: form.pack_unit || null,
          pack_size: form.pack_size ?? null,
          harga_pack: form.harga_pack ?? null,
          qty_tier1: form.qty_tier1 ?? null,
          harga_tier1: form.harga_tier1 ?? null,
          harga_tier_qty: form.harga_tier_qty ?? null,
          harga_tier_pack: form.harga_tier_pack ?? null,
        };

        const { data: inserted, error } = await supabase
          .schema("sbs")
          .from("produk")
          .insert([payload])
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
        if (error) throw error;

        // Build payload expected by admin page list
        const newProduk = inserted
          ? {
              id: inserted.id_produk,
              id_produk: inserted.id_produk,
              nama: inserted.nama,
              gambar: inserted.gambar,
              nomor_bpom: inserted.nomor_bpom,
              kategori_id: inserted.id_kategori,
              kategori_nama: inserted.kategori?.nama || "Tanpa Kategori",
              harga: inserted.harga || 0,
              biaya_produk: inserted.biaya_produk || 0,
              stok: inserted.stok || 0,
              batas_stok: inserted.batas_stok || 5,
              unit: inserted.unit || "pcs",
              pack_unit: inserted.pack_unit,
              pack_size: inserted.pack_size,
              harga_pack: inserted.harga_pack,
              qty_tier1: inserted.qty_tier1,
              harga_tier1: inserted.harga_tier1,
              harga_tier_qty: inserted.harga_tier_qty,
              harga_tier_pack: inserted.harga_tier_pack,
              created_at: inserted.created_at,
              updated_at: inserted.updated_at,
            }
          : null;

        toast.success("Produk berhasil ditambahkan");
        emit("created", newProduk);
        emit("close");
        clearErrors();
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Gagal menambahkan produk");
      } finally {
        isSubmitting.value = false;
      }
    }

    onMounted(() => {
      if (Array.isArray(props.kategoriList) && props.kategoriList.length > 0) {
        kategoriList.value = props.kategoriList as any[];
      } else {
        loadKategoris();
      }
    });

    watch(
      () => props.kategoriList,
      (newVal) => {
        if (Array.isArray(newVal) && newVal.length > 0) {
          kategoriList.value = newVal as any[];
        }
      }
    );

    return {
      isSubmitting,
      kategoriList,
      form,
      errors,
      isFormValid,
      imagePreview,
      uploadProgress,
      fileInput,
      handleSubmit,
      handleImageUpload,
      removeImage,
    };
  },
});
</script>

<style scoped></style>
