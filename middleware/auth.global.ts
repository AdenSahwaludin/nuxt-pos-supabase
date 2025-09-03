export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware in server-side rendering
  if (process.server) return;

  const authStore = useAuthStore();

  // Routes that don't require authentication
  const publicRoutes = ["/", "/login"];

  // Initialize auth if not already done
  if (!authStore.user && !authStore.loading) {
    await authStore.initAuth();
  }

  // If not authenticated and trying to access protected route
  if (!authStore.user && !publicRoutes.includes(to.path)) {
    return navigateTo("/");
  }

  // If authenticated and trying to access login page, redirect based on role
  if (authStore.user && to.path === "/") {
    if (authStore.profile?.role === "admin") {
      return navigateTo("/admin");
    } else if (authStore.profile?.role === "kasir") {
      return navigateTo("/kasir");
    } else {
      return navigateTo("/dashboard");
    }
  }

  // Role-based access control
  if (authStore.user) {
    const userRole = authStore.profile?.role;

    // Admin routes - only accessible by admin
    if (to.path.startsWith("/admin") && userRole !== "admin") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access Denied - Admin Only",
      });
    }

    // Kasir routes - only accessible by kasir
    if (to.path.startsWith("/kasir") && userRole !== "kasir") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access Denied - Kasir Only",
      });
    }
  }
});
