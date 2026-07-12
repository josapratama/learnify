export const css_l3 = `
# Flexbox — Susun Layout Seperti Main Lego

Salah satu tantangan terbesar dalam CSS dulu adalah: **bagaimana cara susun elemen secara horizontal? Bagaimana cara tengahkan sesuatu?** Pertanyaan yang kedengarannya sederhana tapi dulu jawabannya bikin developer sakit kepala.

**Flexbox hadir dan mengubah segalanya.**

---

## 🧩 Analogi: Flexbox seperti Rak Toko

Bayangkan rak minimarket. Kamu bisa atur produk berjajar ke kanan, ke bawah, atau beri jarak yang sama antar produk. Rak itu adalah **flex container**, dan produk-produknya adalah **flex items**.

---

## 🏗️ Cara Kerja Flexbox

\`\`\`css
/* Aktifkan Flexbox pada container */
.container {
  display: flex;
  /* Sekarang semua children langsung jadi flex items! */
}
\`\`\`

\`\`\`html
<div class="container">    <!-- FLEX CONTAINER -->
  <div class="item">A</div>   <!-- FLEX ITEM -->
  <div class="item">B</div>   <!-- FLEX ITEM -->
  <div class="item">C</div>   <!-- FLEX ITEM -->
</div>
\`\`\`

---

## 📏 Properties pada CONTAINER

\`\`\`css
.container {
  display: flex;

  /* ─── flex-direction: arah utama ─── */
  flex-direction: row;             /* Default: kiri ke kanan → */
  flex-direction: row-reverse;     /* Kanan ke kiri ← */
  flex-direction: column;          /* Atas ke bawah ↓ */
  flex-direction: column-reverse;  /* Bawah ke atas ↑ */

  /* ─── justify-content: alignment di SUMBU UTAMA ─── */
  /* (horizontal kalau flex-direction: row) */
  justify-content: flex-start;     /* Semua ke kiri (default) */
  justify-content: flex-end;       /* Semua ke kanan */
  justify-content: center;         /* Semua ke tengah */
  justify-content: space-between;  /* Beri jarak sama, ujung rapat tepi */
  justify-content: space-around;   /* Beri jarak sama, ujung punya jarak setengah */
  justify-content: space-evenly;   /* Beri jarak sama di semua sisi */

  /* ─── align-items: alignment di SUMBU SILANG ─── */
  /* (vertikal kalau flex-direction: row) */
  align-items: stretch;            /* Rentangkan penuh (default) */
  align-items: flex-start;         /* Sejajar atas */
  align-items: flex-end;           /* Sejajar bawah */
  align-items: center;             /* Sejajar tengah (vertikal!) */
  align-items: baseline;           /* Sejajar baseline teks */

  /* ─── flex-wrap: boleh bungkus ke baris baru? ─── */
  flex-wrap: nowrap;    /* Default: tidak bungkus, mungkin overflow */
  flex-wrap: wrap;      /* Bungkus ke baris baru kalau tidak muat */

  /* ─── gap: jarak antar item ─── */
  gap: 20px;            /* Jarak antar semua item */
  gap: 10px 20px;       /* Jarak baris 10px, jarak kolom 20px */
  row-gap: 10px;
  column-gap: 20px;
}
\`\`\`

---

## 🎯 Cara Tengahkan Apapun dengan Flexbox

Ini yang dulu paling sulit, sekarang jadi super mudah:

\`\`\`css
/* Tengahkan secara horizontal DAN vertikal */
.container {
  display: flex;
  justify-content: center;   /* Tengah horizontal */
  align-items: center;       /* Tengah vertikal */
  height: 100vh;             /* Perlu tinggi yang jelas */
}

/* Ini adalah cara paling umum untuk tengahkan konten di layar */
\`\`\`

---

## 🔧 Properties pada ITEM

\`\`\`css
.item {
  /* ─── flex-grow: seberapa besar item tumbuh ─── */
  flex-grow: 0;    /* Default: tidak tumbuh */
  flex-grow: 1;    /* Tumbuh mengisi sisa ruang */
  /* Kalau 3 item masing-masing flex-grow: 1, dibagi rata */
  /* Kalau item A: 2, item B: 1 → A dapat 2/3 ruang, B dapat 1/3 */

  /* ─── flex-shrink: seberapa item mengecil ─── */
  flex-shrink: 1;    /* Default: bisa mengecil */
  flex-shrink: 0;    /* Tidak boleh mengecil */

  /* ─── flex-basis: ukuran awal sebelum grow/shrink ─── */
  flex-basis: auto;    /* Default: ikuti width/height */
  flex-basis: 200px;   /* Mulai dari 200px */
  flex-basis: 33.33%;  /* Mulai dari 1/3 container */

  /* ─── Shorthand flex ─── */
  flex: 1;             /* = flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
  flex: 0 0 200px;     /* = grow: 0, shrink: 0, basis: 200px */

  /* ─── align-self: override align-items untuk item ini saja ─── */
  align-self: auto;
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;

  /* ─── order: ubah urutan tampilan ─── */
  order: 0;    /* Default */
  order: 1;    /* Tampil setelah yang bernilai lebih kecil */
  order: -1;   /* Tampil sebelum yang bernilai 0 */
}
\`\`\`

---

## 🏗️ Praktik: Layout Navbar

\`\`\`html
<nav class="navbar">
  <div class="logo">🚀 SiteBudi</div>
  <ul class="nav-links">
    <li><a href="#">Beranda</a></li>
    <li><a href="#">Kursus</a></li>
    <li><a href="#">Blog</a></li>
    <li><a href="#">Tentang</a></li>
  </ul>
  <div class="nav-actions">
    <button class="btn-masuk">Masuk</button>
    <button class="btn-daftar">Daftar</button>
  </div>
</nav>
\`\`\`

\`\`\`css
/* ─── Navbar ─── */
.navbar {
  display: flex;
  justify-content: space-between;  /* Logo kiri, links tengah, buttons kanan */
  align-items: center;             /* Sejajar vertikal */
  padding: 16px 40px;
  background-color: #1e293b;
  color: white;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #60a5fa;
}

.nav-links {
  display: flex;              /* List item berjajar horizontal */
  gap: 32px;
  list-style: none;
}

.nav-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;    /* Animasi transisi warna */
}

.nav-links a:hover {
  color: white;
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.btn-masuk {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid #64748b;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-masuk:hover {
  background-color: #334155;
}

.btn-daftar {
  padding: 8px 20px;
  background-color: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-daftar:hover {
  background-color: #2563eb;
}
\`\`\`

---

## 🃏 Praktik: Grid Kartu Produk

\`\`\`html
<section class="grid-kartu">
  <div class="kartu">
    <h3>Kursus Python</h3>
    <p>Belajar Python dari nol</p>
    <span class="harga">Rp 149.000</span>
    <button>Daftar</button>
  </div>
  <div class="kartu">
    <h3>Kursus HTML & CSS</h3>
    <p>Bangun website pertamamu</p>
    <span class="harga">Rp 99.000</span>
    <button>Daftar</button>
  </div>
  <div class="kartu">
    <h3>Kursus JavaScript</h3>
    <p>Buat website interaktif</p>
    <span class="harga">Rp 119.000</span>
    <button>Daftar</button>
  </div>
</section>
\`\`\`

\`\`\`css
.grid-kartu {
  display: flex;
  flex-wrap: wrap;        /* Bungkus ke baris baru kalau tidak muat */
  gap: 24px;
  padding: 40px;
  justify-content: center;
}

.kartu {
  flex: 0 0 280px;        /* Ukuran tetap 280px, tidak shrink/grow */
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;  /* Susun isi kartu secara vertikal */
  gap: 12px;
}

.kartu h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.kartu p {
  color: #64748b;
  font-size: 0.9rem;
  flex-grow: 1;            /* Buat p mengisi ruang → tombol tetap di bawah */
}

.harga {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2563eb;
}

.kartu button {
  padding: 10px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
\`\`\`

---

## ✅ Rangkuman

**Cheatsheet Flexbox:**

Container:
- \`display: flex\` — aktifkan flexbox
- \`flex-direction\` — arah (row/column)
- \`justify-content\` — alignment sumbu utama
- \`align-items\` — alignment sumbu silang
- \`flex-wrap\` — boleh bungkus ke baris baru
- \`gap\` — jarak antar item

Item:
- \`flex: 1\` — tumbuh mengisi sisa ruang
- \`flex: 0 0 200px\` — ukuran tetap 200px
- \`align-self\` — override align-items untuk item ini
- \`order\` — ubah urutan tampilan

> **Selanjutnya: CSS Grid — untuk layout 2 dimensi yang lebih kompleks!** 🚀
`;
