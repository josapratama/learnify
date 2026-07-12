export const html_l5 = `
# Semantic HTML — HTML yang Lebih Pintar dan Ramah Mesin Pencari

Kamu sudah bisa bikin halaman HTML yang tampil di browser. Bagus! Tapi ada satu hal yang bikin HTML kamu "naik kelas" — yaitu menggunakan **Semantic HTML**.

---

## 🤔 Apa itu Semantic HTML?

**Semantic** artinya "bermakna". Semantic HTML berarti menggunakan tag HTML yang mencerminkan **arti dan fungsi** kontennya — bukan sekadar cara tampilannya.

Analoginya: bayangkan kamu baca buku resep. Kalau semua teksnya sama rata tanpa judul, daftar bahan, dan langkah yang jelas — susah kan? Tapi kalau ada struktur yang jelas, langsung ketahuan mana judulnya, mana bahannya, mana langkahnya.

**Non-semantic (tidak bermakna):**
\`\`\`html
<div id="header">
  <div id="nav">...</div>
</div>
<div id="main">
  <div id="artikel">...</div>
  <div id="sidebar">...</div>
</div>
<div id="footer">...</div>
\`\`\`

**Semantic (bermakna):**
\`\`\`html
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
\`\`\`

Tampilannya sama di browser! Tapi versi semantic lebih baik karena:
- 🔍 **SEO** — Google lebih mudah pahami konten, ranking naik
- ♿ **Accessibility** — screen reader untuk tunanetra bisa navigasi lebih baik
- 👩‍💻 **Readability** — kode lebih mudah dibaca sesama developer
- 🛠️ **Maintainability** — lebih mudah di-maintain jangka panjang

---

## 🏗️ Tag Semantic Utama

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Blog Saya</title>
</head>
<body>

  <!-- HEADER: bagian atas halaman — logo, nama site, tagline -->
  <header>
    <h1>Blog Teknologi Saya</h1>
    <p>Belajar coding itu menyenangkan!</p>

    <!-- NAV: navigasi utama situs -->
    <nav>
      <ul>
        <li><a href="/">Beranda</a></li>
        <li><a href="/artikel">Artikel</a></li>
        <li><a href="/tentang">Tentang</a></li>
        <li><a href="/kontak">Kontak</a></li>
      </ul>
    </nav>
  </header>

  <!-- MAIN: konten utama halaman (hanya boleh SATU per halaman) -->
  <main>

    <!-- SECTION: kelompok konten yang bertema sama -->
    <section id="artikel-terbaru">
      <h2>Artikel Terbaru</h2>

      <!-- ARTICLE: konten mandiri yang bisa berdiri sendiri
           (artikel blog, berita, komentar, produk) -->
      <article>
        <header>
          <h3>Belajar HTML dari Nol</h3>
          <p>Diterbitkan: <time datetime="2024-06-01">1 Juni 2024</time>
             oleh <strong>Budi Santoso</strong></p>
        </header>

        <p>HTML adalah bahasa markup yang digunakan untuk membuat
        struktur halaman web. Setiap website yang kamu kunjungi
        menggunakan HTML sebagai pondasinya...</p>

        <footer>
          <p>Tags: <a href="#">HTML</a>, <a href="#">Web Dev</a></p>
        </footer>
      </article>

      <article>
        <header>
          <h3>CSS untuk Pemula</h3>
          <time datetime="2024-06-15">15 Juni 2024</time>
        </header>
        <p>Setelah belajar HTML, langkah berikutnya adalah CSS
        untuk membuat tampilan website jadi lebih menarik...</p>
      </article>
    </section>

    <!-- ASIDE: konten sampingan yang berkaitan tapi tidak utama
         (sidebar, iklan, info tambahan) -->
    <aside>
      <h3>Artikel Populer</h3>
      <ul>
        <li><a href="#">Tips Belajar Coding</a></li>
        <li><a href="#">Roadmap Web Developer</a></li>
        <li><a href="#">Tools Wajib Developer</a></li>
      </ul>

      <h3>Tentang Saya</h3>
      <p>Saya developer yang suka berbagi ilmu tentang web development.</p>
    </aside>

  </main>

  <!-- FOOTER: bagian bawah halaman — copyright, link tambahan -->
  <footer>
    <p>&copy; 2024 Blog Saya. Semua hak dilindungi.</p>
    <nav>
      <a href="/privasi">Kebijakan Privasi</a> |
      <a href="/syarat">Syarat & Ketentuan</a>
    </nav>
  </footer>

</body>
</html>
\`\`\`

---

## 🔖 Tag Semantic Lainnya

\`\`\`html
<!-- FIGURE & FIGCAPTION: gambar dengan keterangan -->
<figure>
  <img src="diagram-html.png" alt="Diagram struktur HTML">
  <figcaption>Gambar 1: Struktur dasar dokumen HTML</figcaption>
</figure>

<!-- MARK: teks yang di-highlight/ditandai -->
<p>Dalam belajar coding, <mark>konsistensi</mark> adalah kunci utama.</p>

<!-- TIME: waktu/tanggal yang machine-readable -->
<p>Artikel ini diterbitkan pada <time datetime="2024-06-01">1 Juni 2024</time>.</p>

<!-- DETAILS & SUMMARY: konten yang bisa dibuka/tutup -->
<details>
  <summary>Klik untuk lihat penjelasan lengkap</summary>
  <p>Ini adalah penjelasan lengkap yang tersembunyi sampai diklik.
  Berguna untuk FAQ, spoiler, atau info tambahan.</p>
</details>

<!-- ADDRESS: informasi kontak/alamat -->
<address>
  Kantor: Jl. Sudirman No. 123, Jakarta<br>
  Email: <a href="mailto:info@example.com">info@example.com</a><br>
  Telp: <a href="tel:+6221123456">+62 21 123456</a>
</address>

<!-- BLOCKQUOTE: kutipan dari sumber lain -->
<blockquote cite="https://html.spec.whatwg.org">
  <p>HTML is the World Wide Web's core markup language.</p>
  <footer>— HTML Living Standard</footer>
</blockquote>

<!-- CODE: kode pemrograman inline -->
<p>Gunakan tag <code>&lt;h1&gt;</code> untuk judul utama halaman.</p>

<!-- PRE: kode/teks yang menjaga whitespace (spasi dan enter) -->
<pre>
function halo() {
    console.log("Halo Dunia!");
}
</pre>

<!-- ABBR: singkatan dengan penjelasan -->
<p>Saya belajar <abbr title="HyperText Markup Language">HTML</abbr> hari ini.</p>
\`\`\`

---

## 🔍 Meta Tags untuk SEO

Di dalam \`<head>\`, ada tag khusus yang tidak tampil di halaman tapi penting untuk Google:

\`\`\`html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Deskripsi halaman — yang tampil di hasil pencarian Google -->
  <meta name="description" content="Belajar HTML dari nol untuk pemula.
  Tutorial lengkap dan mudah dipahami dengan contoh nyata.">

  <!-- Kata kunci (sudah kurang berpengaruh di Google modern) -->
  <meta name="keywords" content="belajar HTML, tutorial HTML, HTML pemula">

  <!-- Open Graph — untuk tampilan saat dishare di media sosial -->
  <meta property="og:title" content="Belajar HTML dari Nol">
  <meta property="og:description" content="Tutorial HTML untuk pemula">
  <meta property="og:image" content="https://example.com/thumbnail.jpg">
  <meta property="og:url" content="https://example.com/belajar-html">

  <!-- Title di tab browser — penting untuk SEO! -->
  <title>Belajar HTML dari Nol | Blog Teknologi</title>
</head>
\`\`\`

---

## 🎯 Praktik: Revisi Halaman dengan Semantic HTML

Ambil halaman dari praktik sebelumnya dan refactor menggunakan semantic HTML:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Halaman profil pribadi [Nama Kamu]">
  <title>[Nama Kamu] — Profil Pribadi</title>
</head>
<body>

  <header>
    <h1>[Nama Kamu]</h1>
    <p>Sedang belajar web development 🚀</p>
    <nav>
      <a href="#tentang">Tentang</a> |
      <a href="#skills">Skills</a> |
      <a href="#kontak">Kontak</a>
    </nav>
  </header>

  <main>
    <section id="tentang">
      <h2>Tentang Saya</h2>
      <p>Ceritakan dirimu di sini...</p>
    </section>

    <section id="skills">
      <h2>Skills yang Sedang Dipelajari</h2>
      <ul>
        <li>HTML</li>
        <li>CSS (segera!)</li>
        <li>JavaScript (menyusul!)</li>
      </ul>
    </section>
  </main>

  <aside>
    <h3>Quote Favorit</h3>
    <blockquote>
      <p>Perjalanan seribu mil dimulai dari satu langkah kecil.</p>
    </blockquote>
  </aside>

  <footer id="kontak">
    <h2>Kontak</h2>
    <address>
      Email: <a href="mailto:kamu@email.com">kamu@email.com</a>
    </address>
    <p>&copy; 2024 [Nama Kamu]</p>
  </footer>

</body>
</html>
\`\`\`

---

## ✅ Rangkuman

Tag semantic yang wajib kamu kuasai:
- \`<header>\` — kepala halaman atau seksi
- \`<nav>\` — navigasi
- \`<main>\` — konten utama (satu per halaman)
- \`<section>\` — kelompok konten bertema
- \`<article>\` — konten mandiri (artikel, berita)
- \`<aside>\` — konten sampingan/sidebar
- \`<footer>\` — kaki halaman atau seksi
- \`<figure>\` + \`<figcaption>\` — gambar dengan keterangan
- \`<time>\` — tanggal/waktu yang machine-readable

> **Pelajaran terakhir HTML: Proyek akhir — bangun halaman profil personal yang lengkap!** 🚀
`;
