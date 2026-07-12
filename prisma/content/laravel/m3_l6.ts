export const laravel_l6 = `
# Proyek Akhir Laravel — Bangun Toko Online Mini dari Nol

Saatnya menggabungkan semua yang sudah dipelajari! Kita bangun **Toko Online Mini** yang punya fitur:
- Katalog produk dengan kategori dan filter
- Keranjang belanja
- Sistem pesanan
- Dashboard admin sederhana
- Auth (login/register)

---

## 🏗️ Setup Project

\`\`\`bash
# Buat project baru
composer create-project laravel/laravel toko-online
cd toko-online

# Install Breeze untuk auth
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install && npm run dev

# Konfigurasi .env
DB_DATABASE=toko_online
DB_USERNAME=root
DB_PASSWORD=
\`\`\`

---

## 📋 Database Design

\`\`\`
Tabel:
├── users           — pembeli + admin
├── kategori        — kategori produk
├── produk          — data produk
├── pesanan         — header pesanan
├── detail_pesanan  — item per pesanan
└── alamat          — alamat pengiriman
\`\`\`

---

## 🗃️ Migration

\`\`\`php
// Migration: kategori
Schema::create('kategori', function (Blueprint $table) {
    $table->id();
    $table->string('nama');
    $table->string('slug')->unique();
    $table->string('ikon')->nullable();
    $table->timestamps();
});

// Migration: produk
Schema::create('produk', function (Blueprint $table) {
    $table->id();
    $table->string('nama');
    $table->string('slug')->unique();
    $table->text('deskripsi')->nullable();
    $table->decimal('harga', 12, 2);
    $table->integer('stok')->default(0);
    $table->string('gambar')->nullable();
    $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
    $table->foreignId('kategori_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});

// Migration: pesanan
Schema::create('pesanan', function (Blueprint $table) {
    $table->id();
    $table->string('nomor')->unique();
    $table->foreignId('user_id')->constrained();
    $table->decimal('subtotal', 12, 2);
    $table->decimal('ongkir', 12, 2)->default(0);
    $table->decimal('total', 12, 2);
    $table->enum('status', ['menunggu', 'dibayar', 'diproses', 'dikirim', 'selesai', 'dibatalkan'])
          ->default('menunggu');
    $table->text('alamat_pengiriman');
    $table->text('catatan')->nullable();
    $table->timestamps();
});

// Migration: detail_pesanan
Schema::create('detail_pesanan', function (Blueprint $table) {
    $table->id();
    $table->foreignId('pesanan_id')->constrained()->cascadeOnDelete();
    $table->foreignId('produk_id')->constrained();
    $table->integer('qty');
    $table->decimal('harga_satuan', 12, 2);
    $table->decimal('subtotal', 12, 2);
    $table->timestamps();
});
\`\`\`

---

## 🛒 Logika Keranjang Belanja

\`\`\`php
// Simpan keranjang di session
// Session: penyimpanan sementara untuk satu browser session

class KeranjangController extends Controller {
    // Tambah ke keranjang
    public function tambah(Request $request, Produk $produk) {
        $keranjang = session()->get('keranjang', []);
        $key = $produk->id;

        if (isset($keranjang[$key])) {
            $keranjang[$key]['qty'] += $request->qty ?? 1;
        } else {
            $keranjang[$key] = [
                'produk_id' => $produk->id,
                'nama'      => $produk->nama,
                'harga'     => $produk->harga,
                'gambar'    => $produk->gambar,
                'qty'       => $request->qty ?? 1,
            ];
        }

        // Validasi stok
        if ($keranjang[$key]['qty'] > $produk->stok) {
            return back()->with('error', 'Stok tidak mencukupi!');
        }

        session()->put('keranjang', $keranjang);
        return back()->with('sukses', 'Produk ditambahkan ke keranjang!');
    }

    // Update qty
    public function update(Request $request, int $produkId) {
        $keranjang = session()->get('keranjang', []);

        if (isset($keranjang[$produkId])) {
            if ($request->qty <= 0) {
                unset($keranjang[$produkId]);
            } else {
                $keranjang[$produkId]['qty'] = $request->qty;
            }
        }

        session()->put('keranjang', $keranjang);
        return back()->with('sukses', 'Keranjang diperbarui!');
    }

    // Tampilkan keranjang
    public function index() {
        $keranjang = session()->get('keranjang', []);
        $subtotal  = collect($keranjang)->sum(fn($item) => $item['harga'] * $item['qty']);
        $ongkir    = $subtotal > 500000 ? 0 : 25000;  // Gratis ongkir di atas 500rb
        $total     = $subtotal + $ongkir;

        return view('keranjang.index', compact('keranjang', 'subtotal', 'ongkir', 'total'));
    }

    // Checkout
    public function checkout(Request $request) {
        $keranjang = session()->get('keranjang', []);

        if (empty($keranjang)) {
            return redirect()->route('keranjang')->with('error', 'Keranjang kosong!');
        }

        $subtotal = collect($keranjang)->sum(fn($item) => $item['harga'] * $item['qty']);
        $ongkir   = $subtotal > 500000 ? 0 : 25000;
        $total    = $subtotal + $ongkir;

        // Buat pesanan dalam transaction — all or nothing
        DB::transaction(function () use ($request, $keranjang, $subtotal, $ongkir, $total) {
            // Buat pesanan
            $pesanan = Pesanan::create([
                'nomor'              => 'ORD-' . date('YmdHis') . '-' . auth()->id(),
                'user_id'            => auth()->id(),
                'subtotal'           => $subtotal,
                'ongkir'             => $ongkir,
                'total'              => $total,
                'alamat_pengiriman'  => $request->alamat,
                'catatan'            => $request->catatan,
            ]);

            // Buat detail pesanan + kurangi stok
            foreach ($keranjang as $item) {
                DetailPesanan::create([
                    'pesanan_id'   => $pesanan->id,
                    'produk_id'    => $item['produk_id'],
                    'qty'          => $item['qty'],
                    'harga_satuan' => $item['harga'],
                    'subtotal'     => $item['harga'] * $item['qty'],
                ]);

                // Kurangi stok
                Produk::where('id', $item['produk_id'])
                      ->decrement('stok', $item['qty']);
            }

            // Kosongkan keranjang
            session()->forget('keranjang');

            // Kirim email konfirmasi
            Mail::to(auth()->user()->email)
                ->queue(new PesananBerhasil($pesanan));
        });

        return redirect()->route('pesanan.index')
                         ->with('sukses', 'Pesanan berhasil dibuat! Cek email untuk konfirmasi.');
    }
}
\`\`\`

---

## 👨‍💼 Dashboard Admin

\`\`\`php
// routes/web.php
Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {
    Route::get('/dashboard', [Admin\\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('produk', Admin\\ProdukController::class);
    Route::resource('pesanan', Admin\\PesananController::class)->only(['index', 'show', 'update']);
    Route::resource('kategori', Admin\\KategoriController::class);
});
\`\`\`

\`\`\`php
// app/Http/Controllers/Admin/DashboardController.php
public function index() {
    return view('admin.dashboard', [
        'total_produk'      => Produk::count(),
        'total_user'        => User::where('role', 'user')->count(),
        'pesanan_hari_ini'  => Pesanan::whereDate('created_at', today())->count(),
        'pendapatan_bulan'  => Pesanan::where('status', 'selesai')
                                      ->whereMonth('created_at', now()->month)
                                      ->sum('total'),
        'pesanan_menunggu'  => Pesanan::where('status', 'menunggu')->count(),
        'pesanan_terbaru'   => Pesanan::with('user')->latest()->take(5)->get(),
        'produk_hampir_habis' => Produk::where('stok', '<', 5)->where('stok', '>', 0)->get(),
        'produk_habis'      => Produk::where('stok', 0)->count(),
    ]);
}
\`\`\`

---

## 🚀 Deploy ke Production

\`\`\`bash
# Di server production
git clone repo-kamu
cd toko-online

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install && npm run build

# Konfigurasi .env
cp .env.example .env
php artisan key:generate
# Edit .env: database, mail, dll.

# Optimasi untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Buat symlink storage
php artisan storage:link

# Set permission
chmod -R 755 storage bootstrap/cache
\`\`\`

---

## 📝 Rangkuman Kursus Laravel Lengkap

| Modul | Topik |
|-------|-------|
| 1 | Pengenalan, MVC, Routing, Blade, Artisan |
| 2 | Eloquent ORM, Migration, Seeder |
| 3 | Form, Validasi, Authentication |
| 4 | API, Resources, Blade Components, Cache |
| 5 | Relasi Lanjutan, Query Builder, Events, Queue |
| 6 | Proyek akhir toko online mini |

**Skill yang sudah kamu kuasai:**
- Membangun web app MVC lengkap dengan Laravel
- Bekerja dengan database menggunakan Eloquent ORM
- Form handling dengan validasi dan error messages
- Sistem autentikasi siap pakai dengan Breeze
- Membuat REST API yang terstruktur
- Pola-pola best practices dunia industri

**Langkah selanjutnya:**
- **Laravel Livewire** — komponen interaktif tanpa JavaScript
- **Laravel Filament** — admin panel siap pakai yang indah
- **Laravel Sail** — development environment dengan Docker
- **Testing** — unit test dan feature test dengan PHPUnit

> **Selamat! Kamu sekarang punya kemampuan membuat web application yang sesungguhnya dengan Laravel. Skills ini sangat dicari di industri!** 🎉🚀
`;
