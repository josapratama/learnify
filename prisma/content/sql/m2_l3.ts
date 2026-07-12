export const sql_l3 = `
# SELECT — Membaca Data dari Database

SELECT adalah perintah SQL yang paling sering kamu tulis seumur hidup sebagai developer. Hampir setiap interaksi dengan database dimulai dari sini: "ambil data ini dari tabel itu."

---

## SELECT * — Ambil Semua Kolom

Tanda \`*\` artinya "semua kolom":

\`\`\`sql
-- Ambil semua data dari tabel pelanggan
SELECT * FROM pelanggan;
\`\`\`

Hasil:
\`\`\`
id | nama            | email              | telepon       | kota
---+-----------------+--------------------+---------------+-------
1  | Budi Santoso    | budi@email.com     | 081234567890  | Jakarta
2  | Sari Dewi       | sari@email.com     | 082345678901  | Surabaya
3  | Ahmad Fauzi     | ahmad@email.com    | 083456789012  | Bandung
\`\`\`

**Catatan:** \`SELECT *\` bagus untuk eksplorasi dan belajar, tapi di production hindari — boros memori karena mengambil semua kolom termasuk yang tidak dipakai.

---

## SELECT Kolom Tertentu

\`\`\`sql
-- Hanya ambil nama dan email
SELECT nama, email FROM pelanggan;

-- Hanya nama, harga, stok produk
SELECT nama, harga, stok FROM produk;
\`\`\`

### Alias dengan AS

\`\`\`sql
SELECT 
    nama AS nama_produk,
    harga AS harga_jual,
    stok AS jumlah_stok
FROM produk;
\`\`\`

### Ekspresi dalam SELECT

\`\`\`sql
-- Hitung harga setelah diskon 10%
SELECT 
    nama,
    harga,
    harga * 0.9 AS harga_diskon,
    harga - (harga * 0.9) AS selisih
FROM produk;
\`\`\`

---

## WHERE — Filter Data

\`WHERE\` adalah filter — hanya ambil baris yang memenuhi kondisi tertentu.

\`\`\`sql
-- Struktur dasar
SELECT kolom1, kolom2
FROM tabel
WHERE kondisi;
\`\`\`

### Operator Perbandingan

\`\`\`sql
-- Sama dengan (=)
SELECT * FROM produk WHERE kategori_id = 1;
-- Hasil: semua produk elektronik

-- Tidak sama dengan (!= atau <>)
SELECT * FROM pesanan WHERE status != 'selesai';
SELECT * FROM pesanan WHERE status <> 'selesai';

-- Lebih besar dari (>)
SELECT * FROM produk WHERE harga > 500000;
-- Hasil: produk dengan harga di atas 500rb

-- Lebih kecil dari (<)
SELECT * FROM produk WHERE stok < 20;
-- Hasil: produk dengan stok di bawah 20 unit

-- Lebih besar atau sama dengan (>=)
SELECT * FROM produk WHERE harga >= 1000000;

-- Lebih kecil atau sama dengan (<=)
SELECT * FROM produk WHERE stok <= 30;
\`\`\`

### LIKE — Pencarian Teks

LIKE digunakan untuk mencari teks dengan pola. Ada dua wildcard:
- \`%\` = nol atau lebih karakter apa saja
- \`_\` = tepat satu karakter apa saja

\`\`\`sql
-- Nama yang diawali "Samsung"
SELECT * FROM produk WHERE nama LIKE 'Samsung%';

-- Nama yang diakhiri "Premium"
SELECT * FROM produk WHERE nama LIKE '%Premium';

-- Nama yang mengandung kata "Pro"
SELECT * FROM produk WHERE nama LIKE '%Pro%';

-- Email dari domain gmail.com
SELECT * FROM pelanggan WHERE email LIKE '%@gmail.com';

-- Kota yang diawali huruf 'S' lalu 4 karakter lain (total 5 huruf)
SELECT * FROM pelanggan WHERE kota LIKE 'S____';
-- Cocok: Sabah, Serang, dll (bukan Surabaya karena lebih dari 5 huruf)

-- Case-insensitive: gunakan ILIKE di PostgreSQL
SELECT * FROM produk WHERE nama ILIKE '%laptop%';
-- Di SQLite: LIKE sudah case-insensitive untuk ASCII
\`\`\`

### IN — Nilai dalam Daftar

\`\`\`sql
-- Pelanggan dari beberapa kota tertentu
SELECT * FROM pelanggan WHERE kota IN ('Jakarta', 'Surabaya', 'Bandung');

-- Pesanan dengan status tertentu
SELECT * FROM pesanan WHERE status IN ('pending', 'proses');

-- Produk dari kategori 1 atau 3
SELECT * FROM produk WHERE kategori_id IN (1, 3);

-- NOT IN — kebalikannya
SELECT * FROM pelanggan WHERE kota NOT IN ('Jakarta', 'Surabaya');
\`\`\`

### BETWEEN — Rentang Nilai

\`\`\`sql
-- Produk dengan harga antara 100rb - 500rb (inklusif)
SELECT nama, harga FROM produk 
WHERE harga BETWEEN 100000 AND 500000;

-- Pesanan di bulan Maret 2024
SELECT * FROM pesanan 
WHERE tanggal BETWEEN '2024-03-01' AND '2024-03-31 23:59:59';

-- Produk dengan stok antara 20-50
SELECT nama, stok FROM produk 
WHERE stok BETWEEN 20 AND 50;

-- NOT BETWEEN
SELECT nama, harga FROM produk 
WHERE harga NOT BETWEEN 100000 AND 500000;
-- Hasil: produk < 100rb atau > 500rb
\`\`\`

### IS NULL / IS NOT NULL

\`\`\`sql
-- Produk yang tidak punya deskripsi
SELECT * FROM produk WHERE deskripsi IS NULL;

-- Pelanggan yang punya nomor telepon
SELECT * FROM pelanggan WHERE telepon IS NOT NULL;

-- PERHATIAN: Jangan pakai = NULL, harus IS NULL!
-- SALAH:  SELECT * FROM produk WHERE deskripsi = NULL;
-- BENAR:  SELECT * FROM produk WHERE deskripsi IS NULL;
\`\`\`

### AND, OR, NOT — Kombinasi Kondisi

\`\`\`sql
-- AND: semua kondisi harus terpenuhi
SELECT * FROM produk 
WHERE kategori_id = 1 AND harga < 5000000;
-- Hasil: produk elektronik dengan harga di bawah 5 juta

-- OR: salah satu kondisi terpenuhi
SELECT * FROM produk 
WHERE kategori_id = 1 OR kategori_id = 5;
-- Hasil: produk elektronik atau olahraga

-- NOT: negasi kondisi
SELECT * FROM produk 
WHERE NOT aktif = 1;
-- Hasil: produk yang tidak aktif

-- Kombinasi kompleks — gunakan tanda kurung!
SELECT * FROM produk 
WHERE (kategori_id = 1 OR kategori_id = 5) 
  AND harga > 200000 
  AND stok > 0;
-- Hasil: produk elektronik/olahraga, harga > 200rb, dan ada stok

-- Tanpa tanda kurung, hasilnya bisa berbeda!
-- AND diproses sebelum OR jika tidak ada tanda kurung
\`\`\`

---

## ORDER BY — Mengurutkan Hasil

\`\`\`sql
-- Urutkan produk dari harga termurah (ASC = ascending = naik)
SELECT nama, harga FROM produk 
ORDER BY harga ASC;

-- Urutkan dari harga termahal (DESC = descending = turun)
SELECT nama, harga FROM produk 
ORDER BY harga DESC;

-- ASC adalah default, jadi bisa dihilangkan
SELECT nama, harga FROM produk ORDER BY harga;

-- Urutkan berdasarkan nama (alfabetis)
SELECT * FROM pelanggan ORDER BY nama;

-- Urutkan berdasarkan beberapa kolom
-- Pertama urut by kota, jika kota sama urut by nama
SELECT nama, kota FROM pelanggan 
ORDER BY kota ASC, nama ASC;
\`\`\`

Hasil \`ORDER BY kota, nama\`:
\`\`\`
nama            | kota
----------------+-----------
Ahmad Fauzi     | Bandung
Budi Santoso    | Jakarta
Bagas Nugroho   | Jakarta
Rina Kusuma     | Medan
Maya Sari       | Semarang
Sari Dewi       | Surabaya
Fitri Handayani | Surabaya
Doni Prasetyo   | Yogyakarta
\`\`\`

\`\`\`sql
-- Urutkan pesanan dari terbaru
SELECT * FROM pesanan ORDER BY tanggal DESC;

-- Urutkan produk: stok terbanyak dulu, jika sama urut harga termurah
SELECT nama, stok, harga FROM produk 
ORDER BY stok DESC, harga ASC;
\`\`\`

---

## LIMIT & OFFSET — Membatasi Hasil

Sangat berguna untuk pagination (halaman 1, 2, 3, dst.)

\`\`\`sql
-- Ambil 5 produk pertama
SELECT * FROM produk LIMIT 5;

-- Ambil 3 produk termahal
SELECT nama, harga FROM produk 
ORDER BY harga DESC 
LIMIT 3;

-- OFFSET: lewati N baris pertama
-- Ambil 5 produk, mulai dari baris ke-6 (skip 5)
SELECT * FROM produk LIMIT 5 OFFSET 5;
\`\`\`

### Paginasi Data

\`\`\`sql
-- Halaman 1: 5 produk pertama (OFFSET 0)
SELECT * FROM produk ORDER BY id LIMIT 5 OFFSET 0;

-- Halaman 2: 5 produk berikutnya (OFFSET 5)
SELECT * FROM produk ORDER BY id LIMIT 5 OFFSET 5;

-- Halaman 3: 5 produk berikutnya (OFFSET 10)
SELECT * FROM produk ORDER BY id LIMIT 5 OFFSET 10;

-- Rumus: OFFSET = (halaman - 1) * ukuran_halaman
-- Halaman 4, 5 produk per halaman: OFFSET = (4-1) * 5 = 15
SELECT * FROM produk ORDER BY id LIMIT 5 OFFSET 15;
\`\`\`

---

## DISTINCT — Nilai Unik

\`\`\`sql
-- Daftar kota pelanggan (tanpa duplikat)
SELECT DISTINCT kota FROM pelanggan;
\`\`\`

Hasil:
\`\`\`
kota
-----------
Jakarta
Surabaya
Bandung
Medan
Yogyakarta
Semarang
\`\`\`

\`\`\`sql
-- Berapa kategori_id berbeda yang ada di tabel produk
SELECT DISTINCT kategori_id FROM produk ORDER BY kategori_id;

-- Status apa saja yang ada di tabel pesanan
SELECT DISTINCT status FROM pesanan;

-- DISTINCT dengan beberapa kolom: kombinasi unik
SELECT DISTINCT kota, tanggal_daftar FROM pelanggan;
\`\`\`

---

## Query Lengkap — Urutan Penulisan

Urutan penulisan klausa SQL yang benar:

\`\`\`sql
SELECT  kolom1, kolom2, ...    -- 1. Kolom apa
FROM    nama_tabel             -- 2. Dari tabel mana
WHERE   kondisi                -- 3. Filter kondisi
ORDER BY kolom ASC/DESC        -- 4. Urutan
LIMIT   n                      -- 5. Maksimal berapa baris
OFFSET  m;                     -- 6. Mulai dari baris ke-m
\`\`\`

### Contoh Query Kompleks

\`\`\`sql
-- Cari 5 produk elektronik (kategori 1) yang masih tersedia,
-- harga antara 100rb - 5juta, urutkan dari termurah
SELECT 
    nama AS "Nama Produk",
    harga AS "Harga",
    stok AS "Stok"
FROM produk
WHERE kategori_id = 1
  AND aktif = 1
  AND stok > 0
  AND harga BETWEEN 100000 AND 5000000
ORDER BY harga ASC
LIMIT 5;
\`\`\`

\`\`\`sql
-- Cari pelanggan dari Jakarta atau Surabaya yang daftar tahun 2024,
-- urutkan dari yang paling baru daftar
SELECT 
    nama,
    email,
    kota,
    tanggal_daftar
FROM pelanggan
WHERE kota IN ('Jakarta', 'Surabaya')
  AND tanggal_daftar >= '2024-01-01'
ORDER BY tanggal_daftar DESC;
\`\`\`

\`\`\`sql
-- Produk yang namanya mengandung kata 'Pro' atau 'Premium',
-- stok masih ada, urutkan alfabetis
SELECT nama, harga, stok
FROM produk
WHERE (nama LIKE '%Pro%' OR nama LIKE '%Premium%')
  AND stok > 0
ORDER BY nama ASC;
\`\`\`

---

## Studi Kasus: Query untuk Toko Online

\`\`\`sql
-- 1. Daftar produk yang stoknya hampir habis (< 25 unit)
SELECT nama, stok, harga
FROM produk
WHERE stok < 25 AND aktif = 1
ORDER BY stok ASC;

-- 2. Pelanggan baru bulan Maret 2024
SELECT nama, email, kota, tanggal_daftar
FROM pelanggan
WHERE tanggal_daftar BETWEEN '2024-03-01' AND '2024-03-31'
ORDER BY tanggal_daftar;

-- 3. Pesanan yang belum selesai
SELECT id, pelanggan_id, tanggal, total, status
FROM pesanan
WHERE status IN ('pending', 'proses', 'dikirim')
ORDER BY tanggal DESC;

-- 4. Top 5 produk termahal yang masih ada stok
SELECT nama, harga, stok
FROM produk
WHERE stok > 0
ORDER BY harga DESC
LIMIT 5;

-- 5. Produk dengan harga di bawah rata-rata (gunakan subquery sederhana)
SELECT nama, harga
FROM produk
WHERE harga < (SELECT AVG(harga) FROM produk)
ORDER BY harga DESC;
\`\`\`

---

## Tips & Common Mistakes

### Kesalahan Umum

\`\`\`sql
-- SALAH: Urutan klausa tidak benar
SELECT * WHERE id = 1 FROM pelanggan;  -- Error!

-- BENAR
SELECT * FROM pelanggan WHERE id = 1;

-- SALAH: Membandingkan NULL dengan =
SELECT * FROM produk WHERE deskripsi = NULL;  -- Tidak akan dapat hasil!

-- BENAR
SELECT * FROM produk WHERE deskripsi IS NULL;

-- SALAH: String dengan tanda kutip ganda (di SQL standar)
SELECT * FROM pelanggan WHERE kota = "Jakarta";  -- Error di PostgreSQL

-- BENAR: String selalu pakai tanda kutip tunggal
SELECT * FROM pelanggan WHERE kota = 'Jakarta';
\`\`\`

### Tips Performa

\`\`\`sql
-- Hindari SELECT * di production, spesifikkan kolom
-- LAMBAT (mengambil semua kolom):
SELECT * FROM produk WHERE kategori_id = 1;

-- LEBIH CEPAT (hanya kolom yang dibutuhkan):
SELECT id, nama, harga, stok FROM produk WHERE kategori_id = 1;

-- Hindari fungsi pada kolom di WHERE jika ada indeks
-- LAMBAT (database tidak bisa pakai indeks):
SELECT * FROM pesanan WHERE YEAR(tanggal) = 2024;

-- LEBIH CEPAT:
SELECT * FROM pesanan 
WHERE tanggal >= '2024-01-01' AND tanggal < '2025-01-01';
\`\`\`

---

## Ringkasan Pelajaran 3

✅ \`SELECT *\` untuk ambil semua kolom, \`SELECT kolom1, kolom2\` untuk kolom tertentu

✅ \`AS\` untuk memberi alias/nama baru pada kolom di hasil query

✅ \`WHERE\` untuk filter: \`=\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`, \`LIKE\`, \`IN\`, \`BETWEEN\`, \`IS NULL\`

✅ \`AND\`, \`OR\`, \`NOT\` untuk kombinasi kondisi — gunakan tanda kurung untuk kejelasan

✅ \`ORDER BY kolom ASC/DESC\` untuk mengurutkan hasil

✅ \`LIMIT n OFFSET m\` untuk membatasi hasil dan pagination

✅ \`DISTINCT\` untuk mendapatkan nilai unik

---

Di pelajaran berikutnya: **INSERT, UPDATE, DELETE** — cara menambah, mengubah, dan menghapus data!
`;
