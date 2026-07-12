export const laravel_l10 = `
# API Authentication dengan Sanctum & Tips Production

Pelajaran terakhir ini menggabungkan dua topik penting: **Sanctum untuk API auth yang aman** dan **tips deploy Laravel ke production** yang benar.

---

## 🔐 Laravel Sanctum — API Token Authentication

\`\`\`bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
php artisan migrate
\`\`\`

\`\`\`php
// app/Models/User.php — tambahkan trait
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
}
\`\`\`

\`\`\`php
// routes/api.php
use App\\Http\\Controllers\\Api\\AuthController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes — butuh token
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profil', [AuthController::class, 'profil']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('produk', ProdukController::class)->except(['index', 'show']);
});

// Public API
Route::apiResource('produk', ProdukController::class)->only(['index', 'show']);
\`\`\`

\`\`\`php
// app/Http/Controllers/Api/AuthController.php

namespace App\\Http\\Controllers\\Api;

use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller {
    public function register(Request $request) {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Buat token — beri nama yang deskriptif
        $token = $user->createToken('app-token', ['*'])->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => $user,
            'token'   => $token,
            'type'    => 'Bearer',
        ], 201);
    }

    public function login(Request $request) {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Hapus token lama (opsional — kalau mau satu device satu session)
        // $user->tokens()->delete();

        $token = $user->createToken(
            $request->device_name ?? 'api-token',
            ['*']   // Abilities/scopes — ['*'] = semua akses
        )->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => $user,
            'token'   => $token,
            'type'    => 'Bearer',
        ]);
    }

    public function profil(Request $request) {
        return response()->json([
            'success' => true,
            'user'    => $request->user()->load('roles'),
        ]);
    }

    public function logout(Request $request) {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout.',
        ]);
    }
}
\`\`\`

---

## 📡 Cara Pakai API dari Frontend

\`\`\`javascript
// JavaScript / React / Vue

const API_URL = 'https://myapp.com/api';

// ─── Register ───
async function register(data) {
  const res = await fetch(\`\${API_URL}/register\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (json.token) {
    localStorage.setItem('token', json.token);
  }
  return json;
}

// ─── Request dengan token ───
async function getProfil() {
  const token = localStorage.getItem('token');
  const res = await fetch(\`\${API_URL}/profil\`, {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Accept': 'application/json'
    }
  });
  return res.json();
}

// ─── Token scopes — batasi kemampuan token ───
// Di sisi server, buat token dengan scope tertentu:
$token = $user->createToken('mobile-app', ['lihat-produk', 'beli-produk'])->plainTextToken;

// Cek scope di controller:
if ($request->user()->tokenCan('beli-produk')) {
    // Boleh beli
}
\`\`\`

---

## 🚀 Deploy Laravel ke Production

\`\`\`bash
# ─── 1. Setup Server (Ubuntu + Nginx + PHP) ───

# Install PHP 8.2 dan ekstensi yang dibutuhkan
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-zip \\
     php8.2-mbstring php8.2-xml php8.2-curl php8.2-gd -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install nginx -y
\`\`\`

\`\`\`nginx
# /etc/nginx/sites-available/myapp.com

server {
    listen 80;
    server_name myapp.com www.myapp.com;
    root /var/www/myapp/public;  # Laravel public folder!

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.(?!well-known).* {
        deny all;  # Blokir akses ke file tersembunyi
    }
}
\`\`\`

\`\`\`bash
# ─── 2. Deploy kode ───
cd /var/www
git clone https://github.com/username/myapp.git
cd myapp

composer install --optimize-autoloader --no-dev
cp .env.example .env
php artisan key:generate

# Edit .env — isi database, mail, dll.
nano .env

# ─── 3. Setup permission ───
sudo chown -R www-data:www-data /var/www/myapp
sudo chmod -R 755 /var/www/myapp
sudo chmod -R 777 /var/www/myapp/storage
sudo chmod -R 777 /var/www/myapp/bootstrap/cache

# ─── 4. Setup database ───
php artisan migrate --force
php artisan db:seed --force

# ─── 5. Setup storage ───
php artisan storage:link

# ─── 6. Optimasi production ───
php artisan config:cache    # Cache konfigurasi
php artisan route:cache     # Cache route
php artisan view:cache      # Cache view Blade
php artisan event:cache     # Cache event listeners

# ─── 7. Setup Supervisor untuk queue worker ───
sudo apt install supervisor

# /etc/supervisor/conf.d/laravel-worker.conf
# [program:laravel-worker]
# process_name=%(program_name)s_%(process_num)02d
# command=php /var/www/myapp/artisan queue:work database --sleep=3 --tries=3
# autostart=true
# autorestart=true
# numprocs=2
# user=www-data

sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*

# ─── 8. SSL dengan Let's Encrypt ───
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d myapp.com -d www.myapp.com
\`\`\`

---

## 🔄 Zero-Downtime Deployment

\`\`\`bash
# Script deploy otomatis (simpan sebagai deploy.sh)
#!/bin/bash

echo "🚀 Deploying..."
cd /var/www/myapp

# Mode maintenance — user lihat halaman 503
php artisan down --render="errors::503" --retry=60

# Pull kode terbaru
git pull origin main

# Update dependencies
composer install --optimize-autoloader --no-dev

# Jalankan migration baru
php artisan migrate --force

# Clear dan rebuild cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart queue workers
php artisan queue:restart

# Matikan maintenance mode
php artisan up

echo "✅ Deploy selesai!"
\`\`\`

---

## 📊 Monitoring & Logging

\`\`\`php
// config/logging.php — sudah ada, tinggal konfigurasi

// Tulis log di kode
use Illuminate\\Support\\Facades\\Log;

Log::info('User login', ['user_id' => auth()->id()]);
Log::warning('Stok produk hampir habis', ['produk_id' => $produk->id, 'stok' => $produk->stok]);
Log::error('Gagal kirim email', ['error' => $e->getMessage()]);

// Laravel Telescope — debugging tool visual (untuk development)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

// Akses di: /telescope (hanya di local!)
\`\`\`

---

## 📝 Rangkuman Kursus Laravel Lengkap

| Modul | Topik |
|-------|-------|
| 1 | MVC, Routing, Blade, Artisan |
| 2 | Eloquent ORM, Migration, Seeder |
| 3 | Form, Validasi, Authentication |
| 4 | API, Blade Components, Cache, Best Practices |
| 5 | Relationships Lanjutan, Query Builder |
| 6 | Proyek Toko Online Mini |
| 7 | Middleware, Gates & Policies, Authorization |
| 8 | Testing (Unit & Feature), Factory |
| 9 | Storage, Notifications, Queue & Jobs |
| 10 | API Auth Sanctum, Deploy Production |

**Kamu sekarang bisa:**
- Membangun web app production-grade dengan Laravel
- Mengimplementasikan autentikasi dan otorisasi yang proper
- Menulis test untuk menjamin kualitas kode
- Deploy aplikasi Laravel ke server production
- Membangun REST API yang aman dengan Sanctum

> **Selamat menyelesaikan kursus Laravel! Kamu sudah punya skills yang sangat dicari industri!** 🎉🚀
`;
