export const html_l7 = `
# Multimedia di HTML — Video, Audio, dan Embed Konten

Website modern bukan cuma teks dan gambar. Video tutorial, podcast, peta interaktif, dan konten dari platform lain adalah bagian yang tak terpisahkan dari web hari ini. Di sini kita pelajari cara menambahkan semua itu ke halaman HTML.

---

## 🎬 Video HTML5

\`\`\`html
<!-- Video dasar -->
<video width="640" height="360" controls>
  <source src="video-tutorial.mp4" type="video/mp4">
  <source src="video-tutorial.webm" type="video/webm">
  <!-- Fallback kalau browser tidak support video -->
  <p>Browser kamu tidak mendukung tag video.
     <a href="video-tutorial.mp4">Download videonya di sini.</a>
  </p>
</video>

<!-- Atribut video yang berguna: -->
<video
  src="intro.mp4"
  controls        <!-- Tampilkan kontrol play/pause/volume/fullscreen -->
  autoplay        <!-- Otomatis play saat halaman dimuat -->
  muted           <!-- Tanpa suara (wajib kalau mau autoplay di kebanyakan browser) -->
  loop            <!-- Ulangi dari awal setelah selesai -->
  poster="thumbnail.jpg"   <!-- Gambar yang tampil sebelum video diplay -->
  preload="metadata"       <!-- none/metadata/auto: seberapa banyak preload -->
  width="100%"
  style="border-radius: 12px;"
>
</video>
\`\`\`

---

## 🎵 Audio HTML5

\`\`\`html
<!-- Audio dasar -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
  <source src="podcast.ogg" type="audio/ogg">
  Browser kamu tidak mendukung audio HTML5.
</audio>

<!-- Playlist audio sederhana -->
<div class="pemutar-audio">
  <h3>🎵 Podcast Episode 1</h3>
  <audio
    id="audioPlayer"
    controls
    src="episode1.mp3"
    style="width: 100%"
  ></audio>
  <p>Durasi: 45 menit | Format: MP3</p>
</div>

<!-- Kumpulan episode -->
<ul class="daftar-episode">
  <li>
    <strong>Ep. 1:</strong> Belajar HTML dari Nol
    <audio controls src="ep1.mp3"></audio>
  </li>
  <li>
    <strong>Ep. 2:</strong> CSS untuk Pemula
    <audio controls src="ep2.mp3"></audio>
  </li>
</ul>
\`\`\`

---

## 🗺️ Embed Peta Google Maps

\`\`\`html
<!-- Cara mudah: ambil kode embed dari Google Maps -->
<!-- Buka Google Maps → Cari lokasi → Share → Embed a map → Copy kode HTML -->

<div class="peta-container">
  <h3>Lokasi Kantor Kami</h3>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
    width="100%"
    height="400"
    style="border:0; border-radius: 12px;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="Peta lokasi kantor"
  ></iframe>
  <address>
    <p>📍 Jl. Sudirman No. 123, Jakarta Pusat</p>
    <p>📞 (021) 555-1234</p>
  </address>
</div>
\`\`\`

---

## 📺 Embed YouTube

\`\`\`html
<!-- Buka video YouTube → Share → Embed → Copy kode -->

<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/VIDEO_ID_HERE"
    title="Judul Video Tutorial"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

<!-- Teknik padding-bottom: 56.25% membuat iframe responsive -->
<!-- 56.25% = 9/16 = rasio aspek 16:9 (standar HD) -->
\`\`\`

---

## 🖼️ Picture & Responsive Images

\`\`\`html
<!-- <picture> = tampilkan gambar berbeda sesuai kondisi -->

<!-- Gambar berbeda untuk layar berbeda -->
<picture>
  <source media="(min-width: 1024px)" srcset="hero-desktop.jpg">
  <source media="(min-width: 768px)"  srcset="hero-tablet.jpg">
  <img src="hero-mobile.jpg" alt="Hero banner" loading="lazy">
  <!-- <img> adalah fallback wajib -->
</picture>

<!-- Format modern (WebP) dengan fallback -->
<picture>
  <source type="image/webp" srcset="produk.webp">
  <source type="image/jpeg" srcset="produk.jpg">
  <img src="produk.jpg" alt="Foto produk" width="400" height="300">
</picture>

<!-- srcset & sizes untuk gambar responsive -->
<img
  src="foto-400.jpg"
  srcset="
    foto-400.jpg  400w,
    foto-800.jpg  800w,
    foto-1200.jpg 1200w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    33vw
  "
  alt="Foto yang responsive"
  loading="lazy"
>
<!-- Browser pilih otomatis ukuran yang paling efisien! -->
\`\`\`

---

## ⚡ Optimasi Loading

\`\`\`html
<!-- loading="lazy" — gambar/iframe tidak dimuat sampai hampir terlihat -->
<img src="foto-jauh-bawah.jpg" alt="Foto" loading="lazy">
<iframe src="..." loading="lazy"></iframe>

<!-- Preload konten penting -->
<head>
  <!-- Preload font yang dipakai di atas halaman -->
  <link rel="preload" href="font-utama.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Preload gambar hero (tampil pertama kali) -->
  <link rel="preload" as="image" href="hero.jpg">

  <!-- Prefetch halaman yang kemungkinan dikunjungi selanjutnya -->
  <link rel="prefetch" href="/halaman-berikutnya.html">
</head>

<!-- width & height pada img — penting untuk CLS (Cumulative Layout Shift)! -->
<!-- Browser tahu ukurannya sebelum gambar dimuat → tidak ada "lompatan" layout -->
<img src="foto.jpg" alt="Foto" width="800" height="600" loading="lazy">
\`\`\`

---

## 🎯 Praktik: Halaman Portofolio dengan Video

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portofolio — Budi Santoso</title>
</head>
<body>

  <header>
    <h1>Portofolio Video Saya</h1>
  </header>

  <main>
    <!-- Demo proyek dengan video -->
    <section>
      <h2>Demo Proyek Terbaru</h2>
      <article>
        <h3>Aplikasi Kalkulator Web</h3>
        <video controls poster="thumbnail-kalkulator.jpg" width="100%">
          <source src="demo-kalkulator.mp4" type="video/mp4">
          <p>Browser tidak mendukung video. <a href="demo-kalkulator.mp4">Download</a></p>
        </video>
        <p>Kalkulator web yang dibuat dengan HTML, CSS, dan JavaScript murni.</p>
      </article>
    </section>

    <!-- Tutorial dari YouTube -->
    <section>
      <h2>Tutorial yang Saya Rekomendasikan</h2>
      <div class="video-wrapper" style="position:relative; padding-bottom:56.25%; height:0;">
        <iframe
          style="position:absolute; top:0; left:0; width:100%; height:100%;"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Tutorial HTML Terbaik"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </section>

    <!-- Podcast tentang coding -->
    <section>
      <h2>Podcast Belajar Coding</h2>
      <article>
        <h3>Episode 1: Mulai Belajar HTML</h3>
        <audio controls style="width:100%">
          <source src="podcast-ep1.mp3" type="audio/mpeg">
        </audio>
      </article>
    </section>

    <!-- Lokasi workshop -->
    <section>
      <h2>Lokasi Workshop</h2>
      <iframe
        src="https://www.google.com/maps/embed?pb=..."
        width="100%"
        height="350"
        style="border:0; border-radius:8px;"
        allowfullscreen=""
        loading="lazy"
        title="Lokasi Workshop"
      ></iframe>
    </section>
  </main>

</body>
</html>
\`\`\`

---

## ✅ Rangkuman

- \`<video controls src="...">\` — embed video dengan kontrol standar
- \`<audio controls src="...">\` — embed audio/podcast
- \`<iframe>\` — embed konten eksternal (YouTube, Maps, dll.)
- \`<picture>\` — gambar adaptif berdasarkan ukuran layar atau format
- \`loading="lazy"\` — defer loading untuk performa lebih baik
- Selalu tambahkan \`width\` dan \`height\` pada gambar untuk stabilitas layout

> **Selanjutnya: HTML5 APIs & Accessibility — fitur modern HTML yang sering terlupakan!** 🚀
`;
