export const js_l3 = `
# Fungsi — Si Pekerja Keras yang Bisa Dipanggil Kapan Saja

## Kenapa Kita Butuh Fungsi?

Oke, sebelum kita lihat kodenya, bayangkan situasi ini dulu ya...

Kamu punya warung dan setiap hari harus nulis nota belanja secara manual. Isinya selalu sama: tulis nama pembeli, hitung total, kasih diskon kalau ada, cetak struk. Setiap hari. Berulang-ulang.

Capek kan? Bayangkan kalau kamu punya mesin kasir yang tinggal kamu masukkan data, dan semua proses itu terjadi otomatis.

**Itulah fungsi dalam programming** — kamu tulis instruksinya sekali, terus bisa dipanggil berkali-kali kapanpun kamu butuh. Tidak perlu nulis ulang, tidak ada kemungkinan salah ketik, dan kalau mau ubah sesuatu cukup ubah di satu tempat.

Coba lihat bedanya:

\`\`\`javascript
// ❌ TANPA fungsi — bayangkan ini diulang 50 kali di kode Anda
console.log("Selamat datang, Budi!");
console.log("Kamu punya 3 poin reward");

console.log("Selamat datang, Siti!");
console.log("Kamu punya 7 poin reward");

// ✅ DENGAN fungsi — tulis sekali, pakai terus
function sambutPengguna(nama, poin) {
    console.log(\`Selamat datang, \${nama}!\`);
    console.log(\`Kamu punya \${poin} poin reward\`);
}

sambutPengguna("Budi", 3);
sambutPengguna("Siti", 7);
sambutPengguna("Agus", 12);
// ... bisa 1000 pengguna, tetap 1 baris per pemanggilan
\`\`\`

Lebih bersih, lebih mudah, kalau ada bug tinggal perbaiki di satu tempat. Oke, sekarang kita masuk lebih dalam!

---

## Tiga Cara Buat Fungsi (dan kapan pakai yang mana)

Jujur aja, di JavaScript ada beberapa cara bikin fungsi. Ini sering bikin bingung pemula. Tapi tenang, kita bahas satu-satu dengan contoh nyata.

### Cara 1: Function Declaration (Cara Klasik)

\`\`\`javascript
// Ditulis seperti ini — paling mudah dibaca
function hitungLuasPersegi(sisi) {
    return sisi * sisi;
}

// Panggil dari mana saja, bahkan sebelum fungsi ditulis!
console.log(hitungLuasPersegi(5));  // 25
console.log(hitungLuasPersegi(10)); // 100
\`\`\`

**Kapan pakai ini?** Untuk fungsi-fungsi utama yang kamu pakai berulang kali. Keunggulannya: bisa dipanggil sebelum dideklarasikan (istilahnya "hoisting").

### Cara 2: Function Expression (Simpan ke Variabel)

\`\`\`javascript
// Fungsi disimpan dalam variabel — kayak nilai biasa
const hitungDiskon = function(harga, persen) {
    return harga - (harga * persen / 100);
};

const hargaAsli = 200000;
const hargaDiskon = hitungDiskon(hargaAsli, 20); // Diskon 20%
console.log(\`Hemat Rp\${hargaAsli - hargaDiskon}\`); // Hemat Rp40000
\`\`\`

**Kapan pakai ini?** Kalau fungsinya hanya dipakai di satu tempat dan kamu mau simpan sebagai variabel.

### Cara 3: Arrow Function (Cara Modern, Paling Populer) ⭐

\`\`\`javascript
// Lebih ringkas! Cocok untuk fungsi pendek
const tambah = (a, b) => a + b;
const kali = (a, b) => a * b;
const kuadrat = n => n * n;  // 1 parameter = tanpa tanda kurung

console.log(tambah(5, 3));   // 8
console.log(kali(4, 6));     // 24
console.log(kuadrat(7));     // 49

// Kalau isinya lebih dari satu baris, pakai kurung kurawal
const sambut = (nama) => {
    const pesan = \`Hei \${nama}, selamat datang!\`;
    return pesan;
};
\`\`\`

**Kapan pakai ini?** Arrow function adalah favorit developer modern. Kamu akan lihat ini BANYAK sekali di React, Next.js, dan kode JavaScript profesional.

---

## Parameter & Return — Masukan dan Keluaran Fungsi

Anggap fungsi seperti mesin pabrik:
- **Parameter** = bahan baku yang kamu masukkan
- **Return** = produk jadi yang keluar

\`\`\`javascript
// Fungsi ini menerima 2 bahan baku (nama, umur)
// dan mengeluarkan 1 produk (string sapaan)
function buatSapaan(nama, umur) {
    // Proses di dalam mesin...
    const sapaan = \`Hei \${nama}! Umur \${umur} tahun ya.\`;
    
    // Kirim hasil keluar dengan 'return'
    return sapaan;
}

// Ambil hasilnya ke dalam variabel
const sapaanUntukBudi = buatSapaan("Budi", 25);
console.log(sapaanUntukBudi); // Hei Budi! Umur 25 tahun ya.

// Atau langsung pakai
console.log(buatSapaan("Siti", 22)); // Hei Siti! Umur 22 tahun ya.
\`\`\`

### Nilai Default — Antisipasi Kalau Lupa Isi Parameter

\`\`\`javascript
// Kadang orang lupa kasih parameter, kita bisa kasih nilai default
function sambut(nama = "Tamu", salam = "Halo") {
    return \`\${salam}, \${nama}! Selamat datang.\`;
}

console.log(sambut("Budi", "Hai"));  // Hai, Budi! Selamat datang.
console.log(sambut("Siti"));          // Halo, Siti! Selamat datang.
console.log(sambut());                // Halo, Tamu! Selamat datang.
// Tidak crash! Default value yang dipakai kalau kosong.
\`\`\`

---

## Konsep Penting: Scope (Jangkauan Variabel)

Ini sering bikin bingung tapi penting banget. Bayangkan scope seperti ruangan:

\`\`\`javascript
const pesanGlobal = "Saya bisa dilihat semua orang"; // Di luar semua fungsi

function contohScope() {
    const pesanLokal = "Saya hanya ada di dalam ruangan ini";
    
    console.log(pesanGlobal); // ✅ Bisa! Global bisa diakses dari mana saja
    console.log(pesanLokal);  // ✅ Bisa! Kita masih di dalam fungsi ini
}

contohScope();
// console.log(pesanLokal); // ❌ ERROR! Variabel lokal tidak bisa diakses dari luar
\`\`\`

**Kenapa ini penting?** Supaya variabel tidak saling bentrok. Bayangkan kalau semua fungsi pakai variabel bernama \`hasil\` dan semuanya bisa akses milik fungsi lain — kacau!

---

## Latihan: Buat Kalkulator Sederhana

Yuk langsung praktik! Ini kode kalkulator yang memanfaatkan fungsi:

\`\`\`javascript
// Definisi fungsi-fungsi kalkulator
const tambah = (a, b) => a + b;
const kurang = (a, b) => a - b;
const kali   = (a, b) => a * b;
const bagi   = (a, b) => {
    if (b === 0) {
        return "Error: tidak bisa bagi dengan nol!";
    }
    return a / b;
};

// Fungsi utama yang memanggil fungsi lain
function kalkulator(angka1, operator, angka2) {
    switch (operator) {
        case "+": return tambah(angka1, angka2);
        case "-": return kurang(angka1, angka2);
        case "*": return kali(angka1, angka2);
        case "/": return bagi(angka1, angka2);
        default:  return "Operator tidak dikenal";
    }
}

// Sekarang tinggal pakai!
console.log(kalkulator(10, "+", 5));  // 15
console.log(kalkulator(10, "-", 3));  // 7
console.log(kalkulator(4, "*", 6));   // 24
console.log(kalkulator(10, "/", 0));  // Error: tidak bisa bagi dengan nol!
console.log(kalkulator(100, "/", 4)); // 25
\`\`\`

Lihat betapa rapinya? Setiap fungsi punya satu tanggung jawab spesifik. Ini prinsip yang disebut **"Single Responsibility"** — salah satu prinsip coding terpenting yang akan terus kamu pakai sepanjang karir!

---

## 📝 Inti yang Perlu Diingat

**Fungsi itu seperti resep masakan:**
- Nama fungsi = nama resepnya
- Parameter = bahan-bahannya  
- Isi fungsi = langkah-langkah memasaknya
- Return = hidangan jadi yang disajikan

Tiga hal paling penting:
1. \`function namaFungsi(parameter) { ... }\` — cara bikin
2. \`return nilainya;\` — cara mengirim hasil keluar
3. \`namaFungsi(nilai)\` — cara memanggil/menggunakan
> **Siap lanjut?** Di pelajaran berikutnya, kita akan belajar Object dan Array — cara menyimpan banyak data sekaligus. Ini bakal sering kamu pakai banget! 🚀
`;
