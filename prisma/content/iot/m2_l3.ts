export const iot_l3 = `
# Setup Arduino IDE & Persiapan Pemrograman ESP32

Sebelum mulai coding, ada satu langkah yang tidak bisa dilewati: menyiapkan "dapur" kita dulu. Kalau kamu skip bagian ini atau setup-nya salah, nanti mau nulis kode sepintar apapun tidak akan berjalan.

Jadi, santai saja, ikuti langkah per langkah, dan di akhir nanti LED di ESP32 kamu akan berkedip — itu tandanya kita siap!

## 📥 Langkah 1: Download Arduino IDE

1. Buka browser, kunjungi **https://www.arduino.cc/en/software**
2. Pilih **"Arduino IDE 2.x"** (versi terbaru)
3. Klik sesuai sistem operasi kamu
4. Klik **"Just Download"** — tidak perlu donasi kalau belum mau
5. Install seperti aplikasi biasa

> ⏱️ File sekitar 150MB, siapkan koneksi yang stabil.

---

## 🔌 Langkah 2: Install Driver USB — Jangan Dilewati!

Ini langkah yang **paling sering dilewati**, dan biasanya menjadi penyebab ESP32 tidak terdeteksi komputer.

Kebanyakan modul ESP32 menggunakan chip USB-to-Serial. Lihat tulisan kecil pada chip dekat port USB di board ESP32 kamu:

**Chip CP2102 (tulisan "CP210x"):**
- Download dari: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

**Chip CH340 (tulisan "CH340" atau "CH341"):**
- Download dari: https://sparks.gogo.co.nz/ch340.html

Setelah download, ekstrak dan jalankan installer-nya. Cukup itu.

---

## ⚙️ Langkah 3: Tambahkan Board ESP32 ke Arduino IDE

Secara default, Arduino IDE hanya mengenal board Arduino (Uno, Mega, dll). Kita perlu "memberitahu" IDE tentang ESP32.

### 3a. Buka Preferences
- Windows/Linux: \`File\` → \`Preferences\`
- macOS: \`Arduino IDE\` → \`Preferences\`

### 3b. Tambahkan URL Board Manager
Di kolom **"Additional boards manager URLs"**, masukkan URL ini:

\`\`\`
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
\`\`\`

Klik **OK**.

### 3c. Install Board ESP32
1. Buka \`Tools\` → \`Board\` → \`Boards Manager\`
2. Di kolom pencarian, ketik **"esp32"**
3. Cari yang dari **"Espressif Systems"** (bukan yang lain!)
4. Klik **"Install"** — tunggu sampai selesai (~500MB)

> ☕ Sambil menunggu download, ambil kopi dulu — bisa 5-15 menit tergantung koneksi!

---

## 🔗 Langkah 4: Hubungkan ESP32 ke Komputer

1. Ambil **kabel micro USB** (pastikan kabel data, bukan hanya kabel charger!)
2. Hubungkan ke ESP32, lalu ke komputer
3. LED merah pada ESP32 akan menyala (tanda sudah mendapat daya)

### Pilih Board yang Tepat:
- Buka \`Tools\` → \`Board\` → \`ESP32 Arduino\`
- Pilih **"DOIT ESP32 DEVKIT V1"** (untuk board 30-pin standar)
- Jika board Anda berbeda, pilih yang paling mirip

### Pilih Port:
- Buka \`Tools\` → \`Port\`
- Pilih port yang muncul:
  - Windows: \`COM3\`, \`COM4\`, atau angka lain
  - macOS: \`/dev/cu.SLAB_USBtoUART\`
  - Linux: \`/dev/ttyUSB0\`

> ❓ **Port tidak muncul?** Coba: restart Arduino IDE, ganti kabel USB, atau reinstall driver.

---

## ✅ Langkah 5: Test — Upload Program Pertama

Sekarang test apakah semuanya berfungsi. Kita pakai program "Blink" — menyalakan dan mematikan LED bawaan ESP32. Program paling sederhana yang ada, tapi kalau ini berhasil, kamu resmi sudah siap.

1. Buka \`File\` → \`Examples\` → \`01.Basics\` → \`Blink\`
2. Program ini akan terbuka:

\`\`\`cpp
// setup() dijalankan SEKALI saat ESP32 pertama nyala
// Gunakan untuk inisialisasi: set pin, mulai komunikasi, dll.
void setup() {
  // LED_BUILTIN = pin LED bawaan di board ESP32 (biasanya GPIO 2)
  // OUTPUT = kita akan mengendalikan pin ini (kirim sinyal)
  pinMode(LED_BUILTIN, OUTPUT);
}

// loop() dijalankan TERUS-MENERUS selamanya
// Seperti while(true) yang tidak pernah berhenti
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // Nyalakan LED
  delay(1000);                        // Tunggu 1 detik (1000 ms)
  digitalWrite(LED_BUILTIN, LOW);    // Matikan LED
  delay(1000);                        // Tunggu 1 detik lagi
}
\`\`\`

3. Klik tombol **Upload** (panah ke kanan ➡️) atau tekan \`Ctrl+U\`
4. Tunggu "Done uploading" muncul di bawah
5. LED kecil di ESP32 akan berkedip setiap 1 detik! 🎉

**Selamat, setup kamu berhasil!**

---

## 🐛 Troubleshooting Umum

### Problem: "Failed to connect to ESP32"
**Solusi:**
- Tekan dan tahan tombol **BOOT** pada ESP32 saat klik Upload
- Lepaskan setelah muncul "Connecting..."

### Problem: "Port COM tidak muncul"
**Solusi:**
- Ganti kabel USB (banyak kabel yang hanya untuk charging)
- Reinstall driver
- Coba port USB yang berbeda di komputer

### Problem: Upload lambat / stuck di 0%
**Solusi:**
- Kurangi kecepatan upload: \`Tools\` → \`Upload Speed\` → pilih \`115200\`

---

## 🧩 Struktur Program Arduino — Dua Bagian Wajib

Setiap program Arduino/ESP32 selalu punya dua fungsi ini. Tidak ada pengecualian:

\`\`\`cpp
// Bagian 1: setup() — dijalankan SEKALI saat ESP32 pertama nyala
// Gunakan untuk inisialisasi: set pin, mulai Serial, koneksi WiFi, dll.
void setup() {
  // Kode di sini hanya jalan sekali
}

// Bagian 2: loop() — dijalankan TERUS-MENERUS selamanya
// Ini "jantung" program kamu
void loop() {
  // Kode di sini jalan berulang tanpa henti
}
\`\`\`

**Cara mudah mengingatnya:**
- \`setup()\` = briefing pagi sebelum kerja (sekali saja)
- \`loop()\` = pekerjaan harian yang terus berulang sepanjang hari

---

## � Troubleshooting — Kalau Ada yang Tidak Beres

**"Failed to connect to ESP32"**
→ Tekan dan tahan tombol **BOOT** pada ESP32 saat klik Upload, lepaskan setelah muncul "Connecting..."

**"Port COM tidak muncul"**
→ Coba ganti kabel USB (banyak kabel yang hanya untuk charging, tidak untuk data), reinstall driver, atau coba port USB lain.

**Upload sangat lambat atau stuck di 0%**
→ Kurangi kecepatan: \`Tools\` → \`Upload Speed\` → pilih \`115200\`

---

## 📝 Checklist Setup

Pastikan semua centang sebelum lanjut:

- ✅ Arduino IDE 2.x terinstall
- ✅ Driver USB (CP210x atau CH340) terinstall  
- ✅ ESP32 board package terinstall dari Boards Manager
- ✅ Board "DOIT ESP32 DEVKIT V1" dipilih
- ✅ Port COM yang benar dipilih
- ✅ Program Blink berhasil diupload dan LED berkedip

> **Semua centang? Lanjut ke pelajaran berikutnya! Kita akan menulis program LED dari nol dan memahami setiap barisnya.** 💡
`;
