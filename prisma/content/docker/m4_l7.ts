export const docker_l7 = `
# Docker Swarm & Kubernetes Intro — Skala ke Level Berikutnya

Sampai sejauh ini kita jalankan satu instance aplikasi. Tapi bagaimana kalau traffic tiba-tiba melonjak 10x? Bagaimana kalau server mati? Di sinilah **orchestration** masuk.

---

## 🤔 Masalah yang Ingin Dipecahkan

\`\`\`
Bayangkan aplikasi kamu dipakai ribuan orang:
- Traffic spike: 100 → 10.000 user tiba-tiba
- Server mati: container crash, user tidak bisa akses
- Update tanpa downtime: deploy versi baru tanpa matiin yang lama

Solusi: Jalankan BANYAK container, load balance di antara mereka,
auto-restart kalau ada yang crash, auto-scale kalau traffic naik.

Container orchestration = sistem yang melakukan semua itu otomatis.
\`\`\`

---

## 🐝 Docker Swarm — Orchestration Sederhana

\`\`\`bash
# Docker Swarm sudah built-in, tidak perlu install terpisah

# Init swarm di server utama (manager)
docker swarm init --advertise-addr IP_SERVER_KAMU

# Hasilnya akan keluar command seperti:
# docker swarm join --token SWMTKN-... IP_MANAGER:2377
# Jalankan di server worker untuk bergabung

# Cek status swarm
docker node ls

# Deploy stack (seperti docker compose tapi untuk swarm)
docker stack deploy -c docker-compose.yml nama-app

# Lihat service yang berjalan
docker service ls

# Lihat detail service
docker service ps nama-app_app

# Scale service — tambah atau kurangi replica
docker service scale nama-app_app=5    # 5 replica!

# Update service tanpa downtime (rolling update)
docker service update \\
    --image myapp:v2.0 \\
    --update-parallelism 2 \\     # Update 2 replica sekaligus
    --update-delay 10s \\         # Tunggu 10 detik antar batch
    nama-app_app

# Rollback kalau ada masalah
docker service rollback nama-app_app

# Hapus stack
docker stack rm nama-app
\`\`\`

\`\`\`yaml
# docker-compose.yml — konfigurasi untuk Swarm
version: '3.8'

services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3                    # Jalankan 3 instance
      update_config:
        parallelism: 1               # Update satu per satu
        delay: 10s
        order: start-first           # Nyalakan baru dulu, baru matikan lama
        failure_action: rollback
      restart_policy:
        condition: on-failure        # Restart kalau crash
        max_attempts: 3
      resources:
        limits:
          cpus: "0.5"                # Maksimal 50% CPU per container
          memory: 512M               # Maksimal 512MB RAM
    ports:
      - "3000:3000"
    networks: [app-net]

  db:
    image: postgres:16-alpine
    deploy:
      placement:
        constraints:
          - "node.role == manager"   # DB hanya di manager node
    volumes:
      - db_data:/var/lib/postgresql/data
    networks: [app-net]

networks:
  app-net:
    driver: overlay    # Network yang span across nodes

volumes:
  db_data:
    driver: local
\`\`\`

---

## ☸️ Kubernetes — Orchestration Skala Enterprise

\`\`\`bash
# Install kubectl (Kubernetes CLI)
# Untuk development lokal, pakai minikube atau k3s

# Install minikube (macOS/Linux)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster lokal
minikube start

# Cek status
kubectl cluster-info
kubectl get nodes
\`\`\`

\`\`\`yaml
# deployment.yaml — definisi Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3                    # 3 pod/instance
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: username/myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:          # Ambil dari Kubernetes Secret
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:             # Cek apakah container masih hidup
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:            # Cek apakah container siap terima traffic
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
# Service — expose deployment ke network
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer       # Expose ke internet
---
# HorizontalPodAutoscaler — auto scale berdasarkan CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70   # Scale up kalau CPU > 70%
\`\`\`

\`\`\`bash
# Deploy ke Kubernetes
kubectl apply -f deployment.yaml

# Lihat status
kubectl get pods
kubectl get services
kubectl get deployments

# Log dari pod
kubectl logs pod/myapp-abc123

# Masuk ke pod
kubectl exec -it pod/myapp-abc123 -- /bin/sh

# Scale manual
kubectl scale deployment myapp --replicas=5

# Rolling update
kubectl set image deployment/myapp myapp=myapp:v2.0

# Rollback
kubectl rollout undo deployment/myapp

# Hapus semua
kubectl delete -f deployment.yaml
\`\`\`

---

## 🔑 Kubernetes Secrets & ConfigMaps

\`\`\`bash
# Buat secret (data sensitif)
kubectl create secret generic app-secrets \\
    --from-literal=database-url="postgresql://user:pass@host:5432/db" \\
    --from-literal=jwt-secret="supersecretkey"

# Buat dari file .env
kubectl create secret generic app-secrets --from-env-file=.env

# ConfigMap (data tidak sensitif)
kubectl create configmap app-config \\
    --from-literal=APP_ENV=production \\
    --from-literal=LOG_LEVEL=info

# Lihat secrets/configmaps
kubectl get secrets
kubectl get configmaps

# Decode secret (base64)
kubectl get secret app-secrets -o jsonpath='{.data.jwt-secret}' | base64 --decode
\`\`\`

---

## 📊 Monitoring dengan Docker Stats & Portainer

\`\`\`bash
# Monitor resource usage real-time
docker stats
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Portainer — Web UI untuk kelola Docker
docker run -d \\
    -p 9000:9000 \\
    --name portainer \\
    --restart always \\
    -v /var/run/docker.sock:/var/run/docker.sock \\
    -v portainer_data:/data \\
    portainer/portainer-ce:latest

# Akses di: http://localhost:9000
# Portainer bisa manage:
# - Container, image, volume, network
# - Deploy stack dari file compose
# - Monitor resource usage
# - Lihat log semua container
\`\`\`

---

## 📝 Ringkasan

**Docker Swarm:**
- Built-in di Docker, tidak perlu install terpisah
- \`docker swarm init\` → init cluster
- \`docker stack deploy\` → deploy dari compose file
- \`docker service scale\` → tambah/kurangi replica
- Rolling update dengan zero downtime

**Kubernetes:**
- Lebih kompleks tapi jauh lebih powerful
- Deployment, Service, HPA untuk auto-scaling
- ConfigMap & Secret untuk konfigurasi
- Self-healing: pod yang crash otomatis di-restart

> **Selanjutnya: Docker Security & Production Hardening — amankan container sebelum ke production!** 🚀
`;
