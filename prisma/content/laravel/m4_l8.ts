export const laravel_l8 = `
# Testing di Laravel — Buktikan Kode Kamu Benar

Satu hal yang membedakan developer junior dari senior adalah kebiasaan menulis test. **Testing bukan buang waktu** — justru menghemat waktu di jangka panjang karena mendeteksi bug sebelum masuk production.

---

## 🤔 Kenapa Harus Testing?

Bayangkan kamu punya toko online. Tanpa test:
- Kamu update logika diskon
- Tidak sengaja rusak proses checkout
- User komplain karena tidak bisa bayar
- Kamu debug di tengah malam 😱

Dengan test:
- Setiap perubahan otomatis diverifikasi
- Bug terdeteksi **sebelum** deploy
- Kamu push kode dengan percaya diri

---

## 🧪 Jenis Test di Laravel

\`\`\`
Unit Test     — Test satu fungsi/method secara isolasi
Feature Test  — Test satu fitur/flow (HTTP request → response)
Integration Test — Test beberapa komponen berinteraksi
Browser Test  — Test UI di browser nyata (Laravel Dusk)
\`\`\`

---

## 🔧 Setup Testing

\`\`\`bash
# Laravel sudah include PHPUnit
# Cek file phpunit.xml di root project

# Jalankan semua test
php artisan test

# Jalankan test tertentu
php artisan test --filter=ProdukTest
php artisan test tests/Feature/ProdukTest.php

# Jalankan dengan detail
php artisan test --verbose

# Buat test file
php artisan make:test ProdukTest           # Feature test
php artisan make:test ProdukUnit --unit    # Unit test
\`\`\`

\`\`\`php
// phpunit.xml — pastikan pakai database testing (in-memory)
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>  ← Database sementara di RAM
    <env name="MAIL_MAILER" value="array"/>     ← Email tidak dikirim betulan
    <env name="CACHE_DRIVER" value="array"/>
</php>
\`\`\`

---

## 🧩 Feature Test — Test HTTP Request

\`\`\`php
// tests/Feature/ProdukTest.php

namespace Tests\\Feature;

use App\\Models\\Produk;
use App\\Models\\User;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class ProdukTest extends TestCase {
    use RefreshDatabase;  // Reset database setelah setiap test

    // ─── Test: Lihat daftar produk ───
    public function test_bisa_lihat_daftar_produk(): void {
        // Arrange: siapkan data
        Produk::factory(5)->create(['status' => 'aktif']);

        // Act: jalankan aksi
        $response = $this->get('/produk');

        // Assert: verifikasi hasil
        $response->assertStatus(200);
        $response->assertViewIs('produk.index');
        $response->assertViewHas('produk');
    }

    // ─── Test: User yang login bisa tambah produk ───
    public function test_user_admin_bisa_tambah_produk(): void {
        // Buat user admin
        $admin = User::factory()->create(['role' => 'admin']);

        // Login sebagai admin
        $response = $this->actingAs($admin)->post('/produk', [
            'nama'        => 'Laptop ASUS',
            'harga'       => 8500000,
            'stok'        => 10,
            'kategori_id' => 1,
        ]);

        // Redirect setelah sukses
        $response->assertRedirect('/produk');

        // Pastikan data masuk ke database
        $this->assertDatabaseHas('produk', [
            'nama'  => 'Laptop ASUS',
            'harga' => 8500000,
        ]);
    }

    // ─── Test: User biasa tidak bisa tambah produk ───
    public function test_user_biasa_tidak_bisa_tambah_produk(): void {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->post('/produk', [
            'nama'  => 'Laptop',
            'harga' => 5000000,
        ]);

        $response->assertStatus(403);   // Forbidden
    }

    // ─── Test: Guest tidak bisa akses halaman tambah produk ───
    public function test_guest_diredirect_ke_login(): void {
        $response = $this->get('/produk/create');

        $response->assertRedirect('/login');
    }

    // ─── Test: Validasi form ───
    public function test_validasi_gagal_kalau_nama_kosong(): void {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/produk', [
            'nama'  => '',     // Kosong!
            'harga' => 100000,
        ]);

        $response->assertSessionHasErrors(['nama']);
    }

    // ─── Test: Hapus produk ───
    public function test_admin_bisa_hapus_produk(): void {
        $admin   = User::factory()->create(['role' => 'admin']);
        $produk  = Produk::factory()->create();

        $response = $this->actingAs($admin)->delete("/produk/{$produk->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('produk', ['id' => $produk->id]);
    }
}
\`\`\`

---

## 🏭 Factory — Buat Data Dummy dengan Mudah

\`\`\`php
// database/factories/ProdukFactory.php

namespace Database\\Factories;

use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class ProdukFactory extends Factory {
    public function definition(): array {
        return [
            'nama'        => $this->faker->words(3, true),
            'slug'        => $this->faker->unique()->slug(),
            'deskripsi'   => $this->faker->paragraph(),
            'harga'       => $this->faker->numberBetween(50000, 10000000),
            'stok'        => $this->faker->numberBetween(0, 100),
            'status'      => $this->faker->randomElement(['aktif', 'nonaktif']),
            'kategori_id' => Kategori::factory(),   // Auto-buat kategori juga!
        ];
    }

    // State — variasi factory
    public function aktif(): static {
        return $this->state(['status' => 'aktif', 'stok' => 10]);
    }

    public function habis(): static {
        return $this->state(['stok' => 0]);
    }

    public function mahal(): static {
        return $this->state(['harga' => $this->faker->numberBetween(5000000, 20000000)]);
    }
}

// Penggunaan di test:
Produk::factory()->create();                    // Satu produk
Produk::factory(10)->create();                  // 10 produk
Produk::factory()->aktif()->create();           // Produk aktif
Produk::factory(3)->aktif()->mahal()->create(); // 3 produk aktif dan mahal
\`\`\`

---

## ⚙️ Unit Test — Test Logika Bisnis

\`\`\`php
// tests/Unit/HitungDiskonTest.php

namespace Tests\\Unit;

use App\\Services\\KeranjangService;
use PHPUnit\\Framework\\TestCase;

class HitungDiskonTest extends TestCase {
    private KeranjangService $service;

    protected function setUp(): void {
        parent::setUp();
        $this->service = new KeranjangService();
    }

    public function test_tidak_ada_diskon_kalau_di_bawah_100rb(): void {
        $result = $this->service->hitungDiskon(80000);
        $this->assertEquals(0, $result);
    }

    public function test_diskon_5_persen_antara_100rb_dan_200rb(): void {
        $result = $this->service->hitungDiskon(150000);
        $this->assertEquals(7500, $result);   // 5% dari 150000
    }

    public function test_diskon_10_persen_di_atas_200rb(): void {
        $result = $this->service->hitungDiskon(300000);
        $this->assertEquals(30000, $result);  // 10% dari 300000
    }

    public function test_diskon_tidak_lebih_dari_subtotal(): void {
        $result = $this->service->hitungDiskon(500000, persenDiskon: 110);  // 110%!
        $this->assertLessThanOrEqual(500000, $result);
    }

    // Data provider — test dengan banyak input sekaligus
    /**
     * @dataProvider providerDiskon
     */
    public function test_perhitungan_diskon(int $harga, int $ekspektasi): void {
        $result = $this->service->hitungDiskon($harga);
        $this->assertEquals($ekspektasi, $result);
    }

    public static function providerDiskon(): array {
        return [
            'tanpa diskon'      => [50000,  0],
            'diskon 5%'         => [150000, 7500],
            'diskon 10%'        => [300000, 30000],
            'tepat di batas'    => [200000, 10000],  // Tepat di 200rb
        ];
    }
}
\`\`\`

---

## 📧 Test Email, Queue, Storage

\`\`\`php
public function test_email_konfirmasi_terkirim_setelah_registrasi(): void {
    Mail::fake();   // Tidak kirim email betulan

    $response = $this->post('/register', [
        'name'                  => 'Budi',
        'email'                 => 'budi@test.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect('/dashboard');

    // Verifikasi email dikirim
    Mail::assertSent(WelcomeMail::class, function ($mail) {
        return $mail->hasTo('budi@test.com');
    });

    // Atau: Email di-queue (bukan langsung)
    // Mail::assertQueued(WelcomeMail::class);
}

public function test_foto_produk_bisa_diupload(): void {
    Storage::fake('public');   // Tidak simpan file betulan

    $admin = User::factory()->create(['role' => 'admin']);
    $foto  = UploadedFile::fake()->image('produk.jpg', 800, 600);

    $this->actingAs($admin)->post('/produk', [
        'nama'   => 'Test Produk',
        'harga'  => 100000,
        'gambar' => $foto,
    ]);

    // Verifikasi file ada di storage
    Storage::disk('public')->assertExists('produk/' . $foto->hashName());
}

public function test_job_masuk_queue_setelah_pesanan(): void {
    Queue::fake();

    $user = User::factory()->create();
    // ... proses pesanan ...

    Queue::assertPushed(KirimEmailKonfirmasi::class);
}
\`\`\`

---

## ✅ Rangkuman

- \`php artisan test\` — jalankan semua test
- \`use RefreshDatabase\` — reset DB setelah setiap test
- \`$this->get/post/put/delete()\` — simulasi HTTP request
- \`$this->actingAs($user)\` — login sebagai user tertentu
- \`assertStatus()\`, \`assertRedirect()\`, \`assertDatabaseHas()\` — verifikasi hasil
- **Factory**: buat data dummy dengan \`Model::factory()->create()\`
- **State**: variasi factory untuk kondisi berbeda
- **Mail::fake()**, **Storage::fake()**, **Queue::fake()** — mock service eksternal

> **Selanjutnya: Storage & File Upload — kelola file dan gambar di Laravel!** 🚀
`;
