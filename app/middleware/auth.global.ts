export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware in server-side rendering
  if (process.server) return;

  const authStore = useAuthStore();

  // Routes that don't require authentication
  const publicRoutes = ["/", "/login"];

  // Always ensure auth is initialized
  if (!authStore.user) {
    await authStore.initAuth();
    
    // Wait a bit more for session to be fully restored
    let retries = 0;
    while (!authStore.user && retries < 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      retries++;
    }
  }

  // If not authenticated and trying to access protected route
  if (!authStore.user && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }

  // If authenticated and trying to access login page, redirect based on role
  if (authStore.user && authStore.profile?.role && to.path === "/login") {
    if (authStore.profile.role === "admin") {
      return navigateTo("/admin");
    } else if (authStore.profile.role === "kasir") {
      return navigateTo("/kasir");
    } else {
      return navigateTo("/dashboard");
    }
  }
});
