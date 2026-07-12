export const linux_l9 = `
# Linux untuk Server, DevOps & Deployment

## 🖥️ Linux di Production Environment

Server production yang menjalankan website Anda hampir pasti Linux. Pelajaran ini membekali Anda skill langsung pakai untuk mengelola server nyata.

---

## 🌐 Setup Web Server Nginx

\`\`\`bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Mulai dan enable
sudo systemctl start nginx
sudo systemctl enable nginx

# Cek status
sudo systemctl status nginx
curl localhost    # Harus tampil halaman default Nginx

# Izinkan di firewall
sudo ufw allow 'Nginx Full'   # HTTP + HTTPS
sudo ufw status
\`\`\`

### Konfigurasi Virtual Host

\`\`\`bash
# Buat file konfigurasi untuk domain
sudo nano /etc/nginx/sites-available/myapp.com

# Isi konfigurasi:
server {
    listen 80;
    server_name myapp.com www.myapp.com;
    root /var/www/myapp;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Proxy ke Node.js app di port 3000
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Aktifkan site
sudo ln -s /etc/nginx/sites-available/myapp.com /etc/nginx/sites-enabled/
sudo nginx -t          # Test konfigurasi
sudo systemctl reload nginx
\`\`\`

---

## 🔒 SSL/HTTPS dengan Certbot (Gratis!)

\`\`\`bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Dapatkan sertifikat SSL gratis dari Let's Encrypt
sudo certbot --nginx -d myapp.com -d www.myapp.com

# Certbot otomatis konfigurasi Nginx untuk HTTPS!

# Renewal otomatis (sudah setup oleh certbot, cek:)
sudo certbot renew --dry-run   # Test renewal
\`\`\`

---

## 🚀 Deploy Aplikasi Node.js

\`\`\`bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# Install PM2 (process manager untuk production)
sudo npm install -g pm2

# Clone dan setup aplikasi
cd /var/www
sudo git clone https://github.com/username/myapp.git
cd myapp
npm ci --production

# Start dengan PM2
pm2 start app.js --name myapp
pm2 start npm --name myapp -- start   # Jika pakai npm start

# Kelola dengan PM2
pm2 status              # Status semua app
pm2 logs myapp          # Lihat logs
pm2 restart myapp       # Restart
pm2 stop myapp          # Stop
pm2 delete myapp        # Hapus dari PM2

# PM2 auto-start saat server reboot
pm2 startup             # Generate command startup
pm2 save                # Simpan daftar app
\`\`\`

---

## 🐳 Docker di Linux

\`\`\`bash
# Install Docker
sudo apt install docker.io
sudo usermod -aG docker $USER   # Tambah user ke grup docker
newgrp docker                    # Aktifkan perubahan grup

# Perintah Docker dasar
docker ps                        # Lihat container yang berjalan
docker ps -a                     # Semua container termasuk stopped
docker images                    # Lihat image lokal

# Jalankan container
docker run -d -p 80:80 --name webserver nginx
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres

# Stop dan hapus
docker stop webserver
docker rm webserver
docker rmi nginx                 # Hapus image

# Lihat logs
docker logs webserver
docker logs -f webserver         # Follow logs

# Masuk ke container
docker exec -it webserver bash

# Docker Compose
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - .:/app
    command: npm start
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

docker compose up -d     # Start semua service
docker compose down      # Stop dan hapus container
docker compose logs -f   # Lihat logs semua service
\`\`\`

---

## ⚙️ Environment Variables & .bashrc

\`\`\`bash
# Environment variable sementara (hilang saat terminal tutup)
export DATABASE_URL="postgresql://localhost/mydb"
export API_KEY="secret123"

# Permanent: tambahkan ke ~/.bashrc atau ~/.zshrc
nano ~/.bashrc

# Tambahkan di akhir file:
export EDITOR="vim"
export NODE_ENV="development"
export PATH="$HOME/.local/bin:$PATH"   # Tambah folder ke PATH

# Alias berguna
alias ll='ls -la'
alias gs='git status'
alias gp='git push'
alias reload='source ~/.bashrc'

# Terapkan perubahan
source ~/.bashrc   # atau: . ~/.bashrc

# Lihat semua env var
env
printenv PATH
echo $DATABASE_URL
\`\`\`

---

## 📋 Monitoring Server

\`\`\`bash
# Lihat log real-time
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -f                     # Journal systemd real-time
sudo journalctl -u nginx -f            # Log service tertentu
sudo journalctl --since "1 hour ago"   # Log 1 jam terakhir

# Peringatan disk penuh
df -h | awk 'NR>1 && $5+0 > 80 {print "WARNING:", $6, "is", $5, "full"}'

# Script monitoring sederhana
cat > /usr/local/bin/check-server.sh << 'EOF'
#!/bin/bash
echo "=== SERVER STATUS $(date) ==="
echo "Uptime: $(uptime -p)"
echo "CPU Load: $(cut -d' ' -f1 /proc/loadavg)"
echo "RAM: $(free -h | awk '/^Mem:/{print $3"/"$2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $3"/"$2" ("$5")"}')"
echo "Services:"
for svc in nginx postgresql; do
    systemctl is-active $svc >/dev/null && echo "  ✅ $svc" || echo "  ❌ $svc"
done
EOF
chmod +x /usr/local/bin/check-server.sh
check-server.sh
\`\`\`

---

## 📝 Ringkasan

\`\`\`bash
# Nginx
sudo apt install nginx
sudo systemctl enable nginx
sudo nano /etc/nginx/sites-available/myapp

# PM2
npm install -g pm2
pm2 start app.js --name myapp
pm2 startup && pm2 save

# Docker
sudo apt install docker.io
docker run -d nginx
docker compose up -d

# Environment
export VAR=value
nano ~/.bashrc
source ~/.bashrc

# Monitoring
sudo tail -f /var/log/nginx/access.log
sudo journalctl -u nginx -f
\`\`\`

> **Di pelajaran terakhir, kita bahas keamanan Linux dan administrasi lanjutan!** 🔒
`;
