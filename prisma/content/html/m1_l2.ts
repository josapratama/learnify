export const html_l2 = `
# Teks, Link, Gambar & Daftar — Bikin Halaman Makin Hidup!

Di pelajaran sebelumnya kamu sudah bisa bikin kerangka HTML dasar. Sekarang kita "isi rumahnya" dengan konten yang lebih kaya — teks yang bisa diformat, link yang bisa diklik, gambar, dan daftar. Siap? Let's go! 🚀

---

## ✍️ Memformat Teks: Tebal, Miring, dan Lainnya

### Tag \`<strong>\` — Teks Tebal (dan Penting!)

\`\`\`html
<p>Jangan lupa <strong>simpan file</strong> sebelum menutup editor!</p>
\`\`\`

Tag \`<strong>\` membuat teks jadi **tebal**. Tapi bukan cuma soal tampilan — tag ini juga bilang ke browser dan screen reader bahwa teks ini **penting secara semantik**.

**Perbedaan dengan \`<b>\`:**
- \`<strong>\` = tebal + bermakna penting
- \`<b>\` = tebal biasa (hanya tampilan)

Untuk pemula, pakai \`<strong>\` karena lebih "benar" secara HTML modern.

### Tag \`<em>\` — Teks Miring (Emphasis)

\`\`\`html
<p>Kata kuncinya adalah <em>konsistensi</em> dalam belajar.</p>
\`\`\`

Tag \`<em>\` membuat teks jadi *miring* (italic). Sama seperti \`<strong>\`, ini punya makna semantik: teks yang perlu ditekankan dalam pembacaan.

**Perbedaan dengan \`<i>\`:**
- \`<em>\` = miring + bermakna penekanan
- \`<i>\` = miring biasa (untuk istilah asing, judul buku, dll)

### Kombinasi Strong dan Em

Boleh banget dikombinasikan:

\`\`\`html
<p>Ini adalah <strong><em>pesan paling penting</em></strong> hari ini!</p>
\`\`\`

Hasilnya: teks tebal sekaligus miring.

---

## 🔀 Tag \`<br>\` — Pindah Baris

Ingat di pelajaran 1, gue bilang enter di kode HTML tidak berpengaruh ke tampilan? Nah, kalau kamu memang butuh pindah baris, gunakan \`<br>\`:

\`\`\`html
<p>
  Nama: Budi Santoso<br>
  Alamat: Jl. Merdeka No. 10<br>
  Kota: Jakarta<br>
  Telepon: 08123456789
</p>
\`\`\`

\`<br>\` adalah tag self-closing — tidak perlu tag penutup. Cocok untuk alamat, puisi, lirik lagu, atau teks yang perlu format baris tertentu.

**Catatan:** Jangan pakai \`<br>\` hanya untuk memberi jarak antar paragraf. Untuk itu, gunakan tag \`<p>\` terpisah. \`<br>\` hanya untuk pindah baris di dalam blok teks yang sama.

---

## ➖ Tag \`<hr>\` — Garis Pemisah Horizontal

\`<hr>\` (horizontal rule) membuat garis pemisah yang berguna untuk memisahkan bagian konten:

\`\`\`html
<h2>Bagian Pertama</h2>
<p>Ini konten bagian pertama.</p>

<hr>

<h2>Bagian Kedua</h2>
<p>Ini konten bagian kedua.</p>
\`\`\`

Seperti \`<br>\`, tag \`<hr>\` juga self-closing. Di HTML5, tidak perlu ditulis \`<hr />\`, cukup \`<hr>\`.

---

## 🔗 Link: Tag \`<a href>\`

Link adalah salah satu fitur paling ikonik di web. Ingat artinya "HyperText"? Nah, ini dia implementasinya!

### Struktur Dasar Link

\`\`\`html
<a href="https://www.google.com">Klik di sini untuk ke Google</a>
\`\`\`

Bedah per bagian:
- \`<a>\` → tag anchor (jangkar)
- \`href\` → atribut wajib, singkatan dari "Hypertext REFerence"
- \`"https://www.google.com"\` → URL tujuan
- \`Klik di sini untuk ke Google\` → teks yang tampil (bisa diklik)
- \`</a>\` → tag penutup

### Link ke Halaman Lain (URL Eksternal)

\`\`\`html
<p>Untuk belajar lebih lanjut, kunjungi
  <a href="https://developer.mozilla.org">MDN Web Docs</a>
  — referensi terlengkap untuk HTML.
</p>
\`\`\`

### Buka Link di Tab Baru

Tambahkan atribut \`target="_blank"\`:

\`\`\`html
<a href="https://www.youtube.com" target="_blank">
  Buka YouTube di tab baru
</a>
\`\`\`

Sangat berguna untuk link eksternal — pengguna tidak kehilangan halaman aslimu.

### Link ke File HTML Lain (Internal Link)

Kalau kamu punya beberapa file HTML dalam satu folder:

\`\`\`html
<!-- Di halaman index.html, link ke about.html -->
<a href="about.html">Tentang Saya</a>

<!-- Link ke file di folder lain -->
<a href="blog/artikel1.html">Baca Artikel</a>
\`\`\`

### Link ke Bagian di Halaman yang Sama (Anchor Link)

Berguna untuk halaman panjang — bisa langsung lompat ke bagian tertentu:

\`\`\`html
<!-- Tombol navigasi di atas -->
<a href="#kontak">Pergi ke Bagian Kontak</a>

<!-- Di bawah, bagian yang dituju diberi id -->
<h2 id="kontak">Kontak Saya</h2>
<p>Email: budi@email.com</p>
\`\`\`

Tanda \`#\` di href berarti "cari elemen dengan id ini di halaman yang sama".

### Link Email

\`\`\`html
<a href="mailto:budi@email.com">Kirim Email ke Saya</a>
\`\`\`

Ketika diklik, akan membuka aplikasi email bawaan pengguna.

---

## 🖼️ Gambar: Tag \`<img>\`

Menampilkan gambar di HTML menggunakan tag \`<img>\` — ini tag self-closing (tidak butuh penutup):

### Struktur Dasar

\`\`\`html
<img src="foto-saya.jpg" alt="Foto profil Budi">
\`\`\`

Bedah per bagian:
- \`<img>\` → tag gambar, self-closing
- \`src\` → atribut wajib, singkatan "source" (sumber file gambar)
- \`alt\` → atribut wajib, teks alternatif jika gambar gagal dimuat

### Kenapa \`alt\` Penting?

Atribut \`alt\` (alternative text) berguna untuk:
1. **Gambar gagal dimuat** — teks alt ditampilkan sebagai pengganti
2. **Screen reader** — dibacakan untuk pengguna dengan gangguan penglihatan
3. **SEO** — Google membaca alt text untuk memahami gambar

Jangan pernah skip atribut alt!

### Gambar dari File Lokal

\`\`\`html
<!-- Gambar di folder yang sama -->
<img src="foto.jpg" alt="Foto liburan saya">

<!-- Gambar di subfolder -->
<img src="gambar/foto.jpg" alt="Foto liburan saya">

<!-- Gambar di folder atas -->
<img src="../foto.jpg" alt="Foto liburan saya">
\`\`\`

### Gambar dari Internet (URL)

\`\`\`html
<img src="https://via.placeholder.com/400x300" alt="Gambar placeholder">
\`\`\`

### Mengatur Ukuran Gambar

\`\`\`html
<!-- Atur lebar dan tinggi dalam pixel -->
<img src="foto.jpg" alt="Foto saya" width="300" height="200">

<!-- Atau hanya lebar, tinggi otomatis proporsional -->
<img src="foto.jpg" alt="Foto saya" width="300">
\`\`\`

Tapi cara yang lebih baik adalah mengatur ukuran lewat CSS (akan kita pelajari nanti). Untuk sekarang, pakai atribut width/height dulu tidak masalah.

---

## 📋 Daftar (List)

HTML punya dua jenis daftar utama:

### Unordered List \`<ul>\` — Daftar Tidak Berurutan

Menggunakan bullet point (•):

\`\`\`html
<h3>Bahan Nasi Goreng:</h3>
<ul>
  <li>Nasi putih</li>
  <li>Telur</li>
  <li>Bawang merah dan putih</li>
  <li>Kecap manis</li>
  <li>Garam dan merica</li>
</ul>
\`\`\`

- \`<ul>\` → kontainer daftar (ul = unordered list)
- \`<li>\` → setiap item daftar (li = list item)
- \`</ul>\` → penutup kontainer

### Ordered List \`<ol>\` — Daftar Berurutan

Menggunakan angka (1, 2, 3...):

\`\`\`html
<h3>Langkah Memasak Nasi Goreng:</h3>
<ol>
  <li>Panaskan minyak di wajan</li>
  <li>Tumis bawang hingga harum</li>
  <li>Masukkan telur, orak-arik</li>
  <li>Tambahkan nasi, aduk rata</li>
  <li>Bumbui dengan kecap, garam, merica</li>
  <li>Sajikan selagi hangat</li>
</ol>
\`\`\`

### Nested List (List di Dalam List)

Bisa juga membuat list bertingkat:

\`\`\`html
<h3>Menu Restoran</h3>
<ul>
  <li>Makanan Utama
    <ul>
      <li>Nasi Goreng</li>
      <li>Mie Goreng</li>
      <li>Soto Ayam</li>
    </ul>
  </li>
  <li>Minuman
    <ul>
      <li>Es Teh</li>
      <li>Jus Jeruk</li>
    </ul>
  </li>
  <li>Dessert
    <ul>
      <li>Es Krim</li>
      <li>Puding Coklat</li>
    </ul>
  </li>
</ul>
\`\`\`

### Kapan Pakai ul vs ol?

- Pakai \`<ul>\` jika urutan tidak penting (bahan masakan, fitur produk, hobi)
- Pakai \`<ol>\` jika urutan penting (langkah-langkah, peringkat, instruksi)

---

## 🗂️ Contoh Lengkap: Halaman Artikel Blog

Mari kita gabungkan semuanya dalam satu contoh nyata:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tips Belajar Coding - Blog Budi</title>
  </head>
  <body>

    <h1>Blog Budi</h1>
    <p>Catatan perjalanan belajar coding seorang pemula.</p>

    <hr>

    <h2>5 Tips Ampuh Belajar Coding untuk Pemula</h2>
    <p>Dipublikasikan: <em>15 Januari 2025</em></p>

    <p>Belajar coding memang tidak mudah, tapi juga tidak sesulit yang
    dibayangkan. Dengan pendekatan yang tepat, siapapun bisa belajar
    coding dari nol. Berikut tips yang sudah saya coba sendiri!</p>

    <h3>1. Konsisten Setiap Hari</h3>
    <p>Ini adalah tips <strong>terpenting</strong>. Belajar 30 menit setiap
    hari jauh lebih efektif daripada belajar 5 jam sekali seminggu.
    Otak kita butuh pengulangan untuk membentuk memori jangka panjang.</p>

    <h3>2. Langsung Praktek</h3>
    <p>Jangan hanya membaca tutorial — <em>langsung coba tulis kodenya!</em>
    Membuat kesalahan adalah cara terbaik untuk belajar.</p>

    <h3>Tools yang Saya Gunakan</h3>
    <ul>
      <li><strong>VS Code</strong> — text editor gratis dan powerful</li>
      <li><strong>Chrome DevTools</strong> — untuk debug dan inspect HTML</li>
      <li><strong>Google</strong> — untuk mencari solusi error</li>
      <li><strong>YouTube</strong> — tutorial gratis berlimpah!</li>
    </ul>

    <h3>Roadmap Belajar Saya</h3>
    <ol>
      <li>HTML — struktur halaman web ✅</li>
      <li>CSS — styling dan tampilan 🔄</li>
      <li>JavaScript — interaktivitas ⏳</li>
      <li>Framework (React/Vue) ⏳</li>
      <li>Backend (Node.js/Python) ⏳</li>
    </ol>

    <hr>

    <h2>Referensi Belajar</h2>
    <p>Berikut beberapa sumber belajar yang saya rekomendasikan:</p>
    <ul>
      <li>
        <a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a>
        — referensi lengkap dan gratis
      </li>
      <li>
        <a href="https://www.w3schools.com" target="_blank">W3Schools</a>
        — cocok untuk pemula
      </li>
    </ul>

    <hr>

    <h2>Kontak</h2>
    <p>
      Ada pertanyaan? Hubungi saya di:<br>
      Email: <a href="mailto:budi@email.com">budi@email.com</a><br>
      Instagram: <a href="https://instagram.com" target="_blank">@budi_coding</a>
    </p>

  </body>
</html>
\`\`\`

---

## 🎯 Praktik: Upgrade Halaman dari Pelajaran 1!

Buka file \`index.html\` yang kamu buat di pelajaran sebelumnya, dan tambahkan:

**Level 1 — Dasar:**
1. Buat daftar \`<ul>\` berisi minimal 5 hobi atau minat kamu
2. Tambahkan satu link ke website favoritmu (buka di tab baru!)
3. Tambahkan tag \`<hr>\` sebagai pemisah antar bagian

**Level 2 — Menengah:**
4. Tambahkan gambar (bisa dari internet pakai URL, atau dari file lokal)
5. Gunakan \`<strong>\` dan \`<em>\` di beberapa teks
6. Buat \`<ol>\` berisi 5 goals kamu tahun ini

**Level 3 — Tantangan:**
7. Tambahkan bagian "Kontak" dengan link email
8. Buat navigasi sederhana di atas dengan anchor link ke tiap bagian:

\`\`\`html
<nav>
  <a href="#tentang">Tentang</a> |
  <a href="#hobi">Hobi</a> |
  <a href="#kontak">Kontak</a>
</nav>
\`\`\`

---

## ✅ Rangkuman Pelajaran 2

Yang sudah kamu pelajari hari ini:

| Tag | Fungsi |
|-----|--------|
| \`<strong>\` | Teks tebal dan penting |
| \`<em>\` | Teks miring dan ditekankan |
| \`<br>\` | Pindah baris |
| \`<hr>\` | Garis pemisah horizontal |
| \`<a href="">\` | Link ke halaman/URL lain |
| \`<img src="" alt="">\` | Menampilkan gambar |
| \`<ul>\` + \`<li>\` | Daftar tak berurutan |
| \`<ol>\` + \`<li>\` | Daftar berurutan |

**Atribut penting yang sudah dipelajari:**
- \`href\` — URL tujuan link
- \`target="_blank"\` — buka link di tab baru
- \`src\` — sumber file gambar
- \`alt\` — teks alternatif gambar
- \`width\`, \`height\` — ukuran gambar

> **Selanjutnya kita masuk ke Modul 2: Tabel HTML! Kamu akan bisa membuat tabel data yang rapi seperti di Excel, tapi versi web.** 📊
`;
