export const web_l3b = `
# React Fundamentals — Fondasi Next.js

Next.js dibangun di atas React. Sebelum kita bisa memahami Server Components, Client Components, dan semua fitur Next.js lainnya — kita perlu paham fondasi React terlebih dahulu.

Ini bukan kursus React yang lengkap, tapi cukup untuk memahami pola-pola yang akan sering digunakan di Next.js.

---

## 🧩 Komponen — Building Block React

Di React, UI dibangun dari komponen — fungsi yang menerima data (props) dan mengembalikan JSX:

\`\`\`tsx
// Setiap komponen = fungsi yang return JSX
function Tombol({ teks, onClick, warna = "biru" }: {
    teks: string;
    onClick: () => void;
    warna?: "biru" | "merah" | "hijau";
}) {
    return (
        <button
            onClick={onClick}
            className={\`btn btn-\${warna}\`}
        >
            {teks}
        </button>
    );
}

// Pakai komponen seperti tag HTML
function App() {
    return (
        <div>
            <Tombol teks="Simpan" onClick={() => console.log("disimpan")} />
            <Tombol teks="Hapus" onClick={() => console.log("dihapus")} warna="merah" />
        </div>
    );
}
\`\`\`

---

## 🔄 useState — State yang Reaktif

\`\`\`tsx
"use client";
import { useState } from "react";

function Counter() {
    // [nilai, fungsiUbah] = useState(nilaiAwal)
    const [hitung, setHitung] = useState(0);
    const [nama, setNama] = useState("");

    return (
        <div>
            <p>Hitungan: {hitung}</p>
            <button onClick={() => setHitung(h => h + 1)}>+1</button>
            <button onClick={() => setHitung(h => h - 1)}>-1</button>
            <button onClick={() => setHitung(0)}>Reset</button>

            <input
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Nama Anda"
            />
            <p>Halo, {nama || "Tamu"}!</p>
        </div>
    );
}
\`\`\`

---

## 📡 useEffect — Efek Samping

\`\`\`tsx
"use client";
import { useState, useEffect } from "react";

function DaftarKursus() {
    const [kursus, setKursus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Jalankan saat komponen pertama kali muncul
        async function ambilKursus() {
            try {
                const res = await fetch("/api/courses");
                const data = await res.json();
                setKursus(data);
            } catch (err) {
                setError("Gagal memuat kursus");
            } finally {
                setLoading(false);
            }
        }

        ambilKursus();
    }, []); // [] = jalankan sekali saja

    if (loading) return <div className="animate-pulse">Memuat...</div>;
    if (error)   return <div className="text-red-500">{error}</div>;

    return (
        <ul>
            {kursus.map((k: any) => (
                <li key={k.id}>{k.title}</li>
            ))}
        </ul>
    );
}
\`\`\`

---

## 📋 Render List & Conditional

\`\`\`tsx
const produk = [
    { id: 1, nama: "Laptop",  harga: 8500000, tersedia: true  },
    { id: 2, nama: "Monitor", harga: 3200000, tersedia: false },
    { id: 3, nama: "Mouse",   harga: 250000,  tersedia: true  },
];

function DaftarProduk() {
    return (
        <div className="grid gap-4">
            {produk.map(p => (
                // key wajib ada saat render list
                <div key={p.id} className="border p-4 rounded-xl">
                    <h3>{p.nama}</h3>
                    <p>Rp{p.harga.toLocaleString("id-ID")}</p>

                    {/* Conditional rendering */}
                    {p.tersedia ? (
                        <span className="text-green-600">✅ Tersedia</span>
                    ) : (
                        <span className="text-red-500">❌ Habis</span>
                    )}

                    {/* Short circuit */}
                    {p.tersedia && (
                        <button className="btn-primary mt-2">Beli</button>
                    )}
                </div>
            ))}
        </div>
    );
}
\`\`\`

---

## 🔗 Props — Komunikasi Antar Komponen

\`\`\`tsx
// Props turun dari parent ke child (one-way data flow)
interface KursusCardProps {
    id: string;
    judul: string;
    instruktur: string;
    harga: number;
    thumbnail?: string;
    onBeli: (id: string) => void;
}

function KursusCard({ id, judul, instruktur, harga, thumbnail, onBeli }: KursusCardProps) {
    return (
        <div className="card">
            <img src={thumbnail ?? "/default.jpg"} alt={judul} />
            <h2>{judul}</h2>
            <p>oleh {instruktur}</p>
            <p>Rp{harga.toLocaleString("id-ID")}</p>
            <button onClick={() => onBeli(id)}>Daftar</button>
        </div>
    );
}

// Parent mengontrol state dan kirim callback
function HalamanKursus() {
    const [keranjang, setKeranjang] = useState<string[]>([]);

    function handleBeli(id: string) {
        setKeranjang(prev => [...prev, id]);
        console.log("Tambah ke keranjang:", id);
    }

    return (
        <div>
            <p>Keranjang: {keranjang.length} item</p>
            {kursus.map(k => (
                <KursusCard
                    key={k.id}
                    {...k}
                    onBeli={handleBeli}
                />
            ))}
        </div>
    );
}
\`\`\`

---

## 🎣 Custom Hook — Logika yang Bisa Dipakai Ulang

\`\`\`tsx
// hooks/useKursus.ts
import { useState, useEffect } from "react";

interface Kursus {
    id: string;
    title: string;
    price: number;
}

export function useKursus() {
    const [kursus, setKursus] = useState<Kursus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/courses")
            .then(res => {
                if (!res.ok) throw new Error("Gagal fetch");
                return res.json();
            })
            .then(setKursus)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { kursus, loading, error };
}

// Penggunaan — logika bersih, terpisah dari UI
function HalamanKursus() {
    const { kursus, loading, error } = useKursus();

    if (loading) return <div>Loading...</div>;
    if (error)   return <div>Error: {error}</div>;

    return (
        <div>
            {kursus.map(k => <div key={k.id}>{k.title}</div>)}
        </div>
    );
}
\`\`\`

---

## 📝 Ringkasan

- Komponen = fungsi yang return JSX
- \`useState\` = state yang memicu re-render saat berubah
- \`useEffect\` = jalankan kode setelah render (fetch data, subscribe)
- Props = data yang dikirim dari parent ke child (read-only)
- \`key\` wajib saat render list
- Custom hook = logika stateful yang bisa di-reuse

> **Di Next.js, sebagian besar komponen adalah Server Components. Gunakan \`"use client"\` hanya saat butuh interaktivitas!** ⚡
`;
