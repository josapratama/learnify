export const iot_l14 = `
# Menggunakan SD Card dengan ESP32

SPIFFS yang kita pelajari sebelumnya cukup untuk menyimpan konfigurasi dan log kecil. Tapi kalau kamu butuh **data logger** yang bisa rekam ribuan data sensor selama berbulan-bulan — SPIFFS tidak cukup.

SD Card adalah solusinya. Dengan harga tambahan sekitar Rp 40-65 ribu, ESP32 bisa menyimpan data ke kartu yang kapasitasnya 4GB-32GB, dan kartu itu bisa dicabut langsung dibuka di komputer.

Ini yang membuat sensor monitoring cuaca, kualitas udara, atau kondisi mesin bisa bekerja mandiri selama berbulan-bulan, lalu datanya diambil cukup dengan mencabut kartu SD.

---

## 🔌 Koneksi via SPI

SD Card berkomunikasi via protokol SPI — 4 kabel data plus 1 kabel chip select:

\`\`\`
Modul SD Card       ESP32
─────────────       ──────
VCC         ──►     3.3V
GND         ──►     GND
MISO        ──►     GPIO 19
MOSI        ──►     GPIO 23
SCK         ──►     GPIO 18
CS          ──►     GPIO 5
\`\`\`

> 🔴 Periksa tegangan modul SD kamu — ada yang butuh 5V (ada regulator di modul), ada yang 3.3V langsung. Salah tegangan bisa merusak keduanya.

Sebelum dipakai, format SD Card ke **FAT32** dulu di komputer.

---

## 🛒 Yang Perlu Dibeli

| Komponen | Harga estimasi |
|----------|---------------|
| Modul Micro SD Card SPI | Rp 8.000 - 15.000 |
| Micro SD Card 4GB+ | Rp 25.000 - 50.000 |
| **Total tambahan** | **~Rp 40.000 - 65.000** |

---

## 🚀 Program Dasar: Inisialisasi & Info SD Card

\`\`\`cpp
/*
 * Program: Memulai SD Card & Tampilkan Informasi
 */

#include "FS.h"
#include "SD.h"
#include "SPI.h"

const int PIN_CS = 5; // Chip Select pin

void setup() {
  Serial.begin(115200);
  
  Serial.println("Memulai SD Card...");
  
  // Inisialisasi SD dengan pin CS yang ditentukan
  if (!SD.begin(PIN_CS)) {
    Serial.println("❌ Gagal membaca SD Card!");
    Serial.println("Kemungkinan penyebab:");
    Serial.println("  1. SD Card tidak terpasang");
    Serial.println("  2. Wiring salah");
    Serial.println("  3. Format SD Card bukan FAT32");
    Serial.println("  4. SD Card rusak");
    return;
  }
  
  Serial.println("✅ SD Card berhasil dibaca!");
  
  // Tampilkan tipe SD Card
  uint8_t tipeCard = SD.cardType();
  if      (tipeCard == CARD_MMC)  Serial.println("Tipe: MMC");
  else if (tipeCard == CARD_SD)   Serial.println("Tipe: SDSC");
  else if (tipeCard == CARD_SDHC) Serial.println("Tipe: SDHC");
  else                            Serial.println("Tipe: Tidak dikenal");
  
  // Kapasitas
  uint64_t ukuranCard = SD.cardSize() / (1024 * 1024);
  Serial.printf("Kapasitas SD Card: %lluMB\\n", ukuranCard);
  Serial.printf("Total ruang: %lluMB\\n", SD.totalBytes() / (1024 * 1024));
  Serial.printf("Terpakai   : %lluMB\\n", SD.usedBytes()  / (1024 * 1024));
}

void loop() {}
\`\`\`

---

## ✍️ Menulis & Membaca File di SD Card

\`\`\`cpp
// ================================
// Menulis File
// ================================
void tulisFile(const char* path, const char* isi) {
  File file = SD.open(path, FILE_WRITE);
  
  if (!file) {
    Serial.printf("❌ Gagal buka file: %s\\n", path);
    return;
  }
  
  file.println(isi);
  file.close();
  
  Serial.printf("✅ File ditulis: %s\\n", path);
}

// ================================
// Menambahkan ke File (Append)
// ================================
void tambahFile(const char* path, const char* isi) {
  File file = SD.open(path, FILE_APPEND);
  
  if (!file) {
    Serial.printf("❌ Gagal buka file: %s\\n", path);
    return;
  }
  
  file.println(isi);
  file.close();
}

// ================================
// Membaca File
// ================================
void bacaFile(const char* path) {
  File file = SD.open(path);
  
  if (!file) {
    Serial.printf("❌ File tidak ada: %s\\n", path);
    return;
  }
  
  Serial.printf("\\n=== Isi %s ===\\n", path);
  while (file.available()) {
    Serial.write(file.read());
  }
  file.close();
}

// ================================
// Buat Folder
// ================================
void buatFolder(const char* path) {
  if (SD.mkdir(path)) {
    Serial.printf("✅ Folder dibuat: %s\\n", path);
  } else {
    Serial.printf("⚠️ Folder gagal dibuat (mungkin sudah ada): %s\\n", path);
  }
}
\`\`\`

---

## 📊 Proyek Nyata: Data Logger Sensor

Ini adalah use case paling populer SD Card di IoT — merekam data sensor jangka panjang.

\`\`\`cpp
/*
 * Program: Data Logger Profesional dengan SD Card
 * Format CSV: Bisa langsung dibuka di Excel/Google Sheets
 * Struktur folder: /data/log_HARI.csv
 */

#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <DHT.h>

const int PIN_CS  = 5;
const int PIN_DHT = 4;
DHT dht(PIN_DHT, DHT22);

// Counter untuk simulasi waktu (ganti dengan RTC di proyek nyata)
unsigned long waktuDetik = 0;

// ========================
// Fungsi: Format nama file berdasarkan "hari"
// ========================
String getNamaFile() {
  // Di proyek nyata, gunakan RTC untuk tanggal sebenarnya
  // Contoh: /data/log_2024-01-15.csv
  long hari = (waktuDetik / 86400) + 1; // Hari ke berapa sejak nyala
  return "/data/log_hari_" + String(hari) + ".csv";
}

// ========================
// Fungsi: Tulis header CSV (sekali saat file baru)
// ========================
void tulisHeaderCSV(String namaFile) {
  if (!SD.exists(namaFile)) {
    File file = SD.open(namaFile, FILE_WRITE);
    if (file) {
      file.println("Waktu(s),Suhu(C),Kelembapan(%),Status");
      file.close();
      Serial.println("📄 File baru dibuat: " + namaFile);
    }
  }
}

// ========================
// Fungsi: Catat satu baris data
// ========================
void catatData(float suhu, float kelembapan) {
  String namaFile = getNamaFile();
  tulisHeaderCSV(namaFile);
  
  File file = SD.open(namaFile, FILE_APPEND);
  if (!file) {
    Serial.println("❌ Gagal buka file untuk log!");
    return;
  }
  
  // Tentukan status berdasarkan suhu
  String status = "Normal";
  if (suhu > 35.0)      status = "PANAS";
  else if (suhu < 18.0) status = "DINGIN";
  
  // Tulis baris CSV
  file.printf("%lu,%.1f,%.1f,%s\\n",
              waktuDetik, suhu, kelembapan, status.c_str());
  file.close();
  
  Serial.printf("📝 Log: %lus | %.1f°C | %.1f%% | %s\\n",
                waktuDetik, suhu, kelembapan, status.c_str());
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Inisialisasi SD
  if (!SD.begin(PIN_CS)) {
    Serial.println("❌ SD Card gagal! Sistem berhenti.");
    while (true) { delay(1000); } // Berhenti di sini
  }
  
  // Buat folder data jika belum ada
  if (!SD.exists("/data")) {
    SD.mkdir("/data");
    Serial.println("📁 Folder /data dibuat");
  }
  
  Serial.println("✅ Data Logger siap!");
  Serial.println("Data akan disimpan ke SD Card setiap 5 detik.");
}

void loop() {
  static unsigned long waktuTerakhir = 0;
  
  if (millis() - waktuTerakhir >= 5000) { // Setiap 5 detik
    waktuTerakhir = millis();
    waktuDetik = millis() / 1000;
    
    float suhu       = dht.readTemperature();
    float kelembapan = dht.readHumidity();
    
    if (isnan(suhu) || isnan(kelembapan)) {
      Serial.println("⚠️ Sensor error, skip logging");
      return;
    }
    
    catatData(suhu, kelembapan);
  }
}
\`\`\`

---

## 🌐 Bonus: SD Card sebagai Web Server File

\`\`\`cpp
/*
 * Sajikan file HTML dari SD Card via WiFi
 * ESP32 menjadi mini web server!
 */

#include <WiFi.h>
#include <WebServer.h>
#include "SD.h"

WebServer server(80);

void handleRoot() {
  // Baca file index.html dari SD Card
  File file = SD.open("/www/index.html");
  if (file) {
    server.streamFile(file, "text/html");
    file.close();
  } else {
    server.send(404, "text/plain", "File tidak ditemukan di SD Card");
  }
}

void setup() {
  SD.begin(5);
  
  WiFi.begin("WiFi", "Password");
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  server.on("/", handleRoot);
  server.begin();
  
  Serial.println("Web server aktif di: http://" + WiFi.localIP().toString());
}

void loop() {
  server.handleClient();
}
\`\`\`

---

## ⚖️ Perbandingan: SPIFFS vs SD Card

| Fitur | SPIFFS | SD Card |
|-------|--------|---------|
| Kapasitas | ~3MB | 4GB - 32GB+ |
| Kecepatan | Sedang | Lebih cepat |
| Koneksi | Built-in | 4 pin SPI + CS |
| Bisa dicabut? | Tidak | Ya ✅ |
| Buka di komputer? | Tidak | Ya ✅ |
| Harga tambahan | Gratis | ~Rp 40.000 |
| Cocok untuk | Config, log kecil | Log panjang, file media |

---

## ⚠️ Tips Penting

1. **Format FAT32** — SD Card di atas 32GB perlu diformat khusus
2. **Jangan cabut saat menulis** — bisa merusak file system
3. **Tambahkan kapasitor 100µF** di jalur 3.3V jika sering disconnect
4. **Batasi penulisan** — flash SD Card ada batas siklus ~10.000 - 100.000x per blok
5. **Gunakan SPI yang sama** dengan perangkat lain hati-hati — bisa konflik jika CS tidak dikelola benar

---

## 📝 Ringkasan

- SD Card menghubungkan via SPI: MOSI(23), MISO(19), SCK(18), CS(5)
- Format SD Card ke FAT32 sebelum digunakan
- \`SD.open(path, FILE_APPEND)\` untuk menambah data ke file
- Simpan dalam format CSV agar mudah dibuka di Excel
- SD Card = solusi terbaik untuk data logging jangka panjang

> **Di pelajaran berikutnya, kita belajar troubleshooting — cara mengatasi masalah hardware yang sering muncul!** 🔧
`;
