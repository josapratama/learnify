export const docker_l3 = `
# Dockerfile Lebih Dalam — Buat Image yang Ringan dan Cepat

Di pelajaran pertama kita sudah kenalan sama Docker. Sekarang kita masuk ke Dockerfile lebih dalam. Ini penting karena image yang buruk = container yang lambat naik, boros storage, dan rentan keamanan.

Satu prinsip utama yang harus kamu pegang: **setiap baris di Dockerfile itu jadi "layer" yang bisa di-cache**. Pahami ini, dan kamu bisa bikin build yang jauh lebih cepat.

---

## 📦 Bagaimana Layer Cache Bekerja

\`\`\`dockerfile
# Bayangkan kamu punya Dockerfile ini:
FROM node:20-alpine
WORKDIR /app
COPY . .                    # ← Copy semua file
RUN npm install             # ← Install dependencies

# Masalahnya: setiap kali ada perubahan kode (apapun),
# Docker akan re-run 'npm install' karena layer di atasnya berubah!
# Padahal package.json-nya tidak berubah...
\`\`\`

\`\`\`dockerfile
# ✅ Urutan yang benar — manfaatkan cache dengan cerdas
FROM node:20-alpine
WORKDIR /app

# 1. Copy package.json DULU (jarang berubah)
COPY package*.json ./
RUN npm ci                  # Cache layer ini selama package.json tidak berubah!

# 2. Baru copy kode (sering berubah)
COPY . .
RUN npm run build

# Sekarang: kalau hanya kode yang berubah (bukan package.json),
# Docker langsung skip ke step "COPY . ." dan tidak npm ci lagi!
# Build jadi jauh lebih cepat di development sehari-hari.
\`\`\`

---

## 🏗️ Multi-Stage Build — Image Sekecil Mungkin

\`\`\`dockerfile
# Bayangkan kamu masak makanan — butuh pisau, talenan, kompor untuk masak.
# Tapi saat makan, kamu tidak bawa dapur ke meja makan.
# Multi-stage build bekerja persis seperti itu.

# ─────────── Stage 1: Builder (tempat "masak") ───────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci                          # Install SEMUA dependency (termasuk devDependencies)

COPY . .
RUN npm run build                   # Hasilkan file production

# ─────────── Stage 2: Runner (hanya bawa yang perlu ke meja) ───────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Buat user non-root — keamanan standar
RUN addgroup --system --gid 1001 appgroup
RUN adduser  --system --uid 1001 appuser

# Ambil HANYA hasil build dari stage sebelumnya
# devDependencies, source code, dsb — tidak ikut!
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

USER appuser        # Jalankan sebagai user biasa, bukan root

EXPOSE 3000
CMD ["node", "dist/index.js"]

# Hasilnya: image yang cuma berisi yang benar-benar perlu saat runtime
# Builder image:  ~800MB (ada node_modules dev, source code, dsb)
# Runner image:   ~150MB — jauh lebih kecil!
\`\`\`

---

## 🔍 ARG dan ENV — Konfigurasi yang Fleksibel

\`\`\`dockerfile
# ARG = variabel saat BUILD image (tidak tersedia saat container jalan)
# ENV = variabel lingkungan yang tersedia saat container jalan

FROM node:20-alpine

# ARG — bisa di-override saat docker build
ARG APP_VERSION=1.0.0
ARG BUILD_DATE

# Gunakan ARG untuk label (metadata image)
LABEL version="\${APP_VERSION}"
LABEL build-date="\${BUILD_DATE}"

# ENV — tersedia saat container berjalan
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

WORKDIR /app
COPY . .
RUN npm ci && npm run build

EXPOSE \${PORT}
CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
# Saat build, bisa berikan nilai ARG
docker build \
    --build-arg APP_VERSION=2.1.0 \
    --build-arg BUILD_DATE=\$(date -u +%Y-%m-%d) \
    -t myapp:2.1.0 .

# Saat run, bisa override ENV
docker run -d \
    -e PORT=8080 \
    -e LOG_LEVEL=debug \
    -p 8080:8080 \
    myapp:2.1.0
\`\`\`

---

## 🩺 HEALTHCHECK — Container yang Tahu Kondisinya Sendiri

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# HEALTHCHECK memberitahu Docker cara cek apakah container ini "sehat"
# Docker akan jalankan ini secara berkala
HEALTHCHECK \
    --interval=30s \   # Cek setiap 30 detik
    --timeout=10s  \   # Maksimal tunggu 10 detik
    --retries=3    \   # Setelah 3 kali gagal → dianggap unhealthy
    --start-period=40s \  # Kasih waktu 40 detik dulu sebelum mulai cek (startup time)
    CMD node healthcheck.js || exit 1

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

\`\`\`javascript
// healthcheck.js — script yang dicek Docker
const http = require("http");

const options = {
    host: "localhost",
    port: 3000,
    path: "/api/health",
    timeout: 5000,
};

const req = http.request(options, (res) => {
    process.exit(res.statusCode === 200 ? 0 : 1);
    //                    ✅ Sehat            ❌ Sakit
});

req.on("error", () => process.exit(1));
req.end();
\`\`\`

\`\`\`bash
# Lihat status health container
docker ps   # Kolom STATUS akan tampilkan: healthy, unhealthy, atau starting
docker inspect --format='{{.State.Health.Status}}' nama-container
\`\`\`

---

## 📋 .dockerignore yang Komprehensif

\`\`\`dockerignore
# .dockerignore — seperti .gitignore tapi untuk Docker build context
# File-file ini tidak akan dikirim ke Docker daemon saat build
# Semakin kecil build context = semakin cepat build

# Dependency folder
node_modules
.pnp
.pnp.js

# Build outputs
dist
build
.next
out
coverage

# Version control
.git
.gitignore
.gitattributes

# Editor
.vscode
.idea
*.swp
*.swo

# Environment files — JANGAN kirim secret ke image!
.env
.env.*
!.env.example    # Pengecualian: .env.example boleh masuk

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Test files
__tests__
*.test.ts
*.spec.ts
jest.config.js

# Docker files sendiri
Dockerfile*
docker-compose*

# OS generated
.DS_Store
Thumbs.db

# Documentation
README.md
docs/
\`\`\`

---

## 🏃 Praktik: Containerize Aplikasi Express.js

\`\`\`typescript
// src/index.ts — Aplikasi Express sederhana
import express from "express";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.get("/api/halo", (req, res) => {
    const nama = req.query.nama ?? "Dunia";
    res.json({ pesan: \`Halo, \${nama}! Dari dalam container 🐳\` });
});

app.listen(PORT, () => {
    console.log(\`Server jalan di port \${PORT}\`);
});
\`\`\`

\`\`\`dockerfile
# Dockerfile untuk Express.js TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build      # Output ke /app/dist

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
HEALTHCHECK --interval=30s CMD node -e "require('http').get('http://localhost:3000/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"
USER app
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

\`\`\`bash
# Build dan jalankan
docker build -t express-app:latest .
docker run -d -p 3000:3000 --name backend express-app:latest

# Test
curl http://localhost:3000/api/health
# {"status":"ok","timestamp":"...","uptime":5.2}

curl "http://localhost:3000/api/halo?nama=Budi"
# {"pesan":"Halo, Budi! Dari dalam container 🐳"}
\`\`\`

---

## 📝 Ringkasan

- Urutan instruksi Dockerfile mempengaruhi cache — copy package.json dulu sebelum kode
- Multi-stage build = image production yang jauh lebih kecil dan aman
- \`ARG\` untuk saat build, \`ENV\` untuk saat runtime
- \`HEALTHCHECK\` untuk monitoring otomatis — Docker restart container yang "sakit"
- \`.dockerignore\` penting untuk build yang cepat dan aman (jangan kirim .env!)

> **Selanjutnya: Docker Compose untuk mengelola banyak container sekaligus — database, cache, dan aplikasi dalam satu file!** 🚀
`;
