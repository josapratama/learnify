export const linux_l6 = `
# Proses & Manajemen Sistem — Apa yang Berjalan di Balik Layar?

Linux itu transparan. Berbeda dari Windows yang banyak hal tersembunyi, di Linux kamu bisa lihat **semua** yang sedang berjalan — siapa yang jalankan, berapa CPU yang dipakai, sudah berapa lama berjalan.

Setiap program yang aktif disebut **proses** (process). Setiap proses punya ID unik yang disebut **PID**. Mirip nomor antrean — dengan PID ini kamu bisa monitor, prioritaskan, atau hentikan proses mana pun.

---

## 👁️ Melihat Proses yang Berjalan

### \`ps\` — Snapshot Semua Proses

\`\`\`bash
ps                       # Hanya proses di terminal aktif
ps aux                   # SEMUA proses, semua pengguna
ps aux | grep nginx      # Filter proses tertentu — ini yang paling sering dipakai

# Kolom yang perlu dipahami dari ps aux:
# USER  PID  %CPU  %MEM   VSZ    RSS   TTY  STAT  START  TIME  COMMAND
# budi  1234  0.5  1.2   123456  24000  ?   Sl   10:30  0:05  /usr/bin/python
#
# %CPU = persentase CPU yang dipakai
# %MEM = persentase RAM yang dipakai
# PID  = nomor ID proses (ini yang dipakai untuk kill)
\`\`\`

### \`htop\` — Monitor yang Lebih Nyaman

\`\`\`bash
# Kalau belum ada, install dulu
sudo apt install htop

htop    # Interface visual, update real-time

# Di dalam htop:
# P → urutkan berdasarkan CPU (paling rakus CPU di atas)
# M → urutkan berdasarkan memori
# F9 → kill proses yang dipilih
# F5 → tampilan tree (lihat parent-child relationship)
# q → keluar
\`\`\`

\`htop\` jauh lebih nyaman dari \`top\` bawaan. Pastikan kamu install ini di setiap server baru.

---

## 🔫 Menghentikan Proses

\`\`\`bash
kill PID                  # Kirim sinyal TERM (minta berhenti baik-baik)
kill -9 PID               # Sinyal KILL (paksa berhenti, tidak bisa ditolak)
kill -15 PID              # Sinyal TERM (default)
killall nama-program      # Kill semua proses dengan nama tertentu
pkill -f kata-kunci       # Kill berdasarkan nama/pattern

# Contoh:
kill 1234                 # Hentikan proses PID 1234
kill -9 5678              # Paksa hentikan PID 5678
killall firefox           # Tutup semua Firefox
pkill -f "python app.py"  # Hentikan script python tertentu

# Cara aman: TERM dulu, KILL kalau tidak mau
kill -15 PID
sleep 3
kill -9 PID  # Kalau masih hidup
\`\`\`

Kapan pakai \`kill -9\`? Hanya saat proses "hang" dan tidak merespons \`kill\` biasa. \`kill -9\` tidak memberi proses kesempatan membersihkan resource-nya, jadi gunakan sebagai last resort.

---

## 🔄 Background & Foreground Jobs

\`\`\`bash
# Jalankan di background (tidak blokir terminal)
./long-script.sh &          # & = jalankan di background
sleep 100 &                  # PID akan ditampilkan: [1] 1234

# Kelola jobs
jobs                         # Lihat daftar background jobs
fg                           # Bawa job terakhir ke foreground
fg %1                        # Bawa job nomor 1 ke foreground
bg                           # Lanjutkan job yang di-pause di background
bg %2                        # Background job nomor 2

# Pause job yang sedang jalan: Ctrl+Z
# Lalu bawa ke background: bg
./heavy-task.sh              # Mulai di foreground
# [Ctrl+Z]                  # Pause!
# [1]+ Stopped  ./heavy-task.sh
bg                           # Lanjutkan di background
\`\`\`

---

## 🔧 systemctl — Kelola Layanan Sistem

\`\`\`bash
# systemctl mengelola "services" — program yang berjalan terus di background

# Mulai / hentikan layanan
sudo systemctl start nginx            # Mulai nginx
sudo systemctl stop nginx             # Hentikan nginx
sudo systemctl restart nginx          # Restart
sudo systemctl reload nginx           # Reload config tanpa restart

# Status dan enable
sudo systemctl status nginx           # Lihat status
sudo systemctl enable nginx           # Otomatis start saat boot
sudo systemctl disable nginx          # Jangan auto-start saat boot
sudo systemctl is-active nginx        # Cek apakah aktif
sudo systemctl is-enabled nginx       # Cek apakah enabled

# Lihat semua services
systemctl list-units --type=service
systemctl list-units --type=service --state=running  # Hanya yang aktif

# Contoh output systemctl status:
# ● nginx.service - A high performance web server
#    Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
#    Active: active (running) since Mon 2024-06-05 10:30:00 WIB
#   Process: 1234 ExecStartPre=/usr/sbin/nginx -t
#  Main PID: 1235 (nginx)
\`\`\`

Pola yang paling sering dipakai saat setup server baru:
\`\`\`bash
sudo systemctl start nginx       # Mulai sekarang
sudo systemctl enable nginx      # Pastikan jalan lagi setelah reboot
sudo systemctl status nginx      # Verifikasi berjalan dengan benar
\`\`\`

---

## ⏰ Cron — Jadwalkan Tugas Otomatis

\`\`\`bash
# crontab -e = edit jadwal tugas otomatis

# Format cron:
# ┌─── menit (0-59)
# │ ┌─── jam (0-23)
# │ │ ┌─── hari (1-31)
# │ │ │ ┌─── bulan (1-12)
# │ │ │ │ ┌─── hari dalam seminggu (0-7, 0 dan 7 = Minggu)
# │ │ │ │ │
# * * * * * perintah

crontab -e              # Edit crontab
crontab -l              # Lihat crontab aktif
crontab -r              # Hapus semua crontab (hati-hati!)

# Contoh jadwal:
# Jalankan setiap menit:
* * * * * /path/to/script.sh

# Setiap jam pada menit ke-30:
30 * * * * /path/to/script.sh

# Setiap hari pukul 02:30:
30 2 * * * /path/backup.sh

# Setiap Senin pukul 09:00:
0 9 * * 1 /path/weekly.sh

# Setiap bulan tanggal 1 pukul 00:00:
0 0 1 * * /path/monthly.sh

# Setiap 5 menit:
*/5 * * * * /path/check.sh

# Contoh nyata — backup database tiap hari jam 3 pagi:
0 3 * * * /home/budi/scripts/backup-db.sh >> /var/log/backup.log 2>&1
\`\`\`

---

## 💾 Monitor Penggunaan Disk & Memori

\`\`\`bash
# Disk usage
df -h                    # Penggunaan semua partisi (human-readable)
df -h /                  # Hanya partisi root
df -h /home              # Partisi home

# Output df -h:
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1        50G   15G   33G  32% /
# tmpfs           3.9G  1.2M  3.9G   1% /tmp

# Directory disk usage
du -sh *                 # Ukuran tiap item di folder saat ini
du -sh ~/*               # Ukuran tiap item di home
du -sh /var/log/*        # Ukuran file log
du -h --max-depth=1 /    # Ukuran folder level pertama

# Cari 10 folder terbesar
du -h / 2>/dev/null | sort -rh | head -10

# RAM dan swap
free -h                  # Penggunaan RAM
# Output:
#               total        used        free      shared  buff/cache   available
# Mem:           15Gi        3.2Gi       8.1Gi      512Mi       4.1Gi      11Gi
# Swap:         2.0Gi          0B        2.0Gi

cat /proc/meminfo        # Info detail memori
\`\`\`

---

## ⚙️ Informasi Sistem Real-time

\`\`\`bash
# Load average — seberapa sibuk sistem
uptime
# 10:30:00 up 5 days, 2:15, 2 users, load average: 0.15, 0.20, 0.18
# Tiga angka = rata-rata load 1 menit, 5 menit, 15 menit
# Ideal: angka ini < jumlah CPU core

nproc                    # Berapa CPU core yang ada?
lscpu                    # Detail spesifikasi CPU

# Pantau sistem secara real-time
vmstat 1                 # Update tiap detik: CPU, memori, I/O
iostat 1                 # Fokus ke disk I/O
\`\`\`

---

## 📝 Ringkasan

| Perintah | Fungsi |
|----------|--------|
| \`ps aux\` | Lihat semua proses |
| \`htop\` | Monitor interaktif yang nyaman |
| \`kill PID\` | Hentikan proses |
| \`kill -9 PID\` | Paksa hentikan (last resort) |
| \`command &\` | Jalankan di background |
| \`sudo systemctl start X\` | Mulai service |
| \`sudo systemctl enable X\` | Auto-start saat boot |
| \`crontab -e\` | Edit jadwal otomatis |
| \`df -h\` | Penggunaan disk |
| \`free -h\` | Penggunaan RAM |

> **Di pelajaran berikutnya, kita belajar jaringan di Linux — SSH, wget, curl, dan firewall!** 🌐
`;
