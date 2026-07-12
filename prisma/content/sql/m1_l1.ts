export const sql_l1 = `
# Apa itu Database? — Lemari Arsip Digital

## Selamat Datang di Dunia Database!

Bayangkan kamu punya toko online. Setiap hari ada ratusan pelanggan membeli produk, meninggalkan ulasan, dan melakukan pembayaran. Bagaimana kamu menyimpan semua informasi itu? Di kertas? Di Excel? Bagaimana kalau datanya jutaan baris?

Di sinilah **database** berperan. Database adalah sistem penyimpanan data yang terorganisir, efisien, dan bisa diakses dengan cepat — bahkan untuk miliaran baris data sekalipun.

---

## Analogi: Perpustakaan vs Kotak Kardus

Bayangkan dua cara menyimpan buku:

**Cara 1 — Kotak Kardus:**
- Semua buku dilempar ke dalam kotak
- Tidak ada urutan, tidak ada label
- Mencari satu buku = bongkar semua isi kotak
- Waktu pencarian: berjam-jam

**Cara 2 — Perpustakaan:**
- Buku dikelompokkan berdasarkan kategori (fiksi, sains, sejarah)
- Setiap buku punya nomor katalog unik
- Rak diberi label yang jelas
- Ada sistem pencatatan peminjaman
- Mencari satu buku = lihat katalog, pergi ke rak yang tepat
- Waktu pencarian: menit

**Database adalah perpustakaan digital** — data tersimpan terorganisir sehingga pencarian, perubahan, dan penambahan data bisa dilakukan dengan sangat cepat dan efisien.

---

## Apa itu DBMS?

**DBMS (Database Management System)** adalah perangkat lunak yang mengelola database. Ibarat DBMS adalah "penjaga perpustakaan" — dia yang:

- Mengatur cara data disimpan
- Memastikan data tidak rusak atau duplikat
- Mengontrol siapa yang boleh akses data apa
- Memproses permintaan pencarian data

Tanpa DBMS, kamu harus menulis sendiri semua logika penyimpanan dan pencarian — sangat rumit!

### Contoh DBMS Populer:

| DBMS | Tipe | Digunakan Oleh |
|------|------|----------------|
| MySQL | Relasional | WordPress, Facebook (awal) |
| PostgreSQL | Relasional | Instagram, Heroku, GitLab |
| SQLite | Relasional (file-based) | Android apps, browser |
| MongoDB | NoSQL (dokumen) | Airbnb, Forbes |
| Redis | NoSQL (key-value) | Twitter, GitHub (cache) |
| Oracle DB | Relasional | Bank, enterprise besar |

---

## RDBMS vs NoSQL — Pilih Yang Mana?

### RDBMS (Relational Database Management System)

Data disimpan dalam **tabel** dengan baris dan kolom — mirip spreadsheet Excel, tapi jauh lebih powerful.

**Karakteristik:**
- Data terstruktur dengan skema yang jelas
- Menggunakan SQL sebagai bahasa query
- Mendukung relasi antar tabel
- Konsistensi data terjamin (ACID)
- Cocok untuk data transaksional (keuangan, e-commerce)

**Contoh:** MySQL, PostgreSQL, SQLite, Oracle, SQL Server

### NoSQL (Not Only SQL)

Data bisa disimpan dalam berbagai format: dokumen JSON, key-value pairs, graph, dll.

**Karakteristik:**
- Skema fleksibel (bisa berubah-ubah)
- Lebih mudah di-scale horizontal
- Cocok untuk data tidak terstruktur
- Performa tinggi untuk read/write masif

**Contoh:** MongoDB (dokumen), Redis (key-value), Cassandra (column), Neo4j (graph)

### Kapan Pakai Yang Mana?

| Situasi | Pilihan |
|---------|---------|
| Aplikasi keuangan, perbankan | RDBMS |
| E-commerce dengan relasi produk-pesanan | RDBMS |
| Katalog produk dengan atribut berbeda-beda | NoSQL |
| Real-time chat, gaming leaderboard | NoSQL (Redis) |
| Social media dengan koneksi kompleks | NoSQL (Graph) |
| Aplikasi umum / default pilihan | PostgreSQL |

---

## Kenapa Database Penting? Contoh Nyata

### Instagram
Instagram menyimpan miliaran foto. Setiap foto punya metadata: siapa yang upload, kapan, berapa like, berapa komentar, tag lokasi, dll. Database PostgreSQL mereka mengelola semua ini sehingga kamu bisa scroll feed dalam milidetik.

### Tokopedia
Setiap produk di Tokopedia punya data: nama, harga, stok, penjual, kategori, ulasan. Setiap transaksi dicatat: pembeli, produk, jumlah, waktu, status pembayaran, status pengiriman. Database mengelola semua transaksi secara bersamaan — bayangkan ribuan orang checkout sekaligus!

### Aplikasi Perbankan
Ketika kamu transfer uang, database harus:
1. Kurangi saldo pengirim
2. Tambah saldo penerima
3. Catat riwayat transaksi
4. Semua langkah ini harus **berhasil semua atau gagal semua** (tidak boleh uang berkurang tapi tidak sampai)

Inilah mengapa database dengan fitur **transaksi ACID** sangat penting untuk sistem keuangan.

### Google
Google menyimpan index seluruh internet dalam database mereka. Ketika kamu search sesuatu, Google menelusuri miliaran halaman dalam milidetik — ini hanya mungkin karena sistem database yang sangat canggih.

---

## Konsep Dasar: Tabel, Baris, Kolom, Primary Key

Mari kita gunakan analogi **spreadsheet Excel** karena hampir semua orang familiar dengannya.

### Tabel (Table)
Tabel adalah kumpulan data sejenis, seperti satu sheet di Excel.

Contoh tabel \`pelanggan\`:

| id | nama | email | kota | tanggal_daftar |
|----|------|-------|------|----------------|
| 1 | Budi Santoso | budi@email.com | Jakarta | 2024-01-15 |
| 2 | Sari Dewi | sari@email.com | Surabaya | 2024-01-20 |
| 3 | Ahmad Fauzi | ahmad@email.com | Bandung | 2024-02-01 |

Dalam database, sebuah database bisa punya banyak tabel — seperti Excel workbook dengan banyak sheet.

### Baris (Row / Record)
Setiap baris mewakili **satu entitas data**.

Baris pertama di atas mewakili satu pelanggan: Budi Santoso dari Jakarta.

### Kolom (Column / Field)
Setiap kolom mewakili **satu atribut** dari entitas.

Kolom \`nama\` berisi nama semua pelanggan. Kolom \`email\` berisi email semua pelanggan.

### Primary Key
Primary key adalah **kolom yang nilainya unik untuk setiap baris** — seperti nomor KTP atau nomor induk mahasiswa.

Kolom \`id\` di atas adalah primary key:
- Setiap pelanggan punya id yang berbeda
- Tidak ada dua pelanggan dengan id yang sama
- Tidak boleh kosong (NULL)
- Digunakan untuk mengidentifikasi dan menghubungkan data antar tabel

---

## Database Toko Online — Contoh Kita

Sepanjang kursus ini, kita akan menggunakan database toko online bernama **toko_online** dengan tabel-tabel berikut:

### Tabel \`pelanggan\`
\`\`\`sql
CREATE TABLE pelanggan (
    id          SERIAL PRIMARY KEY,
    nama        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    telepon     VARCHAR(20),
    kota        VARCHAR(50),
    tanggal_daftar DATE DEFAULT CURRENT_DATE
);
\`\`\`

### Tabel \`kategori\`
\`\`\`sql
CREATE TABLE kategori (
    id    SERIAL PRIMARY KEY,
    nama  VARCHAR(50) NOT NULL
);
\`\`\`

### Tabel \`produk\`
\`\`\`sql
CREATE TABLE produk (
    id           SERIAL PRIMARY KEY,
    nama         VARCHAR(150) NOT NULL,
    harga        DECIMAL(12,2) NOT NULL,
    stok         INT DEFAULT 0,
    kategori_id  INT REFERENCES kategori(id),
    deskripsi    TEXT,
    aktif        BOOLEAN DEFAULT TRUE
);
\`\`\`

### Tabel \`pesanan\`
\`\`\`sql
CREATE TABLE pesanan (
    id           SERIAL PRIMARY KEY,
    pelanggan_id INT REFERENCES pelanggan(id),
    tanggal      TIMESTAMP DEFAULT NOW(),
    total        DECIMAL(12,2),
    status       VARCHAR(20) DEFAULT 'pending'
);
\`\`\`

### Tabel \`detail_pesanan\`
\`\`\`sql
CREATE TABLE detail_pesanan (
    id          SERIAL PRIMARY KEY,
    pesanan_id  INT REFERENCES pesanan(id),
    produk_id   INT REFERENCES produk(id),
    jumlah      INT NOT NULL,
    harga_saat_pesan DECIMAL(12,2) NOT NULL
);
\`\`\`

---

## Visualisasi Hubungan Antar Tabel

\`\`\`
pelanggan ─────────── pesanan ─────────── detail_pesanan ─────────── produk
    id ◄──── pelanggan_id    id ◄──── pesanan_id        produk_id ────► id
    nama                     tanggal                    jumlah           nama
    email                    total                      harga_saat_pesan harga
    kota                     status                                       stok
                                                                          kategori_id ──► kategori
\`\`\`

Struktur ini memungkinkan kita menjawab pertanyaan seperti:
- "Siapa pelanggan yang paling banyak belanja bulan ini?"
- "Produk apa yang stoknya hampir habis?"
- "Berapa total pendapatan per kategori produk?"

---

## Database Populer — Penjelasan Singkat

### SQLite
- Database berbasis **file tunggal** (.db atau .sqlite)
- Tidak perlu server — langsung pakai sebagai file
- Cocok untuk: aplikasi mobile, aplikasi desktop, development & testing
- Digunakan di: semua Android/iOS app, browser Chrome/Firefox, Python default
- Keterbatasan: tidak cocok untuk aplikasi web dengan banyak pengguna bersamaan

### MySQL
- Database relasional paling populer di web
- Gratis dan open source
- Sangat cepat untuk operasi read
- Digunakan di: WordPress, Joomla, ribuan aplikasi web
- Tersedia sebagai layanan cloud: Amazon RDS, Google Cloud SQL

### PostgreSQL (disebut "Postgres")
- Database relasional paling advanced dan feature-rich
- Gratis dan open source
- Mendukung JSON, Array, tipe data custom, full-text search
- Lebih strict dalam validasi data dibanding MySQL
- Pilihan profesional untuk aplikasi serius
- Digunakan di: Instagram, Heroku, GitLab, Shopify

### MongoDB
- Database NoSQL berbasis dokumen JSON
- Skema fleksibel — setiap dokumen bisa punya field berbeda
- Cocok untuk data yang strukturnya sering berubah
- Digunakan di: Airbnb, Forbes, CERN

---

## Ringkasan Pelajaran 1

✅ **Database** adalah sistem penyimpanan data terorganisir, seperti perpustakaan digital

✅ **DBMS** adalah perangkat lunak yang mengelola database (MySQL, PostgreSQL, dll)

✅ **RDBMS** menyimpan data dalam tabel berstruktur dengan SQL — cocok untuk data transaksional

✅ **NoSQL** menyimpan data dengan format fleksibel — cocok untuk data tidak terstruktur/skala besar

✅ Komponen dasar database: **Tabel** (kumpulan data), **Baris** (satu record), **Kolom** (satu atribut), **Primary Key** (identifier unik)

✅ Kita akan menggunakan database **toko_online** sepanjang kursus ini

---

## Latihan

1. Buka aplikasi spreadsheet (Excel atau Google Sheets) dan buat tabel sederhana dengan 5 kolom untuk mencatat koleksi buku pribadimu. Kolom apa yang kamu pilih? Mana yang cocok jadi primary key?

2. Pikirkan aplikasi yang kamu gunakan sehari-hari (WhatsApp, GoPay, Shopee). Data apa saja kira-kira yang mereka simpan di database? Tabel apa saja yang mungkin ada?

3. Menurut kamu, kenapa primary key penting? Apa yang terjadi kalau tidak ada primary key?

---

Di pelajaran berikutnya, kita akan **menginstal database pertama kamu** dan mulai bereksperimen langsung!
`;
