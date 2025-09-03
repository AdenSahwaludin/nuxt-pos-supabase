export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Check if user is authenticated
  if (!authStore.user) {
    return navigateTo("/");
  }

  // Check if route has role requirement
  const requiredRole = to.meta?.role;

  if (requiredRole && authStore.profile?.role !== requiredRole) {
    return navigateTo("/forbidden");
  }
});
