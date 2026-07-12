export const js_l4 = `
# Object & Array — Struktur Data JavaScript

## 📦 Dua Struktur Data Paling Penting

Hampir semua data di JavaScript berbentuk Object atau Array. Menguasai keduanya adalah kunci menjadi JavaScript developer yang produktif.

---

## 🗂️ Object — Kumpulan Properti

\`\`\`javascript
// Buat object
const pengguna = {
    id: 1,
    nama: "Budi Santoso",
    email: "budi@email.com",
    umur: 25,
    aktif: true,
    alamat: {
        jalan: "Jl. Sudirman No. 1",
        kota: "Jakarta",
        kodePos: "10220"
    },
    hobi: ["coding", "membaca", "hiking"]
};

// Akses properti
console.log(pengguna.nama);          // "Budi Santoso"
console.log(pengguna["email"]);      // "budi@email.com" (bracket notation)
console.log(pengguna.alamat.kota);   // "Jakarta"
console.log(pengguna.hobi[0]);       // "coding"

// Ubah properti
pengguna.umur = 26;
pengguna.alamat.kota = "Bekasi";

// Tambah properti baru
pengguna.telepon = "081234567890";

// Hapus properti
delete pengguna.aktif;

// Cek apakah properti ada
console.log("nama" in pengguna);          // true
console.log("password" in pengguna);      // false
console.log(pengguna.hasOwnProperty("email")); // true
\`\`\`

---

## 🔨 Destructuring Object

\`\`\`javascript
const produk = {
    id: 42,
    nama: "Laptop ASUS",
    harga: 8500000,
    kategori: "Elektronik",
    stok: 10
};

// Destructuring — ambil properti ke variabel
const { nama, harga, stok } = produk;
console.log(nama);  // "Laptop ASUS"
console.log(harga); // 8500000

// Rename saat destructuring
const { nama: namaProduk, harga: hargaProduk } = produk;

// Default value
const { diskon = 0, garansi = "1 tahun" } = produk;

// Nested destructuring
const { alamat: { kota, kodePos } } = pengguna;

// Destructuring di parameter fungsi
function tampilkanProduk({ nama, harga, stok = 0 }) {
    console.log(\`\${nama}: Rp\${harga.toLocaleString()} (stok: \${stok})\`);
}
tampilkanProduk(produk);
\`\`\`

---

## 🔀 Spread & Rest Operator pada Object

\`\`\`javascript
const dasar = { nama: "Budi", umur: 25 };
const tambahan = { kota: "Jakarta", email: "budi@email.com" };

// Spread — gabungkan object
const lengkap = { ...dasar, ...tambahan };
// {nama:"Budi", umur:25, kota:"Jakarta", email:"budi@email.com"}

// Override properti dengan spread
const diupdate = { ...dasar, umur: 26, telepon: "081xxx" };
// {nama:"Budi", umur:26, telepon:"081xxx"}

// Clone object (shallow copy)
const klonPengguna = { ...pengguna };
klonPengguna.nama = "Siti"; // Tidak mengubah pengguna asli
\`\`\`

---

## 📋 Array — Kumpulan Data Berurutan

\`\`\`javascript
// Buat array
const buah = ["apel", "mangga", "pisang"];
const angka = [1, 2, 3, 4, 5];
const campuran = [1, "dua", true, null, { nilai: 3 }];

// Akses
console.log(buah[0]);    // "apel"
console.log(buah.at(-1)); // "pisang" (index negatif dari belakang)

// Panjang array
console.log(buah.length); // 3

// Tambah/hapus
buah.push("jeruk");           // Tambah di akhir → ["apel","mangga","pisang","jeruk"]
buah.pop();                   // Hapus dari akhir → kembalikan "jeruk"
buah.unshift("anggur");       // Tambah di awal
buah.shift();                 // Hapus dari awal
buah.splice(1, 1, "semangka"); // Hapus 1 elemen di index 1, ganti dengan "semangka"

// Cari
console.log(buah.includes("apel"));        // true
console.log(buah.indexOf("mangga"));       // 1
console.log(buah.findIndex(b => b.length > 5)); // Index buah dengan nama > 5 huruf
\`\`\`

---

## ✂️ Destructuring Array & Spread

\`\`\`javascript
const koordinat = [10.5, 106.8, 100];  // [lat, lon, elevasi]

// Destructuring array
const [lat, lon, elevasi] = koordinat;

// Skip elemen
const [pertama, , ketiga] = [1, 2, 3]; // pertama=1, ketiga=3

// Rest
const [kepala, ...ekor] = [1, 2, 3, 4, 5];
// kepala=1, ekor=[2,3,4,5]

// Swap variabel dengan destructuring
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// Spread array
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const gabung = [...arr1, ...arr2]; // [1,2,3,4,5,6]
const klon = [...arr1];            // copy array
\`\`\`

---

## 🔄 Array Methods Penting

\`\`\`javascript
const pesanan = [
    { id: 1, pelanggan: "Budi",  total: 250000, status: "paid"    },
    { id: 2, pelanggan: "Siti",  total: 850000, status: "pending" },
    { id: 3, pelanggan: "Agus",  total: 175000, status: "paid"    },
    { id: 4, pelanggan: "Dewi",  total: 1200000,status: "paid"    },
    { id: 5, pelanggan: "Rudi",  total: 500000, status: "pending" },
];

// sort — urutkan (MUTATES original!)
const urut = [...pesanan].sort((a, b) => b.total - a.total); // Terbesar dulu
const abjad = [...pesanan].sort((a, b) => a.pelanggan.localeCompare(b.pelanggan));

// flat — ratakan array bersarang
const nested = [[1, 2], [3, 4], [5]];
console.log(nested.flat()); // [1, 2, 3, 4, 5]

// flatMap — map + flat
const kalimat = ["halo dunia", "belajar js"];
const kata = kalimat.flatMap(k => k.split(" "));
// ["halo", "dunia", "belajar", "js"]

// Object.keys, values, entries
const config = { host: "localhost", port: 3000, debug: true };
console.log(Object.keys(config));    // ["host", "port", "debug"]
console.log(Object.values(config));  // ["localhost", 3000, true]
console.log(Object.entries(config)); // [["host","localhost"], ["port",3000], ...]

// Array.from
console.log(Array.from("hello")); // ["h","e","l","l","o"]
console.log(Array.from({length: 5}, (_, i) => i + 1)); // [1,2,3,4,5]

// Contoh chaining method
const totalPaid = pesanan
    .filter(p => p.status === "paid")
    .map(p => p.total)
    .reduce((sum, t) => sum + t, 0);

console.log(\`Total paid: Rp\${totalPaid.toLocaleString()}\`);
// Total paid: Rp1.675.000
\`\`\`

---

## 🗺️ Map & Set — Struktur Data Modern

\`\`\`javascript
// Map — seperti Object tapi key bisa bertipe apapun
const map = new Map();
map.set("nama", "Budi");
map.set(1, "satu");
map.set(true, "ya");

console.log(map.get("nama")); // "Budi"
console.log(map.size);        // 3
map.delete("nama");

// Iterasi Map
for (const [key, value] of map) {
    console.log(key, "→", value);
}

// Set — kumpulan nilai UNIK
const set = new Set([1, 2, 3, 2, 1, 3]);
console.log(set); // Set {1, 2, 3}  — duplikat otomatis hilang!

// Hapus duplikat dari array
const arr = [1, 2, 2, 3, 3, 4];
const unik = [...new Set(arr)]; // [1, 2, 3, 4]

set.add(5);
set.delete(1);
console.log(set.has(2)); // true
\`\`\`

---

## 💡 Pola Umum: Transform & Aggregate Data

\`\`\`javascript
const transaksi = [
    { bulan: "Jan", kategori: "Makanan", jumlah: 150000 },
    { bulan: "Jan", kategori: "Transport", jumlah: 80000 },
    { bulan: "Feb", kategori: "Makanan", jumlah: 200000 },
    { bulan: "Feb", kategori: "Hiburan", jumlah: 350000 },
    { bulan: "Jan", kategori: "Makanan", jumlah: 120000 },
];

// Group by — kelompokkan berdasarkan kategori
const groupedByKategori = transaksi.reduce((acc, item) => {
    const key = item.kategori;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
}, {});

// Total per kategori
const totalPerKategori = transaksi.reduce((acc, item) => {
    acc[item.kategori] = (acc[item.kategori] || 0) + item.jumlah;
    return acc;
}, {});

console.log(totalPerKategori);
// { Makanan: 470000, Transport: 80000, Hiburan: 350000 }

// Object.fromEntries — buat object dari array pasangan
const diskon = Object.fromEntries(
    Object.entries(totalPerKategori).map(([kat, total]) => [kat, total * 0.1])
);
\`\`\`

---

## 📝 Ringkasan

**Object:**
- Akses: \`obj.prop\` atau \`obj["prop"]\`
- Destructuring: \`const { a, b } = obj\`
- Spread: \`{ ...obj1, ...obj2 }\`

**Array:**
- Destructuring: \`const [a, b] = arr\`
- Spread: \`[...arr1, ...arr2]\`
- Methods: \`map\`, \`filter\`, \`reduce\`, \`find\`, \`sort\`, \`flat\`, \`flatMap\`

**Modern:**
- \`Map\` — key apapun, urutan terjaga
- \`Set\` — nilai unik

> **Di pelajaran berikutnya, kita belajar DOM Manipulation — cara mengontrol halaman web dengan JavaScript!** 🌐
`;
