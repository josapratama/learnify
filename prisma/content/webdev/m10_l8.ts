export const web_l8 = `
# Deployment ke Vercel & Optimasi Production

Selama ini kamu membangun aplikasi di localhost:3000 — hanya bisa dilihat sendiri. **Deployment** adalah langkah untuk membuat aplikasimu bisa diakses siapapun, dari mana saja, 24/7.

Vercel adalah platform deployment yang dibuat oleh tim yang sama dengan Next.js. Mereka paling mengerti cara optimal menjalankannya — dan gratis untuk proyek kecil.

---

## 🌐 Kenapa Vercel?

| Fitur | Vercel | Alternatif |
|-------|--------|-----------|
| Deploy dari GitHub | ✅ Otomatis | Manual |
| Preview untuk setiap PR | ✅ | Jarang |
| Edge Network global | ✅ 100+ kota | Tergantung plan |
| Gratis untuk proyek kecil | ✅ | Umumnya berbayar |

---

## 🔧 Persiapan Sebelum Deploy

### Environment Variables

\`\`\`bash
# .env.local — JANGAN commit ke Git!
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="string-acak-sangat-panjang-minimal-32-karakter"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
NEXT_PUBLIC_BASE_URL="https://domain-anda.vercel.app"
\`\`\`

**Aturan penting:**
- Variabel tanpa \`NEXT_PUBLIC_\` → server only (aman untuk secrets)
- Variabel dengan \`NEXT_PUBLIC_\` → terekspos ke browser! Jangan taruh secret di sini

---

## 🐘 Database Production: PostgreSQL

Anda butuh database yang bisa diakses Vercel. Beberapa opsi:

| Provider | Free Tier | Rekomendasi |
|----------|-----------|-------------|
| **Neon** | 0.5 GB | ✅ Terbaik untuk Vercel |
| **Supabase** | 500 MB | ✅ Populer, banyak fitur |
| **Railway** | $5 credit | ✅ Mudah setup |
| **PlanetScale** | Limited | MySQL only |

\`\`\`bash
# Setup database Neon (gratis!)
# 1. Daftar di neon.tech
# 2. Buat project baru
# 3. Copy connection string
# DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Jalankan migrasi ke production database
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Atau seed data awal
DATABASE_URL="postgresql://..." node prisma/seed.js
\`\`\`

---

## ⚡ Deploy ke Vercel

### Langkah 1: Push ke GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit: LMS application"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
\`\`\`

### Langkah 2: Import di Vercel

1. Buka **vercel.com** → Login dengan GitHub
2. Klik **"Add New Project"**
3. Pilih repository Anda
4. Vercel auto-detect Next.js — klik **Deploy**

### Langkah 3: Set Environment Variables

Di Vercel Dashboard → Project → Settings → Environment Variables:

\`\`\`
DATABASE_URL          = postgresql://...
JWT_SECRET            = your-super-secret-key
MIDTRANS_SERVER_KEY   = SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY   = SB-Mid-client-xxx
NEXT_PUBLIC_BASE_URL  = https://nama-project.vercel.app
\`\`\`

### Langkah 4: Redeploy

Setelah set env variables, trigger redeploy:
- Vercel Dashboard → Project → Deployments → tiga titik → Redeploy

---

## ⚡ Optimasi Performance

### 1. Image Optimization

\`\`\`tsx
// ❌ Jangan pakai <img> biasa
<img src="/thumbnail.jpg" alt="Course" width={400} height={225} />

// ✅ Pakai next/image — kompresi otomatis, lazy loading, WebP
import Image from "next/image";

<Image
  src    = "/thumbnail.jpg"
  alt    = "Course thumbnail"
  width  = {400}
  height = {225}
  className = "rounded-lg object-cover"
  priority  = {false}  // true untuk image di above-the-fold
  placeholder = "blur"  // Blur saat loading
  blurDataURL = "data:image/jpeg;base64,..."  // Opsional
/>

// Untuk image dari URL eksternal, tambahkan di next.config.ts:
// images: { remotePatterns: [{ hostname: "cdn.domain.com" }] }
\`\`\`

### 2. Font Optimization

\`\`\`tsx
// src/app/layout.tsx — Font dimuat dengan optimal
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets : ["latin"],
  variable: "--font-inter",
  display : "swap",  // Hindari invisible text saat loading
});

const jakarta = Plus_Jakarta_Sans({
  subsets : ["latin"],
  variable: "--font-jakarta",
  weight  : ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={\`\${inter.variable} \${jakarta.variable}\`}>
      ...
    </html>
  );
}
\`\`\`

### 3. Data Caching

\`\`\`typescript
// Fetch dengan cache control
const data = await fetch("https://api.example.com/courses", {
  next: {
    revalidate: 3600,     // Cache selama 1 jam, lalu refetch
    tags       : ["courses"], // Bisa invalidasi manual
  }
});

// Static data (tidak pernah berubah)
const data = await fetch("https://api.com/categories", {
  cache: "force-cache"   // Cache selamanya sampai redeploy
});

// Data real-time (tidak perlu cache)
const data = await fetch("https://api.com/live-price", {
  cache: "no-store"
});

// Di Server Component yang fetch dari Prisma langsung:
import { unstable_cache } from "next/cache";

const ambilKursusPopuler = unstable_cache(
  async () => {
    return prisma.course.findMany({
      where  : { isPublished: true },
      orderBy: { enrollments: { _count: "desc" } },
      take   : 6,
    });
  },
  ["kursus-populer"],           // Cache key
  { revalidate: 3600, tags: ["courses"] }  // Opsi
);
\`\`\`

### 4. Bundle Analysis

\`\`\`bash
# Install analyzer
npm install -D @next/bundle-analyzer

# next.config.ts
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer({ /* config biasa */ });

# Jalankan analisis
ANALYZE=true npm run build
# Browser akan terbuka dengan visualisasi bundle
\`\`\`

---

## 🔒 Security Checklist Production

\`\`\`typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control",   value: "on" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "X-Frame-Options",           value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "Referrer-Policy",           value: "origin-when-cross-origin" },
          {
            key  : "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.midtrans.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.midtrans.com",
            ].join("; ")
          },
        ],
      },
    ];
  },

  // Redirect HTTP ke HTTPS (Vercel sudah handle ini)
  // Rate limiting via middleware atau Vercel Pro
};

export default nextConfig;
\`\`\`

---

## 📊 Monitoring Production

\`\`\`typescript
// src/lib/logger.ts — Logging sederhana
const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info: (msg: string, data?: object) => {
    if (isDev) console.log(\`[INFO] \${msg}\`, data ?? "");
  },
  warn: (msg: string, data?: object) => {
    console.warn(\`[WARN] \${msg}\`, data ?? "");
  },
  error: (msg: string, error?: unknown) => {
    console.error(\`[ERROR] \${msg}\`, error ?? "");
    // Di production: kirim ke Sentry/Datadog
    // Sentry.captureException(error);
  },
};
\`\`\`

---

## 🔄 CI/CD Otomatis

Setelah setup, workflow Anda menjadi:

\`\`\`
Developer push ke GitHub
         ↓
Vercel auto-build & deploy (2-3 menit)
         ↓
Preview URL tersedia (untuk setiap branch/PR)
         ↓
Merge ke main → Deploy ke production otomatis
\`\`\`

---

## 📝 Production Checklist Final

- [ ] Environment variables sudah set di Vercel
- [ ] Database production sudah running & migrasi sudah dijalankan
- [ ] \`next/image\` untuk semua gambar
- [ ] \`next/font\` untuk semua font
- [ ] Security headers sudah ditambahkan
- [ ] Error pages (404, 500) sudah dibuat
- [ ] Webhook Midtrans pointing ke URL production
- [ ] Test payment di Sandbox sebelum production
- [ ] Domain custom sudah diset (opsional)
- [ ] Monitoring (Vercel Analytics) sudah aktif

---

## 🏆 Selamat! Anda Telah Membangun LMS Lengkap!

Lihat apa yang telah Anda kerjakan:

- ✅ **Frontend**: Next.js 15 App Router + Server/Client Components
- ✅ **Styling**: Tailwind CSS v4 yang responsif & dark mode
- ✅ **Database**: PostgreSQL dengan Prisma ORM
- ✅ **Auth**: JWT manual dengan httpOnly cookie
- ✅ **Form**: Server Actions yang type-safe
- ✅ **Payment**: Midtrans dengan webhook verification
- ✅ **Deploy**: Vercel dengan CI/CD otomatis

**Ini bukan sekedar belajar — ini adalah aplikasi production-ready yang bisa langsung Anda monetisasi!**

> **Langkah selanjutnya: Deploy, share ke komunitas, dan mulai bangun portfolio Anda!** 🌟
`;
