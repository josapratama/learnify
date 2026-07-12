export const web_l2 = `
# Server Components vs Client Components

Ini adalah konsep paling penting yang perlu dipahami di Next.js modern — dan juga yang paling sering bikin bingung.

Singkatnya: ada komponen yang render di **server** (tidak ada JavaScript dikirim ke browser), dan ada yang render di **browser** (bisa interaktif, pakai Hooks). Keduanya bisa bekerja berdampingan di satu halaman.

Memahami ini akan membuat kamu bisa buat aplikasi yang lebih cepat, lebih aman, dan lebih efisien.

---

## 🖥️ Server Components (Default)

Semua komponen di App Router adalah **Server Component secara default** — kode berjalan di server, browser hanya menerima HTML yang sudah jadi.

### Karakteristik

\`\`\`tsx
// src/app/courses/page.tsx
// Ini Server Component — tidak perlu "use client"

import prisma from "@/lib/prisma";

export default async function HalamanKursus() {
  // ✅ Bisa langsung query database — kode ini TIDAK sampai ke browser!
  const kursus = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // ✅ Bisa gunakan secret API key dengan aman
  const data = await fetch("https://api.rahasia.com/data", {
    headers: { "Authorization": \`Bearer \${process.env.SECRET_API_KEY}\` }
  });

  return (
    <div>
      {kursus.map(k => (
        <div key={k.id}>
          <h2>{k.title}</h2>
          <p>Rp {k.price.toLocaleString("id-ID")}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Apa yang BISA dilakukan

\`\`\`tsx
// ✅ Fetch data langsung dari database
const users = await prisma.user.findMany();

// ✅ Akses environment variables
const apiKey = process.env.SECRET_KEY;

// ✅ Baca file sistem
import { readFile } from "fs/promises";
const config = await readFile("config.json", "utf-8");

// ✅ Gunakan library berat (hanya di server, tidak membebani browser)
import { PDFDocument } from "pdf-lib";
\`\`\`

### Apa yang TIDAK BISA dilakukan

\`\`\`tsx
// ❌ useState, useEffect, dan React Hooks lainnya
const [count, setCount] = useState(0);  // ERROR!

// ❌ Event handlers
<button onClick={() => alert("halo")}>  // ERROR!

// ❌ Browser APIs (window, document, localStorage)
localStorage.setItem("key", "value");  // ERROR!
\`\`\`

---

## 💻 Client Components

Diaktifkan dengan directive \`"use client"\` di baris paling atas file.

### Karakteristik

\`\`\`tsx
"use client";  // ← Directive ini WAJIB ada di baris pertama

import { useState, useEffect } from "react";

export default function KeranjangBelanja() {
  // ✅ Bisa pakai Hooks
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ Bisa pakai useEffect
  useEffect(() => {
    const saved = localStorage.getItem("keranjang");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // ✅ Event handlers
  function tambahItem(produk) {
    const baru = [...items, produk];
    setItems(baru);
    localStorage.setItem("keranjang", JSON.stringify(baru));
  }

  return (
    <div>
      <h2>Keranjang ({items.length} item)</h2>
      {items.map(item => (
        <div key={item.id}>{item.nama}</div>
      ))}
      <button onClick={() => tambahItem(produkBaru)}>
        Tambah ke Keranjang
      </button>
    </div>
  );
}
\`\`\`

---

## 🗂️ Tabel Perbandingan Lengkap

| Fitur | Server Component | Client Component |
|-------|-----------------|-----------------|
| **Default?** | ✅ Ya | ❌ Perlu \`"use client"\` |
| **Render di** | Server | Browser |
| **React Hooks** | ❌ Tidak | ✅ Ya |
| **Event handlers** | ❌ Tidak | ✅ Ya |
| **Database access** | ✅ Ya (langsung) | ❌ Perlu API route |
| **localStorage/cookies** | ❌ Tidak | ✅ Ya |
| **Bundle size** | Tidak ada JS dikirim | JS terkirim ke browser |
| **SEO** | ✅ Sangat baik | ❌ Perlu workaround |
| **Performance** | ✅ Lebih cepat (FCP) | Tergantung ukuran bundle |

---

## 🌳 Pola Terbaik: "Leaf" Pattern

> **Gunakan Server Components sebanyak mungkin. Dorong Client Components ke "daun" (ujung) pohon komponen.**

\`\`\`tsx
// page.tsx — Server Component (ambil data)
import prisma from "@/lib/prisma";
import { TombolBeli } from "@/components/TombolBeli";       // Client
import { VideoPlayer } from "@/components/VideoPlayer";     // Client

export default async function DetailKursus({ params }) {
  // Data fetching di server — aman dan cepat
  const kursus = await prisma.course.findUnique({
    where: { slug: params.slug }
  });

  return (
    <div>
      {/* Konten statis — tetap di server */}
      <h1>{kursus.title}</h1>
      <p>{kursus.description}</p>
      <p>Harga: Rp {kursus.price.toLocaleString()}</p>
      
      {/* Hanya bagian interaktif yang jadi Client Component */}
      <TombolBeli kursusId={kursus.id} harga={kursus.price} />
      <VideoPlayer videoUrl={kursus.previewUrl} />
    </div>
  );
}
\`\`\`

\`\`\`tsx
// components/TombolBeli.tsx — Client Component
"use client";

import { useState } from "react";

export function TombolBeli({ kursusId, harga }) {
  const [loading, setLoading] = useState(false);

  async function handleBeli() {
    setLoading(true);
    const res = await fetch("/api/courses/enroll", {
      method: "POST",
      body: JSON.stringify({ kursusId })
    });
    setLoading(false);
    // handle response...
  }

  return (
    <button onClick={handleBeli} disabled={loading}>
      {loading ? "Memproses..." : \`Beli - Rp \${harga.toLocaleString()}\`}
    </button>
  );
}
\`\`\`

---

## ⚠️ Jebakan Umum

### Server Component Tidak Bisa Import Client Component yang Punya Server Data

\`\`\`tsx
// ❌ Salah: Client Component import prisma langsung
"use client";
import prisma from "@/lib/prisma";   // ERROR! prisma tidak bisa di browser

// ✅ Benar: Data diambil di Server Component, diteruskan sebagai props
// Di Server Component:
const data = await prisma.user.findMany();
return <ClientComponent data={data} />;
\`\`\`

### Context Provider Harus Client Component

\`\`\`tsx
// providers/ThemeProvider.tsx
"use client";   // Context pakai useState → harus client

import { createContext, useState, useContext } from "react";

const ThemeContext = createContext("light");

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState("light");
  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      {children}  {/* children bisa Server Component! */}
    </ThemeContext.Provider>
  );
}
\`\`\`

---

## 📝 Ringkasan

- **Server Components** (default) = render di server, akses database langsung, tidak ada JS ke browser, tidak bisa Hooks/events
- **Client Components** (\`"use client"\`) = render di browser, bisa Hooks & events, tidak bisa akses database/secrets langsung
- Gunakan Server Components sebanyak mungkin untuk performa dan keamanan
- Dorong Client Components ke "daun" komponen — hanya bagian yang benar-benar interaktif
- Passing data dari Server ke Client lewat **props**, bukan import langsung

> **Di modul berikutnya, kita belajar Tailwind CSS v4 untuk membuat UI yang indah dengan cepat!** 🎨
`;
