interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const useToast = () => {
  const toasts = ref<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    toasts.value.push(newToast);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clear = () => {
    toasts.value = [];
  };

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ 
      type: 'success', 
      title, 
      message,
      ...options 
    });
  };

  const error = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ 
      type: 'error', 
      title, 
      message,
      duration: 7000, // Longer duration for errors
      ...options 
    });
  };

  const warning = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ 
      type: 'warning', 
      title, 
      message,
      ...options 
    });
  };

  const info = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ 
      type: 'info', 
      title, 
      message,
      ...options 
    });
  };

  return {
    toasts: toasts,
    addToast,
    removeToast,
    clear,
    success,
    error,
    warning,
    info,
  };
};