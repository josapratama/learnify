export const laravel_l7 = `
# Middleware & Authorization — Siapa Boleh Akses Apa?

Di pelajaran sebelumnya kita pakai \`middleware('auth')\` untuk proteksi halaman yang butuh login. Sekarang kita bahas lebih dalam: **bagaimana cara buat rule yang lebih detail** — misalnya, hanya admin yang bisa hapus data, atau user hanya bisa edit profilnya sendiri.

---

## 🚪 Middleware — Pintu Penyaring Request

\`\`\`php
// Middleware = kode yang dijalankan SEBELUM request sampai ke controller
// Seperti satpam yang cek dulu sebelum izinkan masuk

// Lihat middleware yang ada bawaan Laravel
// app/Http/Kernel.php

// ─── Buat middleware custom ───
// php artisan make:middleware CekSudahAdmin

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class CekSudahAdmin {
    public function handle(Request $request, Closure $next) {
        // Cek apakah user sudah login
        if (!auth()->check()) {
            return redirect('/login');
        }

        // Cek apakah rolenya admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Akses ditolak. Halaman ini hanya untuk admin.');
        }

        // Lanjutkan request ke controller
        return $next($request);
    }
}
\`\`\`

\`\`\`php
// Daftarkan middleware di app/Http/Kernel.php
protected $middlewareAliases = [
    'auth'  => \\Illuminate\\Auth\\Middleware\\Authenticate::class,
    'admin' => \\App\\Http\\Middleware\\CekSudahAdmin::class,     // ← Tambahkan ini
    // ...
];

// Pakai di route
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [Admin\\DashboardController::class, 'index']);
    Route::resource('users', Admin\\UserController::class);
});
\`\`\`

---

## 🔑 Gates — Aturan Otorisasi Sederhana

\`\`\`php
// Gates = "boleh atau tidak?" untuk aksi tertentu
// Definisikan di app/Providers/AuthServiceProvider.php

use Illuminate\\Support\\Facades\\Gate;

class AuthServiceProvider extends ServiceProvider {
    public function boot(): void {
        // Gate sederhana
        Gate::define('lihat-admin-panel', function (User $user) {
            return $user->role === 'admin';
        });

        // Gate dengan parameter
        Gate::define('edit-postingan', function (User $user, Postingan $post) {
            // User hanya bisa edit postingannya sendiri
            return $user->id === $post->user_id;
        });

        // Gate untuk multiple roles
        Gate::define('kelola-kursus', function (User $user) {
            return in_array($user->role, ['admin', 'instructor']);
        });

        // Before hook — admin bisa semua
        Gate::before(function (User $user, string $ability) {
            if ($user->role === 'superadmin') {
                return true;   // Superadmin bypass semua Gate
            }
        });
    }
}
\`\`\`

\`\`\`php
// Penggunaan Gate di Controller
public function hapus(Postingan $post) {
    // Cara 1: authorize() — auto throw 403 kalau tidak boleh
    $this->authorize('edit-postingan', $post);

    $post->delete();
    return back()->with('sukses', 'Postingan dihapus!');
}

public function adminPanel() {
    // Cara 2: Gate::allows() / Gate::denies()
    if (Gate::denies('lihat-admin-panel')) {
        abort(403);
    }
    return view('admin.dashboard');
}

// Di Blade template
@can('edit-postingan', $post)
    <a href="{{ route('post.edit', $post) }}">Edit</a>
@endcan

@cannot('lihat-admin-panel')
    <p>Kamu tidak punya akses ke panel admin.</p>
@endcannot
\`\`\`

---

## 🛡️ Policies — Aturan Otorisasi per Model

\`\`\`php
// Policy lebih terstruktur dari Gate — satu file per model
// php artisan make:policy PostinganPolicy --model=Postingan

namespace App\\Policies;

use App\\Models\\User;
use App\\Models\\Postingan;

class PostinganPolicy {
    // Siapa yang boleh lihat semua postingan?
    public function viewAny(User $user): bool {
        return true;   // Semua user yang login
    }

    // Siapa yang boleh lihat satu postingan?
    public function view(?User $user, Postingan $post): bool {
        // ? = nullable, artinya user belum login juga diterima
        if ($post->status === 'published') return true;
        return $user?->id === $post->user_id;
    }

    // Siapa yang boleh buat postingan?
    public function create(User $user): bool {
        return in_array($user->role, ['admin', 'author']);
    }

    // Siapa yang boleh update?
    public function update(User $user, Postingan $post): bool {
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    // Siapa yang boleh hapus?
    public function delete(User $user, Postingan $post): bool {
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    // Siapa yang boleh restore (soft delete)?
    public function restore(User $user, Postingan $post): bool {
        return $user->role === 'admin';
    }
}
\`\`\`

\`\`\`php
// Daftarkan di AuthServiceProvider
protected $policies = [
    Postingan::class => PostinganPolicy::class,
];

// Penggunaan di controller (via Route Model Binding)
public function edit(Postingan $post) {
    $this->authorize('update', $post);   // Otomatis pakai PostinganPolicy::update()
    return view('post.edit', compact('post'));
}

public function index() {
    $this->authorize('viewAny', Postingan::class);
    $postingan = Postingan::all();
    return view('post.index', compact('postingan'));
}

// Di Blade
@can('update', $post)
    <button>Edit</button>
@endcan

@can('delete', $post)
    <button>Hapus</button>
@endcan
\`\`\`

---

## 👥 Role Management dengan Spatie Permission

\`\`\`bash
# Package populer untuk role & permission yang lebih lengkap
composer require spatie/laravel-permission

# Publish konfigurasi
php artisan vendor:publish --provider="Spatie\\Permission\\PermissionServiceProvider"
php artisan migrate
\`\`\`

\`\`\`php
// Setup model User
use Spatie\\Permission\\Traits\\HasRoles;

class User extends Authenticatable {
    use HasRoles;
}

// ─── Buat role dan permission ───
use Spatie\\Permission\\Models\\Role;
use Spatie\\Permission\\Models\\Permission;

// Buat permissions
Permission::create(['name' => 'lihat kursus']);
Permission::create(['name' => 'buat kursus']);
Permission::create(['name' => 'edit kursus']);
Permission::create(['name' => 'hapus kursus']);
Permission::create(['name' => 'kelola user']);

// Buat roles
$admin       = Role::create(['name' => 'admin']);
$instructor  = Role::create(['name' => 'instructor']);
$student     = Role::create(['name' => 'student']);

// Assign permissions ke role
$admin->givePermissionTo(Permission::all());
$instructor->givePermissionTo(['lihat kursus', 'buat kursus', 'edit kursus']);
$student->givePermissionTo(['lihat kursus']);

// ─── Assign role ke user ───
$user = User::find(1);
$user->assignRole('admin');
$user->assignRole(['instructor', 'student']);   // Multiple roles

// Cek role
$user->hasRole('admin');                    // true/false
$user->hasAnyRole(['admin', 'instructor']); // true kalau punya salah satu

// Cek permission
$user->can('buat kursus');
$user->hasPermissionTo('edit kursus');

// Di Blade
@role('admin')
    <a href="/admin">Panel Admin</a>
@endrole

@hasanyrole('admin|instructor')
    <a href="/kursus/buat">Buat Kursus Baru</a>
@endhasanyrole

// Di middleware
Route::middleware(['auth', 'role:admin'])->group(function () {
    // Hanya admin
});

Route::middleware(['auth', 'permission:buat kursus'])->group(function () {
    // Yang punya permission "buat kursus"
});
\`\`\`

---

## 🎯 Praktik: Middleware Throttle Rate Limiting

\`\`\`php
// Rate limiting — batasi berapa kali request dalam waktu tertentu
// Cocok untuk login, API, upload

// routes/web.php
Route::post('/login', [AuthController::class, 'login'])
     ->middleware('throttle:5,1');
     // Maksimal 5 request per 1 menit
     // Kalau melebihi → 429 Too Many Requests

// Kustom rate limit di RouteServiceProvider atau AppServiceProvider
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinutes(5, 5)
                ->by($request->input('email'))     // Per email, bukan per IP
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak percobaan login. Coba lagi dalam 5 menit.'
                    ], 429);
                });
});

Route::post('/login', [AuthController::class, 'login'])
     ->middleware('throttle:login');

// Rate limit untuk API
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('produk', Api\\ProdukController::class);
});
\`\`\`

---

## ✅ Rangkuman

- **Middleware**: filter request sebelum sampai controller (\`php artisan make:middleware\`)
- **Gates**: definisikan aturan "boleh/tidak" sederhana di \`AuthServiceProvider\`
- **Policies**: aturan otorisasi per model, lebih terstruktur dari Gate
- \`$this->authorize('action', $model)\` — auto throw 403 kalau tidak boleh
- \`@can('action', $model)\` di Blade — kondisional berdasarkan otorisasi
- **Spatie Permission**: package lengkap untuk role & permission management

> **Selanjutnya: Testing di Laravel — pastikan kode kamu benar dengan automated testing!** 🚀
`;
