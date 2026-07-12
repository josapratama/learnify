export const linux_l7 = `
# Jaringan di Linux — SSH, curl & Firewall

## 🌐 Linux adalah Raja Jaringan

Hampir semua infrastruktur internet berjalan di server Linux. Memahami networking di Linux berarti memahami cara kerja internet itu sendiri.

---

## 🔍 Cek Koneksi Jaringan

\`\`\`bash
# Alamat IP
ip addr show                    # Tampilkan semua interface dan IP
ip addr show eth0               # Interface tertentu
hostname -I                     # IP address saja (mudah)
curl ifconfig.me                # IP publik Anda

# Test koneksi
ping google.com                 # Test koneksi (Ctrl+C untuk stop)
ping -c 4 google.com            # Ping 4x saja
ping 8.8.8.8                    # Ping ke DNS Google

# Info routing
ip route                        # Tabel routing
ip route show default           # Default gateway

# Info DNS
cat /etc/resolv.conf            # Server DNS yang digunakan
nslookup google.com             # Lookup DNS
dig google.com                  # Lookup DNS detail

# Port yang terbuka
ss -tlnp                        # TCP listening ports + proses
ss -ulnp                        # UDP ports
netstat -tlnp                   # Alternatif (butuh net-tools)
\`\`\`

---

## 🔐 SSH — Remote Access yang Aman

SSH (Secure Shell) = koneksi terenkripsi ke server remote. Ini skill paling penting untuk sysadmin!

\`\`\`bash
# Koneksi ke server
ssh username@ip-atau-domain             # Koneksi dasar
ssh budi@192.168.1.100                  # Koneksi via IP
ssh budi@server.example.com            # Koneksi via domain
ssh -p 2222 budi@server.example.com    # Port non-standard

# Dengan SSH key (lebih aman dari password)
ssh -i ~/.ssh/id_ed25519 budi@server   # Spesifikasi key

# SSH Config file (~/.ssh/config) — shortcut yang nyaman
cat > ~/.ssh/config << 'EOF'
Host myserver
    HostName 192.168.1.100
    User budi
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host production
    HostName prod.example.com
    User deploy
    IdentityFile ~/.ssh/prod_key
EOF

# Sekarang cukup:
ssh myserver         # Langsung konek!
ssh production
\`\`\`

---

## 📤 Transfer File via SSH

\`\`\`bash
# SCP — Secure Copy
scp file.txt budi@server:/home/budi/         # Upload file
scp budi@server:/home/budi/file.txt .        # Download file
scp -r folder/ budi@server:/home/budi/       # Upload folder (-r)
scp -P 2222 file.txt budi@server:/tmp/       # Port non-standard

# rsync — Transfer yang Efisien (hanya kirim yang berubah)
rsync -avz folder/ budi@server:/home/budi/folder/   # Upload
rsync -avz budi@server:/data/ /local/backup/         # Download
rsync -avz --delete folder/ server:/backup/          # Sync (hapus yang tidak ada)

# Opsi rsync:
# -a = archive (preserve permissions, timestamps)
# -v = verbose (tampilkan progress)
# -z = compress (lebih cepat di koneksi lambat)
# -n = dry run (simulasi, tidak eksekusi)
# --progress = tampilkan progress transfer
\`\`\`

---

## 🌐 wget & curl — Download dari Terminal

\`\`\`bash
# wget — Download file
wget https://example.com/file.zip               # Download
wget -O nama-file.zip https://example.com/dl    # Simpan dengan nama berbeda
wget -c https://example.com/big-file.iso        # Resume download yang terpotong
wget -q --show-progress https://url/file        # Mode senyap dengan progress bar
wget -r -np https://example.com/docs/           # Download rekursif

# curl — Swiss Army Knife HTTP
curl https://api.ipify.org                      # IP publik
curl -O https://example.com/file.txt            # Download file
curl -L https://example.com/redirect            # Ikuti redirect
curl -s https://api.example.com/data            # Silent mode
curl -I https://google.com                      # Hanya header

# API testing dengan curl
curl -X GET "https://api.example.com/users"
curl -X POST "https://api.example.com/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Budi","email":"budi@email.com"}'

# Download dan jalankan (hati-hati dengan yang tidak terpercaya!)
curl -fsSL https://get.docker.com | sudo bash
\`\`\`

---

## 🔥 UFW — Firewall Sederhana

\`\`\`bash
# UFW = Uncomplicated Firewall

# Aktifkan firewall
sudo ufw enable
sudo ufw disable          # Matikan sementara
sudo ufw status           # Lihat status dan rules
sudo ufw status verbose   # Detail lengkap

# Aturan default (sebaiknya):
sudo ufw default deny incoming    # Blokir semua masuk
sudo ufw default allow outgoing   # Izinkan semua keluar

# Izinkan port/service
sudo ufw allow ssh                 # Izinkan SSH (port 22)
sudo ufw allow 80                  # Port HTTP
sudo ufw allow 443                 # Port HTTPS
sudo ufw allow 8080                # Port spesifik
sudo ufw allow 'Nginx Full'        # Profile (HTTP + HTTPS)
sudo ufw allow from 192.168.1.0/24 # Izinkan dari subnet tertentu

# Blokir
sudo ufw deny 3306                 # Blokir MySQL dari luar
sudo ufw deny from 1.2.3.4         # Blokir IP tertentu

# Hapus rule
sudo ufw delete allow 8080
sudo ufw delete deny 3306

# Reset semua rules
sudo ufw reset
\`\`\`

---

## 📡 /etc/hosts — DNS Lokal

\`\`\`bash
cat /etc/hosts

# Tambahkan mapping domain lokal:
sudo nano /etc/hosts

# Isi:
127.0.0.1   localhost
::1         localhost
127.0.0.1   myapp.local     # Domain lokal untuk development
192.168.1.100  server1      # Alias untuk IP server

# Test:
ping myapp.local             # Harus resolve ke 127.0.0.1
\`\`\`

---

## 💡 Praktik: Setup SSH Key ke Server

\`\`\`bash
# 1. Generate SSH key (jika belum ada)
ssh-keygen -t ed25519 -C "nama@email.com"
# Simpan di ~/.ssh/id_ed25519

# 2. Copy public key ke server
ssh-copy-id budi@192.168.1.100
# Atau manual:
cat ~/.ssh/id_ed25519.pub | ssh budi@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# 3. Test koneksi dengan key (tanpa password!)
ssh budi@192.168.1.100

# 4. Amankan: disable password login di server (opsional, untuk keamanan)
sudo nano /etc/ssh/sshd_config
# Ubah: PasswordAuthentication no
sudo systemctl restart sshd
\`\`\`

---

## � Ringkasan

\`\`\`bash
ip addr show              # Lihat IP address
ping google.com           # Test koneksi
ssh user@server           # Koneksi SSH ke server
scp file user@server:/    # Upload via SSH
rsync -avz src/ dest/     # Sync file efisien
wget URL                  # Download file
curl URL                  # HTTP request
sudo ufw allow ssh        # Izinkan SSH di firewall
sudo ufw enable           # Aktifkan firewall
\`\`\`

> **Di pelajaran berikutnya, kita belajar Shell Scripting — otomasi tugas berulang!** 🤖
`;
