export const html_l4 = `
# Form dan Input — Bikin Website yang Bisa Diajak Ngobrol

Sejauh ini website kita hanya bisa "bicara" ke pengguna — menampilkan teks dan gambar. Tapi kalau mau website yang bisa menerima masukan dari pengguna (login, registrasi, pesan, komentar) — kita butuh **Form**.

Form adalah elemen HTML yang memungkinkan pengguna memasukkan data dan mengirimkannya.

---

## 🏦 Analogi: Form Seperti Formulir di Bank

Waktu kamu ke bank, kamu isi formulir: nama, no rekening, jumlah transaksi. Lalu kamu serahkan ke teller. Form HTML bekerja persis seperti itu — pengguna isi, klik submit, data dikirim ke server.

---

## 📋 Struktur Dasar Form

\`\`\`html
<form action="/tujuan-kirim-data" method="POST">
  <!-- input-input di sini -->
  <button type="submit">Kirim</button>
</form>
\`\`\`

**Penjelasan atribut \`<form>\`:**
- \`action\` — URL tujuan pengiriman data (ke mana data dikirim)
- \`method\` — cara pengiriman:
  - \`GET\` — data terlihat di URL (untuk pencarian)
  - \`POST\` — data tersembunyi di body request (untuk login, registrasi)

---

## 🔤 Jenis-jenis Input

\`\`\`html
<!-- TEXT — input teks biasa -->
<input type="text" name="nama" placeholder="Masukkan nama kamu">

<!-- EMAIL — validasi format email otomatis -->
<input type="email" name="email" placeholder="nama@email.com">

<!-- PASSWORD — teks tersembunyi jadi bintang -->
<input type="password" name="password" placeholder="Min. 8 karakter">

<!-- NUMBER — hanya angka yang bisa diisi -->
<input type="number" name="umur" min="1" max="120">

<!-- DATE — tampil date picker -->
<input type="date" name="tanggalLahir">

<!-- TEL — untuk nomor telepon -->
<input type="tel" name="noHP" placeholder="08123456789">

<!-- URL — validasi format URL -->
<input type="url" name="website" placeholder="https://...">

<!-- SEARCH — kotak pencarian -->
<input type="search" name="cari" placeholder="Cari sesuatu...">

<!-- CHECKBOX — pilihan yang bisa dipilih banyak -->
<input type="checkbox" name="hobi" value="membaca"> Membaca
<input type="checkbox" name="hobi" value="olahraga"> Olahraga
<input type="checkbox" name="hobi" value="memasak"> Memasak

<!-- RADIO — pilihan yang hanya bisa satu -->
<input type="radio" name="gender" value="pria"> Pria
<input type="radio" name="gender" value="wanita"> Wanita

<!-- FILE — upload file -->
<input type="file" name="foto" accept="image/*">

<!-- HIDDEN — data tersembunyi yang ikut terkirim tapi tidak tampil -->
<input type="hidden" name="userId" value="12345">
\`\`\`

---

## 🏷️ Label — Teks Keterangan untuk Input

**Label penting untuk accessibility dan UX!** Kalau kamu klik teks labelnya, fokus otomatis pindah ke input-nya.

\`\`\`html
<!-- Cara 1: label terhubung via atribut for dan id -->
<label for="nama">Nama Lengkap:</label>
<input type="text" id="nama" name="nama">

<!-- Cara 2: input di dalam label -->
<label>
  Nama Lengkap:
  <input type="text" name="nama">
</label>

<!-- Perbedaan: cara 1 lebih fleksibel untuk styling -->
\`\`\`

---

## 📝 Textarea dan Select

\`\`\`html
<!-- TEXTAREA — teks panjang multi-baris -->
<textarea name="pesan" rows="5" cols="40" placeholder="Tulis pesanmu di sini..."></textarea>

<!-- SELECT — dropdown pilihan -->
<select name="kota">
  <option value="">-- Pilih Kota --</option>
  <option value="jakarta">Jakarta</option>
  <option value="bandung">Bandung</option>
  <option value="surabaya">Surabaya</option>
  <option value="yogyakarta">Yogyakarta</option>
  <option value="medan">Medan</option>
</select>

<!-- SELECT dengan grup -->
<select name="kategori">
  <optgroup label="Pulau Jawa">
    <option value="jakarta">Jakarta</option>
    <option value="bandung">Bandung</option>
  </optgroup>
  <optgroup label="Luar Jawa">
    <option value="medan">Medan</option>
    <option value="makassar">Makassar</option>
  </optgroup>
</select>

<!-- SELECT multiple — bisa pilih banyak (tahan Ctrl/Cmd) -->
<select name="bahasa" multiple size="4">
  <option value="indonesia">Indonesia</option>
  <option value="inggris">Inggris</option>
  <option value="jepang">Jepang</option>
  <option value="mandarin">Mandarin</option>
</select>
\`\`\`

---

## 🔒 Validasi Bawaan HTML

Kamu bisa tambahkan validasi tanpa perlu JavaScript:

\`\`\`html
<!-- required — wajib diisi -->
<input type="text" name="nama" required>

<!-- minlength & maxlength — panjang karakter -->
<input type="text" name="username" minlength="3" maxlength="20">

<!-- min & max — untuk angka dan tanggal -->
<input type="number" name="nilai" min="0" max="100">
<input type="date" name="tanggal" min="2024-01-01" max="2024-12-31">

<!-- pattern — validasi dengan regex -->
<input type="text" name="kodePos" pattern="[0-9]{5}" 
       title="Kode pos harus 5 digit angka">

<!-- disabled — input tidak bisa diedit -->
<input type="text" name="idUser" value="USR-12345" disabled>

<!-- readonly — bisa dibaca tapi tidak bisa diedit, ikut terkirim -->
<input type="text" name="referral" value="PROMO2024" readonly>
\`\`\`

---

## 🎯 Praktik: Form Pendaftaran Lengkap

Buat file \`daftar.html\`:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Pendaftaran</title>
</head>
<body>

  <h1>Formulir Pendaftaran Anggota</h1>
  <p>Isi semua kolom dengan tanda * (wajib diisi)</p>

  <form action="/daftar" method="POST">

    <h2>Data Pribadi</h2>

    <label for="namaLengkap">Nama Lengkap *</label><br>
    <input type="text" id="namaLengkap" name="namaLengkap"
           placeholder="Sesuai KTP" required><br><br>

    <label for="email">Email *</label><br>
    <input type="email" id="email" name="email"
           placeholder="nama@email.com" required><br><br>

    <label for="noHP">Nomor HP *</label><br>
    <input type="tel" id="noHP" name="noHP"
           placeholder="08xxxxxxxxxx" required><br><br>

    <label for="tanggalLahir">Tanggal Lahir</label><br>
    <input type="date" id="tanggalLahir" name="tanggalLahir"><br><br>

    <label>Jenis Kelamin</label><br>
    <input type="radio" id="pria" name="gender" value="pria">
    <label for="pria">Pria</label>
    <input type="radio" id="wanita" name="gender" value="wanita">
    <label for="wanita">Wanita</label><br><br>

    <label for="kota">Kota Domisili</label><br>
    <select id="kota" name="kota">
      <option value="">-- Pilih Kota --</option>
      <option value="jakarta">Jakarta</option>
      <option value="bandung">Bandung</option>
      <option value="surabaya">Surabaya</option>
      <option value="yogyakarta">Yogyakarta</option>
      <option value="lainnya">Kota Lain</option>
    </select><br><br>

    <h2>Data Akun</h2>

    <label for="username">Username *</label><br>
    <input type="text" id="username" name="username"
           minlength="5" maxlength="20"
           placeholder="Min. 5 karakter" required><br><br>

    <label for="password">Password *</label><br>
    <input type="password" id="password" name="password"
           minlength="8" placeholder="Min. 8 karakter" required><br><br>

    <h2>Minat & Tujuan</h2>

    <label>Topik yang diminati:</label><br>
    <input type="checkbox" id="webdev" name="minat" value="webdev">
    <label for="webdev">Web Development</label><br>
    <input type="checkbox" id="datascience" name="minat" value="datascience">
    <label for="datascience">Data Science</label><br>
    <input type="checkbox" id="mobile" name="minat" value="mobile">
    <label for="mobile">Mobile App</label><br><br>

    <label for="tujuan">Ceritakan tujuanmu belajar</label><br>
    <textarea id="tujuan" name="tujuan" rows="4"
              placeholder="Apa yang ingin kamu capai?"></textarea><br><br>

    <input type="checkbox" id="setuju" name="setuju" value="ya" required>
    <label for="setuju">Saya menyetujui <a href="#">syarat & ketentuan</a> *</label><br><br>

    <button type="submit">Daftar Sekarang</button>
    <button type="reset">Reset Form</button>

  </form>

</body>
</html>
\`\`\`

---

## ✅ Rangkuman

- \`<form action="..." method="...">\` — container form
- \`<input type="...">\` — berbagai jenis input (text, email, password, checkbox, radio, dll.)
- \`<label for="id">\` — teks keterangan yang terhubung ke input
- \`<textarea>\` — input teks panjang
- \`<select>\` dan \`<option>\` — dropdown pilihan
- Atribut validasi: \`required\`, \`minlength\`, \`maxlength\`, \`min\`, \`max\`, \`pattern\`

> **Selanjutnya: Semantic HTML — cara nulis HTML yang lebih bermakna untuk SEO dan accessibility!** 🚀
`;
