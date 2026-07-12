export const php_l6 = `
# Form, Validasi & Keamanan Web — PHP yang Aman

Menerima input dari pengguna itu seperti membuka pintu. Kalau tidak hati-hati, yang masuk bukan cuma tamu yang baik — tapi juga yang mau merusak. Di sini kita pelajari cara validasi yang benar dan keamanan web dasar.

---

## 🎯 Memproses Form dengan PHP

\`\`\`php
<?php
// ─── Superglobals: variabel yang selalu tersedia ───
$_GET    // Data dari URL: ?nama=Budi&kota=Jakarta
$_POST   // Data dari form POST (lebih aman dari GET untuk data sensitif)
$_FILES  // File yang diupload
$_SESSION // Data session (tersimpan di server)
$_COOKIE  // Cookie (tersimpan di browser)
$_SERVER  // Info server: IP, URL, method, dll.
$_ENV    // Environment variables

// ─── Deteksi method request ───
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Form dikirim
} else {
    // Tampilkan form
}

// ─── Cek apakah field ada dan tidak kosong ───
$nama = $_POST["nama"] ?? "";   // Default kosong kalau tidak ada
if (!empty($nama)) {
    // $nama ada nilainya
}

// Cara aman akses $_GET tanpa error
$halaman = isset($_GET["halaman"]) ? (int) $_GET["halaman"] : 1;
$kategori = filter_input(INPUT_GET, "kategori", FILTER_SANITIZE_SPECIAL_CHARS);
\`\`\`

---

## ✅ Validasi Input

\`\`\`php
<?php
// Selalu validasi input sebelum diproses!

function validasiFormDaftar(array $data): array {
    $errors = [];

    // Nama: wajib, 2-50 karakter
    if (empty(trim($data["nama"] ?? ""))) {
        $errors["nama"] = "Nama wajib diisi";
    } elseif (strlen(trim($data["nama"])) < 2) {
        $errors["nama"] = "Nama minimal 2 karakter";
    } elseif (strlen(trim($data["nama"])) > 50) {
        $errors["nama"] = "Nama maksimal 50 karakter";
    }

    // Email: wajib, format valid, unik
    $email = trim($data["email"] ?? "");
    if (empty($email)) {
        $errors["email"] = "Email wajib diisi";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors["email"] = "Format email tidak valid";
    }

    // Password: wajib, minimal 8 karakter, ada angka dan huruf
    $pass = $data["password"] ?? "";
    if (empty($pass)) {
        $errors["password"] = "Password wajib diisi";
    } elseif (strlen($pass) < 8) {
        $errors["password"] = "Password minimal 8 karakter";
    } elseif (!preg_match("/[A-Za-z]/", $pass) || !preg_match("/[0-9]/", $pass)) {
        $errors["password"] = "Password harus mengandung huruf dan angka";
    }

    // Konfirmasi password
    if (($data["password"] ?? "") !== ($data["confirm_password"] ?? "")) {
        $errors["confirm_password"] = "Password tidak cocok";
    }

    // No telepon: opsional, tapi kalau diisi harus valid
    $phone = trim($data["phone"] ?? "");
    if (!empty($phone)) {
        $phone = preg_replace("/[^0-9]/", "", $phone);  // Hapus non-angka
        if (strlen($phone) < 10 || strlen($phone) > 13) {
            $errors["phone"] = "Nomor telepon tidak valid";
        }
    }

    // Umur: angka, 17-100
    if (isset($data["umur"])) {
        $umur = filter_var($data["umur"], FILTER_VALIDATE_INT, [
            "options" => ["min_range" => 17, "max_range" => 100]
        ]);
        if ($umur === false) {
            $errors["umur"] = "Umur harus antara 17-100 tahun";
        }
    }

    return $errors;
}

// Penggunaan
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $errors = validasiFormDaftar($_POST);

    if (empty($errors)) {
        // Proses data yang sudah valid
        $nama  = trim($_POST["nama"]);
        $email = strtolower(trim($_POST["email"]));
        $pass  = password_hash($_POST["password"], PASSWORD_BCRYPT, ["cost" => 12]);
        // ... simpan ke database
    }
}
\`\`\`

---

## 🔒 Keamanan: Serangan yang Harus Diwaspadai

### 1. SQL Injection

\`\`\`php
<?php
// ❌ BERBAHAYA — langsung masukkan input ke query
$id = $_GET["id"];
$sql = "SELECT * FROM produk WHERE id = $id";
// Kalau $id = "1 OR 1=1", query jadi:
// SELECT * FROM produk WHERE id = 1 OR 1=1 → AMBIL SEMUA DATA!

// ❌ BERBAHAYA juga:
$sql = "SELECT * FROM users WHERE email = '$email' AND password = '$pass'";
// Kalau email = "' OR '1'='1", bisa bypass login!

// ✅ AMAN — selalu pakai prepared statements
$stmt = $pdo->prepare("SELECT * FROM produk WHERE id = :id");
$stmt->execute([":id" => (int) $_GET["id"]]);
// Tidak peduli isi $id, tidak akan bisa inject SQL
\`\`\`

### 2. XSS (Cross-Site Scripting)

\`\`\`php
<?php
// ❌ BERBAHAYA — echo langsung input user ke HTML
echo "<p>Halo, " . $_POST["nama"] . "!</p>";
// Kalau nama = "<script>alert('hack!')</script>" → dieksekusi di browser!

// ✅ AMAN — escape output SELALU sebelum ditampilkan di HTML
echo "<p>Halo, " . htmlspecialchars($_POST["nama"], ENT_QUOTES, "UTF-8") . "!</p>";

// Buat fungsi helper
function e(string $string): string {
    return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5, "UTF-8");
}

echo "<p>Nama: " . e($_POST["nama"]) . "</p>";
echo "<a href='" . e($_GET["url"]) . "'>Link</a>";

// Di template, SELALU pakai e():
// <h1><?= e($judul) ?></h1>
\`\`\`

### 3. CSRF (Cross-Site Request Forgery)

\`\`\`php
<?php
// CSRF: attacker buat form di website mereka yang submit ke website kita

// Solusi: CSRF token — nilai rahasia yang hanya diketahui server kita
session_start();

// Generate token (di halaman yang tampilkan form)
if (empty($_SESSION["csrf_token"])) {
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}

// Di form:
// <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

// Verifikasi saat form dikirim
function verifyCsrf(): void {
    $token = $_POST["csrf_token"] ?? "";

    if (!hash_equals($_SESSION["csrf_token"] ?? "", $token)) {
        http_response_code(403);
        die("Request tidak valid (CSRF)");
    }

    // Generate token baru setelah berhasil
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}
\`\`\`

### 4. Password yang Aman

\`\`\`php
<?php
// ❌ JANGAN simpan password plain text!
// ❌ JANGAN pakai md5() atau sha1() untuk password!

// ✅ Pakai password_hash()
$password = $_POST["password"];
$hash = password_hash($password, PASSWORD_BCRYPT, ["cost" => 12]);
// Simpan $hash ke database

// ✅ Verifikasi login
$inputPassword = $_POST["password"];
$hashDariDb    = $user["password"];    // Dari database

if (password_verify($inputPassword, $hashDariDb)) {
    // Password benar!
    // Re-hash kalau perlu (cost factor berubah)
    if (password_needs_rehash($hashDariDb, PASSWORD_BCRYPT, ["cost" => 12])) {
        $newHash = password_hash($inputPassword, PASSWORD_BCRYPT, ["cost" => 12]);
        // Update hash di database
    }
} else {
    // Password salah
}
\`\`\`

---

## 📁 Upload File yang Aman

\`\`\`php
<?php
function uploadGambar(array $file, string $folderTujuan): ?string {
    // 1. Cek error upload
    if ($file["error"] !== UPLOAD_ERR_OK) {
        throw new RuntimeException("Upload gagal: " . $file["error"]);
    }

    // 2. Validasi ukuran (maks 2MB)
    if ($file["size"] > 2 * 1024 * 1024) {
        throw new InvalidArgumentException("File terlalu besar (maks 2MB)");
    }

    // 3. Validasi tipe file — JANGAN percaya $file["type"]!
    // Cek tipe berdasarkan konten file, bukan ekstensi
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file["tmp_name"]);

    $allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!in_array($mime, $allowedTypes)) {
        throw new InvalidArgumentException("Tipe file tidak diizinkan: $mime");
    }

    // 4. Generate nama file acak (jangan pakai nama asli dari user!)
    $ext      = match ($mime) {
        "image/jpeg" => "jpg",
        "image/png"  => "png",
        "image/webp" => "webp",
        "image/gif"  => "gif",
    };
    $namaFile = bin2hex(random_bytes(16)) . "." . $ext;
    $tujuan   = rtrim($folderTujuan, "/") . "/" . $namaFile;

    // 5. Pindahkan dari temp ke tujuan
    if (!is_dir($folderTujuan)) {
        mkdir($folderTujuan, 0755, true);
    }

    if (!move_uploaded_file($file["tmp_name"], $tujuan)) {
        throw new RuntimeException("Gagal menyimpan file");
    }

    return $namaFile;
}
\`\`\`

---

## 🔐 Session & Cookie

\`\`\`php
<?php
// Session — data tersimpan di server
session_start();   // Selalu panggil di awal!

$_SESSION["user_id"] = $user["id"];
$_SESSION["role"]    = $user["role"];

// Cek login
if (!isset($_SESSION["user_id"])) {
    header("Location: /login");
    exit;
}

// Logout
session_destroy();
header("Location: /login");
exit;

// Cookie — data tersimpan di browser
setcookie(
    "remember_token",
    $token,
    [
        "expires"  => time() + (30 * 24 * 3600),  // 30 hari
        "path"     => "/",
        "secure"   => true,     // Hanya lewat HTTPS
        "httponly" => true,     // Tidak bisa diakses JavaScript
        "samesite" => "Strict", // Proteksi CSRF tambahan
    ]
);
\`\`\`

---

## 📝 Ringkasan

- **Validasi**: selalu validasi input sebelum diproses atau disimpan
- **SQL Injection**: SELALU pakai prepared statements (\`prepare()\` + \`execute()\`)
- **XSS**: SELALU \`htmlspecialchars()\` sebelum output ke HTML
- **CSRF**: token rahasia di setiap form POST
- **Password**: \`password_hash()\` dan \`password_verify()\` — tidak pernah plain text
- **Upload**: validasi tipe via MIME, bukan ekstensi; generate nama acak

> **Selanjutnya: REST API dengan PHP Murni — bangun backend API tanpa framework!** 🚀
`;
