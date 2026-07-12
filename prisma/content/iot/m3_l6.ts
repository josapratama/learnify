export const iot_l6 = `
# Sensor Analog: LDR, Potensiometer & DHT22

Di pelajaran sebelumnya kita baca sensor digital — cuma dua jawaban: ada atau tidak ada, gerak atau diam. Sekarang kita masuk ke sensor **analog** yang bisa memberikan nilai bervariasi.

Suhu 27.3°C. Cahaya 68%. Kelembapan 82%. Nilai-nilai seperti ini hanya bisa datang dari sensor analog.

---

## 🔢 ADC — Jembatan Analog ke Digital

ESP32 tidak langsung bisa "mengerti" tegangan analog. Dia perlu mengubahnya jadi angka dulu via **ADC (Analog-to-Digital Converter)**.

\`\`\`
Tegangan 0V    → ADC → 0
Tegangan 1.65V → ADC → ≈ 2048 (tengah-tengah)
Tegangan 3.3V  → ADC → 4095

Rumus: Tegangan = (bacaan_ADC / 4095.0) × 3.3V
\`\`\`

ESP32 punya ADC 12-bit artinya resolusi 4096 tingkat (0-4095). Cukup detail untuk hampir semua sensor.

**Pin yang mendukung ADC:** GPIO 32, 33, 34, 35, 36, 39.

---

## 🌓 Sensor Analog 1: LDR (Light Dependent Resistor)

LDR adalah **resistor yang nilainya berubah tergantung cahaya**.

**Analogi:** Seperti kacamata photochromic yang otomatis gelap di luar ruangan — LDR "bereaksi" terhadap cahaya.

**Cara kerja:**
- Cahaya terang → Resistansi kecil → Tegangan output kecil
- Cahaya redup → Resistansi besar → Tegangan output besar

### Rangkaian Voltage Divider untuk LDR

Untuk membaca LDR, kita perlu rangkaian **voltage divider** (pembagi tegangan):

\`\`\`
3.3V
  │
 [LDR]  ← Nilainya berubah dengan cahaya
  │
  ├──── GPIO 34 (baca di sini)
  │
[10kΩ]  ← Resistor tetap sebagai referensi
  │
 GND
\`\`\`

\`\`\`cpp
/*
 * Program: Sensor Cahaya LDR
 * Aksi   : Nyalakan LED otomatis saat gelap
 */

const int PIN_LDR = 34;   // GPIO 34 (input only, ADC)
const int PIN_LED = 2;    // GPIO 2 untuk LED

// Ambang batas: nilai ADC < ini dianggap gelap
// Sesuaikan dengan kondisi ruangan Anda!
const int BATAS_GELAP = 1500;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
  
  // ADC pin tidak perlu pinMode
  Serial.println("Sensor cahaya siap!");
}

void loop() {
  // Baca nilai ADC (0-4095)
  int nilaiLDR = analogRead(PIN_LDR);
  
  // Konversi ke tegangan (opsional, untuk logging)
  float tegangan = (nilaiLDR / 4095.0) * 3.3;
  
  // Konversi ke persentase cahaya (0-100%)
  // Nilai ADC tinggi = gelap (resistansi LDR besar)
  // Nilai ADC rendah = terang
  int persenCahaya = map(nilaiLDR, 0, 4095, 100, 0);
  
  Serial.print("ADC: ");
  Serial.print(nilaiLDR);
  Serial.print(" | Tegangan: ");
  Serial.print(tegangan, 2);
  Serial.print("V | Cahaya: ");
  Serial.print(persenCahaya);
  Serial.println("%");
  
  // Otomatis nyalakan LED saat gelap
  if (nilaiLDR < BATAS_GELAP) {
    digitalWrite(PIN_LED, HIGH);
    Serial.println("🌙 Gelap! LED menyala otomatis.");
  } else {
    digitalWrite(PIN_LED, LOW);
    Serial.println("☀️ Terang. LED mati.");
  }
  
  delay(500);
}
\`\`\`

**Fungsi \`map()\` — Sangat Berguna!**
\`map(nilai, dari_min, dari_max, ke_min, ke_max)\`
Mengubah skala nilai dari satu range ke range lain.
Contoh: \`map(2048, 0, 4095, 0, 100)\` → menghasilkan 50 (persen)

---

## 🎛️ Sensor Analog 2: Potensiometer

Potensiometer adalah **resistor yang bisa diatur nilainya** dengan memutar kenop.

**Analogi:** Volume pada radio tua — memutar kenop mengubah resistansi dan mengontrol keras/pelan suara.

**Koneksi:**
\`\`\`
Potensiometer 10kΩ:
  Pin kiri  → 3.3V
  Pin tengah → GPIO 32 (output yang berubah)
  Pin kanan → GND
\`\`\`

\`\`\`cpp
/*
 * Program: Potensiometer sebagai kontrol
 * Aksi   : Kontrol kecepatan kedip LED
 */

const int PIN_POT = 32;   // Potensiometer di GPIO 32
const int PIN_LED = 2;    // LED

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  // Baca nilai potensiometer (0-4095)
  int nilaiPot = analogRead(PIN_POT);
  
  // Ubah range 0-4095 menjadi delay 50-2000ms
  int delayMs = map(nilaiPot, 0, 4095, 50, 2000);
  
  // Kedipkan LED dengan kecepatan yang dikontrol potensiometer
  digitalWrite(PIN_LED, HIGH);
  delay(delayMs);
  digitalWrite(PIN_LED, LOW);
  delay(delayMs);
  
  Serial.print("Pot: ");
  Serial.print(nilaiPot);
  Serial.print(" → Delay: ");
  Serial.print(delayMs);
  Serial.println("ms");
}
\`\`\`

---

## 🌡️ Sensor Suhu & Kelembapan: DHT22

DHT22 adalah sensor **suhu dan kelembapan** yang sangat populer untuk proyek IoT.

**Kenapa DHT22, bukan DHT11?**
| | DHT11 | DHT22 |
|--|-------|-------|
| Suhu | 0-50°C | -40 hingga 80°C |
| Akurasi Suhu | ±2°C | ±0.5°C |
| Kelembapan | 20-90% | 0-100% |
| Harga | ~Rp 15.000 | ~Rp 30.000 |

Untuk Indonesia (tropis), DHT22 lebih akurat dan direkomendasikan.

### Install Library DHT

1. Buka \`Sketch\` → \`Include Library\` → \`Manage Libraries\`
2. Cari **"DHT sensor library"** by Adafruit
3. Klik **Install** (install dependencies jika diminta)

### Koneksi DHT22

\`\`\`
DHT22 (dari kiri ke kanan, saat menghadap Anda):
  Pin 1 (VCC) → 3.3V ESP32
  Pin 2 (DATA) → GPIO 4 ESP32 + Resistor 10kΩ ke 3.3V
  Pin 3 (NC)   → Tidak digunakan
  Pin 4 (GND)  → GND ESP32
\`\`\`

\`\`\`cpp
/*
 * Program: Monitor Suhu & Kelembapan DHT22
 * Library : DHT sensor library by Adafruit
 */

#include <DHT.h>

const int PIN_DHT = 4;      // GPIO 4
const int TIPE_DHT = DHT22; // Tipe sensor

DHT dht(PIN_DHT, TIPE_DHT); // Buat objek sensor

void setup() {
  Serial.begin(115200);
  dht.begin(); // Inisialisasi sensor
  
  Serial.println("Monitor Suhu & Kelembapan");
  Serial.println("===========================");
}

void loop() {
  // Tunggu sebentar antara pembacaan (minimum 2 detik untuk DHT22)
  delay(2000);
  
  // Baca data dari sensor
  float kelembapan = dht.readHumidity();
  float suhu_C    = dht.readTemperature();       // Celsius
  float suhu_F    = dht.readTemperature(true);   // Fahrenheit
  
  // Cek apakah pembacaan gagal
  if (isnan(kelembapan) || isnan(suhu_C)) {
    Serial.println("❌ Gagal membaca DHT22! Cek koneksi kabel.");
    return; // Kembali ke awal loop
  }
  
  // Hitung Heat Index (rasa panas yang dirasakan tubuh)
  float heatIndex_C = dht.computeHeatIndex(suhu_C, kelembapan, false);
  
  // Tampilkan hasil
  Serial.println("╔══════════════════════╗");
  Serial.print("║ Suhu     : ");
  Serial.print(suhu_C, 1);
  Serial.println(" °C        ║");
  
  Serial.print("║ Kelembapan: ");
  Serial.print(kelembapan, 1);
  Serial.println(" %         ║");
  
  Serial.print("║ Terasa   : ");
  Serial.print(heatIndex_C, 1);
  Serial.println(" °C        ║");
  Serial.println("╚══════════════════════╝");
  
  // Peringatan kondisi ekstrem
  if (suhu_C > 35) {
    Serial.println("🔥 PANAS SEKALI! Hidupkan AC!");
  } else if (suhu_C < 20) {
    Serial.println("🥶 DINGIN! Pakai jaket.");
  }
  
  if (kelembapan > 80) {
    Serial.println("💧 Kelembapan tinggi — risiko jamur!");
  }
}
\`\`\`

---

## 📊 Perbandingan Sensor Analog Populer

| Sensor | Ukur | Akurasi | Harga | Antarmuka |
|--------|------|---------|-------|-----------|
| LDR | Cahaya (%) | Rendah | Rp 2.000 | Analog |
| DHT22 | Suhu & Lembap | Baik | Rp 30.000 | Digital 1-Wire |
| BMP280 | Suhu & Tekanan | Sangat baik | Rp 15.000 | I2C/SPI |
| DS18B20 | Suhu (tahan air) | Sangat baik | Rp 25.000 | 1-Wire |
| MQ-2 | Gas/Asap | Sedang | Rp 20.000 | Analog |

---

## 📝 Ringkasan

- Sensor analog membaca nilai kontinu (bukan hanya 0/1)
- \`analogRead(pin)\` menghasilkan nilai 0-4095 pada ESP32
- \`map()\` berguna untuk mengubah skala nilai
- LDR untuk otomatisasi lampu berdasar cahaya
- Potensiometer untuk input yang bisa diatur manual
- DHT22 untuk monitoring suhu & kelembapan (cocok untuk Indonesia!)

> **Selanjutnya kita masuk ke bagian paling menarik — menghubungkan ESP32 ke WiFi!** 📡
`;
