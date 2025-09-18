<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
      <div
        class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <h3 class="text-lg font-semibold">Tambah Produk</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <ProdukCreateForm
        :kategoriList="kategoriList"
        @created="$emit('created', $event)"
        @close="$emit('close')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProdukCreateForm from "./ProdukCreateForm.vue";

export default defineComponent({
  name: "ProdukCreateModal",
  components: { ProdukCreateForm },
  props: {
    kategoriList: { type: Array, default: () => [] },
  },
  emits: ["close", "created"],
});
</script>
