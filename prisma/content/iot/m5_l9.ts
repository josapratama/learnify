export const iot_l9 = `
# Setup Blynk IoT — Kontrol ESP32 dari HP dalam Hitungan Menit

Kalau kamu sudah bisa kirim data via MQTT, itu sudah hebat. Tapi jujur — bikin aplikasi HP sendiri untuk tampilkan data dan kontrol ESP32 itu kompleks.

Blynk menjawab masalah ini: mereka sudah sediakan aplikasinya, kamu tinggal konfigurasi. Drag widget ke dashboard, hubungkan ke "virtual pin", selesai. Tidak perlu belajar Flutter atau React Native.

---

## 🌟 Apa yang Blynk Sediakan

- **Aplikasi mobile** (Android & iOS) dengan widget siap pakai
- **Cloud server** sebagai jembatan HP ↔ ESP32
- **Dashboard web** untuk monitoring dari komputer
- **Notifikasi push** ke HP saat kondisi tertentu terpenuhi
- **Gratis** untuk proyek pribadi kecil (batas 5 device, 2000 event/hari)

---

## 🚀 Setup Akun & Project di Blynk

### Buat Akun
1. Buka **blynk.cloud**
2. Sign Up dengan email kamu
3. Verifikasi email

### Buat Template
Template adalah "blueprint" untuk satu jenis device:

1. Dashboard → **Developer Zone** → **My Templates**
2. **+ New Template** → Name: "Smart Monitor", Hardware: ESP32, Connection: WiFi
3. Save

### Buat Datastream (Virtual Pins)

Di halaman Template → tab **Datastreams** → **+ New Datastream** → Virtual Pin:

| Nama | Pin | Tipe | Min | Max |
|------|-----|------|-----|-----|
| Suhu | V0 | Double | -40 | 80 |
| Kelembapan | V1 | Double | 0 | 100 |
| LED Control | V2 | Integer | 0 | 1 |
| Status | V3 | String | — | — |

### Buat Device
1. Dashboard → **+ New Device** → From Template → pilih template tadi
2. Beri nama: "ESP32 Rumah"
3. **Catat BLYNK_TEMPLATE_ID, BLYNK_TEMPLATE_NAME, dan BLYNK_AUTH_TOKEN** yang muncul!

---

## 📲 Setup Aplikasi di HP

1. Download **Blynk IoT** dari Play Store / App Store
2. Login dengan akun yang sama
3. Buka device → klik ikon edit (pensil)
4. Tambahkan widget:
   - **Gauge** → hubungkan ke V0 (Suhu)
   - **Gauge** → hubungkan ke V1 (Kelembapan)
   - **Button** (Switch mode) → hubungkan ke V2 (LED)
   - **Label** → hubungkan ke V3 (Status)
   - **SuperChart** → tambahkan V0 + V1 untuk grafik riwayat

---

## 💻 Program ESP32 + Blynk

### Install Library
Library Manager → cari **"Blynk"** by Volodymyr Shymanskyy → Install

\`\`\`cpp
/*
 * Program: ESP32 + Blynk IoT
 * Fungsi : Monitor suhu & kontrol LED dari HP
 * 
 * GANTI credentials di bawah ini dengan milik Anda!
 */

// ========================================
// WAJIB: Isi dari Blynk Dashboard
// ========================================
#define BLYNK_TEMPLATE_ID   "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "Smart Home Monitor"
#define BLYNK_AUTH_TOKEN    "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

// Definisi ini HARUS sebelum #include Blynk!
#define BLYNK_PRINT Serial   // Print debug ke Serial Monitor

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>

// WiFi
const char* WIFI_SSID     = "Nama_WiFi";
const char* WIFI_PASSWORD = "Password";

// Sensor
const int PIN_DHT = 4;
const int PIN_LED = 2;
DHT dht(PIN_DHT, DHT22);

// Timer untuk kirim data berkala
BlynkTimer timer;

// ======================================
// BLYNK_WRITE — Terima perintah dari HP
// ======================================
// Dipanggil otomatis saat widget V2 diubah di HP
BLYNK_WRITE(V2) {
  int nilaiSwitch = param.asInt(); // 0 atau 1
  
  if (nilaiSwitch == 1) {
    digitalWrite(PIN_LED, HIGH);
    Blynk.virtualWrite(V3, "💡 LED Nyala");
    Serial.println("📱 HP: LED Nyala!");
  } else {
    digitalWrite(PIN_LED, LOW);
    Blynk.virtualWrite(V3, "⚫ LED Mati");
    Serial.println("📱 HP: LED Mati!");
  }
}

// ======================================
// Fungsi kirim data sensor
// ======================================
void kirimDataSensor() {
  float suhu       = dht.readTemperature();
  float kelembapan = dht.readHumidity();
  
  if (isnan(suhu) || isnan(kelembapan)) {
    Serial.println("❌ Error baca sensor!");
    return;
  }
  
  // Kirim ke Virtual Pin Blynk
  Blynk.virtualWrite(V0, suhu);
  Blynk.virtualWrite(V1, kelembapan);
  
  // Update status text
  char status[50];
  sprintf(status, "Suhu: %.1f°C | Lembap: %.1f%%", suhu, kelembapan);
  Blynk.virtualWrite(V3, status);
  
  Serial.println(status);
  
  // Kirim notifikasi jika suhu terlalu tinggi
  if (suhu > 35) {
    Blynk.logEvent("suhu_tinggi", String("⚠️ Suhu: ") + suhu + "°C");
  }
}

// ======================================
// BLYNK_CONNECTED — Saat terhubung ke cloud
// ======================================
BLYNK_CONNECTED() {
  Serial.println("✅ Terhubung ke Blynk Cloud!");
  
  // Sync semua virtual pin dari server
  // (restore state terakhir yang tersimpan di cloud)
  Blynk.syncAll();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
  dht.begin();
  
  // Hubungkan ke Blynk (otomatis handle WiFi juga)
  Blynk.begin(BLYNK_AUTH_TOKEN, WIFI_SSID, WIFI_PASSWORD);
  
  // Setup timer: kirim data setiap 5 detik
  timer.setInterval(5000L, kirimDataSensor);
  
  Serial.println("=== Blynk IoT Siap! ===");
}

void loop() {
  Blynk.run(); // Proses semua komunikasi Blynk (WAJIB!)
  timer.run(); // Proses semua timer (WAJIB!)
}
\`\`\`

---

## 📊 Memahami Virtual Pins

Virtual Pin (V0, V1, V2, dst.) adalah "saluran komunikasi" antara ESP32 dan aplikasi Blynk. Tidak ada pin fisik yang terlibat — ini murni data digital.

\`\`\`
[HP - Widget Gauge]  ←──── V0 ────  [ESP32 kirim suhu]
[HP - Widget Gauge]  ←──── V1 ────  [ESP32 kirim kelembapan]
[HP - Widget Button] ────  V2 ────► [ESP32 terima perintah LED]
[HP - Widget Label]  ←──── V3 ────  [ESP32 kirim status teks]
\`\`\`

---

## 🔔 Sistem Notifikasi

Blynk bisa kirim **push notification** ke HP saat kondisi tertentu terjadi:

1. Di Blynk Dashboard → **"Events"** → **"+ New Event"**
2. Buat event:
   - **Name:** "suhu_tinggi"
   - **Description:** "Suhu melebihi batas aman"
   - **Type:** Warning
   - **Send notification:** Yes

Di program ESP32:
\`\`\`cpp
// Kirim event (nama event harus sama persis)
Blynk.logEvent("suhu_tinggi");

// Dengan keterangan tambahan
Blynk.logEvent("suhu_tinggi", "Suhu saat ini: 38°C!");
\`\`\`

---

## 📝 Ringkasan

- Blynk = platform IoT lengkap dengan aplikasi mobile dan cloud
- Template → Datastream → Device adalah urutan setup
- \`BLYNK_WRITE(Vx)\` dipanggil saat widget diubah dari HP
- \`Blynk.virtualWrite(Vx, data)\` untuk kirim data ke HP
- \`BlynkTimer\` untuk jadwal pengiriman data berkala
- \`Blynk.logEvent()\` untuk notifikasi push ke HP

> **Di pelajaran berikutnya, kita akan menggabungkan semua yang dipelajari menjadi Proyek Smart Home lengkap!** 🏠
`;
