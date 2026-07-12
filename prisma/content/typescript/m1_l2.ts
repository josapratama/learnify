export const ts_l2 = `
# TypeScript Lanjutan — Utility Types & Praktik di Project Nyata

Di pelajaran sebelumnya kita sudah kenal dasar TypeScript. Sekarang masuk ke fitur-fitur yang bakal sering kamu pakai di project React dan Next.js sehari-hari.

Ini bukan teori semata — semua yang ada di sini adalah hal yang dipakai di codebase production.

---

## 🧰 Utility Types — Alat Bantu Bawaan TypeScript

\`\`\`typescript
interface Pengguna {
    id: number;
    nama: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Partial<T> — semua properti jadi opsional (cocok untuk update/patch)
type UpdatePengguna = Partial<Pengguna>;
// Sama seperti: { id?: number; nama?: string; email?: string; ... }

const update: UpdatePengguna = { nama: "Nama Baru" }; // OK!

// Required<T> — semua properti jadi wajib
type PenggunalLengkap = Required<Pengguna>;

// Readonly<T> — semua properti tidak bisa diubah
type PenggunaReadonly = Readonly<Pengguna>;
const p: PenggunaReadonly = { id: 1, nama: "Budi", ... };
// p.nama = "Lain";  // ❌ Error!

// Pick<T, Keys> — ambil sebagian properti
type PublikPengguna = Pick<Pengguna, "id" | "nama" | "email">;
// Hanya id, nama, email — tidak ada password!

// Omit<T, Keys> — hilangkan sebagian properti
type PenggunaAPI = Omit<Pengguna, "password" | "createdAt">;

// Record<Keys, Type> — buat object dengan key dan value tipe tertentu
type StokPerProduk = Record<string, number>;
const stok: StokPerProduk = {
    "laptop-asus": 10,
    "mouse-logi":  50,
};

// Exclude<Union, ExcludedMembers>
type Status = "pending" | "paid" | "cancelled" | "refunded";
type StatusAktif = Exclude<Status, "cancelled" | "refunded">;
// "pending" | "paid"

// Extract<Union, ExtractedMembers>
type StatusSelesai = Extract<Status, "paid" | "refunded">;
// "paid" | "refunded"

// NonNullable<T> — hilangkan null dan undefined
type NamaWajib = NonNullable<string | null | undefined>; // string

// ReturnType<T> — tipe return dari fungsi
function ambilPengguna() { return { id: 1, nama: "Budi" }; }
type HasilPengguna = ReturnType<typeof ambilPengguna>;
// { id: number; nama: string }

// Parameters<T> — tipe parameter dari fungsi
function kirimEmail(ke: string, subjek: string, isi: string) {}
type ParamKirimEmail = Parameters<typeof kirimEmail>;
// [string, string, string]
\`\`\`

---

## 🎭 Type Guards — Penyempurnaan Tipe

\`\`\`typescript
// typeof guard
function proses(nilai: string | number) {
    if (typeof nilai === "string") {
        return nilai.toUpperCase(); // TypeScript tahu ini string
    }
    return nilai.toFixed(2); // TypeScript tahu ini number
}

// instanceof guard
class Kucing { mengeong() { return "Meong"; } }
class Anjing { menggonggong() { return "Woof"; } }

function suaraHewan(hewan: Kucing | Anjing) {
    if (hewan instanceof Kucing) {
        return hewan.mengeong();
    }
    return hewan.menggonggong();
}

// in operator guard
interface Burung { terbang(): void; }
interface Ikan   { berenang(): void; }

function gerakHewan(hewan: Burung | Ikan) {
    if ("terbang" in hewan) {
        hewan.terbang();
    } else {
        hewan.berenang();
    }
}

// Custom type guard (type predicate)
interface Pengguna { nama: string; email: string; }
interface Admin    { nama: string; permissions: string[]; }

function isAdmin(user: Pengguna | Admin): user is Admin {
    return "permissions" in user;
}

function showDashboard(user: Pengguna | Admin) {
    if (isAdmin(user)) {
        console.log(user.permissions); // TypeScript tahu ini Admin
    }
}
\`\`\`

---

## 🔗 TypeScript di Next.js — Contoh Nyata

\`\`\`typescript
// types/index.ts — Definisi tipe untuk aplikasi
export interface Kursus {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    level: "beginner" | "intermediate" | "advanced";
    category: string;
    isPublished: boolean;
    thumbnailUrl: string | null;
    instructor: {
        id: string;
        fullName: string;
        avatarUrl: string | null;
    };
    _count?: {
        enrollments: number;
        reviews: number;
    };
}

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export type PageProps<P = {}, SP = {}> = {
    params: P;
    searchParams: SP;
};
\`\`\`

\`\`\`typescript
// app/courses/[slug]/page.tsx
import type { PageProps } from "@/types";
import type { Kursus } from "@/types";

type Props = PageProps<{ slug: string }, { tab?: string }>;

export default async function HalamanKursus({ params, searchParams }: Props) {
    const kursus: Kursus = await ambilKursus(params.slug);
    const tabAktif = searchParams.tab ?? "overview";

    return <div>...</div>;
}
\`\`\`

\`\`\`typescript
// lib/api.ts — Type-safe API calls
async function fetchKursus(slug: string): Promise<Kursus> {
    const res = await fetch(\`/api/courses?slug=\${slug}\`);

    if (!res.ok) {
        throw new Error(\`HTTP \${res.status}: Kursus tidak ditemukan\`);
    }

    const json: ApiResponse<Kursus> = await res.json();

    if (!json.data) {
        throw new Error(json.error ?? "Data tidak ada");
    }

    return json.data;
}

// API Route handler dengan tipe eksplisit
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
): Promise<NextResponse<ApiResponse<Kursus[]>>> {
    const kursus = await prisma.course.findMany();
    return NextResponse.json({ data: kursus });
}
\`\`\`

---

## ⚙️ tsconfig.json yang Optimal

\`\`\`json
{
    "compilerOptions": {
        "target": "ES2022",
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "exactOptionalPropertyTypes": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "forceConsistentCasingInFileNames": true,
        "jsx": "preserve",
        "incremental": true,
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
\`\`\`

---

## 📝 Ringkasan

- Utility types: \`Partial\`, \`Required\`, \`Readonly\`, \`Pick\`, \`Omit\`, \`Record\`
- Type guards: \`typeof\`, \`instanceof\`, \`in\`, custom predicate
- Di Next.js: tipe untuk props, API response, dan route handlers
- Aktifkan \`strict: true\` di tsconfig untuk keamanan penuh

> **TypeScript adalah investasi jangka panjang — sedikit lebih verbose, tapi bug jauh lebih sedikit di production!** 🚀
`;
