export const html_l3 = `
# Tabel HTML — Sajikan Data Seperti Spreadsheet

Pernah lihat jadwal kereta, daftar harga produk, atau laporan nilai di website? Itu semua dibuat pakai **tabel HTML**. Tabel adalah cara terbaik menyajikan data yang punya banyak kolom dan baris.

---

## 🤔 Kapan Pakai Tabel?

Tabel cocok untuk:
- ✅ Data yang punya baris dan kolom (harga, jadwal, nilai)
- ✅ Perbandingan antar item
- ✅ Laporan dan statistik

Tabel TIDAK cocok untuk:
- ❌ Layout halaman (dulu sering dipakai, sekarang pakai CSS)
- ❌ Teks biasa yang tidak ada hubungannya dengan data

---

## 🏗️ Struktur Tabel HTML

\`\`\`html
<table>
  <thead>                  <!-- Kepala tabel (header) -->
    <tr>                   <!-- Baris (table row) -->
      <th>Kolom 1</th>     <!-- Header sel (table header) -->
      <th>Kolom 2</th>
    </tr>
  </thead>
  <tbody>                  <!-- Isi tabel (body) -->
    <tr>
      <td>Data 1</td>      <!-- Sel data biasa (table data) -->
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
\`\`\`

**Penjelasan tag:**
- \`<table>\` — container utama tabel
- \`<thead>\` — bagian header/kepala tabel
- \`<tbody>\` — bagian isi/body tabel
- \`<tfoot>\` — bagian footer tabel (opsional, untuk total dll.)
- \`<tr>\` — satu baris (Table Row)
- \`<th>\` — sel header, otomatis tebal dan rata tengah
- \`<td>\` — sel data biasa (Table Data)

---

## 📊 Contoh: Daftar Harga Produk

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Daftar Harga</title>
</head>
<body>

  <h1>Daftar Harga Laptop</h1>

  <table border="1">
    <thead>
      <tr>
        <th>No</th>
        <th>Produk</th>
        <th>Prosesor</th>
        <th>RAM</th>
        <th>Harga</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>ASUS VivoBook 14</td>
        <td>Intel Core i5</td>
        <td>8 GB</td>
        <td>Rp 7.500.000</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Lenovo IdeaPad 3</td>
        <td>AMD Ryzen 5</td>
        <td>8 GB</td>
        <td>Rp 6.800.000</td>
      </tr>
      <tr>
        <td>3</td>
        <td>HP Pavilion 15</td>
        <td>Intel Core i7</td>
        <td>16 GB</td>
        <td>Rp 12.000.000</td>
      </tr>
      <tr>
        <td>4</td>
        <td>MacBook Air M2</td>
        <td>Apple M2</td>
        <td>8 GB</td>
        <td>Rp 18.500.000</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4">Total rata-rata harga:</td>
        <td>Rp 11.200.000</td>
      </tr>
    </tfoot>
  </table>

</body>
</html>
\`\`\`

---

## 🔗 Colspan dan Rowspan — Gabungkan Sel

Kayak di Excel, kamu bisa gabungkan beberapa sel menjadi satu:

\`\`\`html
<!-- colspan = gabung ke SAMPING (horizontal) -->
<!-- rowspan = gabung ke BAWAH (vertikal) -->

<table border="1">
  <thead>
    <tr>
      <th colspan="3">Jadwal Pelajaran Kelas A</th>
    </tr>
    <tr>
      <th>Senin</th>
      <th>Selasa</th>
      <th>Rabu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Matematika</td>
      <td rowspan="2">Olahraga</td>  <!-- Menempati 2 baris ke bawah -->
      <td>Bahasa Indo</td>
    </tr>
    <tr>
      <td>IPA</td>
      <!-- Sel di sini dilewati karena Olahraga rowspan=2 -->
      <td>Sejarah</td>
    </tr>
  </tbody>
</table>
\`\`\`

---

## 📅 Praktik: Buat Jadwal Mingguan Kamu

Buat file \`jadwal.html\` dan isi dengan jadwal kegiatan mingguanmu:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Jadwal Mingguanku</title>
</head>
<body>

  <h1>Jadwal Kegiatan Mingguanku</h1>
  <p>Dibuat dengan HTML - belajar coding itu seru! 😄</p>

  <table border="1" width="100%">
    <thead>
      <tr>
        <th>Jam</th>
        <th>Senin</th>
        <th>Selasa</th>
        <th>Rabu</th>
        <th>Kamis</th>
        <th>Jumat</th>
        <th>Sabtu</th>
        <th>Minggu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>06:00</td>
        <td>Olahraga</td>
        <td>-</td>
        <td>Olahraga</td>
        <td>-</td>
        <td>Olahraga</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td>08:00</td>
        <td>Kerja</td>
        <td>Kerja</td>
        <td>Kerja</td>
        <td>Kerja</td>
        <td>Kerja</td>
        <td>Belajar HTML</td>
        <td>Keluarga</td>
      </tr>
      <tr>
        <td>19:00</td>
        <td>Belajar</td>
        <td>Belajar</td>
        <td>Istirahat</td>
        <td>Belajar</td>
        <td>Santai</td>
        <td>Belajar</td>
        <td>Santai</td>
      </tr>
    </tbody>
  </table>

</body>
</html>
\`\`\`

**Tantangan:** Tambahkan \`tfoot\` yang berisi keterangan total jam belajar per minggu!

---

## ✅ Rangkuman

- \`<table>\` → container tabel
- \`<thead>\`, \`<tbody>\`, \`<tfoot>\` → bagi tabel jadi bagian logis
- \`<tr>\` → satu baris
- \`<th>\` → sel header (tebal + rata tengah otomatis)
- \`<td>\` → sel data biasa
- \`colspan="n"\` → gabung n kolom ke samping
- \`rowspan="n"\` → gabung n baris ke bawah

> **Selanjutnya: Form dan Input — cara bikin halaman yang bisa menerima masukan dari pengguna!** 🚀
`;
