export const js_l1 = `
# Apa itu JavaScript? — Bahasa yang Bikin Web Jadi Hidup

Sebelum JavaScript, halaman web itu seperti koran: kamu bisa baca, tapi tidak bisa interaksi. Klik tombol tidak ada reaksi, form tidak bisa divalidasi real-time, konten tidak bisa berubah tanpa reload halaman.

JavaScript mengubah itu semua. Sekarang kamu bisa klik tombol → animasi berjalan. Isi form → validasi langsung tanpa tunggu server. Scroll ke bawah → konten baru muncul otomatis.

Dan menariknya, satu bahasa yang sama bisa dipakai di **browser** (frontend) maupun **server** (backend via Node.js).

---

## 🏆 Kenapa Belajar JavaScript Sekarang?

Menurut survei Stack Overflow, JavaScript telah menjadi bahasa paling banyak digunakan **12 tahun berturut-turut**. Bukan kebetulan:

| Platform | Pakai JavaScript |
|----------|-----------------|
| Website frontend | Vanilla JS, React, Vue, Angular |
| Server/Backend | Node.js, Deno |
| Mobile app | React Native |
| Desktop app | Electron (VS Code sendiri pakai ini!) |
| Game browser | Three.js, Phaser |

Skill JavaScript itu lintas platform — satu bahasa, bisa dipakai di mana-mana.

---

## 💻 Cara Jalankan JavaScript Sekarang Juga

Tidak perlu install apapun untuk mulai. Buka browser, tekan F12, pilih tab "Console" — itu sudah jadi environment JavaScript yang siap dipakai.

### Di Browser Console
\`\`\`javascript
// Ketik ini di Console browser, tekan Enter
alert("Halo Dunia!")

// Atau ini
console.log("JavaScript berjalan!")
document.body.style.background = "lightblue"   // Ubah warna halaman!
\`\`\`

### Di File HTML
\`\`\`html
<!DOCTYPE html>
<html>
<body>
    <h1>Halaman Web</h1>
    <script>
        // JavaScript di dalam HTML
        console.log("Halo dari JavaScript!");
        document.querySelector("h1").textContent = "Diubah oleh JS!";
    </script>
</body>
</html>
\`\`\`

### File .js Terpisah (Cara yang Benar)
\`\`\`html
<!-- index.html -->
<script src="app.js"></script>
\`\`\`
\`\`\`javascript
// app.js
console.log("File JavaScript terpisah!");
\`\`\`

### Di Node.js (Server/Terminal)
\`\`\`bash
node namafile.js
\`\`\`

---

## 🔑 Konsep Pertama: Variabel

\`\`\`javascript
// 3 cara deklarasi variabel di JavaScript modern:

// let — bisa diubah nilainya
let nama = "Budi";
nama = "Siti";  // OK!

// const — tidak bisa diubah (paling sering dipakai)
const PI = 3.14159;
// PI = 3;  // ERROR!

// var — cara lama, hindari penggunaan
var umur = 25;  // Masih valid tapi tidak direkomendasikan

// Contoh penggunaan
const namaApp = "EduTech";
let penggunaSaatIni = "Budi";
let jumlahPelajaran = 0;

console.log(\`Selamat datang di \${namaApp}, \${penggunaSaatIni}!\`);
// Output: Selamat datang di EduTech, Budi!
\`\`\`

---

## 📊 Tipe Data JavaScript

\`\`\`javascript
// String — teks
const nama = "Budi Santoso";
const kota = 'Jakarta';        // tanda kutip tunggal juga bisa
const pesan = \`Halo \${nama}\`; // template literal (paling fleksibel)

// Number — angka (tidak ada bedanya integer dan float!)
const umur = 25;
const harga = 99.99;
const negatif = -100;

// Boolean — true/false
const aktif = true;
const sudahBayar = false;

// null — sengaja dikosongkan
const data = null;

// undefined — belum diisi
let hasil;
console.log(hasil); // undefined

// Array — kumpulan data
const buah = ["apel", "mangga", "pisang"];
const angka = [1, 2, 3, 4, 5];
const campuran = ["teks", 42, true, null];

// Object — pasangan kunci-nilai
const pengguna = {
    nama: "Budi",
    umur: 25,
    aktif: true,
    alamat: {
        kota: "Jakarta",
        provinsi: "DKI"
    }
};

// Cek tipe data
console.log(typeof "halo");     // "string"
console.log(typeof 42);         // "number"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof null);       // "object" (ini bug historis JavaScript!)
console.log(typeof []);         // "object"
console.log(typeof {});         // "object"
\`\`\`

---

## ➕ Operator Dasar

\`\`\`javascript
// Aritmatika
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333...
console.log(10 % 3);   // 1 (modulus/sisa)
console.log(2 ** 8);   // 256 (pangkat)

// Perbandingan
console.log(5 == "5");   // true (== hanya cek nilai, bukan tipe)
console.log(5 === "5");  // false (=== cek nilai DAN tipe) ← GUNAKAN INI!
console.log(5 !== 6);    // true
console.log(10 > 5);     // true
console.log(10 >= 10);   // true

// Logika
console.log(true && false);  // false (AND)
console.log(true || false);  // true  (OR)
console.log(!true);          // false (NOT)

// String concatenation
console.log("Halo" + " " + "Dunia"); // "Halo Dunia"
console.log(\`\${"Halo"} \${"Dunia"}\`); // "Halo Dunia" (template literal)
\`\`\`

---

## 🖥️ Output dan Input

\`\`\`javascript
// Output
console.log("Pesan biasa");       // Di console
console.error("Pesan error!");     // Merah di console
console.warn("Peringatan!");       // Kuning di console
console.table([{nama:"Budi"},{nama:"Siti"}]); // Dalam bentuk tabel

alert("Popup peringatan!");        // Popup di browser
document.write("Tulis ke halaman"); // Tulis ke HTML

// Input (browser)
const nama = prompt("Siapa nama Anda?");
const setuju = confirm("Apakah Anda setuju?"); // true/false

// Input (Node.js) — pakai library readline atau prompt-sync
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("Nama Anda? ", (jawaban) => {
    console.log(\`Halo, \${jawaban}!\`);
    readline.close();
});
\`\`\`

---

## 📝 Ringkasan

- JavaScript = bahasa yang membuat website menjadi interaktif
- Bisa jalan di browser (frontend) dan server (Node.js)
- Tiga cara deklarasi: \`const\` (tidak berubah), \`let\` (bisa berubah), \`var\` (hindari)
- Tipe data: String, Number, Boolean, null, undefined, Array, Object
- Gunakan \`===\` bukan \`==\` untuk perbandingan yang aman

> **Di pelajaran berikutnya, kita belajar kontrol alur — if/else, switch, dan loop di JavaScript!** 🔀
`;
