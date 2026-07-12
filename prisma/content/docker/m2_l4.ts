export const docker_l4 = `
# Docker Compose — Satu File, Banyak Container, Satu Perintah

Aplikasi nyata itu jarang berdiri sendiri. Biasanya ada database, cache, message queue, reverse proxy — minimal 3-4 service yang harus jalan bersamaan.

Tanpa Docker Compose, kamu harus jalankan masing-masing dengan docker run yang panjang, ingat urutan yang benar, dan pastikan semuanya terhubung. Melelahkan.

Docker Compose hadir untuk itu: **tulis semua konfigurasi di satu file YAML, lalu jalankan dengan satu perintah**.

---

## 📄 Anatomi docker-compose.yml

\`\`\`yaml
# docker-compose.yml — struktur dasar

version: '3.8'   # Versi format file Compose

services:         # Daftar semua container yang akan dijalankan
  nama-service:   # Nama bebas, akan jadi "hostname" di network internal
    image: ...    # Pakai image yang sudah ada, ATAU
    build: ...    # Build dari Dockerfile

networks:         # (Opsional) Konfigurasi network khusus
  ...

volumes:          # (Opsional) Named volumes untuk data persisten
  ...
\`\`\`

---

## 🛠️ Contoh Lengkap: Stack Full Web App

\`\`\`yaml
# docker-compose.yml — Stack Next.js + PostgreSQL + Redis + Nginx

version: '3.8'

services:

  # ──────────── Aplikasi Next.js ────────────
  app:
    build:
      context: .           # Lokasi Dockerfile (folder ini)
      dockerfile: Dockerfile
      args:
        APP_VERSION: "1.0.0"
    container_name: nextjs-app
    restart: unless-stopped
    ports:
      - "3000:3000"        # Expose port untuk development
                           # (Di production, biarkan Nginx yang expose ke luar)
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://dbuser:dbpass@db:5432/appdb
      REDIS_URL: redis://redis:6379
      NEXTAUTH_SECRET: \${NEXTAUTH_SECRET}    # Ambil dari file .env
      NEXTAUTH_URL: \${NEXTAUTH_URL}
    depends_on:
      db:
        condition: service_healthy    # Tunggu DB benar-benar siap
      redis:
        condition: service_started
    volumes:
      - ./public/uploads:/app/public/uploads   # Bind mount untuk file upload
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ──────────── PostgreSQL Database ────────────
  db:
    image: postgres:16-alpine
    container_name: postgres-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: dbpass
      POSTGRES_DB: appdb
    volumes:
      - postgres_data:/var/lib/postgresql/data    # Data tetap ada walau container restart
      - ./prisma/migrations:/docker-entrypoint-initdb.d:ro  # Auto-run SQL saat pertama kali
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dbuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ──────────── Redis Cache ────────────
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    restart: unless-stopped
    command: redis-server --requirepass \${REDIS_PASSWORD:-defaultpass} --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # ──────────── Nginx Reverse Proxy ────────────
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
      - nginx_cache:/var/cache/nginx
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:
  nginx_cache:

networks:
  app-network:
    driver: bridge
\`\`\`

---

## 🔐 Kelola Secret dengan .env

\`\`\`bash
# .env — letakkan di root project, JANGAN commit ke git!
NEXTAUTH_SECRET=supersecretkey123
NEXTAUTH_URL=https://myapp.com
REDIS_PASSWORD=strongpassword
POSTGRES_PASSWORD=dbpass

# .env.example — commit ini, tanpa nilai yang sebenarnya
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
REDIS_PASSWORD=
POSTGRES_PASSWORD=
\`\`\`

\`\`\`yaml
# Di docker-compose.yml, ambil dari environment host atau .env
environment:
  NEXTAUTH_SECRET: \${NEXTAUTH_SECRET}
  # Atau dengan nilai default kalau tidak ada:
  REDIS_PASSWORD: \${REDIS_PASSWORD:-defaultpassword}
\`\`\`

---

## ⚡ Override File — Berbeda untuk Dev dan Production

\`\`\`yaml
# docker-compose.yml — base config (shared)
version: '3.8'
services:
  app:
    build: .
    environment:
      NODE_ENV: production
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
\`\`\`

\`\`\`yaml
# docker-compose.override.yml — otomatis di-merge saat development
# Tidak perlu -f flag, Docker Compose cari file ini secara otomatis!
version: '3.8'
services:
  app:
    environment:
      NODE_ENV: development
    volumes:
      - .:/app                   # Hot reload! Kode lokal langsung sync ke container
      - /app/node_modules        # Kecuali node_modules (pakai yang ada di container)
    command: npm run dev
  db:
    ports:
      - "5432:5432"              # Expose port DB di development (untuk koneksi dari host)
\`\`\`

\`\`\`yaml
# docker-compose.prod.yml — khusus production
version: '3.8'
services:
  app:
    image: myapp:latest          # Pakai image yang sudah di-build, bukan build ulang
    restart: always
    deploy:
      replicas: 2                # Jalankan 2 instance untuk load balancing
\`\`\`

\`\`\`bash
# Development (auto pakai docker-compose.yml + docker-compose.override.yml)
docker compose up -d

# Production (pakai file prod secara eksplisit)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

---

## 📊 Perintah Docker Compose yang Perlu Kamu Hafal

\`\`\`bash
# ═══ START & STOP ═══
docker compose up -d                # Jalankan semua service di background
docker compose up -d --build        # Build ulang image sebelum jalankan
docker compose down                 # Hentikan dan hapus container
docker compose down -v              # Hentikan + hapus volume (DATA HILANG! Hati-hati)

# ═══ MONITOR ═══
docker compose ps                   # Status semua service
docker compose logs                 # Log semua service
docker compose logs -f app          # Follow log service tertentu
docker compose top                  # Proses yang berjalan di dalam container

# ═══ MANAJEMEN ═══
docker compose restart app          # Restart satu service
docker compose stop db              # Stop satu service tanpa hapus
docker compose start db             # Start lagi
docker compose pull                 # Update semua image ke versi terbaru

# ═══ DEBUGGING ═══
docker compose exec app sh          # Masuk ke shell container yang sedang jalan
docker compose exec db psql -U dbuser -d appdb    # Masuk ke PostgreSQL
docker compose run --rm app npm run migrate       # Jalankan perintah sekali (lalu container dihapus)

# ═══ SCALING ═══
docker compose up -d --scale app=3  # Jalankan 3 instance 'app' sekaligus
\`\`\`

---

## 🔧 Nginx Config untuk Reverse Proxy

\`\`\`nginx
# nginx/conf.d/default.conf

upstream nextjs {
    server app:3000;    # "app" = nama service di docker-compose, bukan IP!
}

server {
    listen 80;
    server_name myapp.com www.myapp.com;

    # Redirect HTTP ke HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name myapp.com www.myapp.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    # Proxy ke Next.js
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }

    # Cache static files
    location /_next/static {
        proxy_pass http://nextjs;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
\`\`\`

---

## 📝 Ringkasan

Docker Compose mengubah pengelolaan multi-container dari proses manual yang error-prone jadi deklaratif dan reproducible:

- Satu file \`docker-compose.yml\` = definisi seluruh stack
- \`depends_on\` dengan \`condition: service_healthy\` = urutan startup yang benar
- \`override\` files = konfigurasi berbeda untuk dev dan production
- Named volumes = data persisten yang dikelola Docker
- Environment variables dari \`.env\` = rahasia tidak masuk repository

> **Selanjutnya: Deploy ke server — workflow CI/CD dengan GitHub Actions dan tips production!** 🚀
`;
