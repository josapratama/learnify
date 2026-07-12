export const php_l3 = `
# Kondisi, Loop & Fungsi — Kontrol Alur PHP

Dengan variabel, string, dan array yang sudah dikuasai, sekarang kita belajar cara "mengatur" eksekusi program: kapan jalankan kode tertentu, kapan diulang, dan bagaimana membungkus kode agar bisa dipakai ulang.

---

## 🔀 Kondisi

\`\`\`php
<?php
$nilai = 82;

// ─── if / elseif / else ───
if ($nilai >= 90) {
    $predikat = "A";
} elseif ($nilai >= 80) {
    $predikat = "B";
} elseif ($nilai >= 70) {
    $predikat = "C";
} else {
    $predikat = "D";
}

echo "Predikat: $predikat\n";  // Predikat: B

// ─── switch ───
$hari = "Senin";

switch ($hari) {
    case "Sabtu":
    case "Minggu":
        echo "Weekend!\n";
        break;
    case "Senin":
        echo "Awal pekan, semangat!\n";
        break;
    case "Jumat":
        echo "Hampir weekend!\n";
        break;
    default:
        echo "Hari biasa\n";
}

// ─── match (PHP 8+) — lebih strict dan ekspresif ───
$status = "aktif";

$label = match ($status) {
    "aktif"    => "Aktif ✅",
    "nonaktif" => "Nonaktif ❌",
    "pending"  => "Menunggu ⏳",
    default    => "Status tidak dikenal",
};
// match menggunakan === (strict), switch menggunakan ==

echo $label;  // "Aktif ✅"

// match dengan multiple value
$tipe = "webm";
$mediaType = match (true) {
    in_array($tipe, ["jpg", "jpeg", "png", "webp"]) => "image",
    in_array($tipe, ["mp4", "webm", "avi"])          => "video",
    in_array($tipe, ["mp3", "ogg", "wav"])            => "audio",
    default                                           => "unknown",
};

// ─── Ternary dan null coalescing ───
$harga = $diskon > 0 ? $harga * (1 - $diskon) : $harga;
$username = $_GET["user"] ?? "Tamu";

// Short ternary (Elvis operator)
$nama = $profil["nama"] ?: "Nama tidak tersedia";
// Sama dengan: $profil["nama"] ? $profil["nama"] : "Nama tidak tersedia"
\`\`\`

---

## 🔄 Loop

\`\`\`php
<?php
// ─── for ───
echo "Daftar perkalian 5:\n";
for ($i = 1; $i <= 10; $i++) {
    echo "5 × $i = " . (5 * $i) . "\n";
}

// ─── while ───
$n = 1;
$total = 0;
while ($n <= 100) {
    $total += $n;
    $n++;
}
echo "1 + 2 + ... + 100 = $total\n";   // 5050

// ─── do-while — minimal satu kali jalan ───
$percobaan = 0;
do {
    $percobaan++;
    $angkaRandom = rand(1, 10);
    echo "Percobaan $percobaan: $angkaRandom\n";
} while ($angkaRandom !== 7 && $percobaan < 10);

// ─── foreach ───
$kota = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"];

foreach ($kota as $nama) {
    echo "- $nama\n";
}

// Dengan key (index)
foreach ($kota as $index => $nama) {
    echo ($index + 1) . ". $nama\n";
}

// Associative array
$profil = ["nama" => "Budi", "umur" => 25, "kota" => "Jakarta"];
foreach ($profil as $key => $value) {
    echo "$key: $value\n";
}

// Array multidimensi
$produk = [
    ["nama" => "Laptop", "harga" => 8500000],
    ["nama" => "Mouse",  "harga" => 150000],
];

foreach ($produk as $item) {
    echo "{$item['nama']}: Rp " . number_format($item["harga"], 0, ",", ".") . "\n";
}

// ─── break dan continue ───
for ($i = 1; $i <= 20; $i++) {
    if ($i % 3 !== 0) continue;   // Lewati yang bukan kelipatan 3
    if ($i > 15) break;            // Hentikan kalau sudah > 15
    echo "$i ";
}
// 3 6 9 12 15
\`\`\`

---

## 🔧 Fungsi

\`\`\`php
<?php
// ─── Fungsi dasar ───
function salam($nama, $waktu = "pagi") {
    // $waktu = "pagi" adalah default parameter
    return "Selamat $waktu, $nama!";
}

echo salam("Budi");           // Selamat pagi, Budi!
echo salam("Siti", "malam");  // Selamat malam, Siti!

// ─── Type hints (PHP 7+) — deklarasi tipe ───
function hitungLuas(float $panjang, float $lebar): float {
    return $panjang * $lebar;
}

function validasiUmur(int $umur): bool {
    return $umur >= 17 && $umur <= 100;
}

// Nullable type
function cariUser(?int $id): ?array {
    // ? berarti boleh null
    if ($id === null) return null;
    return ["id" => $id, "nama" => "Budi"];
}

// Return type union (PHP 8+)
function prosesInput(string|int $input): string|int {
    if (is_string($input)) return strtoupper($input);
    return $input * 2;
}

// ─── Fungsi dengan variadic parameter ───
function jumlahkan(int ...$angka): int {
    return array_sum($angka);
}

echo jumlahkan(1, 2, 3, 4, 5);    // 15
echo jumlahkan(...[10, 20, 30]);   // 60 (spread operator)

// ─── Anonymous function (closure) ───
$kali = function(int $a, int $b): int {
    return $a * $b;
};
echo $kali(3, 4);  // 12

// Closure yang menangkap variabel luar
$faktor = 10;
$kaliDenganFaktor = function($n) use ($faktor) {
    return $n * $faktor;
};
echo $kaliDenganFaktor(5);   // 50

// use by reference
$counter = 0;
$tambah  = function() use (&$counter) {
    $counter++;
};
$tambah(); $tambah(); $tambah();
echo $counter;   // 3

// ─── Arrow function (PHP 7.4+) — singkatan closure ───
$tambahSepuluh = fn($n) => $n + 10;   // Otomatis capture variabel luar
echo $tambahSepuluh(5);  // 15

// Arrow function dengan penggunaan di array functions
$harga = [100000, 250000, 50000, 175000];
$diskon10 = array_map(fn($h) => $h * 0.9, $harga);
$di_atas_100 = array_filter($harga, fn($h) => $h >= 100000);

// ─── Return multiple values dengan array ───
function statistik(array $data): array {
    return [
        "min"     => min($data),
        "max"     => max($data),
        "rata2"   => array_sum($data) / count($data),
        "jumlah"  => count($data),
    ];
}

$nilai = [75, 82, 90, 68, 95, 88];
["min" => $min, "max" => $max, "rata2" => $avg] = statistik($nilai);
echo "Min: $min, Max: $max, Avg: $avg\n";
\`\`\`

---

## 📦 Include & Require

\`\`\`php
// Pisahkan kode ke file berbeda agar lebih terorganisir

// functions.php
<?php
function formatRupiah(float $amount): string {
    return "Rp " . number_format($amount, 0, ",", ".");
}

function sanitize(string $input): string {
    return htmlspecialchars(trim($input));
}

// index.php
<?php
require_once "functions.php";   // Error kalau file tidak ada
// include_once "functions.php"; // Warning kalau tidak ada (tidak stop)

echo formatRupiah(8500000);    // Rp 8.500.000

// config.php
<?php
return [
    "db_host"  => "localhost",
    "db_name"  => "toko_online",
    "debug"    => false,
];

// Menggunakan config
$config = require "config.php";
echo $config["db_host"];   // localhost
\`\`\`

---

## 🎯 Praktik: Sistem Konversi Suhu

\`\`\`php
<?php
function celsiusFahrenheit(float $c): float { return ($c * 9/5) + 32; }
function celsiusKelvin(float $c): float     { return $c + 273.15; }
function fahrenheitCelsius(float $f): float { return ($f - 32) * 5/9; }

function konversiSuhu(float $nilai, string $dari, string $ke): float {
    // Konversi ke Celsius dulu sebagai basis
    $celsius = match ($dari) {
        "C" => $nilai,
        "F" => fahrenheitCelsius($nilai),
        "K" => $nilai - 273.15,
        default => throw new InvalidArgumentException("Satuan tidak dikenal: $dari"),
    };

    // Konversi dari Celsius ke tujuan
    return match ($ke) {
        "C" => $celsius,
        "F" => celsiusFahrenheit($celsius),
        "K" => celsiusKelvin($celsius),
        default => throw new InvalidArgumentException("Satuan tidak dikenal: $ke"),
    };
}

// Test semua konversi
$suhu = 100;
$satuan = ["C", "F", "K"];

echo "Konversi suhu $suhu°:\n";
foreach ($satuan as $dari) {
    foreach ($satuan as $ke) {
        if ($dari !== $ke) {
            $hasil = konversiSuhu($suhu, $dari, $ke);
            printf("  %s°%s → %.2f°%s\n", $suhu, $dari, $hasil, $ke);
        }
    }
}
\`\`\`

---

## ✅ Rangkuman

- **if/elseif/else**: kondisi standar
- **match** (PHP 8+): lebih strict dan compact dari switch
- **for, while, do-while, foreach**: pilih sesuai kebutuhan
- **break/continue**: kontrol perulangan
- **Fungsi**: \`function nama(tipe $param = default): returnType { }\`
- **Type hints**: \`string\`, \`int\`, \`float\`, \`bool\`, \`array\`, \`?nullable\`
- **Closure**: \`function() use ($var) { }\`
- **Arrow function**: \`fn($x) => $x * 2\`

> **Selanjutnya: OOP di PHP — Class, Object, dan cara membangun aplikasi yang terstruktur!** 🚀
`;
