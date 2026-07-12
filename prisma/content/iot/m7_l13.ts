export const iot_l13 = `
# SPIFFS — Cara Simpan Data di ESP32 agar Tidak Hilang

Ada satu masalah yang pasti kamu temui saat buat proyek IoT: **setiap kali ESP32 mati, semua data hilang**.

Variabel di kode? Hilang. Konfigurasi WiFi yang kamu simpan? Hilang. Log sensor sejam terakhir? Hilang.

Ini karena RAM itu *volatile* — isinya buyar begitu listrik mati. Untuk data yang harus tetap ada walau listrik mati, kita butuh penyimpanan permanen. Di sinilah SPIFFS masuk.

## 📁 Apa itu SPIFFS?

**SPIFFS** (Serial Peripheral Interface Flash File System) adalah sistem file yang memanfaatkan sebagian ruang dari chip flash ESP32 — chip yang sama tempat kode program disimpan.

Anggap saja ESP32 punya flashdisk kecil yang tertanam di dalamnya. Kamu bisa buat file, baca file, hapus file, seperti di komputer biasa.

\`\`\`
Total Flash ESP32 (biasanya 4MB):
├── ~1MB → Kode program (firmware kamu)
└── ~3MB → SPIFFS (tersedia untuk file-file kamu)
\`\`\`

3MB cukup untuk ribuan baris log atau ratusan file konfigurasi.

### Kapan SPIFFS Berguna?

| Kebutuhan | Tanpa SPIFFS | Dengan SPIFFS |
|-----------|-------------|--------------|
| Config WiFi | Hardcode di kode, ganti WiFi = upload ulang | Simpan di file, edit tanpa upload ulang |
| Kalibrasi sensor | Ulang kalibrasi tiap nyala | Simpan sekali, baca tiap nyala |
| Log data | Hilang saat mati lampu | Tersimpan aman |
| File HTML untuk web server | Membengkakkan kode | Simpan sebagai file terpisah |

---

## 🛠️ Memulai SPIFFS

\`\`\`cpp
#include "SPIFFS.h"

void setup() {
  Serial.begin(115200);
  
  // Mulai SPIFFS
  // Parameter 'true' = format ulang jika gagal mount (seperti format flashdisk)
  if (!SPIFFS.begin(true)) {
    Serial.println("❌ Gagal memulai SPIFFS!");
    return;
  }
  
  // Info penggunaan storage
  Serial.println("✅ SPIFFS berhasil dimulai!");
  Serial.printf("Total ruang : %d bytes\\n", SPIFFS.totalBytes());
  Serial.printf("Terpakai    : %d bytes\\n", SPIFFS.usedBytes());
  Serial.printf("Tersisa     : %d bytes\\n", SPIFFS.totalBytes() - SPIFFS.usedBytes());
}
\`\`\`

---

## ✍️ Menulis File

\`\`\`cpp
/*
 * Menulis konfigurasi ke file
 * Analogi: Mengisi buku catatan
 */
void tulisKonfigurasi() {
  // FILE_WRITE = buat baru / timpa file lama
  // FILE_APPEND = tambahkan ke akhir file
  File file = SPIFFS.open("/config.txt", FILE_WRITE);
  
  if (!file) {
    Serial.println("❌ Gagal membuka file untuk ditulis!");
    return;
  }
  
  // Tulis baris demi baris
  file.println("ssid=WiFi_Rumah_Saya");
  file.println("password=RahasiaBanget123");
  file.println("broker=broker.hivemq.com");
  file.println("port=1883");
  file.println("interval=30"); // Kirim data setiap 30 detik
  
  file.close(); // PENTING: selalu tutup file setelah selesai!
  Serial.println("✅ Konfigurasi tersimpan!");
}
\`\`\`

---

## 📖 Membaca File

\`\`\`cpp
/*
 * Membaca konfigurasi dari file
 * Analogi: Membaca buku catatan
 */
void bacaKonfigurasi() {
  File file = SPIFFS.open("/config.txt"); // Tanpa mode = READ
  
  if (!file) {
    Serial.println("❌ File tidak ditemukan!");
    return;
  }
  
  Serial.println("\\n=== Isi /config.txt ===");
  
  // Baca baris per baris
  while (file.available()) {
    String baris = file.readStringUntil('\\n');
    baris.trim(); // Hapus whitespace & newline
    Serial.println(baris);
  }
  
  file.close();
  Serial.println("========================\\n");
}
\`\`\`

---

## 🔄 Contoh Nyata: Simpan & Baca Konfigurasi WiFi

\`\`\`cpp
/*
 * Program: Konfigurasi WiFi tersimpan di SPIFFS
 * Manfaat: Ganti WiFi tanpa perlu upload ulang kode!
 */

#include "SPIFFS.h"
#include <WiFi.h>

String bacaNilaiKonfigurasi(const char* kunci) {
  File file = SPIFFS.open("/config.txt");
  if (!file) return "";
  
  while (file.available()) {
    String baris = file.readStringUntil('\\n');
    baris.trim();
    
    // Cari baris yang dimulai dengan "kunci="
    int posEqual = baris.indexOf('=');
    if (posEqual > 0) {
      String k = baris.substring(0, posEqual);
      String v = baris.substring(posEqual + 1);
      
      if (k == String(kunci)) {
        file.close();
        return v; // Kembalikan nilai
      }
    }
  }
  
  file.close();
  return ""; // Kunci tidak ditemukan
}

void setup() {
  Serial.begin(115200);
  
  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS gagal!");
    return;
  }
  
  // Baca konfigurasi
  String ssid     = bacaNilaiKonfigurasi("ssid");
  String password = bacaNilaiKonfigurasi("password");
  
  if (ssid == "") {
    Serial.println("⚠️ Config tidak ada! Membuat config default...");
    File file = SPIFFS.open("/config.txt", FILE_WRITE);
    file.println("ssid=GantiDenganWiFiAnda");
    file.println("password=GantiDenganPassword");
    file.close();
    Serial.println("Config dibuat. Silakan edit dan restart!");
    return;
  }
  
  Serial.printf("Menghubungkan ke WiFi: %s\\n", ssid.c_str());
  WiFi.begin(ssid.c_str(), password.c_str());
  
  int percobaan = 0;
  while (WiFi.status() != WL_CONNECTED && percobaan < 20) {
    delay(500);
    Serial.print(".");
    percobaan++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\n✅ WiFi terhubung!");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\\n❌ Gagal konek WiFi. Cek config.txt!");
  }
}

void loop() {}
\`\`\`

---

## 📊 Membuat Data Logger Sederhana

\`\`\`cpp
/*
 * Data Logger: Catat suhu setiap menit ke file CSV
 * Bisa dibuka di Excel!
 */

void catatLog(float suhu, float kelembapan) {
  File file = SPIFFS.open("/datalog.csv", FILE_APPEND);
  
  if (!file) {
    Serial.println("❌ Gagal buka file log!");
    return;
  }
  
  // Tulis dalam format CSV: timestamp,suhu,kelembapan
  unsigned long timestamp = millis() / 1000; // Detik sejak nyala
  file.printf("%lu,%.1f,%.1f\\n", timestamp, suhu, kelembapan);
  file.close();
  
  Serial.printf("📝 Log: %lus | Suhu: %.1f°C | Lembap: %.1f%%\\n",
                timestamp, suhu, kelembapan);
}

void bacaSemuaLog() {
  File file = SPIFFS.open("/datalog.csv");
  if (!file) return;
  
  Serial.println("\\n=== DATA LOG ===");
  Serial.println("Waktu(s),Suhu,Kelembapan");
  while (file.available()) {
    Serial.println(file.readStringUntil('\\n'));
  }
  file.close();
}

void hapusLog() {
  SPIFFS.remove("/datalog.csv");
  Serial.println("🗑️ Log dihapus!");
}
\`\`\`

---

## 📋 Operasi File SPIFFS Lengkap

\`\`\`cpp
// Cek apakah file ada
if (SPIFFS.exists("/config.txt")) {
  Serial.println("File ada!");
}

// Hapus file
SPIFFS.remove("/file_lama.txt");

// Ganti nama file
SPIFFS.rename("/file_lama.txt", "/file_baru.txt");

// List semua file
File root = SPIFFS.open("/");
File file = root.openNextFile();
while (file) {
  Serial.printf("📄 %s (%d bytes)\\n", file.name(), file.size());
  file = root.openNextFile();
}

// Format ulang (hapus semua!)
SPIFFS.format();
\`\`\`

---

## ⚠️ Batasan yang Perlu Diketahui

1. **Nama file maks 32 karakter** — termasuk path-nya
2. **Tidak ada folder nyata** — \`/folder/file.txt\` hanya nama panjang, bukan hirarki
3. **Flash punya batas siklus tulis** — sekitar 100.000x. Jangan tulis ke SPIFFS setiap detik, tulis saat ada perubahan saja
4. **SPIFFS vs LittleFS** — di proyek baru, pertimbangkan LittleFS yang lebih modern dan andal

---

## 📝 Ringkasan

SPIFFS = solusi simpan data permanen di ESP32 yang tidak hilang saat restart.

- \`SPIFFS.begin(true)\` untuk mulai, parameter \`true\` = format jika korup
- \`SPIFFS.open("/file.txt", FILE_WRITE)\` untuk menulis
- \`SPIFFS.open("/file.txt")\` untuk membaca
- Selalu \`file.close()\` setelah selesai — data baru benar-benar tersimpan setelah ini
- Cocok untuk: config, log, file HTML
- Tidak cocok untuk: data yang ditulis ribuan kali per hari

> **Di pelajaran berikutnya, kita belajar menggunakan SD Card untuk penyimpanan yang jauh lebih besar!** 💾
`;
