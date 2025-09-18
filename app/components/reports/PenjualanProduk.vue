<template>
  <ReportPlaceholder
    :filters="filters"
    title="Penjualan per Produk (Top/Bottom)"
    description="Laporan ini akan menampilkan produk terlaris dan paling lambat dengan analisis quantity, revenue, dan kontribusi."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>
