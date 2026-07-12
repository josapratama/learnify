export const php_l5 = `
# Database MySQL & PDO — PHP Ngobrol dengan Database

Hampir semua aplikasi web butuh menyimpan data secara permanen. PHP punya beberapa cara untuk koneksi ke database, tapi yang paling aman dan modern adalah **PDO (PHP Data Objects)**.

---

## 🤔 Kenapa PDO?

Ada tiga cara koneksi MySQL di PHP: mysql_ (deprecated, tidak aman), MySQLi, dan PDO.

**PDO dipilih karena:**
- Mendukung banyak database (MySQL, PostgreSQL, SQLite) dengan sintaks yang sama
- **Prepared statements** bawaan — proteksi dari SQL injection
- Konsisten dan mudah dipelajari

---

## 🔌 Koneksi Database

\`\`\`php
<?php
// config/database.php
$host   = "localhost";
$port   = 3306;
$dbName = "toko_online";
$user   = "root";
$pass   = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,   // Throw exception kalau error
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,          // Return array associative
        PDO::ATTR_EMULATE_PREPARES   => false,                      // Pakai prepared statement native
    ]);

    echo "Koneksi berhasil!\n";

} catch (PDOException $e) {
    // JANGAN tampilkan pesan error ke user di production!
    error_log("Koneksi gagal: " . $e->getMessage());
    die("Tidak bisa terhubung ke database. Hubungi admin.");
}
\`\`\`

---

## 📋 DDL — Buat Tabel

\`\`\`sql
-- Jalankan di phpMyAdmin atau MySQL CLI
CREATE DATABASE IF NOT EXISTS toko_online
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE toko_online;

CREATE TABLE IF NOT EXISTS kategori (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nama       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produk (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id  INT,
    nama         VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL UNIQUE,
    deskripsi    TEXT,
    harga        DECIMAL(12, 2) NOT NULL,
    stok         INT DEFAULT 0,
    gambar       VARCHAR(255),
    status       ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE SET NULL
);
\`\`\`

---

## 🔍 CRUD dengan PDO

\`\`\`php
<?php
// ─── CREATE — tambah data ───
function tambahProduk(PDO $pdo, array $data): int {
    $sql = "INSERT INTO produk (nama, slug, harga, stok, kategori_id)
            VALUES (:nama, :slug, :harga, :stok, :kategori_id)";
    // :nama, :slug = named placeholder — AMAN dari SQL injection!

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nama"        => $data["nama"],
        ":slug"        => strtolower(str_replace(" ", "-", $data["nama"])),
        ":harga"       => $data["harga"],
        ":stok"        => $data["stok"] ?? 0,
        ":kategori_id" => $data["kategori_id"] ?? null,
    ]);

    return (int) $pdo->lastInsertId();   // Kembalikan ID yang baru dibuat
}

// ─── READ — ambil data ───
function semuaProduk(PDO $pdo, string $status = "aktif"): array {
    $stmt = $pdo->prepare(
        "SELECT p.*, k.nama AS kategori_nama
         FROM produk p
         LEFT JOIN kategori k ON p.kategori_id = k.id
         WHERE p.status = :status
         ORDER BY p.created_at DESC"
    );
    $stmt->execute([":status" => $status]);
    return $stmt->fetchAll();    // Semua baris sebagai array
}

function cariProdukById(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("SELECT * FROM produk WHERE id = :id LIMIT 1");
    $stmt->execute([":id" => $id]);
    $hasil = $stmt->fetch();     // Satu baris (atau false)
    return $hasil ?: null;
}

function cariProduk(PDO $pdo, string $kata, int $limit = 10): array {
    // LIKE dengan wildcard
    $stmt = $pdo->prepare(
        "SELECT * FROM produk
         WHERE nama LIKE :kata AND status = 'aktif'
         LIMIT :limit"
    );
    $stmt->bindValue(":kata",  "%" . $kata . "%", PDO::PARAM_STR);
    $stmt->bindValue(":limit", $limit,             PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

// ─── UPDATE — perbarui data ───
function updateProduk(PDO $pdo, int $id, array $data): bool {
    $stmt = $pdo->prepare(
        "UPDATE produk
         SET nama = :nama, harga = :harga, stok = :stok
         WHERE id = :id"
    );
    $stmt->execute([
        ":nama"  => $data["nama"],
        ":harga" => $data["harga"],
        ":stok"  => $data["stok"],
        ":id"    => $id,
    ]);
    return $stmt->rowCount() > 0;   // true kalau ada yang berubah
}

// ─── DELETE — hapus data ───
function hapusProduk(PDO $pdo, int $id): bool {
    $stmt = $pdo->prepare("DELETE FROM produk WHERE id = :id");
    $stmt->execute([":id" => $id]);
    return $stmt->rowCount() > 0;
}
\`\`\`

---

## 🔒 Transaction — Semua atau Tidak Sama Sekali

\`\`\`php
<?php
function buatPesanan(PDO $pdo, int $userId, array $items): int {
    $pdo->beginTransaction();  // Mulai transaction

    try {
        // 1. Hitung total
        $total = array_sum(array_column($items, "subtotal"));

        // 2. Insert pesanan
        $stmt = $pdo->prepare(
            "INSERT INTO pesanan (user_id, total, status)
             VALUES (:user_id, :total, 'pending')"
        );
        $stmt->execute([":user_id" => $userId, ":total" => $total]);
        $pesananId = (int) $pdo->lastInsertId();

        // 3. Insert detail dan kurangi stok
        $stmtDetail = $pdo->prepare(
            "INSERT INTO detail_pesanan (pesanan_id, produk_id, qty, harga_satuan, subtotal)
             VALUES (:pesanan_id, :produk_id, :qty, :harga, :subtotal)"
        );
        $stmtStok = $pdo->prepare(
            "UPDATE produk SET stok = stok - :qty WHERE id = :id AND stok >= :qty"
        );

        foreach ($items as $item) {
            // Kurangi stok
            $stmtStok->execute([
                ":qty" => $item["qty"],
                ":id"  => $item["produk_id"],
            ]);

            if ($stmtStok->rowCount() === 0) {
                throw new RuntimeException("Stok produk ID {$item['produk_id']} tidak mencukupi");
            }

            // Insert detail
            $stmtDetail->execute([
                ":pesanan_id" => $pesananId,
                ":produk_id"  => $item["produk_id"],
                ":qty"        => $item["qty"],
                ":harga"      => $item["harga_satuan"],
                ":subtotal"   => $item["subtotal"],
            ]);
        }

        $pdo->commit();   // Semua berhasil, simpan!
        return $pesananId;

    } catch (Exception $e) {
        $pdo->rollBack();   // Ada yang gagal, batalkan semua!
        throw $e;           // Re-throw agar bisa ditangani di atas
    }
}
\`\`\`

---

## 📊 Query Lanjutan

\`\`\`php
<?php
// Pagination
function produkDenganPagination(PDO $pdo, int $halaman = 1, int $perHalaman = 12): array {
    $offset = ($halaman - 1) * $perHalaman;

    $stmtData = $pdo->prepare(
        "SELECT * FROM produk WHERE status = 'aktif'
         ORDER BY created_at DESC
         LIMIT :limit OFFSET :offset"
    );
    $stmtData->bindValue(":limit",  $perHalaman, PDO::PARAM_INT);
    $stmtData->bindValue(":offset", $offset,     PDO::PARAM_INT);
    $stmtData->execute();

    $stmtTotal = $pdo->query(
        "SELECT COUNT(*) FROM produk WHERE status = 'aktif'"
    );
    $total = (int) $stmtTotal->fetchColumn();

    return [
        "data"         => $stmtData->fetchAll(),
        "total"        => $total,
        "halaman"      => $halaman,
        "per_halaman"  => $perHalaman,
        "total_halaman" => (int) ceil($total / $perHalaman),
    ];
}

// Statistik dengan GROUP BY
function statistikPenjualan(PDO $pdo): array {
    $stmt = $pdo->query(
        "SELECT
            k.nama AS kategori,
            COUNT(dp.id) AS jumlah_transaksi,
            SUM(dp.qty) AS total_terjual,
            SUM(dp.subtotal) AS total_pendapatan
         FROM detail_pesanan dp
         JOIN produk p ON dp.produk_id = p.id
         JOIN kategori k ON p.kategori_id = k.id
         JOIN pesanan pes ON dp.pesanan_id = pes.id
         WHERE pes.status = 'selesai'
         GROUP BY k.id, k.nama
         ORDER BY total_pendapatan DESC"
    );
    return $stmt->fetchAll();
}
\`\`\`

---

## 📝 Ringkasan

- **PDO**: cara koneksi yang modern dan aman ke database
- **Prepared statements**: \`prepare()\` + \`execute([])\` — WAJIB untuk keamanan!
- **CRUD**: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE)
- **Transaction**: \`beginTransaction()\`, \`commit()\`, \`rollBack()\`
- **fetchAll()**: semua baris, **fetch()**: satu baris, **fetchColumn()**: satu nilai

> **Selanjutnya: Form & Keamanan Web — validasi input dan proteksi dari serangan umum!** 🚀
`;
