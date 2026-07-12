export const css_l8 = `
# CSS Transform & Filter — Efek Visual yang Bikin Website Premium

Ini bagian yang paling seru dari CSS! \`transform\` dan \`filter\` bisa bikin halaman web kamu terasa seperti hasil desain profesional — dengan animasi yang halus, efek hover yang menarik, dan visual yang kaya.

---

## 🔄 CSS Transform

Transform mengubah tampilan elemen **tanpa mempengaruhi layout** (elemen lain tidak bergerak).

\`\`\`css
/* ─── Translate — geser posisi ─── */
.geser-kanan    { transform: translateX(50px); }      /* Geser 50px ke kanan */
.geser-bawah    { transform: translateY(20px); }      /* Geser 20px ke bawah */
.geser-diagonal { transform: translate(30px, -10px); }/* Kanan 30, atas 10 */
.tengah         { transform: translate(-50%, -50%); } /* Trik centering! */

/* ─── Scale — perbesar/perkecil ─── */
.perbesar   { transform: scale(1.2); }          /* 120% dari ukuran asli */
.perkecil   { transform: scale(0.8); }          /* 80% dari ukuran asli */
.stretch    { transform: scale(1.5, 0.8); }     /* Lebar 150%, tinggi 80% */

/* ─── Rotate — putar ─── */
.putar-45   { transform: rotate(45deg); }       /* Putar 45 derajat searah jarum jam */
.putar-kiri { transform: rotate(-90deg); }      /* Putar 90 derajat berlawanan */
.putar-3d   { transform: rotateY(180deg); }     /* Flip horizontal (3D!) */

/* ─── Skew — miringkan ─── */
.miring      { transform: skewX(15deg); }
.miring-dua  { transform: skew(10deg, 5deg); }

/* ─── Gabungkan — urutan penting! ─── */
.combo {
  transform: translateX(20px) scale(1.1) rotate(5deg);
  /* Dieksekusi dari kanan ke kiri */
}

/* transform-origin — titik pusat transformasi */
.putar-dari-kiri {
  transform-origin: left center;   /* Default: center center */
  transform: rotate(45deg);
}

.zoom-dari-kiri-atas {
  transform-origin: top left;
  transform: scale(1.2);
}
\`\`\`

---

## 🎨 CSS Filter

\`\`\`css
/* Filter mengubah tampilan visual elemen */

/* Blur — kaburkan */
.kabur            { filter: blur(4px); }
.kabur-sedikit    { filter: blur(1px); }

/* Brightness — kecerahan */
.gelap            { filter: brightness(0.5); }    /* 50% kecerahan */
.terang           { filter: brightness(1.5); }    /* 150% kecerahan */

/* Contrast */
.kontras-tinggi   { filter: contrast(2); }        /* 200% kontras */

/* Grayscale — hitam putih */
.hitam-putih      { filter: grayscale(100%); }    /* Full grayscale */
.sedikit-abu      { filter: grayscale(50%); }

/* Sepia — efek foto tua */
.foto-vintage     { filter: sepia(80%); }

/* Hue-rotate — putar rona warna */
.warna-beda       { filter: hue-rotate(90deg); }

/* Saturate — kejenuhan warna */
.warna-mencolok   { filter: saturate(200%); }
.warna-pudar      { filter: saturate(50%); }

/* Drop-shadow — bayangan yang mengikuti bentuk elemen (berbeda dari box-shadow!) */
/* Cocok untuk PNG transparan */
.bayangan-png     { filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.5)); }

/* Gabungkan beberapa filter */
.efek-retro {
  filter: sepia(50%) contrast(1.2) brightness(1.1);
}

/* backdrop-filter — filter pada background di belakang elemen */
/* Efek kaca/frosted glass! */
.kaca {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px);   /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
}
\`\`\`

---

## 🎴 Efek Card dengan Transform + Filter

\`\`\`css
/* ─── Hover card yang naik dan glow ─── */
.kartu-hover {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.kartu-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(37, 99, 235, 0.2);
}

/* ─── Gambar dengan efek hover ─── */
.gambar-hover-container {
  overflow: hidden;
  border-radius: 12px;
}

.gambar-hover {
  width: 100%;
  transition:
    transform 0.4s ease,
    filter 0.4s ease;
}

.gambar-hover:hover {
  transform: scale(1.08);
  filter: brightness(1.1) saturate(1.2);
}

/* ─── Gambar grayscale → warna saat hover ─── */
.gambar-profile {
  filter: grayscale(100%);
  transition: filter 0.4s ease;
}

.gambar-profile:hover {
  filter: grayscale(0%);
}

/* ─── Frosted glass card ─── */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  color: white;
}

/* ─── 3D Flip Card ─── */
.flip-container {
  perspective: 1000px;    /* Kedalaman 3D */
  width: 280px;
  height: 200px;
}

.flip-card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;   /* Children juga dalam ruang 3D */
  transition: transform 0.6s ease;
}

.flip-container:hover .flip-card {
  transform: rotateY(180deg);
}

.flip-depan, .flip-belakang {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;    /* Sembunyikan sisi belakang */
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-depan { background: #2563eb; color: white; }

.flip-belakang {
  background: #10b981;
  color: white;
  transform: rotateY(180deg);   /* Sudah "dibalik" dari awal */
}
\`\`\`

---

## 🎯 Praktik: Galeri Foto dengan Efek

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Galeri Foto</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; padding: 40px; font-family: sans-serif; }

    .galeri {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }

    .foto-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      cursor: pointer;
    }

    .foto-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(30%) brightness(0.9);
      transition: transform 0.4s ease, filter 0.4s ease;
    }

    .foto-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0,0,0,0.8));
      padding: 16px;
      display: flex;
      align-items: flex-end;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .foto-overlay h3 {
      color: white;
      font-size: 0.95rem;
      transform: translateY(10px);
      transition: transform 0.3s;
    }

    .foto-item:hover img {
      transform: scale(1.08);
      filter: grayscale(0%) brightness(1);
    }

    .foto-item:hover .foto-overlay {
      opacity: 1;
    }

    .foto-item:hover .foto-overlay h3 {
      transform: translateY(0);
    }

    /* Glass header */
    .galeri-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .badge-glass {
      display: inline-block;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }

    h1 { color: white; font-size: 2rem; }
  </style>
</head>
<body>
  <div class="galeri-header">
    <span class="badge-glass">✨ Portofolio</span>
    <h1>Galeri Foto Saya</h1>
  </div>

  <div class="galeri">
    <div class="foto-item">
      <!-- Pakai placeholder jika belum ada foto asli -->
      <img src="https://picsum.photos/400/300?random=1" alt="Foto alam 1" loading="lazy">
      <div class="foto-overlay"><h3>Petualangan di Alam</h3></div>
    </div>
    <div class="foto-item">
      <img src="https://picsum.photos/400/300?random=2" alt="Foto kota" loading="lazy">
      <div class="foto-overlay"><h3>Keindahan Kota</h3></div>
    </div>
    <div class="foto-item">
      <img src="https://picsum.photos/400/300?random=3" alt="Foto sunset" loading="lazy">
      <div class="foto-overlay"><h3>Sunset yang Memukau</h3></div>
    </div>
    <div class="foto-item">
      <img src="https://picsum.photos/400/300?random=4" alt="Foto kuliner" loading="lazy">
      <div class="foto-overlay"><h3>Kuliner Nusantara</h3></div>
    </div>
  </div>
</body>
</html>
\`\`\`

---

## ✅ Rangkuman

**Transform:**
- \`translate(x, y)\` — geser posisi
- \`scale(n)\` — perbesar/perkecil
- \`rotate(deg)\` — putar
- \`skew(deg)\` — miringkan
- Gabungkan: \`transform: translateY(-8px) scale(1.02)\`

**Filter:**
- \`blur()\`, \`brightness()\`, \`contrast()\`, \`grayscale()\`
- \`sepia()\`, \`hue-rotate()\`, \`saturate()\`, \`drop-shadow()\`
- \`backdrop-filter\` — efek frosted glass/kaca

> **Selanjutnya: CSS Modern — container queries, :has(), dan fitur terbaru CSS!** 🚀
`;
