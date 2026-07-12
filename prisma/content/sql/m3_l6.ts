export const sql_l6 = `
# Agregasi & GROUP BY

Sejauh ini kita query satu baris atau banyak baris satu per satu. Tapi banyak pertanyaan bisnis yang perlu jawaban berupa **ringkasan**:

- "Berapa total penjualan bulan ini?"
- "Produk apa yang paling laris?"
- "Rata-rata nilai pesanan per kota?"

Inilah fungsi **agregasi** — mengolah banyak baris menjadi satu nilai ringkasan. Dikombinasikan dengan \`GROUP BY\`, kita bisa membuat laporan bisnis yang powerful langsung dari query SQL.

---

## Fungsi Agregasi Dasar

### COUNT

\`\`\`sql
-- Hitung total pelanggan
SELECT COUNT(*) AS total_pelanggan FROM pelanggan;

-- COUNT(*) hitung semua baris, COUNT(kolom) hitung baris non-NULL
SELECT 
    COUNT(*) AS total_semua_baris,
    COUNT(deskripsi) AS yang_punya_deskripsi
FROM produk;
\`\`\`

### SUM

\`\`\`sql
SELECT SUM(total) AS total_penjualan FROM pesanan;
SELECT SUM(total) AS pendapatan_selesai FROM pesanan WHERE status = 'selesai';
SELECT SUM(stok * harga) AS nilai_total_stok FROM produk;
\`\`\`

### AVG, MIN, MAX

\`\`\`sql
SELECT 
    AVG(harga) AS rata_harga,
    MIN(harga) AS harga_termurah,
    MAX(harga) AS harga_termahal
FROM produk;
\`\`\`

### Kombinasi Semua

\`\`\`sql
-- Statistik lengkap pesanan dalam satu query
SELECT 
    COUNT(*) AS jumlah_pesanan,
    SUM(total) AS total_penjualan,
    AVG(total) AS rata_rata_pesanan,
    MIN(total) AS pesanan_terkecil,
    MAX(total) AS pesanan_terbesar
FROM pesanan;
\`\`\`

---

## GROUP BY — Mengelompokkan Data

### Analogi GROUP BY

Bayangkan kamu punya setumpuk struk belanja dari berbagai kota. GROUP BY ibarat:
1. Pisahkan struk berdasarkan kota (Jakarta, Surabaya, Bandung, dst.)
2. Hitung total belanja di setiap tumpukan
3. Sajikan hasilnya per kota

\`\`\`sql
-- Berapa pelanggan dari setiap kota?
SELECT kota, COUNT(*) AS jumlah_pelanggan
FROM pelanggan
GROUP BY kota;
\`\`\`

Hasil:
\`\`\`
kota        | jumlah_pelanggan
------------+-----------------
Bandung     | 1
Jakarta     | 2
Medan       | 1
Semarang    | 1
Surabaya    | 2
Yogyakarta  | 1
\`\`\`

\`\`\`sql
-- Berapa produk per kategori?
SELECT 
    k.nama AS kategori,
    COUNT(p.id) AS jumlah_produk,
    AVG(p.harga) AS rata_harga
FROM produk p
JOIN kategori k ON p.kategori_id = k.id
GROUP BY k.id, k.nama
ORDER BY jumlah_produk DESC;
\`\`\`

Hasil:
\`\`\`
kategori            | jumlah_produk | rata_harga
--------------------+---------------+-----------
Olahraga            | 3             | 483333
Pakaian             | 3             | 170000
Makanan & Minuman   | 3             | 48333
Elektronik          | 3             | 4350000
Buku                | 2             | 157500
\`\`\`

### GROUP BY dengan JOIN

\`\`\`sql
-- Total penjualan per pelanggan
SELECT 
    pl.nama,
    pl.kota,
    COUNT(ps.id) AS jumlah_pesanan,
    SUM(ps.total) AS total_belanja
FROM pelanggan pl
LEFT JOIN pesanan ps ON pl.id = ps.pelanggan_id
GROUP BY pl.id, pl.nama, pl.kota
ORDER BY total_belanja DESC;
\`\`\`

Hasil:
\`\`\`
nama            | kota       | jumlah_pesanan | total_belanja
----------------+------------+----------------+--------------
Budi Santoso    | Jakarta    | 2              | 9035000
Ahmad Fauzi     | Bandung    | 1              | 4510000
Doni Prasetyo   | Yogyakarta | 1              | 1130000
Fitri Handayani | Surabaya   | 1              | 280000
...
\`\`\`

\`\`\`sql
-- Produk terlaris berdasarkan total terjual
SELECT 
    pr.nama AS produk,
    k.nama AS kategori,
    SUM(dp.jumlah) AS total_terjual,
    SUM(dp.jumlah * dp.harga_saat_pesan) AS total_pendapatan
FROM detail_pesanan dp
JOIN produk pr ON dp.produk_id = pr.id
JOIN kategori k ON pr.kategori_id = k.id
GROUP BY pr.id, pr.nama, k.nama
ORDER BY total_terjual DESC;
\`\`\`

### GROUP BY dengan Beberapa Kolom

\`\`\`sql
-- Penjualan per kategori per status pesanan
SELECT 
    k.nama AS kategori,
    ps.status,
    COUNT(*) AS jumlah,
    SUM(dp.jumlah * dp.harga_saat_pesan) AS total
FROM detail_pesanan dp
JOIN pesanan ps ON dp.pesanan_id = ps.id
JOIN produk pr ON dp.produk_id = pr.id
JOIN kategori k ON pr.kategori_id = k.id
GROUP BY k.nama, ps.status
ORDER BY k.nama, ps.status;
\`\`\`

---

## HAVING — Filter Setelah GROUP BY

\`WHERE\` digunakan **sebelum** pengelompokan — memfilter baris individual.
\`HAVING\` digunakan **setelah** pengelompokan — memfilter hasil agregasi.

### WHERE vs HAVING

\`\`\`
Data Mentah → WHERE (filter baris) → GROUP BY (kelompokkan) → HAVING (filter hasil) → SELECT
\`\`\`

\`\`\`sql
-- WHERE: filter SEBELUM dikelompokkan
-- Hanya hitung pesanan yang statusnya 'selesai'
SELECT 
    pl.nama,
    COUNT(ps.id) AS pesanan_selesai
FROM pelanggan pl
JOIN pesanan ps ON pl.id = ps.pelanggan_id
WHERE ps.status = 'selesai'  -- Filter SEBELUM GROUP BY
GROUP BY pl.id, pl.nama;

-- HAVING: filter SETELAH dikelompokkan
-- Hanya tampilkan pelanggan yang total belanjanya > 1 juta
SELECT 
    pl.nama,
    SUM(ps.total) AS total_belanja
FROM pelanggan pl
JOIN pesanan ps ON pl.id = ps.pelanggan_id
GROUP BY pl.id, pl.nama
HAVING SUM(ps.total) > 1000000;  -- Filter SETELAH GROUP BY
\`\`\`

\`\`\`sql
-- Kategori dengan lebih dari 2 produk
SELECT 
    k.nama AS kategori,
    COUNT(pr.id) AS jumlah_produk
FROM kategori k
JOIN produk pr ON k.id = pr.kategori_id
GROUP BY k.id, k.nama
HAVING COUNT(pr.id) > 2;

-- Produk yang terjual lebih dari 3 unit total
SELECT 
    pr.nama,
    SUM(dp.jumlah) AS total_terjual
FROM produk pr
JOIN detail_pesanan dp ON pr.id = dp.produk_id
GROUP BY pr.id, pr.nama
HAVING SUM(dp.jumlah) > 3
ORDER BY total_terjual DESC;

-- WHERE dan HAVING dikombinasikan
-- Pelanggan dari Jakarta yang total belanjannya > 500rb
SELECT 
    pl.nama,
    pl.kota,
    COUNT(ps.id) AS jumlah_pesanan,
    SUM(ps.total) AS total_belanja
FROM pelanggan pl
JOIN pesanan ps ON pl.id = ps.pelanggan_id
WHERE pl.kota = 'Jakarta'           -- Filter kota SEBELUM group
GROUP BY pl.id, pl.nama, pl.kota
HAVING SUM(ps.total) > 500000       -- Filter total SETELAH group
ORDER BY total_belanja DESC;
\`\`\`

---

## DISTINCT — Nilai Unik dalam Konteks Agregasi

\`\`\`sql
-- Hitung berapa kota berbeda yang ada pelanggannya
SELECT COUNT(DISTINCT kota) AS jumlah_kota FROM pelanggan;

-- Hitung berapa pelanggan berbeda yang pernah pesan
SELECT COUNT(DISTINCT pelanggan_id) AS pelanggan_aktif FROM pesanan;

-- Hitung berapa produk berbeda yang pernah terjual
SELECT COUNT(DISTINCT produk_id) AS produk_terjual FROM detail_pesanan;
\`\`\`

---

## Contoh Laporan Bisnis Nyata

### Laporan Penjualan Bulanan

\`\`\`sql
-- Laporan ringkasan penjualan per bulan
SELECT 
    strftime('%Y-%m', tanggal) AS bulan,   -- SQLite
    COUNT(*) AS jumlah_transaksi,
    SUM(total) AS total_penjualan,
    AVG(total) AS rata_transaksi,
    MIN(total) AS transaksi_terkecil,
    MAX(total) AS transaksi_terbesar
FROM pesanan
WHERE status = 'selesai'
GROUP BY strftime('%Y-%m', tanggal)
ORDER BY bulan;

-- PostgreSQL:
-- GROUP BY DATE_TRUNC('month', tanggal)
\`\`\`

### Dashboard Produk Terlaris

\`\`\`sql
-- Top 5 produk terlaris bulan ini
SELECT 
    pr.nama,
    k.nama AS kategori,
    SUM(dp.jumlah) AS unit_terjual,
    SUM(dp.jumlah * dp.harga_saat_pesan) AS pendapatan,
    COUNT(DISTINCT dp.pesanan_id) AS jumlah_transaksi
FROM detail_pesanan dp
JOIN produk pr ON dp.produk_id = pr.id
JOIN kategori k ON pr.kategori_id = k.id
JOIN pesanan ps ON dp.pesanan_id = ps.id
WHERE ps.status IN ('selesai', 'dikirim')
GROUP BY pr.id, pr.nama, k.nama
ORDER BY unit_terjual DESC
LIMIT 5;
\`\`\`

### Analisis Pelanggan

\`\`\`sql
-- Segmentasi pelanggan berdasarkan total belanja
SELECT 
    CASE 
        WHEN SUM(ps.total) > 5000000 THEN 'VIP'
        WHEN SUM(ps.total) > 1000000 THEN 'Regular'
        ELSE 'Baru'
    END AS segmen,
    COUNT(DISTINCT pl.id) AS jumlah_pelanggan,
    SUM(ps.total) AS total_belanja
FROM pelanggan pl
LEFT JOIN pesanan ps ON pl.id = ps.pelanggan_id
GROUP BY 
    CASE 
        WHEN SUM(ps.total) > 5000000 THEN 'VIP'
        WHEN SUM(ps.total) > 1000000 THEN 'Regular'
        ELSE 'Baru'
    END;
\`\`\`

### Performa Kategori

\`\`\`sql
-- Pendapatan dan rata-rata per kategori
SELECT 
    k.nama AS kategori,
    COUNT(DISTINCT pr.id) AS jumlah_produk,
    SUM(dp.jumlah) AS total_unit_terjual,
    SUM(dp.jumlah * dp.harga_saat_pesan) AS total_pendapatan,
    AVG(dp.harga_saat_pesan) AS rata_harga_jual
FROM kategori k
LEFT JOIN produk pr ON k.id = pr.kategori_id
LEFT JOIN detail_pesanan dp ON pr.id = dp.produk_id
GROUP BY k.id, k.nama
ORDER BY total_pendapatan DESC;
\`\`\`

---

## Urutan Eksekusi Query SQL

Memahami urutan ini penting untuk mengerti kenapa HAVING bisa pakai fungsi agregasi tapi WHERE tidak:

\`\`\`
1. FROM       — Tentukan tabel sumber
2. JOIN       — Gabungkan tabel
3. WHERE      — Filter baris (sebelum agregasi)
4. GROUP BY   — Kelompokkan baris
5. HAVING     — Filter kelompok (setelah agregasi)
6. SELECT     — Tentukan kolom output
7. DISTINCT   — Hilangkan duplikat
8. ORDER BY   — Urutkan hasil
9. LIMIT/OFFSET — Batasi hasil
\`\`\`

\`\`\`sql
-- Contoh query yang menggunakan semua klausa
SELECT 
    k.nama AS kategori,              -- 6. SELECT
    COUNT(pr.id) AS jumlah_produk,   -- 6. SELECT (agregasi)
    AVG(pr.harga) AS rata_harga      -- 6. SELECT (agregasi)
FROM produk pr                        -- 1. FROM
JOIN kategori k ON pr.kategori_id = k.id  -- 2. JOIN
WHERE pr.aktif = 1                   -- 3. WHERE (sebelum group)
GROUP BY k.id, k.nama                -- 4. GROUP BY
HAVING COUNT(pr.id) >= 2             -- 5. HAVING (setelah group)
ORDER BY rata_harga DESC             -- 8. ORDER BY
LIMIT 3;                             -- 9. LIMIT
\`\`\`

---

## Ringkasan Pelajaran 6

✅ \`COUNT(*)\` = hitung semua baris, \`COUNT(kolom)\` = hitung baris non-NULL

✅ \`SUM()\` = total, \`AVG()\` = rata-rata, \`MIN()\` = terkecil, \`MAX()\` = terbesar

✅ \`GROUP BY\` = kelompokkan baris berdasarkan nilai kolom, lalu agregasi tiap kelompok

✅ \`HAVING\` = filter hasil GROUP BY (setelah agregasi) — beda dengan WHERE (sebelum agregasi)

✅ \`COUNT(DISTINCT kolom)\` = hitung nilai unik

✅ Urutan eksekusi: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

---

Di pelajaran berikutnya: **Subquery & View** — cara membuat query yang lebih kompleks dan reusable!
`;
