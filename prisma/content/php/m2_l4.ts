export const php_l4 = `
# OOP di PHP — Bangun Aplikasi yang Terstruktur

Object-Oriented Programming (OOP) adalah cara berpikir tentang kode yang lebih alami dan terstruktur. Alih-alih urutan instruksi, kamu rancang "objek-objek" yang punya data dan kemampuan tersendiri.

PHP mendukung OOP dengan sangat lengkap. Dan di framework modern seperti Laravel, hampir semua kode ditulis dengan OOP.

---

## 🏗️ Class dan Object

\`\`\`php
<?php
class Produk {
    // Properties — data yang dimiliki setiap produk
    public string $nama;
    public float $harga;
    public int $stok;
    private string $kode;       // Hanya bisa diakses dari dalam class
    protected string $kategori; // Bisa diakses oleh class turunan

    // Constructor — dijalankan saat new Produk()
    public function __construct(
        string $nama,
        float $harga,
        int $stok,
        string $kategori = "Umum"
    ) {
        $this->nama     = $nama;
        $this->harga    = $harga;
        $this->stok     = $stok;
        $this->kategori = $kategori;
        $this->kode     = "PRD-" . strtoupper(substr($nama, 0, 3)) . rand(100, 999);
    }

    // Methods — aksi yang bisa dilakukan produk
    public function tampilkanInfo(): string {
        return "[{$this->kode}] {$this->nama} - Rp " .
               number_format($this->harga, 0, ",", ".") .
               " (stok: {$this->stok})";
    }

    public function jual(int $qty): bool {
        if ($qty > $this->stok) {
            echo "Stok tidak mencukupi!\n";
            return false;
        }
        $this->stok -= $qty;
        echo "Berhasil jual $qty {$this->nama}\n";
        return true;
    }

    // Getter — akses property private
    public function getKode(): string { return $this->kode; }

    // Setter — modifikasi dengan validasi
    public function setHarga(float $harga): void {
        if ($harga < 0) throw new InvalidArgumentException("Harga tidak boleh negatif");
        $this->harga = $harga;
    }

    // Static method — dipanggil dari class, bukan instance
    public static function buatDariArray(array $data): self {
        return new self($data["nama"], $data["harga"], $data["stok"]);
    }
}

// Buat object
$laptop = new Produk("Laptop ASUS", 8500000, 10);
$mouse  = new Produk("Mouse Logitech", 150000, 50, "Aksesori");

echo $laptop->tampilkanInfo() . "\n";
$laptop->jual(3);
echo $laptop->tampilkanInfo() . "\n";

// Static method
$keyboard = Produk::buatDariArray(["nama" => "Keyboard", "harga" => 500000, "stok" => 20]);
\`\`\`

---

## 🔒 Encapsulation dengan Magic Methods

\`\`\`php
<?php
class KeranjangBelanja {
    private array $items = [];
    private float $diskon = 0;

    // __get — saat akses property yang tidak ada
    public function __get(string $name): mixed {
        if ($name === "total") {
            return $this->hitungTotal();
        }
        throw new RuntimeException("Property '$name' tidak ditemukan");
    }

    // __toString — saat object di-cast ke string
    public function __toString(): string {
        $output  = "=== Keranjang Belanja ===\n";
        foreach ($this->items as $item) {
            $subtotal = $item["harga"] * $item["qty"];
            $output  .= "- {$item['nama']} x{$item['qty']}: Rp " .
                        number_format($subtotal, 0, ",", ".") . "\n";
        }
        $output .= "Total: Rp " . number_format($this->hitungTotal(), 0, ",", ".") . "\n";
        return $output;
    }

    // __debugInfo — kontrol output var_dump
    public function __debugInfo(): array {
        return ["item_count" => count($this->items), "total" => $this->hitungTotal()];
    }

    public function tambahItem(string $nama, float $harga, int $qty = 1): void {
        $key = strtolower(str_replace(" ", "_", $nama));

        if (isset($this->items[$key])) {
            $this->items[$key]["qty"] += $qty;
        } else {
            $this->items[$key] = compact("nama", "harga", "qty");
        }
    }

    public function setDiskon(float $persen): void {
        if ($persen < 0 || $persen > 100) {
            throw new RangeError("Diskon harus antara 0-100%");
        }
        $this->diskon = $persen;
    }

    private function hitungTotal(): float {
        $subtotal = array_sum(array_map(
            fn($item) => $item["harga"] * $item["qty"],
            $this->items
        ));
        return $subtotal * (1 - $this->diskon / 100);
    }
}

$keranjang = new KeranjangBelanja();
$keranjang->tambahItem("Laptop ASUS", 8500000);
$keranjang->tambahItem("Mouse Logitech", 150000, 2);
$keranjang->tambahItem("Laptop ASUS", 8500000);   // Tambah 1 lagi
$keranjang->setDiskon(10);

echo $keranjang;          // Otomatis panggil __toString
echo $keranjang->total;   // Panggil __get
\`\`\`

---

## 🧬 Inheritance — Turunkan Sifat

\`\`\`php
<?php
// Class induk
abstract class Kendaraan {
    protected string $merek;
    protected int $tahun;
    protected float $kecepatan = 0;

    public function __construct(string $merek, int $tahun) {
        $this->merek = $merek;
        $this->tahun = $tahun;
    }

    // Method konkret — tersedia untuk semua class anak
    public function gas(float $tambahan): void {
        $this->kecepatan += $tambahan;
        echo "{$this->merek} melaju {$this->kecepatan} km/h\n";
    }

    public function rem(): void {
        $this->kecepatan = 0;
        echo "{$this->merek} berhenti\n";
    }

    // Abstract method — WAJIB diimplementasikan oleh class anak
    abstract public function info(): string;

    // Final method — TIDAK BOLEH di-override
    final public function umur(): int {
        return date("Y") - $this->tahun;
    }
}

class Mobil extends Kendaraan {
    private int $pintu;

    public function __construct(string $merek, int $tahun, int $pintu) {
        parent::__construct($merek, $tahun);  // Panggil constructor parent!
        $this->pintu = $pintu;
    }

    // Override method abstract
    public function info(): string {
        return "Mobil {$this->merek} ({$this->tahun}) - {$this->pintu} pintu";
    }

    // Method khusus Mobil
    public function klakson(): void {
        echo "{$this->merek}: Tin-tin! 🚗\n";
    }
}

class Sepeda extends Kendaraan {
    private bool $berListrik;

    public function __construct(string $merek, int $tahun, bool $berListrik = false) {
        parent::__construct($merek, $tahun);
        $this->berListrik = $berListrik;
    }

    public function info(): string {
        $tipe = $this->berListrik ? "Listrik" : "Manual";
        return "Sepeda {$tipe} {$this->merek} ({$this->tahun})";
    }
}

$avanza  = new Mobil("Toyota Avanza", 2022, 4);
$polygon = new Sepeda("Polygon", 2023, false);

echo $avanza->info() . "\n";
echo $avanza->umur() . " tahun\n";
$avanza->gas(60);
$avanza->klakson();

echo $polygon->info() . "\n";
\`\`\`

---

## 🎭 Interface & Trait

\`\`\`php
<?php
// Interface — kontrak yang harus dipenuhi
interface Exportable {
    public function toArray(): array;
    public function toJson(): string;
    public function toCsv(): string;
}

interface Cacheable {
    public function getCacheKey(): string;
    public function getCacheTTL(): int;
}

// Trait — kode yang bisa di-reuse di banyak class
trait HasTimestamps {
    private ?DateTime $createdAt = null;
    private ?DateTime $updatedAt = null;

    public function setCreatedAt(): void {
        $this->createdAt = new DateTime();
    }

    public function setUpdatedAt(): void {
        $this->updatedAt = new DateTime();
    }

    public function getCreatedAt(): ?DateTime { return $this->createdAt; }
    public function getUpdatedAt(): ?DateTime { return $this->updatedAt; }
}

trait HasSoftDelete {
    private ?DateTime $deletedAt = null;

    public function delete(): void {
        $this->deletedAt = new DateTime();
    }

    public function restore(): void {
        $this->deletedAt = null;
    }

    public function isDeleted(): bool {
        return $this->deletedAt !== null;
    }
}

// Class yang implements interface dan pakai trait
class Artikel implements Exportable, Cacheable {
    use HasTimestamps, HasSoftDelete;  // Pakai multiple trait!

    public function __construct(
        private int $id,
        private string $judul,
        private string $konten,
        private string $slug,
    ) {
        $this->setCreatedAt();
    }

    // Implementasi Exportable
    public function toArray(): array {
        return [
            "id"    => $this->id,
            "judul" => $this->judul,
            "slug"  => $this->slug,
        ];
    }

    public function toJson(): string {
        return json_encode($this->toArray(), JSON_UNESCAPED_UNICODE);
    }

    public function toCsv(): string {
        return implode(",", array_values($this->toArray()));
    }

    // Implementasi Cacheable
    public function getCacheKey(): string { return "artikel:{$this->id}"; }
    public function getCacheTTL(): int    { return 3600; }  // 1 jam
}

$artikel = new Artikel(1, "Belajar PHP", "Konten...", "belajar-php");
echo $artikel->toJson() . "\n";
echo $artikel->getCacheKey() . "\n";  // "artikel:1"
$artikel->delete();
echo $artikel->isDeleted() ? "Terhapus\n" : "Masih ada\n";
\`\`\`

---

## 📝 Ringkasan

OOP di PHP lengkap dan powerful:

- **class**: definisi blueprint dengan properties dan methods
- **Visibility**: \`public\`, \`private\`, \`protected\`
- **Constructor**: \`__construct()\`, promoted properties di PHP 8
- **Inheritance**: \`extends\`, \`parent::method()\`
- **abstract**: class/method yang wajib di-implement oleh anak
- **final**: class/method yang tidak bisa di-override
- **interface**: kontrak tanpa implementasi, bisa multiple
- **trait**: kode reusable yang bisa dipakai di banyak class

> **Selanjutnya: Database MySQL & PDO — hubungkan PHP ke database!** 🚀
`;
