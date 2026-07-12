export const laravel_l1 = `
# Apa itu Laravel? — Framework PHP yang Bikin Produktif 10x

Kalau kamu sudah tahu PHP dasar, kamu pasti pernah nulis kode yang terasa repetitif, tidak teratur, dan susah dibaca ulang. Laravel hadir untuk mengatasi semua itu.

---

## 🤔 Kenapa Harus Belajar Laravel?

Mari jujur dulu — kenapa sih kita perlu framework? Kenapa tidak langsung PHP saja?

Bayangin kamu mau bikin rumah. Kamu bisa mulai dari nol: tebang pohon, potong kayu, buat bata satu per satu. ATAU kamu beli material yang sudah siap dan ikuti cetak biru yang sudah teruji.

Framework itu kayak opsi kedua. **Laravel adalah "cetak biru + material siap pakai" untuk bikin web application dengan PHP.**

**Alasan konkret kenapa Laravel:**

🏆 **Framework PHP paling populer di dunia** — komunitas terbesar, tutorial terbanyak, lowongan kerja paling banyak

⚡ **Produktivitas tinggi** — fitur yang butuh 200 baris PHP biasa, di Laravel cukup 10-20 baris

🛡️ **Keamanan bawaan** — proteksi CSRF, SQL injection, XSS sudah ada tanpa kamu setup manual

🎯 **Ekosistem lengkap** — auth, queue, caching, email, testing, semuanya sudah ada

💼 **Dunia industri** — startup sampai enterprise besar Indonesia pakai Laravel

---

## 🏗️ Arsitektur MVC — Cara Laravel Mengorganisir Kode

Laravel menggunakan pola **MVC (Model-View-Controller)**. Ini cara membagi tanggung jawab kode:

\`\`\`
REQUEST DARI USER
       ↓
   CONTROLLER              ← Yang "mengatur lalu lintas"
   /    \\
MODEL   VIEW                ← Model = data, View = tampilan
  ↓
DATABASE
\`\`\`

**Analogi restoran:**
- **Controller** = Pelayan — terima pesanan, koordinasi dapur dan meja
- **Model** = Dapur — proses dan kelola makanan (data)
- **View** = Piring/Sajian — tampilan yang dilihat tamu

Misalnya saat kamu buka halaman "/produk":
1. Browser kirim request ke URL "/produk"
2. **Router** cek: "URL ini ditangani Controller mana?"
3. **Controller** \`ProdukController@index\` dipanggil
4. Controller minta data ke **Model** Produk
5. Model ambil data dari database
6. Controller kirim data ke **View** \`produk/index.blade.php\`
7. View render HTML dan kirim ke browser

---

## 🛠️ Instalasi Laravel

\`\`\`bash
# Pastikan dulu PHP dan Composer sudah terinstall

# Cek versi PHP (minimal 8.1)
php --version

# Install Composer (PHP package manager) dari https://getcomposer.org
# Cek versi Composer
composer --version

# Buat project Laravel baru (cara paling mudah)
composer create-project laravel/laravel nama-project

# Masuk ke folder project
cd nama-project

# Jalankan development server
php artisan serve
# Server jalan di http://localhost:8000
\`\`\`

---

## 📁 Struktur Folder Laravel

\`\`\`
nama-project/
├── app/
│   ├── Http/
│   │   ├── Controllers/     ← Controller files
│   │   └── Middleware/      ← Middleware (filter request)
│   └── Models/              ← Model files
├── config/                  ← Konfigurasi (database, mail, dll.)
├── database/
│   ├── migrations/          ← Struktur database (seperti "blueprint" tabel)
│   └── seeders/             ← Data awal untuk database
├── public/                  ← File yang bisa diakses publik (index.php, CSS, JS)
├── resources/
│   └── views/               ← Template tampilan (file .blade.php)
├── routes/
│   └── web.php              ← Definisi URL/route
├── storage/                 ← File upload, log, cache
├── .env                     ← Konfigurasi environment (DATABASE, APP_KEY, dll.)
└── artisan                  ← Command line tool Laravel
\`\`\`

---

## 🔑 File .env — Konfigurasi Rahasia

\`\`\`bash
# .env — jangan di-commit ke git!

APP_NAME="Toko Online Ku"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Koneksi database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=toko_online
DB_USERNAME=root
DB_PASSWORD=

# Konfigurasi email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email@gmail.com
MAIL_PASSWORD=app_password
MAIL_ENCRYPTION=tls
\`\`\`

---

## 🗺️ Routing Dasar — Definisi URL

\`\`\`php
// routes/web.php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\ProdukController;

// Route GET sederhana — closure langsung
Route::get('/', function () {
    return view('welcome');   // Render resources/views/welcome.blade.php
});

// Route GET dengan parameter
Route::get('/halo/{nama}', function (string $nama) {
    return "Halo, " . $nama . "!";
});

// Route GET ke controller
Route::get('/produk', [ProdukController::class, 'index']);        // Daftar semua
Route::get('/produk/{id}', [ProdukController::class, 'show']);    // Detail satu

// Route POST (untuk form submit)
Route::post('/produk', [ProdukController::class, 'store']);

// Route PUT (untuk update)
Route::put('/produk/{id}', [ProdukController::class, 'update']);

// Route DELETE
Route::delete('/produk/{id}', [ProdukController::class, 'destroy']);

// Resource route — otomatis buat 7 route CRUD sekaligus!
Route::resource('produk', ProdukController::class);
// Ini sama dengan mendefinisikan: index, create, store, show, edit, update, destroy

// Route dengan nama — berguna untuk redirect dan link di template
Route::get('/login', [AuthController::class, 'form'])->name('login');
// Penggunaan: route('login') → /login

// Grup route dengan prefix
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
    // URL: /admin/dashboard, /admin/users
});

// Route dengan middleware (proteksi)
Route::middleware(['auth'])->group(function () {
    Route::get('/profil', [ProfilController::class, 'index']);
    Route::get('/pesanan', [PesananController::class, 'index']);
});
\`\`\`

---

## 🎨 Blade Template — Cara Bikin View di Laravel

Blade adalah template engine Laravel. File Blade punya ekstensi \`.blade.php\`.

\`\`\`php
{{-- resources/views/produk/index.blade.php --}}

{{-- Meng-extend layout utama --}}
@extends('layouts.app')

{{-- Mengisi section "title" yang ada di layout --}}
@section('title', 'Daftar Produk')

{{-- Mengisi section "content" --}}
@section('content')
<div class="container">
    <h1>Daftar Produk</h1>

    {{-- Tampilkan pesan sukses kalau ada --}}
    @if (session('sukses'))
        <div class="alert alert-success">
            {{ session('sukses') }}
        </div>
    @endif

    {{-- Loop melalui data produk --}}
    @foreach ($produk as $item)
        <div class="kartu-produk">
            <h3>{{ $item->nama }}</h3>
            {{-- {{ }} = echo dengan auto-escape (aman dari XSS) --}}

            <p>Rp {{ number_format($item->harga, 0, ',', '.') }}</p>
            <p>Stok: {{ $item->stok }}</p>

            <a href="{{ route('produk.show', $item->id) }}">
                Lihat Detail
            </a>
        </div>
    @endforeach

    {{-- Kalau tidak ada produk --}}
    @if ($produk->isEmpty())
        <p>Belum ada produk. Tambahkan yang pertama!</p>
    @endif

    {{-- Pagination --}}
    {{ $produk->links() }}
</div>
@endsection
\`\`\`

\`\`\`php
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>@yield('title') - Toko Online</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <nav>
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('produk.index') }}">Produk</a>
        @auth
            <a href="{{ route('profil') }}">Profil</a>
        @endauth
        @guest
            <a href="{{ route('login') }}">Login</a>
        @endguest
    </nav>

    <main>
        @yield('content')  {{-- Konten halaman diisi di sini --}}
    </main>

    <footer>
        <p>&copy; {{ date('Y') }} Toko Online. All rights reserved.</p>
    </footer>
</body>
</html>
\`\`\`

---

## 🎯 Artisan — Command Line Ajaib Laravel

\`\`\`bash
# Lihat semua command yang tersedia
php artisan list

# Buat file Controller baru
php artisan make:controller ProdukController
php artisan make:controller ProdukController --resource   # Lengkap dengan 7 method CRUD

# Buat Model
php artisan make:model Produk
php artisan make:model Produk -m    # Sekaligus buat file migration

# Buat Migration
php artisan make:migration create_produk_table

# Jalankan migration (buat tabel di database)
php artisan migrate

# Rollback migration terakhir
php artisan migrate:rollback

# Buat Seeder
php artisan make:seeder ProdukSeeder

# Jalankan seeder
php artisan db:seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Lihat semua route
php artisan route:list

# Buat Auth (login/register) — butuh Laravel Breeze
composer require laravel/breeze --dev
php artisan breeze:install
php artisan migrate
npm install && npm run dev
\`\`\`

---

## 🎯 Praktik: Route dan View Pertama

\`\`\`php
// routes/web.php — Tambahkan ini
Route::get('/halo', function () {
    $data = [
        'nama'  => 'Budi',
        'skill' => ['HTML', 'CSS', 'Laravel'],
        'tahun' => date('Y'),
    ];

    return view('halo', $data);
    // atau: return view('halo', compact('nama', 'skill', 'tahun'));
});
\`\`\`

\`\`\`php
{{-- resources/views/halo.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>Halo dari Laravel</title>
</head>
<body>
    <h1>Halo, {{ $nama }}! 👋</h1>
    <p>Tahun {{ $tahun }}</p>

    <h2>Skill saya:</h2>
    <ul>
        @foreach ($skill as $s)
            <li>{{ $s }}</li>
        @endforeach
    </ul>
</body>
</html>
\`\`\`

Buka http://localhost:8000/halo — lihat hasilnya!

---

## ✅ Rangkuman

- Laravel = framework PHP dengan pola MVC
- **Route** di \`routes/web.php\` — definisi URL dan handler-nya
- **Controller** di \`app/Http/Controllers/\` — logika aplikasi
- **View** di \`resources/views/\` — template HTML dengan Blade
- **Model** di \`app/Models/\` — representasi data/tabel
- \`php artisan\` — tool command line yang powerful
- \`{{ $variabel }}\` — echo aman di Blade

> **Selanjutnya: Database, Migration, dan Eloquent ORM — cara Laravel bekerja dengan database!** 🚀
`;
