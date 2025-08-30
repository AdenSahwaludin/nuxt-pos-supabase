<template>
  <div>
    <Header
      title="Dashboard"
      description="Selamat datang di sistem Point of Sale. Kelola produk, pesanan, dan pengaturan dengan mudah."
    />

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Total Produk</h3>
        <p class="stat-number">150</p>
        <NuxtLink to="/products" class="card-link">Lihat Produk</NuxtLink>
      </div>

      <div class="dashboard-card">
        <h3>Total Pesanan</h3>
        <p class="stat-number">45</p>
        <NuxtLink to="/orders" class="card-link">Lihat Pesanan</NuxtLink>
      </div>

      <div class="dashboard-card">
        <h3>Penjualan Hari Ini</h3>
        <p class="stat-number">Rp 2.500.000</p>
        <span class="card-link">Detail</span>
      </div>

      <div class="dashboard-card">
        <h3>Pengaturan</h3>
        <p class="stat-number">⚙️</p>
        <NuxtLink to="/settings" class="card-link">Kelola</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.dashboard-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #4f46e5;
  margin: 0.5rem 0 1.5rem 0;
}

.card-link {
  display: inline-block;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #4f46e5;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.card-link:hover {
  background: #4f46e5;
  color: white;
}
</style>
