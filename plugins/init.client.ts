export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Initialize auth on app start
  await authStore.initAuth();
});
