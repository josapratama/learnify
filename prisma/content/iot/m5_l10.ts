export const iot_l10 = `
# Proyek Akhir: Smart Home Dashboard

Ini dia yang kamu tunggu-tunggu — semua yang sudah dipelajari disatukan dalam satu proyek nyata.

Monitor suhu dan kelembapan ruangan. Kontrol lampu dari HP. Notifikasi otomatis saat ada gerakan. Semua dalam satu sistem yang kamu bangun sendiri dari nol.

---

## 📦 Yang Diperlukan

| Komponen | Jumlah | Estimasi Harga |
|----------|--------|----------------|
| ESP32 DevKit V1 | 1 | Rp 50.000 |
| Sensor DHT22 | 1 | Rp 30.000 |
| Sensor PIR HC-SR501 | 1 | Rp 20.000 |
| LED merah | 1 | Rp 500 |
| LED biru | 1 | Rp 500 |
| Resistor 220Ω | 2 | Rp 500 |
| Resistor 10kΩ | 1 | Rp 200 |
| Breadboard | 1 | Rp 15.000 |
| Kabel jumper | 1 set | Rp 15.000 |
| **Total** | | **~Rp 132.000** |

---

## 🔌 Diagram Rangkaian Lengkap

\`\`\`
ESP32 DevKit V1
     │
     ├─ GPIO 4  ──── DHT22 Data (+ Resistor 10kΩ ke 3.3V)
     │
     ├─ GPIO 5  ──── PIR HC-SR501 OUT
     │
     ├─ GPIO 2  ──── Resistor 220Ω ──── LED Merah (+) ──── GND
     │
     ├─ GPIO 15 ──── Resistor 220Ω ──── LED Biru (+) ──── GND
     │
     ├─ 3.3V   ──── DHT22 VCC
     │
     ├─ 5V     ──── PIR VCC
     │
     └─ GND    ──── DHT22 GND, PIR GND, LED GND (semua ground)
\`\`\`

---

## 💻 Program Smart Home Lengkap

\`\`\`cpp
/*
 * ╔══════════════════════════════════════════╗
 * ║     SMART HOME DASHBOARD - ESP32         ║
 * ║     Kursus IoT EduTech                   ║
 * ╚══════════════════════════════════════════╝
 * 
 * Fitur:
 * - Monitor suhu & kelembapan (DHT22)
 * - Deteksi gerak (PIR) dengan notifikasi
 * - Kontrol 2 LED dari HP (Blynk)
 * - Grafik data di dashboard Blynk
 * - Alarm suhu tinggi
 */

// ============================
// KONFIGURASI - WAJIB DIUBAH!
// ============================
#define BLYNK_TEMPLATE_ID   "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "Smart Home"
#define BLYNK_AUTH_TOKEN    "xxxxxxxxxxxxxxxx"
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>

const char* WIFI_SSID     = "Nama_WiFi_Anda";
const char* WIFI_PASSWORD = "Password_Anda";

// ============================
// DEFINISI PIN
// ============================
#define PIN_DHT      4    // DHT22 data
#define PIN_PIR      5    // PIR sensor
#define PIN_LED_MERAH 2   // LED merah (ruang tamu)
#define PIN_LED_BIRU  15  // LED biru (kamar)

// ============================
// VIRTUAL PINS BLYNK
// ============================
#define VPIN_SUHU        V0
#define VPIN_KELEMBAPAN  V1
#define VPIN_LED_MERAH   V2
#define VPIN_LED_BIRU    V3
#define VPIN_GERAK       V4
#define VPIN_STATUS      V5
#define VPIN_COUNTER     V6  // Hitung berapa kali gerak terdeteksi

// ============================
// VARIABEL GLOBAL
// ============================
DHT dht(PIN_DHT, DHT22);
BlynkTimer timer;

bool statusLEDMerah = false;
bool statusLEDBiru  = false;
int  hitungGerak    = 0;
unsigned long waktuGerakTerakhir = 0;
const unsigned long COOLDOWN_PIR = 10000; // 10 detik cooldown

// ======================================
// BLYNK_WRITE — Kontrol dari HP
// ======================================
BLYNK_WRITE(VPIN_LED_MERAH) {
  statusLEDMerah = param.asInt();
  digitalWrite(PIN_LED_MERAH, statusLEDMerah);
  Serial.printf("📱 LED Merah: %s\\n", statusLEDMerah ? "Nyala" : "Mati");
}

BLYNK_WRITE(VPIN_LED_BIRU) {
  statusLEDBiru = param.asInt();
  digitalWrite(PIN_LED_BIRU, statusLEDBiru);
  Serial.printf("📱 LED Biru: %s\\n", statusLEDBiru ? "Nyala" : "Mati");
}

// ======================================
// Fungsi: Baca dan Kirim Data Sensor
// ======================================
void updateDataSensor() {
  float suhu       = dht.readTemperature();
  float kelembapan = dht.readHumidity();
  
  if (isnan(suhu) || isnan(kelembapan)) {
    Blynk.virtualWrite(VPIN_STATUS, "❌ Error sensor DHT22");
    return;
  }
  
  // Kirim ke Blynk
  Blynk.virtualWrite(VPIN_SUHU,       suhu);
  Blynk.virtualWrite(VPIN_KELEMBAPAN, kelembapan);
  
  // Buat pesan status
  String status = "🌡 " + String(suhu, 1) + "°C | ";
  status += "💧 " + String(kelembapan, 1) + "% | ";
  status += "🚶 " + String(hitungGerak) + "x gerak";
  Blynk.virtualWrite(VPIN_STATUS, status);
  
  Serial.println(status);
  
  // === Logika Alarm Suhu ===
  if (suhu >= 38) {
    Blynk.logEvent("suhu_kritis", "🔥 Suhu " + String(suhu, 1) + "°C - Sangat Panas!");
    // Kedipkan semua LED sebagai alarm
    for (int i = 0; i < 5; i++) {
      digitalWrite(PIN_LED_MERAH, HIGH);
      digitalWrite(PIN_LED_BIRU, HIGH);
      delay(200);
      digitalWrite(PIN_LED_MERAH, LOW);
      digitalWrite(PIN_LED_BIRU, LOW);
      delay(200);
    }
    // Kembalikan ke status sebelumnya
    digitalWrite(PIN_LED_MERAH, statusLEDMerah);
    digitalWrite(PIN_LED_BIRU, statusLEDBiru);
    
  } else if (suhu >= 35) {
    Blynk.logEvent("suhu_tinggi", "⚠️ Suhu " + String(suhu, 1) + "°C");
  }
}

// ======================================
// Fungsi: Deteksi Gerak PIR
// ======================================
void cekGerak() {
  bool adaGerak = digitalRead(PIN_PIR);
  unsigned long sekarang = millis();
  
  if (adaGerak && (sekarang - waktuGerakTerakhir > COOLDOWN_PIR)) {
    waktuGerakTerakhir = sekarang;
    hitungGerak++;
    
    Serial.printf("🚶 Gerak terdeteksi! Total: %d kali\\n", hitungGerak);
    
    // Update Blynk
    Blynk.virtualWrite(VPIN_GERAK, 1);
    Blynk.virtualWrite(VPIN_COUNTER, hitungGerak);
    
    // Kirim notifikasi (logEvent)
    Blynk.logEvent("gerak_terdeteksi",
      "🚨 Ada gerakan! (Ke-" + String(hitungGerak) + ")");
    
    // LED biru berkedip singkat sebagai indikasi
    for (int i = 0; i < 3; i++) {
      digitalWrite(PIN_LED_BIRU, HIGH); delay(100);
      digitalWrite(PIN_LED_BIRU, LOW);  delay(100);
    }
    digitalWrite(PIN_LED_BIRU, statusLEDBiru); // Kembalikan status
    
  } else if (!adaGerak) {
    Blynk.virtualWrite(VPIN_GERAK, 0);
  }
}

// ======================================
// BLYNK_CONNECTED — Saat reconnect
// ======================================
BLYNK_CONNECTED() {
  Serial.println("✅ Terhubung ke Blynk!");
  Blynk.syncAll(); // Sync status dari server
}

void setup() {
  Serial.begin(115200);
  Serial.println("\\n=== Smart Home Booting... ===");
  
  // Setup pin
  pinMode(PIN_LED_MERAH, OUTPUT);
  pinMode(PIN_LED_BIRU, OUTPUT);
  pinMode(PIN_PIR, INPUT);
  
  // Test LED saat startup
  Serial.println("Test LED...");
  digitalWrite(PIN_LED_MERAH, HIGH); delay(500);
  digitalWrite(PIN_LED_BIRU, HIGH);  delay(500);
  digitalWrite(PIN_LED_MERAH, LOW);
  digitalWrite(PIN_LED_BIRU, LOW);
  
  // Inisialisasi sensor
  dht.begin();
  
  // Koneksi Blynk (+ WiFi otomatis)
  Serial.println("Menghubungkan ke Blynk...");
  Blynk.begin(BLYNK_AUTH_TOKEN, WIFI_SSID, WIFI_PASSWORD);
  
  // Setup timer
  timer.setInterval(5000L, updateDataSensor);  // Sensor tiap 5 detik
  timer.setInterval(500L, cekGerak);           // PIR tiap 0.5 detik
  
  Serial.println("=== Smart Home Siap! ===\\n");
}

void loop() {
  Blynk.run();
  timer.run();
}
\`\`\`

---

## 📋 Setup Blynk Dashboard untuk Proyek Ini

**Datastream yang dibutuhkan:**
| Virtual Pin | Nama | Tipe | Widget |
|------------|------|------|--------|
| V0 | Suhu | Double | Gauge (0-50°C) |
| V1 | Kelembapan | Double | Gauge (0-100%) |
| V2 | LED Merah | Integer | Button (Switch) |
| V3 | LED Biru | Integer | Button (Switch) |
| V4 | Gerak | Integer | LED indicator |
| V5 | Status | String | Label |
| V6 | Counter Gerak | Integer | Value Display |

**Events yang dibutuhkan:**
- \`suhu_tinggi\` — Warning
- \`suhu_kritis\` — Critical
- \`gerak_terdeteksi\` — Info

---

## 🎯 Pengembangan Selanjutnya

Ide untuk mengembangkan proyek ini:
1. Tambah relay untuk kontrol beban AC (kipas, lampu sungguhan)
2. Tambah layar OLED lokal untuk tampilkan data tanpa HP
3. Tambah tombol fisik untuk override kontrol HP
4. Tambah sensor gas MQ-2 untuk deteksi kebocoran gas
5. Simpan data ke database untuk analisis jangka panjang

---

## 📝 Ringkasan Proyek

Anda telah membangun sistem Smart Home dengan:
- ✅ Monitoring suhu & kelembapan real-time
- ✅ Deteksi gerak + notifikasi otomatis
- ✅ Kontrol lampu dari HP via Blynk
- ✅ Grafik data historis di dashboard
- ✅ Alarm otomatis saat kondisi berbahaya

> **Selamat! Anda telah menyelesaikan modul dasar IoT. Di modul berikutnya, kita akan masuk ke level yang lebih advanced!** 🎓
`;
