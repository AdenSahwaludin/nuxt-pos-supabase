<template>
  <ReportPlaceholder
    :filters="filters"
    title="Performa Kasir"
    description="Laporan ini akan menampilkan ranking kasir berdasarkan omzet, jumlah transaksi, AOV, dan void rate."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>
