<template>
  <div class="space-y-2">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-white/90"
    >
      {{ label }}
      <span v-if="required" class="text-emerald-400 ml-1">*</span>
    </label>

    <!-- Input container -->
    <div class="relative">
      <!-- Icon -->
      <div
        v-if="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10"
      >
        <component :is="icon" class="w-5 h-5" />
      </div>

      <!-- Input field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-3 text-white placeholder-white/50',
          'bg-white/10 backdrop-blur-md',
          'border border-white/20',
          'rounded-xl',
          'shadow-lg shadow-black/10',
          'focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50',
          'hover:border-white/30',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          icon && 'pl-12',
          error &&
            'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50',
        ]"
        @input="updateValue"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Show/Hide password toggle -->
      <button
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        @click="togglePasswordVisibility"
      >
        <!-- Eye icon (show) -->
        <svg
          v-if="showPassword"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          ></path>
        </svg>
        <!-- Eye slash icon (hide) -->
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-400 mt-1">
      {{ error }}
    </p>

    <!-- Helper text -->
    <p v-if="helper && !error" class="text-sm text-white/60 mt-1">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helper?: string;
  icon?: any;
  showPasswordToggle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  disabled: false,
  showPasswordToggle: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

// Generate unique ID for accessibility
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

// Password visibility toggle
const showPassword = ref(false);
const actualType = computed(() => {
  if (props.type === "password" && showPassword.value) {
    return "text";
  }
  return props.type;
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
