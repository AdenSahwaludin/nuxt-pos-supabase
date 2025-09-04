<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <TransitionGroup name="toast" tag="div" class="space-y-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          :class="getToastClasses(toast.type)"
        >
          <div class="p-4">
            <div class="flex items-start space-x-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <CheckCircle
                  v-if="toast.type === 'success'"
                  :size="20"
                  class="text-emerald-600"
                />
                <XCircle
                  v-else-if="toast.type === 'error'"
                  :size="20"
                  class="text-red-600"
                />
                <AlertCircle
                  v-else-if="toast.type === 'warning'"
                  :size="20"
                  class="text-amber-600"
                />
                <Info v-else :size="20" class="text-blue-600" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div
                  v-if="toast.title"
                  class="text-sm font-semibold"
                  :class="getTitleClasses(toast.type)"
                >
                  {{ toast.title }}
                </div>
                <div class="text-sm" :class="getMessageClasses(toast.type)">
                  {{ toast.message }}
                </div>
              </div>

              <!-- Close Button -->
              <button
                @click="removeToast(toast.id)"
                class="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X :size="16" class="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="toast.duration > 0" class="h-1 bg-gray-200">
            <div
              class="h-full transition-all ease-linear"
              :class="getProgressClasses(toast.type)"
              :style="{
                width: `${(toast.remainingTime / toast.duration) * 100}%`,
                transitionDuration: `${toast.remainingTime}ms`,
              }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from "vue";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-vue-next";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration: number;
  remainingTime: number;
}

const toasts = ref<Toast[]>([]);

// Methods
const addToast = (toast: Omit<Toast, "id" | "remainingTime">) => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newToast: Toast = {
    ...toast,
    id,
    remainingTime: toast.duration,
  };

  toasts.value.push(newToast);

  if (toast.duration > 0) {
    startCountdown(newToast);
  }
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const startCountdown = (toast: Toast) => {
  const interval = setInterval(() => {
    toast.remainingTime -= 100;

    if (toast.remainingTime <= 0) {
      clearInterval(interval);
      removeToast(toast.id);
    }
  }, 100);
};

// Style helper methods
const getToastClasses = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "border-l-4 border-l-emerald-500";
    case "error":
      return "border-l-4 border-l-red-500";
    case "warning":
      return "border-l-4 border-l-amber-500";
    case "info":
    default:
      return "border-l-4 border-l-blue-500";
  }
};

const getTitleClasses = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "text-emerald-900";
    case "error":
      return "text-red-900";
    case "warning":
      return "text-amber-900";
    case "info":
    default:
      return "text-blue-900";
  }
};

const getMessageClasses = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "text-emerald-700";
    case "error":
      return "text-red-700";
    case "warning":
      return "text-amber-700";
    case "info":
    default:
      return "text-blue-700";
  }
};

const getProgressClasses = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "bg-emerald-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-amber-500";
    case "info":
    default:
      return "bg-blue-500";
  }
};

// Global toast methods
const showSuccess = (message: string, title?: string, duration = 4000) => {
  addToast({ type: "success", message, title, duration });
};

const showError = (message: string, title?: string, duration = 5000) => {
  addToast({ type: "error", message, title, duration });
};

const showWarning = (message: string, title?: string, duration = 4000) => {
  addToast({ type: "warning", message, title, duration });
};

const showInfo = (message: string, title?: string, duration = 4000) => {
  addToast({ type: "info", message, title, duration });
};

// Expose methods globally
onMounted(() => {
  // Make toast methods available globally via window
  if (typeof window !== "undefined") {
    window.$toast = {
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo,
    };
  }
});

// Also provide via nuxt app
const { $toast } = useNuxtApp();
if (!$toast) {
  useNuxtApp().provide("toast", {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  });
}
</script>

<style scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
