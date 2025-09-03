<template>
  <div
    :class="[
      'backdrop-blur-md bg-white/10',
      'border border-white/20',
      'rounded-2xl',
      'shadow-2xl shadow-black/20',
      'transition-all duration-300',
      'hover:shadow-3xl hover:shadow-black/30',
      'hover:border-white/30',
      padding === 'sm' && 'p-4',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      padding === 'xl' && 'p-10',
      className,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

withDefaults(defineProps<Props>(), {
  padding: "md",
  className: "",
});
</script>
