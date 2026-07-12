export const laravel_l5 = `
# Relationships Lanjutan & Query Builder — Dari Sederhana ke Pro

Sebelum proyek akhir, ada dua topik yang akan sangat sering kamu temui di dunia kerja: **relasi database yang lebih kompleks** dan **Query Builder** untuk query yang lebih powerful.

---

## 🔗 Relasi Lanjutan

### One-to-Many dengan Kondisi

\`\`\`php
class User extends Model {
    // Semua pesanan user ini
    public function pesanan() {
        return $this->hasMany(Pesanan::class);
    }

    // Hanya pesanan yang sudah dibayar
    public function pesananBayar() {
        return $this->hasMany(Pesanan::class)->where('status', 'dibayar');
    }

    // Pesanan terbaru
    public function pesananTerbaru() {
        return $this->hasOne(Pesanan::class)->latestOfMany();
    }
}

// Penggunaan
$user = User::with('pesananBayar')->find(1);
echo $user->pesananBayar->count();  // Jumlah pesanan terbayar
\`\`\`

---

### Many-to-Many — Relasi Banyak ke Banyak

\`\`\`php
// Contoh: Produk ↔ Tag (satu produk bisa punya banyak tag, satu tag untuk banyak produk)
// Butuh tabel pivot: produk_tag (produk_id, tag_id)

class Produk extends Model {
    public function tags() {
        return $this->belongsToMany(Tag::class)
                    ->withTimestamps();   // Simpan created_at di pivot
    }
}

class Tag extends Model {
    public function produk() {
        return $this->belongsToMany(Produk::class);
    }
}

// Penggunaan
$produk = Produk::find(1);

// Tambahkan tag ke produk
$produk->tags()->attach([1, 2, 3]);           // Attach by ID
$produk->tags()->attach(4, ['catatan' => 'Terlaris']);  // Dengan data pivot

// Hapus tag dari produk
$produk->tags()->detach(1);
$produk->tags()->detach();    // Hapus semua tag

// Sync — update tag (hapus yang tidak ada di list, tambah yang baru)
$produk->tags()->sync([2, 3, 5]);

// Ambil produk dengan tag tertentu
$produkLaptop = Produk::whereHas('tags', function ($q) {
    $q->where('nama', 'laptop');
})->get();
\`\`\`

---

### Has-Many-Through — Relasi Tidak Langsung

\`\`\`php
// Country → hasMany → User → hasMany → Pesanan
// Artinya: Country → hasManyThrough → Pesanan (lewat User)

class Country extends Model {
    public function pesanan() {
        return $this->hasManyThrough(
            Pesanan::class,   // Model tujuan akhir
            User::class,      // Model perantara
        );
    }
}

// Penggunaan: ambil semua pesanan dari user di Indonesia
$indonesia = Country::where('kode', 'ID')->first();
$pesanan = $indonesia->pesanan;
\`\`\`

---

## 🔍 Query Builder Lanjutan

\`\`\`php
use Illuminate\\Support\\Facades\\DB;

// ─── Subquery ───
// Produk dengan harga di atas rata-rata
$produk = Produk::where('harga', '>', function ($query) {
    $query->select(DB::raw('AVG(harga)'))->from('produk');
})->get();

// ─── Join ───
$data = DB::table('pesanan')
    ->join('users', 'pesanan.user_id', '=', 'users.id')
    ->join('detail_pesanan', 'pesanan.id', '=', 'detail_pesanan.pesanan_id')
    ->join('produk', 'detail_pesanan.produk_id', '=', 'produk.id')
    ->select(
        'pesanan.nomor',
        'users.name as nama_pembeli',
        'produk.nama as nama_produk',
        'detail_pesanan.qty',
        'detail_pesanan.harga_satuan',
        DB::raw('detail_pesanan.qty * detail_pesanan.harga_satuan as subtotal')
    )
    ->where('pesanan.status', 'dibayar')
    ->orderBy('pesanan.created_at', 'desc')
    ->get();

// ─── Group By & Aggregasi ───
// Jumlah penjualan per produk
$penjualan = DB::table('detail_pesanan')
    ->join('produk', 'detail_pesanan.produk_id', '=', 'produk.id')
    ->select(
        'produk.nama',
        DB::raw('SUM(detail_pesanan.qty) as total_terjual'),
        DB::raw('SUM(detail_pesanan.qty * detail_pesanan.harga_satuan) as total_pendapatan')
    )
    ->groupBy('produk.id', 'produk.nama')
    ->orderByDesc('total_terjual')
    ->get();

// ─── Search / Filter ───
public function index(Request $request) {
    $query = Produk::with('kategori');

    // Filter pencarian
    if ($request->filled('cari')) {
        $query->where('nama', 'like', '%' . $request->cari . '%');
    }

    // Filter kategori
    if ($request->filled('kategori')) {
        $query->where('kategori_id', $request->kategori);
    }

    // Filter harga
    if ($request->filled('min_harga')) {
        $query->where('harga', '>=', $request->min_harga);
    }
    if ($request->filled('max_harga')) {
        $query->where('harga', '<=', $request->max_harga);
    }

    // Sorting
    $sortBy = $request->get('sort', 'created_at');
    $sortDir = $request->get('dir', 'desc');
    $query->orderBy($sortBy, $sortDir);

    $produk = $query->paginate(12)->withQueryString();
    // withQueryString() = pertahankan parameter URL saat ganti halaman

    return view('produk.index', compact('produk'));
}
\`\`\`

---

## 🔔 Events & Listeners — Reaksi Otomatis

\`\`\`php
// Event: sesuatu yang terjadi
// Listener: reaksi terhadap event tersebut

// Contoh: saat pesanan dibuat → kirim email konfirmasi + kurangi stok

// 1. Buat event
php artisan make:event PesananDibuat

// 2. Buat listener
php artisan make:listener KirimEmailKonfirmasi --event=PesananDibuat
php artisan make:listener KurangiStokProduk --event=PesananDibuat

// 3. Daftarkan di EventServiceProvider
protected $listen = [
    PesananDibuat::class => [
        KirimEmailKonfirmasi::class,
        KurangiStokProduk::class,
    ],
];

// 4. Fire event di controller
event(new PesananDibuat($pesanan));
// Otomatis semua listener dijalankan!
\`\`\`

---

## 📊 Scope — Query yang Bisa Dipakai Ulang

\`\`\`php
class Produk extends Model {
    // Local scope
    public function scopeAktif($query) {
        return $query->where('status', 'aktif');
    }

    public function scopeAdaStok($query) {
        return $query->where('stok', '>', 0);
    }

    public function scopeHargaDi($query, int $min, int $max) {
        return $query->whereBetween('harga', [$min, $max]);
    }
}

// Penggunaan — sangat mudah dibaca!
$produk = Produk::aktif()->adaStok()->hargaDi(50000, 500000)->get();

// Lebih expressif daripada:
// $produk = Produk::where('status','aktif')->where('stok','>',0)->whereBetween('harga',[50000,500000])->get();
\`\`\`

---

## ⚡ Job & Queue — Proses Background

\`\`\`php
// Job = task yang bisa dijalankan di background
// Berguna untuk: kirim email, resize gambar, import data besar

php artisan make:job ProsesImportProduk

class ProsesImportProduk implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(public string $filePath) {}

    public function handle(): void {
        $rows = Excel::toArray([], storage_path($this->filePath));

        foreach ($rows[0] as $row) {
            Produk::create([
                'nama'  => $row[0],
                'harga' => $row[1],
                'stok'  => $row[2],
            ]);
        }

        // Hapus file setelah diproses
        Storage::delete($this->filePath);
    }
}

// Dispatch job ke queue (langsung return, proses di background)
ProsesImportProduk::dispatch($filePath);

// Jalankan queue worker
// php artisan queue:work
\`\`\`

---

## 🎯 Praktik: Dashboard Admin dengan Statistik

\`\`\`php
// AdminController
public function dashboard() {
    $stats = [
        'total_produk'  => Produk::count(),
        'total_user'    => User::count(),
        'total_pesanan' => Pesanan::count(),
        'pendapatan'    => Pesanan::where('status', 'dibayar')
                                   ->sum('total'),

        'pesanan_hari_ini' => Pesanan::whereDate('created_at', today())->count(),
        'produk_habis'     => Produk::where('stok', 0)->count(),
    ];

    // Grafik penjualan 7 hari terakhir
    $penjualanMingguan = Pesanan::where('status', 'dibayar')
        ->whereBetween('created_at', [now()->subDays(6), now()])
        ->selectRaw('DATE(created_at) as tanggal, COUNT(*) as jumlah, SUM(total) as pendapatan')
        ->groupBy('tanggal')
        ->orderBy('tanggal')
        ->get();

    // Produk terlaris
    $produkTerlaris = Produk::withCount(['detailPesanan as total_terjual' => function ($q) {
        $q->select(DB::raw('SUM(qty)'));
    }])
    ->orderByDesc('total_terjual')
    ->take(5)
    ->get();

    return view('admin.dashboard', compact('stats', 'penjualanMingguan', 'produkTerlaris'));
}
\`\`\`

---

## ✅ Rangkuman

- **Many-to-Many**: \`belongsToMany()\` + \`attach()\`, \`detach()\`, \`sync()\`
- **Has-Many-Through**: relasi tidak langsung melewati model perantara
- **Query Builder**: \`join()\`, \`groupBy()\`, subquery, DB::raw()
- **Scopes**: query reusable yang membuat kode lebih ekspresif
- **Events & Listeners**: arsitektur event-driven yang bersih
- **Jobs & Queue**: proses berat di background agar user tidak menunggu

> **Satu pelajaran lagi: Proyek akhir — bangun toko online mini yang lengkap!** 🚀
`;
