export const laravel_l3 = `
# Form, Validasi & Authentication — Aplikasi yang Aman dan Interaktif

Sampai sini kita sudah bisa tampilkan data dari database. Sekarang step berikutnya: **terima input dari pengguna** dengan aman. Di sinilah form, validasi, dan autentikasi masuk.

---

## 📋 Form di Laravel

Form di Laravel mirip HTML biasa, tapi ada satu hal krusial: **CSRF token**. Laravel otomatis memblokir request POST tanpa token ini untuk melindungi dari serangan.

\`\`\`php
{{-- resources/views/produk/create.blade.php --}}

@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Tambah Produk Baru</h1>

    {{-- Tampilkan semua error validasi --}}
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('produk.store') }}" method="POST" enctype="multipart/form-data">
        {{-- WAJIB! CSRF Protection --}}
        @csrf

        <div class="form-group">
            <label for="nama">Nama Produk</label>
            <input
                type="text"
                name="nama"
                id="nama"
                value="{{ old('nama') }}"
                {{-- old('nama') = isi ulang nilai kalau validasi gagal --}}
                class="form-control {{ $errors->has('nama') ? 'is-invalid' : '' }}"
            >
            {{-- Tampilkan error spesifik --}}
            @error('nama')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="harga">Harga</label>
            <input type="number" name="harga" id="harga"
                   value="{{ old('harga') }}" class="form-control">
            @error('harga')
                <span class="text-danger">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-group">
            <label for="stok">Stok</label>
            <input type="number" name="stok" id="stok"
                   value="{{ old('stok', 0) }}" class="form-control">
        </div>

        <div class="form-group">
            <label for="kategori_id">Kategori</label>
            <select name="kategori_id" id="kategori_id" class="form-control">
                <option value="">-- Pilih Kategori --</option>
                @foreach ($kategori as $kat)
                    <option value="{{ $kat->id }}"
                        {{ old('kategori_id') == $kat->id ? 'selected' : '' }}>
                        {{ $kat->nama }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="gambar">Foto Produk</label>
            <input type="file" name="gambar" id="gambar" accept="image/*">
        </div>

        <div class="form-group">
            <label for="deskripsi">Deskripsi</label>
            <textarea name="deskripsi" id="deskripsi" rows="4">
                {{ old('deskripsi') }}
            </textarea>
        </div>

        <button type="submit">Simpan Produk</button>
        <a href="{{ route('produk.index') }}">Batal</a>
    </form>

    {{-- Form EDIT juga butuh ini untuk method PUT/PATCH --}}
    {{-- <form method="POST" action="/produk/1"> --}}
    {{--     @csrf --}}
    {{--     @method('PUT') ← Simulasi method PUT --}}
    {{-- </form> --}}
</div>
@endsection
\`\`\`

---

## ✅ Validasi

\`\`\`php
// Validasi di Controller
public function store(Request $request) {
    $validated = $request->validate([
        'nama'        => 'required|string|max:255',
        'harga'       => 'required|numeric|min:1000',
        'stok'        => 'required|integer|min:0',
        'kategori_id' => 'required|exists:kategori,id',  // Harus ada di tabel kategori
        'gambar'      => 'nullable|image|mimes:jpg,jpeg,png|max:2048',  // Max 2MB
        'deskripsi'   => 'nullable|string',
    ]);

    // Kalau validasi gagal, Laravel otomatis redirect balik ke form
    // dengan error dan old input

    // Handle upload gambar
    if ($request->hasFile('gambar')) {
        $path = $request->file('gambar')->store('produk', 'public');
        $validated['gambar'] = $path;
    }

    $validated['slug'] = str($validated['nama'])->slug();

    Produk::create($validated);

    return redirect()->route('produk.index')
                     ->with('sukses', 'Produk berhasil ditambahkan!');
}

// Aturan validasi umum:
// required — wajib diisi
// nullable — boleh kosong
// string   — harus teks
// numeric  — harus angka
// integer  — harus bilangan bulat
// min:n    — minimal n (untuk angka atau panjang karakter)
// max:n    — maksimal n
// email    — format email valid
// unique:tabel,kolom — harus unik di tabel tersebut
// exists:tabel,kolom — harus ada di tabel tersebut
// confirmed — harus ada field nama_confirmation (untuk konfirmasi password)
// in:a,b,c — harus salah satu dari nilai tersebut
// image    — harus file gambar
\`\`\`

---

## 🔐 Authentication dengan Laravel Breeze

Laravel Breeze adalah starter kit autentikasi resmi dari Laravel — gratis dan mudah dikustomisasi.

\`\`\`bash
# Install Breeze
composer require laravel/breeze --dev

# Install dengan template Blade (atau pilih lain: react, vue, api)
php artisan breeze:install blade

# Install dependencies JavaScript
npm install && npm run dev

# Jalankan migration (buat tabel users)
php artisan migrate
\`\`\`

Setelah ini, Laravel otomatis buat:
- Halaman registrasi (\`/register\`)
- Halaman login (\`/login\`)
- Halaman lupa password (\`/forgot-password\`)
- Halaman dashboard yang butuh login (\`/dashboard\`)
- Route, controller, dan view yang sudah terhubung!

\`\`\`php
// Cek user yang sedang login
$user = auth()->user();   // Objek user saat ini
$user = Auth::user();     // Sama saja

// Cek apakah sudah login
if (auth()->check()) {
    // Sudah login
}

// Ambil ID user
$userId = auth()->id();

// Logout
auth()->logout();

// Di Blade template
@auth
    <p>Halo, {{ auth()->user()->name }}!</p>
    <a href="/logout">Keluar</a>
@endauth

@guest
    <a href="/login">Masuk</a>
@endguest
\`\`\`

---

## 🛡️ Middleware — Penjaga Pintu

\`\`\`php
// Proteksi route — hanya bisa diakses kalau sudah login
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profil', [ProfilController::class, 'index']);
    Route::resource('produk', ProdukController::class)->except(['index', 'show']);
    // except(['index', 'show']) = kecuali list dan detail (boleh publik)
});

// Proteksi untuk admin saja
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index']);
});
\`\`\`

---

## 🎯 Praktik: Update & Hapus Produk

\`\`\`php
// Controller
public function edit(Produk $produk) {
    // Route model binding: Laravel otomatis cari Produk by ID dari URL
    $kategori = Kategori::all();
    return view('produk.edit', compact('produk', 'kategori'));
}

public function update(Request $request, Produk $produk) {
    $validated = $request->validate([
        'nama'  => 'required|max:255',
        'harga' => 'required|numeric|min:0',
        'stok'  => 'required|integer|min:0',
    ]);

    if ($request->hasFile('gambar')) {
        // Hapus gambar lama
        if ($produk->gambar) {
            Storage::disk('public')->delete($produk->gambar);
        }
        $validated['gambar'] = $request->file('gambar')->store('produk', 'public');
    }

    $produk->update($validated);

    return redirect()->route('produk.index')
                     ->with('sukses', 'Produk berhasil diperbarui!');
}

public function destroy(Produk $produk) {
    if ($produk->gambar) {
        Storage::disk('public')->delete($produk->gambar);
    }

    $produk->delete();

    return redirect()->route('produk.index')
                     ->with('sukses', 'Produk berhasil dihapus!');
}
\`\`\`

\`\`\`php
{{-- Form hapus — perlu method DELETE --}}
<form action="{{ route('produk.destroy', $produk->id) }}" method="POST"
      onsubmit="return confirm('Yakin hapus?')">
    @csrf
    @method('DELETE')
    <button type="submit" class="btn btn-danger">Hapus</button>
</form>
\`\`\`

---

## ✅ Rangkuman

- **@csrf** — token keamanan, WAJIB di setiap form POST
- **old('field')** — isi ulang form saat validasi gagal
- **@error('field')** — tampilkan pesan error spesifik per field
- **\$request->validate([...])** — validasi otomatis dengan redirect jika gagal
- **Laravel Breeze** — starter kit auth yang lengkap dengan satu perintah
- **middleware('auth')** — proteksi route yang butuh login
- **Route model binding** — Laravel otomatis inject model dari parameter URL

> **Selanjutnya: API dengan Laravel, Blade Components, dan proyek akhir toko online!** 🚀
`;
