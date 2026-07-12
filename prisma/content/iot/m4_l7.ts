export const iot_l7 = `
# Menghubungkan ESP32 ke WiFi

Ini adalah momen yang paling ditunggu-tunggu di belajar IoT: saat ESP32 kamu terhubung ke internet untuk pertama kalinya.

Setelah ini, perangkat kecil Rp 50.000-mu bisa kirim data ke server di mana saja di dunia, menerima perintah dari HP, dan berinteraksi dengan API internet. Inilah yang membuat IoT beda dari sekadar elektronika biasa.

## 🔑 Beberapa Istilah yang Perlu Dikenali

Sebelum coding, pahami dulu istilah-istilah ini karena bakal sering muncul:

| Istilah | Penjelasan | Contoh |
|---------|-----------|--------|
| SSID | Nama jaringan WiFi | "WiFi_Rumah" |
| Password | Kata sandi jaringan | "12345678" |
| IP Address | Alamat unik ESP32 di jaringan | "192.168.1.105" |
| Gateway | Router — pintu gerbang ke internet | "192.168.1.1" |

---

## 📶 Tiga Mode WiFi di ESP32

ESP32 bisa beroperasi dalam tiga mode berbeda:

1. **Station (STA)** — ESP32 bergabung ke WiFi yang sudah ada (paling sering dipakai)
2. **Access Point (AP)** — ESP32 bikin jaringan WiFi sendiri
3. **Station + AP** — Keduanya sekaligus

Untuk pelajaran ini kita pakai mode **Station** dulu.

---

## 💻 Program Koneksi WiFi Dasar

\`\`\`cpp
/*
 * Program: Koneksi WiFi Dasar
 * Fungsi : Hubungkan ESP32 ke WiFi dan tampilkan IP
 */

#include <WiFi.h>  // Library WiFi bawaan ESP32

// ============================================
// GANTI dengan SSID dan Password WiFi Anda!
// ============================================
const char* WIFI_SSID     = "Nama_WiFi_Anda";
const char* WIFI_PASSWORD = "Password_WiFi_Anda";

void setup() {
  Serial.begin(115200);
  delay(1000); // Tunggu Serial siap
  
  Serial.println();
  Serial.println("=== ESP32 WiFi Connection ===");
  Serial.print("Menghubungkan ke: ");
  Serial.println(WIFI_SSID);
  
  // Mulai proses koneksi WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  // Tampilkan progress sambil menunggu koneksi
  Serial.print("Mengkoneksikan");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // Berhasil terhubung!
  Serial.println();
  Serial.println("✅ WiFi Terhubung!");
  Serial.println("====================");
  Serial.print("IP Address : ");
  Serial.println(WiFi.localIP());
  Serial.print("Signal RSSI: ");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());
}

void loop() {
  // Cek koneksi setiap 10 detik
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi terputus! Mencoba reconnect...");
    WiFi.reconnect();
    delay(5000);
  } else {
    Serial.print("📶 WiFi OK | IP: ");
    Serial.print(WiFi.localIP());
    Serial.print(" | Signal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  }
  delay(10000);
}
\`\`\`

---

## 🔄 Reconnect Otomatis yang Lebih Baik

Program di atas bisa "hang" jika WiFi mati lama. Versi yang lebih robust:

\`\`\`cpp
#include <WiFi.h>

const char* WIFI_SSID     = "Nama_WiFi_Anda";
const char* WIFI_PASSWORD = "Password_WiFi";

unsigned long waktuReconnectTerakhir = 0;
const unsigned long INTERVAL_RECONNECT = 30000; // 30 detik

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return; // Sudah terhubung
  
  Serial.println("🔄 Menghubungkan ke WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  // Tunggu maksimal 20 detik
  int percobaan = 0;
  while (WiFi.status() != WL_CONNECTED && percobaan < 40) {
    delay(500);
    Serial.print(".");
    percobaan++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ Terhubung!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("❌ Gagal terhubung. Akan coba lagi nanti.");
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);    // Set ke mode Station
  WiFi.setAutoReconnect(true);  // Auto reconnect bawaan ESP32
  connectWiFi();
}

void loop() {
  // Cek dan reconnect jika perlu
  unsigned long sekarang = millis();
  if (WiFi.status() != WL_CONNECTED) {
    if (sekarang - waktuReconnectTerakhir > INTERVAL_RECONNECT) {
      waktuReconnectTerakhir = sekarang;
      connectWiFi();
    }
  }
  
  // Kode program utama lainnya di sini
  delay(1000);
}
\`\`\`

---

## 🌐 Mengambil Data dari Internet (HTTP GET)

Setelah terhubung WiFi, ESP32 bisa mengambil data dari API internet!

**Contoh: Mengambil waktu dari API**

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // Install dari Library Manager!

const char* WIFI_SSID     = "Nama_WiFi";
const char* WIFI_PASSWORD = "Password";

// API waktu gratis
const char* URL_API_WAKTU = "http://worldtimeapi.org/api/timezone/Asia/Jakarta";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\\nWiFi OK!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Mulai request HTTP
    http.begin(URL_API_WAKTU);
    int httpCode = http.GET(); // Kirim request GET
    
    if (httpCode == HTTP_CODE_OK) {
      // Berhasil (kode 200)
      String payload = http.getString();
      
      // Parse JSON
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);
      
      String waktu     = doc["datetime"].as<String>();
      String timezone  = doc["timezone"].as<String>();
      
      Serial.println("╔═══════════════════════╗");
      Serial.print("║ Waktu: ");
      Serial.println(waktu.substring(0, 19));
      Serial.print("║ Zona : ");
      Serial.println(timezone);
      Serial.println("╚═══════════════════════╝");
    } else {
      Serial.print("❌ HTTP Error: ");
      Serial.println(httpCode);
    }
    
    http.end(); // Tutup koneksi
  }
  
  delay(30000); // Update setiap 30 detik
}
\`\`\`

---

## 📊 Status Kode WiFi

\`WiFi.status()\` mengembalikan salah satu dari nilai berikut:

| Status | Kode | Arti |
|--------|------|------|
| WL_CONNECTED | 3 | Terhubung ✅ |
| WL_NO_SSID_AVAIL | 1 | Nama WiFi tidak ditemukan |
| WL_CONNECT_FAILED | 4 | Password salah |
| WL_DISCONNECTED | 6 | Terputus |
| WL_IDLE_STATUS | 0 | Idle, sedang proses |

---

## 🔒 Jangan Simpan Credentials di Kode!

Ini kebiasaan buruk yang sering dilakukan pemula dan developer profesional pun kadang lupa:

❌ **Jangan lakukan ini:**
\`\`\`cpp
const char* SSID = "WiFi_Saya";       // Kalau kodenya di-share atau di-push ke GitHub...
const char* PASS = "password123";    // ... password WiFi kamu bocor ke dunia!
\`\`\`

✅ **Cara yang lebih aman — pisahkan ke file config:**

Buat file \`config.h\` di folder yang sama dengan sketch:
\`\`\`cpp
// config.h — JANGAN commit file ini ke GitHub!
#define WIFI_SSID     "Nama_WiFi_Anda"
#define WIFI_PASSWORD "Password_Anda"
\`\`\`

Di program utama:
\`\`\`cpp
#include "config.h"
WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
\`\`\`

Tambahkan \`config.h\` ke \`.gitignore\` supaya tidak ikut ter-push.

---

## 📝 Ringkasan

- ESP32 punya WiFi bawaan — tinggal pakai library \`WiFi.h\`
- \`WiFi.begin(ssid, pass)\` untuk mulai koneksi
- \`WiFi.status() != WL_CONNECTED\` untuk cek status
- \`WiFi.localIP()\` untuk tahu alamat IP ESP32 di jaringan
- Setelah terhubung, bisa HTTP GET untuk ambil data dari API internet
- Password WiFi jangan hardcode di kode yang mungkin dibagikan!

> **Di pelajaran berikutnya, kita belajar MQTT — cara ESP32 berkomunikasi dengan cloud IoT secara efisien!** ☁️
`;
