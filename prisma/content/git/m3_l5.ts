export const git_l5 = `
# GitHub — Kodenya di Cloud, Bisa Diakses dari Mana Saja

Git di komputer lokal sudah bagus untuk kerja sendiri. Tapi ada dua masalah yang belum terpecahkan: **backup** dan **kolaborasi**.

Kalau laptopmu rusak atau hilang, semua kodenya ikut hilang. Dan kalau mau kerja bareng orang lain, kamu tidak bisa share folder lewat flashdisk setiap kali ada update.

GitHub menyelesaikan keduanya: repository tersimpan di cloud, bisa diakses dari mana saja, dan bisa dikelola bersama tim.

---

## 📝 Buat Akun GitHub

1. Kunjungi **github.com**
2. Klik **Sign up**, isi email, password, username
3. Verifikasi email

Tips username: pilih yang profesional karena ini akan terlihat di semua kontribusimu (contoh: \`budi-santoso\`, \`budidev\`).

---

## 🔑 SSH Key — Login Tanpa Password

Setiap kali push ke GitHub, kamu perlu autentikasi. Ada dua cara: HTTPS (pakai password tiap kali) atau SSH (sekali setup, tidak perlu password lagi). SSH jauh lebih nyaman.

\`\`\`bash
# Generate pasangan kunci SSH
ssh-keygen -t ed25519 -C "email@kamu.com"
# Tekan Enter untuk semua pertanyaan (gunakan lokasi default)

# Hasilnya dua file:
# ~/.ssh/id_ed25519      ← Private key (RAHASIA, jangan dibagikan!)
# ~/.ssh/id_ed25519.pub  ← Public key (ini yang kita daftarkan ke GitHub)

# Tampilkan public key
cat ~/.ssh/id_ed25519.pub
# Copy teksnya (dimulai dengan "ssh-ed25519 ...")
\`\`\`

Di GitHub:
1. Foto profil → **Settings** → **SSH and GPG keys** → **New SSH key**
2. Title: nama komputermu
3. Paste public key, klik **Add SSH key**

\`\`\`bash
# Test koneksi
ssh -T git@github.com
# Output sukses: "Hi username! You've successfully authenticated..."
\`\`\`

---

## 📤 Push Repo Lokal ke GitHub

### Buat Repo di GitHub Dulu
1. Klik **+** → **New repository**
2. Nama repo (misal: \`belajar-git\`)
3. Description (opsional)
4. Public atau Private
5. **JANGAN** centang "Initialize with README" (kita sudah punya)
6. Klik **Create repository**

### Hubungkan & Push

\`\`\`bash
# Tambahkan GitHub sebagai "remote" (server jarak jauh)
git remote add origin git@github.com:username/belajar-git.git

# Cek remote yang terdaftar
git remote -v
# origin  git@github.com:username/belajar-git.git (fetch)
# origin  git@github.com:username/belajar-git.git (push)

# Push ke GitHub (pertama kali)
git push -u origin main
# -u = set upstream (setelah ini cukup "git push")

# Push berikutnya cukup:
git push
\`\`\`

---

## 📥 Clone — Download Repo dari GitHub

\`\`\`bash
# Clone repo orang lain (atau repo Anda sendiri di komputer lain)
git clone git@github.com:username/nama-repo.git

# Clone dengan nama folder berbeda
git clone git@github.com:username/nama-repo.git nama-folder-lokal

# Masuk ke folder yang di-clone
cd nama-repo
\`\`\`

---

## 🔄 Pull — Ambil Update Terbaru

\`\`\`bash
# Ambil dan gabungkan perubahan dari GitHub
git pull

# Sama dengan:
git fetch origin    # Ambil tapi jangan merge dulu
git merge origin/main  # Baru merge

# Pull dari branch tertentu
git pull origin main
\`\`\`

---

## 🔁 Siklus Kerja Harian dengan GitHub

\`\`\`bash
# Pagi: ambil update terbaru dari tim
git pull

# Kerjakan tugas...
git add .
git commit -m "feat: Selesaikan halaman dashboard"

# Selesai: kirim ke GitHub
git push

# Kalau ada yang push di GitHub sementara Anda coding:
git pull --rebase   # Ambil update, taruh commit Anda di atas
git push
\`\`\`

---

## 📋 README.md — Kartu Nama Repo Anda

README.md adalah file pertama yang dilihat orang di halaman GitHub. Buat yang informatif:

\`\`\`markdown
# Nama Proyek

Deskripsi singkat apa yang dilakukan proyek ini.

## 🚀 Fitur
- Fitur 1
- Fitur 2

## 🛠️ Cara Instalasi

\`\`\`bash
git clone https://github.com/username/repo.git
cd repo
npm install
npm run dev
\`\`\`

## 📖 Cara Penggunaan

Instruksi penggunaan...

## 🤝 Kontribusi

Pull request sangat diterima!

## 📄 Lisensi

MIT
\`\`\`

---

## 🙈 .gitignore — File yang Tidak Perlu Dilacak

Beberapa file **tidak boleh** masuk ke GitHub:
- File password/API key (\`.env\`)
- Folder dependencies (node_modules)
- File build otomatis
- File pribadi editor

\`\`\`bash
# Buat file .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/

# Environment variables (SANGAT PENTING!)
.env
.env.local
.env.production

# Build output
dist/
build/
.next/

# OS files
.DS_Store          # Mac
Thumbs.db          # Windows

# Editor
.vscode/settings.json
*.swp              # Vim
EOF

git add .gitignore
git commit -m "chore: Tambah .gitignore"
\`\`\`

---

## 📝 Ringkasan

\`\`\`bash
git remote add origin url    # Hubungkan ke GitHub
git push -u origin main      # Push pertama kali
git push                     # Push berikutnya
git pull                     # Ambil update terbaru
git clone url                # Download repo
\`\`\`

- GitHub = platform cloud untuk menyimpan dan berbagi repository
- SSH Key = cara aman authenticate ke GitHub
- .gitignore = daftar file yang tidak perlu dilacak Git
- README.md = dokumentasi dan kartu nama proyek

> **Selanjutnya, kita belajar kolaborasi tim: fork dan pull request!** 🤝
`;
