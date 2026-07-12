export const linux_l10 = `
# Keamanan Linux — Hardening Server Production

Setelah install server dan setup aplikasi, langkah yang sering dilewati pemula adalah hardening keamanan. Padahal server yang tidak diamankan bisa dijebol dalam hitungan jam — ada tool otomatis yang terus scan internet mencari celah.

Pelajaran ini adalah checklist yang perlu kamu ikuti setiap kali setup server baru.

---

## 👥 Manajemen User — Jangan Pakai Root Langsung

\`\`\`bash
# Buat user khusus untuk deploy/operasi
sudo adduser deploy          # Cara interaktif, lebih mudah
sudo usermod -aG sudo deploy  # Tambah ke grup sudo (admin)

# Hapus user
sudo userdel -r namauser     # -r = hapus home folder juga

# Ubah grup user
sudo usermod -aG docker deploy    # Tambah ke grup docker
sudo usermod -aG www-data deploy  # Tambah ke grup web server

# Cek info user
id deploy                    # Lihat UID, GID, dan semua grup
groups deploy                # Grup yang dimiliki
\`\`\`

Mengapa tidak pakai root langsung? Kalau kamu salah ketik perintah sebagai root, tidak ada "undo". Sebagai user biasa dengan sudo, ada lapisan konfirmasi.

---

## 🔑 sudo — Delegasi Akses Admin

\`\`\`bash
# Edit sudoers dengan aman (JANGAN edit /etc/sudoers langsung!)
sudo visudo

# Format sudoers:
# user_atau_grup   host=(as_user)   perintah
budi ALL=(ALL) ALL                  # Budi bisa jalankan semua perintah
budi ALL=(ALL) NOPASSWD: ALL        # Tanpa password (HATI-HATI!)
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx  # Hanya restart nginx

# Cek apakah user punya sudo
sudo -l                             # Lihat hak sudo diri sendiri
sudo -l -U namauser                 # Hak sudo user lain (perlu root)

# Jalankan sebagai user lain
sudo -u www-data command            # Jalankan sebagai www-data
su - namauser                       # Pindah ke user lain (butuh passwordnya)
\`\`\`

---

## 🛡️ Hardening SSH — Paling Penting

SSH adalah pintu masuk utama ke server. Ini yang paling sering diserang:

\`\`\`bash
sudo nano /etc/ssh/sshd_config

# Konfigurasi yang direkomendasikan:
Port 2222                      # Ganti dari 22 — kurangi noise dari scanner otomatis
PermitRootLogin no             # Jangan izinkan login langsung sebagai root
PasswordAuthentication no      # Hanya SSH key — password bisa di-brute force
PubkeyAuthentication yes       # Aktifkan login via key
MaxAuthTries 3                 # Maksimal 3 percobaan
LoginGraceTime 30              # Timeout 30 detik
AllowUsers budi deploy         # Hanya user ini yang boleh SSH
ClientAliveInterval 300        # Disconnect idle setelah 5 menit
ClientAliveCountMax 2

# Restart SSH setelah edit
sudo systemctl restart sshd
\`\`\`

> ⚠️ **PENTING:** Pastikan kamu sudah bisa login pakai SSH key sebelum \`PasswordAuthentication no\` diaktifkan. Kalau salah, kamu akan terkunci dari server sendiri!

---

## 🚫 Fail2ban — Blokir Brute Force Otomatis

\`\`\`bash
sudo apt install fail2ban

# Buat file config lokal (jangan edit jail.conf langsung)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Konfigurasi penting:
[DEFAULT]
bantime  = 3600      # Ban 1 jam
findtime = 600       # Window 10 menit
maxretry = 5         # Maksimal 5 kali gagal

[sshd]
enabled = true
port    = 2222       # Sesuaikan dengan port SSH kamu

sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Monitor
sudo fail2ban-client status sshd     # Lihat berapa IP yang di-ban
sudo fail2ban-client unban 1.2.3.4   # Hapus ban kalau kamu sendiri yang kena
\`\`\`

---

## 📊 Log Monitoring & Audit

\`\`\`bash
# Log penting di Linux
/var/log/auth.log           # Autentikasi dan SSH
/var/log/syslog             # Log sistem umum
/var/log/kern.log           # Log kernel
/var/log/ufw.log            # Log firewall UFW
/var/log/nginx/access.log   # Access log Nginx
/var/log/nginx/error.log    # Error log Nginx

# Cek login yang gagal
sudo grep "Failed password" /var/log/auth.log | tail -20

# Cek IP yang paling sering gagal login
sudo grep "Failed password" /var/log/auth.log | \\
  awk '{print $11}' | sort | uniq -c | sort -rn | head -10

# Cek login yang berhasil
sudo grep "Accepted" /var/log/auth.log | tail -20

# Siapa yang sedang login?
who                          # User yang sedang login
w                            # Lebih detail dengan aktivitas
last                         # Riwayat login
lastb                        # Login yang gagal

# Audit file yang berubah
sudo apt install aide
sudo aide --init             # Inisialisasi database
sudo aide --check            # Cek perubahan sejak inisialisasi
\`\`\`

---

## 🔥 Checklist Hardening Server Baru

Ikuti urutan ini setiap kali setup server production:

\`\`\`bash
# 1. Update sistem
sudo apt update && sudo apt upgrade -y

# 2. Setup firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp     # SSH (port custom)
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw enable

# 3. Buat user non-root
sudo adduser deploy
sudo usermod -aG sudo deploy

# 4. Setup SSH key untuk user baru
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

# 5. Hardening SSH
sudo nano /etc/ssh/sshd_config
# Set: Port 2222, PermitRootLogin no, PasswordAuthentication no
sudo systemctl restart sshd

# 6. Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# 7. Disable service yang tidak perlu
sudo systemctl disable avahi-daemon
sudo systemctl disable bluetooth
sudo systemctl disable cups

# 8. Automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
\`\`\`

---

## 🎓 Ringkasan Kursus Linux

Selamat! Kamu sudah kuasai:

| Modul | Yang Dipelajari |
|-------|----------------|
| 1 | Apa itu Linux, distro, filesystem |
| 2 | Terminal, navigasi, shortcut |
| 3 | Manajemen file, permissions |
| 4 | Text editor, grep, pipe, sed, awk |
| 5 | Package manager, apt, pip, npm |
| 6 | Proses, systemctl, cron |
| 7 | Jaringan, SSH, wget, curl, firewall |
| 8 | Shell scripting, otomasi |
| 9 | Server, Nginx, Docker, PM2 |
| 10 | Keamanan, hardening, monitoring |

---

## 🚀 Langkah Selanjutnya

1. **Praktik di VPS** — Sewa VPS murah (DigitalOcean, Vultr) ~$4/bulan
2. **Docker & Kubernetes** — Container orchestration
3. **Ansible** — Otomasi konfigurasi server
4. **Terraform** — Infrastructure as Code
5. **Linux+ Certification** — Sertifikasi CompTIA Linux+
6. **RHCSA** — Red Hat Certified System Administrator

**Sumber belajar lanjutan:**
- \`explainshell.com\` — paste perintah, dapat penjelasan tiap bagiannya
- \`tldr.sh\` — manual yang ringkas dan mudah dibaca
- \`overthewire.org\` — game untuk belajar Linux dan security

> **Selamat! Kamu kini adalah Linux user yang capable. Terus berlatih — skill Linux seperti otot, semakin sering dipakai semakin kuat!** 🐧
`;
