# Troubleshooting Guide - Login Issue

## ✅ Diagnosis Complete!

Berdasarkan testing yang telah dilakukan:

### **Problem Identification:**
1. ✅ Database connection: WORKING
2. ✅ User data exists: WORKING  
3. ✅ Password verification: WORKING
4. ✅ Script login: WORKING
5. ❓ Browser login: Need to test manually

### **Root Cause Found:**
Masalah utama adalah **missing schema configuration** di `lib/supabaseClient.ts`.

**Before Fix:**
```javascript
export const supabase = createClient(url, key, {
  auth: { ... }
  // Missing: db: { schema: "sbs" }
});
```

**After Fix:**
```javascript
export const supabase = createClient(url, key, {
  db: { schema: "sbs" },  // ✅ Added this!
  auth: { ... }
});
```

### **Steps Taken:**
1. ✅ Fixed schema configuration in supabaseClient.ts
2. ✅ Fixed table references in admin/kasir pages (removed `sbs.` prefix)
3. ✅ Tested with exact frontend config - ALL WORKING

### **Manual Testing:**
To test in browser:
1. Go to: http://localhost:3000
2. Try login with:
   - **Email**: `test@test.test` + Password: `12345678`
   - **ID**: `001-ADN` + Password: `12345678`

### **Test Results:**
```bash
🌐 Testing Frontend Login Configuration

🔐 Testing frontend-style login: test@test.test
✅ Login berhasil! 👤 Aden Sahwaludin (admin)

🔐 Testing frontend-style login: 001-ADN  
✅ Login berhasil! 👤 Aden Sahwaludin (admin)

🔐 Testing frontend-style login: kasir@kasir.kasir
✅ Login berhasil! 👤 Kasir1 (kasir)

🔐 Testing frontend-style login: 002-KSR
✅ Login berhasil! 👤 Kasir1 (kasir)
```

### **If Still Getting "ID Pengguna tidak ditemukan":**

1. **Clear Browser Cache:**
   ```
   Ctrl + Shift + R (force refresh)
   Clear Local Storage in DevTools
   ```

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for any error messages
   - Check Network tab for failed requests

3. **Restart Dev Server:**
   ```bash
   # Stop current server
   Ctrl + C
   
   # Start fresh
   bun run dev
   ```

### **Debug Code for Browser Console:**
If you want to test directly in browser console:

```javascript
// Test query in browser DevTools console
const testLogin = async () => {
  const { data, error } = await $nuxt.$supabase
    .from("pengguna")
    .select("*")
    .eq("id_pengguna", "001-ADN")
    .single();
    
  console.log("Data:", data);
  console.log("Error:", error);
};

testLogin();
```

---

## ✅ **FIXED! Schema configuration was the issue.**

**The login system should now work perfectly in the browser!** 🎉
