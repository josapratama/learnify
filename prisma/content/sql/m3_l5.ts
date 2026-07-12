export const sql_l5 = `
# Relasi Tabel & JOIN

Sampai sini kita query satu tabel saja. Di dunia nyata, data tersebar di banyak tabel yang saling berhubungan — inilah inti dari "relasional" dalam database relasional.

Kenapa data dipisah ke banyak tabel? Bayangkan menyimpan semuanya di satu tabel besar:

\`\`\`
id | nama_pelanggan | email_pelanggan | produk   | harga  | kota_pelanggan
---+----------------+-----------------+----------+--------+---------------
1  | Budi Santoso   | budi@email.com  | Laptop   | 8500000| Jakarta
2  | Budi Santoso   | budi@email.com  | Earphone | 350000 | Jakarta   ← Budi diulang!
3  | Sari Dewi      | sari@email.com  | Earphone | 350000 | Surabaya
\`\`\`

Data Budi diulang di setiap pesanannya. Kalau Budi pindah kota, harus update semua baris yang ada nama Budi. Rentan inkonsistensi. Solusinya: pisahkan ke tabel terpisah dan hubungkan dengan relasi.

---

## Primary Key & Foreign Key

### Primary Key (PK)
Kolom yang **unik** mengidentifikasi setiap baris.

\`\`\`sql
CREATE TABLE pelanggan (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    nama  TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
\`\`\`

### Foreign Key (FK)
Kolom yang **mereferensikan PK di tabel lain** — jembatan antar tabel.

\`\`\`sql
CREATE TABLE pesanan (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    pelanggan_id INTEGER,                     -- Foreign Key
    tanggal      TEXT,
    total        REAL,
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id)
    -- "nilai pelanggan_id di sini harus ada di kolom id tabel pelanggan"
);
\`\`\`

---

## Jenis-Jenis Relasi

### Relasi 1:1 (One-to-One)

Satu baris di tabel A berhubungan dengan tepat satu baris di tabel B.

**Contoh:** Satu pelanggan punya satu profil detail

\`\`\`
pelanggan ──────── profil_pelanggan
    1    ──────────────  1
\`\`\`

\`\`\`sql
CREATE TABLE profil_pelanggan (
    pelanggan_id INTEGER PRIMARY KEY,  -- FK sekaligus PK
    foto_url     TEXT,
    bio          TEXT,
    tanggal_lahir DATE,
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id)
);
\`\`\`

Kapan digunakan: Memisahkan data yang jarang diakses untuk efisiensi.

### Relasi 1:N (One-to-Many) — Paling Umum

Satu baris di tabel A berhubungan dengan banyak baris di tabel B.

\`\`\`
pelanggan ──────── pesanan
    1      ──────── banyak
\`\`\`

\`\`\`
Budi ──── Pesanan #1 (laptop)
      ├── Pesanan #2 (earphone)
      └── Pesanan #3 (kemeja)

Sari ──── Pesanan #4 (buku)
\`\`\`

**Implementasi:** Foreign key ada di tabel "banyak" (pesanan).

\`\`\`sql
-- pelanggan (1) ──── pesanan (N)
-- Kolom pelanggan_id di tabel pesanan = FK ke tabel pelanggan

-- kategori (1) ──── produk (N)
-- Kolom kategori_id di tabel produk = FK ke tabel kategori

-- pesanan (1) ──── detail_pesanan (N)
-- Kolom pesanan_id di tabel detail_pesanan = FK ke tabel pesanan
\`\`\`

### Relasi N:N (Many-to-Many)

Banyak baris di tabel A berhubungan dengan banyak baris di tabel B.

\`\`\`
produk ──────── detail_pesanan ──────── pesanan
banyak  ────── (tabel penghubung) ────  banyak
\`\`\`

**Contoh:** Satu produk bisa ada di banyak pesanan. Satu pesanan bisa punya banyak produk.

\`\`\`
Laptop ──── Pesanan #1, Pesanan #5, Pesanan #9
Earphone ── Pesanan #1, Pesanan #2, Pesanan #7

Pesanan #1 ──── Laptop, Earphone, Mouse
\`\`\`

**Implementasi:** Butuh **tabel penghubung** (junction table):

\`\`\`sql
-- Tabel penghubung: detail_pesanan
CREATE TABLE detail_pesanan (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    pesanan_id       INTEGER REFERENCES pesanan(id),   -- FK ke pesanan
    produk_id        INTEGER REFERENCES produk(id),    -- FK ke produk
    jumlah           INTEGER NOT NULL,
    harga_saat_pesan REAL NOT NULL
);
\`\`\`

---

## JOIN — Menggabungkan Tabel

JOIN adalah cara mengambil data dari dua tabel atau lebih sekaligus, berdasarkan kolom yang berhubungan.

### Analogi JOIN

Bayangkan dua daftar:
- **Daftar A:** Data pesanan (id pesanan, id pelanggan, total)
- **Daftar B:** Data pelanggan (id pelanggan, nama, kota)

JOIN seperti "cocokkan" \`id pelanggan\` dari daftar A dengan \`id pelanggan\` dari daftar B, lalu gabungkan informasinya dalam satu baris.

---

## INNER JOIN — Irisan Data

Hanya ambil baris yang ada pasangannya di **kedua tabel**.

\`\`\`
Tabel A  ●●●●●●     ●●●●●●  Tabel B
              [●●●]
           INNER JOIN
\`\`\`

\`\`\`sql
-- Gabungkan pesanan dengan nama pelanggan
SELECT 
    pesanan.id AS pesanan_id,
    pelanggan.nama,
    pelanggan.kota,
    pesanan.total,
    pesanan.status
FROM pesanan
INNER JOIN pelanggan ON pesanan.pelanggan_id = pelanggan.id;
\`\`\`

Hasil:
\`\`\`
pesanan_id | nama          | kota       | total    | status
-----------+---------------+------------+----------+--------
1          | Budi Santoso  | Jakarta    | 8850000  | selesai
2          | Sari Dewi     | Surabaya   | 435000   | selesai
3          | Ahmad Fauzi   | Bandung    | 4510000  | selesai
4          | Budi Santoso  | Jakarta    | 185000   | selesai
...
\`\`\`

\`\`\`sql
-- Pakai alias tabel untuk penulisan lebih singkat
SELECT 
    p.id AS pesanan_id,
    pl.nama,
    pl.kota,
    p.total,
    p.status
FROM pesanan p
INNER JOIN pelanggan pl ON p.pelanggan_id = pl.id;

-- INNER JOIN bisa ditulis hanya JOIN (default-nya INNER)
SELECT p.id, pl.nama, p.total
FROM pesanan p
JOIN pelanggan pl ON p.pelanggan_id = pl.id;
\`\`\`

### INNER JOIN tiga tabel

\`\`\`sql
-- Lihat detail pesanan lengkap: pesanan + pelanggan + produk
SELECT 
    ps.id AS pesanan_id,
    pl.nama AS nama_pelanggan,
    pr.nama AS nama_produk,
    dp.jumlah,
    dp.harga_saat_pesan,
    (dp.jumlah * dp.harga_saat_pesan) AS subtotal
FROM detail_pesanan dp
JOIN pesanan ps ON dp.pesanan_id = ps.id
JOIN pelanggan pl ON ps.pelanggan_id = pl.id
JOIN produk pr ON dp.produk_id = pr.id
ORDER BY ps.id;
\`\`\`

Hasil:
\`\`\`
pesanan_id | nama_pelanggan | nama_produk           | jumlah | harga_saat_pesan | subtotal
-----------+----------------+-----------------------+--------+------------------+---------
1          | Budi Santoso   | Laptop ASUS VivoBook  | 1      | 8500000          | 8500000
1          | Budi Santoso   | Earphone Bluetooth    | 1      | 350000           | 350000
2          | Sari Dewi      | Earphone Bluetooth    | 1      | 350000           | 350000
2          | Sari Dewi      | Kopi Arabika Aceh     | 1      | 65000            | 65000
...
\`\`\`

---

## LEFT JOIN — Semua dari Tabel Kiri

Ambil **semua baris** dari tabel kiri, ditambah data yang cocok dari tabel kanan. Jika tidak ada pasangan, kolom tabel kanan diisi NULL.

\`\`\`
Tabel A  ●●●●●●     ●●●●●●  Tabel B
         [●●●●●●●●●]
           LEFT JOIN
\`\`\`

\`\`\`sql
-- Semua pelanggan, termasuk yang belum pernah pesan
SELECT 
    pl.nama,
    pl.email,
    COUNT(ps.id) AS jumlah_pesanan,
    COALESCE(SUM(ps.total), 0) AS total_belanja
FROM pelanggan pl
LEFT JOIN pesanan ps ON pl.id = ps.pelanggan_id
GROUP BY pl.id, pl.nama, pl.email
ORDER BY total_belanja DESC;
\`\`\`

\`\`\`sql
-- Produk yang belum pernah dipesan
SELECT 
    pr.id,
    pr.nama,
    pr.stok
FROM produk pr
LEFT JOIN detail_pesanan dp ON pr.id = dp.produk_id
WHERE dp.id IS NULL;
-- Kolom dp.id akan NULL jika tidak ada pasangannya
\`\`\`

---

## RIGHT JOIN — Semua dari Tabel Kanan

Kebalikan LEFT JOIN. Ambil semua baris dari tabel kanan.

\`\`\`
Tabel A  ●●●●●●     ●●●●●●  Tabel B
                [●●●●●●●●●]
           RIGHT JOIN
\`\`\`

\`\`\`sql
-- Semua produk, termasuk yang belum ada di pesanan
SELECT 
    pr.nama AS produk,
    dp.pesanan_id,
    dp.jumlah
FROM detail_pesanan dp
RIGHT JOIN produk pr ON dp.produk_id = pr.id;
-- Produk yang belum pernah dipesan akan menampilkan NULL di pesanan_id dan jumlah
\`\`\`

**Tips:** RIGHT JOIN jarang digunakan. Biasanya kita tukar posisi tabelnya dan pakai LEFT JOIN saja — lebih mudah dibaca.

\`\`\`sql
-- Ekuivalen dengan RIGHT JOIN di atas, tapi pakai LEFT JOIN
SELECT 
    pr.nama AS produk,
    dp.pesanan_id,
    dp.jumlah
FROM produk pr
LEFT JOIN detail_pesanan dp ON pr.id = dp.produk_id;
\`\`\`

---

## FULL OUTER JOIN — Semua dari Kedua Tabel

Ambil semua baris dari kedua tabel. Jika tidak ada pasangan, diisi NULL.

\`\`\`
Tabel A  ●●●●●●     ●●●●●●  Tabel B
        [●●●●●●●●●●●●●●●●]
         FULL OUTER JOIN
\`\`\`

\`\`\`sql
-- PostgreSQL / SQL standar
SELECT pl.nama, ps.id AS pesanan_id, ps.total
FROM pelanggan pl
FULL OUTER JOIN pesanan ps ON pl.id = ps.pelanggan_id;
-- Tampilkan semua pelanggan DAN semua pesanan
-- Pelanggan tanpa pesanan: pesanan_id = NULL
-- Pesanan tanpa pelanggan: nama = NULL (seharusnya tidak terjadi jika FK aktif)

-- SQLite tidak mendukung FULL OUTER JOIN langsung
-- Tapi bisa disimulasikan dengan UNION
SELECT pl.nama, ps.id AS pesanan_id
FROM pelanggan pl LEFT JOIN pesanan ps ON pl.id = ps.pelanggan_id
UNION
SELECT pl.nama, ps.id AS pesanan_id
FROM pelanggan pl RIGHT JOIN pesanan ps ON pl.id = ps.pelanggan_id;
\`\`\`

---

## Ringkasan Visual — Kapan Pakai JOIN Apa?

\`\`\`
Pertanyaan                                     JOIN yang Digunakan
─────────────────────────────────────────────────────────────────
"Tampilkan pesanan BESERTA nama pelanggannya"  → INNER JOIN
(Hanya pesanan yang punya pelanggan)

"Tampilkan SEMUA pelanggan, meski belum pernah → LEFT JOIN
pesan" (pelanggan adalah tabel KIRI)

"Tampilkan SEMUA produk, meski belum pernah    → LEFT JOIN
dipesan" (produk adalah tabel KIRI)

"Produk mana yang BELUM PERNAH dipesan?"       → LEFT JOIN + WHERE IS NULL

"Semua data dari kedua tabel"                  → FULL OUTER JOIN
\`\`\`

---

## Contoh Query JOIN Realistis

\`\`\`sql
-- 1. Laporan pesanan lengkap dengan nama pelanggan
SELECT 
    ps.id AS no_pesanan,
    pl.nama AS pelanggan,
    pl.kota,
    ps.tanggal,
    ps.total,
    ps.status
FROM pesanan ps
JOIN pelanggan pl ON ps.pelanggan_id = pl.id
ORDER BY ps.tanggal DESC;

-- 2. Produk beserta nama kategorinya
SELECT 
    pr.id,
    pr.nama AS produk,
    k.nama AS kategori,
    pr.harga,
    pr.stok
FROM produk pr
JOIN kategori k ON pr.kategori_id = k.id
ORDER BY k.nama, pr.nama;

-- 3. Pelanggan yang belum pernah pesan sama sekali
SELECT pl.nama, pl.email, pl.tanggal_daftar
FROM pelanggan pl
LEFT JOIN pesanan ps ON pl.id = ps.pelanggan_id
WHERE ps.id IS NULL;

-- 4. Detail transaksi lengkap (4 tabel di-JOIN)
SELECT 
    ps.id AS no_pesanan,
    pl.nama AS pelanggan,
    k.nama AS kategori,
    pr.nama AS produk,
    dp.jumlah,
    dp.harga_saat_pesan,
    (dp.jumlah * dp.harga_saat_pesan) AS subtotal,
    ps.status
FROM detail_pesanan dp
JOIN pesanan ps ON dp.pesanan_id = ps.id
JOIN pelanggan pl ON ps.pelanggan_id = pl.id
JOIN produk pr ON dp.produk_id = pr.id
JOIN kategori k ON pr.kategori_id = k.id
ORDER BY ps.id, pr.nama;
\`\`\`

---

## Ringkasan Pelajaran 5

✅ **Primary Key** = identitas unik setiap baris dalam tabel

✅ **Foreign Key** = kolom yang mereferensikan PK di tabel lain — menjaga integritas data

✅ **Relasi 1:1** — satu ke satu (jarang), **1:N** — satu ke banyak (paling umum), **N:N** — butuh tabel penghubung

✅ **INNER JOIN** — hanya baris yang ada pasangannya di kedua tabel

✅ **LEFT JOIN** — semua baris tabel kiri + data cocok dari kanan (NULL jika tidak ada)

✅ **RIGHT JOIN** — semua baris tabel kanan + data cocok dari kiri (jarang dipakai)

✅ **FULL OUTER JOIN** — semua baris dari kedua tabel

✅ Tips: Untuk cari data "yang tidak ada pasangannya", pakai LEFT JOIN + WHERE IS NULL

---

Di pelajaran berikutnya: **Agregasi & GROUP BY** — cara meringkas dan menganalisis data!
`;
