export const ts_l5 = `
# TypeScript di React & Next.js — Kolaborasi yang Sempurna

Kalau kamu sudah belajar TypeScript dasar, saatnya lihat kenapa TypeScript dan React itu pasangan yang dibuat untuk satu sama lain.

Di React, kita berurusan dengan props, state, events, dan refs setiap hari. Tanpa TypeScript, kamu harus ingat sendiri "komponen ini butuh props apa?" — dan itu menguras energi. Dengan TypeScript, editor kamu yang ingat semuanya.

---

## 🧩 Tipe Props di React

\`\`\`typescript
import React from "react";

// Cara paling umum: definisikan interface untuk props
interface TombolProps {
    label: string;
    onClick: () => void;          // Fungsi tanpa parameter, tanpa return
    variant?: "primary" | "danger" | "ghost";  // Opsional, hanya 3 pilihan
    disabled?: boolean;
    children?: React.ReactNode;   // Konten JSX di dalam komponen
}

function Tombol({ label, onClick, variant = "primary", disabled, children }: TombolProps) {
    const style = {
        primary: "bg-blue-600 text-white",
        danger:  "bg-red-600 text-white",
        ghost:   "bg-transparent border border-gray-400",
    }[variant];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={\`px-4 py-2 rounded \${style}\`}
        >
            {children ?? label}
        </button>
    );
}

// Saat pakai komponen ini, TypeScript langsung kasih autocomplete dan error
<Tombol label="Simpan" onClick={() => console.log("klik")} />
<Tombol label="Hapus"  onClick={handleHapus} variant="danger" />
// <Tombol variant="merah" /> // ❌ Error! "merah" bukan pilihan yang valid
\`\`\`

---

## 🎣 useState dan useRef dengan Tipe

\`\`\`typescript
import { useState, useRef } from "react";

interface Produk {
    id: number;
    nama: string;
    harga: number;
}

function HalamanProduk() {
    // useState dengan tipe eksplisit
    const [produk, setProduk] = useState<Produk[]>([]);
    const [loading, setLoading] = useState(false);    // TypeScript tahu ini boolean
    const [error, setError]   = useState<string | null>(null);
    const [dipilih, setDipilih] = useState<Produk | null>(null); // Bisa null

    // useRef dengan tipe
    const inputRef = useRef<HTMLInputElement>(null);

    function fokusInput() {
        // inputRef.current bisa null, TypeScript minta kita cek dulu
        inputRef.current?.focus();  // ?. berarti "hanya lanjut kalau tidak null"
    }

    async function muatProduk() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/produk");
            const data: Produk[] = await res.json();
            setProduk(data);
        } catch (e) {
            setError("Gagal memuat produk. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Memuat...</div>;
    if (error)   return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <input ref={inputRef} placeholder="Cari produk..." />
            {produk.map(p => (
                <div key={p.id} onClick={() => setDipilih(p)}>
                    {p.nama} — Rp {p.harga.toLocaleString("id-ID")}
                </div>
            ))}
            {dipilih && <DetailProduk produk={dipilih} />}
        </div>
    );
}
\`\`\`

---

## ⚡ Event Handlers dengan Tipe yang Benar

\`\`\`typescript
// Event di React punya tipe yang spesifik — dan TypeScript membantu kita pakai dengan benar
function FormLogin() {
    const [email, setEmail]     = useState("");
    const [password, setPassword] = useState("");

    // React.ChangeEvent<HTMLInputElement> — event dari perubahan input
    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);  // TypeScript tahu e.target.value adalah string
    }

    // React.FormEvent<HTMLFormElement> — event submit form
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();  // Cegah reload halaman

        const payload = { email, password };
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    }

    // React.MouseEvent<HTMLButtonElement> — event klik
    function handleKlikLuar(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            // Klik di luar modal — tutup modal
            console.log("Klik di luar modal");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}  // Inline juga OK
                placeholder="Password"
            />
            <button type="submit">Masuk</button>
        </form>
    );
}
\`\`\`

---

## 🔗 Custom Hooks dengan TypeScript

\`\`\`typescript
// Custom hook — fungsi yang dimulai dengan "use" dan bisa pakai hooks lain
// Dengan TypeScript, return type-nya jelas dan bisa di-destructure dengan aman

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

function useApi<T>(url: string): UseApiResult<T> {
    const [data, setData]     = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState<string | null>(null);

    async function fetchData() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
            const json: T = await res.json();
            setData(json);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, [url]);

    return { data, loading, error, refetch: fetchData };
}

// Penggunaan — TypeScript tahu tipe data-nya!
interface KursusData {
    id: string;
    judul: string;
    harga: number;
}

function DaftarKursus() {
    const { data, loading, error, refetch } = useApi<KursusData[]>("/api/kursus");

    if (loading) return <p>Memuat kursus...</p>;
    if (error)   return <button onClick={refetch}>Coba Lagi</button>;

    return (
        <ul>
            {data?.map(k => (  // data bisa null, pakai ?. untuk aman
                <li key={k.id}>{k.judul} — Rp {k.harga.toLocaleString("id-ID")}</li>
            ))}
        </ul>
    );
}
\`\`\`

---

## 🌐 Server Components di Next.js 14+

\`\`\`typescript
// app/kursus/[slug]/page.tsx
// Next.js 14+ Server Component — async by default, TypeScript penuh

interface PageParams {
    params: { slug: string };
    searchParams: { tab?: string; halaman?: string };
}

interface DataKursus {
    id: string;
    judul: string;
    deskripsi: string;
    harga: number;
    level: "pemula" | "menengah" | "mahir";
    instruktur: {
        nama: string;
        foto: string | null;
    };
    totalLesson: number;
}

// Ini langsung async! Tidak perlu useEffect di Server Component
async function ambilKursus(slug: string): Promise<DataKursus> {
    const res = await fetch(\`\${process.env.API_URL}/kursus/\${slug}\`, {
        next: { revalidate: 3600 },  // Cache 1 jam
    });

    if (!res.ok) throw new Error("Kursus tidak ditemukan");
    return res.json();
}

export default async function HalamanKursus({ params, searchParams }: PageParams) {
    const kursus = await ambilKursus(params.slug);
    const tabAktif = searchParams.tab ?? "overview";

    return (
        <main>
            <h1>{kursus.judul}</h1>
            <p>Level: {kursus.level}</p>
            <p>Instruktur: {kursus.instruktur.nama}</p>
            <p>Harga: Rp {kursus.harga.toLocaleString("id-ID")}</p>
        </main>
    );
}

// Route Handler (API) di Next.js
// app/api/kursus/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const kategori = searchParams.get("kategori");

    const kursus: DataKursus[] = await prisma.course.findMany({
        where: kategori ? { category: kategori } : undefined,
    });

    return NextResponse.json({ data: kursus });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    // Validasi dan proses body...
    return NextResponse.json({ success: true }, { status: 201 });
}
\`\`\`

---

## 📝 Ringkasan

TypeScript membuat React jadi jauh lebih nyaman untuk dikerjakan — apalagi di tim:

- Props: pakai \`interface PropsNama\` sebelum definisi komponen
- State: \`useState<TipeData>(nilaiAwal)\` — TypeScript tahu tipe sepanjang lifecycle
- Events: gunakan \`React.ChangeEvent<HTMLElement>\`, \`React.FormEvent\`, dll.
- Custom hooks: definisikan return type dengan interface — memudahkan penggunaan
- Server Component: async langsung, tipe props dari Next.js sudah tersedia

Hal paling penting: jangan paksa TypeScript kalau datanya belum pasti. Pakai \`| null\` atau \`| undefined\` dengan jujur, lalu handle dengan \`?.\ atau if null check.

> **Pelajaran terakhir: TypeScript patterns yang sering dipakai di project nyata dan tips debugging!** 🚀
`;
