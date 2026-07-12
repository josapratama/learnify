export const docker_l6 = `
# Praktik Docker — Bangun Portfolio Project yang Siap Production

Pelajaran terakhir ini kita buat sesuatu yang nyata dan bisa langsung kamu taruh di portofolio: sebuah aplikasi full-stack yang berjalan di Docker dengan setup yang benar-benar production-ready.

Kita akan containerize aplikasi **REST API dengan Node.js + PostgreSQL + Redis**, lengkap dengan semua yang sudah kita pelajari.

---

## 🎯 Yang Akan Kita Buat

\`\`\`
Stack:
├── API Server     — Node.js + Express + TypeScript (port 3000)
├── Database       — PostgreSQL 16 (port 5432, hanya internal)
├── Cache          — Redis 7 (port 6379, hanya internal)
└── Reverse Proxy  — Nginx (port 80 ke publik)

Fitur:
✅ Multi-stage Dockerfile
✅ Docker Compose dengan healthcheck
✅ Environment variables dari .env
✅ Volume untuk data persisten
✅ Network isolation
✅ CI/CD siap dengan GitHub Actions
\`\`\`

---

## 📁 Struktur Project

\`\`\`
my-api/
├── src/
│   ├── index.ts          — Entry point
│   ├── routes/
│   │   └── produk.ts     — Route handler
│   ├── middleware/
│   │   └── cache.ts      — Redis caching middleware
│   └── lib/
│       ├── db.ts         — Koneksi PostgreSQL
│       └── redis.ts      — Koneksi Redis
├── nginx/
│   └── default.conf      — Konfigurasi Nginx
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .dockerignore
└── package.json
\`\`\`

---

## 📝 Kode Aplikasi

\`\`\`typescript
// src/lib/db.ts — Koneksi ke PostgreSQL
import { Pool } from "pg";

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,           // Maksimal 20 koneksi sekaligus
    idleTimeoutMillis: 30000,
});

// Inisialisasi tabel kalau belum ada
export async function initDB() {
    await db.query(\`
        CREATE TABLE IF NOT EXISTS produk (
            id SERIAL PRIMARY KEY,
            nama VARCHAR(100) NOT NULL,
            harga INTEGER NOT NULL,
            stok INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        )
    \`);
    console.log("✅ Database siap");
}
\`\`\`

\`\`\`typescript
// src/lib/redis.ts — Koneksi ke Redis
import { createClient } from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("✅ Redis terhubung"));

export async function initRedis() {
    await redis.connect();
}

// Helper: cache wrapper
export async function withCache<T>(
    key: string,
    ttlDetik: number,
    fn: () => Promise<T>
): Promise<T> {
    const cached = await redis.get(key);
    if (cached) {
        console.log(\`🎯 Cache hit: \${key}\`);
        return JSON.parse(cached) as T;
    }

    const data = await fn();
    await redis.setEx(key, ttlDetik, JSON.stringify(data));
    console.log(\`💾 Cache set: \${key} (TTL: \${ttlDetik}s)\`);
    return data;
}
\`\`\`

\`\`\`typescript
// src/routes/produk.ts
import { Router } from "express";
import { db } from "../lib/db";
import { withCache, redis } from "../lib/redis";

const router = Router();

// GET semua produk — di-cache 60 detik
router.get("/", async (req, res) => {
    try {
        const produk = await withCache("produk:all", 60, async () => {
            const result = await db.query(
                "SELECT * FROM produk ORDER BY created_at DESC"
            );
            return result.rows;
        });
        res.json({ data: produk, total: produk.length });
    } catch (e) {
        res.status(500).json({ error: "Gagal ambil data" });
    }
});

// POST tambah produk
router.post("/", async (req, res) => {
    const { nama, harga, stok } = req.body;

    if (!nama || !harga) {
        return res.status(400).json({ error: "nama dan harga wajib diisi" });
    }

    try {
        const result = await db.query(
            "INSERT INTO produk (nama, harga, stok) VALUES ($1, $2, $3) RETURNING *",
            [nama, harga, stok ?? 0]
        );

        // Invalidasi cache saat ada data baru
        await redis.del("produk:all");

        res.status(201).json({ data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: "Gagal tambah produk" });
    }
});

export default router;
\`\`\`

\`\`\`typescript
// src/index.ts — Entry point
import express from "express";
import produkRouter from "./routes/produk";
import { initDB } from "./lib/db";
import { initRedis } from "./lib/redis";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000");

app.use(express.json());

// Health check endpoint — dipakai Docker HEALTHCHECK
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/produk", produkRouter);

async function start() {
    await initDB();
    await initRedis();

    app.listen(PORT, () => {
        console.log(\`🚀 Server jalan di port \${PORT}\`);
    });
}

start().catch(console.error);
\`\`\`

---

## 🐳 Dockerfile

\`\`\`dockerfile
# Dockerfile

# ─── Stage 1: Build ───
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# ─── Stage 2: Production ───
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 appuser

# Copy hanya yang dibutuhkan saat runtime
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

---

## 🎼 docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  api:
    build: .
    container_name: my-api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://dbuser:dbpass@db:5432/mydb
      REDIS_URL: redis://:redispass@redis:6379
      PORT: 3000
    depends_on:
      db:    { condition: service_healthy }
      redis: { condition: service_started }
    networks: [app-net]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    container_name: my-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: dbpass
      POSTGRES_DB: mydb
    volumes: [pg_data:/var/lib/postgresql/data]
    networks: [app-net]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dbuser -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: my-redis
    restart: unless-stopped
    command: redis-server --requirepass redispass
    volumes: [redis_data:/data]
    networks: [app-net]

  nginx:
    image: nginx:alpine
    container_name: my-nginx
    restart: unless-stopped
    ports: ["80:80"]
    volumes: [./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro]
    depends_on: [api]
    networks: [app-net]

volumes:
  pg_data:
  redis_data:

networks:
  app-net:
    driver: bridge
\`\`\`

---

## 🧪 Test Aplikasi

\`\`\`bash
# Jalankan semua service
docker compose up -d --build

# Cek status
docker compose ps

# Test health check
curl http://localhost/health
# {"status":"ok","uptime":5.2,...}

# Tambah produk
curl -X POST http://localhost/api/produk \
    -H "Content-Type: application/json" \
    -d '{"nama":"Laptop ASUS","harga":8500000,"stok":10}'

# Ambil semua produk (request 1 — dari DB)
curl http://localhost/api/produk
# 💾 Cache set: produk:all (TTL: 60s) — terlihat di log

# Ambil lagi (request 2 — dari cache, lebih cepat!)
curl http://localhost/api/produk
# 🎯 Cache hit: produk:all — terlihat di log

# Lihat log real-time
docker compose logs -f api
\`\`\`

---

## 📝 Ringkasan Kursus Docker Lengkap

Kamu sudah belajar Docker dari nol sampai production:

**Yang sudah dikuasai:**
- Konsep container, image, registry
- Perintah Docker sehari-hari
- Menulis Dockerfile yang efisien (multi-stage, cache layer)
- Docker Compose untuk multi-service stack
- Deploy ke VPS dengan GitHub Actions CI/CD
- Security best practices (non-root, secret management)
- Monitoring dan healthcheck

**Docker adalah skill yang dicari hampir di setiap lowongan DevOps dan Backend Developer.** Kamu sudah punya fondasinya — teruslah berlatih dengan project nyata!

> **Selamat menyelesaikan kursus Docker! 🎉 Langkah selanjutnya: coba Kubernetes untuk orchestrasi skala besar!** 🚀
`;
