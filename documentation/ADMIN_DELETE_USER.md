# Admin Delete User Endpoint

## Overview

Endpoint tunggal untuk menghapus user dari kedua tabel: `sbs.pengguna` dan `auth.users` secara bersamaan.

## Endpoint

```
POST /api/admin/delete-user
```

## Request Body

Kirim salah satu atau kombinasi identifier berikut:

```json
{
  "id_pengguna": "004-ASD", // ID format aplikasi
  "kode": "005-POI", // Kode alternatif (jika ada)
  "email": "user@example.com", // Email pengguna
  "auth_uid": "uuid-string", // UID dari auth.users
  "user_id": "uuid-string", // FK ke auth.users di tabel pengguna
  "hard": true // true = hard delete, false = soft delete
}
```

### Prioritas Pencarian

1. `auth_uid` (paling kuat)
2. `user_id`
3. `id_pengguna`
4. `email`
5. `kode`

## Response Format

### Sukses Penuh

```json
{
  "success": true,
  "deleted": {
    "pengguna": true,
    "auth": true
  },
  "meta": {
    "id_pengguna": "004-ASD",
    "auth_uid": "uuid-string",
    "email": "user@example.com"
  }
}
```

### Sukses Sebagian (dengan Warning)

```json
{
  "success": true,
  "deleted": {
    "pengguna": true,
    "auth": false
  },
  "warning": "Auth delete failed: User not found",
  "meta": {
    "id_pengguna": "004-ASD",
    "auth_uid": null,
    "email": "user@example.com"
  }
}
```

### Error

```json
{
  "success": false,
  "statusCode": 422,
  "statusMessage": "Harus kirim salah satu identifier: id_pengguna | kode | email | auth_uid | user_id"
}
```

## Frontend Usage

### Menggunakan $fetch

```javascript
const response = await $fetch("/api/admin/delete-user", {
  method: "POST",
  body: {
    id_pengguna: "004-ASD",
    hard: true,
  },
});

if (response.success) {
  if (response.warning) {
    // Tampilkan warning jika ada
    toast.warning(response.warning);
  }

  // Tampilkan sukses
  const message = response.deleted.auth
    ? "User dihapus dari sistem dan autentikasi"
    : "User dihapus dari sistem (peringatan auth)";
  toast.success(message);
} else {
  toast.error(response.statusMessage || "Gagal menghapus user");
}
```

### Template Prompt untuk Testing

```bash
# By UID (paling kuat)
"Hapus user by UID ini: 9d1600ce-07b7-460e-95bd-c7839582b614 (hard delete)."

# By ID Pengguna
"Hapus user by id_pengguna: 004-ASD."

# By Email (soft delete)
"Hapus user berdasarkan email: admin@toko.com (soft delete)."

# By User ID (FK)
"Hapus user dengan user_id: b1bf9b27-41e1-4d58-9b90-321b5f4c83c7."
```

## Requirements

### Environment Variables

```env
# Di .env file
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NUXT_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Server Setup

1. File `server/middleware/supabase.ts` harus ada untuk menyediakan context
2. Service role key harus tersedia untuk delete auth.users
3. RLS policies harus allow delete untuk admin

## Testing

### Manual Test

```bash
# Run development server
bun run dev

# Test endpoint
curl -X POST http://localhost:3000/api/admin/delete-user \
  -H "Content-Type: application/json" \
  -d '{"id_pengguna":"004-ASD","hard":true}'
```

### Test Script

```bash
node testing/testAdminDeleteUser.js
```

## Security Notes

1. **Service Role Key**: Tidak pernah diekpose ke client
2. **Server-only**: Semua operasi auth admin dilakukan di server
3. **Validation**: Minimal satu identifier harus diberikan
4. **Error Handling**: Graceful degradation jika auth delete gagal
5. **Logging**: Semua operasi tercatat di console untuk debugging

## Troubleshooting

### Error: SERVICE ROLE missing

- Pastikan `NUXT_SUPABASE_SERVICE_ROLE_KEY` ada di `.env`
- Restart development server

### Error: Auth delete failed

- User mungkin sudah tidak ada di auth.users
- RLS policy mungkin terlalu ketat
- Service role key mungkin tidak valid

### Error: Pengguna delete failed

- RLS policy untuk tabel pengguna
- User mungkin sudah tidak ada
- Database connection issue
