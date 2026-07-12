export const ts_l3 = `
# Fungsi di TypeScript — Bikin Kode Lebih Aman dan Jelas

Kalau di JavaScript kamu bisa bikin fungsi yang menerima apapun dan return apapun, TypeScript mengubah itu. Fungsinya jadi punya "kontrak" yang jelas — kamu tahu persis apa yang harus dimasukkan dan apa yang akan keluar.

Ini bukan soal aturan yang kaku, tapi soal membuat kode yang bisa dibaca dan dipahami lebih cepat — baik oleh tim kamu, maupun oleh kamu sendiri 6 bulan kemudian.

---

## 🎯 Tipe di Parameter dan Return Value

\`\`\`typescript
// Fungsi biasa — parameter dan return value punya tipe
function tambah(a: number, b: number): number {
    return a + b;
}

// TypeScript akan protes kalau return type-nya tidak sesuai
function salam(nama: string): string {
    return 42; // ❌ Error! Harus return string, bukan number
}

// Kalau fungsi tidak return apapun, pakai void
function cetakLog(pesan: string): void {
    console.log(pesan);
    // Tidak ada return — itu yang dimaksud void
}

// TypeScript bisa tebak return type otomatis kalau jelas
function kali(a: number, b: number) {
    return a * b; // TypeScript tahu ini return number, tidak perlu ditulis
}
\`\`\`

---

## ❓ Parameter Opsional dan Default

\`\`\`typescript
// Parameter dengan ? = opsional, boleh tidak diisi
function buatSalam(nama: string, gelar?: string): string {
    if (gelar) {
        return \`Halo, \${gelar} \${nama}!\`;
    }
    return \`Halo, \${nama}!\`;
}

buatSalam("Budi");           // "Halo, Budi!"
buatSalam("Siti", "Dr.");    // "Halo, Dr. Siti!"

// Default parameter — kalau tidak diisi, pakai nilai ini
function hitungPPN(harga: number, persen: number = 11): number {
    return harga + (harga * persen / 100);
}

hitungPPN(100000);       // 111000 (pakai default 11%)
hitungPPN(100000, 5);    // 105000 (pakai 5%)

// Parameter rest — terima banyak argumen sebagai array
function jumlahkan(...angka: number[]): number {
    return angka.reduce((total, n) => total + n, 0);
}

jumlahkan(1, 2, 3);           // 6
jumlahkan(10, 20, 30, 40);    // 100
\`\`\`

---

## 📝 Function Types dan Callbacks

\`\`\`typescript
// Definisikan tipe fungsi — berguna untuk callback dan parameter
type Kalkulasi = (a: number, b: number) => number;

function jalankanOperasi(x: number, y: number, operasi: Kalkulasi): number {
    return operasi(x, y);
}

jalankanOperasi(10, 5, (a, b) => a + b);   // 15
jalankanOperasi(10, 5, (a, b) => a * b);   // 50

// Contoh lebih nyata: callback di array methods
const harga = [150000, 75000, 200000, 50000];

// TypeScript tahu 'h' adalah number karena array-nya number[]
const mahal = harga.filter(h => h > 100000);
const total = harga.reduce((sum, h) => sum + h, 0);

// Interface untuk fungsi
interface TransformasiTeks {
    (teks: string): string;
}

const hurufBesar: TransformasiTeks = (teks) => teks.toUpperCase();
const hapusSpasi: TransformasiTeks = (teks) => teks.trim();
\`\`\`

---

## 🔄 Function Overloads — Satu Fungsi, Banyak "Mode"

\`\`\`typescript
// Kadang satu fungsi perlu handle input yang berbeda-beda
// dan return tipe yang berbeda juga — ini solusinya

// Overload signatures (deklarasi dulu)
function proses(input: string): string;
function proses(input: number): number;
function proses(input: string[]): string[];

// Implementation (yang sebenarnya jalan)
function proses(input: string | number | string[]): string | number | string[] {
    if (typeof input === "string") {
        return input.toUpperCase();
    }
    if (typeof input === "number") {
        return input * 2;
    }
    return input.map(s => s.toUpperCase());
}

// TypeScript tahu return type-nya sesuai input!
const hasilString = proses("halo");    // TypeScript tahu ini string
const hasilNumber = proses(42);        // TypeScript tahu ini number
const hasilArray  = proses(["a","b"]); // TypeScript tahu ini string[]
\`\`\`

---

## 🏹 Arrow Function dan Method di Class

\`\`\`typescript
// Arrow function — sama dengan biasa, tapi sintaks lebih ringkas
const kali = (a: number, b: number): number => a * b;

// Generic function — dibahas lebih detail di pelajaran sebelumnya,
// tapi ini contoh ringkas di konteks fungsi sehari-hari
function identitas<T>(nilai: T): T {
    return nilai;
}

identitas("halo");   // return string
identitas(42);       // return number
identitas([1,2,3]);  // return number[]

// Method di class
class Kalkulator {
    private riwayat: string[] = [];

    tambah(a: number, b: number): number {
        const hasil = a + b;
        this.riwayat.push(\`\${a} + \${b} = \${hasil}\`);
        return hasil;
    }

    ambilRiwayat(): string[] {
        return [...this.riwayat]; // Return copy, bukan array aslinya
    }

    bersihkan(): void {
        this.riwayat = [];
    }
}

const calc = new Kalkulator();
calc.tambah(10, 5);   // 15
calc.tambah(3, 7);    // 10
console.log(calc.ambilRiwayat()); // ["10 + 5 = 15", "3 + 7 = 10"]
\`\`\`

---

## 🎭 Praktik: Sistem Diskon Toko Online

\`\`\`typescript
// Contoh nyata yang menggabungkan semua yang sudah dipelajari

type TipeDiskon = "persen" | "nominal" | "gratis-ongkir";

interface ProdukKeranjang {
    nama: string;
    harga: number;
    qty: number;
}

interface HasilDiskon {
    subtotal: number;
    diskon: number;
    totalBayar: number;
    pesan: string;
}

function hitungDiskon(
    produk: ProdukKeranjang[],
    tipe: TipeDiskon,
    nilai: number = 0
): HasilDiskon {
    const subtotal = produk.reduce((sum, p) => sum + p.harga * p.qty, 0);
    let diskon = 0;

    switch (tipe) {
        case "persen":
            diskon = subtotal * (nilai / 100);
            break;
        case "nominal":
            diskon = Math.min(nilai, subtotal); // Diskon tidak bisa lebih dari subtotal
            break;
        case "gratis-ongkir":
            diskon = 0; // Ongkir ditangani terpisah
            break;
    }

    return {
        subtotal,
        diskon,
        totalBayar: subtotal - diskon,
        pesan: tipe === "gratis-ongkir"
            ? "Selamat! Kamu dapat gratis ongkir 🎉"
            : \`Hemat Rp \${diskon.toLocaleString("id-ID")} dengan kode diskon!\`
    };
}

// Test
const keranjang: ProdukKeranjang[] = [
    { nama: "Sepatu Running", harga: 450000, qty: 1 },
    { nama: "Kaos Olahraga", harga: 120000, qty: 2 },
];

const hasil = hitungDiskon(keranjang, "persen", 10);
console.log(hasil);
// subtotal: 690000
// diskon: 69000
// totalBayar: 621000
// pesan: "Hemat Rp 69.000 dengan kode diskon!"
\`\`\`

---

## 📝 Ringkasan

- Selalu tandai tipe di parameter fungsi — TypeScript yang urus return type kalau bisa di-infer
- \`parameter?: tipe\` untuk opsional, \`parameter = nilai\` untuk default
- \`...args: tipe[]\` untuk rest parameter (terima banyak argumen)
- Function type: \`(a: number) => string\` — berguna untuk callback
- Overload: satu fungsi yang handle beberapa "mode" input/output berbeda

> **Selanjutnya: Class dan OOP di TypeScript — bikin kode yang lebih terstruktur dan mudah di-maintain!** 🚀
`;
