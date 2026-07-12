export const iot_expert_l1 = `
# Industrial IoT (IIoT) & LoRaWAN — IoT Skala Besar

Kita sudah bisa bikin smart home dengan ESP32 + WiFi. Tapi bagaimana kalau proyekmu bukan rumah, tapi **sawah seluas 50 hektar**? Atau **pabrik dengan 500 mesin**? Atau **kota dengan 200 titik sensor banjir**?

WiFi tidak akan cukup. Jangkauannya terbatas, konsumsi dayanya tinggi, dan tidak scalable untuk ribuan node.

Di sinilah Industrial IoT (IIoT) dan teknologi seperti LoRaWAN menjadi relevan.

---

## 🔄 Bedanya IoT Rumahan vs Industrial

| Aspek | IoT Rumah | Industrial IoT |
|-------|-----------|----------------|
| Jumlah perangkat | 5-50 | Ribuan-Jutaan |
| Jangkauan | 10-50m (WiFi) | 2-15 KM |
| Sumber daya | Listrik PLN | Sering baterai |
| Ketahanan | Normal | Tahan debu, panas, getaran |
| Downtime | Tidak masalah | Tidak boleh! (24/7) |
| Protokol | WiFi, Bluetooth | LoRaWAN, Zigbee, 5G |

---

## 📡 LoRaWAN — Teknologi yang Bikin Kagum

LoRaWAN itu seperti kentongan yang bisa terdengar sampai 15 km, tanpa kabel, dan baterainya tahan **5-10 tahun**.

Ini bukan hiperbola — ini spesifikasi nyata:

| Parameter | Nilai |
|-----------|-------|
| Jangkauan perkotaan | 2-5 KM |
| Jangkauan pedesaan | 5-15 KM |
| Line-of-sight | Hingga 40+ KM |
| Konsumsi daya saat tidur | Beberapa mikroampere |
| Daya tahan baterai | 5-10 TAHUN dengan baterai AA biasa! |
| Kecepatan data | 0.3-50 kbps (kecil, tapi cukup untuk data sensor) |

Komprominya: bandwidth kecil — cocok untuk kirim angka suhu, kelembapan, koordinat GPS, tapi tidak untuk video atau audio.

---

## 🏗️ Arsitektur LoRaWAN

\`\`\`
[Sensor Node]  [Sensor Node]  [Sensor Node]  ← ESP32 + Modul LoRa
      ↓               ↓              ↓           (bisa radius 15km!)
      └───────────────┴──────────────┘
                      ↓
               [LoRa Gateway]                  ← 1 gateway bisa handle ribuan sensor!
                      ↓
               [Network Server]               ← The Things Network (gratis!)
                      ↓
           [Application Server]               ← Dashboard / Database kamu
                      ↓
              [User Interface]                ← HP, Web, SCADA
\`\`\`

**Satu gateway LoRa** yang harganya Rp 2-10 juta bisa melayani **ribuan sensor** dalam radius kota. Ini yang membuat LoRaWAN ekonomis untuk skala besar.

---

## 💻 Contoh Kode LoRa Sederhana

\`\`\`cpp
/*
 * Kirim data sensor suhu via LoRa
 * Library: LoRa by Sandeep Mistry
 * Hardware: ESP32 + Module LoRa SX1276
 */

#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>

// Pin LoRa (tergantung modul, cek datasheet!)
const int PIN_LORA_SS   = 18;  // NSS / CS
const int PIN_LORA_RST  = 14;  // RESET
const int PIN_LORA_DIO0 = 26;  // IRQ

const int FREKUENSI_LORA = 915E6; // 915 MHz (sesuaikan region Anda)
const int DEVICE_ID = 1;          // ID unik tiap sensor node

DHT dht(4, DHT22);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Setup LoRa
  LoRa.setPins(PIN_LORA_SS, PIN_LORA_RST, PIN_LORA_DIO0);
  
  if (!LoRa.begin(FREKUENSI_LORA)) {
    Serial.println("❌ LoRa gagal dimulai!");
    while (true);
  }
  
  // Konfigurasi untuk jangkauan maksimal
  LoRa.setSpreadingFactor(10);   // SF7-12: lebih tinggi = jangkauan lebih jauh, lebih lambat
  LoRa.setSignalBandwidth(125E3); // 125kHz bandwidth
  LoRa.setCodingRate4(5);        // Error correction
  LoRa.setTxPower(20);           // Daya transmit maksimal (20dBm = 100mW)
  
  Serial.println("✅ LoRa siap! Mengirim data...");
}

int nomorPaket = 0;

void loop() {
  float suhu = dht.readTemperature();
  float kelembapan = dht.readHumidity();
  
  if (!isnan(suhu) && !isnan(kelembapan)) {
    nomorPaket++;
    
    // Mulai paket LoRa
    LoRa.beginPacket();
    
    // Format payload: "ID,packet_num,suhu,kelembapan"
    // Dibuat singkat karena bandwidth LoRa kecil!
    LoRa.print(DEVICE_ID);
    LoRa.print(",");
    LoRa.print(nomorPaket);
    LoRa.print(",");
    LoRa.print(suhu, 1);
    LoRa.print(",");
    LoRa.print(kelembapan, 1);
    
    LoRa.endPacket(); // Kirim!
    
    Serial.printf("📡 Dikirim #%d: %.1f°C, %.1f%%\\n",
                  nomorPaket, suhu, kelembapan);
  }
  
  // Kirim setiap 30 detik (hemat baterai)
  delay(30000);
  
  // Untuk versi produksi, gunakan Deep Sleep di sini!
}
\`\`\`

---

## 🔗 Integrasi PLC & SCADA

### Apa itu PLC?

**PLC (Programmable Logic Controller)** adalah komputer industri yang sangat andal — dirancang tahan getaran, debu, panas ekstrem, dan bisa berjalan non-stop selama puluhan tahun.

**Analogi:** PLC seperti "otak keras kepala" di pabrik — tidak pintar seperti ESP32, tapi sangat andal dan tidak pernah crash.

\`\`\`
Dunia Lama:          Dunia IIoT Modern:
[Sensor]             [Sensor] → [ESP32/IoT Node]
    ↓                                ↓
  [PLC]       ←  Integrasi  →    [PLC]
    ↓                                ↓
[SCADA]                          [SCADA + Cloud]
                                     ↓
                               [Dashboard Real-time]
                               [AI Analytics]
                               [Prediktif Maintenance]
\`\`\`

### Protokol Komunikasi Industri

| Protokol | Jarak | Kecepatan | Digunakan Di |
|----------|-------|-----------|-------------|
| Modbus RTU | ~1km | Lambat | PLC lama, meter listrik |
| Modbus TCP | LAN | Sedang | PLC modern via Ethernet |
| OPC-UA | Jaringan | Cepat | Standar industri terbaru |
| PROFINET | LAN | Sangat cepat | Siemens, Schneider |
| CAN Bus | ~40m | Sedang | Otomotif, robotik |

### Contoh: Baca Modbus dari ESP32

\`\`\`cpp
/*
 * Baca data dari PLC/meter via Modbus RTU
 * Cocok untuk integrasi dengan peralatan industri lama
 */

#include <ModbusMaster.h>

ModbusMaster node;

void setup() {
  Serial.begin(115200);
  
  // Serial2 untuk Modbus RTU (RS485)
  Serial2.begin(9600, SERIAL_8N1, 16, 17); // RX=16, TX=17
  
  // Slave ID 1 (alamat PLC/meter)
  node.begin(1, Serial2);
  
  Serial.println("Modbus siap - membaca data PLC...");
}

void loop() {
  // Baca 2 register mulai dari alamat 0x0000
  uint8_t result = node.readHoldingRegisters(0x0000, 2);
  
  if (result == node.ku8MBSuccess) {
    uint16_t register0 = node.getResponseBuffer(0);
    uint16_t register1 = node.getResponseBuffer(1);
    
    Serial.printf("Register[0]: %d | Register[1]: %d\\n",
                  register0, register1);
  } else {
    Serial.printf("❌ Modbus error: 0x%02X\\n", result);
  }
  
  delay(1000);
}
\`\`\`

---

## 🌐 Platform IIoT Populer

| Platform | Keunggulan | Harga |
|----------|-----------|-------|
| **The Things Network** | Gratis, komunitas global, LoRaWAN | Gratis |
| **Azure IoT Hub** | Enterprise, skalabel | Berbayar |
| **AWS IoT Core** | Powerful, banyak fitur AI | Berbayar |
| **Chirpstack** | Open source, self-hosted | Gratis (self-host) |
| **Node-RED** | Visual programming, mudah | Gratis |

---

## 💡 Use Case IIoT yang Nyata

Ini bukan skenario fiksi — semua sudah terjadi di Indonesia dan dunia:

### Smart Agriculture — Pertanian Presisi
\`\`\`
100 sensor kelembapan tanah di 50 hektar sawah
→ Kirim data tiap jam via LoRaWAN
→ Satu gateway di tepi sawah
→ Baterai sensor: 2 tahun
→ Irigasi hanya saat benar-benar dibutuhkan
→ Hasil: Hemat air 40%, produktivitas naik 25%
\`\`\`

### Predictive Maintenance Pabrik
\`\`\`
Sensor getaran di 200 motor pabrik
→ AI analisis pola getaran tiap hari
→ Deteksi bearing mau rusak 2 minggu sebelumnya
→ Jadwalkan maintenance tanpa downtime mendadak
→ Hasil: Hemat jutaan dari perbaikan darurat
\`\`\`

### Smart City — Monitoring Banjir
\`\`\`
50 sensor ketinggian air di seluruh kota
→ Update tiap 5 menit via LoRaWAN
→ Alert otomatis ke WhatsApp warga
→ Dashboard real-time untuk BPBD
→ Tidak perlu petugas cek manual
\`\`\`

---

## 📝 Ringkasan

IIoT bukan sekadar "IoT yang lebih besar" — ini ekosistem dengan standar, protokol, dan kebutuhan yang berbeda dari IoT konsumer.

- LoRaWAN: jangkauan 2-15km, baterai 5-10 tahun, satu gateway untuk ribuan sensor
- PLC tetap relevan untuk kontrol mesin kritis, IoT melengkapi dengan cloud connectivity
- The Things Network: platform LoRaWAN gratis dengan komunitas global
- Node-RED: visual programming untuk integrasi data, cocok untuk prototipe cepat

Kalau kamu sudah kuasai IoT dasar dan tertarik ke skala yang lebih besar, IIoT dan LoRaWAN adalah langkah logis selanjutnya.

> **Di pelajaran berikutnya, kita jelajahi TinyML — kecerdasan buatan yang berjalan langsung di dalam chip ESP32 tanpa koneksi internet!** 🤖
`;
