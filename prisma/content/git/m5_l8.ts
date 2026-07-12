export const git_l8 = `
# Git Workflow Profesional & Best Practices

Developer profesional tidak hanya tahu perintah Git — mereka menggunakannya secara **konsisten, terstruktur, dan kolaboratif**. Inilah yang dipakai tim di perusahaan teknologi terkemuka.

---

## 🌊 Pilih Workflow yang Tepat

### GitHub Flow — Paling Populer untuk Tim Modern

Cocok untuk tim kecil-menengah, startup, dan continuous deployment:

\`\`\`
main ──────────────────────────────────────────►
       ↑  merge PR  ↑  merge PR  ↑  merge PR
  [branch]     [branch]     [branch]
   fitur-A      fix-B        fitur-C
\`\`\`

**Aturan:**
- \`main\` = selalu production-ready
- Semua perubahan via branch + Pull Request
- Deploy setelah merge ke main

### GitFlow — Untuk Rilis Terjadwal

Cocok untuk software dengan versi rilis:

\`\`\`
main ──────────────────────────────────────────►
       ↑ release         ↑ hotfix
develop ──────────────────────────────────────►
          ↑ fitur   ↑ fitur   ↑ fitur
\`\`\`

Branch: \`main\`, \`develop\`, \`feature/*\`, \`release/*\`, \`hotfix/*\`

---

## 📏 Aturan Emas Git

### 1. Commit Early, Commit Often

\`\`\`bash
# ❌ Buruk: Kerja 3 hari, baru 1 commit besar
git commit -m "update banyak hal"

# ✅ Baik: Commit kecil, fokus, sering
git commit -m "feat: Buat struktur komponen LoginForm"
git commit -m "feat: Tambah validasi email di LoginForm"
git commit -m "feat: Integrasi API login ke LoginForm"
git commit -m "test: Tambah unit test LoginForm"
\`\`\`

### 2. Jangan Commit File Sensitif

\`\`\`bash
# JANGAN pernah commit:
.env
*.pem
*_rsa (private key)
config/database.yml (dengan password)
credentials.json

# Jika terlanjur di-commit, gunakan:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
# (Atau lebih modern: git filter-repo)

# Setelah itu GANTI password/API key yang ter-expose!
\`\`\`

### 3. Satu PR = Satu Tujuan

\`\`\`
# ❌ PR yang terlalu besar dan campur aduk:
"Tambah fitur payment + fix UI + update README + refactor database"

# ✅ PR yang fokus dan mudah di-review:
"Tambah integrasi Midtrans untuk payment kursus"
\`\`\`

### 4. Pull Sebelum Push

\`\`\`bash
# Rutinitas harian
git pull --rebase   # Ambil update, taruh commit kita di atas
git push

# Jika ada conflict setelah pull --rebase:
# 1. Resolve conflict
# 2. git add .
# 3. git rebase --continue
# 4. git push
\`\`\`

---

## 🔖 Conventional Commits

Standar internasional untuk pesan commit yang konsisten dan otomatis bisa di-parse:

\`\`\`bash
# Format:
# <type>(<scope>): <description>
#
# [optional body]
#
# [optional footer]

# Types:
feat:      Fitur baru
fix:       Perbaikan bug
docs:      Perubahan dokumentasi
style:     Format kode (bukan logika)
refactor:  Refaktor tanpa tambah fitur atau fix
perf:      Peningkatan performa
test:      Tambah atau perbaiki test
build:     Perubahan build system atau dependencies
ci:        Perubahan CI/CD
chore:     Pemeliharaan (update deps, dll)
revert:    Membalik commit sebelumnya

# Contoh nyata:
git commit -m "feat(auth): Tambah login dengan Google OAuth"
git commit -m "fix(payment): Perbaiki race condition saat checkout"
git commit -m "docs: Update panduan setup environment"
git commit -m "refactor(api): Pisahkan logic validasi ke helper"
git commit -m "perf(db): Tambah index pada kolom email di tabel users"

# Commit dengan breaking change:
git commit -m "feat!: Ubah format response API dari XML ke JSON

BREAKING CHANGE: Client perlu update parser dari XML ke JSON"
\`\`\`

---

## 🤖 Automasi dengan Git Hooks

Git hooks = script yang otomatis dijalankan sebelum/sesudah perintah Git tertentu:

\`\`\`bash
# Lokasi: .git/hooks/
# Contoh hook populer:

# pre-commit: Jalankan lint sebelum commit
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint gagal! Commit dibatalkan."
    exit 1
fi
echo "✅ Lint berhasil!"

# commit-msg: Validasi format pesan commit
# .git/hooks/commit-msg
#!/bin/sh
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,72}$"
if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "❌ Format commit salah!"
    echo "Harus: type(scope): description"
    exit 1
fi
\`\`\`

**Atau gunakan Husky** (lebih mudah untuk tim):
\`\`\`bash
npm install --save-dev husky lint-staged
npx husky init
\`\`\`

---

## 🏥 Menyelamatkan Situasi Darurat

### "Saya Push ke Branch yang Salah!"

\`\`\`bash
# Reset branch remote ke commit sebelumnya
git reset HEAD~1             # Batalkan commit lokal
git push origin main --force-with-lease  # Force push
\`\`\`

### "Saya Hapus Branch yang Penting!"

\`\`\`bash
# Cari commit terakhir dari branch yang terhapus
git reflog

# Buat branch baru dari commit tersebut
git checkout -b branch-recovery a1b2c3d
\`\`\`

### "Saya git reset --hard dan Data Hilang!"

\`\`\`bash
# Git menyimpan semua commit 90 hari (reflog)
git reflog

# Temukan commit yang hilang dan restore
git checkout -b recovery-branch a1b2c3d
\`\`\`

### "Merge Conflict yang Sangat Kompleks"

\`\`\`bash
# Gunakan visual merge tool
git mergetool

# Atau gunakan VS Code sebagai merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
\`\`\`

---

## 📊 Git untuk Non-Developer

Git bukan hanya untuk programmer. Contoh penggunaan:

**Penulis/Editor:**
\`\`\`bash
git init artikel-buku
git add chapter-01.md
git commit -m "draft: Selesaikan chapter 1 - pengantar"
git commit -m "revisi: Perbaiki alur narasi chapter 1 sesuai feedback editor"
\`\`\`

**Data Analyst:**
\`\`\`bash
git add analisis_penjualan_q3.ipynb
git commit -m "analysis: Tambah visualisasi tren penjualan bulanan"
\`\`\`

**Desainer (file teks seperti SVG):**
\`\`\`bash
git commit -m "design: Update warna primary dari #3B82F6 ke #6366F1"
\`\`\`

---

## 🎓 Sertifikasi & Langkah Selanjutnya

Setelah menguasai Git, langkah selanjutnya:

1. **GitHub Profile** — isi dengan proyek dan kontribusi aktif
2. **Open Source** — kontribusi ke proyek yang Anda gunakan
3. **GitHub Actions** — pelajari CI/CD automation
4. **GitOps** — infrastructure as code dengan Git
5. **Monorepo tools** — Nx, Turborepo untuk proyek skala besar

---

## 📝 Cheat Sheet Final

\`\`\`bash
# Setup
git config --global user.name "Nama"
git config --global user.email "email@email.com"

# Dasar
git init                    # Mulai repo
git clone <url>             # Clone repo
git status                  # Cek status
git add .                   # Stage semua
git commit -m "pesan"       # Commit
git log --oneline --graph   # Lihat riwayat

# Branch
git branch                  # Lihat branch
git switch -c nama          # Buat & pindah
git merge nama              # Merge ke branch aktif

# Remote
git remote add origin <url> # Tambah remote
git push -u origin main     # Push pertama
git push                    # Push berikutnya
git pull                    # Ambil update

# Advanced
git stash                   # Simpan sementara
git stash pop               # Kembalikan stash
git rebase main             # Sync dengan main
git rebase -i HEAD~3        # Edit riwayat
git reset --soft HEAD~1     # Batalkan commit (simpan perubahan)
git revert HEAD             # Batalkan commit (aman untuk publik)
git cherry-pick <hash>      # Ambil commit tertentu
git tag v1.0.0              # Buat tag versi
\`\`\`

---

## 🏆 Selamat! Anda Sudah Mahir Git!

Dari tidak tahu apa itu version control, kini Anda menguasai:
- ✅ Konsep dasar Git dan GitHub
- ✅ Commit, branch, merge
- ✅ Kolaborasi dengan fork dan PR
- ✅ Teknik lanjutan: rebase, stash, cherry-pick
- ✅ Workflow profesional

**Git adalah skill yang dipakai seumur karir developer. Semakin sering dipakai, semakin terasa natural!** 🚀
`;
