<template>
  <ReportPlaceholder
    :filters="filters"
    title="Penjualan per Pelanggan"
    description="Laporan ini akan menampilkan analisis pelanggan dengan jumlah transaksi, omzet, dan histori pembelian."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>