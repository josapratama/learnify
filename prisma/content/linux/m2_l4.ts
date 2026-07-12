export const linux_l4 = `
# Text Editor & Manipulasi Teks di Linux

Di Linux, hampir segalanya adalah file teks — konfigurasi server, log aplikasi, script, kode. Kemampuan untuk baca, edit, dan proses file teks dari terminal adalah skill inti yang akan terus dipakai.

Bagian ini mungkin terasa banyak di awal, tapi kamu tidak harus hafal semuanya sekarang. Cukup tahu ada apa saja, nanti lihat lagi saat butuh.

---

## 📝 Text Editor di Terminal

### Nano — Mulai di Sini

Nano adalah editor paling mudah. Shortcut selalu tampil di bawah layar, tidak ada mode-mode yang membingungkan:

\`\`\`bash
nano namafile.txt      # Buka atau buat file baru
\`\`\`

**Shortcut yang perlu diingat:**

| Shortcut | Fungsi |
|----------|--------|
| \`Ctrl+S\` | Simpan |
| \`Ctrl+X\` | Keluar |
| \`Ctrl+W\` | Cari teks |
| \`Ctrl+K\` | Potong baris |
| \`Ctrl+U\` | Tempel |

### Vim — Ada di Setiap Server

Vim ada di hampir setiap server Linux. Kamu tidak harus mahir, tapi minimal tahu cara keluarnya:

\`\`\`bash
vim namafile.txt
\`\`\`

**Yang paling sering dibutuhkan:**

\`\`\`
i        → masuk mode INSERT (mulai ketik)
Esc      → keluar dari INSERT mode
:w       → simpan
:q       → keluar
:wq      → simpan dan keluar
:q!      → keluar PAKSA tanpa simpan (yang paling sering dicari!)

/kata    → cari teks
n        → ke hasil berikutnya
\`\`\`

---

## 🔍 Grep — Cari Teks dalam File

\`\`\`bash
# Sintaks: grep [opsi] "pola" file

grep "error" /var/log/syslog           # Cari "error" di file
grep -i "Error" file.txt               # -i = case insensitive
grep -n "error" file.txt               # -n = tampilkan nomor baris
grep -r "TODO" ~/proyek/               # -r = rekursif di folder
grep -v "DEBUG" app.log                # -v = tampilkan yang TIDAK cocok
grep -c "error" file.txt               # -c = hitung kemunculan
grep -l "error" *.log                  # -l = hanya nama file yang cocok
grep "^Error" file.txt                 # ^ = awalan baris
grep "failed$" file.txt                # $ = akhir baris
grep -E "error|warning|critical" app.log  # -E = regex extended
grep -A 3 "error" file.txt             # -A = tampilkan 3 baris SETELAH
grep -B 2 "error" file.txt             # -B = tampilkan 2 baris SEBELUM
grep -C 2 "error" file.txt             # -C = tampilkan 2 baris sebelum DAN sesudah
\`\`\`

---

## 🔄 Pipe — Rantai Perintah

Pipe (\`|\`) menghubungkan output satu perintah ke input perintah berikutnya:

\`\`\`bash
# Analogi: Pabrik dengan ban berjalan
# Data mengalir dari kiri ke kanan

# Tampilkan 10 proses yang paling banyak pakai CPU
ps aux | sort -k 3 -rn | head -10

# Hitung berapa file di folder
ls /etc | wc -l

# Cari error di log, urutkan, hilangkan duplikat
grep "error" /var/log/syslog | sort | uniq

# Lihat 5 file terbesar di folder
du -sh ~/* | sort -rh | head -5

# Cari proses tertentu
ps aux | grep "nginx"

# Cari file, lalu hitung berapa
find . -name "*.py" | wc -l
\`\`\`

---

## ➡️ Redirect — Simpan Output ke File

\`\`\`bash
ls > daftar-file.txt         # Simpan output ke file (timpa)
ls >> daftar-file.txt        # Tambahkan ke akhir file
ls 2> error.txt              # Simpan pesan error saja
ls > output.txt 2>&1         # Simpan output DAN error
ls 2>/dev/null               # Buang semua error (/dev/null = lubang hitam)

# Contoh nyata:
# Jalankan script dan simpan log
./backup.sh > /var/log/backup.log 2>&1

# Buat file dari teks
echo "Baris pertama" > file.txt
echo "Baris kedua" >> file.txt
cat file.txt
# Baris pertama
# Baris kedua
\`\`\`

---

## ✂️ Sed — Stream Editor

\`\`\`bash
# Sintaks: sed 's/lama/baru/flag' file

sed 's/hello/halo/' file.txt          # Ganti pertama di tiap baris
sed 's/hello/halo/g' file.txt         # Ganti semua (g = global)
sed 's/hello/halo/gi' file.txt        # Case insensitive
sed -i 's/hello/halo/g' file.txt      # -i = edit file langsung
sed -i.bak 's/hello/halo/g' file.txt  # Edit + backup .bak

sed '3d' file.txt                     # Hapus baris ke-3
sed '/^#/d' config.txt                # Hapus baris yang diawali #
sed -n '5,10p' file.txt               # Cetak baris 5-10 saja

# Contoh nyata: Ganti IP server di konfigurasi
sed -i 's/192.168.1.100/192.168.1.200/g' nginx.conf
\`\`\`

---

## 🦅 Awk — Pemrosesan Kolom

\`\`\`bash
# Awk sempurna untuk data terstruktur (CSV, log dengan kolom)
# $1=kolom1, $2=kolom2, $NF=kolom terakhir

echo "Budi 28 Jakarta" | awk '{print $1}'      # Budi
echo "Budi 28 Jakarta" | awk '{print $1, $3}'  # Budi Jakarta
awk '{print $2}' data.txt                       # Cetak kolom ke-2 semua baris

# Format: awk '{aksi}' file
# Dengan kondisi:
awk '$3 > 100' sales.txt              # Baris di mana kolom 3 > 100
awk 'NR==5' file.txt                  # Hanya baris ke-5
awk 'NR>=5 && NR<=10' file.txt        # Baris 5-10

# Separator kustom (default: spasi/tab)
awk -F: '{print $1, $3}' /etc/passwd  # Separator titik dua
awk -F, '{print $1}' data.csv         # Separator koma (CSV)

# Contoh nyata: Lihat username dan UID dari /etc/passwd
awk -F: '{print $1"\t"$3}' /etc/passwd | head -10
\`\`\`

---

## 🔢 Perintah Teks Lainnya

\`\`\`bash
wc file.txt                  # Word count: baris, kata, karakter
wc -l file.txt               # Hanya hitung baris
wc -w file.txt               # Hanya hitung kata

sort file.txt                # Urutkan alfabet
sort -r file.txt             # Urut terbalik
sort -n angka.txt            # Urut numerik
sort -k2 data.txt            # Urut berdasarkan kolom 2

uniq file.txt                # Hapus baris duplikat (file harus terurut)
sort file.txt | uniq         # Sort dulu, lalu hapus duplikat
sort file.txt | uniq -c      # Hitung kemunculan tiap baris
sort file.txt | uniq -d      # Tampilkan yang duplikat saja

cut -d: -f1 /etc/passwd      # Cut kolom 1 dengan delimiter ":"
cut -c1-10 file.txt          # Ambil karakter 1-10 tiap baris

tr 'a-z' 'A-Z' < file.txt   # Ubah lowercase ke uppercase
tr -d '\n' < file.txt        # Hapus semua newline
tr -s ' ' < file.txt         # Kompres spasi berulang
\`\`\`

---

## 💡 Contoh Nyata: Analisis Log Server

\`\`\`bash
# Skenario: Server Nginx, cari masalah dari access.log

# 1. Berapa total request hari ini?
wc -l /var/log/nginx/access.log

# 2. Berapa error 500?
grep " 500 " /var/log/nginx/access.log | wc -l

# 3. IP mana yang paling sering akses?
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 4. Halaman apa yang paling sering dikunjungi?
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20

# 5. Pantau log real-time
tail -f /var/log/nginx/access.log | grep --line-buffered "500"

# 6. Error hari ini saja
grep "$(date '+%d/%b/%Y')" /var/log/nginx/error.log | grep "error"
\`\`\`

---

## 📝 Ringkasan

| Tool | Kegunaan |
|------|----------|
| \`nano\` | Edit file teks (pemula) |
| \`vim\` | Edit file teks (powerful) |
| \`grep\` | Cari teks dalam file |
| \`\|\` (pipe) | Hubungkan output ke input |
| \`>\` | Redirect output ke file |
| \`>>\` | Tambahkan ke file |
| \`sed\` | Ganti/hapus teks |
| \`awk\` | Proses data berkolom |
| \`sort\` | Urutkan baris |
| \`uniq\` | Hapus/hitung duplikat |
| \`wc\` | Hitung baris/kata/karakter |

> **Di pelajaran berikutnya, kita belajar manajemen paket — cara install software di Linux!** 📦
`;
