<template>
  <ReportPlaceholder
    :filters="filters"
    title="Nilai Stok & Potensi Penjualan"
    description="Laporan ini akan menampilkan nilai stok (COGS) dan potensi omzet dengan analisis stok berlebih/menipis."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>