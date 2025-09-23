<template>
  <div
    class="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-200/50"
  >
    <div v-if="!isCollapsed" class="flex items-center space-x-3">
      <div
        class="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full"
      >
        <span class="text-sm font-semibold text-emerald-700">{{
          userInitials
        }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ name }}</p>
        <p class="text-xs text-emerald-600 truncate">Role: {{ role }}</p>
      </div>
    </div>
    <div v-else class="flex justify-center">
      <div
        class="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full"
        :title="name"
      >
        <span class="text-sm font-semibold text-emerald-700">{{
          userInitials
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";

interface Props {
  isCollapsed: boolean;
  name: string;
  role: string;
}

const props = defineProps<Props>();
const { isCollapsed, name, role } = toRefs(props);

const userInitials = computed(() => {
  return name.value
    .split(" ")
    .map((w: string) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>
<style scoped>
/* No custom styles */
</style>
