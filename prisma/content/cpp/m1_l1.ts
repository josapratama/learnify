export const cpp_l1 = `
# Kenapa Harus Belajar C++? Bahasa yang Menggerakkan Dunia 🚀

Hei! Sebelum kita nulis satu baris kode pun, izinkan gue jelasin dulu sesuatu yang penting banget.

Kamu mungkin bertanya: *"Kenapa C++? Bukannya Python lebih gampang? Atau JavaScript lebih populer?"*

Pertanyaan bagus. Dan jawabannya bakal bikin kamu takjub.

---

## 🌍 C++ Ada di Mana-mana — Kamu Cuma Nggak Sadar

Saat ini, tanpa kamu sadari, C++ sedang bekerja keras di:

- 🎮 **Game yang kamu mainin** — GTA, Call of Duty, Unreal Engine 5 semuanya ditulis pakai C++
- 💻 **Sistem operasi** — Windows, macOS, Linux punya banyak bagian yang ditulis C++
- 🚗 **Mobil kamu** — software di ECU (otak mobil modern) pakai C++
- 📱 **HP kamu** — Android OS corenya pakai C++
- 🌐 **Internet** — Google Chrome, MySQL, MongoDB semuanya C++
- 🛸 **Luar angkasa** — NASA pakai C++ untuk sistem kontrol misi
- 🏦 **Sistem perbankan** — transaksi real-time butuh kecepatan C++

Bayangkan C++ seperti **mesin mobil balap Formula 1** — tidak semua orang bisa langsung nyetir, tapi yang bisa nyetir punya kekuatan dan kecepatan yang nggak tertandingi.

---

## ⚡ Kenapa C++ Itu Spesial?

### 1. Kecepatan yang Gila-gilaan

C++ bisa berjalan **10 sampai 100 kali lebih cepat** dari Python untuk tugas-tugas tertentu.

Kenapa? Karena C++ **dikompilasi langsung ke bahasa mesin**. Tidak ada perantara, tidak ada interpreter — komputer langsung baca instruksi C++ tanpa terjemahan tambahan.

\`\`\`
Python  → (interpreter) → instruksi mesin    [ada lapisan ekstra]
C++     → (compiler)    → instruksi mesin    [langsung, tidak ada lapisan]
\`\`\`

Analogi: Bayangkan kamu mau pesan makanan dari chef berbintang.
- Python = memesan lewat 3 orang perantara (ada delay)
- C++ = langsung ngobrol sama chef-nya (langsung dikerjakan)

### 2. Kontrol Penuh atas Hardware

C++ memberi kamu akses langsung ke **memori komputer**. Ini seperti perbedaan antara mengendarai mobil matic vs manual — manual lebih susah, tapi kamu punya kontrol penuh.

### 3. Dipakai di Industri Paling Demanding

Game engine, sistem embedded, high-frequency trading, robotik — semua bidang yang butuh performa ekstrem pilih C++.

### 4. Fondasi yang Kuat untuk Bahasa Lain

Setelah menguasai C++, belajar Java, C#, atau bahkan Python akan terasa **jauh lebih mudah** karena kamu sudah paham konsep fundamentalnya.

---

## 📊 Perbandingan C++ vs Bahasa Lain

| Aspek | Python | JavaScript | C++ |
|-------|--------|------------|-----|
| Kemudahan belajar | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Kecepatan eksekusi | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Kontrol hardware | ⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| Game development | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Sistem operasi | ⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| Embedded system | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |

---

## 🏁 Sejarah Singkat C++ (Biar Kamu Kenal Lebih Dalam)

C++ dibuat oleh **Bjarne Stroustrup** pada tahun **1979** di Bell Labs. Awalnya disebut "C with Classes" karena pada dasarnya adalah bahasa C yang ditambahkan fitur OOP (Object-Oriented Programming).

- **1983** — nama resmi berubah jadi C++
- **1998** — standar C++98 dirilis (pertama kali ada standar resmi)
- **2011** — C++11 merevolusi bahasa ini (banyak fitur modern)
- **2014, 2017, 2020** — update terus menerus hingga sekarang
- **2023** — C++23 adalah versi terbaru

Lebih dari **40 tahun** dan masih relevan! Ini membuktikan betapa fundamentalnya C++.

---

## 💻 Program C++ Pertama Kita: Hello, World!

Oke, sekarang saatnya lihat kode C++ pertama kita. Jangan panik kalau ada yang kelihatan aneh — kita akan jelaskan baris per baris!

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Halo, Selamat Belajar C++!" << endl;
    return 0;
}
\`\`\`

Sekarang mari kita bedah satu per satu:

**\`#include <iostream>\`**
→ Ini seperti kamu bilang "Hei, saya mau pakai alat untuk input/output ya!"
→ \`#include\` artinya "masukkan" dan \`iostream\` adalah library untuk tampilkan teks & terima input
→ Bayangkan ini seperti import peralatan dapur sebelum masak

**\`using namespace std;\`**
→ Ini bilang ke kompiler: "Pakai konvensi standar C++ ya, biar saya nggak perlu nulis panjang-panjang"
→ Tanpa ini, kamu harus nulis \`std::cout\` bukan cuma \`cout\`

**\`int main() {\`**
→ Ini adalah **pintu masuk** program kamu
→ Setiap program C++ HARUS punya \`main()\` — komputer mulai baca dari sini
→ \`int\` artinya fungsi ini akan "return" angka (bilangan bulat)
→ Tanda \`{\` menandai awal dari blok kode

**\`cout << "Halo, Selamat Belajar C++!" << endl;\`**
→ \`cout\` = "character output" — alat untuk mencetak teks ke layar
→ \`<<\` = operator untuk "kirim ke" — mengirim teks ke cout
→ \`"Halo..."\ = teks yang mau dicetak (harus diapit tanda kutip ganda)
→ \`endl\` = "end line" — sama seperti tekan Enter, pindah ke baris baru
→ Titik koma \`;\` di akhir = WAJIB! Ini seperti titik di akhir kalimat

**\`return 0;\`**
→ Program berjalan sukses, kembalikan nilai 0 ke sistem operasi
→ Nilai 0 = "oke, tidak ada masalah"

**\`}\`**
→ Tutup blok kode \`main()\`

---

## 🛠️ Setup: Install Compiler C++

Sebelum bisa jalankan kode C++, kamu butuh **compiler** — program yang menerjemahkan kode C++ menjadi bahasa mesin.

### Windows (Rekomendasi: MinGW-w64)

1. Download **Code::Blocks** dari: codeblocks.org (pilih yang bundled dengan MinGW)
2. Install seperti biasa
3. Buka Code::Blocks → buat project baru → pilih "Console Application" → C++

Atau bisa pakai **Visual Studio Code** + ekstensi C/C++:
1. Install VS Code dari code.visualstudio.com
2. Install MinGW dari winlibs.com (pilih versi win64)
3. Tambahkan path MinGW ke PATH environment variable
4. Install ekstensi "C/C++" di VS Code

### Online Compiler (Cara Termudah untuk Mulai!)

Kalau belum mau install apa-apa, pakai saja:
- **repl.it** → replit.com
- **OnlineGDB** → onlinegdb.com
- **Compiler Explorer** → godbolt.org

---

## 🧪 Struktur Dasar Program C++

Setiap program C++ yang kamu tulis akan punya kerangka seperti ini:

\`\`\`cpp
// Ini adalah komentar — tidak dijalankan, hanya catatan untuk manusia
// Gunakan // untuk komentar satu baris

/* 
   Ini komentar banyak baris
   bisa ditulis di beberapa baris
   seperti ini
*/

#include <iostream>   // Wajib untuk cout dan cin
using namespace std;  // Agar tidak perlu std:: di mana-mana

int main() {
    // Kode kamu ditulis di sini
    
    return 0;         // Akhiri program dengan sukses
}
\`\`\`

---

## 🎮 Analogi: C++ seperti LEGO Teknik

Bayangkan ada dua jenis LEGO:
- **LEGO biasa (Python)** — mudah dipasang, bisa bikin banyak hal, tapi terbatas dalam kerumitan konstruksi
- **LEGO Technic (C++)** — ada gear, motor, pneumatik, lebih susah dirakit, tapi bisa bikin mobil yang benar-benar bisa jalan, robot yang bergerak, mesin yang kompleks

C++ memberi kamu *semua potongan* untuk membangun apa saja — dari yang sederhana sampai yang paling kompleks di dunia teknologi.

---

## 🔥 Motivasi: Siapa yang Pakai C++ Sekarang?

- **Bjarne Stroustrup** (pembuat C++) masih aktif mengembangkan bahasa ini
- **Google, Microsoft, Apple** — semua pakai C++ di core product mereka
- **Epic Games** — Unreal Engine, engine di balik game AAA terbesar, 100% C++
- **CERN** — menganalisis data dari Large Hadron Collider pakai C++
- **Tesla** — software mobil listrik mereka pakai C++
- **SpaceX** — software roket Falcon 9 menggunakan C++

---

## 📝 Latihan Pertama

Coba tulis dan jalankan program ini:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Nama saya: [isi nama kamu]" << endl;
    cout << "Saya belajar C++ karena: [alasan kamu]" << endl;
    cout << "Target saya: [target kamu]" << endl;
    return 0;
}
\`\`\`

Ganti teks dalam tanda \`[...]\` dengan jawaban kamu sendiri. Ini program C++ pertamamu!

**Yang perlu dicoba selanjutnya:**
1. Coba hapus titik koma \`;\` di salah satu baris — perhatikan error yang muncul
2. Coba hapus \`return 0;\` — apakah masih jalan?
3. Tambahkan baris \`cout\` baru dengan teks sesukamu

---

## 📌 Ringkasan Pelajaran 1

- C++ adalah bahasa pemrograman yang dipakai untuk game, OS, embedded system, robotik
- C++ menghasilkan program yang sangat cepat karena dikompilasi langsung ke kode mesin
- Setiap program C++ dimulai dari fungsi \`main()\`
- \`cout\` untuk cetak ke layar, diakhiri dengan \`;\`
- \`#include <iostream>\` wajib ada untuk input/output
- Komentar pakai \`//\` (satu baris) atau \`/* */\` (banyak baris)

> **Di pelajaran berikutnya, kita masuk ke inti C++: variabel, tipe data, dan cara berinteraksi dengan pengguna lewat \`cin\`. Seru banget!** 💡
`;
