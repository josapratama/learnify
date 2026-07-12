export const sql_l4 = `
# INSERT, UPDATE, DELETE — Manipulasi Data

Membaca data dengan SELECT sudah dikuasai. Sekarang kita belajar mengubah data: menambah, memperbarui, dan menghapus.

Tiga perintah ini — INSERT, UPDATE, DELETE — disebut **DML (Data Manipulation Language)**. Yang perlu selalu diingat: **UPDATE dan DELETE tanpa WHERE akan mempengaruhi SEMUA baris**. Ini salah satu penyebab insiden yang paling sering terjadi di production.

---

## INSERT INTO — Menambah Data

\`\`\`sql
-- Tambah satu pelanggan baru
INSERT INTO pelanggan (nama, email, telepon, kota)
VALUES ('Rudi Hermawan', 'rudi@email.com', '089012345678', 'Denpasar');

-- Insert beberapa baris sekaligus (lebih efisien)
INSERT INTO pelanggan (nama, email, telepon, kota) VALUES
    ('Rudi Hermawan', 'rudi@email.com', '089012345678', 'Denpasar'),
    ('Lestari Putri', 'lestari@email.com', '089123456789', 'Makassar'),
    ('Hendra Wijaya', 'hendra@email.com', '089234567890', 'Palembang');
\`\`\`

**Yang perlu diperhatikan:**
- Urutan kolom harus sama dengan urutan nilai
- Kolom dengan \`NOT NULL\` tanpa default wajib diisi
- Kolom tidak disebutkan → diisi default atau NULL

### INSERT dengan SELECT

Menyalin data dari satu tabel ke tabel lain:

\`\`\`sql
-- Misalkan ada tabel pelanggan_baru yang berisi import data
-- Kita pindahkan ke tabel pelanggan utama
INSERT INTO pelanggan (nama, email, kota)
SELECT nama, email, kota 
FROM pelanggan_baru
WHERE email NOT IN (SELECT email FROM pelanggan);
-- Hanya insert yang belum ada di tabel pelanggan
\`\`\`

### INSERT OR IGNORE / ON CONFLICT

\`\`\`sql
-- SQLite: insert, tapi abaikan jika sudah ada (berdasarkan UNIQUE constraint)
INSERT OR IGNORE INTO pelanggan (nama, email, kota)
VALUES ('Budi Santoso', 'budi@email.com', 'Jakarta');
-- budi@email.com sudah ada, jadi diabaikan

-- PostgreSQL: ON CONFLICT DO NOTHING
INSERT INTO pelanggan (nama, email, kota)
VALUES ('Budi Santoso', 'budi@email.com', 'Jakarta')
ON CONFLICT (email) DO NOTHING;

-- PostgreSQL: ON CONFLICT DO UPDATE (UPSERT)
INSERT INTO pelanggan (nama, email, kota)
VALUES ('Budi Santoso Baru', 'budi@email.com', 'Surabaya')
ON CONFLICT (email) DO UPDATE SET
    nama = EXCLUDED.nama,
    kota = EXCLUDED.kota;
-- Jika email sudah ada, update nama dan kota
\`\`\`

---

## UPDATE — Mengubah Data

### ⚠️ WAJIB PAKAI WHERE!

Ini adalah **aturan paling penting** dalam UPDATE.

Tanpa WHERE, semua baris di tabel akan diubah!

\`\`\`sql
-- BERBAHAYA! Mengubah SEMUA harga di tabel produk!
UPDATE produk SET harga = 0;  -- JANGAN LAKUKAN INI!

-- BENAR: Selalu sertakan WHERE
UPDATE produk 
SET harga = 0 
WHERE id = 999;  -- Hanya produk dengan id 999
\`\`\`

### Sintaks UPDATE

\`\`\`sql
-- Sintaks dasar
UPDATE nama_tabel
SET kolom1 = nilai1, kolom2 = nilai2
WHERE kondisi;

-- Contoh: ubah nomor telepon Budi
UPDATE pelanggan
SET telepon = '081999888777'
WHERE id = 1;

-- Ubah beberapa kolom sekaligus
UPDATE pelanggan
SET 
    telepon = '081999888777',
    kota = 'Bekasi'
WHERE email = 'budi@email.com';
\`\`\`

### UPDATE dengan Ekspresi

\`\`\`sql
-- Tambah stok produk sebesar 10
UPDATE produk 
SET stok = stok + 10
WHERE id = 3;

-- Naikkan harga semua produk pakaian (kategori 2) sebesar 5%
UPDATE produk
SET harga = harga * 1.05
WHERE kategori_id = 2;

-- Tandai produk dengan stok 0 sebagai tidak aktif
UPDATE produk
SET aktif = 0
WHERE stok = 0;
\`\`\`

### UPDATE Berdasarkan Kondisi Kompleks

\`\`\`sql
-- Update status pesanan yang sudah lebih dari 7 hari masih 'proses'
-- (contoh konseptual, sintaks tanggal bervariasi per database)
UPDATE pesanan
SET status = 'terlambat'
WHERE status = 'proses'
  AND tanggal < date('now', '-7 days');   -- SQLite

-- UPDATE pesanan
-- SET status = 'terlambat'
-- WHERE status = 'proses'
--   AND tanggal < NOW() - INTERVAL '7 days';  -- PostgreSQL

-- Ubah nama kategori
UPDATE kategori
SET nama = 'Elektronik & Gadget'
WHERE id = 1;
\`\`\`

### Verifikasi Sebelum UPDATE

Kebiasaan baik: jalankan SELECT dulu untuk memastikan kondisi WHERE sudah tepat.

\`\`\`sql
-- Langkah 1: Cek dulu data yang akan diubah
SELECT id, nama, harga 
FROM produk 
WHERE kategori_id = 2;

-- Langkah 2: Setelah yakin, baru UPDATE
UPDATE produk
SET harga = harga * 1.05
WHERE kategori_id = 2;

-- Langkah 3: Cek hasil
SELECT id, nama, harga 
FROM produk 
WHERE kategori_id = 2;
\`\`\`

---

## DELETE — Menghapus Data

### ⚠️ WAJIB PAKAI WHERE!

Sama seperti UPDATE, tanpa WHERE akan menghapus SEMUA data!

\`\`\`sql
-- BERBAHAYA! Menghapus SEMUA data pelanggan!
DELETE FROM pelanggan;  -- JANGAN!

-- BENAR: Selalu sertakan WHERE
DELETE FROM pelanggan
WHERE id = 999;
\`\`\`

### Sintaks DELETE

\`\`\`sql
-- Hapus satu baris berdasarkan ID
DELETE FROM produk
WHERE id = 15;

-- Hapus beberapa baris berdasarkan kondisi
DELETE FROM produk
WHERE aktif = 0 AND stok = 0;

-- Hapus pesanan lama yang sudah selesai (lebih dari 1 tahun)
DELETE FROM pesanan
WHERE status = 'selesai'
  AND tanggal < date('now', '-1 year');  -- SQLite
\`\`\`

### Urutan Penghapusan (Foreign Key)

Jika ada relasi antar tabel, hapus dari tabel "anak" dulu sebelum tabel "induk":

\`\`\`sql
-- SALAH: Hapus pesanan dulu padahal detail_pesanan masih referensikan pesanan
DELETE FROM pesanan WHERE id = 1;  -- Error! Ada detail_pesanan yang referensikan pesanan id=1

-- BENAR: Hapus detail dulu, baru pesanannya
DELETE FROM detail_pesanan WHERE pesanan_id = 1;
DELETE FROM pesanan WHERE id = 1;
\`\`\`

---

## TRUNCATE vs DELETE

| Fitur | DELETE | TRUNCATE |
|-------|--------|----------|
| Hapus semua baris | ✅ (tanpa WHERE) | ✅ |
| Filter dengan WHERE | ✅ | ❌ |
| Bisa di-ROLLBACK | ✅ | Tergantung DB |
| Reset auto-increment | ❌ | ✅ |
| Kecepatan | Lebih lambat | Jauh lebih cepat |
| Trigger | Dijalankan | Tidak dijalankan |

\`\`\`sql
-- DELETE semua isi tabel (bisa di-rollback, id counter lanjut)
DELETE FROM detail_pesanan;

-- TRUNCATE: hapus semua lebih cepat, reset id ke 1 (hati-hati!)
TRUNCATE TABLE detail_pesanan;  -- PostgreSQL / MySQL

-- SQLite tidak punya TRUNCATE, pakai:
DELETE FROM detail_pesanan;
-- Untuk reset auto-increment di SQLite:
DELETE FROM sqlite_sequence WHERE name = 'detail_pesanan';
\`\`\`

**Kapan pakai TRUNCATE?**
- Ingin kosongkan tabel testing/development
- Perlu reset ID dari 1
- Tabel sangat besar dan DELETE terlalu lambat

**Kapan pakai DELETE?**
- Hapus data spesifik (dengan WHERE)
- Perlu kemampuan rollback
- Ada trigger yang harus dijalankan

---

## Transaksi — BEGIN, COMMIT, ROLLBACK

### Analogi: Transfer Bank

Bayangkan kamu transfer uang Rp500.000 ke teman:

**Tanpa transaksi:**
1. Kurangi saldo kamu Rp500.000 ✅
2. Tiba-tiba listrik mati / error! ❌
3. Saldo kamu berkurang, tapi uang tidak sampai ke teman 😱

**Dengan transaksi:**
1. Mulai transaksi (BEGIN)
2. Kurangi saldo kamu Rp500.000
3. Tambah saldo teman Rp500.000
4. Jika semua berhasil → COMMIT (simpan permanen)
5. Jika ada error → ROLLBACK (batalkan semua, kembalikan ke semula)

Inilah prinsip **ACID**:
- **A**tomicity: semua berhasil atau semua batal
- **C**onsistency: data selalu dalam keadaan valid
- **I**solation: transaksi tidak saling ganggu
- **D**urability: data tersimpan permanen setelah COMMIT

### Sintaks Transaksi

\`\`\`sql
-- Mulai transaksi
BEGIN;  -- atau BEGIN TRANSACTION; atau START TRANSACTION;

-- Lakukan operasi
INSERT INTO pesanan (pelanggan_id, total, status)
VALUES (1, 500000, 'proses');

INSERT INTO detail_pesanan (pesanan_id, produk_id, jumlah, harga_saat_pesan)
VALUES (LAST_INSERT_ROWID(), 4, 2, 250000);  -- SQLite

UPDATE produk
SET stok = stok - 2
WHERE id = 4;

-- Jika semua berhasil, simpan permanen
COMMIT;
\`\`\`

\`\`\`sql
-- Contoh dengan ROLLBACK
BEGIN;

UPDATE produk SET stok = stok - 100 WHERE id = 4;
-- Cek: apakah stok jadi negatif?
SELECT stok FROM produk WHERE id = 4;
-- Stok jadi -50 (tidak valid!)

-- Batalkan semua perubahan
ROLLBACK;
-- Stok kembali ke semula
\`\`\`

### Contoh Kasus Nyata — Proses Checkout

\`\`\`sql
BEGIN;

-- 1. Buat pesanan baru
INSERT INTO pesanan (pelanggan_id, total, status)
VALUES (5, 850000, 'proses');

-- Simpan ID pesanan yang baru dibuat
-- (Di aplikasi nyata, ini ditangani oleh aplikasi/stored procedure)

-- 2. Tambah detail pesanan (misal pesanan ID = 11)
INSERT INTO detail_pesanan (pesanan_id, produk_id, jumlah, harga_saat_pesan)
VALUES (11, 12, 1, 850000);

-- 3. Kurangi stok produk
UPDATE produk SET stok = stok - 1 WHERE id = 12;

-- 4. Verifikasi stok tidak negatif
-- Jika stok < 0 di sini, ROLLBACK

-- Jika semua OK:
COMMIT;
\`\`\`

### SAVEPOINT — Checkpoint dalam Transaksi

\`\`\`sql
BEGIN;

INSERT INTO kategori (nama) VALUES ('Aksesoris');
SAVEPOINT setelah_kategori;  -- Checkpoint 1

INSERT INTO produk (nama, harga, kategori_id) 
VALUES ('Tas Laptop', 450000, 6);
SAVEPOINT setelah_produk;  -- Checkpoint 2

-- Misalkan ada kesalahan di langkah berikutnya
INSERT INTO produk (nama, harga) 
VALUES ('Produk Error', -100);  -- Harga negatif, tidak valid

-- Rollback hanya ke checkpoint terakhir
ROLLBACK TO SAVEPOINT setelah_produk;
-- Produk Error dibatalkan, tapi Tas Laptop tetap ada

-- Lanjutkan dengan data yang benar
INSERT INTO produk (nama, harga, kategori_id) 
VALUES ('Charger Universal', 120000, 6);

COMMIT;
\`\`\`

---

## Contoh Lengkap — Skenario Toko Online

\`\`\`sql
-- SKENARIO: Pelanggan baru mendaftar dan langsung checkout

BEGIN;

-- 1. Daftarkan pelanggan baru
INSERT INTO pelanggan (nama, email, telepon, kota)
VALUES ('Zaki Ramdhan', 'zaki@email.com', '081122334455', 'Bogor');

-- 2. Buat pesanan
INSERT INTO pesanan (pelanggan_id, total, status)
VALUES (
    (SELECT id FROM pelanggan WHERE email = 'zaki@email.com'),
    635000,
    'proses'
);

-- 3. Tambah item pesanan
INSERT INTO detail_pesanan (pesanan_id, produk_id, jumlah, harga_saat_pesan)
VALUES (
    (SELECT MAX(id) FROM pesanan),  -- ID pesanan yang baru dibuat
    7,   -- Kopi Arabika
    5,   -- 5 bungkus
    65000 -- harga saat itu
);

INSERT INTO detail_pesanan (pesanan_id, produk_id, jumlah, harga_saat_pesan)
VALUES (
    (SELECT MAX(id) FROM pesanan),
    10,  -- Buku SQL
    1,
    120000
);

-- 4. Update stok
UPDATE produk SET stok = stok - 5 WHERE id = 7;
UPDATE produk SET stok = stok - 1 WHERE id = 10;

COMMIT;
\`\`\`

\`\`\`sql
-- SKENARIO: Pembatalan pesanan

BEGIN;

-- Ambil detail pesanan yang akan dibatalkan
-- Kembalikan stok
UPDATE produk SET stok = stok + 1 
WHERE id = (SELECT produk_id FROM detail_pesanan WHERE pesanan_id = 9 LIMIT 1);

-- Hapus detail pesanan
DELETE FROM detail_pesanan WHERE pesanan_id = 9;

-- Update status pesanan menjadi dibatalkan
UPDATE pesanan SET status = 'dibatalkan' WHERE id = 9;

COMMIT;
\`\`\`

---

## Ringkasan Pelajaran 4

✅ \`INSERT INTO tabel (kolom) VALUES (nilai)\` untuk menambah data

✅ \`INSERT INTO tabel (kolom) VALUES (...), (...), (...)\` untuk insert banyak baris sekaligus

✅ \`UPDATE tabel SET kolom = nilai WHERE kondisi\` — **SELALU pakai WHERE!**

✅ \`DELETE FROM tabel WHERE kondisi\` — **SELALU pakai WHERE!**

✅ \`TRUNCATE\` untuk hapus semua data lebih cepat, \`DELETE\` untuk hapus data spesifik

✅ \`BEGIN / COMMIT / ROLLBACK\` untuk transaksi — pastikan operasi berjalan atomik

✅ Selalu verifikasi dengan SELECT sebelum UPDATE atau DELETE besar

---

Di pelajaran berikutnya: **Relasi Tabel & JOIN** — cara menggabungkan data dari beberapa tabel!
`;
