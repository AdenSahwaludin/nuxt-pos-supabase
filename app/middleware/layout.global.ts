export default defineNuxtRouteMiddleware((to) => {
  // Skip if page already has layout defined in definePageMeta
  if (to.meta.layout) {
    return;
  }

  const authStore = useAuthStore();
  const route = to.path;

  // Determine layout based on route prefix
  if (route.startsWith("/admin")) {
    setPageLayout("admin");
  } else if (route.startsWith("/kasir")) {
    setPageLayout("kasir");
  } else {
    // Fallback to user role if available
    if (authStore.userRole === "admin") {
      setPageLayout("admin");
    } else if (authStore.userRole === "kasir") {
      setPageLayout("kasir");
    } else {
      setPageLayout("default");
    }
  }
});
