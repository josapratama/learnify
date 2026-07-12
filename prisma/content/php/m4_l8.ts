export const php_l8 = `
# Composer, PHP Modern & Proyek Akhir

Pelajaran terakhir ini kita bahas Composer (package manager PHP), fitur-fitur modern PHP 8, dan tutup dengan membangun proyek akhir yang menggabungkan semua yang sudah dipelajari.

---

## 📦 Composer — Package Manager PHP

\`\`\`bash
# Install Composer dari https://getcomposer.org
# Cek versi
composer --version

# Inisialisasi project baru
mkdir my-project && cd my-project
composer init    # Interactive, atau:
composer init --no-interaction --name="budi/toko-online" --type="project"

# Install package
composer require vlucas/phpdotenv          # Load .env file
composer require firebase/php-jwt          # JWT authentication
composer require phpmailer/phpmailer        # Kirim email
composer require intervention/image        # Manipulasi gambar
composer require ramsey/uuid               # Generate UUID

# Install dev dependencies
composer require --dev phpunit/phpunit     # Testing
composer require --dev squizlabs/php_codesniffer  # Code style checker

# Update semua package ke versi terbaru
composer update

# Install semua package dari composer.lock (untuk deployment)
composer install --no-dev --optimize-autoloader

# Lihat package yang terinstall
composer show

# Autoload — require_once tidak lagi dibutuhkan!
# Semua class dari vendor otomatis bisa dipakai
require_once "vendor/autoload.php";
\`\`\`

---

## 🔑 Autoloading PSR-4

\`\`\`json
// composer.json
{
    "name": "budi/toko-online",
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\\\": "tests/"
        }
    },
    "scripts": {
        "start": "php -S localhost:8000 -t public/",
        "test": "phpunit tests/"
    }
}
\`\`\`

\`\`\`
// Struktur folder dengan PSR-4:
src/
├── Controllers/
│   ├── ProdukController.php    // Class: App\\Controllers\\ProdukController
│   └── UserController.php
├── Models/
│   ├── Produk.php              // Class: App\\Models\\Produk
│   └── User.php
├── Services/
│   ├── AuthService.php         // Class: App\\Services\\AuthService
│   └── EmailService.php
└── Helpers/
    └── Response.php
\`\`\`

\`\`\`php
<?php
// src/Models/Produk.php
namespace App\\Models;

class Produk {
    // Sekarang class ini bisa di-autoload tanpa require_once!
}

// Di file mana saja:
require_once "vendor/autoload.php";
use App\\Models\\Produk;
$p = new Produk();
\`\`\`

---

## ✨ Fitur PHP 8 Modern

\`\`\`php
<?php
// ─── Constructor Promotion (PHP 8) ───
class User {
    // Cara lama: deklarasi property + constructor + assign satu-satu
    // Cara baru: semuanya dalam satu baris!
    public function __construct(
        public readonly int    $id,
        public string          $nama,
        private string         $email,
        protected string       $role = "user",
    ) {}  // Body kosong!
}

$user = new User(1, "Budi", "budi@email.com");
echo $user->nama;  // "Budi"
echo $user->id;    // 1
// $user->id = 2;  // Error! readonly tidak bisa diubah

// ─── Named Arguments (PHP 8) ───
function buatHeader(string $judul, string $warna = "blue", int $size = 24): string {
    return "<h1 style='color:$warna;font-size:{$size}px'>$judul</h1>";
}

// Tidak perlu urut! Pakai nama parameternya
echo buatHeader(size: 32, judul: "Halo Dunia", warna: "red");

// ─── Fibers (PHP 8.1) — coroutine sederhana ───
$fiber = new Fiber(function(): void {
    $value = Fiber::suspend("data pertama");   // Pause dan return nilai
    echo "Fiber dilanjutkan dengan: $value\n";
});

$hasil = $fiber->start();      // "data pertama"
$fiber->resume("halo fiber");  // "Fiber dilanjutkan dengan: halo fiber"

// ─── Enum (PHP 8.1) ───
enum Status: string {
    case Aktif    = "aktif";
    case Nonaktif = "nonaktif";
    case Pending  = "pending";

    public function label(): string {
        return match($this) {
            Status::Aktif    => "Aktif ✅",
            Status::Nonaktif => "Nonaktif ❌",
            Status::Pending  => "Menunggu ⏳",
        };
    }

    public static function fromLabel(string $label): self {
        return match($label) {
            "aktif"    => self::Aktif,
            "nonaktif" => self::Nonaktif,
            default    => self::Pending,
        };
    }
}

$status = Status::Aktif;
echo $status->value;    // "aktif"
echo $status->label();  // "Aktif ✅"
echo $status->name;     // "Aktif"

// Enum di property/parameter
class Produk {
    public function __construct(
        public string $nama,
        public Status $status = Status::Aktif,
    ) {}
}

// ─── Readonly Properties (PHP 8.1) ───
class Koordinat {
    public function __construct(
        public readonly float $lat,
        public readonly float $lon,
    ) {}
}

$pos = new Koordinat(-6.21, 106.84);
echo $pos->lat;    // -6.21
// $pos->lat = 0;  // Error! Readonly

// ─── Intersection Types (PHP 8.1) ───
interface Serializable { public function serialize(): string; }
interface Jsonable      { public function toJson(): string; }

function simpan(Serializable&Jsonable $obj): void {
    // obj harus implement KEDUA interface!
}

// ─── First-class Callable Syntax (PHP 8.1) ───
$strtolower = strtolower(...);    // Buat callable dari function
$arr = ["APEL", "MANGGA", "PISANG"];
$lower = array_map($strtolower, $arr);  // ["apel", "mangga", "pisang"]

$obj = new MyClass();
$method = $obj->myMethod(...);     // Callable dari method
\`\`\`

---

## 🎯 Proyek Akhir: Mini Blog Engine

\`\`\`
Struktur proyek:
blog/
├── public/
│   └── index.php          ← Front controller
├── src/
│   ├── Controllers/
│   │   ├── PostController.php
│   │   └── AuthController.php
│   ├── Models/
│   │   └── Post.php
│   └── Services/
│       └── AuthService.php
├── views/
│   ├── layouts/
│   │   └── main.php
│   ├── posts/
│   │   ├── index.php
│   │   ├── show.php
│   │   └── create.php
│   └── auth/
│       └── login.php
├── config/
│   └── database.php
├── vendor/
├── composer.json
└── .env
\`\`\`

\`\`\`php
<?php
// public/index.php — Front Controller
require_once "../vendor/autoload.php";

use Dotenv\\Dotenv;
use App\\Controllers\\PostController;
use App\\Controllers\\AuthController;

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

session_start();

// Router sederhana
$uri    = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER["REQUEST_METHOD"];

// Require PDO
require_once "../config/database.php";

$postCtrl = new PostController($pdo);
$authCtrl = new AuthController($pdo);

match (true) {
    $uri === "/" && $method === "GET"             => $postCtrl->index(),
    $uri === "/posts/create" && $method === "GET"  => $postCtrl->create(),
    $uri === "/posts/store" && $method === "POST"  => $postCtrl->store(),
    preg_match("/^\\/posts\\/(\\d+)$/", $uri, $m)  => $postCtrl->show((int) $m[1]),
    $uri === "/login" && $method === "GET"         => $authCtrl->loginForm(),
    $uri === "/login" && $method === "POST"        => $authCtrl->login(),
    $uri === "/logout"                             => $authCtrl->logout(),
    default => (function() { http_response_code(404); include "../views/404.php"; })(),
};
\`\`\`

\`\`\`php
<?php
// src/Models/Post.php
namespace App\\Models;

use PDO;

class Post {
    public function __construct(private PDO $pdo) {}

    public function all(int $page = 1): array {
        $limit  = 10;
        $offset = ($page - 1) * $limit;
        $stmt   = $this->pdo->prepare(
            "SELECT p.*, u.nama AS penulis FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.status = 'published'
             ORDER BY p.created_at DESC
             LIMIT :limit OFFSET :offset"
        );
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create(array $data): int {
        $stmt = $this->pdo->prepare(
            "INSERT INTO posts (user_id, judul, slug, konten, status)
             VALUES (:user_id, :judul, :slug, :konten, :status)"
        );
        $stmt->execute([
            ":user_id" => $data["user_id"],
            ":judul"   => $data["judul"],
            ":slug"    => $this->makeSlug($data["judul"]),
            ":konten"  => $data["konten"],
            ":status"  => $data["status"] ?? "draft",
        ]);
        return (int) $this->pdo->lastInsertId();
    }

    private function makeSlug(string $judul): string {
        $slug = strtolower(preg_replace("/[^a-z0-9]+/i", "-", $judul));
        return trim($slug, "-") . "-" . time();
    }
}
\`\`\`

---

## 📝 Rangkuman Kursus PHP Lengkap

| Modul | Topik |
|-------|-------|
| 1 | Pengenalan PHP, variabel, tipe data, operator |
| 2 | String, array, dan fungsi-fungsi bawaan |
| 3 | Kondisi, loop, fungsi, arrow function |
| 4 | OOP: class, inheritance, interface, trait |
| 5 | Database MySQL dengan PDO, CRUD, transaction |
| 6 | Form, validasi, keamanan (XSS, CSRF, SQL injection) |
| 7 | Session, autentikasi, REST API |
| 8 | Composer, PHP 8 modern, proyek akhir |

**Kamu sekarang siap untuk:**
- Membangun aplikasi web dinamis dari nol
- Bekerja dengan database MySQL secara aman
- Membuat REST API yang bisa dipakai frontend/mobile
- Belajar Laravel — framework PHP terpopuler!

> **Selamat menyelesaikan kursus PHP! Langkah selanjutnya: Laravel untuk membangun aplikasi yang lebih terstruktur dan produktif!** 🎉🚀
`;
