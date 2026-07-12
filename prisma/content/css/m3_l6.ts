export const css_l6 = `
# Proyek Akhir CSS — Dari Halaman Polos Jadi Website yang Indah

Ini dia puncak dari perjalanan belajar CSS kita! Kita akan ambil halaman profil HTML yang sudah dibuat, lalu beri tampilan CSS yang profesional, responsif, dan punya dark mode.

---

## 🎯 Yang Akan Kita Buat

Halaman profil personal yang:
- ✅ Tampil bagus di HP, tablet, dan desktop
- ✅ Punya dark/light mode
- ✅ Animasi yang halus dan tidak berlebihan
- ✅ Warna dan typography yang konsisten dengan CSS Variables
- ✅ Siap jadi portofolio nyata!

---

## 📁 Struktur File

\`\`\`
profil/
├── index.html     (dari pelajaran HTML)
└── style.css      (yang kita buat sekarang)
\`\`\`

---

## 💻 style.css Lengkap

\`\`\`css
/* ════════════════════════════════════════
   CSS VARIABLES
   ════════════════════════════════════════ */
:root {
  --primer:      #2563eb;
  --primer-soft: #eff6ff;
  --sekunder:    #10b981;
  --bg:          #ffffff;
  --bg-soft:     #f8fafc;
  --bg-kartu:    #ffffff;
  --teks:        #1e293b;
  --teks-soft:   #64748b;
  --border:      #e2e8f0;
  --shadow:      0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg:   0 12px 40px rgba(0,0,0,0.12);
  --radius:      12px;
  --transisi:    0.25s ease;
  --font:        'Segoe UI', system-ui, sans-serif;
  --max-width:   900px;
}

/* Dark mode */
[data-theme="dark"] {
  --bg:        #0f172a;
  --bg-soft:   #1e293b;
  --bg-kartu:  #1e293b;
  --teks:      #f1f5f9;
  --teks-soft: #94a3b8;
  --border:    #334155;
  --shadow:    0 4px 16px rgba(0,0,0,0.4);
}

/* ════════════════════════════════════════
   RESET & BASE
   ════════════════════════════════════════ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;  /* Scroll halus saat klik anchor link */
}

body {
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.6;
  color: var(--teks);
  background-color: var(--bg);
  transition: background-color var(--transisi), color var(--transisi);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--primer);
  text-decoration: none;
  transition: color var(--transisi);
}

a:hover { text-decoration: underline; }

/* ════════════════════════════════════════
   LAYOUT HELPER
   ════════════════════════════════════════ */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
}

/* ════════════════════════════════════════
   DARK MODE TOGGLE
   ════════════════════════════════════════ */
.tema-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  background: var(--bg-kartu);
  border: 1px solid var(--border);
  border-radius: 30px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: var(--shadow);
  transition: all var(--transisi);
}

.tema-toggle:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

/* ════════════════════════════════════════
   HEADER / HERO
   ════════════════════════════════════════ */
header {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: white;
  padding: 60px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Lingkaran dekoratif di background */
header::before {
  content: "";
  position: absolute;
  top: -80px;
  right: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}

header::after {
  content: "";
  position: absolute;
  bottom: -100px;
  left: -60px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}

.foto-profil {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255,255,255,0.5);
  margin: 0 auto 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  animation: muncul 0.6s ease both;
}

header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
  animation: muncul 0.6s ease 0.1s both;
}

header .tagline {
  font-size: 1.1rem;
  opacity: 0.85;
  margin-bottom: 20px;
  animation: muncul 0.6s ease 0.2s both;
}

.header-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: muncul 0.6s ease 0.3s both;
}

.header-links a {
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  padding: 6px 16px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  transition: all var(--transisi);
}

.header-links a:hover {
  background: rgba(255,255,255,0.15);
  text-decoration: none;
}

/* Navigasi */
header nav {
  background: rgba(0,0,0,0.2);
  padding: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

header nav a {
  color: rgba(255,255,255,0.8);
  font-size: 0.85rem;
  padding: 4px 14px;
  border-radius: 4px;
  transition: all var(--transisi);
}

header nav a:hover {
  color: white;
  background: rgba(255,255,255,0.1);
  text-decoration: none;
}

/* ════════════════════════════════════════
   MAIN CONTENT
   ════════════════════════════════════════ */
main {
  padding: 50px 0;
}

section {
  margin-bottom: 50px;
  animation: muncul 0.5s ease both;
}

section h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--teks);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border);
  position: relative;
}

section h2::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: var(--primer);
}

/* ════════════════════════════════════════
   SKILLS TABLE
   ════════════════════════════════════════ */
table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-kartu);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

thead {
  background: var(--primer);
  color: white;
}

th, td {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border);
}

th { font-weight: 600; }

tbody tr:hover {
  background-color: var(--primer-soft);
  transition: background var(--transisi);
}

tbody tr:last-child td { border-bottom: none; }

/* ════════════════════════════════════════
   ARTIKEL (Pengalaman/Pendidikan)
   ════════════════════════════════════════ */
article {
  background: var(--bg-kartu);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 16px;
  border-left: 4px solid var(--primer);
  box-shadow: var(--shadow);
  transition: transform var(--transisi), box-shadow var(--transisi);
}

article:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-lg);
}

article h3 {
  font-size: 1.1rem;
  color: var(--primer);
  margin-bottom: 12px;
}

article h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 16px 0 4px;
}

article p { color: var(--teks-soft); font-size: 0.9rem; margin-bottom: 8px; }
article ul { padding-left: 20px; color: var(--teks-soft); font-size: 0.9rem; }
article li { margin-bottom: 4px; }

/* ════════════════════════════════════════
   FORM KONTAK
   ════════════════════════════════════════ */
form {
  background: var(--bg-kartu);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 16px;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--teks);
  margin-bottom: 4px;
  display: block;
}

input, textarea, select {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--teks);
  transition: border-color var(--transisi), box-shadow var(--transisi);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primer);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}

button[type="submit"] {
  padding: 12px 28px;
  background: var(--primer);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transisi);
  justify-self: start;
}

button[type="submit"]:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.3);
}

/* ════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════ */
footer {
  background: var(--bg-soft);
  border-top: 1px solid var(--border);
  padding: 40px 20px;
  text-align: center;
  color: var(--teks-soft);
  font-size: 0.9rem;
}

footer nav { margin-bottom: 12px; display: flex; gap: 20px; justify-content: center; }
footer nav a { color: var(--teks-soft); }
footer nav a:hover { color: var(--primer); text-decoration: none; }

/* ════════════════════════════════════════
   ANIMASI
   ════════════════════════════════════════ */
@keyframes muncul {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (min-width: 768px) {
  header { padding: 80px 20px 100px; }
  header h1 { font-size: 2.8rem; }

  form {
    grid-template-columns: 1fr 1fr;
  }

  form textarea,
  form button[type="submit"],
  form label:has(+ textarea) {
    grid-column: span 2;
  }
}
\`\`\`

---

## 🔧 Tambahkan Dark Mode Toggle di HTML

\`\`\`html
<!-- Tambahkan di body, sebelum header -->
<button class="tema-toggle" onclick="toggleTema()" title="Toggle Dark Mode">
  🌙
</button>

<!-- Tambahkan di akhir body -->
<script>
  function toggleTema() {
    const html = document.documentElement;
    const btn  = document.querySelector('.tema-toggle');

    if (html.getAttribute('data-theme') === 'dark') {
      html.removeAttribute('data-theme');
      btn.textContent = '🌙';
      localStorage.setItem('tema', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      btn.textContent = '☀️';
      localStorage.setItem('tema', 'dark');
    }
  }

  // Terapkan tema yang disimpan saat halaman dimuat
  if (localStorage.getItem('tema') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelector('.tema-toggle').textContent = '☀️';
  }
</script>
\`\`\`

---

## 📝 Rangkuman Kursus CSS Lengkap

| Modul | Topik |
|-------|-------|
| 1 | Dasar CSS, selector, warna, satuan |
| 2 | Box model, typography, background |
| 3 | Flexbox — layout satu dimensi |
| 4 | CSS Grid & Responsive Design |
| 5 | Variables, transitions, animations, pseudo-elements |
| 6 | Proyek akhir — halaman profil responsif + dark mode |

**Kamu sekarang bisa:**
- Styling elemen dengan presisi menggunakan selector
- Membuat layout dengan Flexbox dan Grid
- Membuat website yang responsif di semua perangkat
- Menambahkan animasi yang halus dan profesional
- Mengimplementasikan dark mode dengan CSS Variables

> **Selamat menyelesaikan kursus CSS! Sekarang kombinasikan HTML + CSS yang sudah kamu kuasai dan mulai belajar JavaScript untuk membuat website yang interaktif!** 🎉🚀
`;
