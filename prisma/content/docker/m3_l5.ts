export const docker_l5 = `
# Deploy ke Server — Docker di Production yang Sesungguhnya

Kita sudah bisa bikin container dan jalankan di lokal. Sekarang langkah yang paling ditunggu: **deploy ke server yang sesungguhnya**, supaya aplikasi bisa diakses siapapun di seluruh dunia.

Di sini kita akan bahas setup server, CI/CD otomatis dengan GitHub Actions, dan hal-hal yang perlu diperhatikan di production.

---

## 🖥️ Setup Server Awal (Ubuntu/Debian)

\`\`\`bash
# Setelah beli VPS (DigitalOcean, Vultr, Linode, AWS EC2, dll.)
# Login via SSH
ssh root@IP_SERVER_KAMU

# ─── Langkah 1: Update dan install Docker ───
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh     # Install Docker otomatis
systemctl enable docker && systemctl start docker

# ─── Langkah 2: Buat user untuk deploy (bukan root!) ───
useradd -m -s /bin/bash deploy
usermod -aG docker deploy          # Tambahkan ke grup docker
usermod -aG sudo deploy            # Akses sudo kalau perlu

# Setup SSH key untuk user deploy (dari laptop kamu)
# Jalankan ini di laptop, bukan di server:
ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@IP_SERVER_KAMU

# ─── Langkah 3: Buat folder untuk aplikasi ───
mkdir -p /app
chown deploy:deploy /app

# ─── Langkah 4: Install Nginx di host (opsional, atau pakai nginx container) ───
apt install -y nginx certbot python3-certbot-nginx

# ─── Test koneksi sebagai user deploy ───
ssh deploy@IP_SERVER_KAMU
\`\`\`

---

## 🔄 GitHub Actions — CI/CD Otomatis dari Push ke Deploy

\`\`\`yaml
# .github/workflows/deploy.yml

name: Deploy ke Production

on:
  push:
    branches: [main]     # Trigger setiap push ke branch main
  workflow_dispatch:     # Atau trigger manual dari GitHub UI

env:
  REGISTRY: ghcr.io                  # GitHub Container Registry (gratis!)
  IMAGE_NAME: \${{ github.repository }}  # username/nama-repo

jobs:
  # ─── Job 1: Test dulu sebelum deploy ───
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Type check
        run: npm run type-check

  # ─── Job 2: Build dan push Docker image ───
  build:
    needs: test          # Hanya jalan kalau test berhasil
    runs-on: ubuntu-latest
    outputs:
      image-tag: \${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      - name: Login ke GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}  # Otomatis tersedia di Actions

      - name: Extract metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=sha                    # Tag berdasarkan commit SHA
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build dan Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha         # Manfaatkan GitHub Actions cache
          cache-to: type=gha,mode=max  # Build jauh lebih cepat!

  # ─── Job 3: Deploy ke server ───
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production  # Bisa set protection rules di GitHub

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: deploy
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Masuk ke folder app
            cd /app

            # Update environment variables
            echo "IMAGE_TAG=\${{ github.sha }}" > .env.deploy

            # Pull image terbaru
            docker pull \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest

            # Restart dengan zero-downtime (rolling update)
            docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps app

            # Jalankan migrasi database jika ada
            docker compose exec -T app npx prisma migrate deploy

            # Bersihkan image lama yang tidak terpakai
            docker image prune -f

            echo "✅ Deploy berhasil! Commit: \${{ github.sha }}"
\`\`\`

---

## 🔒 Secrets di GitHub

\`\`\`
Buka: Repository → Settings → Secrets and variables → Actions

Tambahkan:
- SERVER_HOST       = IP atau domain server kamu
- SSH_PRIVATE_KEY   = isi file ~/.ssh/id_rsa (private key, bukan .pub!)
- DATABASE_URL      = connection string database production
- NEXTAUTH_SECRET   = secret key untuk auth
- (dsb sesuai kebutuhan aplikasimu)
\`\`\`

---

## 🌐 SSL Certificate dengan Let's Encrypt (Gratis!)

\`\`\`bash
# Di server, install certbot dan dapatkan SSL certificate gratis
# Pertama, pastikan domain sudah pointing ke IP server kamu

# Minta certificate
certbot certonly --standalone \
    -d myapp.com \
    -d www.myapp.com \
    --email admin@myapp.com \
    --agree-tos

# Certificate tersimpan di:
# /etc/letsencrypt/live/myapp.com/fullchain.pem
# /etc/letsencrypt/live/myapp.com/privkey.pem

# Auto-renew setiap 90 hari (sudah otomatis kalau pakai systemd timer)
certbot renew --dry-run   # Test renew tanpa benar-benar renew

# Mount ke Nginx container
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
\`\`\`

---

## 📊 Monitoring Sederhana

\`\`\`bash
# ─── Monitor resource usage ───
docker stats                           # Real-time CPU, RAM, Network, Disk
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# ─── Log management ───
# Lihat log dengan filter waktu
docker compose logs --since 1h app     # Log 1 jam terakhir
docker compose logs --tail 100 app     # 100 baris terakhir

# Atur agar log tidak makan storage tak terbatas
# Di docker-compose.yml:
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"     # Maksimal 10MB per file log
        max-file: "3"       # Simpan maksimal 3 file rotasi

# ─── Script monitoring sederhana ───
# Simpan sebagai /usr/local/bin/check-services
#!/bin/bash
cd /app
docker compose ps --format json | python3 -c "
import json, sys
data = [json.loads(l) for l in sys.stdin]
for s in data:
    status = '✅' if s['State'] == 'running' else '❌'
    print(f\"{status} {s['Service']}: {s['State']} (Health: {s.get('Health', 'N/A')})\")
"
\`\`\`

---

## 🚨 Checklist Production Docker

\`\`\`
Sebelum deploy ke production, pastikan:

Security:
☐ Container tidak jalan sebagai root (ada USER non-root di Dockerfile)
☐ Image menggunakan versi tag spesifik, bukan "latest"
☐ Secret tidak di-hardcode di Dockerfile atau docker-compose.yml
☐ .env tidak di-commit ke git
☐ Port database tidak di-expose ke publik

Performance:
☐ Multi-stage build untuk image yang lebih kecil
☐ .dockerignore sudah dikonfigurasi
☐ Layer cache dimanfaatkan dengan baik (package.json di-copy dulu)

Reliability:
☐ HEALTHCHECK sudah dikonfigurasi
☐ restart: unless-stopped atau always
☐ Volume untuk data yang perlu persisten
☐ Log rotation dikonfigurasi

Monitoring:
☐ Ada cara untuk monitor uptime (Uptime Kuma, Statuspage, dsb)
☐ Alert kalau container crash
☐ Backup database terjadwal
\`\`\`

---

## 🔄 Zero-Downtime Deploy

\`\`\`bash
# Strategi untuk deploy tanpa downtime

# Cara 1: --no-deps untuk update satu service tanpa restart yang lain
docker compose up -d --no-deps --build app

# Cara 2: Jalankan versi baru dulu, switch traffic, baru matikan yang lama
# (Blue-Green deployment — butuh setup Nginx yang lebih kompleks)

# Cara 3: Kalau pakai beberapa replica (Docker Swarm atau Kubernetes)
docker service update --image myapp:new myapp_app
# Docker Swarm update satu per satu secara otomatis
\`\`\`

---

## 📝 Ringkasan Kursus Docker

Kamu sudah menempuh perjalanan dari "Docker itu apa?" sampai deploy production:

| Pelajaran | Topik |
|-----------|-------|
| 1 | Konsep, instalasi, perintah dasar, Dockerfile |
| 2 | Network, best practices, CI/CD |
| 3 | Dockerfile lanjutan, layer cache, multi-stage |
| 4 | Docker Compose, multi-service stack |
| 5 | Deploy ke server, SSL, monitoring, CI/CD |

**Langkah selanjutnya yang direkomendasikan:**
- **Kubernetes** — orchestrasi container skala enterprise
- **Docker Swarm** — clustering sederhana tanpa Kubernetes
- **Portainer** — UI untuk kelola Docker lebih mudah
- **Watchtower** — auto-update container saat ada image baru

> **Selamat! Kamu sudah bisa containerize dan deploy aplikasi dengan Docker. Skills ini dicari di hampir setiap job developer saat ini!** 🐳🎉
`;
