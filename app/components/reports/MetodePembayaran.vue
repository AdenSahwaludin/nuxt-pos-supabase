<template>
  <ReportPlaceholder
    :filters="filters"
    title="Analisis Metode Pembayaran"
    description="Laporan ini akan menampilkan share of wallet per channel pembayaran dengan pie chart dan insights."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>