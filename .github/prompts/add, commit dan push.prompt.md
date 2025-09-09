---
mode: agent
model: o4-mini (Preview)
---

Untuk menambahkan semua perubahan, commit, dan push ke branch `main` dengan pesan commit mengikuti Conventional Commits (standar industri), gunakan perintah berikut:

```bash
git add .

# Format commit:
# <type>(<scope>): <short description>
# Contoh pesan commit:
# feat(pengguna): hash password and uppercase user ID on login

git commit -m "feat(pengguna): hash password and uppercase user ID on login"

git push origin main
```
