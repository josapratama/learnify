export const linux_l5 = `
# Manajemen Paket — Install Software di Linux

## 🏪 Analogi: Package Manager Seperti Toko Aplikasi Canggih

Di Windows, install software berarti: cari di Google → download .exe → klik next-next-next → selesai. Di Linux, ada cara yang jauh lebih baik: **package manager**.

Bayangkan toko aplikasi yang:
- Menyimpan **ribuan aplikasi** siap pakai
- Otomatis mengurus **semua dependensi** (aplikasi A butuh library B)
- Update semua software dengan **satu perintah**
- Dijamin **aman dan terverifikasi**

Itulah \`apt\` di Ubuntu/Debian!

---

## 📦 APT — Package Manager Ubuntu

### Perintah Dasar APT

\`\`\`bash
# Update daftar paket terbaru (seperti refresh katalog toko)
sudo apt update

# Upgrade semua paket yang sudah terinstall
sudo apt upgrade

# Update + upgrade sekaligus (cara sehari-hari)
sudo apt update && sudo apt upgrade -y

# Install aplikasi
sudo apt install nama-paket
sudo apt install git curl wget vim    # Install beberapa sekaligus

# Hapus aplikasi
sudo apt remove nama-paket           # Hapus tapi simpan config
sudo apt purge nama-paket            # Hapus + hapus config
sudo apt autoremove                  # Hapus dependensi yang tidak terpakai

# Cari aplikasi
apt search kata-kunci
apt search "text editor"

# Info tentang paket
apt show nama-paket

# Lihat semua yang terinstall
apt list --installed
apt list --installed | grep python
\`\`\`

---

## 🛠️ Install Aplikasi Populer

\`\`\`bash
# Development tools
sudo apt install git curl wget         # Alat dasar
sudo apt install build-essential       # Compiler C/C++
sudo apt install python3 python3-pip   # Python
sudo apt install nodejs npm            # Node.js (versi lama)

# Node.js versi terbaru (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# Text editors & IDE
sudo apt install vim nano              # Terminal editors
sudo snap install code --classic       # VS Code

# Utilities
sudo apt install htop tree ncdu        # Monitor & navigation
sudo apt install net-tools             # ifconfig, netstat
sudo apt install zip unzip             # Kompresi file

# Multimedia
sudo apt install ffmpeg                # Video/audio processing
sudo apt install imagemagick           # Image manipulation
\`\`\`

---

## 🔧 Snap — Format Paket Universal

Snap adalah format paket yang berjalan di semua distribusi Linux:

\`\`\`bash
# Install snap (sudah ada di Ubuntu)
sudo apt install snapd

# Install aplikasi via snap
sudo snap install code --classic       # VS Code
sudo snap install discord              # Discord
sudo snap install postman              # Postman API testing
sudo snap install slack --classic      # Slack

# Kelola snap
snap list                              # Daftar snap terinstall
sudo snap refresh                      # Update semua snap
sudo snap remove nama-aplikasi         # Hapus snap
\`\`\`

---

## 🐍 pip — Package Manager Python

\`\`\`bash
# Install library Python
pip install requests                   # HTTP client
pip install numpy pandas               # Data science
pip install django flask               # Web framework
pip install virtualenv                 # Virtual environment

# Dengan pip3 (pastikan Python 3)
pip3 install nama-library

# Install dari requirements.txt
pip install -r requirements.txt

# Lihat yang terinstall
pip list
pip show requests                      # Info detail

# Update library
pip install --upgrade requests

# Hapus library
pip uninstall requests
\`\`\`

---

## 📦 npm — Package Manager Node.js

\`\`\`bash
# Install package global
npm install -g nodemon                 # Auto-restart Node.js
npm install -g typescript              # TypeScript compiler
npm install -g vercel                  # Vercel CLI
npm install -g pm2                     # Process manager

# Install package lokal (di proyek)
npm install express                    # Web framework
npm install --save-dev jest            # Testing (dev dependency)

# Kelola npm
npm list -g                            # Daftar package global
npm update -g                          # Update semua global
npm uninstall -g nama-package          # Hapus package global
\`\`\`

---

## 🔒 sudo — Jalankan Sebagai Administrator

\`\`\`bash
# sudo = "Super User DO"
# Diperlukan untuk operasi sistem yang membutuhkan akses root

sudo apt install nginx                 # Install dengan hak admin
sudo systemctl start nginx             # Kelola layanan sistem
sudo nano /etc/nginx/nginx.conf        # Edit file sistem

# sudo -i = masuk ke sesi root (hati-hati!)
sudo -i
# Prompt berubah dari $ ke #

# Keluar dari sesi root
exit

# Jalankan perintah terakhir dengan sudo
sudo !!
# Contoh: ketik "apt install nginx", lupa sudo
# Lalu ketik "sudo !!" untuk jalankan ulang dengan sudo
\`\`\`

---

## 📊 Informasi Sistem & Software

\`\`\`bash
# Versi OS
lsb_release -a
cat /etc/os-release

# Cek versi software yang terinstall
git --version
python3 --version
node --version
npm --version
nginx -v
mysql --version

# Di mana sebuah program berada?
which python3       # /usr/bin/python3
which node          # /usr/local/bin/node
whereis vim         # Lokasi program + manual + source

# Cek apakah package terinstall
dpkg -l | grep nginx
apt list --installed | grep python
\`\`\`

---

## 🗜️ Kompresi & Arsip

\`\`\`bash
# tar — archiving tool
tar -czvf backup.tar.gz folder/       # Kompres folder ke .tar.gz
tar -xzvf backup.tar.gz               # Ekstrak .tar.gz
tar -cjvf backup.tar.bz2 folder/      # Kompres ke .tar.bz2 (lebih kecil)
tar -tvf backup.tar.gz                # Lihat isi tanpa ekstrak

# zip
zip -r arsip.zip folder/              # Kompres ke .zip
unzip arsip.zip                        # Ekstrak .zip
unzip arsip.zip -d /tujuan/           # Ekstrak ke folder tertentu

# gzip (hanya satu file)
gzip file.txt                          # Kompres → file.txt.gz
gunzip file.txt.gz                     # Dekompres
\`\`\`

---

## 💡 Praktik: Setup Development Environment

\`\`\`bash
# Setup lengkap untuk web developer di Ubuntu baru

# 1. Update sistem
sudo apt update && sudo apt upgrade -y

# 2. Install tools dasar
sudo apt install -y git curl wget build-essential

# 3. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # v20.x.x
npm --version    # 10.x.x

# 4. Install Python
sudo apt install -y python3 python3-pip python3-venv
python3 --version  # 3.11.x

# 5. Install Docker
sudo apt install -y docker.io
sudo usermod -aG docker $USER  # Tambah user ke grup docker
newgrp docker

# 6. Install VS Code
sudo snap install code --classic

# 7. Install utilitas berguna
sudo apt install -y htop tree ncdu net-tools zip unzip

echo "Setup selesai!"
\`\`\`

---

## 📝 Ringkasan

| Perintah | Fungsi |
|----------|--------|
| \`sudo apt update\` | Refresh daftar paket |
| \`sudo apt upgrade\` | Update semua paket |
| \`sudo apt install X\` | Install paket X |
| \`sudo apt remove X\` | Hapus paket X |
| \`apt search X\` | Cari paket |
| \`sudo snap install X\` | Install via Snap |
| \`pip install X\` | Install library Python |
| \`npm install -g X\` | Install package Node.js global |
| \`sudo !! \` | Jalankan perintah lalu dengan sudo |

> **Di pelajaran berikutnya, kita belajar manajemen proses dan sistem — monitor dan kontrol apa yang berjalan di Linux!** ⚙️
`;
