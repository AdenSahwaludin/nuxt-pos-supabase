<template>
  <ReportPlaceholder
    :filters="filters"
    title="Penjualan per Kategori"
    description="Laporan ini akan menampilkan analisis penjualan berdasarkan kategori produk dengan chart dan ranking."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>