export const docker_l1 = `
# Apa itu Docker? — Solusi untuk "Works on My Machine!"

Pernah nggak ngalamin situasi kayak gini: kamu bikin aplikasi di laptop, jalan lancar, terus kirim ke teman atau upload ke server — eh, error. Kamu debug lama, ternyata masalahnya cuma versi Node.js yang beda, atau library yang versinya tidak sama.

Ini masalah klasik yang punya nama sendiri di komunitas developer: **"Works on my machine!"** — dan itu salah satu hal yang paling bikin frustrasi.

Docker lahir untuk menyelesaikan masalah ini.

## 📦 Analogi: Docker Seperti Peti Kemas di Kapal

Dulu sebelum ada peti kemas, pengiriman barang lewat laut itu kacau — setiap barang butuh penanganan berbeda, bongkar muat lama, sering rusak di jalan.

Peti kemas mengubah segalanya: apapun isinya, semua masuk kotak standar. Kapal tidak perlu tahu isinya apa. Crane mengangkat dengan cara yang sama. Di tujuan, langsung naik truk.

Docker melakukan hal yang persis sama untuk software: **bungkus aplikasi kamu beserta semua yang dibutuhkannya dalam satu "kontainer" yang bisa jalan di mana saja** — laptop kamu, laptop teman, server AWS, server manapun — dan hasilnya selalu sama.

\`\`\`
Tanpa Docker:
Developer A → Node.js 18, PostgreSQL 14, Redis 7
Developer B → Node.js 20, PostgreSQL 15, Redis 6
Server      → Node.js 16, PostgreSQL 13...

Satu tim, tiga environment berbeda → bug yang aneh-aneh 😱

Dengan Docker:
Semua orang jalankan kontainer yang SAMA
= Environment identik di mana saja ✅
\`\`\`

---

## 🏗️ Tiga Konsep yang Harus Kamu Pahami

Sebelum kita install, paham dulu tiga istilah ini karena bakal sering muncul:

**Image** = Resep atau cetak biru. Berisi instruksi: pakai OS ini, install ini, copy file ini, jalankan dengan perintah ini. Image tidak berjalan sendiri, dia cuma template.

**Container** = Instansi yang berjalan dari image. Kalau image itu resep, container itu makanannya. Dari satu image, kamu bisa bikin 10 container yang berjalan bersamaan.

**Registry** = Tempat nyimpan dan berbagi image. Docker Hub adalah registry publik yang paling populer — ribuan image gratis tersedia di sana.

\`\`\`
┌─────────────────────────────────────────────┐
│              Host OS (Linux/Win/Mac)        │
├─────────────────────────────────────────────┤
│                Docker Engine                │
├──────────────┬──────────────┬───────────────┤
│  Container A │  Container B │  Container C  │
│  (Next.js)   │  (PostgreSQL)│   (Nginx)     │
│  App + Deps  │  DB + Config │  Web Server   │
└──────────────┴──────────────┴───────────────┘

Semua container terisolasi tapi bisa saling komunikasi
\`\`\`

---

## 🛠️ Instalasi Docker

### Windows & Mac
Download **Docker Desktop** dari [docker.com](https://docker.com), install, dan jalankan. Sudah include Docker Engine plus GUI yang cukup nyaman.

### Ubuntu/Debian
\`\`\`bash
# Install Docker Engine
sudo apt update
sudo apt install docker.io

# Ini penting: tambahkan user kamu ke grup docker
# supaya tidak perlu sudo setiap kali pakai docker
sudo usermod -aG docker $USER
newgrp docker

# Verifikasi instalasi
docker --version

# Test dengan container hello-world
docker run hello-world
# Kalau muncul teks "Hello from Docker!" — instalasi berhasil!
\`\`\`

---

## 🎯 Perintah Docker yang Sering Dipakai

Ini yang paling sering kamu gunakan sehari-hari:

\`\`\`bash
# === KELOLA IMAGE ===
# Pull image dari Docker Hub (seperti npm install, tapi buat OS/apps)
docker pull nginx
docker pull postgres:16          # dengan versi spesifik
docker pull node:20-alpine       # alpine = versi kecil/ringan

# Lihat image yang sudah di-download
docker images

# Hapus image (kalau sudah tidak dipakai)
docker rmi nginx
docker rmi $(docker images -q)   # Hapus semua image

# === KELOLA CONTAINER ===
# Jalankan container dari image
docker run nginx                          # Foreground (terminal tertahan)
docker run -d nginx                       # Background (-d = detached)
docker run -d -p 8080:80 nginx            # Map port: host:container
docker run -d --name webserver nginx      # Kasih nama yang gampang diingat

# Contoh database PostgreSQL:
docker run -d \
    --name db \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=rahasia \
    -e POSTGRES_DB=myapp \
    -p 5432:5432 \
    postgres:16
# -e = environment variable (konfigurasi lewat variabel)

# Lihat container yang sedang berjalan
docker ps
docker ps -a    # Termasuk yang sudah berhenti

# Stop, Start, Restart
docker stop webserver
docker start webserver
docker restart webserver

# Hapus container
docker rm webserver          # Container harus sudah berhenti
docker rm -f webserver       # Paksa hapus meski masih jalan

# Lihat logs — ini penting banget buat debugging!
docker logs webserver
docker logs -f webserver     # -f = follow, update real-time

# Masuk ke dalam container (seperti SSH ke server)
docker exec -it webserver bash
docker exec -it db psql -U admin -d myapp
\`\`\`

---

## 📝 Dockerfile — Bikin Image Kamu Sendiri

Kalau kamu mau containerize aplikasi buatan sendiri, kamu perlu Dockerfile. Ini file berisi instruksi "cara buat image".

\`\`\`dockerfile
# Dockerfile untuk aplikasi Next.js
# Multi-stage build: bikin image sekecil mungkin untuk production

# Stage 1: Base — tentukan base image
FROM node:20-alpine AS base

# Stage 2: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production   # ci = clean install, lebih strict dari install

# Stage 3: Build aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 4: Production image — cuma ambil yang perlu
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Buat user non-root — praktik keamanan standar
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs    # Jalankan sebagai user biasa, bukan root

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
# Build image dari Dockerfile
docker build -t myapp:latest .
docker build -t myapp:v1.0 .

# Jalankan image yang baru dibuat
docker run -d -p 3000:3000 myapp:latest

# Push ke Docker Hub (supaya bisa dipakai di server lain)
docker login
docker tag myapp:latest username/myapp:latest
docker push username/myapp:latest
\`\`\`

---

## 🔧 Docker Compose — Kelola Banyak Container Sekaligus

Aplikasi nyata biasanya butuh beberapa komponen: web server, database, cache. Docker Compose bikin kamu bisa define dan jalankan semuanya dengan satu file dan satu perintah.

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  # Aplikasi Next.js
  app:
    build: .                           # Build dari Dockerfile di folder ini
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://admin:rahasia@db:5432/myapp
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy     # Tunggu sampai DB benar-benar siap
    restart: unless-stopped

  # Database PostgreSQL
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: rahasia
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data   # Data tetap ada walau container restart
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis untuk caching/session
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx sebagai reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:    # Named volume — Docker kelola lokasinya
  redis_data:
\`\`\`

\`\`\`bash
# Jalankan semua service sekaligus
docker compose up -d

# Lihat status semua service
docker compose ps

# Lihat logs semuanya (atau service tertentu)
docker compose logs -f
docker compose logs -f app

# Hentikan semua
docker compose down

# Hentikan dan hapus data (hati-hati! data hilang)
docker compose down -v

# Rebuild image dan restart
docker compose up -d --build
\`\`\`

---

## 💾 Volume — Supaya Data Tidak Hilang

Ini yang sering bikin orang kaget: **kalau container dihapus, semua data di dalamnya ikut hilang**. Database kamu, upload file, semuanya. Makanya kita pakai volume untuk menyimpan data di luar container.

\`\`\`bash
# Named volume (Docker yang kelola lokasinya — rekomendasi untuk database)
docker run -d \
    -v postgres_data:/var/lib/postgresql/data \
    postgres:16

# Bind mount (mapping langsung ke folder di host)
docker run -d \
    -v /home/budi/data:/data \
    myapp

# Read-only mount (container bisa baca tapi tidak bisa ubah)
docker run -d \
    -v /etc/config:/config:ro \
    myapp

# Lihat semua volume
docker volume ls

# Hapus volume yang tidak terpakai
docker volume prune
\`\`\`

---

## 📝 Ringkasan

Docker menyelesaikan masalah "works on my machine" dengan membungkus aplikasi dan semua dependensinya dalam container yang konsisten di mana saja dijalankan.

- **Image** = template read-only, **Container** = instansi yang berjalan
- **Dockerfile** = instruksi untuk bikin image kustom
- **Docker Compose** = orchestrate banyak container dengan satu file
- **Volume** = data persisten yang tidak ikut hilang saat container dihapus

Kalau kamu developer web, Docker ini bakal jadi teman sehari-hari — terutama untuk lokal development dan deployment ke server.

> **Di pelajaran berikutnya, Docker network, tips production, dan CI/CD dengan Docker — supaya aplikasi kamu bisa deploy otomatis!** 🚀
`;
