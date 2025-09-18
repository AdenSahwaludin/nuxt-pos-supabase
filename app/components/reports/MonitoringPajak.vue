<template>
  <ReportPlaceholder
    :filters="filters"
    title="Monitoring Pajak"
    description="Laporan ini akan menampilkan total pajak terhimpun per periode dan kontribusi terhadap omzet."
    @drilldown="$emit('drilldown', $event)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ filters: any }>();
const emit = defineEmits<{ drilldown: [filters: any] }>();
</script>