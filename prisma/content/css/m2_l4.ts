export const css_l4 = `
# CSS Grid & Responsive Design — Layout Pro untuk Semua Layar

Flexbox sudah powerful, tapi ada satu hal yang lebih cocok untuk **layout halaman secara keseluruhan** — yaitu **CSS Grid**. Setelah itu, kita masuk ke topik yang sangat penting di era mobile: **Responsive Design**.

---

## 📐 CSS Grid — Layout 2 Dimensi

Flexbox bekerja dalam **satu dimensi** (baris ATAU kolom). Grid bekerja dalam **dua dimensi** (baris DAN kolom sekaligus).

**Analogi:** Flexbox itu seperti rak buku — kamu susun item dalam satu baris. Grid itu seperti spreadsheet Excel — kamu punya baris DAN kolom yang bisa dikontrol sekaligus.

\`\`\`css
/* Aktifkan Grid */
.container {
  display: grid;

  /* ─── grid-template-columns: definisi kolom ─── */
  grid-template-columns: 200px 200px 200px;  /* 3 kolom, masing-masing 200px */
  grid-template-columns: 1fr 1fr 1fr;         /* 3 kolom sama rata (fr = fraction) */
  grid-template-columns: 1fr 2fr 1fr;         /* Kolom tengah 2x lebih lebar */
  grid-template-columns: 250px 1fr;           /* Sidebar 250px, konten isi sisa */
  grid-template-columns: repeat(3, 1fr);      /* Shorthand: ulangi 3x ukuran 1fr */

  /* ─── grid-template-rows: definisi baris ─── */
  grid-template-rows: auto auto auto;         /* Tinggi otomatis sesuai konten */
  grid-template-rows: 80px 1fr 60px;          /* Header, konten, footer */

  /* ─── gap: jarak antar sel ─── */
  gap: 20px;
  row-gap: 20px;
  column-gap: 30px;
}
\`\`\`

---

## 🗺️ Template Areas — Layout dengan Nama

Ini fitur CSS Grid yang paling intuitif — bisa "gambar" layout dengan teks!

\`\`\`css
.halaman {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 70px 1fr 60px;
  grid-template-areas:
    "header  header"    /* Baris 1: header mengisi 2 kolom */
    "sidebar konten"    /* Baris 2: sidebar kiri, konten kanan */
    "footer  footer";   /* Baris 3: footer mengisi 2 kolom */
  min-height: 100vh;
  gap: 0;
}

/* Tempatkan elemen di area yang sudah diberi nama */
header   { grid-area: header; }
.sidebar { grid-area: sidebar; }
main     { grid-area: konten; }
footer   { grid-area: footer; }
\`\`\`

\`\`\`html
<div class="halaman">
  <header>Navbar</header>
  <aside class="sidebar">Menu Samping</aside>
  <main>Konten Utama</main>
  <footer>Footer</footer>
</div>
\`\`\`

---

## 🃏 Grid untuk Card Layout yang Adaptif

\`\`\`css
/* auto-fill + minmax = grid yang otomatis menyesuaikan jumlah kolom */
.grid-kartu {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  /* auto-fill: isi sebanyak mungkin kolom yang muat */
  /* minmax(280px, 1fr): minimum 280px, maksimum 1fr */
  gap: 24px;
  padding: 40px;
}

/* Hasilnya:
   - Layar lebar   → 4 kolom
   - Tablet        → 2-3 kolom
   - HP            → 1 kolom
   OTOMATIS tanpa media query! */
\`\`\`

---

## 📱 Responsive Design — Website yang Nyaman di Semua Layar

Lebih dari 60% traffic internet sekarang dari smartphone. Kalau website kamu tidak bagus di HP, kamu kehilangan mayoritas pengunjung.

**Responsive Design** berarti website tampilannya menyesuaikan ukuran layar pengguna.

### Mobile-First Approach

Prinsip yang direkomendasikan: **desain untuk HP dulu, baru tambah style untuk layar lebih besar**.

\`\`\`css
/* === BASE STYLES (Mobile) === */
/* Ini berlaku untuk SEMUA ukuran layar */
.container {
  width: 100%;
  padding: 0 16px;
}

.grid-kartu {
  display: grid;
  grid-template-columns: 1fr;   /* 1 kolom di HP */
  gap: 16px;
}

/* === TABLET (min-width: 768px) === */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }

  .grid-kartu {
    grid-template-columns: repeat(2, 1fr);  /* 2 kolom di tablet */
    gap: 20px;
  }
}

/* === DESKTOP (min-width: 1024px) === */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }

  .grid-kartu {
    grid-template-columns: repeat(3, 1fr);  /* 3 kolom di desktop */
    gap: 24px;
  }
}

/* === DESKTOP BESAR (min-width: 1280px) === */
@media (min-width: 1280px) {
  .grid-kartu {
    grid-template-columns: repeat(4, 1fr);  /* 4 kolom di layar besar */
  }
}
\`\`\`

### Breakpoint Standar

\`\`\`css
/* Breakpoint yang umum dipakai */
/* Mobile  : < 768px   (default, tidak perlu media query) */
/* Tablet  : >= 768px  */
/* Laptop  : >= 1024px */
/* Desktop : >= 1280px */
/* TV/Wide : >= 1536px */
\`\`\`

---

## 📲 Responsive Navbar — Desktop vs Mobile

\`\`\`css
/* ─── Mobile: navbar vertikal / hamburger ─── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #1e293b;
}

.nav-links {
  display: none;    /* Sembunyikan di mobile */
  list-style: none;
}

.hamburger {
  display: block;    /* Tampilkan ikon hamburger di mobile */
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
}

/* ─── Tablet ke atas ─── */
@media (min-width: 768px) {
  .hamburger {
    display: none;    /* Sembunyikan hamburger */
  }

  .nav-links {
    display: flex;    /* Tampilkan menu horizontal */
    gap: 24px;
  }
}
\`\`\`

---

## 🖼️ Responsive Images

\`\`\`css
/* Gambar responsive dasar — tidak boleh melebihi container */
img {
  max-width: 100%;
  height: auto;         /* Jaga aspect ratio */
  display: block;
}

/* Gambar yang mengisi container dengan aspect ratio tertentu */
.image-container {
  aspect-ratio: 16 / 9;   /* Rasio aspek layaknya video YouTube */
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;      /* Penuhi, potong yang tidak muat */
  object-position: center;
}
\`\`\`

---

## 🎯 Praktik: Landing Page Responsif

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduTech — Platform Belajar</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <nav class="navbar">
    <div class="logo">🎓 EduTech</div>
    <ul class="nav-links">
      <li><a href="#">Kursus</a></li>
      <li><a href="#">Harga</a></li>
      <li><a href="#">Blog</a></li>
    </ul>
    <button class="btn-cta">Mulai Gratis</button>
  </nav>

  <section class="hero">
    <h1>Belajar Coding,<br>Raih Karir Impian</h1>
    <p>Platform belajar online terbaik untuk pemula hingga profesional</p>
    <button class="btn-hero">Mulai Belajar Sekarang</button>
  </section>

  <section class="fitur">
    <div class="fitur-item">
      <span>📚</span>
      <h3>100+ Kursus</h3>
      <p>Pilihan kursus dari dasar hingga mahir</p>
    </div>
    <div class="fitur-item">
      <span>🏆</span>
      <h3>Sertifikasi</h3>
      <p>Dapat sertifikat yang diakui industri</p>
    </div>
    <div class="fitur-item">
      <span>👨‍🏫</span>
      <h3>Instruktur Ahli</h3>
      <p>Belajar dari praktisi industri nyata</p>
    </div>
  </section>

</body>
</html>
\`\`\`

\`\`\`css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
}

.logo { font-size: 1.3rem; font-weight: 700; color: #2563eb; }

.nav-links {
  display: none;   /* Hidden di mobile */
  list-style: none;
  gap: 28px;
}

.nav-links a { text-decoration: none; color: #475569; }
.nav-links a:hover { color: #2563eb; }

.btn-cta {
  padding: 9px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Hero */
.hero {
  padding: 60px 24px;
  text-align: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.hero h1 { font-size: 2rem; font-weight: 800; margin-bottom: 16px; }
.hero p  { color: #64748b; margin-bottom: 32px; }
.btn-hero {
  padding: 14px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

/* Fitur */
.fitur {
  display: grid;
  grid-template-columns: 1fr;   /* 1 kolom di mobile */
  gap: 24px;
  padding: 60px 24px;
}

.fitur-item {
  text-align: center;
  padding: 32px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.fitur-item span { font-size: 2.5rem; }
.fitur-item h3   { margin: 12px 0 8px; font-size: 1.1rem; }
.fitur-item p    { color: #64748b; font-size: 0.9rem; }

/* ─── TABLET ─── */
@media (min-width: 768px) {
  .nav-links { display: flex; }   /* Tampilkan menu */

  .hero h1 { font-size: 3rem; }

  .fitur {
    grid-template-columns: repeat(3, 1fr);   /* 3 kolom */
    padding: 80px 48px;
  }
}

/* ─── DESKTOP ─── */
@media (min-width: 1024px) {
  .navbar { padding: 16px 80px; }
  .hero   { padding: 100px 80px; }
  .hero h1 { font-size: 3.5rem; }
  .fitur  { padding: 80px; max-width: 1200px; margin: 0 auto; }
}
\`\`\`

---

## ✅ Rangkuman

**CSS Grid:**
- \`display: grid\` — aktifkan grid
- \`grid-template-columns\` — definisi kolom
- \`grid-template-areas\` — layout dengan nama
- \`repeat(auto-fill, minmax(...))\` — grid adaptif otomatis

**Responsive Design:**
- Mobile-first: desain HP dulu, tambah ke atas
- \`@media (min-width: 768px) { ... }\` — media query
- Breakpoint umum: 768px (tablet), 1024px (laptop), 1280px (desktop)

> **Selanjutnya: CSS Lanjutan — animasi, variabel CSS, dan proyek akhir!** 🚀
`;
