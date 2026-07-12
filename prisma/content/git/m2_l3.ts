export const git_l3 = `
# Repo Pertama — Praktik Langsung!

## 🚀 Saatnya Kotor Tangan

Teori cukup — mari kita buat repository nyata dan rasakan sendiri alur kerja Git.

---

## 🗂️ Buat Proyek Baru

\`\`\`bash
# Buat folder baru
mkdir belajar-git
cd belajar-git

# Inisialisasi sebagai Git repository
git init
\`\`\`

**Output:**
\`\`\`
Initialized empty Git repository in /path/belajar-git/.git/
\`\`\`

Folder \`.git/\` tersembunyi ini adalah "otak" Git — jangan dihapus!

---

## 📝 Buat File Pertama

\`\`\`bash
# Windows
echo # Proyek Belajar Git > README.md

# Mac/Linux
echo "# Proyek Belajar Git" > README.md
\`\`\`

Atau buka dengan editor teks dan tulis:
\`\`\`markdown
# Proyek Belajar Git

Ini adalah proyek pertama saya menggunakan Git.

## Tujuan
Mempelajari version control dari dasar.
\`\`\`

---

## 🔍 Cek Status

\`\`\`bash
git status
\`\`\`

**Output:**
\`\`\`
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present
\`\`\`

Git bilang: "Ada file baru (README.md) tapi belum saya lacak."

**Warna merah** = file belum di-staging
**Warna hijau** = file sudah di-staging, siap commit

---

## ➕ Stage File

\`\`\`bash
git add README.md
\`\`\`

Cek status lagi:
\`\`\`bash
git status
\`\`\`

**Output:**
\`\`\`
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
\`\`\`

Sekarang README.md berwarna **hijau** — siap di-commit!

---

## 💾 Commit Pertama!

\`\`\`bash
git commit -m "feat: Inisialisasi proyek dengan README"
\`\`\`

**Output:**
\`\`\`
[main (root-commit) a1b2c3d] feat: Inisialisasi proyek dengan README
 1 file changed, 5 insertions(+)
 create mode 100644 README.md
\`\`\`

Selamat! Anda baru saja membuat **commit pertama** dalam hidup Anda! 🎉

---

## 📜 Lihat Riwayat

\`\`\`bash
# Riwayat lengkap
git log

# Output:
# commit a1b2c3d4e5f6... (HEAD -> main)
# Author: Budi Santoso <budi@email.com>
# Date:   Mon Jun 5 10:30:00 2025 +0700
#
#     feat: Inisialisasi proyek dengan README

# Versi ringkas (lebih populer)
git log --oneline
# a1b2c3d feat: Inisialisasi proyek dengan README

# Dengan grafik branch
git log --oneline --graph --all
\`\`\`

---

## 🔄 Simulasi Alur Kerja Nyata

Mari buat beberapa file dan commit untuk merasakan alur lengkapnya:

\`\`\`bash
# Buat file HTML dasar
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Website Pertama Saya</title>
</head>
<body>
    <h1>Halo Dunia!</h1>
</body>
</html>
EOF

# Stage dan commit
git add index.html
git commit -m "feat: Buat halaman index dasar"

# Edit file — tambahkan paragraf
# (buka index.html, tambahkan <p>Ini website pertama saya!</p>)

# Cek apa yang berubah
git diff

# Stage dan commit perubahan
git add index.html
git commit -m "feat: Tambah paragraf deskripsi di halaman utama"

# Lihat riwayat
git log --oneline
\`\`\`

**Output \`git log --oneline\`:**
\`\`\`
b3c4d5e feat: Tambah paragraf deskripsi di halaman utama
a2b3c4d feat: Buat halaman index dasar
a1b2c3d feat: Inisialisasi proyek dengan README
\`\`\`

---

## 🕰️ Melihat Perubahan

\`\`\`bash
# Lihat perubahan yang BELUM di-staged
git diff

# Lihat perubahan yang SUDAH di-staged (siap commit)
git diff --staged

# Lihat isi commit tertentu
git show a1b2c3d

# Bandingkan dua commit
git diff a1b2c3d b3c4d5e
\`\`\`

### Membaca Output \`git diff\`

\`\`\`diff
diff --git a/index.html b/index.html
index abc1234..def5678 100644
--- a/index.html    ← Versi lama
+++ b/index.html    ← Versi baru
@@ -5,6 +5,7 @@    ← Lokasi perubahan
 <body>
     <h1>Halo Dunia!</h1>
+    <p>Ini website pertama saya!</p>    ← Baris baru (hijau/+)
 </body>
\`\`\`

- **Tanda +** (hijau) = baris yang ditambahkan
- **Tanda -** (merah) = baris yang dihapus

---

## ↩️ Membatalkan Perubahan

\`\`\`bash
# Batalkan perubahan di working tree (sebelum git add)
git restore namafile.txt
git restore .         # Batalkan SEMUA perubahan

# Keluarkan file dari staging (setelah git add, sebelum commit)
git restore --staged namafile.txt

# Lihat commit terdahulu tanpa mengubah apapun
git checkout a1b2c3d -- namafile.txt   # Ambil file dari commit lama
\`\`\`

---

## 📝 Ringkasan

\`\`\`bash
git init              # Mulai repo baru
git status            # Cek status file
git add .             # Stage semua perubahan
git commit -m "..."   # Simpan snapshot
git log --oneline     # Lihat riwayat ringkas
git diff              # Lihat perubahan
git restore .         # Batalkan perubahan
\`\`\`

> **Di pelajaran berikutnya, kita belajar branching — salah satu fitur paling powerful di Git!** 🌿
`;
