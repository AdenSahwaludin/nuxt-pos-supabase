# Dokumentasi Sistem Login Supabase - SBS POS

## Overview

Sistem login telah diintegrasikan dengan Supabase Authentication dan menggunakan database real (bukan demo lagi). Sistem mendukung login dengan email atau User ID format dan role-based access control.

## Fitur Yang Telah Diimplementasi

### 1. Authentication System

- ✅ **Supabase Auth Integration**: Login menggunakan email/password via Supabase
- ✅ **Dual Login Method**: Support email dan User ID format (001-ADN)
- ✅ **Session Management**: Persistent session dengan auto-refresh token
- ✅ **Profile Loading**: Load user profile dari database setelah login

### 2. Role-Based Access Control

- ✅ **Admin Role**: Akses ke `/admin` dashboard dengan fitur manajemen
- ✅ **Kasir Role**: Akses ke `/kasir` dashboard dengan fitur POS
- ✅ **Middleware Protection**: Route protection berdasarkan role

### 3. User Interface

- ✅ **Modern Login Page**: Glass morphism design dengan loading states
- ✅ **Admin Layout**: Dashboard dengan navigation dan user menu
- ✅ **Kasir Layout**: POS-focused layout dengan quick actions
- ✅ **Responsive Design**: Mobile-friendly layouts

### 4. Database Integration

- ✅ **Real Database Queries**: Data dari Supabase PostgreSQL
- ✅ **Row Level Security**: Implementasi RLS policies
- ✅ **Live Statistics**: Real-time data di dashboard

## Setup Database

### 1. Jalankan Script SQL

Jalankan script `database_setup.sql` di Supabase SQL Editor untuk membuat struktur database.

### 2. Buat User di Supabase Auth

1. Buka Supabase Dashboard → Authentication → Users
2. Create user baru dengan email dan password
3. Copy User ID yang digenerate

### 3. Insert Profile User

Setelah user dibuat di Auth, insert profile ke database:

```sql
-- Untuk Admin
INSERT INTO sbs.pengguna (id_pengguna, nama, email, role, user_id) VALUES
('001-ADM', 'Admin Toko', 'admin@example.com', 'admin', '[AUTH_USER_ID]');

-- Untuk Kasir
INSERT INTO sbs.pengguna (id_pengguna, nama, email, role, user_id) VALUES
('002-KSR', 'Kasir 1', 'kasir@example.com', 'kasir', '[AUTH_USER_ID]');
```

Ganti `[AUTH_USER_ID]` dengan ID yang digenerate oleh Supabase Auth.

## Cara Menggunakan

### 1. Login

- Buka `http://localhost:3000`
- Login dengan:
  - **Email**: `admin@example.com` atau `kasir@example.com`
  - **User ID**: `001-ADM` atau `002-KSR`
  - **Password**: Sesuai yang di-set di Supabase Auth

### 2. Dashboard Admin

Setelah login sebagai admin, Anda akan diarahkan ke `/admin` dengan fitur:

- Statistics dashboard dengan data real dari database
- Quick actions untuk manajemen produk, pelanggan, laporan
- Navigation menu lengkap

### 3. Dashboard Kasir

Setelah login sebagai kasir, Anda akan diarahkan ke `/kasir` dengan fitur:

- Personal statistics (transaksi yang dibuat kasir tersebut)
- Quick access ke POS system
- Riwayat transaksi personal

## Struktur Code

### Authentication Store (`stores/auth.ts`)

```typescript
-signIn(identifier, password) - // Login dengan email atau User ID
  signOut() - // Logout dan clear session
  loadProfile() - // Load user profile dari database
  initAuth(); // Initialize auth state saat app startup
```

### Middleware

- `middleware/auth.global.ts`: Global authentication check
- `middleware/role.ts`: Role-based access control

### Layouts

- `layouts/admin.vue`: Admin dashboard layout
- `layouts/kasir.vue`: Kasir dashboard layout

### Pages

- `pages/index.vue`: Login page dengan Supabase integration
- `pages/admin/index.vue`: Admin dashboard dengan real data
- `pages/kasir/index.vue`: Kasir dashboard dengan personal stats

## Environment Variables

Pastikan file `.env` sudah ada dengan konfigurasi:

```env
SUPABASE_URL=https://mjxhddjoaoekdlhnqbhy.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Schema

### Tables Utama:

- `sbs.pengguna`: User profiles linked ke Supabase Auth
- `sbs.pelanggan`: Customer data
- `sbs.produk`: Product catalog
- `sbs.transaksi`: Transaction records
- `sbs.kategori`: Product categories

### Security:

- Row Level Security (RLS) enabled
- Role-based policies
- Secure authentication flow

## Testing

### 1. Test Login

- ✅ Login dengan email berhasil
- ✅ Login dengan User ID berhasil
- ✅ Error handling untuk credentials salah
- ✅ Loading states dan user feedback

### 2. Test Role Redirection

- ✅ Admin diarahkan ke `/admin`
- ✅ Kasir diarahkan ke `/kasir`
- ✅ Unauthorized access blocked

### 3. Test Dashboard Data

- ✅ Admin dashboard menampilkan total statistics
- ✅ Kasir dashboard menampilkan personal statistics
- ✅ Real-time data dari database

## Next Steps

Untuk melanjutkan pengembangan:

1. **Complete POS System**: Implementasi halaman `/pos` untuk transaksi
2. **Product Management**: CRUD operations untuk admin
3. **Customer Management**: Customer registration dan management
4. **Installment System**: Credit transaction workflow
5. **Reporting**: Advanced reporting features

## Troubleshooting

### Error: Cannot find module '~/lib/supabaseClient'

- Pastikan TypeScript aliases sudah dikonfigurasi
- Restart development server

### Database Connection Error

- Periksa environment variables
- Pastikan Supabase project aktif

### RLS Policy Error

- Pastikan user sudah ada di tabel `sbs.pengguna`
- Check RLS policies di Supabase

---

**Sistem login sekarang fully integrated dengan Supabase dan menggunakan data real!** 🎉
