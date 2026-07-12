export const iot_expert_l2 = `
# AI at the Edge — TinyML di ESP32

Sejauh ini kita selalu mengandalkan cloud untuk pemrosesan yang "pintar" — data dikirim ke server, diproses di sana, hasilnya balik ke perangkat.

Tapi ada satu masalah besar dengan pendekatan itu: **membutuhkan koneksi internet yang stabil**, ada **latensi** (jeda waktu), dan **data sensitif harus keluar dari perangkat**.

TinyML menjawab semua ini dengan cara yang elegan: **tanamkan kecerdasan langsung ke dalam chip**.

ESP32 bisa menjalankan model machine learning untuk mendeteksi kata kunci, mengidentifikasi anomali getaran mesin, atau mengklasifikasikan gambar — semuanya tanpa koneksi internet, dalam hitungan milidetik, dengan konsumsi daya rendah.

Ini bukan masa depan. Ini sudah terjadi:
- AirPods mendeteksi "Hey Siri" tanpa kirim audio ke Apple
- Kamera pintu pintar yang kenali wajah pemilik rumah secara lokal
- Sensor mesin pabrik yang deteksi kerusakan sebelum terjadi

---

## ⚖️ Cloud AI vs TinyML — Kapan Pakai Yang Mana?

| Aspek | Cloud AI | TinyML (Edge) |
|-------|----------|---------------|
| Koneksi internet | Selalu butuh | Tidak butuh ✅ |
| Latensi | 100ms - 10 detik | < 10ms ✅ |
| Privasi | Data keluar | Data tetap lokal ✅ |
| Biaya per request | Berbayar | Gratis ✅ |
| Akurasi | Lebih tinggi | Sedikit lebih rendah |
| Ukuran model | Bebas (GB) | Terbatas (KB-MB) |
| Cocok untuk | Analisis kompleks sekali | Deteksi real-time ✅ |

TinyML bukan pengganti Cloud AI — keduanya punya tempat masing-masing. Tapi untuk use case IoT yang butuh respons cepat dan offline, TinyML adalah jawabannya.

---

## 🛠️ Alur Kerja TinyML

\`\`\`
1. Kumpulkan data     → rekam sensor, suara, atau gambar
2. Latih model        → di komputer dengan Python + TensorFlow
3. Konversi TFLite    → perkecil model ke format yang bisa jalan di microcontroller
4. Kuantisasi         → perkecil lagi (float32 → int8, ukuran berkurang 4x)
5. Export ke C array  → xxd -i model.tflite > model_data.h
6. Deploy ke ESP32    → upload bersama kode program
7. Inferensi lokal    → ESP32 buat prediksi tanpa internet!
\`\`\`

---

## 📊 Use Case TinyML Populer

### 1. Keyword Spotting (Deteksi Kata Kunci)

Mendengarkan kata perintah tertentu secara real-time.

\`\`\`
ESP32 + Microphone → Dengarkan terus-menerus
"Hey Rumah, matikan lampu!" 
    ↓
Model TinyML deteksi "Hey Rumah" (bukan kata lain)
    ↓
Baru kirim perintah ke sistem
\`\`\`

**Manfaat nyata:** Mikrofon tidak perlu selalu streaming audio ke cloud, privasi terjaga.

### 2. Anomaly Detection (Deteksi Anomali Mesin)

\`\`\`
Sensor akselerometer di motor pabrik
    ↓
ESP32 analisis pola getaran setiap 100ms
    ↓
Model TinyML: "Ini getaran normal" atau "Ada yang tidak beres!"
    ↓
Alert ke teknisi SEBELUM mesin rusak
\`\`\`

### 3. Image Classification (Klasifikasi Gambar)

\`\`\`
ESP32-CAM foto buah di conveyor belt
    ↓
TinyML: "Mangga Matang", "Mangga Mentah", "Rusak"
    ↓
Kontrol lengan robot pemilah → sortir otomatis
\`\`\`

---

## 💻 Contoh: Menjalankan Model TinyML di ESP32

\`\`\`cpp
/*
 * Contoh inferensi TensorFlow Lite di ESP32
 * Model: Deteksi anomali dari data sensor (dummy)
 * 
 * Prasyarat:
 * - Install library: "TensorFlowLite_ESP32" oleh tanakamasayuki
 * - File model_data.h berisi model yang sudah dikompilasi
 */

#include <TensorFlowLite_ESP32.h>
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/schema/schema_generated.h"

// File ini berisi model TFLite dalam format array C
// (dihasilkan dari: xxd -i model.tflite > model_data.h)
#include "model_data.h"

// Konfigurasi memori untuk TFLite
const int TENSOR_ARENA_SIZE = 30 * 1024; // 30KB arena
uint8_t tensor_arena[TENSOR_ARENA_SIZE];

// Pointer ke komponen TFLite
const tflite::Model* model;
tflite::MicroInterpreter* interpreter;
TfLiteTensor* input_tensor;
TfLiteTensor* output_tensor;

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("=== Inisialisasi TinyML ===");
  
  // 1. Load model dari array C
  model = tflite::GetModel(g_model_data); // g_model_data dari model_data.h
  if (model->version() != TFLITE_SCHEMA_VERSION) {
    Serial.println("❌ Versi model tidak kompatibel!");
    while (true);
  }
  Serial.println("✅ Model dimuat");
  
  // 2. Setup resolver (tentukan operasi yang dipakai model)
  static tflite::MicroMutableOpResolver<4> resolver;
  resolver.AddFullyConnected();
  resolver.AddRelu();
  resolver.AddSoftmax();
  resolver.AddReshape();
  
  // 3. Buat interpreter
  static tflite::MicroInterpreter static_interpreter(
    model, resolver, tensor_arena, TENSOR_ARENA_SIZE, nullptr);
  interpreter = &static_interpreter;
  
  // 4. Alokasikan tensor
  TfLiteStatus status = interpreter->AllocateTensors();
  if (status != kTfLiteOk) {
    Serial.println("❌ Gagal alokasi tensor!");
    while (true);
  }
  
  // 5. Dapatkan pointer ke input/output
  input_tensor  = interpreter->input(0);
  output_tensor = interpreter->output(0);
  
  Serial.printf("✅ TinyML siap!\\n");
  Serial.printf("Input shape: [%d, %d]\\n",
    input_tensor->dims->data[0],
    input_tensor->dims->data[1]);
}

void loop() {
  // Simulasi baca 3 fitur sensor (suhu, getaran, arus)
  float fitur[3] = {
    analogRead(34) * (3.3 / 4095.0),  // Sensor 1
    analogRead(35) * (3.3 / 4095.0),  // Sensor 2
    analogRead(32) * (3.3 / 4095.0),  // Sensor 3
  };
  
  // Normalisasi input (penting! sesuaikan dengan preprocessing saat training)
  for (int i = 0; i < 3; i++) {
    input_tensor->data.f[i] = fitur[i]; // Langsung jika model pakai float32
    // Jika model dikuantisasi ke int8:
    // input_tensor->data.int8[i] = (int8_t)(fitur[i] * 127);
  }
  
  // Jalankan inferensi!
  unsigned long waktuMulai = micros();
  TfLiteStatus invoke_status = interpreter->Invoke();
  unsigned long waktuSelesai = micros();
  
  if (invoke_status != kTfLiteOk) {
    Serial.println("❌ Inferensi gagal!");
    return;
  }
  
  // Baca hasil output (contoh: 2 kelas — Normal vs Anomali)
  float probNormal  = output_tensor->data.f[0];
  float probAnomal  = output_tensor->data.f[1];
  
  Serial.printf("\\n=== Hasil Inferensi (waktu: %luµs) ===\\n", 
                waktuSelesai - waktuMulai);
  Serial.printf("Normal : %.1f%%\\n", probNormal * 100);
  Serial.printf("Anomali: %.1f%%\\n", probAnomal * 100);
  
  if (probAnomal > 0.7) { // Threshold 70%
    Serial.println("⚠️  ANOMALI TERDETEKSI! Kirim alert...");
    // ... kirim notifikasi via MQTT/HTTP
  } else {
    Serial.println("✅ Kondisi normal");
  }
  
  delay(500); // Inferensi setiap 500ms
}
\`\`\`

---

## 🐍 Alur Training Model (Python)

Ini gambaran singkat proses training di komputer sebelum deploy ke ESP32:

\`\`\`python
# Di Google Colab atau laptop Anda:
import tensorflow as tf
import numpy as np

# 1. Siapkan data training
# X_train: fitur sensor, y_train: label (0=Normal, 1=Anomali)
X_train = np.array([[25.0, 0.1, 1.2],  # Normal
                     [26.0, 0.2, 1.1],  # Normal
                     [45.0, 2.5, 3.8],  # Anomali (suhu tinggi, getaran besar)
                     # ... ribuan data lainnya
                    ])
y_train = np.array([0, 0, 1, ...])

# 2. Buat model sederhana (harus kecil untuk ESP32!)
model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation='relu', input_shape=(3,)),
    tf.keras.layers.Dense(8,  activation='relu'),
    tf.keras.layers.Dense(2,  activation='softmax')  # 2 kelas
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
model.fit(X_train, y_train, epochs=50)

# 3. Konversi ke TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Opsional: Kuantisasi untuk lebih kecil lagi
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Simpan file
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)

print(f"Ukuran model: {len(tflite_model) / 1024:.1f} KB")

# 4. Konversi ke C array (di terminal):
# xxd -i model.tflite > model_data.h
\`\`\`

---

## 📱 Tools & Resources TinyML

| Tool | Fungsi | Platform |
|------|--------|----------|
| **Edge Impulse** | Platform all-in-one TinyML (termudah!) | Web (gratis) |
| **TensorFlow Lite** | Framework resmi Google | Python/PC |
| **Google Colab** | Training model gratis | Web |
| **xxd** | Konversi .tflite ke C header | Linux/Mac/Windows |
| **Netron** | Visualisasi arsitektur model | Web/Desktop |

> 💡 **Rekomendasi untuk pemula:** Mulai dengan **Edge Impulse** (edgeimpulse.com) — platform gratis yang mengotomatiskan hampir semua proses dari koleksi data hingga deployment ke ESP32!

---

## 🎯 Batasan TinyML di ESP32

Penting untuk tahu batas kemampuan sebelum berharap terlalu tinggi:

| Tugas | Layak di ESP32? |
|-------|----------------|
| Deteksi kata kunci sederhana | ✅ Ya |
| Klasifikasi getaran mesin | ✅ Ya |
| Deteksi anomali sensor | ✅ Ya |
| Pengenalan gestur IMU | ✅ Ya |
| Klasifikasi gambar sederhana (ESP32-CAM) | ⚠️ Mungkin, tergantung model |
| Object detection (YOLO) | ❌ Terlalu besar |
| Natural Language Processing | ❌ Butuh lebih banyak RAM |
| Generative AI (ChatGPT-like) | ❌ Jauh di luar kemampuan |

---

## 📝 Ringkasan

- TinyML = model AI yang berjalan langsung di microcontroller tanpa internet
- Keunggulan: real-time, privasi, tidak butuh cloud, biaya rendah
- Alur: kumpulkan data → latih di PC (Python/TF) → konversi → deploy ke ESP32
- Use case terbaik: keyword spotting, anomaly detection, klasifikasi sederhana
- Mulai dengan **Edge Impulse** untuk pengalaman yang paling mudah
- Gunakan ESP32-S3 atau ESP32-P4 untuk model yang lebih kompleks (RAM lebih besar)

---

## 🏆 Selamat Menyelesaikan Kursus IoT!

Anda telah menempuh perjalanan dari "Apa itu IoT?" hingga AI di tepi perangkat. Ini adalah perjalanan yang luar biasa!

**Recap apa yang telah Anda pelajari:**
- ✅ Konsep IoT dan ESP32
- ✅ Membaca sensor digital dan analog
- ✅ Koneksi WiFi dan protokol MQTT
- ✅ Platform Blynk untuk kontrol dari HP
- ✅ Deep Sleep untuk efisiensi daya
- ✅ Dual Core Processing dengan FreeRTOS
- ✅ Penyimpanan data dengan SPIFFS dan SD Card
- ✅ Troubleshooting hardware
- ✅ Industrial IoT dan LoRaWAN
- ✅ TinyML untuk AI di perangkat

**Langkah selanjutnya:**
1. Bangun proyek nyata dari awal sendiri
2. Ikuti komunitas: ESP32 Forum, Arduino Forum, Hackaday
3. Eksplorasi Edge Impulse untuk proyek TinyML
4. Pertimbangkan ESP32-S3 untuk proyek yang lebih canggih

> **Dunia IoT menanti inovasi Anda. Selamat berkarya!** 🚀
`;
