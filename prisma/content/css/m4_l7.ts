export const css_l7 = `
# Position & Z-Index — Susun Elemen di Mana Saja

Selama ini kita susun elemen mengikuti alur normal dokumen dari atas ke bawah. Tapi bagaimana kalau mau buat **navbar yang nempel di atas saat scroll**, **modal dialog yang tampil di tengah layar**, atau **badge notifikasi di pojok atas tombol**? Itu semua butuh \`position\`.

---

## 📍 Position: 5 Nilai yang Wajib Dipahami

\`\`\`css
/* static — DEFAULT. Ikut aliran normal dokumen */
.normal {
  position: static;
  /* top/right/bottom/left TIDAK BERPENGARUH di sini */
}

/* relative — TETAP di aliran normal, tapi bisa digeser dari posisi aslinya */
.kartu {
  position: relative;
  top: 10px;     /* Geser 10px ke bawah dari posisi normalnya */
  left: 20px;    /* Geser 20px ke kanan */
  /* Ruang aslinya MASIH ADA — elemen lain tidak bergerak */
}

/* absolute — KELUAR dari aliran normal, posisi relatif terhadap parent 'relative' */
.badge {
  position: absolute;
  top: -8px;     /* 8px dari atas parent */
  right: -8px;   /* 8px dari kanan parent */
  /* Mencari parent terdekat yang punya position: relative/absolute/fixed */
  /* Kalau tidak ada, posisi relatif ke <html> */
}

/* fixed — seperti absolute, tapi RELATIF ke VIEWPORT (layar) */
/* Tidak bergerak saat scroll! */
.navbar-tetap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;   /* Tampil di atas elemen lain */
}

/* sticky — hybrid antara relative dan fixed */
/* Normal di aliran dokumen, tapi "menempel" saat mencapai batas yang ditentukan */
.header-tabel {
  position: sticky;
  top: 0;    /* Menempel di atas saat discroll sampai ke top */
  background: white;
  z-index: 10;
}
\`\`\`

---

## 🃏 Z-Index — Siapa yang di Atas?

\`\`\`css
/* Z-index menentukan urutan "tumpukan" elemen yang overlap */
/* Hanya bekerja pada elemen yang punya position selain static */
/* Makin besar nilainya, makin di atas */

.layer-bawah  { z-index: 1; position: relative; }
.layer-tengah { z-index: 10; position: relative; }
.layer-atas   { z-index: 100; position: relative; }

/* Konvensi z-index yang umum dipakai: */
:root {
  --z-konten:     1;
  --z-dropdown:   10;
  --z-sticky:     20;
  --z-overlay:    40;
  --z-modal:      50;
  --z-toast:      60;
  --z-tooltip:    70;
  --z-navbar:     100;
}

/* Stacking context — z-index hanya berlaku dalam "konteks" yang sama */
/* Elemen baru membuat stacking context kalau punya: position+z-index, opacity<1, transform, dll. */
\`\`\`

---

## 🎨 Pola-pola Position yang Sering Dipakai

\`\`\`css
/* ─── 1. Badge di pojok elemen ─── */
.tombol-notif {
  position: relative;   /* Parent untuk badge */
  display: inline-block;
}

.badge-notif {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: #dc2626;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── 2. Overlay di atas gambar ─── */
.kartu-gambar {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.kartu-gambar img {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.kartu-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  transform: translateY(100%);   /* Tersembunyi di bawah */
  transition: transform 0.3s ease;
}

.kartu-gambar:hover img {
  transform: scale(1.05);
}

.kartu-gambar:hover .kartu-overlay {
  transform: translateY(0);   /* Muncul saat hover */
}

/* ─── 3. Tengahkan absolute di dalam relative ─── */
.container-tengah {
  position: relative;
  width: 300px;
  height: 200px;
  background: #e2e8f0;
}

.elemen-tengah {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);   /* Geser balik setengah ukurannya */
}

/* ─── 4. Tooltip ─── */
.dengan-tooltip {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: var(--z-tooltip);
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1e293b;   /* Segitiga kecil di bawah tooltip */
}

.dengan-tooltip:hover .tooltip {
  opacity: 1;
}
\`\`\`

---

## 🪟 Modal Dialog

\`\`\`css
/* Overlay gelap di belakang modal */
.modal-overlay {
  position: fixed;
  inset: 0;          /* Shorthand untuk top:0 right:0 bottom:0 left:0 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.modal-overlay.aktif {
  opacity: 1;
  pointer-events: all;
}

/* Box modal itu sendiri */
.modal-box {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(-20px);
  transition: transform 0.25s ease;
}

.modal-overlay.aktif .modal-box {
  transform: scale(1) translateY(0);
}
\`\`\`

---

## 🎯 Praktik: Navbar Sticky + Card dengan Badge + Tooltip

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Position Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; }

    /* Navbar sticky */
    .navbar {
      position: sticky;
      top: 0;
      background: #1e293b;
      color: white;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    /* Tombol dengan badge notifikasi */
    .btn-notif {
      position: relative;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      background: #dc2626;
      border-radius: 50%;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tooltip */
    [data-tooltip] { position: relative; }
    [data-tooltip]::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 120%;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s;
    }
    [data-tooltip]:hover::before { opacity: 1; }

    /* Card dengan hover overlay */
    .hero-card {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      width: 280px;
      height: 200px;
      background: #64748b;
      margin: 40px auto;
    }

    .hero-card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.7);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .hero-card:hover .hero-card-overlay { opacity: 1; }

    /* Spacer buat demo scroll */
    .spacer { height: 150px; background: #f1f5f9; margin: 16px; border-radius: 8px; }
  </style>
</head>
<body>

  <nav class="navbar">
    <span>🚀 Logo</span>
    <div>
      <button class="btn-notif" data-tooltip="Kamu punya 3 notifikasi baru">
        🔔 Notifikasi
        <span class="badge">3</span>
      </button>
    </div>
  </nav>

  <div class="spacer"></div>
  <p style="text-align:center">Scroll ke bawah — navbar tetap di atas!</p>
  <div class="spacer"></div>
  <div class="spacer"></div>

  <div class="hero-card">
    <div style="padding:20px;color:white">
      <h3>Kursus HTML & CSS</h3>
      <p>Hover di sini!</p>
    </div>
    <div class="hero-card-overlay">
      <button>Daftar Sekarang →</button>
    </div>
  </div>

  <div class="spacer"></div>
  <div class="spacer"></div>

</body>
</html>
\`\`\`

---

## ✅ Rangkuman

- **static**: default, ikut aliran normal
- **relative**: bisa digeser, ruang asli tetap ada, jadi "anchor" untuk absolute children
- **absolute**: keluar aliran, posisi relatif ke parent \`relative\` terdekat
- **fixed**: menempel ke viewport (layar), tidak bergerak saat scroll
- **sticky**: hybrid — normal lalu "nempel" saat scroll mencapai batas
- **z-index**: urutan tumpukan, hanya bekerja pada positioned elements

> **Selanjutnya: CSS Transform & Filter — efek visual yang bikin website terasa premium!** 🚀
`;
