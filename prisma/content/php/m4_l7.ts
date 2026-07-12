export const php_l7 = `
# Session, Autentikasi & REST API — Bangun Backend yang Nyata

Ini pelajaran yang paling practical — kita gabungkan semua yang sudah dipelajari untuk bangun sistem login yang aman dan REST API yang bisa dipakai oleh aplikasi mobile atau frontend modern.

---

## 🔐 Sistem Login Lengkap

\`\`\`php
<?php
// ─── auth/login.php ───
session_start();

// Kalau sudah login, redirect ke dashboard
if (isset($_SESSION["user_id"])) {
    header("Location: /dashboard");
    exit;
}

$errors = [];
$email  = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Validasi CSRF
    if (!hash_equals($_SESSION["csrf_token"] ?? "", $_POST["csrf_token"] ?? "")) {
        die("Request tidak valid");
    }

    $email    = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
    $password = $_POST["password"] ?? "";

    // Validasi input
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors["email"] = "Email tidak valid";
    }
    if (empty($password)) {
        $errors["password"] = "Password wajib diisi";
    }

    if (empty($errors)) {
        require_once "../config/database.php";

        // Cari user berdasarkan email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND aktif = 1 LIMIT 1");
        $stmt->execute([":email" => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user["password"])) {
            // Login berhasil!
            session_regenerate_id(true);  // Cegah session fixation!

            $_SESSION["user_id"]  = $user["id"];
            $_SESSION["nama"]     = $user["nama"];
            $_SESSION["role"]     = $user["role"];
            $_SESSION["login_at"] = time();

            // Update last login
            $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = :id")
                ->execute([":id" => $user["id"]]);

            // Remember me
            if (!empty($_POST["remember"])) {
                $token = bin2hex(random_bytes(32));
                $pdo->prepare(
                    "INSERT INTO remember_tokens (user_id, token, expires_at)
                     VALUES (:uid, :token, DATE_ADD(NOW(), INTERVAL 30 DAY))"
                )->execute([":uid" => $user["id"], ":token" => hash("sha256", $token)]);

                setcookie("remember", $token, [
                    "expires"  => time() + (30 * 86400),
                    "path"     => "/",
                    "secure"   => true,
                    "httponly" => true,
                    "samesite" => "Strict",
                ]);
            }

            header("Location: /dashboard");
            exit;

        } else {
            // Delay untuk cegah brute force
            usleep(500000);   // 0.5 detik
            $errors["general"] = "Email atau password salah";
        }
    }
}

// Generate CSRF token
$_SESSION["csrf_token"] = bin2hex(random_bytes(32));
\`\`\`

---

## 🛡️ Middleware Auth (Helper)

\`\`\`php
<?php
// helpers/auth.php

function requireLogin(): void {
    session_start();
    if (!isset($_SESSION["user_id"])) {
        header("Location: /login?redirect=" . urlencode($_SERVER["REQUEST_URI"]));
        exit;
    }
}

function requireRole(string|array $roles): void {
    requireLogin();
    $roles = (array) $roles;
    if (!in_array($_SESSION["role"] ?? "", $roles)) {
        http_response_code(403);
        include "views/errors/403.php";
        exit;
    }
}

function currentUser(): ?array {
    return isset($_SESSION["user_id"]) ? [
        "id"   => $_SESSION["user_id"],
        "nama" => $_SESSION["nama"],
        "role" => $_SESSION["role"],
    ] : null;
}

// ─── Penggunaan ───
// require_once "helpers/auth.php";
// requireLogin();             // Halaman perlu login
// requireRole("admin");       // Hanya admin
// requireRole(["admin", "instruktur"]); // Admin atau instruktur
\`\`\`

---

## 🌐 REST API dengan PHP

\`\`\`php
<?php
// ─── api/index.php ───
// Router sederhana untuk API

// Header CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

// Handle OPTIONS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Fungsi response JSON
function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode([
        "success" => $status < 400,
        "data"    => $status < 400 ? $data : null,
        "error"   => $status >= 400 ? $data : null,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Parse URL
$path   = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$path   = trim(str_replace("/api", "", $path), "/");
$parts  = explode("/", $path);
$resource = $parts[0] ?? "";
$id     = isset($parts[1]) ? (int) $parts[1] : null;
$method = $_SERVER["REQUEST_METHOD"];

// Parse body untuk POST/PUT
$body = json_decode(file_get_contents("php://input"), true) ?? [];

// Routing
require_once "../config/database.php";

match ([$resource, $method]) {
    ["produk", "GET"]    => getProduk($pdo, $id),
    ["produk", "POST"]   => createProduk($pdo, $body),
    ["produk", "PUT"]    => updateProduk($pdo, $id, $body),
    ["produk", "DELETE"] => deleteProduk($pdo, $id),
    default              => jsonResponse("Route tidak ditemukan", 404),
};
\`\`\`

\`\`\`php
<?php
// ─── Controller functions ───

function getProduk(PDO $pdo, ?int $id): void {
    if ($id) {
        $stmt = $pdo->prepare("SELECT p.*, k.nama AS kategori FROM produk p
                               LEFT JOIN kategori k ON p.kategori_id = k.id
                               WHERE p.id = :id");
        $stmt->execute([":id" => $id]);
        $produk = $stmt->fetch();

        if (!$produk) jsonResponse("Produk tidak ditemukan", 404);
        jsonResponse($produk);
    }

    // GET all dengan filter
    $where  = ["p.status = 'aktif'"];
    $params = [];

    if (!empty($_GET["kategori"])) {
        $where[]           = "p.kategori_id = :kategori_id";
        $params[":kategori_id"] = (int) $_GET["kategori"];
    }

    if (!empty($_GET["cari"])) {
        $where[]         = "p.nama LIKE :cari";
        $params[":cari"] = "%" . $_GET["cari"] . "%";
    }

    $halaman   = max(1, (int) ($_GET["halaman"] ?? 1));
    $perHalaman = min(50, (int) ($_GET["per_halaman"] ?? 12));
    $offset    = ($halaman - 1) * $perHalaman;

    $whereStr = implode(" AND ", $where);
    $stmt     = $pdo->prepare(
        "SELECT p.*, k.nama AS kategori
         FROM produk p LEFT JOIN kategori k ON p.kategori_id = k.id
         WHERE $whereStr
         ORDER BY p.created_at DESC
         LIMIT :limit OFFSET :offset"
    );
    foreach ($params as $key => $val) $stmt->bindValue($key, $val);
    $stmt->bindValue(":limit",  $perHalaman, PDO::PARAM_INT);
    $stmt->bindValue(":offset", $offset,     PDO::PARAM_INT);
    $stmt->execute();

    $total = (int) $pdo->query("SELECT COUNT(*) FROM produk p WHERE $whereStr")
                       ->fetchColumn();

    jsonResponse([
        "items"         => $stmt->fetchAll(),
        "pagination"    => [
            "total"         => $total,
            "halaman"       => $halaman,
            "per_halaman"   => $perHalaman,
            "total_halaman" => (int) ceil($total / $perHalaman),
        ],
    ]);
}

function createProduk(PDO $pdo, array $body): void {
    // Validasi
    $errors = [];
    if (empty($body["nama"]))  $errors[] = "nama wajib";
    if (empty($body["harga"])) $errors[] = "harga wajib";
    if (!empty($errors)) jsonResponse(implode(", ", $errors), 422);

    $stmt = $pdo->prepare(
        "INSERT INTO produk (nama, slug, harga, stok)
         VALUES (:nama, :slug, :harga, :stok)"
    );
    $stmt->execute([
        ":nama"  => $body["nama"],
        ":slug"  => strtolower(preg_replace("/[^a-z0-9]+/i", "-", $body["nama"])),
        ":harga" => (float) $body["harga"],
        ":stok"  => (int) ($body["stok"] ?? 0),
    ]);

    $id     = (int) $pdo->lastInsertId();
    $produk = $pdo->query("SELECT * FROM produk WHERE id = $id")->fetch();
    jsonResponse($produk, 201);
}
\`\`\`

---

## 🔑 JWT-Style Token Authentication untuk API

\`\`\`php
<?php
// Autentikasi API dengan token sederhana

// ─── Login dan dapatkan token ───
function loginAPI(PDO $pdo, string $email, string $password): array {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute([":email" => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user["password"])) {
        throw new RuntimeException("Email atau password salah", 401);
    }

    // Buat token
    $token    = bin2hex(random_bytes(32));
    $expireAt = date("Y-m-d H:i:s", strtotime("+24 hours"));

    $pdo->prepare(
        "INSERT INTO api_tokens (user_id, token, expires_at)
         VALUES (:uid, :token, :expires)
         ON DUPLICATE KEY UPDATE token = :token, expires_at = :expires"
    )->execute([
        ":uid"     => $user["id"],
        ":token"   => hash("sha256", $token),
        ":expires" => $expireAt,
    ]);

    return ["token" => $token, "expires_at" => $expireAt];
}

// ─── Middleware verifikasi token ───
function verifyToken(PDO $pdo): array {
    $authHeader = $_SERVER["HTTP_AUTHORIZATION"] ?? "";
    if (!preg_match("/^Bearer (.+)$/", $authHeader, $matches)) {
        jsonResponse("Token tidak ditemukan", 401);
    }

    $rawToken = $matches[1];
    $stmt     = $pdo->prepare(
        "SELECT t.*, u.nama, u.role FROM api_tokens t
         JOIN users u ON t.user_id = u.id
         WHERE t.token = :token AND t.expires_at > NOW()"
    );
    $stmt->execute([":token" => hash("sha256", $rawToken)]);
    $user = $stmt->fetch();

    if (!$user) jsonResponse("Token tidak valid atau kadaluarsa", 401);
    return $user;
}
\`\`\`

---

## 📝 Ringkasan

- **Session**: simpan data login di server, secure dengan \`session_regenerate_id()\`
- **Remember me**: token acak yang di-hash sebelum disimpan ke database
- **REST API**: routing berdasarkan URL + HTTP method
- **JSON response**: selalu set Content-Type header + gunakan json_encode
- **Token auth**: untuk API yang diakses mobile/SPA
- CORS headers diperlukan kalau API diakses dari domain berbeda

> **Pelajaran terakhir: Composer, Package, dan proyek akhir PHP!** 🚀
`;
