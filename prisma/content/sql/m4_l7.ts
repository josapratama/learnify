export const sql_l7 = `
# Subquery & View — Query yang Lebih Kompleks dan Reusable

Sejauh ini query kita langsung ambil dari tabel. Tapi kadang kita butuh sesuatu yang lebih: "tampilkan produk yang harganya di atas rata-rata" atau "pelanggan mana yang belum pernah pesan?".

Untuk pertanyaan seperti itu, kita butuh **subquery** — query di dalam query lain. Dan untuk query yang sering dipakai ulang, kita bisa simpan sebagai **View**.

---

## Apa itu Subquery?

Subquery adalah query di dalam query lain. Seperti menjawab pertanyaan yang butuh menghitung sesuatu dulu sebelum bisa dijawab:

"Tampilkan produk yang harganya lebih mahal dari rata-rata"
- Pertama hitung: "Berapa rata-rata harga semua produk?"
- Lalu filter: "Produk mana yang lebih mahal dari angka itu?"

\`\`\`sql
-- Tanpa subquery — kamu harus tahu rata-rata dulu (misal 606428)
SELECT nama, harga FROM produk WHERE harga > 606428;

-- Dengan subquery — database hitung otomatis, lebih maintainable
SELECT nama, harga 
FROM produk 
WHERE harga > (SELECT AVG(harga) FROM produk);
\`\`\`

---

## Subquery di WHERE

### Subquery yang Mengembalikan Satu Nilai

\`\`\`sql
-- Produk yang harganya di atas rata-rata
SELECT nama, harga
FROM produk
WHERE harga > (SELECT AVG(harga) FROM produk)
ORDER BY harga DESC;

-- Produk dengan harga sama dengan produk termahal
SELECT nama, harga
FROM produk
WHERE harga = (SELECT MAX(harga) FROM produk);

-- Pesanan dengan total di atas rata-rata
SELECT id, pelanggan_id, total, status
FROM pesanan
WHERE total > (SELECT AVG(total) FROM pesanan)
ORDER BY total DESC;
\`\`\`

### Subquery dengan IN

Subquery yang mengembalikan banyak nilai, digunakan dengan IN:

\`\`\`sql
-- Pelanggan yang pernah melakukan pesanan
SELECT nama, email
FROM pelanggan
WHERE id IN (SELECT DISTINCT pelanggan_id FROM pesanan);

-- Pelanggan yang BELUM pernah pesan
SELECT nama, email
FROM pelanggan
WHERE id NOT IN (SELECT DISTINCT pelanggan_id FROM pesanan);

-- Produk yang pernah dipesan lebih dari 2 unit dalam satu transaksi
SELECT nama, harga
FROM produk
WHERE id IN (
    SELECT produk_id 
    FROM detail_pesanan 
    WHERE jumlah > 2
);
\`\`\`

### Subquery dengan EXISTS

EXISTS memeriksa apakah subquery mengembalikan setidaknya satu baris. Biasanya lebih cepat dari IN untuk dataset besar.

\`\`\`sql
-- Pelanggan yang pernah melakukan pesanan (menggunakan EXISTS)
SELECT nama, email
FROM pelanggan pl
WHERE EXISTS (
    SELECT 1 FROM pesanan ps 
    WHERE ps.pelanggan_id = pl.id
);
-- SELECT 1 artinya kita tidak peduli dengan nilai yang dikembalikan,
-- hanya peduli apakah ada baris yang cocok

-- Pelanggan yang belum pernah pesan (NOT EXISTS)
SELECT nama, email
FROM pelanggan pl
WHERE NOT EXISTS (
    SELECT 1 FROM pesanan ps 
    WHERE ps.pelanggan_id = pl.id
);

-- Kategori yang memiliki setidaknya satu produk dengan stok > 0
SELECT nama
FROM kategori k
WHERE EXISTS (
    SELECT 1 FROM produk pr
    WHERE pr.kategori_id = k.id AND pr.stok > 0
);
\`\`\`

---

## Subquery di FROM (Derived Table)

Subquery bisa dijadikan tabel sementara di klausa FROM. Ini disebut **derived table** atau **inline view**.

\`\`\`sql
-- Rata-rata total belanja per pelanggan, lalu filter yang di atas 1 juta
SELECT 
    nama_pelanggan,
    total_belanja,
    jumlah_pesanan
FROM (
    -- Subquery: hitung total belanja per pelanggan
    SELECT 
        pl.nama AS nama_pelanggan,
        SUM(ps.total) AS total_belanja,
        COUNT(ps.id) AS jumlah_pesanan
    FROM pelanggan pl
    JOIN pesanan ps ON pl.id = ps.pelanggan_id
    GROUP BY pl.id, pl.nama
) AS ringkasan_pelanggan
WHERE total_belanja > 1000000
ORDER BY total_belanja DESC;
\`\`\`

\`\`\`sql
-- Produk terlaris per kategori
SELECT 
    kategori,
    nama_produk,
    total_terjual
FROM (
    SELECT 
        k.nama AS kategori,
        pr.nama AS nama_produk,
        SUM(dp.jumlah) AS total_terjual,
        ROW_NUMBER() OVER (PARTITION BY k.id ORDER BY SUM(dp.jumlah) DESC) AS ranking
    FROM detail_pesanan dp
    JOIN produk pr ON dp.produk_id = pr.id
    JOIN kategori k ON pr.kategori_id = k.id
    GROUP BY k.id, k.nama, pr.id, pr.nama
) AS ranked_products
WHERE ranking = 1;
\`\`\`

---

## Subquery di SELECT (Scalar Subquery)

Subquery yang mengembalikan **tepat satu nilai** untuk setiap baris:

\`\`\`sql
-- Untuk setiap produk, tampilkan juga jumlah total yang pernah terjual
SELECT 
    pr.nama,
    pr.harga,
    pr.stok,
    (SELECT SUM(dp.jumlah) 
     FROM detail_pesanan dp 
     WHERE dp.produk_id = pr.id) AS total_terjual
FROM produk pr
ORDER BY pr.nama;

-- Untuk setiap pelanggan, tampilkan total pesanan mereka
SELECT 
    pl.nama,
    pl.kota,
    (SELECT COUNT(*) FROM pesanan ps WHERE ps.pelanggan_id = pl.id) AS jumlah_pesanan,
    (SELECT SUM(total) FROM pesanan ps WHERE ps.pelanggan_id = pl.id) AS total_belanja
FROM pelanggan pl
ORDER BY total_belanja DESC NULLS LAST;
\`\`\`

---

## Correlated Subquery

Subquery yang mereferensikan nilai dari query luar. Dijalankan **sekali untuk setiap baris** dari query luar.

\`\`\`sql
-- Produk yang harganya di atas rata-rata kategorinya sendiri
SELECT 
    pr.nama,
    pr.harga,
    k.nama AS kategori,
    (SELECT AVG(pr2.harga) FROM produk pr2 WHERE pr2.kategori_id = pr.kategori_id) AS rata_kategori
FROM produk pr
JOIN kategori k ON pr.kategori_id = k.id
WHERE pr.harga > (
    SELECT AVG(pr2.harga)
    FROM produk pr2
    WHERE pr2.kategori_id = pr.kategori_id  -- Referensi ke query luar!
)
ORDER BY k.nama, pr.harga;
\`\`\`

---

## WITH — Common Table Expression (CTE)

CTE adalah cara menulis subquery dengan nama yang lebih bersih dan readable. Sintaksnya menggunakan \`WITH nama_cte AS (...)\`.

### CTE Sederhana

\`\`\`sql
-- Tanpa CTE (sulit dibaca):
SELECT nama, total_belanja 
FROM (
    SELECT pl.nama, SUM(ps.total) AS total_belanja
    FROM pelanggan pl JOIN pesanan ps ON pl.id = ps.pelanggan_id
    GROUP BY pl.id, pl.nama
) sub
WHERE total_belanja > 1000000;

-- Dengan CTE (lebih bersih):
WITH belanja_per_pelanggan AS (
    SELECT 
        pl.nama,
        pl.kota,
        SUM(ps.total) AS total_belanja,
        COUNT(ps.id) AS jumlah_pesanan
    FROM pelanggan pl
    JOIN pesanan ps ON pl.id = ps.pelanggan_id
    GROUP BY pl.id, pl.nama, pl.kota
)
SELECT nama, kota, total_belanja, jumlah_pesanan
FROM belanja_per_pelanggan
WHERE total_belanja > 1000000
ORDER BY total_belanja DESC;
\`\`\`

### Multiple CTE

\`\`\`sql
WITH 
-- CTE 1: Hitung total per produk
penjualan_produk AS (
    SELECT 
        pr.id,
        pr.nama,
        pr.kategori_id,
        SUM(dp.jumlah) AS unit_terjual,
        SUM(dp.jumlah * dp.harga_saat_pesan) AS pendapatan
    FROM produk pr
    JOIN detail_pesanan dp ON pr.id = dp.produk_id
    GROUP BY pr.id, pr.nama, pr.kategori_id
),

-- CTE 2: Rata-rata pendapatan per kategori
avg_per_kategori AS (
    SELECT 
        kategori_id,
        AVG(pendapatan) AS avg_pendapatan
    FROM penjualan_produk
    GROUP BY kategori_id
)

-- Query utama: produk yang pendapatannya di atas rata-rata kategorinya
SELECT 
    pp.nama AS produk,
    k.nama AS kategori,
    pp.pendapatan,
    ak.avg_pendapatan,
    pp.pendapatan - ak.avg_pendapatan AS selisih_dari_rata
FROM penjualan_produk pp
JOIN avg_per_kategori ak ON pp.kategori_id = ak.kategori_id
JOIN kategori k ON pp.kategori_id = k.id
WHERE pp.pendapatan > ak.avg_pendapatan
ORDER BY selisih_dari_rata DESC;
\`\`\`

### CTE untuk Laporan Kompleks

\`\`\`sql
-- Laporan komprehensif performa toko

WITH 
-- Data dasar semua transaksi
transaksi AS (
    SELECT 
        ps.id AS pesanan_id,
        pl.id AS pelanggan_id,
        pl.nama AS pelanggan,
        pl.kota,
        ps.tanggal,
        ps.total,
        ps.status
    FROM pesanan ps
    JOIN pelanggan pl ON ps.pelanggan_id = pl.id
    WHERE ps.status IN ('selesai', 'dikirim')
),

-- Statistik per pelanggan
stats_pelanggan AS (
    SELECT 
        pelanggan_id,
        pelanggan,
        kota,
        COUNT(*) AS jumlah_pesanan,
        SUM(total) AS total_belanja,
        AVG(total) AS rata_per_pesanan,
        MIN(tanggal) AS pesanan_pertama,
        MAX(tanggal) AS pesanan_terakhir
    FROM transaksi
    GROUP BY pelanggan_id, pelanggan, kota
)

-- Tampilkan dengan segmentasi
SELECT 
    pelanggan,
    kota,
    jumlah_pesanan,
    total_belanja,
    rata_per_pesanan,
    CASE 
        WHEN total_belanja >= 5000000 THEN '🥇 VIP'
        WHEN total_belanja >= 1000000 THEN '🥈 Regular'
        ELSE '🥉 Baru'
    END AS segmen
FROM stats_pelanggan
ORDER BY total_belanja DESC;
\`\`\`

---

## CREATE VIEW — Menyimpan Query sebagai View

View adalah **query tersimpan** yang bisa dipakai seperti tabel biasa. Berguna untuk:
- Menyembunyikan kompleksitas query
- Keamanan (batasi kolom yang bisa diakses)
- Reusability (pakai ulang tanpa copy-paste query)

### Membuat View

\`\`\`sql
-- Buat view untuk detail pesanan lengkap
CREATE VIEW v_detail_pesanan AS
SELECT 
    ps.id AS pesanan_id,
    pl.nama AS nama_pelanggan,
    pl.email,
    pl.kota,
    pr.nama AS nama_produk,
    k.nama AS kategori,
    dp.jumlah,
    dp.harga_saat_pesan,
    (dp.jumlah * dp.harga_saat_pesan) AS subtotal,
    ps.tanggal,
    ps.status
FROM detail_pesanan dp
JOIN pesanan ps ON dp.pesanan_id = ps.id
JOIN pelanggan pl ON ps.pelanggan_id = pl.id
JOIN produk pr ON dp.produk_id = pr.id
JOIN kategori k ON pr.kategori_id = k.id;

-- Pakai view seperti tabel biasa!
SELECT * FROM v_detail_pesanan;

SELECT * FROM v_detail_pesanan 
WHERE status = 'selesai' 
ORDER BY tanggal DESC;

SELECT nama_pelanggan, SUM(subtotal) AS total
FROM v_detail_pesanan
GROUP BY nama_pelanggan;
\`\`\`

\`\`\`sql
-- View untuk statistik produk
CREATE VIEW v_statistik_produk AS
SELECT 
    pr.id,
    pr.nama,
    k.nama AS kategori,
    pr.harga,
    pr.stok,
    COALESCE(SUM(dp.jumlah), 0) AS total_terjual,
    COALESCE(SUM(dp.jumlah * dp.harga_saat_pesan), 0) AS total_pendapatan
FROM produk pr
LEFT JOIN kategori k ON pr.kategori_id = k.id
LEFT JOIN detail_pesanan dp ON pr.id = dp.produk_id
GROUP BY pr.id, pr.nama, k.nama, pr.harga, pr.stok;

-- Pakai view
SELECT * FROM v_statistik_produk ORDER BY total_pendapatan DESC;
\`\`\`

### Mengelola View

\`\`\`sql
-- Lihat view yang sudah dibuat (SQLite)
SELECT name FROM sqlite_master WHERE type = 'view';

-- Lihat view di PostgreSQL
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public';

-- Hapus view
DROP VIEW IF EXISTS v_detail_pesanan;

-- Update view (hapus lalu buat ulang)
CREATE OR REPLACE VIEW v_detail_pesanan AS  -- PostgreSQL
SELECT ... -- query baru;

-- SQLite: harus DROP dulu lalu CREATE
DROP VIEW IF EXISTS v_detail_pesanan;
CREATE VIEW v_detail_pesanan AS SELECT ...;
\`\`\`

### Kapan Pakai View?

✅ **Pakai View ketika:**
- Query JOIN kompleks yang sering digunakan berulang
- Ingin batasi kolom sensitif (misal sembunyikan kolom password/gaji)
- Membuat "lapisan abstraksi" di atas tabel

❌ **Jangan pakai View ketika:**
- Butuh performa sangat tinggi (view tidak lebih cepat dari query langsung)
- Query hanya dipakai sekali
- Perlu parameter/input yang berubah (gunakan prepared statement)

---

## Ringkasan Pelajaran 7

✅ **Subquery di WHERE** — bandingkan dengan hasil dari query lain

✅ **Subquery dengan IN/EXISTS** — cek apakah nilai ada dalam kumpulan hasil query lain

✅ **Subquery di FROM** — jadikan hasil query sebagai tabel sementara

✅ **Correlated subquery** — subquery yang mereferensikan baris dari query luar

✅ **WITH (CTE)** — beri nama pada subquery untuk kode yang lebih bersih dan readable

✅ **CREATE VIEW** — simpan query sebagai objek database yang bisa dipakai ulang seperti tabel

---

Di pelajaran berikutnya: **Index & Performa Query** — cara membuat database berlari lebih cepat!
`;
