export const css_l1 = `
# Apa itu CSS? — Sulap Website Polos Jadi Cantik

Kalau kamu sudah selesai kursus HTML, kamu tahu bahwa HTML itu bikin struktur halaman — tapi tampilannya "polos" banget. Teks hitam, background putih, tidak ada warna, tidak ada gaya.

Nah, **CSS hadir untuk mengubah semua itu**.

---

## 🎨 Kenapa Harus Belajar CSS?

Coba bayangkan dua situasi:

**Situasi 1:** Kamu buka website berita yang isinya cuma teks hitam di background putih, tanpa gambar, tanpa warna, tanpa layout yang jelas. Betah baca?

**Situasi 2:** Website yang sama tapi ada warna yang nyaman, font yang enak dibaca, foto yang proporsional, tombol yang menarik. Langsung betah kan?

Itulah perbedaan yang dibuat CSS!

**CSS adalah investasi yang sangat valuable karena:**
- 🎯 Semua website di dunia pakai CSS
- 💰 Skill CSS dibutuhkan di hampir semua lowongan frontend developer
- ⚡ Dengan CSS, kamu bisa bikin tampilan profesional tanpa tools mahal
- 📱 CSS yang baik = website yang tampil bagus di semua perangkat

---

## 🏠 Analogi: CSS adalah Interior Desainer Rumah

Ingat analogi di HTML? Kalau HTML itu kerangka rumah, maka:
- 🧱 **HTML** = Kerangka/struktur (dinding, lantai, atap)
- 🎨 **CSS** = Interior desainer (cat, wallpaper, furniture, dekorasi, pencahayaan)
- ⚡ **JavaScript** = Sistem smart home (saklar otomatis, interaktivitas)

CSS yang kamu buat bisa sepenuhnya mengubah "rumah" yang sama jadi kelihatan sangat berbeda!

---

## 📐 Cara Menulis CSS

Ada 3 cara menambahkan CSS ke HTML:

### Cara 1: Inline CSS — langsung di tag HTML
\`\`\`html
<p style="color: red; font-size: 18px;">Teks ini berwarna merah</p>
<h1 style="color: blue; text-align: center;">Judul Biru di Tengah</h1>
\`\`\`
❌ Tidak disarankan untuk proyek nyata — susah di-maintain, tidak bisa reuse.

### Cara 2: Internal CSS — di dalam tag \`<style>\`
\`\`\`html
<head>
  <style>
    p {
      color: red;
      font-size: 18px;
    }
    h1 {
      color: blue;
      text-align: center;
    }
  </style>
</head>
\`\`\`
✅ Lebih baik, tapi masih dalam satu file HTML.

### Cara 3: External CSS — file terpisah (DIREKOMENDASIKAN ✅)
\`\`\`html
<!-- Di file HTML -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`
\`\`\`css
/* Di file style.css */
p {
  color: red;
  font-size: 18px;
}
h1 {
  color: blue;
  text-align: center;
}
\`\`\`
✅ Cara terbaik! Satu file CSS bisa dipakai di banyak halaman HTML.

---

## 🔧 Anatomi CSS

\`\`\`css
/* Ini adalah CSS rule (aturan) */

selector {          /* Selector: pilih elemen mana yang mau di-style */
  property: value;  /* Declaration: property apa, nilainya apa */
  property: value;
}

/* Contoh nyata: */
h1 {
  color: #2563eb;         /* Warna teks biru */
  font-size: 32px;        /* Ukuran font 32 pixel */
  text-align: center;     /* Teks rata tengah */
  margin-bottom: 20px;    /* Jarak bawah 20 pixel */
}
\`\`\`

**Penjelasan:**
- **Selector** = siapa yang mau di-style (h1, p, div, .kelas, #id)
- **Property** = apa yang mau diubah (color, font-size, background-color)
- **Value** = nilainya apa (red, 16px, center, #ffffff)
- Setiap declaration diakhiri tanda titik koma (**;**)
- Kumpulan declaration dibungkus kurung kurawal (**{ }**)

---

## 🎯 CSS Selectors — Pilih Elemen yang Tepat

\`\`\`css
/* ─── Selector Dasar ─── */

/* Element selector — pilih semua elemen jenis ini */
p { color: gray; }           /* Semua <p> */
h1 { font-size: 32px; }      /* Semua <h1> */

/* Class selector — pilih elemen dengan class tertentu */
/* Di HTML: <p class="penting">...</p> */
.penting { color: red; font-weight: bold; }
.tombol  { background-color: blue; color: white; }

/* ID selector — pilih elemen dengan ID tertentu (unik per halaman) */
/* Di HTML: <div id="header">...</div> */
#header  { background-color: #1e3a5f; }
#footer  { background-color: #333; color: white; }

/* ─── Selector Kombinasi ─── */

/* Descendant selector — pilih B yang ada di dalam A */
nav a { text-decoration: none; }         /* Semua <a> di dalam <nav> */
article p { line-height: 1.8; }          /* Semua <p> di dalam <article> */

/* Child selector — pilih B yang langsung di dalam A (bukan cucu) */
ul > li { list-style-type: square; }

/* Multiple selector — style beberapa elemen sekaligus */
h1, h2, h3 { font-family: Georgia, serif; }
input, textarea, select { border: 1px solid #ccc; }

/* ─── Pseudo-class selector ─── */

/* :hover — saat mouse di atas elemen */
a:hover { color: orange; text-decoration: underline; }
button:hover { background-color: darkblue; }

/* :focus — saat elemen mendapat fokus (diklik/ditekan Tab) */
input:focus { border-color: blue; outline: 2px solid lightblue; }

/* :first-child, :last-child — anak pertama/terakhir */
li:first-child { font-weight: bold; }
li:last-child  { color: gray; }

/* :nth-child — anak ke-n */
tr:nth-child(even) { background-color: #f5f5f5; }  /* Baris genap */
tr:nth-child(odd)  { background-color: white; }     /* Baris ganjil */
\`\`\`

---

## 🌈 Warna di CSS

\`\`\`css
/* Berbagai cara menulis warna */

/* Nama warna (ada 140+ nama warna bawaan) */
color: red;
color: blue;
color: darkgreen;
color: tomato;
color: cornflowerblue;

/* Hexadecimal — paling umum dipakai */
color: #ff0000;       /* Merah */
color: #0000ff;       /* Biru */
color: #ffffff;       /* Putih */
color: #000000;       /* Hitam */
color: #2563eb;       /* Biru cerah */
color: #16a34a;       /* Hijau */

/* RGB — Red, Green, Blue (0-255) */
color: rgb(255, 0, 0);       /* Merah */
color: rgb(37, 99, 235);     /* Biru cerah */

/* RGBA — dengan transparency (0=transparan, 1=penuh) */
color: rgba(0, 0, 0, 0.5);         /* Hitam 50% transparan */
background-color: rgba(37, 99, 235, 0.1);  /* Biru sangat transparan */

/* HSL — Hue (0-360), Saturation (%), Lightness (%) */
color: hsl(220, 90%, 56%);   /* Biru cerah */
\`\`\`

---

## 📏 Satuan Ukuran di CSS

\`\`\`css
/* Satuan ABSOLUT */
font-size: 16px;     /* pixel — ukuran pasti di layar */
width: 200px;
margin: 10px;

/* Satuan RELATIF */
font-size: 1rem;     /* rem — relatif terhadap ukuran font root (biasanya 16px) */
font-size: 1.5rem;   /* = 24px kalau root 16px */
padding: 1em;        /* em — relatif terhadap font-size elemen itu sendiri */
width: 50%;          /* % — persentase dari elemen parent */
width: 100vw;        /* vw — viewport width (100vw = lebar layar penuh) */
height: 100vh;       /* vh — viewport height (100vh = tinggi layar penuh) */

/* TIPS: Pakai rem untuk font-size, px untuk border/shadow,
         % atau vw/vh untuk layout */
\`\`\`

---

## 🎯 Praktik: Beri Gaya Halaman HTML

Ambil \`index.html\` dari pelajaran HTML dan buat \`style.css\`:

\`\`\`html
<!-- index.html — tambahkan link ke CSS -->
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>Halaman Saya</title>
</head>
\`\`\`

\`\`\`css
/* style.css */

/* Reset dasar — hapus default browser yang tidak konsisten */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;   /* Ukuran elemen termasuk padding dan border */
}

/* Gaya body */
body {
  font-family: 'Segoe UI', Arial, sans-serif;  /* Font yang nyaman dibaca */
  font-size: 16px;
  color: #333333;
  background-color: #f8fafc;
  line-height: 1.6;     /* Spasi antar baris — lebih nyaman dibaca */
}

/* Heading */
h1 {
  color: #1e40af;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

h2 {
  color: #1e3a8a;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3b82f6;  /* Garis bawah biru */
  padding-bottom: 0.5rem;
}

/* Paragraf */
p {
  margin-bottom: 1rem;
  color: #4b5563;
}

/* Link */
a {
  color: #2563eb;
  text-decoration: none;   /* Hapus underline default */
}

a:hover {
  text-decoration: underline;
  color: #1d4ed8;
}
\`\`\`

Simpan, refresh browser — lihat perbedaannya!

---

## ✅ Rangkuman

- CSS bisa ditulis inline, internal, atau external (pakai external!)
- Syntax: \`selector { property: value; }\`
- Selector: element, .class, #id, kombinasi, pseudo-class
- Warna: nama, hex (#rrggbb), rgb(), rgba(), hsl()
- Satuan: px (absolut), rem/em/% (relatif)

> **Selanjutnya: Box Model — cara CSS mengatur ukuran dan jarak setiap elemen!** 🚀
`;
