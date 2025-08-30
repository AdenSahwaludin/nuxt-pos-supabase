<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">POS System</div>
      <ul :class="['nav-menu', { open: isOpen }]">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/products">Products</NuxtLink></li>
        <li><NuxtLink to="/orders">Orders</NuxtLink></li>
        <li><NuxtLink to="/settings">Settings</NuxtLink></li>
      </ul>
      <div class="mobile-menu-icon" @click="toggleMenu">
        <span v-if="!isOpen">☰</span>
        <span v-else>✕</span>
      </div>
    </div>
  </nav>
  <main>
    <slot />
  </main>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
function toggleMenu() {
  isOpen.value = !isOpen.value;
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-menu {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  transition: max-height 0.3s ease;
}
.nav-menu li a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  position: relative;
}
.nav-menu li a::after {
  content: "";
  display: block;
  height: 2px;
  background: #fff;
  width: 0;
  transition: width 0.3s;
  position: absolute;
  bottom: -4px;
  left: 0;
}
.nav-menu li a:hover::after {
  width: 100%;
}
.mobile-menu-icon {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}
@media (max-width: 768px) {
  .mobile-menu-icon {
    display: block;
  }
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #4f46e5;
    flex-direction: column;
    overflow: hidden;
    max-height: 0;
  }
  .nav-menu.open {
    max-height: 300px;
  }
  .nav-menu li {
    padding: 1rem;
    text-align: center;
  }
}
main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
