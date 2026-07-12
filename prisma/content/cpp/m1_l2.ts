export const cpp_l2 = `
# Variabel, Tipe Data, dan Input/Output di C++ 📦

Oke, kamu sudah tahu *kenapa* C++ penting. Sekarang saatnya kita mulai ngoding beneran!

Di pelajaran ini kita bakal belajar hal yang paling fundamental: **cara menyimpan data** dan **cara berinteraksi dengan pengguna**. Tanpa dua hal ini, program kamu tidak bisa ngapa-ngapain.

---

## 📦 Variabel — Kotak Penyimpan Data

Variabel itu seperti **kotak berlabel** di gudang.

Bayangkan kamu punya gudang dengan kotak-kotak:
- Kotak bertuliskan "UMUR" → berisi angka 25
- Kotak bertuliskan "NAMA" → berisi teks "Budi"
- Kotak bertuliskan "GAJI" → berisi angka 5000000.50

Di C++, kotak-kotak itu adalah variabel. Dan setiap kotak harus punya **label jenis** yang jelas — apakah isinya angka bulat, angka desimal, teks, atau karakter.

---

## 🗂️ Tipe Data di C++

Ini yang bikin C++ berbeda dari Python — kamu **harus** bilang dulu tipe datanya sebelum pakai variabel.

### Tipe Data Angka Bulat

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int umur = 25;           // int = integer, angka bulat, range -2 miliar sampai +2 miliar
    short tahun = 2024;      // short = int kecil, hemat memori, range -32768 sampai 32767
    long penduduk = 270000000L; // long = int besar, untuk angka yang lebih besar
    
    cout << "Umur: " << umur << endl;
    cout << "Tahun: " << tahun << endl;
    cout << "Penduduk Indonesia: " << penduduk << endl;
    
    return 0;
}
\`\`\`

**Penjelasan:**
- \`int umur = 25;\` → buat kotak bernama "umur", tipe integer, isi dengan 25
- \`short\` → gunakan ini kalau kamu tahu nilainya tidak akan besar (hemat memori)
- \`L\` di belakang angka → memberitahu compiler ini adalah tipe \`long\`

### Tipe Data Angka Desimal

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    float harga = 15000.50f;    // float = angka desimal, presisi 7 digit
    double pi = 3.14159265358;  // double = angka desimal presisi tinggi, 15 digit
    
    cout << "Harga: " << harga << endl;
    cout << "Nilai Pi: " << pi << endl;
    
    return 0;
}
\`\`\`

**Penjelasan:**
- \`float\` → untuk desimal biasa, hemat memori, cocok untuk game (koordinat, dll)
- \`f\` di belakang angka → memberitahu compiler ini adalah \`float\`, bukan \`double\`
- \`double\` → lebih presisi dari float, gunakan untuk kalkulasi ilmiah atau keuangan
- Untuk kebanyakan kasus, lebih aman pakai \`double\`

### Tipe Data Karakter dan Boolean

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    char nilai = 'A';         // char = satu karakter, diapit tanda kutip TUNGGAL
    bool lulus = true;        // bool = hanya true atau false
    bool sudah_bayar = false;
    
    cout << "Nilai: " << nilai << endl;
    cout << "Lulus: " << lulus << endl;    // Akan cetak 1 (true) atau 0 (false)
    
    return 0;
}
\`\`\`

**Perhatikan perbedaan penting:**
- \`char\` pakai tanda kutip **tunggal**: \`'A'\`
- String (teks) pakai tanda kutip **ganda**: \`"Hello"\`

### Tipe Data Teks (String)

\`\`\`cpp
#include <iostream>
#include <string>   // Tambahkan ini untuk pakai string
using namespace std;

int main() {
    string nama = "Budi Santoso";
    string kota = "Jakarta";
    
    cout << "Nama: " << nama << endl;
    cout << "Kota: " << kota << endl;
    cout << "Tinggal di " << kota << endl;
    
    return 0;
}
\`\`\`

**Penting:** Untuk pakai \`string\`, tambahkan \`#include <string>\` di atas!

---

## 📊 Tabel Ringkas Tipe Data

| Tipe | Contoh | Ukuran | Dipakai untuk |
|------|--------|--------|---------------|
| \`int\` | \`int x = 10;\` | 4 bytes | Angka bulat umum |
| \`double\` | \`double d = 3.14;\` | 8 bytes | Angka desimal |
| \`float\` | \`float f = 1.5f;\` | 4 bytes | Desimal, hemat memori |
| \`char\` | \`char c = 'A';\` | 1 byte | Satu karakter |
| \`bool\` | \`bool b = true;\` | 1 byte | Benar/salah |
| \`string\` | \`string s = "hi";\` | variabel | Teks |

---

## 🔢 Operasi Matematika di C++

Setelah punya variabel, kita bisa melakukan perhitungan:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 3;
    
    cout << "Penjumlahan: " << a + b << endl;    // 13
    cout << "Pengurangan: " << a - b << endl;    // 7
    cout << "Perkalian: "   << a * b << endl;    // 30
    cout << "Pembagian: "   << a / b << endl;    // 3  (bukan 3.33! karena keduanya int)
    cout << "Modulo: "      << a % b << endl;    // 1  (sisa bagi: 10 dibagi 3 sisa 1)
    
    // Hati-hati pembagian int dengan int!
    double c = 10.0;
    double d = 3.0;
    cout << "Pembagian desimal: " << c / d << endl;  // 3.33333...
    
    return 0;
}
\`\`\`

**Yang penting diingat:**
- \`10 / 3\` dengan tipe int = **3** (dibulatkan ke bawah, bukan 3.33)
- Kalau mau hasil desimal, salah satu operandnya harus \`double\` atau \`float\`
- \`%\` (modulo) = sisa pembagian, sangat berguna di banyak algoritma

---

## ✏️ Cara Update Isi Variabel

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int skor = 0;
    cout << "Skor awal: " << skor << endl;    // 0
    
    skor = 100;           // Ganti nilai
    cout << "Setelah update: " << skor << endl;  // 100
    
    skor = skor + 50;     // Tambah 50 ke nilai sekarang
    cout << "Setelah tambah: " << skor << endl;  // 150
    
    skor += 25;           // Cara singkat: sama dengan skor = skor + 25
    cout << "Setelah += 25: " << skor << endl;   // 175
    
    skor++;               // Increment: tambah 1, sama dengan skor = skor + 1
    cout << "Setelah ++: " << skor << endl;      // 176
    
    skor--;               // Decrement: kurang 1
    cout << "Setelah --: " << skor << endl;      // 175
    
    return 0;
}
\`\`\`

**Shortcut yang sering dipakai:**
- \`skor += 25\` = \`skor = skor + 25\`
- \`skor -= 10\` = \`skor = skor - 10\`
- \`skor *= 2\`  = \`skor = skor * 2\`
- \`skor /= 2\`  = \`skor = skor / 2\`
- \`skor++\`     = \`skor = skor + 1\`
- \`skor--\`     = \`skor = skor - 1\`

---

## 🖨️ Output dengan cout

Kita sudah sering pakai \`cout\`, tapi mari kita pelajari lebih dalam:

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nama = "Andi";
    int umur = 22;
    double ipk = 3.75;
    
    // Cetak beberapa variabel dalam satu baris
    cout << "Nama: " << nama << ", Umur: " << umur << endl;
    
    // Endl vs \\n — keduanya pindah baris
    cout << "Baris pertama" << endl;
    cout << "Baris kedua\\n";           // \\n juga pindah baris
    cout << "Baris ketiga\\n\\n";        // dua kali \\n = satu baris kosong
    
    // Format output angka desimal
    cout << "IPK: " << ipk << endl;    // Default: 3.75
    
    return 0;
}
\`\`\`

**Perbedaan \`endl\` vs \`\\n\`:**
- Keduanya pindah ke baris baru
- \`endl\` juga membersihkan buffer (sedikit lebih lambat tapi lebih aman)
- \`\\n\` lebih cepat, cocok untuk output yang banyak

---

## ⌨️ Input dengan cin

Nah, sekarang bagian yang seru — program yang bisa menerima input dari pengguna!

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int umur;
    string nama;
    
    cout << "Masukkan nama Anda: ";
    cin >> nama;           // Terima input dari keyboard, simpan ke variabel nama
    
    cout << "Masukkan umur Anda: ";
    cin >> umur;           // Terima input angka, simpan ke variabel umur
    
    cout << "Halo, " << nama << "!" << endl;
    cout << "Umur kamu " << umur << " tahun." << endl;
    
    if (umur >= 17) {
        cout << "Kamu sudah boleh punya SIM." << endl;
    }
    
    return 0;
}
\`\`\`

**Output (contoh):**
\`\`\`
Masukkan nama Anda: Budi
Masukkan umur Anda: 20
Halo, Budi!
Umur kamu 20 tahun.
Kamu sudah boleh punya SIM.
\`\`\`

**Catatan penting tentang \`cin\`:**
- \`cin >> variabel\` → membaca input sampai ketemu spasi atau enter
- Kalau nama kamu "Budi Santoso" (ada spasi), \`cin\` hanya akan ambil "Budi"!

### Cara baca teks dengan spasi — getline

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nama_lengkap;
    
    cout << "Masukkan nama lengkap: ";
    getline(cin, nama_lengkap);   // getline baca seluruh baris termasuk spasi
    
    cout << "Selamat datang, " << nama_lengkap << "!" << endl;
    
    return 0;
}
\`\`\`

**Bedanya:**
- \`cin >> x\` → baca sampai spasi pertama
- \`getline(cin, x)\` → baca sampai Enter (termasuk spasi)

---

## 🔄 Konstanta — Variabel yang Tidak Boleh Berubah

Kadang kamu punya nilai yang tidak boleh diubah selama program berjalan, seperti nilai Pi atau konversi pajak:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    const double PI = 3.14159265358979;    // const = tidak bisa diubah
    const int MAX_LEVEL = 100;
    const double PAJAK_PPN = 0.11;         // 11%
    
    double jari_jari = 7.0;
    double luas = PI * jari_jari * jari_jari;
    
    cout << "Luas lingkaran (r=7): " << luas << endl;
    
    double harga = 100000;
    double harga_pajak = harga + (harga * PAJAK_PPN);
    cout << "Harga setelah pajak: " << harga_pajak << endl;
    
    // PI = 3.14;  // ERROR! Tidak bisa ubah konstanta
    
    return 0;
}
\`\`\`

**Kenapa pakai \`const\`?**
- Mencegah kamu tidak sengaja mengubah nilai penting
- Kode lebih mudah dibaca ("oh ini tidak berubah, pasti ini konstanta")
- Compiler bisa optimasi lebih baik

---

## 🧮 Program Kalkulator Sederhana

Mari gabungkan semua yang kita pelajari!

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    double angka1, angka2;
    
    cout << "=== Kalkulator Sederhana ===" << endl;
    cout << "Masukkan angka pertama: ";
    cin >> angka1;
    
    cout << "Masukkan angka kedua: ";
    cin >> angka2;
    
    cout << "\\n--- Hasil ---" << endl;
    cout << angka1 << " + " << angka2 << " = " << angka1 + angka2 << endl;
    cout << angka1 << " - " << angka2 << " = " << angka1 - angka2 << endl;
    cout << angka1 << " * " << angka2 << " = " << angka1 * angka2 << endl;
    
    if (angka2 != 0) {   // Hindari pembagian dengan nol!
        cout << angka1 << " / " << angka2 << " = " << angka1 / angka2 << endl;
    } else {
        cout << "Tidak bisa dibagi nol!" << endl;
    }
    
    return 0;
}
\`\`\`

**Output (contoh):**
\`\`\`
=== Kalkulator Sederhana ===
Masukkan angka pertama: 15
Masukkan angka kedua: 4

--- Hasil ---
15 + 4 = 19
15 - 4 = 11
15 * 4 = 60
15 / 4 = 3.75
\`\`\`

---

## 🧪 Latihan

**Latihan 1:** Buat program yang minta nama, umur, dan kota pengguna, lalu tampilkan profil singkatnya.

**Latihan 2:** Buat program konverter suhu. Minta input suhu dalam Celsius, tampilkan dalam Fahrenheit (rumus: F = C * 9/5 + 32).

**Latihan 3:** Buat program yang menghitung luas dan keliling persegi panjang. Input: panjang dan lebar.

**Contoh solusi Latihan 2:**
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    double celsius, fahrenheit;
    
    cout << "Masukkan suhu dalam Celsius: ";
    cin >> celsius;
    
    fahrenheit = celsius * 9.0 / 5.0 + 32.0;
    
    cout << celsius << "°C = " << fahrenheit << "°F" << endl;
    
    return 0;
}
\`\`\`

---

## 📌 Ringkasan Pelajaran 2

- **Variabel** = kotak penyimpan data, harus deklarasi tipe dulu di C++
- **int** = bilangan bulat, **double** = desimal, **char** = karakter, **bool** = true/false, **string** = teks
- \`cout <<\` untuk output, \`cin >>\` untuk input satu kata, \`getline()\` untuk input satu baris
- **const** untuk nilai yang tidak boleh berubah
- Operasi matematika: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (modulo)
- Hati-hati pembagian int dengan int — hasilnya juga int!

> **Pelajaran berikutnya: kita bakal belajar kontrol alur — bagaimana program bisa mengambil keputusan dengan if/else dan melakukan pengulangan dengan loop. Ini fondasi dari semua program nyata!** 🔀
`;
