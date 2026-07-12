export const docker_l8 = `
# Docker Security & Production Hardening — Container yang Aman

Bisa deploy itu bagus. Tapi deploy dengan aman itu yang membedakan professional dari pemula. Di pelajaran terakhir ini kita bahas cara bikin container yang benar-benar production-ready dari sisi keamanan.

---

## 🔒 Prinsip Keamanan Container

\`\`\`
1. Principle of Least Privilege — hanya berikan akses yang diperlukan
2. Immutable Infrastructure    — container tidak berubah setelah deploy
3. Minimal Attack Surface      — image sekecil mungkin, package seminimal mungkin
4. Defense in Depth            — lapisan keamanan berlapis
\`\`\`

---

## 🛡️ Dockerfile Security Best Practices

\`\`\`dockerfile
# ❌ BURUK — terlalu banyak masalah keamanan
FROM ubuntu:latest              # latest tidak predictable
RUN apt install -y nodejs npm   # Ubuntu punya banyak yang tidak perlu
COPY . .
RUN npm install
CMD node app.js                 # Jalan sebagai root!

# ✅ BAIK — security-hardened
# 1. Gunakan base image yang minimal
FROM node:20-alpine AS base
# Alpine = ~5MB, Ubuntu = ~70MB. Lebih kecil = lebih sedikit vulnerability

# 2. Pin versi tag — tidak ada kejutan
FROM node:20.11.0-alpine3.19

# 3. Jalan sebagai non-root user
RUN addgroup --system --gid 1001 nodejs && \\
    adduser  --system --uid 1001 --ingroup nodejs nodeuser

# 4. Set WORKDIR yang jelas
WORKDIR /app

# 5. Copy package.json terpisah untuk cache layer
COPY --chown=nodeuser:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 6. Copy kode, ubah ownership
COPY --chown=nodeuser:nodejs . .

# 7. Hapus file yang tidak perlu
RUN rm -rf .git .env* *.md tests/

# 8. Read-only filesystem untuk root
# (set saat docker run: --read-only --tmpfs /tmp)

# 9. Gunakan user non-root
USER nodeuser

# 10. Expose port non-privileged (> 1024)
EXPOSE 3000

# 11. Gunakan ENTRYPOINT + CMD untuk signal handling yang benar
ENTRYPOINT ["node"]
CMD ["server.js"]
\`\`\`

---

## 🔍 Image Scanning — Cari Vulnerability

\`\`\`bash
# Trivy — scanner vulnerability gratis dan powerful
# Install:
brew install aquasecurity/trivy/trivy    # macOS
sudo apt install trivy                    # Ubuntu

# Scan image
trivy image myapp:latest

# Scan dengan severity filter
trivy image --severity HIGH,CRITICAL myapp:latest

# Scan Dockerfile sebelum build
trivy config ./Dockerfile

# Scan semua file konfigurasi
trivy config .

# Output JSON untuk CI/CD
trivy image --format json --output results.json myapp:latest

# Docker Scout (built-in Docker Desktop)
docker scout cves myapp:latest
docker scout recommendations myapp:latest
\`\`\`

---

## 🌐 Network Security

\`\`\`bash
# Hindari expose port yang tidak perlu
# ❌ Jangan expose database ke publik
docker run -p 5432:5432 postgres   # Database exposed ke internet!

# ✅ Database hanya dalam internal network
docker network create --driver bridge internal-net

docker run -d \\
    --name db \\
    --network internal-net \\
    # TIDAK ada -p! Hanya accessible dari internal-net
    postgres:16

docker run -d \\
    --name app \\
    --network internal-net \\
    -p 3000:3000 \\           # Hanya app yang exposed
    myapp:latest

# ─────────────────────────────────────

# docker-compose.yml — network yang terpisah
services:
  app:
    networks: [frontend, backend]   # App bisa akses keduanya
  db:
    networks: [backend]             # DB hanya di backend, tidak ke internet
  nginx:
    networks: [frontend]            # Nginx hanya terima dari internet
    ports: ["80:80", "443:443"]

networks:
  frontend:    # Network untuk traffic dari internet
  backend:     # Network internal (DB, cache, dll.)
    internal: true  # Tidak bisa akses internet!
\`\`\`

---

## 🔐 Secret Management

\`\`\`bash
# ❌ JANGAN — secret di environment variable yang visible
docker run -e DB_PASSWORD=rahasia myapp

# ❌ JANGAN — secret di Dockerfile atau image
ENV DB_PASSWORD=rahasia    # Tersimpan di layer image!

# ✅ Docker Secrets (untuk Swarm)
echo "passwordrahasia" | docker secret create db_password -

# Gunakan di stack
services:
  app:
    secrets:
      - db_password
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
      # Baca dari file, bukan env var

secrets:
  db_password:
    external: true   # Sudah dibuat sebelumnya

# ✅ Di container, baca secret dari file
const fs = require("fs");
const dbPassword = fs.readFileSync("/run/secrets/db_password", "utf-8").trim();

# ✅ Untuk non-Swarm: pakai .env file yang tidak di-commit
# .env
DB_PASSWORD=passwordrahasia

# .gitignore
.env

# docker-compose.yml
env_file: .env    # Load dari file, tidak hardcode
\`\`\`

---

## 📋 Docker Bench Security

\`\`\`bash
# Docker Bench for Security — cek konfigurasi keamanan secara otomatis
docker run -it --net host --pid host --userns host --cap-add audit_control \\
    -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \\
    -v /etc:/etc:ro \\
    -v /lib/systemd/system:/lib/systemd/system:ro \\
    -v /usr/bin/containerd:/usr/bin/containerd:ro \\
    -v /usr/bin/runc:/usr/bin/runc:ro \\
    -v /usr/lib/systemd:/usr/lib/systemd:ro \\
    -v /var/lib:/var/lib:ro \\
    -v /var/run/docker.sock:/var/run/docker.sock:ro \\
    --label docker_bench_security \\
    docker/docker-bench-security

# Akan cek:
# - Docker daemon configuration
# - Docker swarm configuration
# - Container runtime default
# - Docker security operations
\`\`\`

---

## 🔄 Production Deployment Checklist

\`\`\`bash
# ════ SEBELUM DEPLOY ════
# □ Scan image untuk vulnerability
trivy image myapp:latest --severity HIGH,CRITICAL

# □ Pastikan non-root user
docker inspect myapp:latest | grep -i user

# □ Pastikan tidak ada secret di image
docker history myapp:latest

# □ Resource limits terpasang
docker run --memory="512m" --cpus="0.5" myapp

# □ Health check berfungsi
docker run --health-cmd="curl -f http://localhost:3000/health" myapp

# ════ SAAT DEPLOY ════
# □ Gunakan --read-only kalau memungkinkan
docker run --read-only --tmpfs /tmp myapp

# □ Drop semua capabilities, add hanya yang perlu
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE myapp

# □ Disable privilege escalation
docker run --security-opt no-new-privileges myapp

# □ Set user ID eksplisit
docker run --user 1001:1001 myapp

# ════ SETELAH DEPLOY ════
# □ Monitor resource usage
docker stats --no-stream

# □ Cek log untuk anomali
docker logs --tail 100 container-name | grep -i "error\|warn\|fail"

# □ Backup data penting
docker run --rm -v postgres_data:/data -v $(pwd):/backup \\
    alpine tar czf /backup/db-backup-$(date +%Y%m%d).tar.gz /data
\`\`\`

---

## 🎯 Security-Hardened docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  app:
    image: myapp:1.2.3          # Pin versi spesifik!
    restart: unless-stopped
    user: "1001:1001"           # Non-root user
    read_only: true             # Filesystem read-only
    tmpfs:
      - /tmp:size=100m          # Tmp writeable tapi terbatas
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks: [backend]
    environment:
      NODE_ENV: production
    env_file: .env              # Secret dari file terpisah
    ports: []                   # Tidak expose langsung, lewat nginx

  nginx:
    image: nginx:1.25.3-alpine
    user: "101:101"
    read_only: true
    tmpfs:
      - /var/cache/nginx:size=50m
      - /var/run:size=10m
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks: [backend, frontend]
    depends_on: [app]

networks:
  frontend:
  backend:
    internal: true
\`\`\`

---

## 📝 Ringkasan Kursus Docker Lengkap

| Modul | Topik |
|-------|-------|
| 1 | Konsep, instalasi, perintah dasar, Dockerfile |
| 2 | Docker network, best practices dasar |
| 3 | Dockerfile lanjutan (layer cache, multi-stage, ARG/ENV, healthcheck) |
| 4 | Docker Compose — multi-service stack |
| 5 | Deploy ke production, CI/CD dengan GitHub Actions |
| 6 | Portfolio project: full-stack API dengan Docker |
| 7 | Docker Swarm & Kubernetes introduction |
| 8 | Security hardening & production checklist |

**Kamu sekarang bisa:**
- Containerize semua jenis aplikasi dengan efisien
- Setup stack multi-service dengan Docker Compose
- Deploy ke production dengan CI/CD otomatis
- Scale aplikasi horizontal dengan Swarm
- Amankan container untuk production

> **Selamat menyelesaikan kursus Docker! Container skill ini sangat dicari di semua perusahaan tech!** 🐳🎉
`;
