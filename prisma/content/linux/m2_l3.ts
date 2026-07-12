export const linux_l3 = `
# Manajemen File & Folder di Linux

## 📁 Analogi: Filesystem Seperti Kantor Fisik

Bayangkan kantor dengan lemari arsip, ruang kerja, dan brankas:
- **Membuat folder** = membeli lemari baru
- **Menyalin file** = fotokopi dokumen
- **Memindah file** = pindah dokumen ke lemari lain
- **Menghapus file** = memasukkan dokumen ke tempat sampah
- **Permission file** = kunci brankas (siapa boleh buka)

---

## 🗂️ Membuat File & Folder

### \`mkdir\` — Buat Folder

\`\`\`bash
mkdir proyek-web           # Buat satu folder
mkdir -p a/b/c/d           # Buat folder bertingkat sekaligus (-p = parents)
mkdir folder1 folder2      # Buat beberapa folder sekaligus

# Contoh praktis:
mkdir -p ~/proyek/website/{css,js,images,fonts}
# Hasilnya:
# proyek/website/
# ├── css/
# ├── js/
# ├── images/
# └── fonts/
\`\`\`

### \`touch\` — Buat File Kosong

\`\`\`bash
touch index.html            # Buat file kosong
touch style.css script.js  # Buat beberapa file
touch catatan_{1..5}.txt   # Buat catatan_1.txt sampai catatan_5.txt

# touch juga bisa update timestamp file yang sudah ada
touch file-lama.txt        # Update waktu modifikasi ke sekarang
\`\`\`

---

## 📋 Menyalin File — \`cp\`

\`\`\`bash
cp sumber.txt tujuan.txt           # Salin file
cp sumber.txt /home/budi/          # Salin ke folder lain
cp sumber.txt /folder/nama-baru.txt # Salin dan ganti nama
cp -r folder/ folder-backup/       # Salin folder (-r = recursive)
cp -rp folder/ backup/             # -p = preserve permissions & timestamps
cp *.txt /backup/                  # Salin semua file .txt

# Contoh nyata: backup sebelum edit file konfigurasi
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
\`\`\`

---

## 📦 Memindah File — \`mv\`

\`\`\`bash
mv file.txt /tujuan/               # Pindah file
mv nama-lama.txt nama-baru.txt     # Ganti nama file
mv folder-lama/ folder-baru/       # Ganti nama folder
mv *.log /var/log/backup/          # Pindah semua file .log

# Contoh nyata:
mv ~/Downloads/laporan.pdf ~/Documents/Kerja/2024/
mv index.html index.html.bak      # Backup dengan rename
\`\`\`

---

## 🗑️ Menghapus File — \`rm\`

\`\`\`bash
rm file.txt                  # Hapus satu file
rm file1.txt file2.txt       # Hapus beberapa file
rm *.log                     # Hapus semua file .log
rm -i file.txt               # -i = tanya konfirmasi dulu
rm -r folder/                # Hapus folder dan isinya
rm -rf folder/               # -f = force (HATI-HATI!)

# ⚠️ PERINGATAN KERAS:
# rm -rf / atau rm -rf /*  = MENGHAPUS SELURUH SISTEM!
# Selalu double-check sebelum rm -rf

# Hapus folder kosong saja:
rmdir folder-kosong/
\`\`\`

---

## 👁️ Membaca Isi File

\`\`\`bash
cat file.txt               # Tampilkan semua isi sekaligus
less file.txt              # Tampilkan per halaman (q = keluar)
more file.txt              # Mirip less, lebih tua

head file.txt              # 10 baris pertama
head -20 file.txt          # 20 baris pertama
tail file.txt              # 10 baris terakhir
tail -20 file.txt          # 20 baris terakhir
tail -f /var/log/syslog    # Pantau file log real-time (-f = follow)
\`\`\`

---

## 🔐 Permission File — Kunci Keamanan Linux

### Memahami Notasi Permission

\`\`\`bash
ls -la

# -rwxr-xr-- 1 budi budi 2048 Jun 5 catatan.txt
# │││││││││
# │││││││└─ r-- = others: hanya baca
# ││││││└── r-x = group: baca + eksekusi
# │││││└─── rwx = owner: baca + tulis + eksekusi
# ││││└──── - = tipe file (- = file biasa, d = direktori)
\`\`\`

### Tiga Kelompok Pengguna

\`\`\`
Pemilik (Owner)  ─ siapa yang buat file
Grup (Group)     ─ anggota grup yang sama
Lainnya (Others) ─ semua pengguna lain
\`\`\`

### Tiga Jenis Izin

| Huruf | Angka | Arti untuk File | Arti untuk Folder |
|-------|-------|-----------------|------------------|
| r | 4 | Boleh dibaca | Boleh di-\`ls\` |
| w | 2 | Boleh ditulis/diubah | Boleh buat/hapus isi |
| x | 1 | Boleh dieksekusi | Boleh di-\`cd\` |
| - | 0 | Tidak boleh | Tidak boleh |

### \`chmod\` — Ubah Permission

\`\`\`bash
# Cara 1: Notasi oktal (angka)
chmod 755 script.sh    # rwxr-xr-x (owner:rwx, group:r-x, others:r-x)
chmod 644 config.txt   # rw-r--r-- (owner:rw, group:r, others:r)
chmod 600 .ssh/id_rsa  # rw------- (hanya owner yang bisa baca/tulis)
chmod 777 folder/      # rwxrwxrwx (semua boleh semua - tidak direkomendasikan!)

# Cara menghitung: r=4, w=2, x=1
# rwx = 4+2+1 = 7
# rw- = 4+2+0 = 6
# r-x = 4+0+1 = 5
# r-- = 4+0+0 = 4

# Cara 2: Notasi simbolik (lebih mudah dibaca)
chmod u+x script.sh    # Tambah eksekusi untuk owner (u)
chmod g-w file.txt     # Cabut write untuk group (g)
chmod o-r secret.txt   # Cabut read untuk others (o)
chmod a+r public.html  # Tambah read untuk semua (a = all)
chmod u=rwx,g=rx,o=r file.sh  # Set eksplisit

# Ubah permission rekursif (semua file dalam folder)
chmod -R 755 public/
\`\`\`

### \`chown\` — Ubah Pemilik

\`\`\`bash
chown budi file.txt             # Ubah pemilik ke budi
chown budi:staff file.txt       # Ubah pemilik dan grup
chown -R www-data /var/www/     # Ubah pemilik rekursif
sudo chown root:root /etc/passwd
\`\`\`

---

## 🔗 Symbolic Link — Shortcut Linux

\`\`\`bash
# Buat symbolic link (seperti shortcut di Windows)
ln -s /path/asli/file.txt /path/link/shortcut.txt
ln -s /usr/local/node/bin/node /usr/bin/node  # Link executable

# Contoh:
ln -s ~/proyek/website ~/Desktop/website-shortcut
ls -la ~/Desktop/
# lrwxrwxrwx 1 budi budi ... website-shortcut -> /home/budi/proyek/website
\`\`\`

---

## 🔍 Mencari File — \`find\`

\`\`\`bash
find /home -name "*.txt"              # Cari file .txt di /home
find . -name "config*"                # Cari file awalan "config"
find /var/log -newer /tmp/mark        # Lebih baru dari file mark
find . -type d                        # Cari folder saja
find . -type f -size +10M             # Cari file lebih dari 10MB
find . -mtime -7                      # Diubah dalam 7 hari terakhir
find . -name "*.log" -delete          # Temukan dan hapus

# Find + exec: temukan dan lakukan sesuatu
find . -name "*.txt" -exec cat {} \;  # Tampilkan isi semua .txt
find . -name "*.bak" -exec rm {} \;   # Hapus semua file .bak
\`\`\`

---

## 💡 Praktik: Setup Struktur Proyek

\`\`\`bash
# Buat struktur proyek web lengkap
mkdir -p ~/proyek/my-website/{src/{html,css,js},assets/{images,fonts},docs}

# Buat file dasar
touch ~/proyek/my-website/src/html/index.html
touch ~/proyek/my-website/src/css/style.css
touch ~/proyek/my-website/src/js/app.js
touch ~/proyek/my-website/README.md

# Lihat hasilnya
find ~/proyek/my-website -type f
# Output:
# /home/budi/proyek/my-website/src/html/index.html
# /home/budi/proyek/my-website/src/css/style.css
# /home/budi/proyek/my-website/src/js/app.js
# /home/budi/proyek/my-website/README.md

# Set permission yang tepat
chmod 644 ~/proyek/my-website/src/html/index.html
chmod 755 ~/proyek/my-website/  # Folder perlu execute untuk bisa cd

# Salin README ke backup
cp ~/proyek/my-website/README.md ~/proyek/my-website/README.md.bak
\`\`\`

---

## 📝 Ringkasan

| Perintah | Fungsi |
|----------|--------|
| \`mkdir -p a/b/c\` | Buat folder bertingkat |
| \`touch file.txt\` | Buat file kosong |
| \`cp sumber tujuan\` | Salin file |
| \`cp -r folder/ backup/\` | Salin folder |
| \`mv file /tujuan/\` | Pindah/rename file |
| \`rm file.txt\` | Hapus file |
| \`rm -rf folder/\` | Hapus folder (hati-hati!) |
| \`chmod 755 file\` | Ubah permission |
| \`chown user:group file\` | Ubah pemilik |
| \`find . -name "*.txt"\` | Cari file |

> **Di pelajaran berikutnya, kita belajar manipulasi teks dengan grep, sed, dan kekuatan pipe!** 🔍
`;
