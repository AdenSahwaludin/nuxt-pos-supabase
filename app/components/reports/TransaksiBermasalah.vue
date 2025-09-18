<template>
  <ReportPlaceholder
    :filters="filters"
    title="Transaksi Bermasalah"
    description="Laporan ini akan menampilkan transaksi Pending/Failed/Void dengan aksi refresh status dan analisis masalah."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>