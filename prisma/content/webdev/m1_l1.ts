export const web_l1 = `
# Arsitektur Next.js 15 — App Router

Next.js 15 menggunakan sistem routing yang unik: **routing berbasis struktur folder**. Tidak perlu konfigurasi routing secara manual — cukup buat folder dan file yang tepat, routenya otomatis terbentuk.

Ini disebut **App Router**, dan memahaminya adalah kunci untuk bekerja efektif dengan Next.js.

---

## 📂 Routing Berbasis File

\`\`\`
src/app/
├── layout.tsx           → Layout utama (Navbar, Footer) untuk semua halaman
├── page.tsx             → Halaman: yourdomain.com/
├── about/
│   └── page.tsx         → Halaman: yourdomain.com/about
├── courses/
│   ├── page.tsx         → Halaman: yourdomain.com/courses
│   └── [slug]/          → Dynamic route: yourdomain.com/courses/belajar-python
│       ├── page.tsx
│       └── loading.tsx
└── api/
    └── users/
        └── route.ts     → API endpoint: yourdomain.com/api/users
\`\`\`

> 💡 File bernama \`page.tsx\` = halaman yang bisa diakses user. File lain (\`layout\`, \`loading\`, \`error\`) punya fungsi khusus masing-masing.

---

## ⭐ File-file Spesial di App Router

### \`layout.tsx\` — Kerangka Persisten

\`\`\`tsx
// src/app/layout.tsx
// Layout ini dipakai SEMUA halaman — cocok untuk Navbar, Footer

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>  {/* Konten halaman masuk di sini */}
        <Footer />
      </body>
    </html>
  );
}
\`\`\`

Analogi: Layout seperti **bingkai foto** — bingkainya tetap, fotonya (konten) yang berganti.

### \`page.tsx\` — Konten Halaman

\`\`\`tsx
// src/app/courses/page.tsx
// Diakses via: yourdomain.com/courses

export default function HalamanKursus() {
  return (
    <div>
      <h1>Semua Kursus</h1>
      {/* Daftar kursus */}
    </div>
  );
}
\`\`\`

### \`loading.tsx\` — Skeleton Otomatis

\`\`\`tsx
// src/app/courses/loading.tsx
// Tampil otomatis SAAT halaman sedang loading data

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
    </div>
  );
}
\`\`\`

### \`error.tsx\` — Tangkap Error Otomatis

\`\`\`tsx
// src/app/courses/error.tsx
"use client";  // Wajib: error boundary harus Client Component

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void
}) {
  return (
    <div className="text-center py-10">
      <h2>Oops! Terjadi kesalahan</h2>
      <p className="text-gray-500">{error.message}</p>
      <button onClick={reset} className="mt-4 btn-primary">
        Coba Lagi
      </button>
    </div>
  );
}
\`\`\`

### \`not-found.tsx\` — Halaman 404

\`\`\`tsx
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl mt-4">Halaman tidak ditemukan</p>
    </div>
  );
}
\`\`\`

---

## 🔀 Dynamic Routes — URL Dinamis

\`\`\`tsx
// src/app/courses/[slug]/page.tsx
// Menangkap URL seperti: /courses/belajar-python, /courses/web-dev

// Props berisi params dari URL
export default async function HalamanKursusDetail({
  params
}: {
  params: { slug: string }
}) {
  // params.slug = "belajar-python" atau apapun yang ada di URL
  const kursus = await ambilKursus(params.slug);
  
  if (!kursus) {
    notFound();  // Tampilkan halaman 404
  }
  
  return (
    <div>
      <h1>{kursus.judul}</h1>
      <p>{kursus.deskripsi}</p>
    </div>
  );
}
\`\`\`

### Catch-all Routes

\`\`\`
[slug]        → /courses/python
[...slug]     → /courses/python/modul-1/pelajaran-2 (multi-segment)
[[...slug]]   → /courses atau /courses/python (opsional)
\`\`\`

---

## 🌊 Streaming — Kirim Halaman Sebagian demi Sebagian

Next.js 15 mendukung **Streaming** — mengirim bagian halaman ke browser saat sudah siap, tanpa menunggu semua selesai.

\`\`\`tsx
import { Suspense } from "react";
import { DaftarKursus } from "@/components/DaftarKursus";
import { StatistikUser } from "@/components/StatistikUser";

export default function Dashboard() {
  return (
    <div>
      {/* Langsung tampil, tidak perlu tunggu */}
      <h1>Dashboard Saya</h1>
      
      {/* Statistik mungkin lambat — tampil Skeleton dulu */}
      <Suspense fallback={<SkeletonStatistik />}>
        <StatistikUser />   {/* Load async di belakang */}
      </Suspense>
      
      {/* Daftar kursus juga async */}
      <Suspense fallback={<SkeletonDaftar />}>
        <DaftarKursus />
      </Suspense>
    </div>
  );
}
\`\`\`

Analogi: Seperti restoran yang menyajikan makanan hidangan per hidangan saat siap, bukan menunggu semua menu tersedia sekaligus.

---

## 📊 Metadata — SEO Otomatis

\`\`\`tsx
// src/app/courses/[slug]/page.tsx
import type { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title       : "Daftar Kursus",
  description : "Temukan ratusan kursus berkualitas",
};

// Dynamic metadata (berdasarkan konten)
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const kursus = await ambilKursus(params.slug);
  
  return {
    title       : kursus.judul,
    description : kursus.deskripsi,
    openGraph   : {
      title    : kursus.judul,
      images   : [kursus.thumbnail],
    },
  };
}
\`\`\`

---

## 📝 Ringkasan

- App Router = routing berbasis struktur folder (\`src/app/\`)
- File \`page.tsx\` = halaman yang bisa diakses, \`layout.tsx\` = kerangka persisten
- \`loading.tsx\`, \`error.tsx\`, \`not-found.tsx\` menangani state khusus secara otomatis
- \`[slug]\` untuk dynamic routes, \`[...slug]\` untuk catch-all
- Streaming dengan \`Suspense\` untuk UX yang lebih baik
- Metadata otomatis untuk SEO — bisa static maupun dynamic

> **Di pelajaran berikutnya, kita pahami perbedaan Server Components dan Client Components — konsep paling penting di Next.js!** ⚙️
`;
