export const sql_l9 = `
# SQL Lanjutan — Fungsi, CASE, dan Window Functions

Sampai sini kamu sudah bisa query data, join antar tabel, dan agregasi. Tapi SQL punya banyak lagi yang bisa dilakukan — terutama untuk analisis dan laporan bisnis.

Pelajaran ini tentang tiga hal: fungsi bawaan yang mempersingkat banyak pekerjaan, CASE WHEN untuk logika kondisional, dan window functions yang mengubah cara kita analisis data.

---

## 🔤 Fungsi String

Fungsi-fungsi ini sangat berguna untuk bersihkan dan format data teks:

\`\`\`sql
SELECT
    nama,
    UPPER(nama)           AS nama_kapital,      -- 'BUDI SANTOSO'
    LOWER(email)          AS email_kecil,       -- 'budi@email.com'
    LENGTH(nama)          AS panjang_nama,      -- 12
    TRIM('  spasi  ')     AS tanpa_spasi,       -- 'spasi'
    SUBSTRING(nama, 1, 4) AS empat_huruf_awal,  -- 'Budi'
    REPLACE(email, '@email.com', '') AS username, -- 'budi'
    CONCAT(nama, ' - ', kota) AS info           -- 'Budi Santoso - Jakarta'
FROM pelanggan;

-- Cari berdasarkan pola (case-insensitive dengan ILIKE di PostgreSQL)
SELECT nama FROM pelanggan WHERE nama ILIKE '%budi%';

-- Split string
SELECT SPLIT_PART('Budi.Santoso.Jakarta', '.', 2);  -- 'Santoso'
\`\`\`

---

## 📅 Fungsi Tanggal & Waktu

\`\`\`sql
-- Tanggal sekarang
SELECT NOW();               -- 2024-06-05 10:30:00
SELECT CURRENT_DATE;        -- 2024-06-05
SELECT CURRENT_TIME;        -- 10:30:00

-- Ekstrak bagian tanggal
SELECT
    tanggal,
    EXTRACT(YEAR  FROM tanggal) AS tahun,
    EXTRACT(MONTH FROM tanggal) AS bulan,
    EXTRACT(DAY   FROM tanggal) AS hari,
    EXTRACT(HOUR  FROM tanggal) AS jam,
    TO_CHAR(tanggal, 'DD/MM/YYYY') AS format_indonesia,
    TO_CHAR(tanggal, 'Month YYYY') AS bulan_tahun
FROM pesanan;

-- Hitung selisih waktu
SELECT
    nama,
    created_at,
    NOW() - created_at AS umur_akun,
    DATE_PART('day', NOW() - created_at) AS hari_bergabung
FROM pelanggan;

-- Truncate ke periode
SELECT DATE_TRUNC('month', tanggal) AS bulan, SUM(total) AS omset
FROM pesanan
GROUP BY DATE_TRUNC('month', tanggal)
ORDER BY bulan;

-- Tambah/kurang waktu
SELECT NOW() + INTERVAL '7 days';     -- 7 hari ke depan
SELECT NOW() - INTERVAL '1 month';    -- 1 bulan lalu
SELECT tanggal + INTERVAL '30 days' AS estimasi_tiba FROM pesanan;
\`\`\`

---

## 🔢 Fungsi Angka

\`\`\`sql
SELECT
    ROUND(3.14159, 2)     AS dibulatkan,    -- 3.14
    CEIL(4.1)             AS ke_atas,       -- 5
    FLOOR(4.9)            AS ke_bawah,      -- 4
    ABS(-15)              AS nilai_absolut, -- 15
    POWER(2, 10)          AS dua_pangkat_10,-- 1024
    SQRT(144)             AS akar_kuadrat,  -- 12
    MOD(17, 5)            AS sisa_bagi,     -- 2
    GREATEST(10, 20, 15)  AS terbesar,      -- 20
    LEAST(10, 20, 15)     AS terkecil;      -- 10

-- Random
SELECT RANDOM();              -- 0.0 - 1.0
SELECT FLOOR(RANDOM() * 100); -- 0 - 99
\`\`\`

---

## 🔄 CASE WHEN — If/Else di SQL

\`\`\`sql
-- Klasifikasi berdasarkan kondisi
SELECT
    nama,
    harga,
    CASE
        WHEN harga >= 5000000 THEN 'Premium'
        WHEN harga >= 1000000 THEN 'Menengah'
        WHEN harga >= 100000  THEN 'Standar'
        ELSE 'Budget'
    END AS segmen_harga
FROM produk;

-- Pivot sederhana: hitung pesanan per status
SELECT
    COUNT(CASE WHEN status = 'pending'   THEN 1 END) AS pending,
    COUNT(CASE WHEN status = 'paid'      THEN 1 END) AS paid,
    COUNT(CASE WHEN status = 'shipped'   THEN 1 END) AS shipped,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled
FROM pesanan;

-- Gunakan CASE di ORDER BY
SELECT nama, harga FROM produk
ORDER BY CASE kategori
    WHEN 'Elektronik' THEN 1
    WHEN 'Audio'      THEN 2
    ELSE 3
END, harga DESC;
\`\`\`

---

## 🫙 COALESCE & NULLIF — Handle NULL

\`\`\`sql
-- COALESCE: kembalikan nilai pertama yang bukan NULL
SELECT
    nama,
    COALESCE(telepon, 'Tidak ada nomor') AS no_telepon,
    COALESCE(diskon, 0) AS diskon_persen
FROM pelanggan;

-- Contoh nyata: gunakan harga diskon jika ada, jika tidak pakai harga normal
SELECT
    nama,
    COALESCE(harga_diskon, harga) AS harga_efektif
FROM produk;

-- NULLIF: kembalikan NULL jika dua nilai sama (hindari division by zero)
SELECT total / NULLIF(qty, 0) AS harga_per_item  -- Tidak crash jika qty = 0
FROM item_pesanan;

-- IS NULL / IS NOT NULL
SELECT * FROM pelanggan WHERE telepon IS NULL;
SELECT * FROM pelanggan WHERE telepon IS NOT NULL;
\`\`\`

---

## 🪟 Window Functions — Agregat Tanpa GROUP BY

Window functions melakukan kalkulasi seperti SUM/AVG tapi **mempertahankan semua baris** (tidak dikelompokkan).

\`\`\`sql
-- ROW_NUMBER: nomor urut dalam grup
SELECT
    nama,
    kategori,
    harga,
    ROW_NUMBER() OVER (PARTITION BY kategori ORDER BY harga DESC) AS rank_di_kategori
FROM produk;
-- Output:
-- Laptop ASUS | Elektronik | 8500000 | 1
-- Monitor LG  | Elektronik | 3200000 | 2
-- Headset Sony| Audio      | 2500000 | 1

-- RANK vs DENSE_RANK (bedanya di angka yang sama)
SELECT
    nama, harga,
    RANK()       OVER (ORDER BY harga DESC) AS rank,       -- 1,2,2,4 (skip 3)
    DENSE_RANK() OVER (ORDER BY harga DESC) AS dense_rank  -- 1,2,2,3 (tidak skip)
FROM produk;

-- Running total (akumulasi)
SELECT
    tanggal,
    total,
    SUM(total) OVER (ORDER BY tanggal) AS kumulatif
FROM pesanan
ORDER BY tanggal;

-- Rata-rata bergerak (moving average)
SELECT
    tanggal,
    total,
    AVG(total) OVER (ORDER BY tanggal ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rata_rata_3_hari
FROM pesanan;

-- LAG & LEAD: bandingkan dengan baris sebelum/sesudah
SELECT
    DATE_TRUNC('month', tanggal) AS bulan,
    SUM(total) AS omset,
    LAG(SUM(total)) OVER (ORDER BY DATE_TRUNC('month', tanggal)) AS omset_bulan_lalu,
    SUM(total) - LAG(SUM(total)) OVER (ORDER BY DATE_TRUNC('month', tanggal)) AS selisih
FROM pesanan
GROUP BY DATE_TRUNC('month', tanggal)
ORDER BY bulan;

-- NTILE: bagi ke N bucket (kuartil, persentil)
SELECT
    nama,
    total_belanja,
    NTILE(4) OVER (ORDER BY total_belanja DESC) AS kuartil  -- 1=atas 25%, 4=bawah 25%
FROM (
    SELECT pelanggan_id, SUM(total) AS total_belanja FROM pesanan GROUP BY pelanggan_id
) t;
\`\`\`

---

## 📊 Contoh: Laporan Bisnis Komprehensif

\`\`\`sql
-- Dashboard eksekutif: performa penjualan per bulan dengan perbandingan
WITH bulanan AS (
    SELECT
        DATE_TRUNC('month', tanggal)::date AS bulan,
        COUNT(*)        AS jumlah_transaksi,
        SUM(total)      AS omset,
        AVG(total)      AS rata_rata_transaksi,
        COUNT(DISTINCT pelanggan_id) AS pelanggan_unik
    FROM pesanan
    WHERE status = 'paid'
    GROUP BY DATE_TRUNC('month', tanggal)
)
SELECT
    TO_CHAR(bulan, 'Mon YYYY')          AS periode,
    jumlah_transaksi,
    ROUND(omset)                         AS omset,
    ROUND(rata_rata_transaksi)           AS avg_transaksi,
    pelanggan_unik,
    ROUND(omset / NULLIF(LAG(omset) OVER (ORDER BY bulan), 0) * 100 - 100, 1) AS growth_pct
FROM bulanan
ORDER BY bulan;
\`\`\`

---

## 📝 Ringkasan

\`\`\`sql
-- String: UPPER, LOWER, LENGTH, TRIM, SUBSTRING, REPLACE, CONCAT
-- Tanggal: NOW(), EXTRACT(), DATE_TRUNC(), TO_CHAR(), INTERVAL
-- Angka: ROUND, CEIL, FLOOR, ABS, POWER, SQRT

-- CASE WHEN nilai THEN hasil ELSE default END
-- COALESCE(kol1, kol2, default)  ← nilai pertama yang bukan NULL
-- NULLIF(a, b) ← NULL jika a = b

-- Window: OVER (PARTITION BY ... ORDER BY ...)
-- ROW_NUMBER, RANK, DENSE_RANK, SUM, AVG, LAG, LEAD, NTILE
\`\`\`

> **Di pelajaran terakhir, kita bahas desain database yang baik dan best practices!** 🏗️
`;
