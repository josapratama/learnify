export const iot_l8 = `
# Protokol MQTT — Cara ESP32 Ngobrol dengan Dunia

Setelah tahu cara connect WiFi, sekarang pertanyaannya: bagaimana ESP32 mengirim data ke server, dan bagaimana kita kirim perintah balik ke ESP32?

Jawabannya: **MQTT**.

Kamu bisa pakai HTTP biasa, tapi MQTT dirancang khusus untuk IoT. Bedanya signifikan — seperti perbedaan antara telepon satu arah vs radio dua arah. MQTT lebih ringan, lebih efisien, dan jauh lebih cocok untuk perangkat dengan resource terbatas.

## 📬 Cara Kerja MQTT — Sistem Berlangganan

Bayangkan sistem langganan koran:
- **Publisher** = penerbit yang kirim berita ke kantor pos
- **Broker** = kantor pos yang sortir dan distribusikan
- **Subscriber** = pelanggan yang pilih kategori berita yang mau diterima
- **Topic** = kategori berita (\`rumah/sensor/suhu\`, \`pabrik/mesin1/rpm\`, dll.)

Ini berbeda dari HTTP yang point-to-point. Di MQTT, pengirim tidak perlu tahu siapa yang menerima, dan penerima tidak perlu tahu siapa yang mengirim. Semuanya lewat broker.

\`\`\`
[ESP32 Sensor] ──PUBLISH──►  [Broker MQTT]  ◄──SUBSCRIBE── [Aplikasi HP]
[ESP32 AC]     ◄──PUBLISH──  [Broker MQTT]  ──SUBSCRIBE──► [Dashboard Web]
[ESP32 Lampu]  ──PUBLISH──►  [Broker MQTT]

Semua data lewat broker — tidak ada koneksi langsung antar device
\`\`\`

### Kenapa MQTT Lebih Baik dari HTTP untuk IoT?

| | HTTP | MQTT |
|--|------|------|
| Overhead | Besar (header panjang) | Minimal (2 byte minimum!) |
| Koneksi | Request-response, tidak persisten | Persistent connection |
| Arah data | Satu arah per request | Dua arah sekaligus |
| Cocok untuk | Web API | IoT, real-time data |

---

## 🎛️ QoS — Pilih Seberapa Andal Pengirimannya

QoS (Quality of Service) menentukan jaminan pengiriman pesan:

| Level | Garansi | Cocok Untuk |
|-------|---------|-------------|
| 0 | "Kirim, tidak perlu konfirmasi" | Data sensor yang terus update (kalau miss 1, tidak masalah) |
| 1 | Minimal sekali sampai (mungkin duplikat) | Notifikasi penting |
| 2 | Tepat sekali, tidak lebih | Perintah kritis (buka kunci pintu, transaksi) |

Untuk belajar dan data sensor biasa, QoS 0 sudah cukup.

---

## ☁️ Broker MQTT Gratis untuk Belajar

Kamu tidak perlu setup server sendiri. Broker publik ini bisa langsung dipakai:

| Broker | Alamat | Port |
|--------|--------|------|
| HiveMQ | broker.hivemq.com | 1883 |
| EMQX | broker.emqx.io | 1883 |
| Mosquitto Test | test.mosquitto.org | 1883 |

> ⚠️ Broker publik untuk belajar saja — siapapun bisa lihat datamu. Untuk produksi, pakai broker sendiri.

---

## 📦 Install Library MQTT

1. Buka \`Sketch\` → \`Include Library\` → \`Manage Libraries\`
2. Cari **"PubSubClient"** by Nick O'Leary
3. Klik **Install**

---

## 💻 Program ESP32 MQTT — Publish Data Sensor

\`\`\`cpp
/*
 * Program: ESP32 MQTT Publisher
 * Fungsi : Kirim data suhu ke broker MQTT
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi Configuration
const char* WIFI_SSID     = "Nama_WiFi_Anda";
const char* WIFI_PASSWORD = "Password_WiFi";

// MQTT Configuration
const char* MQTT_BROKER = "broker.hivemq.com";
const int   MQTT_PORT   = 1883;
const char* MQTT_CLIENT_ID = "ESP32_Sensor_001"; // Harus UNIK!

// MQTT Topics
const char* TOPIC_SUHU       = "rumah/sensor/suhu";
const char* TOPIC_KELEMBAPAN = "rumah/sensor/kelembapan";
const char* TOPIC_STATUS     = "rumah/sensor/status";

// DHT22
const int PIN_DHT = 4;
DHT dht(PIN_DHT, DHT22);

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// ==============================
// Fungsi: Koneksi WiFi
// ==============================
void connectWiFi() {
  Serial.print("Menghubungkan WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println(" ✅");
}

// ==============================
// Fungsi: Koneksi MQTT Broker
// ==============================
void connectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Menghubungkan MQTT...");
    
    // connect(clientId, username, password)
    // Untuk broker publik tanpa auth, cukup clientId
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println(" ✅ Terhubung ke broker!");
      
      // Publish pesan status saat baru terhubung
      mqttClient.publish(TOPIC_STATUS, "ESP32 Online!", true);
      // 'true' = retain message (broker simpan pesan terakhir)
      
    } else {
      Serial.print(" ❌ Gagal, kode: ");
      Serial.println(mqttClient.state());
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  connectWiFi();
  
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  connectMQTT();
  
  Serial.println("\\n=== MQTT Publisher Siap ===");
}

void loop() {
  // Jaga koneksi MQTT tetap hidup
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop(); // Proses pesan masuk (wajib dipanggil!)
  
  // Baca sensor setiap 5 detik
  static unsigned long waktuTerakhir = 0;
  if (millis() - waktuTerakhir > 5000) {
    waktuTerakhir = millis();
    
    float suhu       = dht.readTemperature();
    float kelembapan = dht.readHumidity();
    
    if (!isnan(suhu) && !isnan(kelembapan)) {
      // Konversi float ke string untuk dikirim
      char bufferSuhu[10];
      char bufferLembap[10];
      dtostrf(suhu, 4, 1, bufferSuhu);           // "28.5"
      dtostrf(kelembapan, 4, 1, bufferLembap);   // "65.2"
      
      // Publish data (topic, payload, retain)
      mqttClient.publish(TOPIC_SUHU,       bufferSuhu,   false);
      mqttClient.publish(TOPIC_KELEMBAPAN, bufferLembap, false);
      
      Serial.printf("📤 Dikirim → Suhu: %s°C, Kelembapan: %s%%\\n",
                    bufferSuhu, bufferLembap);
    }
  }
}
\`\`\`

---

## 📥 Program ESP32 MQTT — Subscribe & Kontrol

\`\`\`cpp
/*
 * Program: ESP32 MQTT Subscriber
 * Fungsi : Terima perintah dari HP untuk kontrol LED
 */

#include <WiFi.h>
#include <PubSubClient.h>

const char* WIFI_SSID     = "Nama_WiFi";
const char* WIFI_PASSWORD = "Password";
const char* MQTT_BROKER   = "broker.hivemq.com";
const char* MQTT_CLIENT_ID = "ESP32_Kontrol_001";

// Topic yang akan kita dengarkan
const char* TOPIC_KONTROL_LED = "rumah/lampu/kontrol";
const char* TOPIC_STATUS_LED  = "rumah/lampu/status";

const int PIN_LED = 2;

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// ==============================
// Callback: Dipanggil saat ada pesan masuk
// ==============================
void onMessageMasuk(char* topic, byte* payload, unsigned int length) {
  // Konversi payload (byte array) ke String
  String pesan = "";
  for (int i = 0; i < length; i++) {
    pesan += (char)payload[i];
  }
  
  Serial.print("📩 Pesan dari topic [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(pesan);
  
  // Cek topik dan proses pesan
  if (String(topic) == TOPIC_KONTROL_LED) {
    if (pesan == "ON" || pesan == "1" || pesan == "true") {
      digitalWrite(PIN_LED, HIGH);
      mqttClient.publish(TOPIC_STATUS_LED, "ON");
      Serial.println("💡 LED Nyala!");
      
    } else if (pesan == "OFF" || pesan == "0" || pesan == "false") {
      digitalWrite(PIN_LED, LOW);
      mqttClient.publish(TOPIC_STATUS_LED, "OFF");
      Serial.println("⚫ LED Mati!");
    }
  }
}

void connectMQTT() {
  while (!mqttClient.connected()) {
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println("✅ MQTT terhubung!");
      
      // Subscribe ke topic kontrol
      mqttClient.subscribe(TOPIC_KONTROL_LED);
      Serial.print("👂 Mendengarkan: ");
      Serial.println(TOPIC_KONTROL_LED);
      
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\\nWiFi OK!");
  
  // Set callback sebelum connect
  mqttClient.setServer(MQTT_BROKER, 1883);
  mqttClient.setCallback(onMessageMasuk);
  
  connectMQTT();
}

void loop() {
  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop(); // WAJIB! Untuk proses pesan masuk
}
\`\`\`

---

## 🧪 Test dengan MQTT Explorer

Sebelum coding di ESP32, coba test MQTT dulu dari komputer pakai aplikasi **MQTT Explorer** (gratis, download di mqtt-explorer.com):

1. Buka MQTT Explorer, koneksi ke \`broker.hivemq.com\` port \`1883\`
2. Subscribe ke topic \`rumah/sensor/suhu\`
3. Upload program Publisher ke ESP32
4. Data suhu akan muncul real-time di MQTT Explorer

Ini cara cepat untuk verifikasi ESP32 sudah kirim data dengan benar sebelum bikin aplikasi HP-nya.

---

## 📝 Ringkasan

- MQTT = protokol ringan berbasis Publish/Subscribe, ideal untuk IoT
- Semua pesan lewat **broker** sebagai perantara
- \`mqttClient.publish(topic, data)\` untuk kirim
- \`mqttClient.subscribe(topic)\` untuk terima
- Fungsi callback dipanggil otomatis saat ada pesan masuk
- \`mqttClient.loop()\` **wajib** dipanggil di setiap iterasi \`loop()\`

> **Di pelajaran berikutnya, kita setup Blynk IoT — platform yang bikin kontrol dari HP jadi super mudah!** 📱
`;
