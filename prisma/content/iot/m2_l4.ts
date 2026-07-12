export const iot_l4 = `
# Hello World IoT: Program LED Blink dari Nol

Tradisi di dunia programming: program pertama selalu "Hello World" — cetak teks ke layar. Di dunia hardware, equivalennya adalah **LED Blink** — nyalakan dan matikan LED secara berulang.

Terdengar sederhana, tapi ini mengajarkan konsep paling fundamental: cara memerintahkan ESP32 untuk mengeluarkan sinyal listrik ke dunia luar. Dari sini, kamu bisa kontrol apapun — relay, motor, buzzer, semua pakai prinsip yang sama.

---

## 💡 Digital Output: Cuma Dua Kemungkinan

"Digital" berarti hanya ada dua kondisi, tidak ada di antaranya:

\`\`\`
HIGH (1) = 3.3V dikirim ke pin = LED NYALA 💡
LOW  (0) = 0V dikirim ke pin  = LED MATI  ⚫
\`\`\`

Seperti saklar lampu biasa — tidak ada "setengah menyala". Nanti di pelajaran sensor analog, kita akan lihat cara baca nilai yang lebih kompleks.

---

## 🔧 Rangkaian LED (Opsional, ESP32 Punya LED Bawaan)

ESP32 sudah punya LED di GPIO2. Tapi kalau mau latihan pasang LED sendiri:

\`\`\`
ESP32 GPIO2 → Resistor 220Ω → LED (kaki panjang/+) → GND
\`\`\`

Kenapa perlu resistor? Tanpanya, arus yang masuk terlalu besar dan LED terbakar dalam hitungan detik. Resistor adalah pembatas arus.

---

## 💻 Program LED Blink Lengkap + Penjelasan

\`\`\`cpp
/*
 * Program: LED Blink Sederhana
 * Fungsi : Membuat LED berkedip setiap 1 detik
 * Board  : ESP32 DevKit V1
 */

// Definisikan nomor pin LED sebagai konstanta
// Konstanta = nilai yang tidak berubah selama program berjalan
const int PIN_LED = 2;  // GPIO 2 (LED bawaan ESP32)

// =========================================
// setup() - Dijalankan SEKALI saat booting
// =========================================
void setup() {
  // Mulai komunikasi Serial (untuk melihat pesan di komputer)
  // 115200 adalah kecepatan komunikasi (baud rate)
  Serial.begin(115200);
  
  // Konfigurasi PIN_LED sebagai OUTPUT
  // Artinya: pin ini akan MENGELUARKAN tegangan (bukan membaca)
  pinMode(PIN_LED, OUTPUT);
  
  // Cetak pesan ke Serial Monitor
  Serial.println("ESP32 siap! LED akan mulai berkedip...");
}

// =========================================
// loop() - Dijalankan TERUS-MENERUS
// =========================================
void loop() {
  // Nyalakan LED (kirim tegangan 3.3V ke pin)
  digitalWrite(PIN_LED, HIGH);
  Serial.println("LED: NYALA 💡");
  
  // Tunggu 1000 milidetik = 1 detik
  delay(1000);
  
  // Matikan LED (kirim tegangan 0V ke pin)
  digitalWrite(PIN_LED, LOW);
  Serial.println("LED: MATI ⚫");
  
  // Tunggu lagi 1 detik
  delay(1000);
}
\`\`\`

---

## 🔍 Memahami Setiap Baris

### \`const int PIN_LED = 2;\`
Kita memberi nama pada angka "2". Kenapa? Bayangkan jika nanti kita perlu ganti pin dari GPIO2 ke GPIO5 — kita cukup ubah satu baris ini, bukan mencari-cari angka "2" di seluruh program.

### \`Serial.begin(115200);\`
Membuka jalur komunikasi antara ESP32 dan komputer melalui USB. Angka 115200 adalah kecepatan data. **Pastikan sama di Serial Monitor!**

### \`pinMode(PIN_LED, OUTPUT);\`
Memberitahu ESP32: "Pin nomor 2 ini akan kita gunakan untuk OUTPUT (mengeluarkan sinyal)." Wajib dilakukan sebelum menggunakan pin.

### \`digitalWrite(PIN_LED, HIGH);\`
Perintah: "Berikan tegangan 3.3V ke pin 2." → LED nyala.

### \`delay(1000);\`
Perintah: "Berhenti dan tunggu selama 1000 milidetik (1 detik)." Selama delay, ESP32 tidak melakukan apa-apa.

---

## 👁️ Melihat Output di Serial Monitor

Setelah upload program:
1. Klik ikon **Serial Monitor** (kanan atas) atau tekan \`Ctrl+Shift+M\`
2. Pastikan baud rate di pojok kanan bawah = **115200**
3. Tekan tombol RESET di ESP32
4. Anda akan melihat:

\`\`\`
ESP32 siap! LED akan mulai berkedip...
LED: NYALA 💡
LED: MATI ⚫
LED: NYALA 💡
LED: MATI ⚫
...
\`\`\`

---

## 🎮 Tantangan: Modifikasi Program

Coba ubah program untuk efek berbeda:

### Tantangan 1: SOS Morse Code
\`\`\`cpp
// SOS = ... --- ... (pendek-pendek-pendek, panjang-panjang-panjang, pendek-pendek-pendek)
void loop() {
  // S = tiga kedipan pendek
  for(int i = 0; i < 3; i++) {
    digitalWrite(PIN_LED, HIGH); delay(200);
    digitalWrite(PIN_LED, LOW);  delay(200);
  }
  delay(500);
  
  // O = tiga kedipan panjang
  for(int i = 0; i < 3; i++) {
    digitalWrite(PIN_LED, HIGH); delay(600);
    digitalWrite(PIN_LED, LOW);  delay(200);
  }
  delay(500);
  
  // S = tiga kedipan pendek lagi
  for(int i = 0; i < 3; i++) {
    digitalWrite(PIN_LED, HIGH); delay(200);
    digitalWrite(PIN_LED, LOW);  delay(200);
  }
  delay(2000); // Jeda sebelum ulangi
}
\`\`\`

### Tantangan 2: Fade Effect (Dengan PWM)
\`\`\`cpp
// PWM = Pulse Width Modulation = cara "meredupkan" LED
// Nilai 0-255 (0 = mati, 255 = terang penuh)
void loop() {
  // Fade in (makin terang)
  for(int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(PIN_LED, brightness);
    delay(10);
  }
  
  // Fade out (makin redup)
  for(int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(PIN_LED, brightness);
    delay(10);
  }
}
\`\`\`

---

## 📊 Konsep Penting: Variabel vs Konstanta

| | Variabel | Konstanta |
|--|---------|-----------|
| Deklarasi | \`int angka = 5;\` | \`const int angka = 5;\` |
| Bisa diubah? | ✅ Ya | ❌ Tidak |
| Contoh penggunaan | Counter, sensor value | Nomor pin, kecepatan |

---

## 📝 Ringkasan

- \`pinMode(pin, OUTPUT)\` — set pin sebagai output
- \`digitalWrite(pin, HIGH)\` — nyalakan pin (3.3V)
- \`digitalWrite(pin, LOW)\` — matikan pin (0V)
- \`delay(ms)\` — tunggu dalam milidetik
- \`Serial.begin(115200)\` — buka komunikasi serial
- \`Serial.println("teks")\` — cetak teks ke komputer
- Selalu gunakan resistor saat menyambung LED!

> **Luar biasa! Anda sudah membuat program IoT pertama. Selanjutnya kita akan belajar membaca data dari sensor!** 🎉
`;
