export const php_l1 = `
# Apa itu PHP? — Bahasa di Balik Jutaan Website

Kalau kamu pernah pakai WordPress, Wikipedia, Facebook di awal, atau hampir semua website e-commerce — ada kemungkinan besar itu dibangun dengan PHP. Dan sampai hari ini, PHP masih mentenagai lebih dari **77% dari semua website** yang ada server-side scripting-nya.

---

## 🤔 Kenapa Belajar PHP di Era JavaScript?

Pertanyaan yang wajar. Jawabannya ada beberapa:

**1. Demand di pasar masih sangat tinggi**
WordPress sendiri mentenagai 43% internet, dan semua WordPress pakai PHP. Belum lagi Laravel, Magento, Drupal — semuanya PHP.

**2. Learning curve yang rendah untuk pemula**
PHP dirancang khusus untuk web, sehingga sangat mudah dipelajari dibanding bahasa lain untuk membuat website dinamis.

**3. Ekosistem yang matang**
Composer (package manager), Laravel (framework), PHPUnit (testing) — semua sudah battle-tested di production selama bertahun-tahun.

**4. Hosting yang murah dan mudah**
Shared hosting biasa pun biasanya support PHP. Tidak perlu server khusus seperti Node.js.

**5. Jembatan ke Laravel**
Kalau kamu mau belajar Laravel (framework PHP terpopuler), kamu perlu fondasi PHP yang kuat dulu.

---

## 🏗️ PHP Bekerja Seperti Ini

\`\`\`
User buka browser → Ketik URL → Request ke server
                                      ↓
                              PHP dijalankan di server
                                      ↓
                              Akses database kalau perlu
                                      ↓
                              Generate HTML
                                      ↓
                              HTML dikirim ke browser
                                      ↓
                           User lihat hasilnya di browser
\`\`\`

PHP itu **server-side** — kode-nya berjalan di server, bukan di browser. Ini berbeda dengan JavaScript yang (normalnya) berjalan di browser.

---

## 🛠️ Setup PHP

\`\`\`bash
# Install PHP (Windows: pakai XAMPP, Mac: pakai Homebrew, Linux: apt)

# XAMPP — paling mudah untuk Windows
# Download dari https://apachefriends.org
# Install → nyalakan Apache dan MySQL dari control panel

# macOS
brew install php

# Ubuntu/Debian
sudo apt update
sudo apt install php php-cli php-fpm php-mysql php-zip php-mbstring

# Cek versi
php --version
# PHP 8.3.0 (cli) ...

# Jalankan file PHP dari terminal
php hello.php

# Jalankan server development built-in PHP (untuk testing cepat)
php -S localhost:8000
# Semua file di folder ini langsung bisa diakses via http://localhost:8000
\`\`\`

---

## 📝 File PHP Pertama

\`\`\`php
<?php
// File: hello.php
// PHP ditulis di antara <?php dan ?>

echo "Halo Dunia!";
echo "<br>";  // Tag HTML bisa langsung ditulis
echo "Ini baris kedua";

// Komentar satu baris
/* Komentar
   multi baris */

// PHP bisa disisipkan ke dalam HTML
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <title>Halaman PHP Pertama</title>
</head>
<body>
    <h1>Halo dari PHP!</h1>

    <?php
        $nama = "Budi";
        $umur = 25;

        // echo = cetak ke halaman
        echo "<p>Nama saya $nama dan umur saya $umur tahun.</p>";

        // Cara lain: heredoc syntax
        echo <<<HTML
        <p>Ini menggunakan heredoc.</p>
        <p>Nama: $nama | Umur: $umur</p>
        HTML;
    ?>

    <p>Ini HTML biasa setelah PHP</p>
</body>
</html>
\`\`\`

---

## 📦 Variabel & Tipe Data

\`\`\`php
<?php
// Variabel selalu dimulai dengan $ (dollar sign)
// PHP adalah bahasa yang loosely typed (tipe tidak perlu dideklarasikan)

$nama       = "Budi Santoso";    // string
$umur       = 25;                 // integer
$tinggi     = 175.5;              // float
$aktif      = true;               // boolean
$alamat     = null;               // null

// PHP akan otomatis konversi tipe kalau diperlukan
$harga = "150000";        // string
$qty   = 3;               // integer
$total = $harga * $qty;   // 450000 (PHP konversi string ke number otomatis)

echo $total;   // 450000

// Cek tipe data
var_dump($nama);      // string(14) "Budi Santoso"
var_dump($umur);      // int(25)
var_dump($aktif);     // bool(true)
var_dump($alamat);    // NULL
gettype($tinggi);     // "double"
is_string($nama);     // true
is_int($umur);        // true
is_null($alamat);     // true

// Konversi tipe eksplisit (casting)
$angkaStr = "42";
$angkaInt = (int) $angkaStr;       // 42
$angkaFloat = (float) "3.14";     // 3.14
$kalimatBool = (bool) "";         // false
$arrayDari = (array) "halo";      // ["halo"]

// Konstanta — nilai yang tidak bisa berubah
define("NAMA_APP", "Toko Online Ku");
define("VERSI", "1.0.0");

const MAX_UPLOAD = 5 * 1024 * 1024;  // 5MB in bytes (cara modern)

echo NAMA_APP;   // Toko Online Ku (tanpa $!)
\`\`\`

---

## 🔢 Operator

\`\`\`php
<?php
// Aritmatika
$a = 10;
$b = 3;

echo $a + $b;    // 13
echo $a - $b;    // 7
echo $a * $b;    // 30
echo $a / $b;    // 3.333...
echo $a % $b;    // 1 (sisa bagi / modulo)
echo $a ** $b;   // 1000 (pangkat)

// Increment/Decrement
$x = 5;
$x++;    // Post-increment: pakai dulu, baru tambah
++$x;    // Pre-increment: tambah dulu, baru pakai
$x--;    // Post-decrement
--$x;    // Pre-decrement

// String
$nama  = "Budi";
$salam = "Halo, " . $nama . "!";  // Concatenation dengan titik (.)
echo $salam;  // Halo, Budi!

$str = "Hello";
$str .= " World";   // Append: $str = $str . " World"

// Perbandingan
var_dump(10 == "10");    // true  (hanya nilai)
var_dump(10 === "10");   // false (nilai DAN tipe)
var_dump(10 !== "10");   // true  (tidak identik)
var_dump(5 <> 3);        // true  (tidak sama, sama dengan !=)

echo (10 > 5) ? "Lebih besar" : "Lebih kecil";  // Ternary operator

// Null coalescing (PHP 7+)
$username = $_GET["user"] ?? "Tamu";   // Pakai "Tamu" kalau $_GET["user"] null/tidak ada

// Logical
var_dump(true && false);   // false
var_dump(true || false);   // true
var_dump(!true);           // false

// Spaceship operator (PHP 7+)
echo 1 <=> 2;    // -1 (1 < 2)
echo 2 <=> 2;    // 0  (2 = 2)
echo 3 <=> 2;    // 1  (3 > 2)
\`\`\`

---

## 🎯 Praktik: Kalkulator Sederhana

\`\`\`php
<?php
// kalkulator.php
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kalkulator PHP</title>
</head>
<body>
    <h1>Kalkulator Sederhana</h1>

    <form method="POST" action="">
        <input type="number" name="angka1" placeholder="Angka pertama" required>
        <select name="operasi">
            <option value="tambah">+</option>
            <option value="kurang">-</option>
            <option value="kali">×</option>
            <option value="bagi">÷</option>
        </select>
        <input type="number" name="angka2" placeholder="Angka kedua" required>
        <button type="submit">Hitung</button>
    </form>

    <?php
    // Hanya proses kalau form dikirim
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $a       = (float) $_POST["angka1"];
        $b       = (float) $_POST["angka2"];
        $operasi = $_POST["operasi"];
        $hasil   = null;
        $error   = null;

        switch ($operasi) {
            case "tambah": $hasil = $a + $b; break;
            case "kurang": $hasil = $a - $b; break;
            case "kali":   $hasil = $a * $b; break;
            case "bagi":
                if ($b == 0) {
                    $error = "Tidak bisa bagi dengan nol!";
                } else {
                    $hasil = $a / $b;
                }
                break;
        }

        if ($error) {
            echo "<p style='color:red'>❌ $error</p>";
        } else {
            $simbol = ["tambah" => "+", "kurang" => "-", "kali" => "×", "bagi" => "÷"];
            echo "<p>✅ <strong>$a {$simbol[$operasi]} $b = $hasil</strong></p>";
        }
    }
    ?>

</body>
</html>
\`\`\`

---

## ✅ Rangkuman

- PHP dijalankan di server, menghasilkan HTML untuk browser
- File PHP menggunakan \`<?php ?>\` tag
- Variabel selalu diawali \`$\` (dollar sign)
- PHP loosely typed — tipe otomatis dikonversi sesuai kebutuhan
- \`==\` untuk perbandingan nilai, \`===\` untuk nilai DAN tipe (strict)
- \`??\` null coalescing — nilai default kalau null/tidak ada

> **Selanjutnya: String & Array — dua tipe data yang paling sering dipakai di PHP!** 🚀
`;
