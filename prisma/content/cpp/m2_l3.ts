export const cpp_l3 = `
# Kontrol Alur: if/else, Switch, dan Loop di C++ 🔀

Sampai sekarang, program kita berjalan lurus — dari atas ke bawah, baris demi baris. Tapi program nyata tidak sesederhana itu.

Bayangkan ATM: kalau saldo cukup → boleh tarik uang. Kalau tidak cukup → tampilkan pesan error. Atau game: selama nyawa masih ada → lanjut main. Begitu habis → game over.

Di sinilah **kontrol alur** berperan — membuat program bisa *berpikir* dan *mengulang*.

---

## 🤔 if/else — Program yang Bisa Mengambil Keputusan

Struktur if/else itu persis seperti cara berpikir manusia:
- **"Kalau** nilai >= 60, **maka** cetak 'Lulus', **kalau tidak** cetak 'Tidak lulus'"

### if Sederhana

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int nilai;
    
    cout << "Masukkan nilai ujian (0-100): ";
    cin >> nilai;
    
    if (nilai >= 60) {          // Kondisi: apakah nilai >= 60?
        cout << "Selamat! Kamu LULUS." << endl;
    }
    
    return 0;
}
\`\`\`

**Penjelasan:**
- \`if (kondisi)\` → cek apakah kondisi benar (true)
- Kalau benar, jalankan kode di dalam \`{ }\`
- Kalau salah, lewati saja
- Tanda kurung kurawal \`{ }\` adalah blok if — semua kode di dalamnya dijalankan kalau kondisi true

### if-else

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int nilai;
    
    cout << "Masukkan nilai: ";
    cin >> nilai;
    
    if (nilai >= 60) {
        cout << "Lulus! Nilai kamu " << nilai << endl;
    } else {
        cout << "Tidak lulus. Nilai kamu " << nilai << endl;
        cout << "Perlu tambah " << (60 - nilai) << " poin lagi." << endl;
    }
    
    return 0;
}
\`\`\`

### if-else if-else (Banyak Kondisi)

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int nilai;
    
    cout << "Masukkan nilai (0-100): ";
    cin >> nilai;
    
    if (nilai >= 90) {
        cout << "Grade A — Excellent! 🏆" << endl;
    } else if (nilai >= 80) {
        cout << "Grade B — Good! 👍" << endl;
    } else if (nilai >= 70) {
        cout << "Grade C — Cukup bagus" << endl;
    } else if (nilai >= 60) {
        cout << "Grade D — Pas-pasan, tapi lulus" << endl;
    } else {
        cout << "Grade E — Tidak lulus, coba lagi ya!" << endl;
    }
    
    return 0;
}
\`\`\`

**Cara kerja:** Komputer cek dari atas ke bawah. Begitu menemukan kondisi yang benar, jalankan blok itu dan **lewati** semua else if/else di bawahnya.

---

## ⚖️ Operator Perbandingan dan Logika

### Operator Perbandingan

\`\`\`cpp
int a = 10, b = 20;

a == b   // Sama dengan?     false (10 tidak sama dengan 20)
a != b   // Tidak sama?      true
a < b    // Kurang dari?     true
a > b    // Lebih dari?      false
a <= b   // Kurang/sama?     true
a >= b   // Lebih/sama?      false
\`\`\`

**Jangan bingung \`=\` vs \`==\`:**
- \`=\`  → mengisi nilai (assignment): \`x = 5\`
- \`==\` → membandingkan nilai: \`x == 5\` → apakah x sama dengan 5?
- Ini salah ketik yang paling umum di C++!

### Operator Logika

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int umur = 25;
    bool punya_sim = true;
    double gaji = 8000000;
    
    // && = AND: kedua kondisi harus true
    if (umur >= 17 && punya_sim) {
        cout << "Boleh nyetir mobil." << endl;
    }
    
    // || = OR: salah satu kondisi true sudah cukup
    if (gaji > 10000000 || umur > 30) {
        cout << "Bisa apply kartu kredit premium." << endl;
    }
    
    // ! = NOT: membalik kondisi
    bool sedang_hujan = false;
    if (!sedang_hujan) {   // Kalau TIDAK hujan
        cout << "Ayo jalan-jalan!" << endl;
    }
    
    return 0;
}
\`\`\`

---

## 🔀 switch-case — Alternatif if untuk Banyak Pilihan

Kalau kamu punya banyak kondisi berdasarkan satu variabel, \`switch\` lebih rapi dari if/else if panjang:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int hari;
    
    cout << "Masukkan nomor hari (1-7): ";
    cin >> hari;
    
    switch (hari) {           // Cek nilai variabel 'hari'
        case 1:               // Kalau hari == 1
            cout << "Senin — Semangat awal minggu!" << endl;
            break;            // PENTING: hentikan di sini, jangan lanjut ke case berikutnya
        case 2:
            cout << "Selasa" << endl;
            break;
        case 3:
            cout << "Rabu — Hari tengah minggu!" << endl;
            break;
        case 4:
            cout << "Kamis" << endl;
            break;
        case 5:
            cout << "Jumat — Hari favorit semua orang! 🎉" << endl;
            break;
        case 6:
        case 7:               // Dua case bisa digabung tanpa break di antara
            cout << "Weekend! Saatnya istirahat." << endl;
            break;
        default:              // Kalau tidak ada yang cocok
            cout << "Nomor tidak valid (1-7 saja)." << endl;
    }
    
    return 0;
}
\`\`\`

**Penting: jangan lupa \`break\`!**
Tanpa \`break\`, setelah kode satu case dijalankan, program akan terus ke case berikutnya (disebut "fall-through"). Ini bug yang sering terjadi.

---

## 🔁 Loop — Pengulangan

Loop itu seperti instruksi "ulangi ini berkali-kali". Tanpa loop, kalau mau cetak angka 1-100, kamu harus tulis 100 baris \`cout\`!

### for Loop — Kalau Tahu Berapa Kali

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Sintaks: for (inisialisasi; kondisi; update)
    for (int i = 1; i <= 5; i++) {
        cout << "Iterasi ke-" << i << endl;
    }
    
    return 0;
}
\`\`\`

**Cara bacanya:**
- \`int i = 1\` → mulai dari i = 1
- \`i <= 5\` → selama i masih kurang dari atau sama dengan 5, terus lakukan
- \`i++\` → setiap selesai satu putaran, tambah i dengan 1
- Jadi: jalankan 5 kali (i=1, i=2, i=3, i=4, i=5)

**Contoh lebih nyata:**

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Hitung jumlah 1 sampai 100
    int jumlah = 0;
    for (int i = 1; i <= 100; i++) {
        jumlah += i;    // jumlah = jumlah + i
    }
    cout << "Jumlah 1 sampai 100 = " << jumlah << endl;  // 5050
    
    // Tabel perkalian 7
    cout << "\\nTabel perkalian 7:" << endl;
    for (int i = 1; i <= 10; i++) {
        cout << "7 x " << i << " = " << 7 * i << endl;
    }
    
    return 0;
}
\`\`\`

### while Loop — Kalau Tidak Tahu Berapa Kali

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int angka = 1;
    
    // Selama angka <= 5, lakukan
    while (angka <= 5) {
        cout << "Angka: " << angka << endl;
        angka++;    // PENTING: kalau lupa ini, loop jalan selamanya (infinite loop)!
    }
    
    return 0;
}
\`\`\`

**Kapan pakai while vs for?**
- \`for\` → kalau kamu tahu pasti berapa kali pengulangan
- \`while\` → kalau pengulangan bergantung pada kondisi yang tidak pasti

**Contoh while yang lebih realistis — tebak angka:**

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int rahasia = 42;
    int tebakan;
    int percobaan = 0;
    
    cout << "Tebak angka antara 1-100!" << endl;
    
    while (tebakan != rahasia) {     // Terus tanya selama belum benar
        cout << "Tebakan kamu: ";
        cin >> tebakan;
        percobaan++;
        
        if (tebakan < rahasia) {
            cout << "Terlalu kecil! Coba lagi." << endl;
        } else if (tebakan > rahasia) {
            cout << "Terlalu besar! Coba lagi." << endl;
        }
    }
    
    cout << "Benar! Angkanya " << rahasia << endl;
    cout << "Kamu butuh " << percobaan << " percobaan." << endl;
    
    return 0;
}
\`\`\`

### do-while Loop — Minimal Satu Kali

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int pilihan;
    
    do {
        cout << "\\nMenu:" << endl;
        cout << "1. Pilihan A" << endl;
        cout << "2. Pilihan B" << endl;
        cout << "0. Keluar" << endl;
        cout << "Pilih: ";
        cin >> pilihan;
        
        if (pilihan == 1) cout << "Kamu pilih A" << endl;
        if (pilihan == 2) cout << "Kamu pilih B" << endl;
        
    } while (pilihan != 0);    // Ulangi selama bukan 0
    
    cout << "Program selesai. Sampai jumpa!" << endl;
    
    return 0;
}
\`\`\`

**Perbedaan \`do-while\` vs \`while\`:**
- \`while\` → cek kondisi dulu, baru jalankan (bisa 0 kali kalau kondisi langsung false)
- \`do-while\` → jalankan dulu, baru cek kondisi (minimal satu kali pasti jalan)
- Cocok untuk menu yang harus ditampilkan minimal sekali

---

## ⛔ break dan continue

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // break — keluar dari loop sepenuhnya
    cout << "Contoh break:" << endl;
    for (int i = 1; i <= 10; i++) {
        if (i == 5) {
            cout << "Ketemu 5, berhenti!" << endl;
            break;    // Keluar dari loop
        }
        cout << i << " ";
    }
    cout << endl;
    // Output: 1 2 3 4 Ketemu 5, berhenti!
    
    // continue — skip iterasi ini, lanjut ke berikutnya
    cout << "\\nAngka ganjil 1-10:" << endl;
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {    // Kalau genap
            continue;         // Skip, lanjut ke i berikutnya
        }
        cout << i << " ";    // Hanya angka ganjil yang dicetak
    }
    cout << endl;
    // Output: 1 3 5 7 9
    
    return 0;
}
\`\`\`

---

## 🔄 Loop Bersarang (Nested Loop)

Loop di dalam loop! Bayangkan tabel — baris di dalam kolom:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Cetak tabel perkalian 1-5
    for (int baris = 1; baris <= 5; baris++) {       // Loop luar: baris
        for (int kolom = 1; kolom <= 5; kolom++) {   // Loop dalam: kolom
            cout << baris * kolom << "\\t";           // \\t = tab
        }
        cout << endl;   // Pindah baris setelah satu baris selesai
    }
    
    return 0;
}
\`\`\`

**Output:**
\`\`\`
1   2   3   4   5
2   4   6   8   10
3   6   9   12  15
4   8   12  16  20
5   10  15  20  25
\`\`\`

---

## 🧪 Latihan

**Latihan 1:** Buat program yang minta nilai 5 mata pelajaran, hitung rata-rata, dan tentukan apakah lulus (rata-rata >= 70).

**Latihan 2:** Buat program yang cetak pola bintang:
\`\`\`
*
**
***
****
*****
\`\`\`

**Latihan 3:** Buat game tebak angka dengan batas maksimal 7 percobaan. Kalau setelah 7 kali masih salah, tampilkan "Game Over".

**Solusi Latihan 2:**
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    for (int baris = 1; baris <= 5; baris++) {
        for (int bintang = 1; bintang <= baris; bintang++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
\`\`\`

---

## 📌 Ringkasan Pelajaran 3

- **if/else** → pengambilan keputusan berdasarkan kondisi
- **switch-case** → pilihan berganda dari satu variabel, jangan lupa \`break\`!
- **for loop** → ulang ketika tahu berapa kali (gunakan variabel counter)
- **while loop** → ulang selama kondisi benar (tidak tahu berapa kali)
- **do-while** → seperti while tapi dijamin minimal sekali jalan
- **break** → keluar dari loop, **continue** → skip iterasi sekarang
- **Operator:** \`&&\` (AND), \`||\` (OR), \`!\` (NOT), \`==\` (sama), \`!=\` (tidak sama)

> **Pelajaran berikutnya: kita pelajari Fungsi! Cara memecah program besar menjadi bagian-bagian kecil yang bisa dipakai berulang kali — prinsip paling penting di semua bahasa pemrograman.** 🧩
`;
