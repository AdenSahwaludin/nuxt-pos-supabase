export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Ensure user and profile are loaded
  if (!authStore.user || !authStore.profile) {
    await authStore.initAuth();
  }

  // Redirect to login if user or profile still missing
  if (!authStore.user || !authStore.profile) {
    return navigateTo("/login");
  }

  // Check if route has role requirement
  const requiredRole = to.meta?.requiredRole || to.meta?.role;
  const userRole = authStore.profile?.role;

  if (!userRole) {
    return navigateTo("/login");
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's actual role
    if (userRole === "admin") {
      return navigateTo("/admin");
    } else if (userRole === "kasir") {
      return navigateTo("/kasir");
    } else {
      return navigateTo("/login");
    }

    if (!authStore.profile.role) {
      console.log("❌ No role in profile");
      return navigateTo("/login");
    }

    if (authStore.profile.role !== requiredRole) {
      console.log(
        "❌ Role mismatch:",
        authStore.profile.role,
        "vs",
        requiredRole
      );
      // Redirect based on user's actual role
      if (authStore.profile.role === "admin") {
        return navigateTo("/admin");
      } else if (authStore.profile.role === "kasir") {
        return navigateTo("/kasir");
      } else {
        return navigateTo("/login");
      }
    }
  }

  console.log("✅ Role middleware passed");
});
