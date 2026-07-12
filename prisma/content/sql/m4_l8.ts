export const sql_l8 = `
# Index & Optimasi Query — Kenapa Query Kamu Bisa Lambat?

Pernah nulis query yang hasilnya benar tapi butuh waktu lama? Atau lihat aplikasi yang loading-nya lama padahal datanya "tidak banyak"?

Kemungkinan besar masalahnya ada di sini: **tidak ada index** pada kolom yang sering diquery.

Tanpa index, database harus periksa satu per satu dari seluruh tabel setiap kali ada query. Bayangkan cari satu nama di buku telepon 1000 halaman tanpa daftar isi — baca dari halaman pertama. Dengan index, database langsung loncat ke halaman yang tepat.

---

## 🐢 Masalah Tanpa Index — Skala yang Riil

\`\`\`sql
-- Tabel dengan 1 juta baris tanpa index
-- Query ini harus periksa SEMUA baris (Full Table Scan):
SELECT * FROM pesanan WHERE pelanggan_id = 12345;
-- Waktu eksekusi: 2-3 detik 😴

-- Buat index pada kolom yang sering di-query:
CREATE INDEX idx_pesanan_pelanggan ON pesanan(pelanggan_id);

-- Query yang sama sekarang:
-- Waktu eksekusi: <1ms ⚡ (ribuan kali lebih cepat!)
\`\`\`

---

## 🏗️ Membuat Index

\`\`\`sql
-- Index biasa
CREATE INDEX idx_produk_kategori ON produk(kategori);

-- Unique index (juga enforce constraint unik)
CREATE UNIQUE INDEX idx_pelanggan_email ON pelanggan(email);
-- Sama dengan: UNIQUE constraint saat CREATE TABLE

-- Composite index (beberapa kolom)
CREATE INDEX idx_pesanan_status_tanggal ON pesanan(status, tanggal);

-- Index hanya untuk subset data (partial index)
CREATE INDEX idx_pesanan_aktif ON pesanan(tanggal)
WHERE status = 'pending';

-- Lihat semua index pada tabel
\di pelanggan      -- PostgreSQL
SHOW INDEX FROM pelanggan;  -- MySQL

-- Hapus index
DROP INDEX idx_produk_kategori;
DROP INDEX IF EXISTS idx_produk_kategori;
\`\`\`

---

## 🔍 EXPLAIN — Pahami Rencana Query

\`\`\`sql
-- EXPLAIN = lihat bagaimana database akan menjalankan query
EXPLAIN SELECT * FROM produk WHERE kategori = 'Elektronik';

-- Output (tanpa index):
-- Seq Scan on produk  (cost=0.00..18.50 rows=3 width=...)
--   Filter: ((kategori)::text = 'Elektronik')

-- Buat index
CREATE INDEX idx_produk_kategori ON produk(kategori);

-- EXPLAIN lagi:
-- Index Scan using idx_produk_kategori on produk (cost=0.28..8.30...)
--   Index Cond: ((kategori)::text = 'Elektronik')
-- Jauh lebih efisien!

-- EXPLAIN ANALYZE = eksekusi sungguhan + statistik waktu
EXPLAIN ANALYZE
SELECT p.nama, SUM(ip.qty) as total_terjual
FROM produk p
JOIN item_pesanan ip ON p.id = ip.produk_id
GROUP BY p.id, p.nama
ORDER BY total_terjual DESC;
\`\`\`

---

## ⚖️ Kapan Pakai Index — Kapan Tidak

### Pakai Index Ketika:
\`\`\`sql
-- ✅ Kolom sering ada di WHERE
SELECT * FROM pesanan WHERE pelanggan_id = 5;   -- Perlu index pada pelanggan_id

-- ✅ Kolom sering di-JOIN
SELECT * FROM pesanan p JOIN pelanggan pl ON p.pelanggan_id = pl.id;
-- Perlu index pada pesanan.pelanggan_id

-- ✅ Kolom sering di-ORDER BY atau GROUP BY
SELECT kategori, COUNT(*) FROM produk GROUP BY kategori;
-- Index pada kategori membantu

-- ✅ Kolom yang sering dicari range
SELECT * FROM pesanan WHERE tanggal BETWEEN '2024-01-01' AND '2024-12-31';
\`\`\`

### Jangan Pakai Index Ketika:
\`\`\`sql
-- ❌ Tabel kecil (< 1000 baris) — overhead lebih besar dari manfaat
-- ❌ Kolom yang sangat sering di-UPDATE (index ikut update, lambat)
-- ❌ Kolom dengan sedikit nilai unik (boolean, status dengan 2-3 nilai)
-- ❌ Terlalu banyak index = INSERT/UPDATE/DELETE jadi lambat

-- Cek apakah index dipakai (lihat 0 rows read via index = tidak berguna):
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan;
\`\`\`

---

## 🚀 Tips Optimasi Query

### 1. Hindari SELECT *
\`\`\`sql
-- ❌ Ambil semua kolom (boros bandwidth dan memori)
SELECT * FROM pesanan WHERE status = 'pending';

-- ✅ Ambil hanya yang dibutuhkan
SELECT id, pelanggan_id, total, tanggal FROM pesanan WHERE status = 'pending';
\`\`\`

### 2. Gunakan LIMIT untuk Paginasi
\`\`\`sql
-- ❌ Ambil semua, lalu filter di aplikasi
SELECT * FROM produk;

-- ✅ Paginasi di database
SELECT * FROM produk ORDER BY id LIMIT 20 OFFSET 0;  -- Halaman 1
SELECT * FROM produk ORDER BY id LIMIT 20 OFFSET 20; -- Halaman 2
\`\`\`

### 3. Hindari Fungsi pada Kolom Terindeks
\`\`\`sql
-- ❌ Index tidak dipakai karena fungsi pada kolom
SELECT * FROM pelanggan WHERE UPPER(email) = 'BUDI@EMAIL.COM';
SELECT * FROM pesanan WHERE EXTRACT(YEAR FROM tanggal) = 2024;

-- ✅ Simpan data dalam format yang langsung bisa di-query
SELECT * FROM pelanggan WHERE email = 'budi@email.com';
SELECT * FROM pesanan WHERE tanggal >= '2024-01-01' AND tanggal < '2025-01-01';
\`\`\`

### 4. N+1 Problem — Jebakan Tersembunyi
\`\`\`sql
-- ❌ N+1: 1 query untuk list, lalu N query untuk detail masing-masing
-- (Problem umum di ORM/aplikasi)
-- Loop: untuk setiap pelanggan, query pesanannya → 1 + N query!

-- ✅ Solusi: Satu query dengan JOIN
SELECT pl.nama, COUNT(ps.id) as total_pesanan, SUM(ps.total) as total_belanja
FROM pelanggan pl
LEFT JOIN pesanan ps ON pl.id = ps.pelanggan_id
GROUP BY pl.id, pl.nama;
\`\`\`

### 5. Connection Pooling
\`\`\`
Membuka koneksi database itu mahal (butuh waktu ~100ms).
Gunakan connection pool — siapkan koneksi yang siap pakai.

Tools: pgBouncer (PostgreSQL), HikariCP (Java), node-postgres pool
\`\`\`

---

## 📝 Ringkasan

\`\`\`sql
-- Buat index
CREATE INDEX idx_nama ON tabel(kolom);
CREATE UNIQUE INDEX idx_nama ON tabel(kolom);
CREATE INDEX idx_nama ON tabel(kol1, kol2);  -- Composite

-- Hapus index
DROP INDEX idx_nama;

-- Analisis query
EXPLAIN query;
EXPLAIN ANALYZE query;

-- Tips optimasi:
-- ✅ Pilih kolom spesifik, bukan SELECT *
-- ✅ Gunakan LIMIT untuk paginasi
-- ✅ Hindari fungsi pada kolom terindeks
-- ✅ Gunakan JOIN, bukan N+1 query
\`\`\`

> **Di pelajaran berikutnya, kita pelajari fungsi SQL lanjutan dan window functions!** 🪟
`;
