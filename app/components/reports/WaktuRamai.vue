<template>
  <ReportPlaceholder
    :filters="filters"
    title="Analisis Waktu Ramai (Peak Hours)"
    description="Laporan ini akan menampilkan heatmap waktu ramai dan hari tersibuk untuk optimasi shift kasir."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>