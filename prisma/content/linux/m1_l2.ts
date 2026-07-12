export const linux_l2 = `
# Instalasi Ubuntu & Navigasi Terminal Pertama

Banyak yang berpikir pakai Linux berarti harus hapus Windows dulu. Tidak perlu! Ada beberapa cara untuk mencoba Linux tanpa risiko apapun.

---

## 🛠️ Cara Mulai Pakai Linux

### Opsi 1: VirtualBox — Paling Direkomendasikan untuk Belajar

Jalankan Ubuntu di dalam Windows seperti aplikasi biasa:

1. Download **VirtualBox** dari virtualbox.org (gratis)
2. Download **Ubuntu 24.04 LTS** dari ubuntu.com (~5 GB)
3. Buat Virtual Machine: RAM 4GB, disk 25GB
4. Boot dari ISO → ikuti wizard instalasi
5. Selesai! Ubuntu berjalan di jendela Windows kamu

### Opsi 2: WSL2 — Terminal Linux Langsung di Windows

Untuk yang hanya butuh terminal (tanpa GUI):

\`\`\`powershell
# Di PowerShell (Run as Administrator):
wsl --install

# Restart, lalu buka "Ubuntu" dari Start Menu
# Langsung dapat terminal Ubuntu!
\`\`\`

### Opsi 3: Dual Boot

Install Linux berdampingan Windows — pilih saat booting. Cocok kalau sudah serius mau pakai Linux sehari-hari.

---

## 🖥️ Anatomi Terminal

Saat buka terminal, kamu akan lihat prompt seperti ini:

\`\`\`bash
budi@ubuntu:~$

# Artinya:
# budi   = nama pengguna
# ubuntu = nama komputer
# ~      = lokasi saat ini (~ = folder home kamu)
# $      = pengguna biasa  (# = root/admin)
\`\`\`

### Struktur Perintah Linux

\`\`\`bash
perintah [opsi] [argumen]

# Contoh:
ls -la /home/budi
# ls      = perintah (list files)
# -la     = opsi: l=tampilkan detail, a=termasuk file tersembunyi
# /home/budi = argumen: folder yang mau dilihat
\`\`\`

---

## 🧭 Navigasi Dasar — Jalan-jalan di Filesystem

### \`pwd\` — Print Working Directory
"Saya sekarang di mana?"

\`\`\`bash
pwd
# Output: /home/budi
\`\`\`

### \`ls\` — List Isi Folder

\`\`\`bash
ls              # Daftar file sederhana
ls -l           # Daftar detail (ukuran, tanggal, izin)
ls -a           # Tampilkan file tersembunyi (awalan titik)
ls -la          # Kombinasi: detail + tersembunyi
ls -lh          # h = human readable (KB, MB, GB)
ls /etc         # List folder tertentu

# Output ls -la:
# drwxr-xr-x 2 budi budi 4096 Jun 5 10:30 Documents
# -rw-r--r-- 1 budi budi 2048 Jun 5 09:15 catatan.txt
#
# Kolom: [izin] [link] [pemilik] [grup] [ukuran] [tanggal] [nama]
\`\`\`

### \`cd\` — Change Directory

\`\`\`bash
cd /home/budi/Documents   # Pindah ke path absolut
cd Documents              # Pindah ke subfolder (relatif)
cd ..                     # Naik satu level ke atas
cd ../..                  # Naik dua level
cd ~                      # Pulang ke home folder
cd -                      # Kembali ke folder sebelumnya

# Contoh sesi navigasi:
pwd           # /home/budi
cd Documents  # masuk ke Documents
pwd           # /home/budi/Documents
cd ..         # keluar dari Documents
pwd           # /home/budi
cd /var/log   # pindah ke folder log sistem
pwd           # /var/log
cd ~          # pulang ke home
pwd           # /home/budi
\`\`\`

### Tab Completion — Fitur Ajaib!

\`\`\`bash
# Ketik sebagian nama, tekan Tab:
cd Doc[TAB]     → cd Documents/
ls /et[TAB]     → ls /etc/
sudo apt ins[TAB] → sudo apt install

# Tekan Tab dua kali untuk lihat semua kemungkinan
ls /etc/[TAB][TAB]  # Tampilkan semua isi /etc/
\`\`\`

---

## 📋 Perintah Esensial Lainnya

### \`clear\` — Bersihkan Layar
\`\`\`bash
clear
# atau shortcut: Ctrl+L
\`\`\`

### \`history\` — Riwayat Perintah
\`\`\`bash
history           # Tampilkan semua riwayat
history 20        # 20 perintah terakhir
!42               # Jalankan ulang perintah nomor 42
!!                # Jalankan ulang perintah terakhir
Ctrl+R            # Cari di riwayat (reverse search)
\`\`\`

### \`man\` — Manual (Bantuan)
\`\`\`bash
man ls            # Manual perintah ls
man grep          # Manual perintah grep
# Tekan q untuk keluar dari manual

# Alternatif yang lebih ringkas:
ls --help
grep --help
tldr ls           # Versi ringkas (install: sudo apt install tldr)
\`\`\`

### \`echo\` — Cetak Teks
\`\`\`bash
echo "Halo Dunia"          # Cetak teks
echo $HOME                  # Cetak nilai variabel
echo $PATH                  # Cetak PATH (daftar direktori executable)
\`\`\`

### \`cat\` — Tampilkan Isi File
\`\`\`bash
cat README.md              # Tampilkan isi file
cat /etc/os-release        # Info versi OS
\`\`\`

---

## ⌨️ Shortcut Terminal yang Wajib Dihapal

| Shortcut | Fungsi |
|----------|--------|
| \`Ctrl+C\` | Hentikan proses yang berjalan |
| \`Ctrl+D\` | Logout / EOF |
| \`Ctrl+L\` | Clear layar |
| \`Ctrl+A\` | Pindah ke awal baris |
| \`Ctrl+E\` | Pindah ke akhir baris |
| \`Ctrl+U\` | Hapus dari kursor ke awal baris |
| \`Ctrl+K\` | Hapus dari kursor ke akhir baris |
| \`Ctrl+R\` | Search riwayat perintah |
| \`Tab\` | Auto-complete |
| \`↑ / ↓\` | Navigasi riwayat perintah |

---

## 🔍 Informasi Sistem

\`\`\`bash
# Siapa saya?
whoami            # budi

# Info sistem
uname -a          # Versi kernel dan sistem
uname -r          # Hanya versi kernel
lsb_release -a    # Info distribusi Linux

# Info hardware
lscpu             # Info CPU
free -h           # RAM tersedia
df -h             # Penggunaan disk
lsblk             # Daftar disk dan partisi

# Waktu dan tanggal
date              # Tanggal dan waktu sekarang
cal               # Kalender bulan ini
uptime            # Berapa lama sistem sudah nyala
\`\`\`

---

## 💡 Praktik: Eksplorasi Sistem

Mari jelajahi Linux bersama:

\`\`\`bash
# 1. Cek lokasi awal
pwd
whoami

# 2. Lihat isi home folder
ls -la ~

# 3. Jelajahi filesystem
ls /
ls /etc | head -20   # 20 file pertama di /etc
ls /var/log          # File log sistem

# 4. Baca info sistem
cat /etc/os-release  # Versi Ubuntu
uname -r             # Versi kernel

# 5. Navigasi
cd /var/log
ls
cat syslog | head -20  # Lihat 20 baris pertama syslog
cd ~

# 6. Buat folder latihan
mkdir ~/latihan-linux
cd ~/latihan-linux
pwd
ls
\`\`\`

---

## 📝 Ringkasan

| Perintah | Fungsi |
|----------|--------|
| \`pwd\` | Cek lokasi saat ini |
| \`ls\` / \`ls -la\` | Lihat isi folder |
| \`cd nama\` | Masuk folder |
| \`cd ..\` | Naik ke folder atas |
| \`cd ~\` | Ke home folder |
| \`clear\` | Bersihkan layar |
| \`history\` | Riwayat perintah |
| \`man perintah\` | Manual/bantuan |
| \`Tab\` | Auto-complete (GUNAKAN SELALU!) |

> **Di pelajaran berikutnya, kita belajar membuat, menyalin, memindah, dan menghapus file dan folder!** 📁
`;
