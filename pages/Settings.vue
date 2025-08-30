<template>
  <div>
    <Header
      title="Pengaturan"
      description="Kelola pengaturan sistem, profil toko, dan konfigurasi aplikasi."
    />

    <div class="settings-content">
      <div class="settings-grid">
        <div class="settings-section">
          <h3 class="section-title">Profil Toko</h3>
          <div class="form-group">
            <label class="form-label">Nama Toko</label>
            <input
              type="text"
              class="form-input"
              placeholder="Masukkan nama toko"
              value="Toko ABC"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Alamat</label>
            <textarea
              class="form-input"
              rows="3"
              placeholder="Masukkan alamat toko"
            >
Jl. Contoh No. 123, Jakarta</textarea
            >
          </div>
          <div class="form-group">
            <label class="form-label">Nomor Telepon</label>
            <input
              type="tel"
              class="form-input"
              placeholder="Masukkan nomor telepon"
              value="021-12345678"
            />
          </div>
        </div>

        <div class="settings-section">
          <h3 class="section-title">Pengaturan Sistem</h3>
          <div class="form-group">
            <label class="form-label">Mata Uang</label>
            <select class="form-input">
              <option value="IDR">Rupiah (IDR)</option>
              <option value="USD">Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Zona Waktu</label>
            <select class="form-input">
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" checked />
              <span class="checkmark"></span>
              Notifikasi Email
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" />
              <span class="checkmark"></span>
              Mode Gelap
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="section-title">Keamanan</h3>
          <div class="form-group">
            <label class="form-label">Password Saat Ini</label>
            <input
              type="password"
              class="form-input"
              placeholder="Masukkan password saat ini"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Password Baru</label>
            <input
              type="password"
              class="form-input"
              placeholder="Masukkan password baru"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Konfirmasi Password</label>
            <input
              type="password"
              class="form-input"
              placeholder="Konfirmasi password baru"
            />
          </div>
        </div>

        <div class="settings-section">
          <h3 class="section-title">Backup & Restore</h3>
          <div class="backup-actions">
            <button class="btn-secondary">📥 Download Backup</button>
            <button class="btn-secondary">📤 Upload Backup</button>
            <button class="btn-danger">🗑️ Reset Data</button>
          </div>
          <p class="backup-info">
            Terakhir backup: {{ new Date().toLocaleDateString() }}
          </p>
        </div>
      </div>

      <div class="settings-footer">
        <button class="btn-primary">Simpan Perubahan</button>
        <button class="btn-secondary">Batalkan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
</script>

<style scoped>
.settings-content {
  margin-top: 1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.settings-section {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox {
  margin-right: 0.75rem;
  width: 1rem;
  height: 1rem;
}

.backup-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.backup-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.settings-footer {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
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

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-danger {
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-danger:hover {
  background: #dc2626;
  color: white;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-section {
    padding: 1.5rem;
  }

  .settings-footer {
    flex-direction: column;
  }
}
</style>
