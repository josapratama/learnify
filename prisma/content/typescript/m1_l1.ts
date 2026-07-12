export const ts_l1 = `
# Apa itu TypeScript? — JavaScript yang Lebih "Jujur"

Kalau kamu sudah belajar JavaScript, pasti pernah ngalamin momen ini: kamu panggil sebuah fungsi, hasilnya aneh banget, kamu debug lama, terus sadar... ternyata kamu kasih string padahal fungsinya nunggu angka. Atau sebaliknya.

JavaScript tidak akan protes — dia coba jalankan saja, dan hasilnya bisa sangat tidak terduga.

TypeScript hadir untuk menyelesaikan masalah ini.

## 🦺 Analogi: TypeScript Seperti Helm dan Rompi Pengaman

JavaScript tanpa TypeScript seperti membangun gedung tanpa alat keselamatan. Bisa saja, tapi kalau ada yang salah, kamu baru tahu saat "gedungnya" sudah jatuh — artinya saat aplikasi sudah jalan di production, dan user yang kena dampaknya.

TypeScript menambahkan **sistem tipe statis** ke JavaScript. Artinya, kesalahan seperti "kasih string ke fungsi yang nunggu angka" **tertangkap saat kamu nulis kode** di editor, bukan saat aplikasi sudah jalan.

Ini bedanya secara nyata:

\`\`\`javascript
// JavaScript — editor diam saja, bug baru ketahuan saat runtime
function hitungDiskon(harga, persen) {
    return harga - (harga * persen / 100);
}

hitungDiskon("150000", 10);
// Hasil: "1500001500001500001500001500001500001500001500001500001"
// JavaScript mengulang string "150000" sebanyak 10 kali 😱
// User lihat ini di production — memalukan banget
\`\`\`

\`\`\`typescript
// TypeScript — error langsung merah di editor sebelum kode dijalankan
function hitungDiskon(harga: number, persen: number): number {
    return harga - (harga * persen / 100);
}

hitungDiskon("150000", 10);
// ❌ Error langsung di editor:
// Argument of type 'string' is not assignable to parameter of type 'number'
// Diperbaiki SEBELUM bisa dijalankan!
\`\`\`

Satu kalimat untuk meringkas TypeScript: **JavaScript, tapi editor tahu tipe datanya dan bisa kasih peringatan kalau ada yang salah.**

---

## 🛠️ Setup TypeScript

TypeScript perlu di-compile jadi JavaScript sebelum bisa dijalankan. Tapi tenang, prosesnya otomatis dan tidak ribet:

\`\`\`bash
# Install TypeScript secara global
npm install -g typescript

# Cek versi (pastikan terinstall)
tsc --version

# Inisialisasi project dengan tsconfig.json (file konfigurasi TypeScript)
tsc --init

# Compile file .ts menjadi .js
tsc namafile.ts

# Compile + watch (auto compile ulang setiap kamu save file)
tsc --watch

# Untuk Node.js, pakai ts-node supaya bisa langsung jalankan .ts tanpa compile manual
npm install -D ts-node typescript @types/node
npx ts-node namafile.ts
\`\`\`

---

## 📐 Tipe Data Dasar — Cara Bilang ke TypeScript "Ini Tipenya Apa"

\`\`\`typescript
// Cara menulis tipe: nama: tipe = nilai
let nama: string = "Budi";
let umur: number = 25;
let aktif: boolean = true;

// TypeScript juga bisa tebak sendiri kalau dari konteksnya jelas
// Ini disebut "type inference" — kamu tidak harus selalu tulis tipenya
let kota = "Jakarta";   // TypeScript otomatis tahu ini string
kota = 42;              // ❌ Error! kota sudah "dikunci" jadi string

// any — bypass semua pengecekan tipe, hindari sebisa mungkin
// Pakai ini berarti kamu "menyerah" dari keamanan TypeScript
let apaSaja: any = "bisa apa saja";
apaSaja = 42;      // OK tapi tidak ada proteksi sama sekali

// unknown — alternatif any yang lebih aman
// Harus cek tipenya dulu sebelum bisa dipakai
let nilaiDariAPI: unknown = ambilDariAPI();
if (typeof nilaiDariAPI === "string") {
    console.log(nilaiDariAPI.toUpperCase()); // ✅ Aman karena sudah dicek
}

// never — untuk fungsi yang tidak pernah return (throw error atau infinite loop)
function lemparError(pesan: string): never {
    throw new Error(pesan);
}

// void — untuk fungsi yang tidak return apapun
function log(pesan: string): void {
    console.log(pesan);   // Tidak ada return
}
\`\`\`

---

## 🏷️ Type Annotation & Inference — Dua Cara Kasih Tahu TypeScript

\`\`\`typescript
// Cara 1: Annotation eksplisit — kamu tulis sendiri tipenya
const harga: number = 150000;
const nama: string = "Laptop";

// Cara 2: Inference — biarkan TypeScript tebak sendiri
// Ini lebih disukai kalau tipenya sudah jelas dari nilainya
const harga2 = 150000;   // TypeScript tahu ini number, tidak perlu ditulis
const nama2 = "Laptop";  // TypeScript tahu ini string

// Array — dua cara penulisan, sama saja
const angka: number[] = [1, 2, 3];
const namaNama: Array<string> = ["Andi", "Budi"];

// Tuple — array dengan jumlah dan tipe elemen yang tetap
// Berguna untuk data yang posisinya sudah pasti (kayak koordinat)
const koordinat: [number, number] = [10.5, 106.8];    // [lat, lon]
const orang: [string, number, boolean] = ["Budi", 25, true];

// Union type — bisa salah satu dari beberapa tipe
let id: string | number;   // bisa string ATAU number
id = "abc-123";    // ✅
id = 42;           // ✅
id = true;         // ❌ Error!

// Union type sangat berguna di fungsi yang menerima berbagai input
function tampilkanId(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase()); // TypeScript tahu id adalah string di sini
    } else {
        console.log(id.toFixed(2));    // TypeScript tahu id adalah number di sini
    }
}

// Intersection type — harus punya SEMUA properti dari semua tipe
type A = { nama: string };
type B = { umur: number };
type AB = A & B;
const orang2: AB = { nama: "Budi", umur: 25 }; // Harus punya keduanya
\`\`\`

---

## 🔧 Interface & Type Alias — Definisikan "Bentuk" Datamu

Ini salah satu fitur TypeScript yang paling sering dipakai. Daripada tulis tipe panjang-panjang berulang, define sekali dan pakai di mana saja.

\`\`\`typescript
// Interface — cara mendefinisikan struktur object
interface Pengguna {
    id: number;
    nama: string;
    email: string;
    umur?: number;              // ? berarti opsional, boleh tidak ada
    readonly createdAt: Date;   // readonly = tidak bisa diubah setelah dibuat
}

// Pakai interface sebagai tipe
const user: Pengguna = {
    id: 1,
    nama: "Budi",
    email: "budi@email.com",
    createdAt: new Date()
    // umur tidak wajib karena ada ?
};

// user.createdAt = new Date(); // ❌ Error! readonly tidak bisa diubah

// Interface bisa di-extend (turunkan dari yang lain)
interface Admin extends Pengguna {
    role: "admin" | "superadmin";     // hanya boleh dua nilai ini
    permissions: string[];
}

// Type alias — lebih fleksibel, bisa dipakai untuk union, intersection, dll.
type ID = string | number;
type Status = "pending" | "paid" | "cancelled";  // string literal union

type Produk = {
    id: ID;
    nama: string;
    harga: number;
    status: Status;
};

// Kapan pakai Interface vs Type?
// Interface: lebih baik untuk mendefinisikan "kontrak" object, bisa di-extend
// Type: lebih fleksibel untuk union, intersection, computed types
// Di praktiknya, keduanya sering bisa saling menggantikan untuk object shape
\`\`\`

---

## 🔑 Generics — Tipe yang Fleksibel tapi Tetap Aman

Ini topik yang terkesan rumit tapi konsepnya sebenarnya sederhana. Generics bikin kamu bisa buat fungsi atau interface yang type-safe tapi bisa bekerja dengan berbagai tipe data.

\`\`\`typescript
// Tanpa generics — harus pakai any, kehilangan type safety
function ambilPertama(arr: any[]): any {
    return arr[0];
}
// TypeScript tidak tahu hasilnya tipe apa, jadi tidak bisa bantu apa-apa

// Dengan generics — TypeScript tahu tipe hasilnya!
// <T> berarti "tipe ini akan ditentukan saat fungsi dipanggil"
function ambilPertama<T>(arr: T[]): T {
    return arr[0];
}

const pertamaAngka = ambilPertama([1, 2, 3]);
// TypeScript tahu ini number, bukan any!
// Jadi kalau kamu tulis: pertamaAngka.toUpperCase() → ❌ langsung error

const pertamaString = ambilPertama(["a", "b", "c"]);
// TypeScript tahu ini string

// Generic di interface — pola yang sangat umum untuk API response
interface ApiResponse<T> {
    data: T;          // T bisa jadi apapun sesuai kebutuhan
    message: string;
    success: boolean;
    timestamp: string;
}

interface Kursus {
    id: number;
    judul: string;
    harga: number;
}

// Penggunaan — TypeScript tahu structure lengkapnya
const response: ApiResponse<Kursus[]> = await fetchKursus();
response.data.forEach(k => {
    console.log(k.judul);   // TypeScript tahu k adalah Kursus, ada autocomplete!
    console.log(k.harga);   // ✅
    console.log(k.invalid); // ❌ Error! Kursus tidak punya properti 'invalid'
});

// Generic dengan constraint — T harus punya properti tertentu
function ambilNama<T extends { nama: string }>(item: T): string {
    return item.nama;    // Aman karena T dijamin punya .nama
}

ambilNama({ nama: "Budi", umur: 25 });    // ✅
ambilNama({ id: 1, harga: 50000 });        // ❌ Error! Tidak ada properti 'nama'
\`\`\`

---

## 📝 Ringkasan

TypeScript itu pada dasarnya JavaScript + lapisan tipe statis yang membantu kamu catch bug lebih awal.

- Tulis tipe dengan \`nama: tipe\` — tapi biarkan TypeScript inference kalau bisa
- \`interface\` dan \`type\` untuk mendefinisikan struktur object
- Union type \`string | number\` — bisa salah satu
- Generics \`function f<T>(x: T): T\` — fleksibel tapi tetap type-safe
- \`readonly\` dan \`?\` untuk properti yang tidak bisa diubah atau opsional

Satu tips: jangan terlalu obsesi dengan TypeScript di awal. Mulai dari yang sederhana, tambahkan tipe seiring kode makin kompleks. Tujuannya bukan "kode yang penuh type annotation" tapi "kode yang lebih mudah dipahami dan di-maintain."

> **Di pelajaran berikutnya, kita dalami fitur TypeScript yang paling sering dipakai di Next.js dan project nyata!** 🚀
`;
