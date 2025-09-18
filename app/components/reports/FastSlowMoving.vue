<template>
  <ReportPlaceholder
    :filters="filters"
    title="Fast vs Slow Moving Products"
    description="Laporan ini akan menampilkan analisis produk fast/slow moving dengan rekomendasi restok dan delisting."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>