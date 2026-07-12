export const js_l2 = `
# Kontrol Alur — If, Switch, dan Loop

Program yang berguna tidak bisa hanya berjalan lurus dari atas ke bawah. Dia harus bisa mengambil keputusan ("kalau kondisi A, lakukan X; kalau B, lakukan Y") dan mengulang tugas ("lakukan ini untuk setiap item").

Itulah yang kita pelajari di sini.

---

## 🔀 If / Else If / Else

\`\`\`javascript
const nilai = 85;

if (nilai >= 90) {
    console.log("Predikat A — Sangat Baik!");
} else if (nilai >= 80) {
    console.log("Predikat B — Baik");         // ← ini yang jalan
} else if (nilai >= 70) {
    console.log("Predikat C — Cukup");
} else {
    console.log("Perlu perbaikan");
}

// Ternary — if/else ringkas untuk satu ekspresi
const status = nilai >= 60 ? "Lulus" : "Tidak Lulus";

// Optional chaining — aman akses property yang mungkin undefined
const pengguna = { profil: { nama: "Budi" } };
console.log(pengguna?.profil?.nama);   // "Budi"
console.log(pengguna?.alamat?.kota);   // undefined (tidak error!)

// Nullish coalescing — nilai default kalau null/undefined
const nama = null ?? "Tamu";           // "Tamu"
\`\`\`

---

## 🔧 Switch Statement

\`\`\`javascript
const hari = "Senin";

switch (hari) {
    case "Senin":
    case "Selasa":
    case "Rabu":
    case "Kamis":
    case "Jumat":
        console.log("Hari kerja");
        break;
    case "Sabtu":
    case "Minggu":
        console.log("Akhir pekan!");
        break;
    default:
        console.log("Hari tidak valid");
}

// Switch dengan return di dalam fungsi
function getStatusPesanan(status) {
    switch (status) {
        case "pending":   return "⏳ Menunggu pembayaran";
        case "paid":      return "✅ Pembayaran diterima";
        case "shipped":   return "🚚 Sedang dikirim";
        case "delivered": return "📦 Sudah diterima";
        case "cancelled": return "❌ Dibatalkan";
        default:          return "❓ Status tidak diketahui";
    }
}
\`\`\`

---

## 🔄 For Loop

\`\`\`javascript
// For loop klasik
for (let i = 0; i < 5; i++) {
    console.log(\`Iterasi ke-\${i}\`);
}

// Iterasi array dengan for...of (modern, direkomendasikan)
const buah = ["apel", "mangga", "pisang", "jeruk"];

for (const item of buah) {
    console.log(item);
}

// Dengan index menggunakan entries()
for (const [index, item] of buah.entries()) {
    console.log(\`\${index + 1}. \${item}\`);
}

// for...in — iterasi key object
const profil = { nama: "Budi", umur: 25, kota: "Jakarta" };

for (const key in profil) {
    console.log(\`\${key}: \${profil[key]}\`);
}
// nama: Budi
// umur: 25
// kota: Jakarta
\`\`\`

---

## 🔁 While & Do-While

\`\`\`javascript
// While — cek kondisi dulu
let hitung = 1;
while (hitung <= 5) {
    console.log(\`Hitung: \${hitung}\`);
    hitung++;
}

// Do-while — jalankan dulu, cek kondisi belakangan
// (minimum sekali selalu dieksekusi)
let angka = 0;
do {
    console.log(\`Angka: \${angka}\`);
    angka++;
} while (angka < 3);

// Contoh nyata: minta input sampai valid
let input;
do {
    input = parseInt(prompt("Masukkan angka 1-10:"));
} while (isNaN(input) || input < 1 || input > 10);
\`\`\`

---

## ⏭️ Break & Continue

\`\`\`javascript
// break — hentikan loop sepenuhnya
const angka = [1, 4, 7, 2, 9, 3];
let ditemukan = -1;

for (const num of angka) {
    if (num === 7) {
        ditemukan = num;
        break; // Stop! sudah ketemu
    }
}
console.log(ditemukan); // 7

// continue — lewati iterasi ini, lanjut ke berikutnya
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) continue; // Lewati angka genap
    console.log(i); // 1, 3, 5, 7, 9
}
\`\`\`

---

## 🧰 Array Methods yang Mirip Loop

JavaScript punya metode array yang lebih ekspresif dari loop biasa:

\`\`\`javascript
const produk = [
    { nama: "Laptop",  harga: 8500000, stok: 5  },
    { nama: "Mouse",   harga: 250000,  stok: 30 },
    { nama: "Monitor", harga: 3200000, stok: 0  },
    { nama: "Keyboard",harga: 750000,  stok: 15 },
];

// forEach — iterasi tanpa return value
produk.forEach((item, index) => {
    console.log(\`\${index + 1}. \${item.nama}: Rp\${item.harga.toLocaleString()}\`);
});

// map — transformasi setiap elemen → array baru
const namaList = produk.map(item => item.nama);
// ["Laptop", "Mouse", "Monitor", "Keyboard"]

const hargaDiskon = produk.map(item => ({
    ...item,
    hargaDiskon: item.harga * 0.9
}));

// filter — ambil elemen yang memenuhi kondisi
const stokAda = produk.filter(item => item.stok > 0);
// Semua kecuali Monitor

const mahal = produk.filter(item => item.harga > 1000000);
// [Laptop, Monitor]

// find — cari satu elemen pertama yang cocok
const laptop = produk.find(item => item.nama === "Laptop");

// findIndex — cari index elemen
const idxMonitor = produk.findIndex(item => item.nama === "Monitor");

// some — apakah ADA yang memenuhi kondisi?
const adaStokHabis = produk.some(item => item.stok === 0); // true

// every — apakah SEMUA memenuhi kondisi?
const semuaAdaStok = produk.every(item => item.stok > 0); // false

// reduce — akumulasi nilai
const totalHarga = produk.reduce((total, item) => total + item.harga, 0);
console.log(totalHarga); // 12700000
\`\`\`

---

## 💡 Praktik: Filter & Analisis Data

\`\`\`javascript
const mahasiswa = [
    { nama: "Andi",  nilai: 88, kota: "Jakarta"  },
    { nama: "Budi",  nilai: 72, kota: "Bandung"  },
    { nama: "Cici",  nilai: 95, kota: "Jakarta"  },
    { nama: "Dedi",  nilai: 61, kota: "Surabaya" },
    { nama: "Eka",   nilai: 80, kota: "Jakarta"  },
];

// Siapa yang lulus (nilai >= 70)?
const lulus = mahasiswa.filter(m => m.nilai >= 70);
console.log(\`Lulus: \${lulus.length} orang\`);

// Rata-rata nilai
const rata = mahasiswa.reduce((sum, m) => sum + m.nilai, 0) / mahasiswa.length;
console.log(\`Rata-rata: \${rata.toFixed(1)}\`);

// Nilai tertinggi
const terbaik = mahasiswa.reduce((max, m) => m.nilai > max.nilai ? m : max);
console.log(\`Terbaik: \${terbaik.nama} (\${terbaik.nilai})\`);

// Daftar nama mahasiswa Jakarta yang lulus
const jakartaLulus = mahasiswa
    .filter(m => m.kota === "Jakarta" && m.nilai >= 70)
    .map(m => m.nama);
console.log(jakartaLulus); // ["Andi", "Cici", "Eka"]
\`\`\`

---

## 📝 Ringkasan

- \`if/else if/else\` untuk percabangan kondisi
- Ternary: \`kondisi ? nilaiBenar : nilaiSalah\`
- \`switch\` untuk banyak kasus berdasarkan satu nilai
- \`for...of\` untuk iterasi array (modern, bersih)
- \`for...in\` untuk iterasi object key
- Array methods: \`map\`, \`filter\`, \`find\`, \`reduce\`, \`some\`, \`every\` — lebih ekspresif dari loop biasa

> **Di pelajaran berikutnya, kita dalami fungsi — termasuk arrow function dan closure!** 🔧
`;
