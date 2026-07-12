export const php_l2 = `
# String & Array di PHP — Dua Senjata Utama

Kalau ada dua tipe data yang paling sering kamu pakai di PHP, itu adalah **string** dan **array**. PHP punya ratusan fungsi bawaan untuk keduanya — tapi jangan khawatir, kita fokus pada yang paling sering dipakai.

---

## 📝 String di PHP

\`\`\`php
<?php
$nama  = "Budi Santoso";
$kota  = 'Jakarta';   // Single quote — lebih cepat, tidak proses escape

// ─── Informasi string ───
echo strlen($nama);              // 13 (panjang)
echo strtolower($nama);          // "budi santoso"
echo strtoupper($nama);          // "BUDI SANTOSO"
echo ucwords($nama);             // "Budi Santoso" (tiap kata kapital)
echo ucfirst("halo dunia");      // "Halo dunia" (huruf pertama kapital)
echo str_word_count($nama);      // 2 (jumlah kata)

// ─── Cari dan periksa ───
echo strpos($nama, "Santoso");   // 5 (posisi, 0-indexed)
var_dump(strpos($nama, "xyz"));  // false (tidak ditemukan)
var_dump(str_contains($nama, "Budi"));   // true (PHP 8+)
var_dump(str_starts_with($nama, "Budi")); // true (PHP 8+)
var_dump(str_ends_with($nama, "toso"));   // true (PHP 8+)

// ─── Modifikasi ───
echo str_replace("Santoso", "Wijaya", $nama);   // "Budi Wijaya"
echo trim("  halo dunia  ");                    // "halo dunia"
echo ltrim("  kiri  ");                         // "kiri  "
echo rtrim("  kanan  ");                        // "  kanan"
echo str_pad("5", 3, "0", STR_PAD_LEFT);        // "005"
echo str_repeat("ab", 3);                       // "ababab"
echo str_word_count($nama);                     // 2

// ─── Memecah dan menggabungkan ───
$email = "budi@email.com";
$parts = explode("@", $email);    // ["budi", "email.com"]
echo $parts[0];                   // "budi"

$array = ["Apel", "Mangga", "Pisang"];
echo implode(", ", $array);       // "Apel, Mangga, Pisang"
echo join(" | ", $array);         // "Apel | Mangga | Pisang" (alias implode)

// ─── Substring ───
echo substr("Hello World", 6);       // "World"
echo substr("Hello World", 0, 5);    // "Hello"
echo substr("Hello World", -5);      // "World" (dari belakang)

// ─── Format angka ───
$harga = 8750000;
echo number_format($harga, 0, ",", ".");    // "8.750.000"
echo number_format($harga, 2, ",", ".");    // "8.750.000,00"
echo "Rp " . number_format($harga, 0, ",", ".");   // "Rp 8.750.000"

// ─── String ke angka ───
$strAngka = "42.5px";
echo intval($strAngka);     // 42
echo floatval($strAngka);   // 42.5

// ─── Regex ───
$teks = "Telpon: 081234567890 atau 0812-3456-7890";
preg_match_all("/0[0-9]{9,12}/", $teks, $matches);
print_r($matches[0]);    // ["081234567890"]

$bersih = preg_replace("/[^a-zA-Z0-9 ]/", "", "Helo! @World#123");
echo $bersih;   // "Helo World123"

// ─── HTML escape — WAJIB untuk keamanan! ───
$input_user = "<script>alert('XSS!')</script>";
echo htmlspecialchars($input_user);
// &lt;script&gt;alert(&#039;XSS!&#039;)&lt;/script&gt;
// Ditampilkan sebagai teks, bukan dieksekusi!
\`\`\`

---

## 🗂️ Array di PHP

\`\`\`php
<?php
// PHP array bisa menyimpan campuran tipe data

// ─── Array Indexed (numerik) ───
$buah = ["Apel", "Mangga", "Pisang", "Jeruk"];
echo $buah[0];      // "Apel"
echo $buah[3];      // "Jeruk"
echo count($buah);  // 4

// ─── Array Associative (key-value) ───
$profil = [
    "nama"  => "Budi Santoso",
    "umur"  => 25,
    "email" => "budi@email.com",
    "aktif" => true,
];

echo $profil["nama"];   // "Budi Santoso"
echo $profil["umur"];   // 25

// ─── Array Multidimensi ───
$karyawan = [
    ["nama" => "Budi",  "jabatan" => "Developer",  "gaji" => 8000000],
    ["nama" => "Siti",  "jabatan" => "Designer",   "gaji" => 7000000],
    ["nama" => "Andi",  "jabatan" => "Manager",    "gaji" => 12000000],
];

echo $karyawan[0]["nama"];    // "Budi"
echo $karyawan[2]["jabatan"]; // "Manager"

// ─── Tambah dan hapus ───
$buah[] = "Anggur";          // Tambah ke akhir
array_push($buah, "Semangka", "Melon");  // Tambah beberapa
array_unshift($buah, "Alpukat");          // Tambah ke awal

$terakhir = array_pop($buah);    // Hapus dan ambil dari akhir
$pertama  = array_shift($buah);  // Hapus dan ambil dari awal

unset($buah[2]);   // Hapus indeks 2 (key tetap ada, ada "gap")
$buah = array_values($buah);  // Re-index (hapus gap)

// ─── Pencarian ───
var_dump(in_array("Mangga", $buah));         // true
$pos = array_search("Mangga", $buah);        // 1 (indeks)
var_dump(array_key_exists("nama", $profil)); // true

// ─── Sorting ───
$angka = [5, 2, 8, 1, 9, 3];
sort($angka);      // Sort ascending (reindex)
rsort($angka);     // Sort descending (reindex)

$asosiatif = ["pisang" => 2, "apel" => 5, "mangga" => 1];
asort($asosiatif);   // Sort by value, pertahankan key
ksort($asosiatif);   // Sort by key

// Sort array multidimensi berdasarkan kolom
usort($karyawan, fn($a, $b) => $b["gaji"] - $a["gaji"]);  // Gaji tertinggi duluan

// ─── Manipulasi array ───
$slice = array_slice($buah, 1, 3);     // Ambil 3 elemen mulai index 1

$gabung = array_merge(["a", "b"], ["c", "d"]);  // ["a","b","c","d"]
$gabungKV = array_merge($profil, ["role" => "admin"]);

$unik = array_unique([1, 2, 2, 3, 3, 3, 4]);   // [1, 2, 3, 4]
$flip = array_flip(["a" => 1, "b" => 2]);       // [1 => "a", 2 => "b"]
\`\`\`

---

## ⚡ Array Functions Fungsional

\`\`\`php
<?php
$produk = [
    ["nama" => "Laptop",  "harga" => 8500000, "kategori" => "Elektronik"],
    ["nama" => "Mouse",   "harga" => 150000,  "kategori" => "Elektronik"],
    ["nama" => "Baju",    "harga" => 200000,  "kategori" => "Fashion"],
    ["nama" => "Celana",  "harga" => 350000,  "kategori" => "Fashion"],
    ["nama" => "Monitor", "harga" => 3200000, "kategori" => "Elektronik"],
];

// array_filter — filter berdasarkan kondisi
$elektronik = array_filter($produk, fn($p) => $p["kategori"] === "Elektronik");

$mahal = array_filter($produk, fn($p) => $p["harga"] > 500000);
echo count($mahal) . " produk mahal\n";

// array_map — transformasi setiap elemen
$namaSaja = array_map(fn($p) => $p["nama"], $produk);
// ["Laptop", "Mouse", "Baju", "Celana", "Monitor"]

$denganPPN = array_map(function($p) {
    return array_merge($p, ["harga_ppn" => $p["harga"] * 1.11]);
}, $produk);

// array_reduce — kurangi array ke satu nilai
$totalHarga = array_reduce(
    $produk,
    fn($total, $p) => $total + $p["harga"],
    0   // nilai awal
);
echo "Total: Rp " . number_format($totalHarga, 0, ",", ".") . "\n";

// Rata-rata
$rataRata = $totalHarga / count($produk);

// array_column — ambil satu kolom
$semuaHarga = array_column($produk, "harga");    // [8500000, 150000, ...]
$semuaNama  = array_column($produk, "nama");     // ["Laptop", "Mouse", ...]

echo "Harga tertinggi: " . max($semuaHarga) . "\n";
echo "Harga terendah: " . min($semuaHarga) . "\n";

// Indexing dengan kolom tertentu sebagai key
$indexedByName = array_column($produk, null, "nama");
// ["Laptop" => [...], "Mouse" => [...], ...]
echo $indexedByName["Laptop"]["harga"];   // 8500000

// Sorting yang lebih complex dengan usort
usort($produk, fn($a, $b) => $a["harga"] - $b["harga"]);  // Sort ascending
\`\`\`

---

## 🎯 Praktik: Sistem Nilai Siswa

\`\`\`php
<?php
$nilai = [
    "Budi"  => ["Matematika" => 85, "Bahasa" => 90, "IPA" => 78],
    "Siti"  => ["Matematika" => 92, "Bahasa" => 88, "IPA" => 95],
    "Andi"  => ["Matematika" => 70, "Bahasa" => 75, "IPA" => 72],
    "Dewi"  => ["Matematika" => 95, "Bahasa" => 91, "IPA" => 89],
];

echo "<table border='1'>";
echo "<tr><th>Nama</th><th>MTK</th><th>Bahasa</th><th>IPA</th><th>Rata-rata</th><th>Predikat</th></tr>";

$ranking = [];

foreach ($nilai as $nama => $mapel) {
    $rataRata = array_sum($mapel) / count($mapel);

    $predikat = match(true) {
        $rataRata >= 90 => "A - Sangat Baik",
        $rataRata >= 80 => "B - Baik",
        $rataRata >= 70 => "C - Cukup",
        default         => "D - Perlu Bimbingan",
    };

    $ranking[$nama] = $rataRata;

    echo "<tr>";
    echo "<td>$nama</td>";
    foreach ($mapel as $skor) {
        echo "<td>$skor</td>";
    }
    echo "<td>" . number_format($rataRata, 1) . "</td>";
    echo "<td>$predikat</td>";
    echo "</tr>";
}

echo "</table>";

// Ranking
arsort($ranking);  // Sort by value, pertahankan key
$posisi = 1;
echo "<h2>Ranking Kelas</h2>";
foreach ($ranking as $nama => $nilai) {
    echo "$posisi. $nama: " . number_format($nilai, 1) . "<br>";
    $posisi++;
}
\`\`\`

---

## ✅ Rangkuman

**String:**
- \`strlen\`, \`strtolower/upper\`, \`str_contains\`, \`str_replace\`
- \`explode\` (string → array), \`implode\` (array → string)
- \`substr\`, \`number_format\`, \`htmlspecialchars\` (keamanan!)

**Array:**
- Indexed, Associative, Multidimensi
- \`array_push/pop\`, \`array_shift/unshift\`, \`in_array\`, \`array_search\`
- \`array_filter\`, \`array_map\`, \`array_reduce\` — trio fungsional
- \`sort/rsort/asort/ksort\`, \`usort\` — berbagai pilihan sorting

> **Selanjutnya: Kondisi, Loop & Fungsi — kontrol alur program PHP!** 🚀
`;
