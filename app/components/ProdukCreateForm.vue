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
            >Qty Tier 1</label
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
            >Harga Tier 1</label
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
            >Harga Tier Qty</label
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
            >Harga Tier Pack</label
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

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >URL Gambar Produk</label
      >
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
      <p class="mt-1 text-sm text-gray-500">Opsional - URL gambar produk</p>
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
      handleSubmit,
    };
  },
});
</script>

<style scoped></style>
