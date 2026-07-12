export const git_l2 = `
# Instalasi Git & Konfigurasi Awal

Sebelum bisa mulai kerja, ada dua hal yang perlu diselesaikan: install Git di komputer, dan kasih tahu Git siapa kamu. Langkah ini cukup dilakukan sekali saja.

---

## 📥 Install Git

### Windows

1. Buka **git-scm.com/download/win**
2. Download installer
3. Jalankan — untuk pemula, **pilih semua opsi default** (Next berkali-kali)
4. Pastikan "Git Bash Here" tercentang

### macOS

\`\`\`bash
# Via Xcode Command Line Tools — cara paling mudah
xcode-select --install

# Atau via Homebrew kalau sudah ada
brew install git
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
sudo apt update && sudo apt install git
\`\`\`

---

## ✅ Verifikasi

Buka **Terminal** (Mac/Linux) atau **Git Bash** (Windows):

\`\`\`bash
git --version
# Output: git version 2.43.0
\`\`\`

Muncul versinya? Instalasi berhasil! 🎉

---

## 👤 Konfigurasi Identitas — Wajib Dilakukan!

Setiap commit akan mencatat nama dan email kamu. Git perlu tahu ini dulu sebelum bisa bikin commit:

\`\`\`bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
\`\`\`

Gunakan email yang sama dengan akun GitHub yang akan dibuat nanti.

### Konfigurasi Tambahan yang Direkomendasikan

\`\`\`bash
# Editor default — VS Code kalau sudah terinstall
git config --global core.editor "code --wait"

# Branch default bernama 'main' (standar modern)
git config --global init.defaultBranch main

# Warna di output terminal
git config --global color.ui auto
\`\`\`

### Verifikasi Konfigurasi

\`\`\`bash
git config --list

# Output:
# user.name=Budi Santoso
# user.email=budi@email.com
# core.editor=code --wait
# init.defaultbranch=main
\`\`\`

---

## 📁 Tiga Area Git — Konsep Paling Penting

Ini yang sering bikin bingung di awal. Pahami ini dulu sebelum lanjut:

\`\`\`
┌─────────────────┐    git add    ┌──────────────┐   git commit  ┌──────────────┐
│  Working Tree   │ ────────────► │ Staging Area │ ────────────► │  Repository  │
│  (Folder kamu)  │               │  (Antrian)   │               │  (Sejarah)   │
└─────────────────┘               └──────────────┘               └──────────────┘
     File yang                    File yang siap                  File yang sudah
     sedang diedit                di-commit                       tersimpan permanen
\`\`\`

Kenapa ada Staging Area? Supaya kamu bisa pilih **perubahan mana yang mau masuk satu commit**. Mungkin kamu edit 5 file, tapi yang relevan untuk satu commit hanya 2 file — kamu bisa stage 2 itu saja.

---

## 🔑 Perintah Dasar

\`\`\`bash
# Inisialisasi repo baru di folder saat ini
git init

# Cek status — mana yang berubah, mana yang sudah staged
git status

# Tambahkan ke staging area
git add namafile.txt    # File spesifik
git add .               # Semua file yang berubah

# Simpan snapshot (commit)
git commit -m "Pesan yang menjelaskan perubahan"

# Lihat riwayat commit
git log
git log --oneline       # Versi ringkas
\`\`\`

---

## 💡 Pesan Commit yang Baik

Pesan commit yang bagus itu seperti judul email yang jelas — orang langsung tahu isinya:

\`\`\`bash
# ❌ Tidak informatif sama sekali
git commit -m "update"
git commit -m "fix"
git commit -m "wkwk"

# ✅ Jelas dan spesifik
git commit -m "Tambah validasi email di form registrasi"
git commit -m "Fix crash saat list produk kosong"
git commit -m "Update dependensi ke versi terbaru"
\`\`\`

**Format yang populer di tim profesional:**
\`\`\`
feat: tambah halaman profil pengguna
fix: perbaiki bug tombol submit tidak aktif
docs: update README instalasi
refactor: sederhanakan logika autentikasi
\`\`\`

---

## 📝 Ringkasan

- Install Git sekali, konfigurasi nama dan email sekali
- Tiga area: Working Tree (edit) → Staging Area (siap commit) → Repository (tersimpan)
- Alur dasar: edit file → \`git add\` → \`git commit\`
- Pesan commit harus deskriptif — "fix bug" itu tidak membantu siapapun

> **Di pelajaran berikutnya, kita praktik langsung: buat repo pertama dan commit pertama!** 💻
`;
