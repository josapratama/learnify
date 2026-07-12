export const laravel_l2 = `
# Database & Eloquent ORM — Ngobrol dengan Database Pakai Bahasa PHP

Di pelajaran sebelumnya kita sudah setup Laravel dan paham strukturnya. Sekarang masuk ke jantungnya: **database**. Dan cara Laravel berinteraksi dengan database — melalui **Eloquent ORM** — adalah salah satu hal yang paling bikin developer jatuh cinta dengan Laravel.

---

## 🤔 Apa itu ORM?

**ORM (Object-Relational Mapping)** = jembatan antara objek PHP dan tabel database.

Tanpa ORM, kamu tulis SQL mentah:
\`\`\`php
// Tanpa ORM — SQL mentah
$produk = DB::select("SELECT * FROM produk WHERE harga < ? AND stok > ?", [100000, 0]);
\`\`\`

Dengan Eloquent ORM:
\`\`\`php
// Dengan Eloquent — lebih ekspresif dan mudah dibaca
$produk = Produk::where('harga', '<', 100000)->where('stok', '>', 0)->get();
\`\`\`

Hasilnya sama, tapi yang bawah jauh lebih mudah ditulis, dibaca, dan di-maintain. Plus ada autocomplete di editor!

---

## 📋 Migration — Blueprint Tabel Database

Migration itu seperti "catatan perubahan" database kamu. Setiap perubahan struktur tabel dicatat, bisa di-rollback kalau ada masalah.

\`\`\`bash
# Buat migration baru
php artisan make:migration create_produk_table
\`\`\`

\`\`\`php
// database/migrations/2024_01_01_000000_create_produk_table.php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('produk', function (Blueprint $table) {
            $table->id();                          // Kolom id auto-increment (primary key)
            $table->string('nama');                // VARCHAR(255)
            $table->string('slug')->unique();      // Untuk URL yang SEO-friendly
            $table->text('deskripsi')->nullable(); // TEXT, boleh null
            $table->decimal('harga', 12, 2);       // Desimal: 12 digit, 2 di belakang koma
            $table->integer('stok')->default(0);   // INTEGER, default 0
            $table->string('gambar')->nullable();  // Path gambar
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->foreignId('kategori_id')       // Foreign key ke tabel kategori
                  ->constrained()                  // Otomatis referensi ke tabel kategori
                  ->cascadeOnDelete();              // Hapus produk kalau kategori dihapus
            $table->timestamps();                  // created_at & updated_at otomatis
        });
    }

    public function down(): void {
        Schema::dropIfExists('produk');   // Rollback: hapus tabel
    }
};
\`\`\`

\`\`\`bash
# Jalankan semua migration yang belum dijalankan
php artisan migrate

# Rollback 1 batch terakhir
php artisan migrate:rollback

# Reset semua lalu migrate ulang (HAPUS SEMUA DATA!)
php artisan migrate:fresh

# Fresh + jalankan seeder
php artisan migrate:fresh --seed
\`\`\`

---

## 🏗️ Eloquent Model

\`\`\`bash
# Buat model (dan migration sekaligus)
php artisan make:model Produk -m
\`\`\`

\`\`\`php
// app/Models/Produk.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;

class Produk extends Model {
    use HasFactory;

    // Nama tabel (kalau tidak sesuai konvensi Laravel)
    protected $table = 'produk';

    // Field yang boleh di-isi massal (mass assignment)
    protected $fillable = [
        'nama', 'slug', 'deskripsi', 'harga', 'stok', 'gambar', 'status', 'kategori_id'
    ];

    // Field yang otomatis di-cast ke tipe tertentu
    protected $casts = [
        'harga' => 'decimal:2',
        'stok'  => 'integer',
    ];

    // Accessor: ubah cara mengambil nilai
    public function getHargaFormatAttribute(): string {
        return 'Rp ' . number_format($this->harga, 0, ',', '.');
    }

    // Relasi: satu produk punya satu kategori
    public function kategori() {
        return $this->belongsTo(Kategori::class);
    }

    // Relasi: satu produk bisa ada di banyak detail pesanan
    public function detailPesanan() {
        return $this->hasMany(DetailPesanan::class);
    }
}
\`\`\`

---

## 🔍 Query dengan Eloquent

\`\`\`php
// === BACA DATA ===

// Ambil SEMUA data
$semuaProduk = Produk::all();

// Ambil dengan kondisi
$produkAktif = Produk::where('status', 'aktif')->get();

// Multiple kondisi
$produkMurah = Produk::where('status', 'aktif')
                     ->where('harga', '<', 100000)
                     ->where('stok', '>', 0)
                     ->get();

// Urutan
$terbaru = Produk::orderBy('created_at', 'desc')->get();
$termurah = Produk::orderBy('harga', 'asc')->limit(10)->get();

// Pagination — PENTING untuk performa!
$produk = Produk::paginate(12);    // 12 item per halaman
$produk = Produk::simplePaginate(12);  // Versi sederhana (hanya prev/next)

// Ambil satu data
$produk = Produk::find(1);           // Cari by ID, null kalau tidak ada
$produk = Produk::findOrFail(1);     // Cari by ID, throw 404 kalau tidak ada
$produk = Produk::where('slug', 'laptop-asus')->first();
$produk = Produk::where('slug', 'laptop-asus')->firstOrFail();

// Dengan relasi (eager loading — hindari N+1 query!)
$produk = Produk::with('kategori')->get();
// Ini 1 query saja, bukan N+1!

// Hitung
$jumlah = Produk::where('status', 'aktif')->count();
$totalStok = Produk::sum('stok');
$hargaRataRata = Produk::avg('harga');

// === BUAT DATA ===

// Cara 1: create (semua sekaligus)
$produk = Produk::create([
    'nama'        => 'Laptop ASUS VivoBook',
    'slug'        => 'laptop-asus-vivobook',
    'harga'       => 8500000,
    'stok'        => 10,
    'kategori_id' => 1,
]);

// Cara 2: new + fill + save
$produk = new Produk();
$produk->nama  = 'Mouse Logitech';
$produk->harga = 150000;
$produk->stok  = 50;
$produk->save();

// === UPDATE DATA ===

// Update satu data
$produk = Produk::findOrFail(1);
$produk->harga = 9000000;
$produk->save();

// Update langsung
Produk::where('id', 1)->update(['harga' => 9000000]);

// === HAPUS DATA ===

// Soft delete (lebih direkomendasikan — data tidak benar-benar hilang)
$produk = Produk::findOrFail(1);
$produk->delete();

// Hard delete
$produk->forceDelete();

// Restore soft deleted
$produk->restore();
\`\`\`

---

## 🔗 Relasi Antar Model

\`\`\`php
// Relasi: Kategori → hasMany → Produk
// Relasi: Produk → belongsTo → Kategori

class Kategori extends Model {
    public function produk() {
        return $this->hasMany(Produk::class);  // Satu kategori punya banyak produk
    }
}

class Produk extends Model {
    public function kategori() {
        return $this->belongsTo(Kategori::class);  // Satu produk punya satu kategori
    }
}

// Penggunaan
$kategori = Kategori::with('produk')->find(1);
foreach ($kategori->produk as $produk) {
    echo $produk->nama;
}

// Relasi Many-to-Many (Produk ↔ Tag)
class Produk extends Model {
    public function tags() {
        return $this->belongsToMany(Tag::class);  // Butuh tabel pivot: produk_tag
    }
}
\`\`\`

---

## 🌱 Seeder — Data Awal Database

\`\`\`bash
php artisan make:seeder ProdukSeeder
\`\`\`

\`\`\`php
// database/seeders/ProdukSeeder.php

namespace Database\\Seeders;

use App\\Models\\Produk;
use App\\Models\\Kategori;
use Illuminate\\Database\\Seeder;

class ProdukSeeder extends Seeder {
    public function run(): void {
        // Buat kategori dulu
        $elektronik  = Kategori::create(['nama' => 'Elektronik']);
        $fashion     = Kategori::create(['nama' => 'Fashion']);

        // Buat produk
        Produk::create([
            'nama'        => 'Laptop ASUS VivoBook',
            'slug'        => 'laptop-asus-vivobook',
            'harga'       => 8500000,
            'stok'        => 10,
            'status'      => 'aktif',
            'kategori_id' => $elektronik->id,
        ]);

        // Factory — buat banyak data dummy
        Produk::factory(50)->create(['kategori_id' => $elektronik->id]);
    }
}
\`\`\`

\`\`\`bash
php artisan db:seed --class=ProdukSeeder
# atau jalankan semua seeder:
php artisan db:seed
\`\`\`

---

## 🎯 Praktik: Controller + Model + View Lengkap

\`\`\`php
// app/Http/Controllers/ProdukController.php

namespace App\\Http\\Controllers;

use App\\Models\\Produk;
use Illuminate\\Http\\Request;

class ProdukController extends Controller {
    // Tampilkan semua produk
    public function index() {
        $produk = Produk::with('kategori')
                        ->where('status', 'aktif')
                        ->orderBy('created_at', 'desc')
                        ->paginate(12);

        return view('produk.index', compact('produk'));
    }

    // Tampilkan detail satu produk
    public function show(string $slug) {
        $produk = Produk::where('slug', $slug)->firstOrFail();
        return view('produk.show', compact('produk'));
    }

    // Simpan produk baru
    public function store(Request $request) {
        // Validasi
        $validated = $request->validate([
            'nama'  => 'required|max:255',
            'harga' => 'required|numeric|min:0',
            'stok'  => 'required|integer|min:0',
        ]);

        // Buat slug dari nama
        $validated['slug'] = str($validated['nama'])->slug();

        Produk::create($validated);

        return redirect()->route('produk.index')
                         ->with('sukses', 'Produk berhasil ditambahkan!');
    }
}
\`\`\`

---

## ✅ Rangkuman

- **Migration** = blueprint perubahan struktur tabel
- **Model** = representasi tabel, bisa query dengan metode PHP
- **Eloquent** = ORM Laravel yang ekspresif dan mudah dibaca
- \`Produk::where(...)->get()\` — query tanpa SQL mentah
- **Relasi**: \`hasMany\`, \`belongsTo\`, \`belongsToMany\`
- Selalu pakai \`with('relasi')\` untuk eager loading dan hindari N+1

> **Selanjutnya: Form, Validasi, dan Authentication — bikin aplikasi yang bisa login!** 🚀
`;
