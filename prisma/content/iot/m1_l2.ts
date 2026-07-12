export const iot_l2 = `
# Mengenal ESP32 — Si Otak Kecil yang Powerful

ESP32 adalah komponen inti dari hampir semua proyek di kursus ini. Sebelum mulai coding, penting banget untuk kenal dulu "otak" yang akan kamu program.

Sederhananya: ESP32 adalah **komputer sangat kecil** yang bisa diprogram untuk mengontrol perangkat elektronik, membaca sensor, dan terhubung ke internet. Bedanya dari komputer biasa — ukurannya sepetak kartu nama, harganya Rp 50.000-an, dan bisa berjalan dari baterai.

---

## 📦 Spesifikasi yang Perlu Kamu Tahu

| Fitur | Nilai | Artinya |
|-------|-------|---------|
| Prosesor | Dual Core 240MHz | Bisa kerjakan 2 tugas sekaligus |
| RAM | 520 KB | Cukup untuk program IoT |
| Flash | 4 MB | Tempat menyimpan kode program |
| WiFi | 802.11 b/g/n | Konek WiFi rumah langsung |
| Bluetooth | BT 4.2 + BLE | Pair ke HP |
| GPIO | 34 pin | 34 "kaki" untuk kontrol perangkat |
| ADC | 12-bit | Baca sensor analog dengan presisi |
| Harga | ~Rp 30.000 - 80.000 | Sangat terjangkau |

---

## 🗺️ Peta Fisik ESP32 (Pinout)

\`\`\`
              ┌─────────────────────┐
         EN ──┤                     ├── GPIO23 (MOSI)
         VP ──┤                     ├── GPIO22 (SCL/I2C)
         VN ──┤      [  ESP32  ]    ├── TX0
      GPIO34 ──┤                     ├── RX0
      GPIO35 ──┤     [Antena]        ├── GPIO21 (SDA/I2C)
      GPIO32 ──┤                     ├── GND ◄── Ground
      GPIO33 ──┤                     ├── GPIO19 (MISO)
      GPIO25 ──┤                     ├── GPIO18 (SCK)
      GPIO26 ──┤                     ├── GPIO5
      GPIO27 ──┤                     ├── GPIO17
      GPIO14 ──┤                     ├── GPIO16
      GPIO12 ──┤                     ├── GPIO4
        GND ──┤                     ├── GPIO0
      GPIO13 ──┤                     ├── GPIO2 ◄── LED Bawaan
        SD2 ──┤                     ├── GPIO15
        SD3 ──┤                     ├── SD1
        CMD ──┤                     ├── SD0
         5V ──┤                     ├── CLK
              └─────────────────────┘
                     [ USB ]
\`\`\`

---

## 🔌 Kelompok Pin Penting

### 1. Pin Daya
| Pin | Fungsi | Tips Penggunaan |
|-----|--------|-----------------|
| 5V / VIN | Input daya dari USB | Jangan sambung langsung ke baterai >5V |
| 3.3V | Output tegangan 3.3V | Untuk sensor yang butuh 3.3V |
| GND | Ground (0V) | Selalu hubungkan GND sensor ke pin ini |

> 🔴 **PENTING!** ESP32 bekerja pada **3.3V**, bukan 5V. Sebagian besar sensor lama menggunakan 5V — jika disambung langsung, **ESP32 bisa rusak permanen!**

### 2. Pin GPIO (General Purpose Input/Output)
Seperti namanya, pin ini bisa berfungsi sebagai **input** (membaca) atau **output** (mengendalikan).

**Sebagai OUTPUT:**
- Menghidupkan/mematikan LED
- Mengendalikan relay (saklar elektronik)
- Menggerakkan buzzer (bel)

**Sebagai INPUT:**
- Membaca tombol tekan
- Membaca sinyal dari sensor digital

### 3. Pin ADC (Analog to Digital Converter)
Analogi: ADC seperti termometer yang mengubah panas (analog) menjadi angka di layar (digital).

Pin ADC ESP32 bisa membaca tegangan 0–3.3V dan mengubahnya menjadi angka 0–4095.

\`\`\`
Tegangan 0V    → Nilai ADC = 0
Tegangan 1.65V → Nilai ADC ≈ 2048
Tegangan 3.3V  → Nilai ADC = 4095
\`\`\`

**Digunakan untuk:** Sensor cahaya (LDR), potensiometer, sensor gas, dll.

### 4. Pin I2C (GPIO 21 & 22)
I2C adalah "bahasa komunikasi" untuk sensor-sensor pintar. Hanya butuh 2 kabel untuk bicara dengan puluhan sensor sekaligus.

- **SDA (GPIO 21)** = Jalur data
- **SCL (GPIO 22)** = Jalur clock (seperti metronom yang mengatur tempo komunikasi)

**Sensor I2C populer:** DHT20, BMP280, SSD1306 OLED, MPU6050

---

## ⚠️ Aturan Emas ESP32 (Wajib Diingat!)

1. **Tegangan maksimal GPIO = 3.3V** — melebihi ini bisa merusak chip
2. **Arus maksimal per pin = 40mA** — jangan hubungkan beban berat langsung
3. **GPIO 6-11 DILARANG digunakan** — dipakai untuk flash memory internal
4. **GPIO 0, 2, 5, 12 adalah "bootstrap pins"** — berpengaruh saat booting, hati-hati
5. **GPIO 34, 35, 36, 39 hanya INPUT** — tidak bisa digunakan sebagai output

---

## 🛒 Membeli ESP32 yang Tepat

Ada banyak varian ESP32 di pasaran. Untuk pemula, rekomendasikan:

| Varian | Harga | Cocok Untuk |
|--------|-------|-------------|
| ESP32 DevKit V1 | ~Rp 45.000 | Pemula, proyek umum ✅ |
| ESP32-S3 | ~Rp 65.000 | Butuh USB native, AI |
| ESP32-C3 | ~Rp 35.000 | Proyek hemat baterai |
| ESP32-CAM | ~Rp 75.000 | Proyek dengan kamera |

**Untuk kursus ini, gunakan ESP32 DevKit V1 (30-pin).**

---

## 🔧 Aksesori yang Diperlukan

Selain ESP32, Anda perlu:
- **Breadboard** (Rp 15.000) — papan percobaan tanpa solder
- **Kabel jumper** (Rp 15.000) — kabel pendek untuk menghubungkan komponen
- **Kabel micro USB** — untuk pemrograman dan daya
- **LED** beberapa biji (Rp 1.000) — untuk percobaan awal
- **Resistor 220Ω** beberapa biji (Rp 500) — pelindung LED

Total modal awal: **~Rp 150.000** sudah bisa mulai belajar IoT!

---

## 📝 Ringkasan

- ESP32 = komputer mini dengan WiFi+Bluetooth bawaan
- Bekerja pada 3.3V (bukan 5V — hati-hati!)
- Punya 34 GPIO untuk kontrol berbagai perangkat
- ADC untuk membaca sensor analog
- I2C untuk sensor pintar
- Harga terjangkau, cocok untuk pelajar dan hobbyist

> **Di pelajaran berikutnya, kita akan setup Arduino IDE dan menulis program pertama kita!** 💻
`;
