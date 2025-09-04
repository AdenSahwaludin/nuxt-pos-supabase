export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Check if user is authenticated
  if (!authStore.user) {
    return navigateTo("/login");
  }

  // Check if route has role requirement
  const requiredRole = to.meta?.requiredRole || to.meta?.role;

  if (requiredRole && authStore.profile?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (authStore.profile?.role === "admin") {
      return navigateTo("/admin");
    } else if (authStore.profile?.role === "kasir") {
      return navigateTo("/kasir");
    } else {
      return navigateTo("/login");
    }
  }
});
