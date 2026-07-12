export const html_l8 = `
# HTML5 APIs & Accessibility — Fitur Modern yang Bikin Website Lebih Pintar

HTML5 bukan hanya soal tag baru. Ada banyak **API** (antarmuka pemrograman) yang dibangun langsung ke browser — tanpa install apapun. Dan ada satu hal yang sering dilupakan tapi sangat penting: **Accessibility** (kemudahan akses untuk semua orang).

---

## 🌍 Kenapa Accessibility Penting?

Bayangkan kamu buat website yang bagus, tapi ada pengguna yang buta dan pakai screen reader (pembaca layar). Kalau HTML-mu tidak semantic dan tidak punya teks alt yang benar, mereka tidak bisa pakai websitemu sama sekali.

Di Indonesia saja ada jutaan penyandang disabilitas. Accessibility itu bukan kemewahan — ini hak dasar semua orang untuk bisa mengakses internet.

Plus: **website yang accessible juga lebih bagus untuk SEO!**

---

## ♿ ARIA — Accessible Rich Internet Applications

\`\`\`html
<!-- ARIA attributes menambahkan informasi semantic untuk screen reader -->

<!-- role — definisikan peran elemen -->
<div role="navigation" aria-label="Menu Utama">
  <ul>
    <li><a href="/">Beranda</a></li>
    <li><a href="/kursus">Kursus</a></li>
  </ul>
</div>

<!-- aria-label — teks alternatif untuk elemen tanpa teks visible -->
<button aria-label="Tutup dialog">✕</button>
<input type="search" aria-label="Cari kursus">

<!-- aria-labelledby — tunjuk ke elemen lain sebagai label -->
<h2 id="judul-form">Form Pendaftaran</h2>
<form aria-labelledby="judul-form">
  ...
</form>

<!-- aria-describedby — tunjuk ke elemen yang mendeskripsikan -->
<input
  type="password"
  id="password"
  aria-describedby="password-petunjuk"
>
<p id="password-petunjuk">Minimal 8 karakter, harus ada angka dan huruf kapital</p>

<!-- aria-hidden — sembunyikan dari screen reader (icon dekoratif) -->
<button>
  <span aria-hidden="true">🛒</span>
  Tambah ke Keranjang
</button>

<!-- aria-live — umumkan perubahan konten dinamis -->
<div aria-live="polite" id="status-pesan">
  <!-- Pesan notifikasi dinamis di sini -->
</div>

<!-- aria-expanded — untuk dropdown/accordion -->
<button
  aria-expanded="false"
  aria-controls="dropdown-menu"
  id="dropdown-btn"
>
  Menu ▼
</button>
<ul id="dropdown-menu" aria-labelledby="dropdown-btn">
  <li><a href="#">Item 1</a></li>
</ul>

<!-- aria-current — tandai item aktif di navigasi -->
<nav>
  <a href="/" aria-current="page">Beranda</a>
  <a href="/kursus">Kursus</a>
  <a href="/tentang">Tentang</a>
</nav>
\`\`\`

---

## 🎯 Focus Management & Keyboard Navigation

\`\`\`html
<!-- tabindex — kontrol urutan fokus keyboard (Tab) -->

<!-- tabindex="0" — ikut urutan alami DOM -->
<div tabindex="0" role="button" onclick="klik()">Klik atau Enter</div>

<!-- tabindex="-1" — bisa difokus via JS, tidak masuk Tab order -->
<div id="modal" tabindex="-1">
  <!-- Modal dialog -->
</div>

<!-- Hindari tabindex > 0, itu mengacaukan urutan alami! -->

<!-- Skip link — loncat ke konten utama (sangat membantu keyboard user) -->
<body>
  <a href="#konten-utama" class="skip-link">
    Lewati navigasi, ke konten utama
  </a>

  <nav>
    <!-- Navigasi panjang... -->
  </nav>

  <main id="konten-utama" tabindex="-1">
    <h1>Konten utama di sini</h1>
  </main>
</body>

<!-- CSS untuk skip link (tersembunyi kecuali difokus) -->
<style>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 0;
  }
  .skip-link:focus {
    top: 0;
  }
</style>
\`\`\`

---

## 📍 Geolocation API

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Geolocation Demo</title>
</head>
<body>
  <h1>Lokasi Saya</h1>
  <button onclick="cariLokasi()">📍 Temukan Lokasi Saya</button>
  <div id="hasil"></div>

  <script>
    function cariLokasi() {
      const hasil = document.getElementById('hasil');

      // Cek apakah browser support Geolocation
      if (!navigator.geolocation) {
        hasil.textContent = 'Browser tidak mendukung Geolocation.';
        return;
      }

      hasil.textContent = 'Mencari lokasi...';

      navigator.geolocation.getCurrentPosition(
        // Success callback
        function(posisi) {
          const lat = posisi.coords.latitude;
          const lon = posisi.coords.longitude;
          hasil.innerHTML = \`
            <p>✅ Lokasi ditemukan!</p>
            <p>Latitude: \${lat.toFixed(6)}</p>
            <p>Longitude: \${lon.toFixed(6)}</p>
            <p>Akurasi: ±\${Math.round(posisi.coords.accuracy)}m</p>
            <a
              href="https://maps.google.com/?q=\${lat},\${lon}"
              target="_blank"
            >Buka di Google Maps</a>
          \`;
        },
        // Error callback
        function(error) {
          const pesan = {
            1: 'Izin akses lokasi ditolak.',
            2: 'Informasi lokasi tidak tersedia.',
            3: 'Permintaan lokasi timeout.'
          };
          hasil.textContent = '❌ ' + (pesan[error.code] || 'Error tidak dikenal');
        }
      );
    }
  </script>
</body>
</html>
\`\`\`

---

## 💾 Local Storage & Session Storage

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Storage Demo</title>
</head>
<body>
  <h1>Simpan Preferensi Pengguna</h1>

  <label>
    Tema:
    <select id="pilihanTema" onchange="simpanTema()">
      <option value="terang">Terang</option>
      <option value="gelap">Gelap</option>
    </select>
  </label>

  <label>
    Nama:
    <input type="text" id="namaPengguna" oninput="simpanNama()">
  </label>

  <button onclick="hapusSemua()">🗑️ Hapus Semua Data</button>

  <script>
    // localStorage = data TETAP ada walau browser ditutup
    // sessionStorage = data HILANG saat tab/browser ditutup

    // Simpan data
    function simpanTema() {
      const tema = document.getElementById('pilihanTema').value;
      localStorage.setItem('tema', tema);       // key, value (selalu string)
      terapkanTema(tema);
    }

    function simpanNama() {
      const nama = document.getElementById('namaPengguna').value;
      localStorage.setItem('namaPengguna', nama);
    }

    // Ambil data
    function muatPreferensi() {
      const tema = localStorage.getItem('tema');
      const nama = localStorage.getItem('namaPengguna');

      if (tema) {
        document.getElementById('pilihanTema').value = tema;
        terapkanTema(tema);
      }
      if (nama) {
        document.getElementById('namaPengguna').value = nama;
      }
    }

    // Simpan objek (harus JSON.stringify dulu)
    const pengaturan = { fontSize: 16, bahasa: 'id', notifikasi: true };
    localStorage.setItem('pengaturan', JSON.stringify(pengaturan));

    // Baca objek
    const tersimpan = JSON.parse(localStorage.getItem('pengaturan') || '{}');
    console.log(tersimpan.fontSize);   // 16

    // Hapus
    function hapusSemua() {
      localStorage.clear();
      location.reload();
    }

    function terapkanTema(tema) {
      document.body.style.backgroundColor = tema === 'gelap' ? '#1a1a1a' : '#ffffff';
      document.body.style.color = tema === 'gelap' ? '#ffffff' : '#000000';
    }

    // Muat preferensi saat halaman pertama kali dimuat
    muatPreferensi();
  </script>
</body>
</html>
\`\`\`

---

## 📋 Clipboard API & Share API

\`\`\`html
<button onclick="salinTeks()">📋 Salin Kode Referral</button>
<span id="kodeReferral">BUDI2024</span>
<span id="statusSalin"></span>

<!-- Web Share API — bagikan konten ke aplikasi native (WhatsApp, dll.) -->
<button onclick="bagikan()" id="tombolBagikan" style="display:none;">
  📤 Bagikan
</button>

<script>
  async function salinTeks() {
    const teks = document.getElementById('kodeReferral').textContent;
    const status = document.getElementById('statusSalin');

    try {
      await navigator.clipboard.writeText(teks);
      status.textContent = '✅ Berhasil disalin!';
      setTimeout(() => { status.textContent = ''; }, 2000);
    } catch {
      // Fallback untuk browser lama
      const input = document.createElement('input');
      input.value = teks;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      status.textContent = '✅ Disalin!';
    }
  }

  // Tampilkan tombol share hanya kalau browser support Web Share API
  if (navigator.share) {
    document.getElementById('tombolBagikan').style.display = 'inline-block';
  }

  async function bagikan() {
    try {
      await navigator.share({
        title: 'Kursus HTML Gratis',
        text: 'Aku lagi belajar HTML! Ikutan yuk.',
        url: window.location.href,
      });
    } catch (err) {
      console.log('Dibatalkan atau error:', err);
    }
  }
</script>
\`\`\`

---

## 🎯 Praktik: Form Aksesibel yang Benar

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Form Aksesibel</title>
  <style>
    /* Skip link */
    .skip-link { position: absolute; top: -100%; }
    .skip-link:focus { top: 0; background: #000; color: #fff; padding: 8px; z-index: 100; }

    /* Indikator fokus yang jelas */
    *:focus { outline: 3px solid #2563eb; outline-offset: 2px; }

    /* Error state */
    input[aria-invalid="true"] { border-color: red; }
    .error-msg { color: red; font-size: 0.875rem; }

    /* Required indicator */
    label[for] .wajib { color: red; margin-left: 4px; }
  </style>
</head>
<body>
  <a href="#form-daftar" class="skip-link">Ke form pendaftaran</a>

  <main>
    <h1>Daftar Kursus</h1>

    <form id="form-daftar" aria-labelledby="judul-form" novalidate>
      <h2 id="judul-form">Formulir Pendaftaran</h2>
      <p>Kolom bertanda <span aria-hidden="true">*</span>
         <span class="sr-only">bintang</span> wajib diisi.</p>

      <div class="field">
        <label for="nama">
          Nama Lengkap
          <span aria-hidden="true" class="wajib">*</span>
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          required
          aria-required="true"
          aria-describedby="nama-error"
          autocomplete="name"
        >
        <span id="nama-error" class="error-msg" role="alert" aria-live="polite"></span>
      </div>

      <div class="field">
        <label for="email">
          Email
          <span aria-hidden="true" class="wajib">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-required="true"
          aria-describedby="email-hint email-error"
          autocomplete="email"
        >
        <span id="email-hint" class="hint">Contoh: nama@email.com</span>
        <span id="email-error" class="error-msg" role="alert" aria-live="polite"></span>
      </div>

      <button type="submit">Daftar Sekarang</button>
    </form>
  </main>
</body>
</html>
\`\`\`

---

## ✅ Rangkuman

- **ARIA**: \`role\`, \`aria-label\`, \`aria-describedby\`, \`aria-live\` — informasi tambahan untuk screen reader
- **tabindex**: kontrol navigasi keyboard (\`0\` = ikut alami, \`-1\` = fokus via JS saja)
- **Skip link**: tombol "lewati navigasi" untuk keyboard user
- **Geolocation API**: ambil posisi GPS pengguna (butuh izin)
- **localStorage**: simpan data di browser permanen
- **sessionStorage**: simpan data di browser sampai tab ditutup
- **Clipboard API**: salin teks ke clipboard
- **Web Share API**: bagikan konten ke aplikasi native

> **Pelajaran terakhir HTML: Proyek komprehensif — website multi-halaman yang lengkap!** 🚀
`;
