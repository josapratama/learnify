export const sql_l10 = `
# Desain Database & Best Practices

Database yang buruk adalah akar masalah yang sulit dilacak: data tidak konsisten, performa lambat, bug yang muncul tiba-tiba. Database yang baik adalah fondasi yang membuat semuanya lebih mudah.

Pelajaran ini merangkum prinsip-prinsip yang membedakan database yang hanya "jalan" dari database yang benar-benar solid untuk production.

---

## 📐 Normalisasi — Hilangkan Duplikasi

Normalisasi = proses menyusun tabel agar data tidak redundan dan konsisten.

### Sebelum Normalisasi

\`\`\`
Tabel: pesanan_flat
| id | pelanggan_nama | pelanggan_email | produk1       | harga1   | produk2 | harga2 |
|----|----------------|-----------------|---------------|----------|---------|--------|
|  1 | Budi Santoso   | budi@email.com  | Laptop ASUS   | 8500000  | Mouse   | 250000 |
|  2 | Budi Santoso   | budi@email.com  | Monitor LG    | 3200000  | NULL    | NULL   |
\`\`\`

**Masalah:**
- Email Budi duplikat — jika ganti email harus update semua baris
- Hanya bisa simpan 2 produk per pesanan
- Banyak kolom NULL

### Setelah Normalisasi

\`\`\`sql
-- Pisahkan ke tabel yang tepat
pelanggan: id, nama, email, kota
pesanan: id, pelanggan_id, tanggal, status, total
item_pesanan: id, pesanan_id, produk_id, qty, harga_satuan
\`\`\`

---

## 🗺️ ERD — Entity Relationship Diagram

ERD adalah peta visual struktur database:

\`\`\`
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  pelanggan   │     │   pesanan    │     │    produk    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │1   N│ id (PK)      │N   N│ id (PK)      │
│ nama         │◄────│ pelanggan_id │     │ nama         │
│ email        │     │ tanggal      │     │ harga        │
│ kota         │     │ total        │     │ stok         │
└──────────────┘     │ status       │     │ kategori     │
                     └─────┬────────┘     └──────┬───────┘
                           │                     │
                           │1                    │1
                           │                     │
                           ▼N                    ▼N
                     ┌──────────────┐
                     │ item_pesanan │
                     ├──────────────┤
                     │ id (PK)      │
                     │ pesanan_id   │
                     │ produk_id    │
                     │ qty          │
                     │ harga_satuan │
                     └──────────────┘
\`\`\`

---

## 📏 Naming Conventions

\`\`\`sql
-- ✅ Konvensi yang konsisten dan jelas

-- Nama tabel: plural, snake_case
pelanggan, produk, pesanan, item_pesanan, kategori_produk

-- Nama kolom: singular, snake_case, deskriptif
id, nama_lengkap, email, tanggal_lahir, total_harga, is_aktif

-- Primary key: selalu "id"
id SERIAL PRIMARY KEY

-- Foreign key: nama_tabel_id
pelanggan_id, produk_id, pesanan_id

-- Boolean: awalan is_ atau has_ atau can_
is_aktif, is_verified, has_paid, can_refund

-- Timestamps: selalu ada
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
\`\`\`

---

## 🗑️ Soft Delete vs Hard Delete

\`\`\`sql
-- Hard delete: hapus permanen (berisiko, tidak bisa recovery)
DELETE FROM pengguna WHERE id = 42;

-- Soft delete: tandai sebagai terhapus (lebih aman)
ALTER TABLE pengguna ADD COLUMN deleted_at TIMESTAMP;

-- "Hapus" user (soft)
UPDATE pengguna SET deleted_at = NOW() WHERE id = 42;

-- Query yang mengabaikan yang sudah "dihapus"
SELECT * FROM pengguna WHERE deleted_at IS NULL;

-- Restore yang sudah "terhapus"
UPDATE pengguna SET deleted_at = NULL WHERE id = 42;

-- Tampilkan semua termasuk yang terhapus
SELECT *, deleted_at IS NOT NULL AS is_deleted FROM pengguna;
\`\`\`

---

## 📋 Audit Trail

\`\`\`sql
-- Standar kolom untuk semua tabel production
CREATE TABLE produk (
    id         SERIAL PRIMARY KEY,
    nama       VARCHAR(200) NOT NULL,
    harga      DECIMAL(15,2),

    -- Audit columns (WAJIB ada di tabel production)
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INTEGER REFERENCES pengguna(id),
    updated_by INTEGER REFERENCES pengguna(id),
    deleted_at TIMESTAMP  -- Soft delete
);

-- Auto-update updated_at dengan trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

CREATE TRIGGER tr_produk_updated_at
BEFORE UPDATE ON produk
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
\`\`\`

---

## 🔒 Keamanan Database

### SQL Injection — Ancaman Terbesar

\`\`\`python
# ❌ RENTAN SQL Injection
email = input("Email: ")
query = f"SELECT * FROM users WHERE email = '{email}'"
# Jika email = "' OR '1'='1" → bocor semua data!

# ✅ Parameterized query (SELALU gunakan ini)
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (email,))

# Di Node.js dengan pg:
const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]  # Bukan string concatenation!
);
\`\`\`

### Prinsip Least Privilege

\`\`\`sql
-- Buat user database dengan hak minimal
CREATE USER app_user WITH PASSWORD 'strong_password';

-- Hanya berikan yang dibutuhkan
GRANT SELECT, INSERT, UPDATE ON pelanggan TO app_user;
GRANT SELECT, INSERT, UPDATE ON pesanan TO app_user;
GRANT SELECT ON produk TO app_user;

-- Tidak perlu: DROP, TRUNCATE, CREATE, ALTER
-- Tidak boleh akses tabel sensitif langsung

-- Cek hak akses
\dp pelanggan  -- PostgreSQL
\`\`\`

---

## 💾 Backup & Restore

\`\`\`bash
# PostgreSQL backup
pg_dump toko_online > backup_2024-06-05.sql
pg_dump toko_online | gzip > backup_2024-06-05.sql.gz

# Backup satu tabel saja
pg_dump -t produk toko_online > backup_produk.sql

# Restore
psql toko_online < backup_2024-06-05.sql
gunzip -c backup_2024-06-05.sql.gz | psql toko_online

# Backup otomatis dengan cron (setiap hari jam 3 pagi)
0 3 * * * pg_dump toko_online | gzip > /backup/db_$(date +%Y%m%d).sql.gz
\`\`\`

---

## 🎓 Ringkasan Kursus SQL

Perjalanan yang luar biasa! Anda kini menguasai:

| Modul | Topik |
|-------|-------|
| 1 | Konsep database, setup, CREATE TABLE |
| 2 | SELECT, filter, INSERT, UPDATE, DELETE |
| 3 | JOIN, relasi tabel, agregasi, GROUP BY |
| 4 | Subquery, CTE, View, Index & performa |
| 5 | Fungsi string/tanggal, CASE, Window Functions, desain database |

---

## 🚀 Langkah Selanjutnya

1. **Practice:** Kerjakan soal di pgexercises.com, leetcode SQL
2. **PostgreSQL lanjutan:** Full-text search, JSONB, Partitioning
3. **ORM:** Prisma (TypeScript), SQLAlchemy (Python), Hibernate (Java)
4. **NoSQL:** MongoDB untuk data dokumen fleksibel
5. **Data Warehouse:** BigQuery, Snowflake, Redshift
6. **Sertifikasi:** Oracle OCA, Microsoft DP-900

> **Selamat! Anda kini memiliki kemampuan SQL yang solid untuk membangun dan mengelola database production!** 🎉
`;
