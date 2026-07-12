export const sql_l2 = `
# Setup Database Pertama — Mari Mulai Praktek!

Teori di pelajaran 1 sudah cukup — sekarang waktunya tangan kena keyboard. Kita butuh software untuk bisa nulis dan jalankan query SQL.

Ada dua pilihan yang akan kita bahas. **Rekomendasi untuk pemula: mulai dari SQLite** — tidak butuh instalasi server, tidak ada konfigurasi, langsung bisa pakai.

| Database | Kemudahan Setup | Cocok Untuk |
|----------|----------------|-------------|
| **SQLite** ← Mulai di sini | ⭐⭐⭐⭐⭐ | Belajar, prototype, app kecil |
| PostgreSQL | ⭐⭐⭐ | Production, belajar lanjutan |

---

## OPSI A: SQLite + DB Browser (Paling Mudah)

### Langkah 1: Download DB Browser for SQLite

DB Browser for SQLite adalah aplikasi GUI (tampilan visual) gratis untuk mengelola database SQLite.

1. Buka browser dan pergi ke: **https://sqlitebrowser.org/dl/**
2. Di bagian "Windows", pilih:
   - **DB.Browser.for.SQLite-x.x.x-win64.msi** (untuk Windows 64-bit)
   - Atau versi PortableApp jika tidak ingin install
3. Klik download dan tunggu selesai
4. Jalankan file installer (.msi) yang sudah didownload
5. Ikuti wizard instalasi (Next → Next → Install → Finish)

### Langkah 2: Buka DB Browser for SQLite

Setelah install:
1. Cari "DB Browser for SQLite" di Start Menu
2. Atau double-click icon di desktop
3. Aplikasi akan terbuka dengan tampilan seperti ini:

\`\`\`
┌─────────────────────────────────────────────────────┐
│  DB Browser for SQLite                               │
├─────────────────────────────────────────────────────┤
│  [New Database] [Open Database] [Write Changes]      │
├─────────────────────────────────────────────────────┤
│  Database Structure | Browse Data | Edit Pragmas |   │
│                     Execute SQL                      │
├─────────────────────────────────────────────────────┤
│  (Belum ada database terbuka)                        │
└─────────────────────────────────────────────────────┘
\`\`\`

### Langkah 3: Buat Database Baru

1. Klik tombol **"New Database"** di pojok kiri atas
2. Pilih lokasi untuk menyimpan file database (contoh: Desktop atau folder Documents)
3. Beri nama file: **toko_online.db**
4. Klik **"Save"**
5. Sebuah dialog "Edit table definition" akan muncul — klik **Cancel** dulu (kita buat tabel manual)

Selamat! Kamu sudah punya file database \`toko_online.db\` di komputer kamu.

### Langkah 4: Buat Semua Tabel

1. Klik tab **"Execute SQL"** di DB Browser
2. Di area teks yang muncul, paste query ini:

\`\`\`sql
-- Hapus tabel kalau sudah ada (untuk reset bersih)
DROP TABLE IF EXISTS detail_pesanan;
DROP TABLE IF EXISTS pesanan;
DROP TABLE IF EXISTS produk;
DROP TABLE IF EXISTS pelanggan;
DROP TABLE IF EXISTS kategori;

-- Buat tabel dari yang paling sederhana (tidak bergantung tabel lain)
CREATE TABLE kategori (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nama  TEXT NOT NULL
);

CREATE TABLE pelanggan (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nama           TEXT NOT NULL,
    email          TEXT UNIQUE NOT NULL,
    telepon        TEXT,
    kota           TEXT,
    tanggal_daftar TEXT DEFAULT (date('now'))
);

CREATE TABLE produk (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nama        TEXT NOT NULL,
    harga       REAL NOT NULL,
    stok        INTEGER DEFAULT 0,
    kategori_id INTEGER,
    deskripsi   TEXT,
    aktif       INTEGER DEFAULT 1,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id)
);

CREATE TABLE pesanan (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    pelanggan_id INTEGER,
    tanggal      TEXT DEFAULT (datetime('now')),
    total        REAL,
    status       TEXT DEFAULT 'pending',
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id)
);

CREATE TABLE detail_pesanan (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    pesanan_id       INTEGER,
    produk_id        INTEGER,
    jumlah           INTEGER NOT NULL,
    harga_saat_pesan REAL NOT NULL,
    FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
    FOREIGN KEY (produk_id) REFERENCES produk(id)
);
\`\`\`

3. Klik tombol **"Run"** (ikon segitiga play) atau tekan **F5**
4. Di bagian bawah, kamu akan lihat pesan sukses
5. Klik tombol **"Write Changes"** untuk menyimpan

### Langkah 5: Isi Data Sample

Masih di tab "Execute SQL", hapus query sebelumnya dan masukkan:

\`\`\`sql
-- Isi tabel kategori
INSERT INTO kategori (nama) VALUES
    ('Elektronik'),
    ('Pakaian'),
    ('Makanan & Minuman'),
    ('Buku'),
    ('Olahraga');

-- Isi tabel pelanggan
INSERT INTO pelanggan (nama, email, telepon, kota, tanggal_daftar) VALUES
    ('Budi Santoso',    'budi@email.com',  '081234567890', 'Jakarta',    '2024-01-15'),
    ('Sari Dewi',       'sari@email.com',  '082345678901', 'Surabaya',   '2024-01-20'),
    ('Ahmad Fauzi',     'ahmad@email.com', '083456789012', 'Bandung',    '2024-02-01'),
    ('Rina Kusuma',     'rina@email.com',  '084567890123', 'Medan',      '2024-02-10'),
    ('Doni Prasetyo',   'doni@email.com',  '085678901234', 'Yogyakarta', '2024-02-15'),
    ('Maya Sari',       'maya@email.com',  '086789012345', 'Semarang',   '2024-03-01'),
    ('Bagas Nugroho',   'bagas@email.com', '087890123456', 'Jakarta',    '2024-03-10'),
    ('Fitri Handayani', 'fitri@email.com', '088901234567', 'Surabaya',   '2024-03-15');

-- Isi tabel produk
INSERT INTO produk (nama, harga, stok, kategori_id, deskripsi) VALUES
    ('Laptop ASUS VivoBook',    8500000, 15,  1, 'Laptop ringan untuk produktivitas'),
    ('Samsung Galaxy A54',      4200000, 30,  1, 'Smartphone mid-range terbaik'),
    ('Earphone Bluetooth JBL',  350000,  50,  1, 'Suara jernih dengan bass kuat'),
    ('Kaos Polos Pria',         75000,  200,  2, 'Katun combed 30s, adem dan nyaman'),
    ('Kemeja Batik Wanita',     185000,  80,  2, 'Motif tradisional modern'),
    ('Celana Jeans Slim Fit',   250000,  60,  2, 'Denim premium stretch'),
    ('Kopi Arabika Aceh 250g',  65000,  100,  3, 'Kopi specialty dengan citarasa fruity'),
    ('Teh Hijau Premium',       45000,  150,  3, 'Teh organik dari pegunungan'),
    ('Cokelat Dark 70%',        35000,  200,  3, 'Dark chocolate premium'),
    ('Belajar SQL dari Nol',    120000,  40,  4, 'Panduan lengkap untuk pemula'),
    ('Clean Code',              195000,  25,  4, 'Menulis kode yang bersih dan maintainable'),
    ('Sepatu Lari Nike',        850000,  35,  5, 'Ringan dan responsif untuk lari'),
    ('Yoga Mat Premium',        280000,  45,  5, 'Anti-slip, tebal 6mm'),
    ('Dumbbell Set 10kg',       320000,  20,  5, 'Besi solid dengan pegangan karet');

-- Isi tabel pesanan
INSERT INTO pesanan (pelanggan_id, tanggal, total, status) VALUES
    (1, '2024-03-01 10:30:00', 8850000, 'selesai'),
    (2, '2024-03-02 14:15:00', 435000,  'selesai'),
    (3, '2024-03-03 09:00:00', 4510000, 'selesai'),
    (1, '2024-03-05 11:00:00', 185000,  'selesai'),
    (4, '2024-03-07 16:30:00', 315000,  'dikirim'),
    (5, '2024-03-08 13:00:00', 1130000, 'dikirim'),
    (2, '2024-03-10 08:45:00', 195000,  'proses'),
    (6, '2024-03-11 15:20:00', 650000,  'proses'),
    (7, '2024-03-12 10:00:00', 75000,   'pending'),
    (8, '2024-03-13 12:30:00', 280000,  'pending');

-- Isi tabel detail_pesanan
INSERT INTO detail_pesanan (pesanan_id, produk_id, jumlah, harga_saat_pesan) VALUES
    (1, 1, 1, 8500000),
    (1, 3, 1, 350000),
    (2, 3, 1, 350000),
    (2, 7, 1, 65000),
    (3, 2, 1, 4200000),
    (3, 10, 1, 120000),
    (3, 7, 3, 65000),
    (4, 5, 1, 185000),
    (5, 4, 2, 75000),
    (5, 8, 3, 45000),
    (6, 12, 1, 850000),
    (6, 13, 1, 280000),
    (7, 11, 1, 195000),
    (8, 12, 1, 850000),
    (8, 9, 5, 35000),
    (9, 4, 1, 75000),
    (10, 13, 1, 280000);
\`\`\`

6. Klik **Run** (F5) dan **Write Changes**

### Langkah 6: Verifikasi Data

Coba query pertama kamu:

\`\`\`sql
SELECT * FROM pelanggan;
\`\`\`

Klik **Run** — kamu akan lihat semua data pelanggan di bagian bawah layar!

\`\`\`sql
SELECT * FROM produk;
\`\`\`

Kamu sudah berhasil setup database pertamamu! 🎉

---

## OPSI B: PostgreSQL + pgAdmin

Kalau ingin setup yang lebih "production-like":

### Langkah 1: Download PostgreSQL

1. Buka **https://www.postgresql.org/download/**
2. Klik **"Windows"** → **"Download the installer"**
3. Pilih versi terbaru (misal 16.x) untuk Windows x86-64

### Langkah 2: Install PostgreSQL

1. Jalankan file installer
2. Pilih semua komponen (PostgreSQL Server, pgAdmin 4, Command Line Tools)
3. **PENTING:** Catat password untuk user \`postgres\` — kamu perlu ini nanti
4. Biarkan port default: **5432**
5. Klik **Next** dan tunggu instalasi selesai

### Langkah 3: Buat Database di pgAdmin

1. Buka **pgAdmin 4** dari Start Menu
2. Di panel kiri, expand: **Servers → PostgreSQL 16**
3. Masukkan password yang kamu buat saat install
4. Klik kanan **Databases** → **Create → Database** → nama: \`toko_online\`
5. Klik **Save**

### Langkah 4: Jalankan Query

1. Pilih database \`toko_online\`, buka **Query Tool** (Alt+Shift+Q)
2. Gunakan query yang sama seperti di atas, tapi ganti:
   - \`INTEGER PRIMARY KEY AUTOINCREMENT\` → \`SERIAL PRIMARY KEY\`
   - \`REAL\` → \`DECIMAL(12,2)\`
3. Klik **Run** (F5)

---

## Cara Menjalankan Query

### Di DB Browser for SQLite:
1. Buka tab **"Execute SQL"**
2. Ketik query di area teks
3. Klik tombol **Run** atau tekan **F5**
4. Hasil muncul di bawah

### Tips Menjalankan Query:
- Untuk menjalankan **satu query** saat ada banyak: highlight teks query tersebut dulu, baru klik Run
- Untuk menjalankan **semua query**: jangan pilih apa-apa, langsung klik Run
- Komentar SQL menggunakan \`--\` (dua strip) di awal baris

---

## Navigasi DB Browser

\`\`\`
Tab "Database Structure" = Lihat semua tabel dan kolomnya
Tab "Browse Data"        = Lihat/edit data seperti spreadsheet
Tab "Execute SQL"        = Ketik dan jalankan query SQL  ← paling sering dipakai
\`\`\`

---

## Troubleshooting Umum

**"Table already exists"** — Tabel sudah pernah dibuat. Gunakan \`DROP TABLE IF EXISTS nama_tabel;\` sebelum CREATE.

**"No such table"** — Pastikan sudah terhubung ke database yang benar.

**"UNIQUE constraint failed"** — Kamu mencoba memasukkan nilai duplikat di kolom UNIQUE (misal email yang sudah ada).

**PostgreSQL: "password authentication failed"** — Pastikan password sesuai dengan saat install.

---

## Ringkasan

✅ **SQLite** adalah database terbaik untuk belajar — berbasis file, tanpa server, tanpa konfigurasi

✅ **DB Browser for SQLite** adalah GUI gratis untuk mengelola SQLite dengan mudah

✅ **PostgreSQL + pgAdmin** untuk setup yang lebih mendekati production

✅ Kita sudah membuat database \`toko_online\` dengan 5 tabel: kategori, pelanggan, produk, pesanan, detail_pesanan

✅ Data sample sudah siap untuk digunakan di pelajaran-pelajaran berikutnya

> **Di pelajaran berikutnya, kita mulai belajar SELECT — cara mengambil dan membaca data dari database!**
`;
