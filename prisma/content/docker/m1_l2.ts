export const docker_l2 = `
# Docker Lanjutan — Network, Production & CI/CD

## 🌐 Docker Network

\`\`\`bash
# Container di network yang sama bisa saling berkomunikasi by name
docker network create app-network

docker run -d \
    --name db \
    --network app-network \
    postgres:16

docker run -d \
    --name app \
    --network app-network \
    -e DATABASE_URL=postgresql://admin:pass@db:5432/mydb \  # "db" = nama container!
    myapp

# Lihat network
docker network ls
docker network inspect app-network

# Di Docker Compose, network otomatis dibuat
# Container bisa akses satu sama lain via nama service
\`\`\`

---

## 🔍 .dockerignore

Seperti .gitignore, mencegah file tidak perlu masuk image:

\`\`\`
# .dockerignore
node_modules
.next
.git
*.md
.env
.env.local
npm-debug.log
Dockerfile*
docker-compose*
\`\`\`

---

## 📊 Best Practices Production

\`\`\`dockerfile
# ✅ Gunakan tag versi spesifik, bukan "latest"
FROM node:20.11.0-alpine3.19

# ✅ Set WORKDIR
WORKDIR /app

# ✅ Copy package.json DULU (manfaatkan layer cache)
COPY package*.json ./
RUN npm ci --only=production

# ✅ Baru copy kode
COPY . .

# ✅ Gunakan user non-root
RUN addgroup -S app && adduser -S app -G app
USER app

# ✅ Set health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q -O - http://localhost:3000/api/health || exit 1

# ✅ Expose port (dokumentasi)
EXPOSE 3000

CMD ["node", "server.js"]
\`\`\`

---

## 🔄 CI/CD dengan Docker & GitHub Actions

\`\`\`yaml
# .github/workflows/deploy.yml
name: Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login ke Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      - name: Build & Push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            username/myapp:latest
            username/myapp:\${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy ke server
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: deploy
          key: \${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f
\`\`\`

---

## 🛠️ Perintah Berguna Sehari-hari

\`\`\`bash
# Statistik resource container
docker stats
docker stats --no-stream  # Snapshot sekali

# Inspect container (info detail)
docker inspect nama-container

# Hapus semua container stopped
docker container prune

# Hapus semua image yang tidak dipakai
docker image prune -a

# Bersihkan semua (container, image, network, volume tidak terpakai)
docker system prune -a --volumes

# Copy file ke/dari container
docker cp file.txt container:/app/
docker cp container:/app/file.txt .

# Lihat filesystem container
docker diff container-name

# Commit container menjadi image (jarang dipakai, lebih baik Dockerfile)
docker commit container-name nama-image:tag
\`\`\`

---

## 📝 Ringkasan Kursus Docker

| Modul | Topik |
|-------|-------|
| 1 | Konsep, instalasi, perintah dasar, Dockerfile |
| 2 | Network, best practices, CI/CD |

**Langkah selanjutnya:**
- Kubernetes — orchestrasi container skala besar
- Docker Swarm — clustering sederhana
- Podman — alternatif Docker tanpa daemon

> **Docker adalah skill wajib untuk setiap developer modern. Kontainerisasi aplikasi Anda sekarang!** 🐳
`;
