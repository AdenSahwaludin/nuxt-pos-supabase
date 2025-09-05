<<<<<<< HEAD
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Ensure user and profile are loaded
  if (!authStore.user || !authStore.profile) {
    await authStore.initAuth();
  }

  // Redirect to login if user or profile still missing
  if (!authStore.user || !authStore.profile) {
=======
export default defineNuxtRouteMiddleware((to) => {
  console.log("🔧 Role middleware triggered for:", to.path);

  const authStore = useAuthStore();

  console.log("👤 Auth check:", {
    hasUser: !!authStore.user,
    hasProfile: !!authStore.profile,
    profileRole: authStore.profile?.role,
    userLoading: authStore.loading,
  });

  // Check if user is authenticated
  if (!authStore.user) {
    console.log("❌ No user found, redirecting to login");
>>>>>>> 75b4990 (fix: update PenggunaCreateModal.vue with manual edits)
    return navigateTo("/login");
  }

  // Check if route has role requirement
  const requiredRole = to.meta?.requiredRole || to.meta?.role;
<<<<<<< HEAD
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
=======
  console.log("🔐 Required role:", requiredRole);
  console.log("👤 User role:", authStore.profile?.role);

  if (requiredRole) {
    if (!authStore.profile) {
      console.log("❌ No profile found but role required");
>>>>>>> 75b4990 (fix: update PenggunaCreateModal.vue with manual edits)
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
