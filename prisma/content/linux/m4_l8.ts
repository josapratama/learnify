export const linux_l8 = `
# Shell Scripting — Otomasi Tugas yang Kamu Lakukan Berulang

Kalau kamu sudah sering pakai terminal, pasti ada momen di mana kamu mengetik perintah yang sama berulang-ulang. Backup database tiap hari, deploy kode ke server, cek apakah semua service masih jalan, kirim notifikasi kalau ada yang error.

Semua itu bisa diotomasi dengan **shell script** — file teks berisi perintah-perintah yang dijalankan secara berurutan.

Tulis sekali, jalankan kapan saja. Atau jadwalkan di cron supaya jalan otomatis.

---

## 📝 Script Pertama

\`\`\`bash
#!/bin/bash
# Baris pertama WAJIB ada — ini disebut "shebang"
# Memberitahu sistem: "gunakan /bin/bash untuk jalankan file ini"

echo "Halo dari script pertama saya!"
echo "Tanggal sekarang: $(date)"
echo "Saya login sebagai: $(whoami)"
echo "Di direktori: $(pwd)"
\`\`\`

\`\`\`bash
# Simpan sebagai halo.sh, lalu:
chmod +x halo.sh    # Beri izin eksekusi
./halo.sh           # Jalankan!

# Output:
# Halo dari script pertama saya!
# Tanggal sekarang: Wed Jun  5 10:30:00 WIB 2024
# Saya login sebagai: budi
# Di direktori: /home/budi
\`\`\`

---

## 📦 Variabel

\`\`\`bash
#!/bin/bash

# Deklarasi variabel (TIDAK ADA SPASI di sekitar =)
nama="Budi Santoso"
umur=25
kota="Jakarta"

# Gunakan variabel dengan $
echo "Nama: $nama"
echo "Umur: $umur"
echo "Kota: $kota"

# Variabel dari output perintah
tanggal=$(date +%Y-%m-%d)
ip_lokal=$(hostname -I | awk '{print $1}')
jumlah_file=$(ls | wc -l)

echo "Tanggal: $tanggal"
echo "IP: $ip_lokal"
echo "File: $jumlah_file"

# Variabel environment (sudah ada)
echo "Home: $HOME"
echo "User: $USER"
echo "PATH: $PATH"

# Readonly variable (konstanta)
readonly MAX_RETRY=3
readonly SERVER="production.example.com"
\`\`\`

---

## 🎯 Input dari User

\`\`\`bash
#!/bin/bash

# read = baca input dari user
echo "Siapa nama Anda?"
read nama
echo "Halo, $nama!"

# Dengan prompt di satu baris
read -p "Masukkan username: " username
read -sp "Masukkan password: " password   # -s = silent (tidak tampil)
echo ""   # newline setelah password

echo "Username: $username"
echo "Password tersimpan (tidak ditampilkan)"

# Argumen dari command line
# $1 = argumen pertama, $2 = kedua, dst
# $0 = nama script, $# = jumlah argumen, $@ = semua argumen

echo "Script: $0"
echo "Argumen pertama: $1"
echo "Argumen kedua: $2"
echo "Semua argumen: $@"
echo "Jumlah argumen: $#"

# Jalankan: ./script.sh halo dunia
# Output:
# Script: ./script.sh
# Argumen pertama: halo
# Argumen kedua: dunia
\`\`\`

---

## 🔀 Kondisi — If/Else

\`\`\`bash
#!/bin/bash

nilai=$1

if [ $nilai -ge 90 ]; then
    echo "A - Sangat Baik"
elif [ $nilai -ge 80 ]; then
    echo "B - Baik"
elif [ $nilai -ge 70 ]; then
    echo "C - Cukup"
else
    echo "D - Perlu Perbaikan"
fi

# Operator perbandingan untuk angka:
# -eq  = equal (sama)
# -ne  = not equal
# -gt  = greater than (lebih besar)
# -lt  = less than (lebih kecil)
# -ge  = greater or equal
# -le  = less or equal

# Untuk string:
# =    = sama
# !=   = tidak sama
# -z   = string kosong
# -n   = string tidak kosong

# Untuk file:
# -f   = ada dan file biasa
# -d   = ada dan folder
# -e   = ada (apapun tipenya)
# -r   = bisa dibaca
# -w   = bisa ditulis
# -x   = bisa dieksekusi

# Contoh cek file:
if [ -f "/etc/nginx/nginx.conf" ]; then
    echo "Nginx config ada"
else
    echo "Nginx tidak terinstall"
fi

# Cek service berjalan
if systemctl is-active --quiet nginx; then
    echo "Nginx berjalan"
fi
\`\`\`

---

## 🔄 Perulangan — For & While

\`\`\`bash
#!/bin/bash

# For loop — iterasi list
for nama in Andi Budi Cici Dedi; do
    echo "Halo, $nama!"
done

# For loop dengan range
for i in {1..5}; do
    echo "Angka: $i"
done

# For loop dengan step
for i in {0..20..5}; do    # 0, 5, 10, 15, 20
    echo $i
done

# For loop C-style
for ((i=1; i<=10; i++)); do
    echo "Loop ke-$i"
done

# Iterasi file
for file in /var/log/*.log; do
    echo "File: $file ($(wc -l < $file) baris)"
done

# While loop
hitung=1
while [ $hitung -le 5 ]; do
    echo "Hitung: $hitung"
    ((hitung++))
done

# Until loop (kebalikan while)
angka=10
until [ $angka -le 0 ]; do
    echo "Hitung mundur: $angka"
    ((angka--))
done
\`\`\`

---

## 🔧 Fungsi

\`\`\`bash
#!/bin/bash

# Definisi fungsi
sapa() {
    echo "Halo, $1!"
}

hitung_bmi() {
    local berat=$1
    local tinggi=$2
    local bmi=$(echo "scale=1; $berat / ($tinggi * $tinggi)" | bc)
    echo "BMI Anda: $bmi"
}

cek_disk() {
    local batas=$1
    local terpakai=$(df / | awk 'NR==2{print $5}' | tr -d '%')
    if [ $terpakai -ge $batas ]; then
        echo "⚠️  PERINGATAN: Disk $terpakai% penuh (batas: $batas%)"
        return 1
    else
        echo "✅ Disk OK: $terpakai% terpakai"
        return 0
    fi
}

# Panggil fungsi
sapa "Budi"
hitung_bmi 70 1.75
cek_disk 80
\`\`\`

---

## 💡 Script Nyata: Backup Otomatis

\`\`\`bash
#!/bin/bash
# backup.sh — Script backup folder penting

# Konfigurasi
FOLDER_SUMBER="/home/budi/Documents"
FOLDER_BACKUP="/backup"
TANGGAL=$(date +%Y-%m-%d)
NAMA_BACKUP="backup_$TANGGAL.tar.gz"
MAX_BACKUP=7    # Simpan 7 hari terakhir

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Mulai
log "=== Memulai backup ==="

# Buat folder backup jika belum ada
mkdir -p "$FOLDER_BACKUP"

# Buat backup
if tar -czvf "$FOLDER_BACKUP/$NAMA_BACKUP" "$FOLDER_SUMBER" 2>/dev/null; then
    log "✅ Backup berhasil: $NAMA_BACKUP"
    log "Ukuran: $(du -sh $FOLDER_BACKUP/$NAMA_BACKUP | cut -f1)"
else
    log "❌ Backup gagal!"
    exit 1
fi

# Hapus backup yang lebih lama dari MAX_BACKUP hari
log "Membersihkan backup lama (>$MAX_BACKUP hari)..."
find "$FOLDER_BACKUP" -name "backup_*.tar.gz" -mtime +$MAX_BACKUP -delete

# Tampilkan semua backup yang ada
log "Backup tersedia:"
ls -lh "$FOLDER_BACKUP"/backup_*.tar.gz 2>/dev/null

log "=== Backup selesai ==="
\`\`\`

\`\`\`bash
# Jadwalkan di cron untuk jalan tiap hari jam 2 pagi:
crontab -e
# Tambahkan:
0 2 * * * /home/budi/scripts/backup.sh >> /var/log/backup.log 2>&1
\`\`\`

---

## � Script Deploy Sederhana

\`\`\`bash
#!/bin/bash
# deploy.sh — Deploy aplikasi Node.js

APP_DIR="/var/www/myapp"
REPO="git@github.com:username/myapp.git"

echo "🚀 Memulai deployment..."

cd $APP_DIR || exit 1

echo "📥 Pull kode terbaru..."
git pull origin main

echo "📦 Install dependencies..."
npm ci --production

echo "🔄 Restart aplikasi..."
pm2 restart myapp

echo "✅ Deployment selesai!"
pm2 status myapp
\`\`\`

---

## �📝 Ringkasan

| Konsep | Sintaks |
|--------|---------|
| Shebang | \`#!/bin/bash\` (wajib di baris pertama) |
| Variabel | \`nama="nilai"\`, pakai dengan \`$nama\` |
| Input user | \`read -p "Prompt: " variabel\` |
| Kondisi | \`if [ kondisi ]; then ... fi\` |
| Loop | \`for i in list; do ... done\` |
| Fungsi | \`nama_fungsi() { ... }\` |
| Jalankan | \`chmod +x script.sh && ./script.sh\` |

> **Di pelajaran berikutnya, kita belajar Linux untuk server dan DevOps — deploy aplikasi nyata!** 🖥️
`;
