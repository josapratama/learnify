export const css_l2 = `
# Box Model & Typography — Fondasi Layout CSS

Dua hal yang paling penting dalam CSS adalah memahami **Box Model** (cara CSS mengatur ukuran dan jarak) dan **Typography** (cara mengatur tampilan teks). Kuasai ini, dan 60% masalah layout sudah beres.

---

## 📦 Box Model — Setiap Elemen HTML adalah Kotak

Ini adalah konsep paling fundamental dalam CSS. **Setiap elemen HTML itu seperti kotak** yang terdiri dari 4 lapisan:

\`\`\`
┌─────────────────────────────────────┐
│              MARGIN                 │  ← Jarak LUAR (transparan)
│   ┌─────────────────────────────┐   │
│   │           BORDER            │   │  ← Garis batas
│   │   ┌─────────────────────┐   │   │
│   │   │       PADDING       │   │   │  ← Jarak DALAM (ada warna BG)
│   │   │   ┌─────────────┐   │   │   │
│   │   │   │   CONTENT   │   │   │   │  ← Konten (teks, gambar)
│   │   │   └─────────────┘   │   │   │
│   │   └─────────────────────┘   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
\`\`\`

**Analogi:** Bayangkan paket yang dikirim ke rumah:
- **Content** = isi paket (buku, sepatu, dll.)
- **Padding** = busa/pelindung di dalam kotak
- **Border** = dinding kotak kardus
- **Margin** = jarak antara kotak ini dengan kotak/benda lain di sekitarnya

\`\`\`css
.kartu {
  /* CONTENT — ukuran konten */
  width: 300px;
  height: 200px;

  /* PADDING — jarak dalam (antara konten dan border) */
  padding: 20px;             /* Semua sisi sama */
  padding: 10px 20px;        /* Atas-bawah 10px, kiri-kanan 20px */
  padding: 10px 20px 15px 25px;  /* Atas, kanan, bawah, kiri (searah jarum jam) */
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 15px;
  padding-left: 25px;

  /* BORDER — garis batas */
  border: 2px solid #3b82f6;    /* Ketebalan, tipe, warna */
  border-radius: 8px;            /* Sudut membulat */

  /* Tipe border: solid, dashed, dotted, double, none */
  border-top: 4px solid blue;
  border-bottom: 1px dashed gray;

  /* MARGIN — jarak luar */
  margin: 20px;              /* Semua sisi */
  margin: 0 auto;            /* Atas-bawah 0, kiri-kanan auto = TENGAH! */
  margin-bottom: 30px;
}

/* box-sizing: border-box — SANGAT PENTING! */
/* Tanpa ini: width = content saja. Padding dan border DITAMBAHKAN ke total width */
/* Dengan ini: width = total ukuran termasuk padding dan border */
* {
  box-sizing: border-box;  /* Selalu tambahkan ini di reset CSS! */
}
\`\`\`

---

## 🎭 Display — Cara Elemen Berperilaku

\`\`\`css
/* Block — memenuhi lebar penuh, selalu mulai baris baru */
/* Default: div, p, h1-h6, section, article, header, footer */
.block-element {
  display: block;
  width: 80%;             /* Bisa diatur width-nya */
  margin: 0 auto;         /* Bisa di-center dengan margin auto */
}

/* Inline — hanya selebar kontennya, tidak mulai baris baru */
/* Default: span, a, strong, em, img */
.inline-element {
  display: inline;
  /* width dan height TIDAK BERPENGARUH pada inline */
}

/* Inline-block — kombinasi keduanya */
/* Tidak mulai baris baru, TAPI bisa diatur width/height */
.tombol {
  display: inline-block;
  width: 150px;
  height: 45px;
  padding: 10px 20px;
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  text-align: center;
}

/* None — sembunyikan elemen (tidak tampil, tidak ada ruang) */
.tersembunyi {
  display: none;
}

/* Vs visibility: hidden — tidak tampil, tapi MASIH PUNYA ruang */
.invisible {
  visibility: hidden;
}
\`\`\`

---

## 📖 Typography — Buat Teks yang Nyaman Dibaca

\`\`\`css
/* ─── Font Family ─── */

/* Font system (sudah ada di semua OS) */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  /* Font stack: browser coba dari kiri, kalau tidak ada lanjut ke berikutnya */
}

/* Google Fonts — import font gratis */
/* Tambahkan di <head> HTML: */
/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"> */

body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: 'Merriweather', Georgia, serif;
}

/* ─── Font Size ─── */
body    { font-size: 16px; }      /* Base size */
h1      { font-size: 2.5rem; }    /* = 40px */
h2      { font-size: 2rem; }      /* = 32px */
h3      { font-size: 1.5rem; }    /* = 24px */
p       { font-size: 1rem; }      /* = 16px */
small   { font-size: 0.875rem; }  /* = 14px */

/* ─── Font Weight ─── */
.tipis   { font-weight: 300; }
.normal  { font-weight: 400; }   /* Normal */
.sedang  { font-weight: 500; }
.tebal   { font-weight: 600; }   /* Semi-bold */
.sangat-tebal { font-weight: 700; }  /* Bold */

/* ─── Font Style ─── */
.miring  { font-style: italic; }
.normal  { font-style: normal; }

/* ─── Text Alignment ─── */
.kiri    { text-align: left; }    /* Default */
.tengah  { text-align: center; }
.kanan   { text-align: right; }
.rata    { text-align: justify; } /* Rata kanan-kiri (seperti koran) */

/* ─── Line Height ─── */
p {
  line-height: 1.6;    /* Spasi antar baris = 1.6x font-size */
  /* 1.4-1.8 adalah range ideal untuk readability */
}

/* ─── Letter Spacing ─── */
h1 { letter-spacing: -0.02em; }  /* Sedikit rapat untuk heading besar */
.kode { letter-spacing: 0.05em; } /* Sedikit renggang untuk kode */

/* ─── Text Decoration ─── */
a           { text-decoration: none; }       /* Hapus underline */
.garis-bawah { text-decoration: underline; }
.coret      { text-decoration: line-through; }

/* ─── Text Transform ─── */
.kapital  { text-transform: uppercase; }    /* SEMUA HURUF BESAR */
.kecil    { text-transform: lowercase; }    /* semua huruf kecil */
.judul    { text-transform: capitalize; }   /* Setiap Kata Huruf Besar */

/* ─── Text Overflow — potong teks yang terlalu panjang ─── */
.judul-kartu {
  white-space: nowrap;      /* Jangan bungkus ke baris baru */
  overflow: hidden;          /* Sembunyikan yang melebihi */
  text-overflow: ellipsis;   /* Tampilkan "..." untuk yang terpotong */
  max-width: 200px;
}
\`\`\`

---

## 🎨 Background

\`\`\`css
/* Background color */
body       { background-color: #f8fafc; }
.hero      { background-color: #1e3a8a; }

/* Background gradient */
.hero {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  /* Arah (135 derajat), dari warna A ke warna B */
}

.card {
  background: linear-gradient(to right, #f9fafb, #ffffff);
}

/* Background image */
.banner {
  background-image: url('gambar.jpg');
  background-size: cover;       /* Penuhi area, potong kalau perlu */
  background-position: center;  /* Posisi gambar */
  background-repeat: no-repeat; /* Jangan diulang */
}
\`\`\`

---

## 🎯 Praktik: Card Produk yang Rapi

\`\`\`html
<!-- index.html -->
<div class="kartu-produk">
  <img src="laptop.jpg" alt="Laptop Gaming">
  <div class="kartu-body">
    <span class="badge">Terbaru</span>
    <h3 class="nama-produk">Laptop ASUS Gaming ROG</h3>
    <p class="deskripsi">Prosesor Intel Core i7, RAM 16GB, SSD 512GB</p>
    <div class="harga-area">
      <span class="harga-asli">Rp 15.000.000</span>
      <span class="harga-diskon">Rp 12.500.000</span>
    </div>
    <button class="tombol-beli">Beli Sekarang</button>
  </div>
</div>
\`\`\`

\`\`\`css
/* style.css */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f1f5f9;
  padding: 40px;
}

.kartu-produk {
  width: 300px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.kartu-produk img {
  width: 100%;
  height: 200px;
  object-fit: cover;   /* Gambar tidak distorsi meski ukuran berbeda */
}

.kartu-body {
  padding: 20px;
}

.badge {
  display: inline-block;
  background-color: #dcfce7;
  color: #16a34a;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.nama-produk {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.deskripsi {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 16px;
}

.harga-area {
  margin-bottom: 16px;
}

.harga-asli {
  font-size: 0.85rem;
  color: #94a3b8;
  text-decoration: line-through;
  margin-right: 8px;
}

.harga-diskon {
  font-size: 1.2rem;
  font-weight: 700;
  color: #dc2626;
}

.tombol-beli {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.tombol-beli:hover {
  background-color: #1d4ed8;
}
\`\`\`

---

## ✅ Rangkuman

- **Box Model**: Content → Padding → Border → Margin
- \`box-sizing: border-box\` — selalu tambahkan ini!
- **Display**: block, inline, inline-block, none
- **Typography**: font-family, font-size (rem/px), font-weight, line-height, text-align
- **Background**: color, gradient, image

> **Selanjutnya: Flexbox — cara terbaik untuk buat layout yang fleksibel!** 🚀
`;
