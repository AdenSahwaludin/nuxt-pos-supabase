<template>
  <ReportPlaceholder
    :filters="filters"
    title="Rekonsiliasi Pembayaran"
    description="Laporan ini akan menampilkan status sistem vs gateway dan settlement dengan aksi refresh status."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>
