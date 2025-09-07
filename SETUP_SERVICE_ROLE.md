# Environment Variables Setup Guide

## Required for Complete User Deletion

To enable complete user deletion (from both `pengguna` table and `auth.users`), you need to add the service role key to your `.env` file.

### Steps:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `Catatan Uang Toko`
3. Go to Settings → API
4. Copy the `service_role` key (not the `anon` key)
5. Add it to your `.env` file:

```env
SUPABASE_URL=https://mjxhddjoaoekdlhnqbhy.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Security Warning:

⚠️ **NEVER commit the service role key to version control!**
⚠️ **The service role key bypasses all RLS policies!**
⚠️ **Only use it for admin operations on the server side!**

### Current Status:

- ✅ User deletion from `pengguna` table works
- ⚠️ User deletion from `auth.users` requires service role key
- 🔧 Without service role key, users will remain in auth but won't be able to log in

### Testing:

After adding the service role key, you can test complete deletion by running:

```bash
node testing/debugDeleteAuthUser.js
```

### Manual Cleanup:

If you can't set up the service role key right now, you can manually delete users from the Supabase Auth dashboard:

1. Go to Authentication → Users in your Supabase dashboard
2. Find the user by email
3. Click the delete button
