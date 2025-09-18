export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Prevent multiple initialization
  if (authStore.initialized) {
    return;
  }

  try {
    await authStore.initAuth();
  } catch (error) {
    console.error("Failed to initialize auth:", error);
  }
});
