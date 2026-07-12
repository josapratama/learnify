export const web_l3 = `
# Styling Modern dengan Tailwind CSS v4

CSS itu powerful tapi bisa bikin frustrasi. Kamu punya ratusan properti, spesifisitas yang bikin pusing, dan naming convention yang tidak konsisten antar developer.

Tailwind CSS hadir dengan pendekatan berbeda: bukan nulis CSS, tapi susun utility classes langsung di HTML. Hasilnya? Lebih cepat, lebih konsisten, dan mudah di-maintain karena semua styling ada di satu tempat.

## 🆕 Apa yang Baru di Tailwind v4?

Tailwind v4 hadir dengan arsitektur baru yang disebut "Oxide Engine" — jauh lebih cepat dan jauh lebih simpel untuk setup.

| Fitur | Tailwind v3 | Tailwind v4 |
|-------|------------|-------------|
| Konfigurasi | \`tailwind.config.js\` wajib | Opsional, deteksi otomatis |
| Aktivasi | 3 baris \`@tailwind\` | Cukup \`@import "tailwindcss"\` |
| Custom theme | Di config JS | Langsung di CSS dengan \`@theme\` |
| Build speed | Cepat | Sampai 10x lebih cepat |

---

## ⚙️ Setup Tailwind v4 di Next.js

\`\`\`bash
# Install
npm install tailwindcss@next @tailwindcss/postcss@next
\`\`\`

\`\`\`css
/* src/app/globals.css */
@import "tailwindcss";  /* Ini saja! Tidak perlu tiga baris @tailwind */

/* Custom theme langsung di CSS */
@theme {
  --color-primary:    #6366f1;
  --color-secondary:  #0ea5e9;
  --color-accent:     #f59e0b;
  --font-sans: "Inter", sans-serif;
  --radius-card: 12px;
}
\`\`\`

---

## 🧱 Dasar Utility Classes

### Layout & Spacing

\`\`\`tsx
// Padding & Margin
<div className="p-4">        {/* padding: 1rem */}
<div className="px-6 py-3">  {/* padding horizontal 1.5rem, vertical 0.75rem */}
<div className="m-auto">     {/* margin: auto */}
<div className="mt-8 mb-4">  {/* margin-top: 2rem, margin-bottom: 1rem */}

// Width & Height
<div className="w-full">     {/* width: 100% */}
<div className="w-1/2">      {/* width: 50% */}
<div className="h-screen">   {/* height: 100vh */}
<div className="max-w-4xl mx-auto">  {/* max-width + center */}
\`\`\`

### Flexbox & Grid

\`\`\`tsx
// Flexbox
<div className="flex items-center justify-between gap-4">
  <span>Kiri</span>
  <span>Kanan</span>
</div>

// Grid
<div className="grid grid-cols-3 gap-6">
  <div>Kolom 1</div>
  <div>Kolom 2</div>
  <div>Kolom 3</div>
</div>

// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 kolom di mobile, 2 di tablet, 3 di desktop */}
</div>
\`\`\`

### Typography

\`\`\`tsx
<h1 className="text-4xl font-bold text-gray-900">Judul Besar</h1>
<h2 className="text-2xl font-semibold text-gray-800">Subjudul</h2>
<p className="text-base text-gray-600 leading-relaxed">
  Teks paragraf yang mudah dibaca
</p>
<span className="text-sm text-gray-400">Teks kecil</span>
<code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
  kode inline
</code>
\`\`\`

### Colors & Backgrounds

\`\`\`tsx
{/* Background */}
<div className="bg-white">         Putih
<div className="bg-gray-100">      Abu muda
<div className="bg-primary">       Warna custom dari @theme

{/* Text */}
<p className="text-gray-900">      Gelap
<p className="text-blue-600">      Biru
<p className="text-red-500">       Merah

{/* Border */}
<div className="border border-gray-200 rounded-xl">
<div className="border-2 border-blue-500 rounded-full">
\`\`\`

---

## 📱 Responsive Design

Tailwind menggunakan **mobile-first breakpoints**:

| Prefix | Ukuran Layar |
|--------|-------------|
| (none) | Mobile — < 640px |
| \`sm:\` | ≥ 640px (tablet kecil) |
| \`md:\` | ≥ 768px (tablet) |
| \`lg:\` | ≥ 1024px (laptop) |
| \`xl:\` | ≥ 1280px (desktop) |
| \`2xl:\` | ≥ 1536px (layar besar) |

\`\`\`tsx
// Teks kecil di mobile, besar di desktop
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Judul Responsif
</h1>

// Sembunyikan di mobile, tampilkan di desktop
<nav className="hidden lg:flex gap-6">
  ...
</nav>

// Layout berubah sesuai layar
<div className="flex flex-col lg:flex-row gap-8">
  <aside className="w-full lg:w-64">Sidebar</aside>
  <main className="flex-1">Konten</main>
</div>
\`\`\`

---

## 🌙 Dark Mode

\`\`\`tsx
{/* Warna berbeda saat dark mode */}
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">
    Judul yang adaptif
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    Teks yang adaptif
  </p>
</div>
\`\`\`

\`\`\`css
/* globals.css — aktifkan dark mode */
@import "tailwindcss";

@theme {
  /* Dark mode menggunakan class .dark pada <html> */
}
\`\`\`

---

## ✨ Animasi & Transitions

\`\`\`tsx
{/* Hover effects */}
<button className="bg-blue-600 hover:bg-blue-700 
                   transition-colors duration-200 
                   hover:scale-105 transform">
  Tombol Animasi
</button>

{/* Fade in */}
<div className="opacity-0 animate-fade-in">Muncul perlahan</div>

{/* Spin */}
<div className="animate-spin">⚙️</div>

{/* Pulse (skeleton loading) */}
<div className="animate-pulse bg-gray-200 rounded h-8 w-full"></div>
\`\`\`

---

## 🎯 Contoh Komponen Nyata: Card Kursus

\`\`\`tsx
interface KursusCardProps {
  judul       : string;
  instruktur  : string;
  harga       : number;
  thumbnail   : string;
  level       : "beginner" | "intermediate" | "advanced";
  rating      : number;
}

export function KursusCard({
  judul, instruktur, harga, thumbnail, level, rating
}: KursusCardProps) {
  const levelColor = {
    beginner    : "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced    : "bg-red-100 text-red-700",
  }[level];

  return (
    <article className="
      group bg-white dark:bg-gray-800
      rounded-2xl shadow-md hover:shadow-xl
      transition-all duration-300 hover:-translate-y-1
      overflow-hidden border border-gray-100 dark:border-gray-700
    ">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={thumbnail}
          alt={judul}
          className="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-300"
        />
        <span className={\`
          absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium
          \${levelColor}
        \`}>
          {level}
        </span>
      </div>

      {/* Konten */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white
                       line-clamp-2 mb-1 group-hover:text-blue-600
                       transition-colors">
          {judul}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          oleh {instruktur}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {"★".repeat(Math.round(rating))}
          {"☆".repeat(5 - Math.round(rating))}
          <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3
                        border-t border-gray-100 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600">
            Rp {harga.toLocaleString("id-ID")}
          </span>
          <button className="
            px-4 py-2 bg-blue-600 text-white text-sm font-medium
            rounded-lg hover:bg-blue-700 active:scale-95
            transition-all duration-150
          ">
            Daftar
          </button>
        </div>
      </div>
    </article>
  );
}
\`\`\`

---

## 🔧 Custom Utilities dengan @layer

\`\`\`css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
}

/* Buat utility class sendiri */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .scrollbar-hide {
    scrollbar-width: none;
  }
}

/* Buat komponen yang bisa dipakai ulang */
@layer components {
  .btn-primary {
    @apply px-6 py-2.5 bg-brand text-white font-medium rounded-lg
           hover:opacity-90 active:scale-95 transition-all duration-150;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-2xl shadow-sm
           border border-gray-100 dark:border-gray-700 p-6;
  }
  
  .input {
    @apply w-full px-4 py-2 rounded-lg border border-gray-300
           focus:outline-none focus:ring-2 focus:ring-brand/50
           focus:border-brand transition-all duration-150;
  }
}
\`\`\`

---

## 📝 Ringkasan

- Tailwind v4: konfigurasi minimal, \`@import "tailwindcss"\` cukup
- Custom theme via \`@theme {}\` langsung di CSS
- Utility classes: \`p-\`, \`m-\`, \`flex\`, \`grid\`, \`text-\`, \`bg-\`, \`border-\`
- Responsive: \`md:\`, \`lg:\`, \`xl:\` prefix untuk breakpoint
- Dark mode: \`dark:\` prefix
- \`hover:\`, \`focus:\`, \`active:\` untuk state interaktif
- \`@layer components\` untuk komponen yang bisa dipakai ulang

> **Di modul berikutnya, kita setup database dengan Prisma 7 dan PostgreSQL!** 🗄️
`;
