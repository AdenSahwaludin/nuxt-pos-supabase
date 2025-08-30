<template>
  <div>
    <Header 
      title="Produk" 
      description="Kelola semua produk di toko Anda. Tambah, edit, atau hapus produk dengan mudah."
    />
    
    <div class="products-content">
      <div class="products-header">
        <button class="btn-primary">
          + Tambah Produk
        </button>
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Cari produk..." 
            class="search-input"
          />
        </div>
      </div>
      
      <div class="products-grid">
        <div class="product-card" v-for="i in 6" :key="i">
          <div class="product-image">
            <div class="placeholder-image">📦</div>
          </div>
          <div class="product-info">
            <h3>Produk {{ i }}</h3>
            <p class="product-price">Rp {{ (i * 50000).toLocaleString() }}</p>
            <p class="product-stock">Stok: {{ i * 10 }}</p>
            <div class="product-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
</script>

<style scoped>
.products-content {
  margin-top: 1rem;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.search-box {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 200px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  font-size: 3rem;
  color: #9ca3af;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
  margin: 0.5rem 0;
}

.product-stock {
  color: #6b7280;
  margin: 0.5rem 0 1rem 0;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: white;
  color: #4f46e5;
  border-color: #4f46e5;
}

.btn-edit:hover {
  background: #4f46e5;
  color: white;
}

.btn-delete {
  background: white;
  color: #dc2626;
  border-color: #dc2626;
}

.btn-delete:hover {
  background: #dc2626;
  color: white;
}

@media (max-width: 768px) {
  .products-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
}
</style>
