export const html_l1 = `
# Apa itu HTML? — Pondasi Semua Website di Dunia

Hei, selamat datang! 🎉

Sebelum kita mulai nulis kode, gue mau cerita dulu sebentar. Karena menurut gue, kalau kamu tau KENAPA kamu belajar sesuatu, prosesnya bakal jauh lebih menyenangkan.

---

## 🤔 Kenapa Harus Belajar HTML?

Coba deh buka browser sekarang — Google, YouTube, Instagram, Tokopedia, apapun. Semua yang kamu lihat di sana, **dibangun dengan HTML sebagai fondasinya**.

Bukan lebay, tapi ini fakta: **HTML adalah bahasa yang paling banyak digunakan di internet**. Setiap halaman web yang pernah kamu kunjungi, semuanya punya HTML di dasarnya.

Nah, kenapa kamu — sebagai orang non-IT — perlu belajar ini?

**Alasan 1: Kamu bisa bikin website sendiri**
Bayangin kamu punya bisnis kecil, atau portofolio pribadi. Daripada bayar mahal ke web developer, kamu bisa bikin sendiri. Hemat dan bangga!

**Alasan 2: Ngerti cara kerja internet**
Hampir semua pekerjaan modern berhubungan dengan website. Kalau kamu ngerti HTML, kamu lebih percaya diri saat koordinasi sama tim IT, atau saat pakai tools digital.

**Alasan 3: Pintu masuk ke dunia programming**
HTML bukan programming yang rumit. Ini adalah cara paling ramah pemula untuk mulai kenal dunia kode. Banyak programmer sukses mulai dari sini!

**Alasan 4: Gampang banget dipelajari**
Serius, HTML itu salah satu teknologi paling mudah di dunia programming. Dalam hitungan jam, kamu sudah bisa bikin halaman web pertamamu!

---

## 🏠 Analogi: HTML adalah Kerangka Rumah

Biar lebih gampang kebayang, anggap aja bikin website itu kayak bangun rumah:

- 🧱 **HTML** = Kerangka/struktur rumah (dinding, lantai, atap, pintu, jendela)
- 🎨 **CSS** = Cat, wallpaper, dekorasi, dan estetika rumah
- ⚡ **JavaScript** = Sistem listrik, AC, dan hal-hal yang bisa bergerak/interaktif

Di kursus ini, kita fokus di HTML dulu — membangun kerangkanya yang kuat. Tanpa kerangka yang kokoh, rumahnya tidak akan berdiri!

---

## 💡 Apa itu HTML?

**HTML** singkatan dari **HyperText Markup Language**.

Jangan takut sama istilahnya. Kita bedah satu-satu:

- **HyperText** = teks yang bisa diklik untuk pindah ke halaman lain (link!)
- **Markup** = cara memberi "tanda" atau "label" pada teks
- **Language** = bahasa (tapi bukan bahasa pemrograman seperti Python, lebih ke bahasa penanda)

Intinya, HTML adalah cara kita bilang ke browser: *"Hey browser, ini judulnya, ini paragrafnya, ini gambarnya, ini linknya."*

Browser kemudian membaca HTML dan menampilkannya jadi tampilan visual yang kamu lihat.

---

## 🛠️ Setup: Persiapan Sebelum Mulai

Sebelum nulis HTML, kita butuh dua hal:

### 1. Text Editor — VS Code

VS Code adalah aplikasi gratis dari Microsoft untuk nulis kode. Download di:
**https://code.visualstudio.com**

Cara install:
1. Buka link di atas
2. Klik tombol "Download for Windows" (atau Mac/Linux)
3. Jalankan file installer yang didownload
4. Ikuti langkah instalasi (next, next, install)
5. Selesai!

### 2. Browser

Kamu sudah punya ini — Chrome, Firefox, Edge, atau Safari semuanya bisa dipakai.

### 3. Extension VS Code yang Berguna

Setelah install VS Code, tambahkan extension ini:
- Cari "Prettier" → install (untuk format kode otomatis)
- Cari "Live Server" → install (untuk lihat perubahan HTML secara real-time)

---

## 📄 Struktur Dokumen HTML Dasar

Setiap file HTML punya struktur dasar yang wajib ada. Anggap ini seperti "template" yang selalu kita pakai:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Pertamaku</title>
  </head>
  <body>
    <h1>Halo Dunia!</h1>
    <p>Ini adalah paragraf pertamaku.</p>
  </body>
</html>
\`\`\`

Ayo kita bedah baris per baris:

**Baris 1: \`<!DOCTYPE html>\`**
Ini bukan tag HTML biasa. Ini adalah deklarasi yang bilang ke browser: *"File ini adalah dokumen HTML versi 5 (yang terbaru)."* Wajib ada di baris pertama, selalu.

**Baris 2: \`<html lang="id">\`**
Ini adalah tag pembuka dokumen HTML. Semua konten HTML ada di dalam tag ini. Atribut \`lang="id"\` memberitahu browser bahwa bahasa halaman ini adalah Indonesia — berguna untuk accessibility dan SEO.

**Baris 3: \`<head>\`**
Bagian "kepala" dokumen. Berisi informasi tentang halaman yang TIDAK ditampilkan ke pengguna, tapi penting untuk browser dan mesin pencari.

**Baris 4: \`<meta charset="UTF-8">\`**
Menentukan encoding karakter. UTF-8 mendukung semua karakter termasuk huruf Indonesia seperti é, ñ, dan simbol-simbol lain. Selalu pakai ini!

**Baris 5: \`<meta name="viewport" ...>\`**
Membuat halaman tampil dengan benar di smartphone. Tanpa ini, website kamu akan terlihat aneh di HP.

**Baris 6: \`<title>Halaman Pertamaku</title>\`**
Teks yang muncul di tab browser. Coba perhatikan tab browser kamu sekarang — itu adalah \`<title>\` dari halaman tersebut.

**Baris 7: \`</head>\`**
Menutup bagian head.

**Baris 8: \`<body>\`**
Bagian "tubuh" dokumen. SEMUA konten yang terlihat oleh pengguna ada di sini — teks, gambar, link, tombol, dll.

**Baris 9: \`<h1>Halo Dunia!</h1>\`**
Heading level 1 — judul utama halaman. Ditampilkan dengan huruf besar dan tebal.

**Baris 10: \`<p>Ini adalah paragraf pertamaku.</p>\`**
Tag paragraf — untuk menampilkan blok teks.

**Baris 11: \`</body>\`**
Menutup bagian body.

**Baris 12: \`</html>\`**
Menutup seluruh dokumen HTML.

---

## 🏷️ Konsep Tag HTML

Sebelum lanjut, penting banget ngerti konsep tag:

**Tag pembuka dan penutup:**
\`\`\`html
<namatag>konten di sini</namatag>
\`\`\`

- \`<namatag>\` → tag pembuka
- \`</namatag>\` → tag penutup (ada garis miring \`/\`)
- Konten ada di antara keduanya

**Tag self-closing (tidak punya penutup):**
\`\`\`html
<meta charset="UTF-8">
<br>
<img src="foto.jpg">
\`\`\`

Beberapa tag tidak butuh tag penutup karena tidak punya konten di dalamnya.

**Atribut tag:**
\`\`\`html
<html lang="id">
\`\`\`

Atribut memberikan informasi tambahan pada tag. Format: \`nama="nilai"\`. Selalu ada di dalam tag pembuka.

---

## 📰 Heading: Judul dan Subjudul

HTML punya 6 level heading, dari h1 (terbesar) sampai h6 (terkecil):

\`\`\`html
<h1>Ini Heading Level 1 — Paling Besar</h1>
<h2>Ini Heading Level 2</h2>
<h3>Ini Heading Level 3</h3>
<h4>Ini Heading Level 4</h4>
<h5>Ini Heading Level 5</h5>
<h6>Ini Heading Level 6 — Paling Kecil</h6>
\`\`\`

**Aturan penggunaan heading:**
- \`<h1>\` — Judul utama halaman. Gunakan SATU KALI per halaman.
- \`<h2>\` — Judul bagian/seksi utama
- \`<h3>\` — Sub-bagian dari h2
- Dan seterusnya...

Anggap ini seperti struktur dokumen Word. H1 itu Bab, H2 itu Sub-bab, H3 itu Sub-sub-bab.

**Kenapa penting?** Mesin pencari seperti Google membaca heading untuk memahami struktur halaman. H1 yang tepat membantu SEO (Search Engine Optimization) kamu!

---

## 📝 Paragraf: Tag \`<p>\`

Tag \`<p>\` digunakan untuk blok teks biasa:

\`\`\`html
<p>Ini adalah paragraf pertama. Browser otomatis menambahkan
jarak (margin) di atas dan bawah setiap paragraf.</p>

<p>Ini paragraf kedua. Perhatikan ada jarak antara
paragraf pertama dan ini.</p>

<p>Ini paragraf ketiga. Mau nulis panjang juga tidak masalah,
browser akan otomatis menyesuaikan lebar teksnya.</p>
\`\`\`

Catatan penting: **spasi dan enter di dalam kode HTML tidak berpengaruh** ke tampilan. Browser hanya membaca tag-nya. Kalau kamu mau baris baru, harus pakai tag khusus (yang akan kita pelajari di pelajaran berikutnya).

---

## 🗂️ Contoh Lengkap: Halaman Sederhana

Mari gabungkan semua yang sudah kita pelajari:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Saya</title>
  </head>
  <body>

    <h1>Blog Saya</h1>

    <h2>Tentang Saya</h2>
    <p>Halo! Nama saya Budi. Saya sedang belajar membuat website
    dan ini adalah halaman pertama saya.</p>

    <h2>Artikel Terbaru</h2>

    <h3>Pengalaman Belajar HTML</h3>
    <p>Hari ini saya mulai belajar HTML. Ternyata tidak sesulit
    yang saya bayangkan! Strukturnya sangat logis dan mudah dipahami.</p>

    <h3>Tips Belajar Coding untuk Pemula</h3>
    <p>Belajar coding itu seperti belajar bahasa baru. Kuncinya
    adalah konsisten praktek setiap hari, meski hanya 30 menit.</p>

  </body>
</html>
\`\`\`

---

## 🎯 Praktik: Buat Halaman HTML Pertamamu!

Sudah siap? Yuk praktek langsung!

**Langkah-langkah:**

1. **Buka VS Code**

2. **Buat folder baru**
   - Klik menu File → Open Folder
   - Buat folder baru di Desktop bernama "belajar-html"
   - Klik "Select Folder"

3. **Buat file baru**
   - Di panel kiri VS Code, klik icon file baru
   - Namai file: \`index.html\`
   - Tekan Enter

4. **Ketik shortcut ajaib**
   - Klik di area editor
   - Ketik \`!\` lalu tekan Tab
   - VS Code akan otomatis mengisi struktur HTML dasar!

5. **Modifikasi kontennya** menjadi:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Saya</title>
  </head>
  <body>

    <h1>Selamat Datang di Halaman Saya!</h1>

    <h2>Siapa Saya?</h2>
    <p>Tulis namamu dan sedikit perkenalan di sini.</p>

    <h2>Hobi Saya</h2>
    <p>Ceritakan 2-3 hobi yang kamu sukai.</p>

    <h2>Tujuan Belajar HTML</h2>
    <p>Tuliskan kenapa kamu mau belajar HTML dan apa yang ingin kamu buat.</p>

  </body>
</html>
\`\`\`

6. **Simpan file**: Ctrl+S (Windows) atau Cmd+S (Mac)

7. **Buka di browser**:
   - Klik kanan file \`index.html\` di VS Code
   - Pilih "Open with Live Server" (kalau sudah install extensionnya)
   - Atau cukup double-click file tersebut dari File Explorer

Selamat! Kamu baru saja membuat halaman web pertamamu! 🎉

---

## 📝 Tantangan Tambahan

Kalau mau lebih jauh, coba tambahkan ini ke halamanmu:
- Buat bagian \`<h2>\` baru tentang "Kota Asal Saya"
- Tulis 2 paragraf \`<p>\` yang berbeda di dalamnya
- Ubah teks di \`<title>\` sesuai namamu
- Perhatikan tab browser berubah!

---

## ✅ Rangkuman Pelajaran 1

Yang sudah kamu pelajari hari ini:

- HTML adalah pondasi semua website — kerangka rumah digitalmu
- Struktur dasar: \`<!DOCTYPE>\`, \`<html>\`, \`<head>\`, \`<body>\`
- \`<head>\` berisi info untuk browser (tidak tampil ke pengguna)
- \`<body>\` berisi semua konten yang tampil ke pengguna
- Heading \`<h1>\` sampai \`<h6>\` untuk judul dan subjudul
- \`<p>\` untuk paragraf teks
- Tag punya pembuka \`<tag>\` dan penutup \`</tag>\`
- Atribut memberikan info tambahan pada tag

> **Di pelajaran berikutnya, kita akan belajar cara memformat teks, membuat link, menampilkan gambar, dan membuat daftar. Makin seru!** 🚀
`;
