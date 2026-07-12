export const iot_l5 = `
# Membaca Sensor Digital: Tombol & PIR

Sejauh ini kita sudah bisa nyalain dan matiin LED — output yang kita kendalikan. Sekarang giliran kita belajar *input* — cara ESP32 membaca kondisi dari dunia luar.

Kita mulai dari yang paling sederhana: sensor digital. "Digital" di sini berarti sensornya cuma punya dua kemungkinan jawaban: **ya atau tidak**, **aktif atau tidak aktif**, **1 atau 0**.

Tidak ada nilai "setengah" atau "hampir". Persis seperti lampu — mati atau nyala.

---

## 🔘 Sensor Digital 1: Tombol (Push Button)

Tombol adalah sensor paling sederhana yang ada. Ditekan = koneksi tersambung = sinyal masuk. Dilepas = koneksi terputus = tidak ada sinyal.

### Kenapa Perlu Pull-Up Resistor?

Ada satu konsep yang bikin bingung di awal tapi penting: **pull-up resistor**.

Kalau kamu sambungkan tombol ke pin ESP32 tanpa pull-up, saat tombol tidak ditekan, pin itu "mengambang" — nilainya tidak jelas antara HIGH dan LOW. Hasilnya pembacaan acak yang nggak bisa diprediksi.

Bayangkan timbangan tanpa beban — jarumnya goyang sendiri. Pull-up resistor adalah "pemberat" yang membuat pin stabil di HIGH saat tidak ada input.

Kabar baiknya: ESP32 punya resistor pull-up **bawaan** yang bisa diaktifkan lewat kode. Tidak perlu tambah komponen apapun!

\`\`\`
Logika dengan Pull-Up Internal:
  Tombol ditekan  → Pin = LOW (0)   ✅ Pasti
  Tombol dilepas  → Pin = HIGH (1)  ✅ Pasti

  (Ini terbalik dari intuisi — ditekan = LOW — tapi wajar, nanti terbiasa)
\`\`\`

### Rangkaian & Program Tombol

**Koneksi:**
- Satu kaki tombol → GPIO 4
- Kaki lainnya → GND

\`\`\`cpp
/*
 * Program: Tombol kontrol LED
 * Tombol ditekan → LED nyala
 * Tombol dilepas → LED mati
 */

const int PIN_TOMBOL = 4;
const int PIN_LED    = 2;

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_LED, OUTPUT);
  
  // INPUT_PULLUP = aktifkan resistor pull-up bawaan ESP32
  // Ini yang membuat pin stabil saat tombol tidak ditekan
  pinMode(PIN_TOMBOL, INPUT_PULLUP);
  
  Serial.println("Siap membaca tombol...");
}

void loop() {
  int statusTombol = digitalRead(PIN_TOMBOL);
  
  if (statusTombol == LOW) {
    // LOW = tombol DITEKAN (ingat logika pull-up: ditekan = LOW)
    digitalWrite(PIN_LED, HIGH);
    Serial.println("Tombol DITEKAN → LED Nyala");
  } else {
    // HIGH = tombol DILEPAS
    digitalWrite(PIN_LED, LOW);
    Serial.println("Tombol Bebas → LED Mati");
  }
  
  delay(100);
}
\`\`\`

---

## � Debouncing — Masalah yang Sering Bikin Bingung

Coba kamu upload program tombol di atas, tekan sekali — kadang LED berkedip dua atau tiga kali. Ini bukan bug kode kamu, ini namanya **bouncing**.

Tombol fisik itu mekanis. Saat ditekan atau dilepas, kontaknya tidak langsung stabil — dia "memantul" beberapa kali dalam milidetik sebelum benar-benar tersambung. Efeknya: satu tekanan fisik terbaca sebagai beberapa tekanan di kode.

\`\`\`cpp
/*
 * Debouncing dengan millis() — cara yang benar
 * 
 * Idenya: jangan langsung proses perubahan. Tunggu dulu 50ms,
 * kalau kondisi masih sama, baru dianggap perubahan yang valid.
 */

const int PIN_TOMBOL = 4;
const int PIN_LED    = 2;

int statusLED = LOW;
int bacaanSebelumnya = HIGH;
unsigned long waktuPerubahan = 0;
const int DEBOUNCE_MS = 50;    // 50ms cukup untuk hampir semua tombol

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_TOMBOL, INPUT_PULLUP);
}

void loop() {
  int bacaanSekarang = digitalRead(PIN_TOMBOL);
  
  // Ada perubahan? Catat waktunya
  if (bacaanSekarang != bacaanSebelumnya) {
    waktuPerubahan = millis();
  }
  
  // Baru proses kalau perubahan sudah stabil selama 50ms
  if ((millis() - waktuPerubahan) > DEBOUNCE_MS) {
    if (bacaanSekarang == LOW) {
      // Toggle LED — nyala kalau mati, mati kalau nyala
      statusLED = (statusLED == LOW) ? HIGH : LOW;
      digitalWrite(PIN_LED, statusLED);
      Serial.println(statusLED == HIGH ? "LED Nyala!" : "LED Mati!");
    }
  }
  
  bacaanSebelumnya = bacaanSekarang;
}
\`\`\`

**Kenapa pakai \`millis()\` bukan \`delay()\`?** Karena \`delay()\` memblokir semua kode lain selama menunggu. \`millis()\` cuma ngecek waktu tanpa memblokir — program tetap bisa kerjakan hal lain sambil menunggu.

---

## 👁️ Sensor Digital 2: PIR — Detektor Gerakan

PIR (Passive Infrared) mendeteksi gerakan manusia berdasarkan perubahan panas inframerah yang dipancarkan tubuh kita. Sensor ini ada di mana-mana — lampu otomatis di parkiran, kamera keamanan, alarm rumah.

Cara kerjanya: PIR tidak memancarkan apapun, dia hanya *mendengarkan* perubahan pola panas di sekitarnya. Saat ada orang lewat, pola panas berubah → output HIGH.

**Spesifikasi modul PIR HC-SR501:**

| Parameter | Nilai |
|-----------|-------|
| Tegangan | 5V-12V (butuh 5V dari ESP32, bukan 3.3V!) |
| Output | HIGH saat ada gerakan, LOW saat tidak |
| Jangkauan | 3-7 meter |
| Sudut deteksi | 110° |

Di board PIR ada dua trimpot (sekrup kecil):
- **Sensitivity** — seberapa sensitif (putar kanan = lebih sensitif)
- **Time Delay** — berapa lama output tetap HIGH setelah deteksi

### Koneksi PIR

\`\`\`
PIR HC-SR501:
  VCC → Pin 5V ESP32    ← PENTING: gunakan 5V, bukan 3.3V!
  GND → Pin GND ESP32
  OUT → GPIO 5 ESP32
\`\`\`

### Program Alarm Gerak

\`\`\`cpp
/*
 * Program: Alarm gerakan dengan PIR
 * Ada gerakan → LED nyala + buzzer bunyi + notifikasi Serial
 */

const int PIN_PIR    = 5;
const int PIN_LED    = 2;
const int PIN_BUZZER = 4;    // Opsional, kalau ada buzzer

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_PIR,    INPUT);    // PIR sebagai input
  pinMode(PIN_LED,    OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  
  Serial.println("Sistem keamanan aktif!");
  Serial.println("Menunggu gerakan...");
}

void loop() {
  int gerak = digitalRead(PIN_PIR);
  
  if (gerak == HIGH) {
    // Ada gerakan!
    digitalWrite(PIN_LED, HIGH);
    
    // Bunyi alarm pendek 3 kali
    for(int i = 0; i < 3; i++) {
      digitalWrite(PIN_BUZZER, HIGH);
      delay(100);
      digitalWrite(PIN_BUZZER, LOW);
      delay(100);
    }
    
    Serial.println("⚠️ GERAKAN TERDETEKSI!");
    delay(2000);    // Tunggu sebentar sebelum cek lagi
    
  } else {
    digitalWrite(PIN_LED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
  }
  
  delay(100);
}
\`\`\`

---

## 📊 Ringkasan Sensor Digital

| Sensor | Deteksi | Output | Harga | Gunakan untuk |
|--------|---------|--------|-------|---------------|
| Push Button | Tekanan fisik | LOW saat ditekan | Rp 500 | Input dari pengguna |
| PIR HC-SR501 | Gerakan manusia | HIGH saat ada gerak | Rp 15.000 | Keamanan, hemat energi |
| Reed Switch | Magnet | LOW saat magnet dekat | Rp 3.000 | Sensor pintu/jendela |
| IR Obstacle | Penghalang | LOW saat ada objek | Rp 8.000 | Robot, parkir otomatis |

Tiga hal yang perlu selalu diingat di sensor digital:
1. Pakai \`INPUT_PULLUP\` untuk tombol supaya tidak mengambang
2. Tombol perlu debouncing untuk pembacaan yang stabil
3. PIR butuh 5V, bukan 3.3V

> **Di pelajaran berikutnya, kita masuk ke sensor analog — yang bisa membaca nilai dari 0 sampai 4095, bukan cuma 0 atau 1!** 📊
`;
