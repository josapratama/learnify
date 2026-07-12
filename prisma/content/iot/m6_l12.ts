export const iot_l12 = `
# Dual Core Processing — Dua Prosesor, Satu Chip

ESP32 punya dua prosesor di dalam satu chip. Secara default, semua kode kita berjalan di Core 1. Core 0 dipakai sistem untuk WiFi dan Bluetooth.

Tapi ada kalanya satu core tidak cukup — ada tugas yang lambat tapi penting, sementara ada tugas lain yang harus super responsif. Kalau keduanya di core yang sama, yang lambat akan "menghalangi" yang cepat.

Contoh masalahnya:

\`\`\`cpp
void loop() {
  bacaSensor();       // 10ms — cepat
  kirimDataWiFi();    // 2000ms — LAMBAT, tapi penting
  cekTombol();        // Harusnya instan, tapi tertunda 2 detik!
}
\`\`\`

Solusinya: pindahkan \`kirimDataWiFi()\` ke Core 0, biarkan Core 1 tetap handle \`cekTombol()\` tanpa gangguan.

---

## 🔧 FreeRTOS — Si Manajer Multitasking

ESP32 menggunakan FreeRTOS, sistem operasi kecil yang mengatur pembagian kerja antar core dan proses. Setiap "pekerjaan" disebut **Task**.

| Komponen Core | Fungsi Default |
|---------------|---------------|
| Core 0 (PRO_CPU) | WiFi, Bluetooth (sistem) |
| Core 1 (APP_CPU) | \`setup()\` dan \`loop()\` kamu |

---

## 💻 Program Dasar Dual Core

\`\`\`cpp
/*
 * Program: Dual Core Sederhana
 * Core 0: Baca sensor setiap 1 detik
 * Core 1: Handle tombol (harus super responsif)
 */

// TaskHandle adalah "remote control" untuk sebuah task
TaskHandle_t taskSensorHandle;
TaskHandle_t taskTombolHandle;

const int PIN_LED    = 2;
const int PIN_TOMBOL = 4;

// Variabel shared (diakses kedua core) — tambahkan volatile!
volatile float suhuTerbaru = 0.0;
volatile bool tombolDitekan = false;

// ======================================
// TASK 1: Berjalan di Core 0
// Simulasi baca sensor (proses lambat)
// ======================================
void taskBacaSensor(void* parameter) {
  // Task harus berupa infinite loop (tidak boleh return!)
  for (;;) {
    // Simulasi baca sensor yang butuh waktu
    suhuTerbaru = random(25, 35) + random(0, 10) * 0.1;
    
    Serial.print("[Core 0] Suhu terbaca: ");
    Serial.print(suhuTerbaru);
    Serial.println("°C");
    
    vTaskDelay(1000 / portTICK_PERIOD_MS); // Tunggu 1 detik (cara FreeRTOS)
    // Jangan gunakan delay() biasa di FreeRTOS task!
  }
}

// ======================================
// TASK 2: Berjalan di Core 1
// Monitor tombol — harus selalu responsif
// ======================================
void taskMonitorTombol(void* parameter) {
  for (;;) {
    if (digitalRead(PIN_TOMBOL) == LOW) {
      if (!tombolDitekan) { // Hindari pembacaan ganda
        tombolDitekan = true;
        digitalWrite(PIN_LED, !digitalRead(PIN_LED)); // Toggle LED
        
        Serial.print("[Core 1] Tombol ditekan! Suhu saat ini: ");
        Serial.print(suhuTerbaru);
        Serial.println("°C");
        
        vTaskDelay(200 / portTICK_PERIOD_MS); // Debounce
      }
    } else {
      tombolDitekan = false;
    }
    
    vTaskDelay(10 / portTICK_PERIOD_MS); // Cek setiap 10ms
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_TOMBOL, INPUT_PULLUP);
  
  Serial.println("=== Dual Core Demo ===");
  Serial.printf("Setup berjalan di Core: %d\\n", xPortGetCoreID());
  
  // Buat task di Core 0
  // xTaskCreatePinnedToCore(fungsi, nama, stackSize, parameter, prioritas, handle, coreID)
  xTaskCreatePinnedToCore(
    taskBacaSensor,      // Fungsi yang akan dijalankan
    "BacaSensor",        // Nama task (untuk debugging)
    4096,                // Ukuran stack (bytes) — 4096 cukup untuk tugas sedang
    NULL,                // Parameter yang diteruskan ke fungsi
    1,                   // Prioritas (0=terendah, 5=tertinggi, default=1)
    &taskSensorHandle,   // Handle untuk kontrol task
    0                    // ← Core 0!
  );
  
  // Buat task di Core 1
  xTaskCreatePinnedToCore(
    taskMonitorTombol,
    "MonitorTombol",
    2048,                // Stack lebih kecil, tugas lebih sederhana
    NULL,
    2,                   // Prioritas lebih tinggi (tombol harus responsif!)
    &taskTombolHandle,
    1                    // ← Core 1!
  );
  
  Serial.println("Kedua core aktif!");
}

void loop() {
  // loop() masih berjalan di Core 1 juga, tapi lebih baik biarkan kosong
  // jika sudah menggunakan FreeRTOS tasks
  vTaskDelay(1000 / portTICK_PERIOD_MS);
}
\`\`\`

---

## 🔄 Komunikasi Antar Core

Bagaimana dua core bisa "berbicara" satu sama lain? Ada beberapa cara:

### 1. Variable Global (Cara Mudah)
\`\`\`cpp
volatile int nilaiSensor = 0; // volatile = beritahu compiler, nilai bisa berubah kapan saja

// Core 0 menulis:
nilaiSensor = bacaADC();

// Core 1 membaca:
tampilkanLCD(nilaiSensor);
\`\`\`
⚠️ Cocok untuk data sederhana, tapi bisa ada **race condition** pada operasi kompleks.

### 2. Queue (Cara Profesional)
\`\`\`cpp
// Queue seperti "antrian kasir" — Core 0 naruh tiket, Core 1 ambil tiket
QueueHandle_t dataQueue;

void setup() {
  dataQueue = xQueueCreate(10, sizeof(float)); // Antrian 10 item float
}

// Core 0 — Kirim data:
float suhu = 28.5;
xQueueSend(dataQueue, &suhu, portMAX_DELAY);

// Core 1 — Terima data:
float suhuDiterima;
if (xQueueReceive(dataQueue, &suhuDiterima, 0) == pdTRUE) {
  Serial.println(suhuDiterima);
}
\`\`\`

### 3. Semaphore / Mutex (Untuk Data Kritis)
\`\`\`cpp
// Mutex = gembok eksklusif, hanya satu core yang bisa akses sekaligus
SemaphoreHandle_t kunciData;

void setup() {
  kunciData = xSemaphoreCreateMutex();
}

// Sebelum akses data penting:
if (xSemaphoreTake(kunciData, portMAX_DELAY) == pdTRUE) {
  // ... akses data dengan aman ...
  xSemaphoreGive(kunciData); // Lepas kunci
}
\`\`\`

---

## 📊 Contoh Nyata: Monitoring WiFi + Sensor

\`\`\`cpp
/*
 * Core 0: Kirim data ke server (lambat, perlu waktu)
 * Core 1: Baca sensor setiap 100ms (harus cepat & akurat)
 */

#include <WiFi.h>
#include <HTTPClient.h>

QueueHandle_t antrianKirim;

// Core 0: Pengirim data (tidak memblokir pembacaan sensor)
void taskKirimData(void* param) {
  float data;
  for (;;) {
    // Tunggu sampai ada data di antrian
    if (xQueueReceive(antrianKirim, &data, portMAX_DELAY)) {
      // Kirim ke server (ini yang biasanya lambat)
      HTTPClient http;
      http.begin("https://api.contoh.com/sensor?nilai=" + String(data));
      int code = http.GET();
      http.end();
      Serial.printf("[Core 0] Terkirim: %.1f | HTTP %d\\n", data, code);
    }
  }
}

// Core 1: Pembaca sensor (selalu tepat waktu)
void taskBacaSensor(void* param) {
  for (;;) {
    float nilai = analogRead(34) * (3.3 / 4095.0); // Baca ADC
    
    // Masukkan ke antrian untuk dikirim — tidak memblokir!
    xQueueSend(antrianKirim, &nilai, 0);
    
    vTaskDelay(100 / portTICK_PERIOD_MS); // Baca tiap 100ms
  }
}

void setup() {
  Serial.begin(115200);
  
  WiFi.begin("WiFi", "Password");
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  antrianKirim = xQueueCreate(20, sizeof(float));
  
  xTaskCreatePinnedToCore(taskKirimData,  "KirimData",  8192, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(taskBacaSensor, "BacaSensor", 4096, NULL, 2, NULL, 1);
}

void loop() { vTaskDelay(1000 / portTICK_PERIOD_MS); }
\`\`\`

---

## ⚠️ Tips & Jebakan Umum

| Jangan Lakukan | Lakukan Ini |
|----------------|-------------|
| \`delay()\` dalam FreeRTOS task | \`vTaskDelay(ms / portTICK_PERIOD_MS)\` |
| Task tanpa infinite loop | Selalu pakai \`for(;;){}\` dalam task |
| Stack terlalu kecil (< 2048) | Mulai dari 4096, kurangi jika perlu |
| Akses variable shared tanpa proteksi | Gunakan Mutex atau Queue |
| Hapus task sembarangan | Gunakan \`vTaskDelete(handle)\` dengan benar |

---

## 📝 Ringkasan

- ESP32 punya 2 core — Core 0 untuk WiFi/BT, Core 1 untuk kode Anda
- \`xTaskCreatePinnedToCore()\` untuk membuat task di core tertentu
- Gunakan \`vTaskDelay()\` bukan \`delay()\` dalam FreeRTOS task
- Queue adalah cara terbaik untuk komunikasi antar core
- Dual core menyelesaikan masalah "kode lambat menghalangi tugas penting"

> **Di pelajaran berikutnya, kita belajar menyimpan data ke flash memory dan SD Card!** 💾
`;
