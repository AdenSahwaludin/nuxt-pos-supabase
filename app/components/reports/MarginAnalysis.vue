<template>
  <ReportPlaceholder
    :filters="filters"
    title="Analisis Margin per Kategori/Produk"
    description="Laporan ini akan menampilkan margin analysis (omzet, COGS, margin %) jika data biaya_produk tersedia."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>
