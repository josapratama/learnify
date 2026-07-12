export const ts_l6 = `
# TypeScript Patterns & Tips Praktis — Senjata Rahasia Developer

Ini pelajaran terakhir TypeScript. Kita kumpulkan pattern-pattern yang sering muncul di project nyata — yang tidak selalu diajarin di tutorial biasa, tapi sering bikin orang bingung saat ketemu di codebase orang lain.

---

## 🏭 Builder Pattern & Fluent Interface

\`\`\`typescript
// Pattern ini populer untuk membuat query, config, atau object kompleks
// Kelebihan: bisa "chain" method satu per satu, mudah dibaca

class QueryBuilder {
    private _tabel:   string = "";
    private _kondisi: string[] = [];
    private _orderBy: string = "";
    private _limit:   number | null = null;
    private _offset:  number = 0;

    dari(tabel: string): this {       // Return 'this' = bisa di-chain!
        this._tabel = tabel;
        return this;
    }

    dimana(kondisi: string): this {
        this._kondisi.push(kondisi);
        return this;
    }

    urutkan(kolom: string, arah: "ASC" | "DESC" = "ASC"): this {
        this._orderBy = \`\${kolom} \${arah}\`;
        return this;
    }

    batasi(n: number): this {
        this._limit = n;
        return this;
    }

    lewati(n: number): this {
        this._offset = n;
        return this;
    }

    build(): string {
        let query = \`SELECT * FROM \${this._tabel}\`;

        if (this._kondisi.length > 0) {
            query += \` WHERE \${this._kondisi.join(" AND ")}\`;
        }
        if (this._orderBy) query += \` ORDER BY \${this._orderBy}\`;
        if (this._limit)   query += \` LIMIT \${this._limit}\`;
        if (this._offset)  query += \` OFFSET \${this._offset}\`;

        return query;
    }
}

// Sangat mudah dibaca!
const query = new QueryBuilder()
    .dari("kursus")
    .dimana("harga < 200000")
    .dimana("is_published = true")
    .urutkan("created_at", "DESC")
    .batasi(10)
    .lewati(20)
    .build();

// SELECT * FROM kursus WHERE harga < 200000 AND is_published = true ORDER BY created_at DESC LIMIT 10 OFFSET 20
\`\`\`

---

## 🗂️ Discriminated Union — Tipe yang Bisa "Pilah Sendiri"

\`\`\`typescript
// Pattern ini sangat berguna untuk state yang punya banyak "mode"
// Daripada pakai banyak state terpisah yang bisa konflik

// ❌ Cara lama — mudah bikin state yang tidak konsisten
interface StateLama {
    loading: boolean;
    error: string | null;
    data: string[] | null;
    // Masalah: loading=true tapi data tidak null? Itu logika yang tidak masuk akal
}

// ✅ Discriminated union — setiap state "dikunci" agar konsisten
type StateAsync<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; pesan: string }
    | { status: "sukses"; data: T };

// Penggunaan di React
function KomponenAsync() {
    const [state, setState] = useState<StateAsync<string[]>>({ status: "idle" });

    async function muat() {
        setState({ status: "loading" });

        try {
            const data = await fetchData();
            setState({ status: "sukses", data });
        } catch (e) {
            setState({ status: "error", pesan: "Gagal memuat data" });
        }
    }

    // TypeScript tahu apa yang tersedia di setiap branch!
    switch (state.status) {
        case "idle":
            return <button onClick={muat}>Muat Data</button>;
        case "loading":
            return <Spinner />;
        case "error":
            return <p>{state.pesan}</p>;  // TypeScript tahu state.pesan ada di sini
        case "sukses":
            return <ul>{state.data.map(d => <li>{d}</li>)}</ul>; // TypeScript tahu state.data ada di sini
    }
}
\`\`\`

---

## 🛡️ Zod — Validasi Data yang Type-Safe

\`\`\`typescript
// Zod adalah library validasi yang bekerja sempurna dengan TypeScript
// npm install zod

import { z } from "zod";

// Definisikan schema validasi
const SchemaPendaftaran = z.object({
    nama: z.string()
        .min(2, "Nama minimal 2 karakter")
        .max(50, "Nama maksimal 50 karakter"),

    email: z.string()
        .email("Format email tidak valid"),

    password: z.string()
        .min(8, "Password minimal 8 karakter")
        .regex(/[A-Z]/, "Harus ada huruf kapital")
        .regex(/[0-9]/, "Harus ada angka"),

    umur: z.number()
        .min(17, "Harus berumur minimal 17 tahun")
        .max(100)
        .optional(),

    setuju: z.boolean()
        .refine(val => val === true, "Harus menyetujui syarat & ketentuan"),
});

// Dapatkan TypeScript type OTOMATIS dari schema!
type DataPendaftaran = z.infer<typeof SchemaPendaftaran>;
// Equivalent: { nama: string; email: string; password: string; umur?: number; setuju: boolean }

// Validasi data (misalnya dari form atau API request)
function prosesPendaftaran(data: unknown) {
    const hasil = SchemaPendaftaran.safeParse(data);

    if (!hasil.success) {
        // Semua error validasi tersedia dengan lengkap
        const errors = hasil.error.issues.map(issue => ({
            field: issue.path.join("."),
            pesan: issue.message,
        }));
        return { sukses: false, errors };
    }

    // hasil.data sudah validated dan typed!
    const { nama, email, password } = hasil.data;
    return { sukses: true, data: hasil.data };
}
\`\`\`

---

## 🔧 Template Literal Types — Tipe dari String Pattern

\`\`\`typescript
// Ini fitur TypeScript yang powerful untuk definisikan string yang pola-nya pasti

type Warna = "merah" | "hijau" | "biru";
type Kecerahan = "terang" | "gelap";

// Kombinasi otomatis!
type VarianWarna = \`\${Kecerahan}-\${Warna}\`;
// = "terang-merah" | "terang-hijau" | "terang-biru" | "gelap-merah" | ...

// Berguna untuk CSS classes, event names, dll.
type EventNama = \`on\${Capitalize<string>}\`;  // onKlik, onChange, onFokus, ...

// Mapped types — buat tipe baru dari tipe yang sudah ada
interface Konfigurasi {
    host: string;
    port: number;
    ssl: boolean;
}

// Buat versi "getter" dari setiap property
type Getter<T> = {
    [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type KonfigurasiGetter = Getter<Konfigurasi>;
// {
//   getHost: () => string;
//   getPort: () => number;
//   getSsl: () => boolean;
// }
\`\`\`

---

## 🚨 Tips Debugging TypeScript yang Sering Bikin Bingung

\`\`\`typescript
// Tip 1: Type assertion vs type casting
// Kadang kamu lebih tahu tipe datanya dari TypeScript
const elemenHtml = document.getElementById("judul");
// elemenHtml bertipe HTMLElement | null

// Pakai 'as' untuk assertion (beri tahu TypeScript "percayakan padaku")
const elemenJudul = document.getElementById("judul") as HTMLDivElement;
// Tapi hati-hati — kalau salah, runtime error tetap bisa terjadi

// Lebih aman: cek dulu
if (elemenHtml instanceof HTMLDivElement) {
    elemenHtml.textContent = "Judul Baru"; // TypeScript tahu ini HTMLDivElement
}

// Tip 2: Non-null assertion operator (!)
// Beritahu TypeScript "yakin ini tidak null/undefined"
const namaUser = user.profile?.nama!;
// Pakai sparingly — kalau nilainya memang null, runtime error

// Tip 3: satisfies operator (TypeScript 4.9+)
// Validasi tipe tapi tetap simpan tipe yang spesifik
const palet = {
    merah: [255, 0, 0],
    hijau: [0, 255, 0],
    biru: "#0000FF",
} satisfies Record<string, string | number[]>;

// TypeScript tahu palet.merah adalah number[] (bukan string | number[])
palet.merah.push(100); // ✅ TypeScript tahu ini array
palet.biru.toUpperCase(); // ✅ TypeScript tahu ini string

// Tip 4: 'as const' untuk nilai yang tidak berubah
const KONFIGURASI = {
    API_URL: "https://api.example.com",
    TIMEOUT: 5000,
    METODE: ["GET", "POST", "PUT", "DELETE"],
} as const;

// Sekarang TypeScript tahu nilai persisnya, bukan cuma tipenya!
// KONFIGURASI.API_URL bertipe literal "https://api.example.com", bukan string umum
// KONFIGURASI.METODE bertipe readonly ["GET", "POST", "PUT", "DELETE"]

type MetodeHTTP = typeof KONFIGURASI.METODE[number];
// = "GET" | "POST" | "PUT" | "DELETE"
\`\`\`

---

## 🎯 Mini Project: Type-Safe Event System

\`\`\`typescript
// Buat event emitter yang sepenuhnya type-safe
// Ini konsep yang dipakai di banyak framework

type EventMap = {
    "user:login":   { id: string; nama: string; waktu: Date };
    "user:logout":  { id: string };
    "kursus:beli":  { userId: string; kursusId: string; harga: number };
    "error":        { pesan: string; kode: number };
};

class EventEmitter<Events extends Record<string, unknown>> {
    private listeners = new Map<string, Function[]>();

    on<E extends keyof Events>(
        event: E,
        callback: (data: Events[E]) => void
    ): () => void {  // Return unsubscribe function
        const list = this.listeners.get(event as string) ?? [];
        list.push(callback);
        this.listeners.set(event as string, list);

        return () => {  // Cleanup function
            const updated = list.filter(cb => cb !== callback);
            this.listeners.set(event as string, updated);
        };
    }

    emit<E extends keyof Events>(event: E, data: Events[E]): void {
        const list = this.listeners.get(event as string) ?? [];
        list.forEach(cb => cb(data));
    }
}

const emitter = new EventEmitter<EventMap>();

// TypeScript tahu persis data apa yang tersedia di setiap event!
const batal = emitter.on("user:login", ({ id, nama, waktu }) => {
    console.log(\`\${nama} login pada \${waktu.toLocaleTimeString("id-ID")}\`);
});

emitter.on("kursus:beli", ({ userId, harga }) => {
    console.log(\`User \${userId} beli kursus seharga Rp \${harga.toLocaleString("id-ID")}\`);
});

// Emit event
emitter.emit("user:login", { id: "u1", nama: "Budi", waktu: new Date() });
// emitter.emit("user:login", { id: "u1" }); // ❌ Error! 'nama' dan 'waktu' wajib ada

batal(); // Unsubscribe dari event
\`\`\`

---

## 📝 Ringkasan Keseluruhan TypeScript

Perjalanan kita dari pelajaran 1 sampai di sini:

1. **Dasar** — tipe data, interface, generics, type inference
2. **Utility Types** — Partial, Pick, Omit, Record, ReturnType
3. **Fungsi** — parameter types, overloads, function types
4. **Class & OOP** — access modifiers, inheritance, abstract, interface
5. **React & Next.js** — props, hooks, events, server components
6. **Advanced Patterns** — builder, discriminated union, Zod, template literals

Kalau ada satu hal yang paling penting dari semua ini: **TypeScript ada untuk membantu, bukan menyiksa**. Kalau kamu lagi berjuang dengan tipe yang rumit, itu mungkin tanda bahwa logika kodenya bisa disederhanakan.

Mulai dari \`strict: true\` di tsconfig, dan biarkan TypeScript menjadi pair programmer terbaikmu.

> **Selamat! Kamu sudah menguasai TypeScript dari dasar hingga production patterns. Saatnya pakai di project nyata!** 🎉
`;
