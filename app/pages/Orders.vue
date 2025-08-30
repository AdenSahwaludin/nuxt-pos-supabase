<template>
  <div>
    <Header 
      title="Pesanan" 
      description="Kelola semua pesanan pelanggan. Lihat status, proses, dan riwayat pesanan."
    />
    
    <div class="orders-content">
      <div class="orders-header">
        <button class="btn-primary">
          + Pesanan Baru
        </button>
        <div class="filter-tabs">
          <button class="tab-button active">Semua</button>
          <button class="tab-button">Pending</button>
          <button class="tab-button">Proses</button>
          <button class="tab-button">Selesai</button>
        </div>
      </div>
      
      <div class="orders-table">
        <div class="table-header">
          <div class="header-cell">ID Pesanan</div>
          <div class="header-cell">Pelanggan</div>
          <div class="header-cell">Total</div>
          <div class="header-cell">Status</div>
          <div class="header-cell">Tanggal</div>
          <div class="header-cell">Aksi</div>
        </div>
        
        <div class="table-row" v-for="i in 8" :key="i">
          <div class="table-cell">#{{ String(i).padStart(4, '0') }}</div>
          <div class="table-cell">Pelanggan {{ i }}</div>
          <div class="table-cell">Rp {{ (i * 125000).toLocaleString() }}</div>
          <div class="table-cell">
            <span :class="['status-badge', getStatusClass(i)]">
              {{ getStatus(i) }}
            </span>
          </div>
          <div class="table-cell">{{ new Date().toLocaleDateString() }}</div>
          <div class="table-cell">
            <div class="action-buttons">
              <button class="btn-view">Lihat</button>
              <button class="btn-edit">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'

function getStatus(index) {
  const statuses = ['Pending', 'Proses', 'Selesai', 'Dibatalkan']
  return statuses[index % statuses.length]
}

function getStatusClass(index) {
  const classes = ['pending', 'process', 'completed', 'cancelled']
  return classes[index % classes.length]
}
</script>

<style scoped>
.orders-content {
  margin-top: 1rem;
}

.orders-header {
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

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.tab-button:hover:not(.active) {
  background: #f3f4f6;
}

.orders-table {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1.5fr;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1.5fr;
  border-bottom: 1px solid #e5e7eb;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f9fafb;
}

.header-cell {
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-cell {
  padding: 1rem;
  color: #374151;
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.process {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-view, .btn-edit {
  padding: 0.375rem 0.75rem;
  border: 1px solid;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view {
  background: white;
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-view:hover {
  background: #f3f4f6;
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

@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .orders-table {
    overflow-x: auto;
  }
  
  .table-header, .table-row {
    min-width: 600px;
  }
}
</style>