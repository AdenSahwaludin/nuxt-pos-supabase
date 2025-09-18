<template>
  <div class="text-center py-12">
    <svg
      class="w-16 h-16 mx-auto text-gray-400 mb-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fill-rule="evenodd"
        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-4">{{ description }}</p>
    <button
      @click="$emit('drilldown', filters)"
      class="px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
    >
      Lihat Detail Transaksi
    </button>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  filters: any;
  title?: string;
  description?: string;
}>();

// Emits
const emit = defineEmits<{
  drilldown: [filters: any];
}>();
</script>
