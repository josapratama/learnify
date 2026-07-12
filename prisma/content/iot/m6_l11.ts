export const iot_l11 = `
# Deep Sleep & Low Power Mode — Menghemat Baterai ESP32

Ada satu pertanyaan yang selalu muncul saat orang mulai buat proyek IoT outdoor: *"Baterainya tahan berapa lama?"*

Jawabannya sangat bergantung pada satu hal: apakah kamu pakai Deep Sleep atau tidak.

ESP32 yang terus menyala aktif butuh sekitar **240mA**. Dengan Deep Sleep, konsumsinya turun ke **< 10µA** — **24.000 kali lebih hemat**. Dengan baterai 18650 biasa (2000mAh), perbedaannya antara tahan 8 jam vs tahan bertahun-tahun.

---

## 🔋 Dampak Nyata pada Daya Tahan Baterai

Mari hitung dengan baterai Li-Ion 18650 kapasitas 2000mAh:

| Mode | Konsumsi rata-rata | Daya tahan |
|------|-------------------|-----------|
| Aktif terus | 240 mA | ~8 jam |
| Bangun 1 detik, tidur 59 detik | ~4 mA | ~20 hari |
| Bangun sebentar, tidur 1 jam | ~0.02 mA | **~11 TAHUN!** |

Itu yang membuat sensor IoT di ladang atau monitoring cuaca bisa berjalan bertahun-tahun tanpa ganti baterai.

---

## 🧩 Jenis Sleep Mode

### Deep Sleep (Paling Populer)
- CPU mati, RAM **TERHAPUS** — program mulai dari awal saat bangun
- Hanya RTC (Real Time Clock) tetap hidup — ini yang menghitung waktu tidur
- Konsumsi: **< 10µA**
- Data penting bisa disimpan di 8KB memori RTC khusus

### Light Sleep
- CPU berhenti, tapi RAM tetap menyimpan data
- Konsumsi: ~1-2 mA
- Bangun lebih cepat, koneksi WiFi bisa dipertahankan

---

## ⏰ Cara Membangunkan ESP32 dari Deep Sleep

Ada beberapa cara "alarm" untuk membangunkan ESP32:

| Metode Bangun | Contoh Penggunaan |
|---------------|-------------------|
| **Timer** | Bangun setiap X detik/menit |
| **Pin Eksternal (EXT0)** | Bangun saat tombol ditekan |
| **Pin Eksternal (EXT1)** | Bangun saat salah satu dari beberapa pin berubah |
| **Touch Pin** | Bangun saat disentuh |
| **ULP Coprocessor** | Prosesor kecil yang tetap jaga saat tidur |

---

## 💻 Program Deep Sleep dengan Timer

\`\`\`cpp
/*
 * Program: Deep Sleep dengan Timer
 * Fungsi : ESP32 baca suhu, kirim data, lalu tidur 10 detik
 * Analogi: Satpam yang tidur & bangun tiap 10 menit
 */

// RTC_DATA_ATTR = simpan di memori RTC (tidak hilang saat Deep Sleep!)
RTC_DATA_ATTR int hitungBangun = 0; // Menghitung berapa kali ESP32 bangun

// Durasi tidur dalam mikrodetik (1 detik = 1.000.000 µs)
const uint64_t DURASI_TIDUR = 10 * 1000000; // 10 detik

void setup() {
  Serial.begin(115200);
  delay(100); // Beri waktu Serial untuk siap
  
  hitungBangun++; // Tambah hitungan bangun
  
  Serial.println("=========================");
  Serial.println("  ESP32 Bangun dari Tidur!");
  Serial.printf("  Ini bangun ke-%d\\n", hitungBangun);
  Serial.println("=========================");
  
  // Cek alasan bangun (opsional tapi informatif)
  esp_sleep_wakeup_cause_t alasanBangun = esp_sleep_get_wakeup_cause();
  switch(alasanBangun) {
    case ESP_SLEEP_WAKEUP_TIMER:
      Serial.println("Alasan bangun: Timer alarm");
      break;
    case ESP_SLEEP_WAKEUP_EXT0:
      Serial.println("Alasan bangun: Tombol ditekan");
      break;
    default:
      Serial.println("Alasan bangun: Pertama kali nyala");
      break;
  }
  
  // --- LAKUKAN TUGAS DI SINI ---
  // Misalnya: baca sensor, kirim data ke server
  Serial.println("Sedang membaca sensor...");
  delay(500); // Simulasi baca sensor
  Serial.println("Data terkirim!");
  // --- SELESAI TUGAS ---
  
  // Set timer untuk bangun (dalam mikrodetik)
  esp_sleep_enable_timer_wakeup(DURASI_TIDUR);
  
  Serial.printf("\\nMasuk Deep Sleep selama %d detik...\\n", (int)(DURASI_TIDUR / 1000000));
  Serial.println("Selamat tidur! 😴");
  Serial.flush(); // Pastikan Serial selesai kirim data sebelum tidur
  
  esp_deep_sleep_start(); // ZZZzzz...
  
  // Kode setelah ini TIDAK AKAN PERNAH dijalankan
}

void loop() {
  // Kosong! Karena setelah deep sleep, ESP32 mulai dari setup() lagi
  // Semua kode ada di setup()
}
\`\`\`

**Output Serial:**
\`\`\`
=========================
  ESP32 Bangun dari Tidur!
  Ini bangun ke-1
=========================
Alasan bangun: Pertama kali nyala
Sedang membaca sensor...
Data terkirim!

Masuk Deep Sleep selama 10 detik...
Selamat tidur! 😴
[... 10 detik kemudian ...]
=========================
  ESP32 Bangun dari Tidur!
  Ini bangun ke-2
=========================
\`\`\`

---

## 🔘 Deep Sleep dengan Tombol (External Wake-up)

\`\`\`cpp
/*
 * Program: Deep Sleep — Bangun dengan Tombol
 * Koneksi: Tombol antara GPIO 33 dan GND
 */

const int PIN_TOMBOL = 33; // Harus GPIO RTC-capable (0,2,4,12-15,25-27,32-39)

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("ESP32 aktif! Tekan tombol untuk bangunkan kapan saja.");
  Serial.println("Masuk Deep Sleep dalam 2 detik...");
  delay(2000);
  
  // Konfigurasi: bangun saat GPIO 33 = LOW (tombol ditekan ke GND)
  // ESP_EXT0_WAKEUP_LEVEL_LOW = bangun saat pin mendeteksi LOW
  esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_TOMBOL, 0);
  
  esp_deep_sleep_start();
}

void loop() {}
\`\`\`

---

## ⚠️ Hal Penting yang Sering Terlupakan

1. **RAM terhapus saat bangun** — gunakan \`RTC_DATA_ATTR\` untuk variabel yang perlu diingat
2. **Nomor pin terbatas** untuk wake-up eksternal — hanya pin RTC-capable
3. **Selalu \`Serial.flush()\`** sebelum tidur — agar data Serial tidak terpotong
4. **WiFi perlu reconnect** setiap bangun — butuh waktu ~1-2 detik tambahan
5. **Tambahkan delay(100)** di awal setup() — beri waktu ESP32 stabil

---

## 🛠️ Contoh Nyata: Sensor Kebun Otomatis

\`\`\`cpp
/*
 * Sensor suhu kebun yang bekerja 24/7 dengan baterai solar
 * Strategi: bangun setiap 5 menit, kirim data, tidur lagi
 */

#include <WiFi.h>
#include <HTTPClient.h>

RTC_DATA_ATTR int nomorData = 0;

const uint64_t INTERVAL_MENIT = 5; // Kirim data setiap 5 menit

void kirimDataKeServer(float suhu, float kelembapan) {
  WiFi.begin("WiFi_Saya", "Password_Saya");
  
  int percobaan = 0;
  while (WiFi.status() != WL_CONNECTED && percobaan < 20) {
    delay(500);
    percobaan++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "https://api.kebun-saya.com/data";
    url += "?suhu=" + String(suhu);
    url += "&lembap=" + String(kelembapan);
    url += "&id=" + String(nomorData);
    
    http.begin(url);
    int responseCode = http.GET();
    http.end();
    
    Serial.printf("Data #%d terkirim! Response: %d\\n", nomorData, responseCode);
  }
  
  WiFi.disconnect(true);
}

void setup() {
  Serial.begin(115200);
  delay(100);
  
  nomorData++;
  
  // Baca sensor (contoh nilai dummy)
  float suhu = 28.5;
  float kelembapan = 72.3;
  
  kirimDataKeServer(suhu, kelembapan);
  
  // Tidur 5 menit
  esp_sleep_enable_timer_wakeup(INTERVAL_MENIT * 60 * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}
\`\`\`

---

## 📝 Ringkasan

- Deep Sleep mematikan hampir semua komponen ESP32, hemat daya hingga 24.000x
- ESP32 bisa dibangunkan dengan Timer, Tombol, atau sentuhan
- \`RTC_DATA_ATTR\` untuk menyimpan variabel saat tidur
- Setelah bangun, program mulai dari \`setup()\` lagi (bukan \`loop()\`)
- Strategi tidur yang tepat = baterai bisa bertahan bertahun-tahun

> **Di pelajaran berikutnya, kita belajar Dual Core Processing — memanfaatkan 2 prosesor ESP32 sekaligus!** ⚡
`;
