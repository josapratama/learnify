export const css_l5 = `
# CSS Lanjutan — Animasi, Variabel, dan Pseudo-Elements

Kita sudah punya pondasi CSS yang kuat. Sekarang naik level — tambahkan efek animasi yang halus, gunakan variabel agar kode lebih rapi, dan kuasai pseudo-elements untuk detail yang membuat website terasa premium.

---

## 🎨 CSS Variables (Custom Properties) — Satu Nilai, Dipakai Di Mana Saja

Bayangkan kamu punya warna biru yang sama dipakai di 50 tempat berbeda di CSS. Tiba-tiba klien minta warna birunya diganti. Kamu harus ganti 50 tempat satu per satu!

CSS Variables menyelesaikan masalah ini.

\`\`\`css
/* Definisikan variabel di :root (berlaku global) */
:root {
  /* Warna */
  --warna-primer:    #2563eb;
  --warna-sekunder:  #10b981;
  --warna-bahaya:    #dc2626;
  --warna-teks:      #1e293b;
  --warna-teks-soft: #64748b;
  --warna-bg:        #f8fafc;
  --warna-bg-kartu:  #ffffff;

  /* Typography */
  --font-utama:    'Segoe UI', sans-serif;
  --ukuran-dasar:  16px;
  --ukuran-sm:     0.875rem;
  --ukuran-lg:     1.125rem;
  --ukuran-xl:     1.25rem;
  --ukuran-2xl:    1.5rem;
  --ukuran-3xl:    1.875rem;

  /* Spacing */
  --spasi-sm: 8px;
  --spasi-md: 16px;
  --spasi-lg: 24px;
  --spasi-xl: 40px;

  /* Border */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.12);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.15);

  /* Transition */
  --transisi: 0.2s ease;
  --transisi-lambat: 0.4s ease;
}

/* Gunakan variabel dengan var() */
.tombol {
  background-color: var(--warna-primer);
  color: white;
  padding: var(--spasi-sm) var(--spasi-md);
  border-radius: var(--radius-md);
  font-size: var(--ukuran-dasar);
  transition: background-color var(--transisi);
}

.tombol:hover {
  background-color: #1d4ed8;   /* Atau bisa buat variabel --warna-primer-hover */
}

/* Dark mode dengan mengubah variabel! */
[data-theme="dark"] {
  --warna-teks:     #f1f5f9;
  --warna-bg:       #0f172a;
  --warna-bg-kartu: #1e293b;
}

/* Semua elemen yang pakai variabel ini otomatis berubah saat dark mode aktif! */
\`\`\`

---

## ✨ Transitions — Perubahan yang Halus

\`\`\`css
/* Transition: ubah property secara halus saat ada perubahan */
.tombol {
  background-color: #2563eb;
  transform: scale(1);

  /* transition: property durasi timing-function delay */
  transition: background-color 0.2s ease;

  /* Transition banyak property */
  transition: background-color 0.2s ease,
              transform 0.15s ease,
              box-shadow 0.2s ease;

  /* Atau: semua property */
  transition: all 0.2s ease;
}

.tombol:hover {
  background-color: #1d4ed8;
  transform: scale(1.03);     /* Sedikit membesar */
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

/* Timing functions */
/* ease        — lambat di awal, cepat di tengah, lambat di akhir (default) */
/* linear      — kecepatan konstan */
/* ease-in     — lambat di awal, makin cepat */
/* ease-out    — cepat di awal, makin lambat */
/* ease-in-out — lambat di awal dan akhir */

/* Contoh: kartu yang naik saat hover */
.kartu {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.kartu:hover {
  transform: translateY(-6px);              /* Naik 6px */
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);  /* Bayangan lebih dalam */
}
\`\`\`

---

## 🎬 Animations — Gerakan Lebih Kompleks

\`\`\`css
/* Definisikan animasi dengan @keyframes */
@keyframes namaAnimasi {
  from { /* kondisi awal */ }
  to   { /* kondisi akhir */ }
}

/* Atau dengan persentase untuk kontrol lebih detail */
@keyframes denyutan {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes muncul {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes putar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes geserMasuk {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

/* Terapkan animasi */
.elemen {
  /* animation: nama durasi timing-function delay repeat direction fill-mode */
  animation: muncul 0.5s ease forwards;
  /* forwards: tetap di kondisi akhir setelah animasi selesai */
}

.loading-spinner {
  animation: putar 1s linear infinite;
  /* infinite: ulangi selamanya */
}

.badge-promo {
  animation: denyutan 2s ease-in-out infinite;
}

.hero-text {
  animation: muncul 0.8s ease-out 0.2s both;
  /* delay 0.2s, both = apply kondisi awal sebelum animasi mulai */
}

/* Animasi berantai */
.fitur:nth-child(1) { animation: muncul 0.5s ease 0.1s both; }
.fitur:nth-child(2) { animation: muncul 0.5s ease 0.2s both; }
.fitur:nth-child(3) { animation: muncul 0.5s ease 0.3s both; }
\`\`\`

---

## 🎭 Pseudo-Elements — Konten Extra Tanpa HTML Tambahan

\`\`\`css
/* ::before dan ::after — tambahkan konten sebelum/sesudah elemen */
/* WAJIB ada property 'content' meski nilainya kosong "" */

/* Dekorasi sebelum teks */
h2::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 1.2em;
  background-color: #2563eb;
  margin-right: 10px;
  border-radius: 2px;
  vertical-align: middle;
}

/* Badge "Baru" pada kartu */
.kartu-baru {
  position: relative;   /* Penting! ::after harus punya parent relative */
}

.kartu-baru::after {
  content: "Baru!";
  position: absolute;
  top: 12px;
  right: 12px;
  background: #dc2626;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
}

/* Garis bawah animasi pada link */
.link-animasi {
  position: relative;
  text-decoration: none;
  color: #2563eb;
}

.link-animasi::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;               /* Mulai dari 0 */
  height: 2px;
  background: #2563eb;
  transition: width 0.3s ease;  /* Animasikan lebarnya */
}

.link-animasi:hover::after {
  width: 100%;  /* Meluas penuh saat hover */
}

/* ::first-letter — style huruf pertama paragraf */
.artikel p:first-of-type::first-letter {
  font-size: 3em;
  font-weight: 700;
  float: left;
  margin-right: 8px;
  color: #2563eb;
  line-height: 0.8;
}

/* ::selection — style teks yang dipilih/diseleksi */
::selection {
  background-color: #bfdbfe;
  color: #1e40af;
}
\`\`\`

---

## 🌓 Dark Mode

\`\`\`css
/* Cara 1: Pakai prefers-color-scheme media query */
@media (prefers-color-scheme: dark) {
  :root {
    --warna-bg:       #0f172a;
    --warna-bg-kartu: #1e293b;
    --warna-teks:     #f1f5f9;
  }
}

/* Cara 2: Toggle class dengan JavaScript */
[data-theme="dark"] body {
  background-color: #0f172a;
  color: #f1f5f9;
}
\`\`\`

---

## 🎯 Praktik: Tombol-tombol Interaktif

\`\`\`css
/* Kumpulan style tombol yang profesional */

/* Tombol Primary */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.4);
}

.btn-primary:active {
  transform: translateY(0);   /* Kembali ke posisi saat diklik */
  box-shadow: none;
}

/* Tombol Outline */
.btn-outline {
  padding: 11px 23px;
  background: transparent;
  color: #2563eb;
  border: 2px solid #2563eb;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: #2563eb;
  color: white;
}

/* Loading Button */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-loading::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 8px;
}
\`\`\`

---

## ✅ Rangkuman

- **CSS Variables** (\`--nama: nilai\`, \`var(--nama)\`) — sentralisasi nilai yang sering berulang
- **Transition** — ubah property secara halus dengan durasi
- **Animation** (\`@keyframes\`) — animasi lebih kompleks, bisa loop
- **::before / ::after** — tambahkan konten dekoratif via CSS
- **Dark mode** — \`prefers-color-scheme\` atau toggle class

> **Pelajaran terakhir CSS: Proyek akhir — bangun halaman profil yang indah!** 🚀
`;
