export const laravel_l4 = `
# Fitur Lanjutan Laravel — API, Components & Best Practices

Kita sudah bisa bikin web app dengan CRUD, form, validasi, dan auth. Sekarang kita naik ke fitur yang sering dipakai di project nyata: API, Blade components yang reusable, dan tips best practices.

---

## 🔌 Laravel API — Buat Backend untuk Mobile/SPA

Laravel bisa jadi backend API yang mengembalikan JSON — cocok untuk aplikasi mobile, React, Vue, atau Next.js.

\`\`\`bash
# Buat API controller (tambah --api untuk skip method create/edit)
php artisan make:controller Api/ProdukController --api
\`\`\`

\`\`\`php
// routes/api.php — semua route di sini otomatis punya prefix /api/
use App\\Http\\Controllers\\Api\\ProdukController;

Route::apiResource('produk', ProdukController::class);

// Route dengan autentikasi token (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('pesanan', PesananController::class);
    Route::get('/profil', [ProfilController::class, 'show']);
});
\`\`\`

\`\`\`php
// app/Http/Controllers/Api/ProdukController.php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Produk;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class ProdukController extends Controller {
    public function index(): JsonResponse {
        $produk = Produk::with('kategori')
                        ->where('status', 'aktif')
                        ->paginate(12);

        return response()->json([
            'success' => true,
            'data'    => $produk,
            'message' => 'Berhasil mengambil data produk',
        ]);
    }

    public function show(Produk $produk): JsonResponse {
        $produk->load('kategori');    // Lazy load relasi

        return response()->json([
            'success' => true,
            'data'    => $produk,
        ]);
    }

    public function store(Request $request): JsonResponse {
        $validated = $request->validate([
            'nama'        => 'required|string|max:255',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'kategori_id' => 'required|exists:kategori,id',
        ]);

        $validated['slug'] = str($validated['nama'])->slug();
        $produk = Produk::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $produk,
            'message' => 'Produk berhasil dibuat',
        ], 201);   // HTTP 201 Created
    }

    public function update(Request $request, Produk $produk): JsonResponse {
        $validated = $request->validate([
            'nama'  => 'sometimes|string|max:255',
            'harga' => 'sometimes|numeric|min:0',
            'stok'  => 'sometimes|integer|min:0',
        ]);

        $produk->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $produk->fresh(),   // Ambil data terbaru dari DB
            'message' => 'Produk berhasil diperbarui',
        ]);
    }

    public function destroy(Produk $produk): JsonResponse {
        $produk->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
\`\`\`

---

## 📦 API Resource — Format Response yang Konsisten

\`\`\`bash
php artisan make:resource ProdukResource
\`\`\`

\`\`\`php
// app/Http/Resources/ProdukResource.php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Resources\\Json\\JsonResource;

class ProdukResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id'         => $this->id,
            'nama'       => $this->nama,
            'slug'       => $this->slug,
            'harga'      => $this->harga,
            'harga_format' => 'Rp ' . number_format($this->harga, 0, ',', '.'),
            'stok'       => $this->stok,
            'status'     => $this->status,
            'gambar_url' => $this->gambar
                                ? asset('storage/' . $this->gambar)
                                : null,
            'kategori'   => [
                'id'   => $this->kategori->id,
                'nama' => $this->kategori->nama,
            ],
            'dibuat_pada' => $this->created_at->format('d M Y'),
        ];
    }
}

// Penggunaan di controller:
public function index(): JsonResponse {
    $produk = Produk::with('kategori')->paginate(12);
    return ProdukResource::collection($produk)->response();
}

public function show(Produk $produk): JsonResponse {
    return new ProdukResource($produk->load('kategori'));
}
\`\`\`

---

## 🧩 Blade Components — Komponen yang Bisa Dipakai Ulang

\`\`\`bash
# Buat component
php artisan make:component Alert
php artisan make:component Tombol
php artisan make:component KartuProduk
\`\`\`

\`\`\`php
// app/View/Components/Alert.php

namespace App\\View\\Components;

use Illuminate\\View\\Component;

class Alert extends Component {
    public function __construct(
        public string $type = 'info',    // info, success, danger, warning
        public string $pesan = ''
    ) {}

    public function render() {
        return view('components.alert');
    }

    public function warna(): string {
        return match($this->type) {
            'success' => 'green',
            'danger'  => 'red',
            'warning' => 'yellow',
            default   => 'blue',
        };
    }
}
\`\`\`

\`\`\`php
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-{{ $type }}" style="border-left: 4px solid {{ $warna() }}">
    {{ $pesan }}
    {{-- Atau: $slot untuk konten fleksibel --}}
    {{ $slot }}
</div>
\`\`\`

\`\`\`php
{{-- Penggunaan di template lain --}}

{{-- Dengan atribut --}}
<x-alert type="success" pesan="Produk berhasil disimpan!" />

{{-- Dengan slot (konten fleksibel) --}}
<x-alert type="danger">
    <strong>Error!</strong> Ada masalah saat menyimpan data.
    Silakan coba lagi atau hubungi admin.
</x-alert>
\`\`\`

---

## 📧 Kirim Email dengan Laravel

\`\`\`bash
php artisan make:mail PesananBerhasil
\`\`\`

\`\`\`php
// app/Mail/PesananBerhasil.php

namespace App\\Mail;

use App\\Models\\Pesanan;
use Illuminate\\Mail\\Mailable;

class PesananBerhasil extends Mailable {
    public function __construct(public Pesanan $pesanan) {}

    public function envelope() {
        return new Envelope(subject: 'Pesanan #' . $this->pesanan->nomor . ' Berhasil!');
    }

    public function content() {
        return new Content(view: 'emails.pesanan-berhasil');
    }
}
\`\`\`

\`\`\`php
// Kirim email
use Illuminate\\Support\\Facades\\Mail;
use App\\Mail\\PesananBerhasil;

Mail::to($user->email)->send(new PesananBerhasil($pesanan));

// Kirim queue (background, tidak blokir response)
Mail::to($user->email)->queue(new PesananBerhasil($pesanan));
\`\`\`

---

## ⚡ Cache — Percepat Aplikasi

\`\`\`php
use Illuminate\\Support\\Facades\\Cache;

// Simpan ke cache selama 60 menit
Cache::put('produk_populer', $data, now()->addMinutes(60));

// Ambil dari cache (atau jalankan closure kalau belum ada)
$produk = Cache::remember('produk_populer', 3600, function () {
    return Produk::withCount('pesanan')
                 ->orderByDesc('pesanan_count')
                 ->take(10)
                 ->get();
});
// Ini sangat berguna! Query berat hanya jalan sekali, sisanya dari cache

// Hapus cache
Cache::forget('produk_populer');

// Cache selamanya
Cache::forever('konfigurasi_site', $config);
\`\`\`

---

## 📝 Best Practices Laravel

\`\`\`
1. THIN Controller, FAT Model/Service
   - Controller hanya terima request, panggil service/model, return response
   - Logika bisnis ada di Model atau Service class

2. Selalu pakai Eager Loading
   - Produk::with('kategori', 'tags')->get()  ← Benar
   - Produk::all()  lalu foreach $p->kategori  ← N+1 Query Problem!

3. Validasi di Form Request untuk kode yang lebih bersih
   php artisan make:request StoreProdukRequest
   Pindahkan rules validasi ke class terpisah

4. Gunakan Route Model Binding
   public function show(Produk $produk)  ← Lebih bersih
   bukan: public function show($id) { $produk = Produk::find($id); ... }

5. Mass Assignment Protection
   - Selalu isi $fillable atau $guarded di model
   - Jangan pakai Produk::create($request->all()) tanpa validasi

6. Environment Variables untuk config sensitif
   - Database password, API key → di .env, jangan hardcode
   - Akses via env('DB_PASSWORD') atau config('database.password')

7. Gunakan Storage::disk('public') untuk file upload
   - php artisan storage:link  (buat symlink public/storage)
   - Akses via asset('storage/path/file')
\`\`\`

---

## ✅ Rangkuman

- **API**: gunakan controller dengan \`--api\`, response JSON lewat \`response()->json()\`
- **API Resource**: format response yang konsisten dan bisa dikustomisasi
- **Blade Components**: \`<x-nama-component />\` — komponen reusable
- **Mail**: \`php artisan make:mail NamaKelas\` → kirim dengan \`Mail::to()->send()\`
- **Cache**: percepat query dengan \`Cache::remember()\`
- Thin controller, eager loading, route model binding — kebiasaan baik sejak awal

> **Selanjutnya: Proyek akhir — bangun toko online mini yang lengkap dengan Laravel!** 🚀
`;
