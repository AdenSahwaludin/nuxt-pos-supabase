<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative overflow-hidden px-6 py-3 font-medium text-white transition-all duration-300',
      'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20',
      'border border-emerald-400/30',
      'backdrop-blur-md',
      'rounded-xl',
      'shadow-lg shadow-emerald-500/10',
      'hover:shadow-xl hover:shadow-emerald-500/20',
      'hover:border-emerald-400/50',
      'hover:from-emerald-500/30 hover:to-emerald-600/30',
      'focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-transparent',
      'active:scale-[0.98]',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg',
      variant === 'primary' &&
        'bg-gradient-to-r from-emerald-500/30 to-emerald-600/30',
      variant === 'secondary' &&
        'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-400/30',
      size === 'sm' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-8 py-4 text-lg',
      fullWidth && 'w-full',
      className,
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm"
    >
      <div
        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
      ></div>
    </div>

    <!-- Button content -->
    <span :class="{ 'opacity-0': loading }">
      <slot>
        {{ text }}
      </slot>
    </span>

    <!-- Shine effect on hover -->
    <div
      class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
    ></div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  text?: string;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  fullWidth: false,
  text: "",
  className: "",
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>
