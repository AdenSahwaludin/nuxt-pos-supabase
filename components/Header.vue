<template>
  <div class="page-header">
    <h1 class="page-title">{{ title }}</h1>
    <p class="page-description" v-if="description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.page-header {
  padding: 2rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 0;
  }

  .page-title {
    font-size: 1.875rem;
  }

  .page-description {
    font-size: 1rem;
  }
}
</style>
