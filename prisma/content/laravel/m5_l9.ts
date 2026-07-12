export const laravel_l9 = `
# Storage, Notification & Queue — Kelola File dan Komunikasi

Tiga fitur ini yang sering dibutuhkan di hampir setiap aplikasi production: **menyimpan file upload**, **kirim notifikasi ke user**, dan **proses tugas berat di background**.

---

## 📁 Storage & File Upload

\`\`\`php
// Sebelum mulai, buat symlink agar file bisa diakses publik:
// php artisan storage:link

// ─── Upload File Dasar ───
public function uploadFoto(Request $request) {
    $request->validate([
        'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        // max:2048 = maksimal 2MB (dalam kilobytes)
    ]);

    // Cara 1: store() — nama file otomatis (UUID)
    $path = $request->file('foto')->store('foto-profil', 'public');
    // Disimpan ke: storage/app/public/foto-profil/randomhash.jpg
    // Bisa diakses via: /storage/foto-profil/randomhash.jpg

    // Cara 2: storeAs() — nama file custom
    $namaFile = auth()->id() . '_' . time() . '.jpg';
    $path = $request->file('foto')->storeAs('foto-profil', $namaFile, 'public');

    // Simpan path ke database
    auth()->user()->update(['foto' => $path]);

    return back()->with('sukses', 'Foto berhasil diperbarui!');
}

// Akses URL file di view
// {{ Storage::url($user->foto) }}
// atau: {{ asset('storage/' . $user->foto) }}

// ─── Hapus file lama saat upload baru ───
public function gantiGambarProduk(Request $request, Produk $produk) {
    $request->validate(['gambar' => 'required|image|max:2048']);

    // Hapus file lama kalau ada
    if ($produk->gambar) {
        Storage::disk('public')->delete($produk->gambar);
    }

    $path = $request->file('gambar')->store('produk', 'public');
    $produk->update(['gambar' => $path]);

    return back()->with('sukses', 'Gambar produk diperbarui!');
}
\`\`\`

---

## 📤 Upload Multiple Files

\`\`\`php
public function uploadGaleri(Request $request) {
    $request->validate([
        'foto.*' => 'image|mimes:jpg,jpeg,png|max:2048',  // * = setiap elemen array
        'foto'   => 'required|array|min:1|max:10',         // Min 1, max 10 foto
    ]);

    $paths = [];
    foreach ($request->file('foto') as $file) {
        $paths[] = $file->store('galeri', 'public');
    }

    // Simpan ke database (misalnya JSON atau tabel terpisah)
    $produk->update(['galeri' => json_encode($paths)]);

    return back()->with('sukses', count($paths) . ' foto berhasil diupload!');
}

// Di form HTML:
// <input type="file" name="foto[]" multiple accept="image/*">
\`\`\`

---

## 🔔 Notifications — Kirim Notifikasi ke User

\`\`\`bash
php artisan make:notification PesananDiproses
\`\`\`

\`\`\`php
// app/Notifications/PesananDiproses.php

namespace App\\Notifications;

use App\\Models\\Pesanan;
use Illuminate\\Notifications\\Notification;
use Illuminate\\Notifications\\Messages\\MailMessage;
use Illuminate\\Notifications\\Messages\\DatabaseMessage;

class PesananDiproses extends Notification {
    public function __construct(public Pesanan $pesanan) {}

    // Kirim lewat channel apa saja?
    public function via(object $notifiable): array {
        return ['mail', 'database'];
        // Channel tersedia: mail, database, broadcast, slack, vonage (SMS)
    }

    // Format untuk email
    public function toMail(object $notifiable): MailMessage {
        return (new MailMessage)
            ->subject('Pesanan #' . $this->pesanan->nomor . ' Sedang Diproses!')
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Pesananmu sedang diproses oleh tim kami.')
            ->line('Nomor Pesanan: **' . $this->pesanan->nomor . '**')
            ->line('Total: **Rp ' . number_format($this->pesanan->total, 0, ',', '.') . '**')
            ->action('Cek Status Pesanan', route('pesanan.show', $this->pesanan->id))
            ->line('Estimasi tiba: 2-3 hari kerja.')
            ->salutation('Terima kasih sudah berbelanja!');
    }

    // Format untuk database (in-app notification)
    public function toDatabase(object $notifiable): array {
        return [
            'pesanan_id'  => $this->pesanan->id,
            'nomor'       => $this->pesanan->nomor,
            'total'       => $this->pesanan->total,
            'pesan'       => 'Pesanan ' . $this->pesanan->nomor . ' sedang diproses',
            'url'         => route('pesanan.show', $this->pesanan->id),
        ];
    }
}
\`\`\`

\`\`\`php
// Kirim notifikasi
$user->notify(new PesananDiproses($pesanan));

// Atau: kirim ke banyak user sekaligus
Notification::send($users, new PromoSpesial($promo));

// Kirim ke guest (tidak perlu model User)
Notification::route('mail', 'tamu@email.com')
            ->notify(new KonfirmasiPesanan($pesanan));

// Ambil notifikasi di view
$notifikasi = auth()->user()->unreadNotifications;
// auth()->user()->notifications — semua notifikasi
// auth()->user()->unreadNotifications — belum dibaca

// Mark as read
$notifikasi->markAsRead();
auth()->user()->unreadNotifications->markAsRead();
\`\`\`

---

## 🔄 Queue & Jobs — Proses Background

\`\`\`bash
# Setup queue dengan database driver (simpel, tidak butuh Redis)
# .env: QUEUE_CONNECTION=database

php artisan queue:table
php artisan migrate

# Atau gunakan Redis untuk production (lebih cepat)
# .env: QUEUE_CONNECTION=redis
\`\`\`

\`\`\`bash
php artisan make:job ProsesImportProdukCSV
\`\`\`

\`\`\`php
// app/Jobs/ProsesImportProdukCSV.php

namespace App\\Jobs;

use App\\Models\\Produk;
use App\\Notifications\\ImportSelesai;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Queue\\Queueable;

class ProsesImportProdukCSV implements ShouldQueue {
    use Queueable;

    public int $timeout = 300;    // Maksimal 5 menit
    public int $tries = 3;         // Coba ulang maksimal 3x kalau gagal

    public function __construct(
        public string $filePath,
        public int $userId
    ) {}

    public function handle(): void {
        $baris = file($this->filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        array_shift($baris);  // Hapus header

        $sukses = 0;
        $gagal  = 0;

        foreach ($baris as $baris) {
            $kolom = str_getcsv($baris);
            try {
                Produk::create([
                    'nama'  => $kolom[0],
                    'harga' => (int) $kolom[1],
                    'stok'  => (int) $kolom[2],
                    'slug'  => str($kolom[0])->slug(),
                ]);
                $sukses++;
            } catch (\\Exception $e) {
                $gagal++;
                logger()->error("Import gagal: " . $e->getMessage());
            }
        }

        // Notifikasi setelah selesai
        $user = \\App\\Models\\User::find($this->userId);
        $user->notify(new ImportSelesai($sukses, $gagal));

        // Hapus file temp
        \\Storage::delete($this->filePath);
    }

    // Kalau job gagal setelah semua retry
    public function failed(\\Throwable $exception): void {
        logger()->error("Job gagal: " . $exception->getMessage());
        \\App\\Models\\User::find($this->userId)
                          ->notify(new ImportGagal($exception->getMessage()));
    }
}
\`\`\`

\`\`\`php
// Dispatch job ke queue
ProsesImportProdukCSV::dispatch($filePath, auth()->id());

// Dispatch dengan delay
ProsesImportProdukCSV::dispatch($path, $userId)->delay(now()->addMinutes(5));

// Dispatch ke queue tertentu
ProsesImportProdukCSV::dispatch($path, $userId)->onQueue('import');

// Jalankan queue worker
// php artisan queue:work              ← Proses terus
// php artisan queue:work --once       ← Proses satu job lalu berhenti
// php artisan queue:listen            ← Seperti work tapi auto-reload

// Monitor failed jobs
// php artisan queue:failed            ← Lihat yang gagal
// php artisan queue:retry all         ← Coba ulang semua yang gagal
\`\`\`

---

## ⏰ Scheduled Tasks (Cron)

\`\`\`php
// routes/console.php atau app/Console/Kernel.php

use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('produk:hapus-kadaluarsa')->daily();
Schedule::command('laporan:kirim-mingguan')->weekly()->mondays()->at('08:00');
Schedule::command('cache:clear')->everySixHours();

Schedule::call(function () {
    // Fungsi PHP biasa
    Produk::where('stok', 0)->update(['status' => 'nonaktif']);
})->dailyAt('00:00');

// Setup di server:
// Tambahkan satu crontab entry:
// * * * * * php /path/to/project/artisan schedule:run >> /dev/null 2>&1
\`\`\`

---

## ✅ Rangkuman

- \`php artisan storage:link\` — buat symlink agar file bisa diakses publik
- \`$request->file('input')->store('folder', 'public')\` — simpan file upload
- \`Storage::disk('public')->delete($path)\` — hapus file
- **Notifications**: kirim via mail + database (in-app) sekaligus
- \`$user->notify(new NamaNotifikasi())\` — kirim notifikasi
- \`$user->unreadNotifications\` — ambil notifikasi belum dibaca
- **Jobs + Queue**: tugas berat diproses di background
- \`JobClass::dispatch($param)\` — kirim job ke queue
- \`php artisan queue:work\` — jalankan worker di server

> **Pelajaran terakhir: API Authentication dengan Sanctum & Tips Deploy Production!** 🚀
`;
