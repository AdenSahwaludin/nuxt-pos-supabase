<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast" tag="div" class="space-y-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="relative max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          :class="getToastClasses(toast.type)"
        >
          <!-- Progress Bar -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="absolute top-0 left-0 h-1 transition-all duration-linear"
            :class="getProgressBarClass(toast.type)"
            :style="{
              width: `${((toast.timeLeft || 0) / toast.duration) * 100}%`,
            }"
          ></div>

          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Success Icon -->
                <svg
                  v-if="toast.type === 'success'"
                  class="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <!-- Error Icon -->
                <svg
                  v-else-if="toast.type === 'error'"
                  class="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <!-- Warning Icon -->
                <svg
                  v-else-if="toast.type === 'warning'"
                  class="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>

                <!-- Info Icon -->
                <svg
                  v-else
                  class="h-6 w-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" class="mt-1 text-sm text-gray-500">
                  {{ toast.message }}
                </p>

                <!-- Action Button -->
                <div v-if="toast.action" class="mt-3">
                  <button
                    @click="handleAction(toast)"
                    class="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    {{ toast.action.label }}
                  </button>
                </div>
              </div>

              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface ToastAction {
  label: string;
  handler: () => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  timeLeft?: number;
  action?: ToastAction;
  timer?: NodeJS.Timeout;
}

const toasts = ref<Toast[]>([]);

// Toast management
const addToast = (toast: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: Toast = {
    id,
    duration: 5000,
    ...toast,
    timeLeft: toast.duration || 5000,
  };

  toasts.value.push(newToast);

  // Auto-remove toast after duration
  if (newToast.duration && newToast.duration > 0) {
    // Update progress bar
    const startTime = Date.now();
    const updateInterval = 100;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, newToast.duration! - elapsed);

      const toastIndex = toasts.value.findIndex((t) => t.id === newToast.id);
      if (toastIndex !== -1) {
        if (toasts.value[toastIndex]) {
          toasts.value[toastIndex].timeLeft = remaining;
        }
      }

      if (remaining > 0) {
        newToast.timer = setTimeout(updateProgress, updateInterval);
      } else {
        removeToast(newToast.id);
      }
    };

    newToast.timer = setTimeout(updateProgress, updateInterval);
  }

  // Limit number of toasts
  if (toasts.value.length > 5) {
    const oldestToast = toasts.value[0];
    if (oldestToast) {
      removeToast(oldestToast.id);
    }
  }

  return id;
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    const toast = toasts.value[index];
    if (toast && toast.timer) {
      clearTimeout(toast.timer);
    }
    toasts.value.splice(index, 1);
  }
};

const handleAction = (toast: Toast) => {
  if (toast.action) {
    toast.action.handler();
    removeToast(toast.id);
  }
};

// Convenience methods
const success = (title: string, message?: string, options?: Partial<Toast>) => {
  return addToast({
    type: "success",
    title,
    message,
    ...options,
  });
};

const error = (title: string, message?: string, options?: Partial<Toast>) => {
  return addToast({
    type: "error",
    title,
    message,
    duration: 7000, // Longer for errors
    ...options,
  });
};

const warning = (title: string, message?: string, options?: Partial<Toast>) => {
  return addToast({
    type: "warning",
    title,
    message,
    ...options,
  });
};

const info = (title: string, message?: string, options?: Partial<Toast>) => {
  return addToast({
    type: "info",
    title,
    message,
    ...options,
  });
};

const clear = () => {
  toasts.value.forEach((toast) => {
    if (toast.timer) {
      clearTimeout(toast.timer);
    }
  });
  toasts.value = [];
};

// Style helpers
const getToastClasses = (type: string) => {
  const baseClasses = "border-l-4";

  switch (type) {
    case "success":
      return `${baseClasses} border-green-400 bg-green-50`;
    case "error":
      return `${baseClasses} border-red-400 bg-red-50`;
    case "warning":
      return `${baseClasses} border-yellow-400 bg-yellow-50`;
    case "info":
    default:
      return `${baseClasses} border-emerald-400 bg-emerald-50`;
  }
};

const getProgressBarClass = (type: string) => {
  switch (type) {
    case "success":
      return "bg-green-400";
    case "error":
      return "bg-red-400";
    case "warning":
      return "bg-yellow-400";
    case "info":
    default:
      return "bg-emerald-400";
  }
};

// Expose toast methods globally
const toast = {
  success,
  error,
  warning,
  info,
  clear,
  addToast,
  removeToast,
};

// Make available globally (optional)
if (process.client) {
  (window as any).$toast = toast;
}

// Provide to child components
provide("toast", toast);

// Also expose for composables
defineExpose({
  success,
  error,
  warning,
  info,
  clear,
  addToast,
  removeToast,
  toasts,
});
</script>

<style scoped>
/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Custom progress bar animation */
.duration-linear {
  transition-timing-function: linear;
}
</style>
