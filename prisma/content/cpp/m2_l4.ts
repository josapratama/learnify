export const cpp_l4 = `
# Fungsi di C++ — Bikin Kode yang Bisa Dipakai Berkali-kali

Pelajaran sebelumnya kita sudah bisa kontrol alur program dengan if/else dan loop. Sekarang naik level — kita belajar **fungsi**.

Bayangin kamu kerja di kantor. Setiap hari kamu harus hitung gaji karyawan dengan rumus yang sama. Apakah kamu tulis rumus itu berulang-ulang setiap kali? Tentu tidak — kamu buat formula di Excel sekali, lalu tinggal pakai terus.

Itulah fungsi dalam programming: **tulis sekali, pakai berkali-kali**.

---

## 🎯 Kenapa Fungsi Itu Penting?

Tanpa fungsi, kode kamu akan jadi seperti ini:

\`\`\`cpp
// Tanpa fungsi — kode berulang, berantakan
int main() {
    // Hitung luas lingkaran pertama
    double r1 = 5.0;
    double luas1 = 3.14159 * r1 * r1;
    cout << "Luas 1: " << luas1 << endl;

    // Hitung luas lingkaran kedua — COPY PASTE!
    double r2 = 7.0;
    double luas2 = 3.14159 * r2 * r2;
    cout << "Luas 2: " << luas2 << endl;

    // Kalau ada 100 lingkaran... alamak 😅
}
\`\`\`

Dengan fungsi, jauh lebih rapi:

\`\`\`cpp
// Dengan fungsi — tulis sekali, pakai berkali-kali
double hitungLuasLingkaran(double jariJari) {
    return 3.14159 * jariJari * jariJari;
}

int main() {
    cout << "Luas 1: " << hitungLuasLingkaran(5.0) << endl;
    cout << "Luas 2: " << hitungLuasLingkaran(7.0) << endl;
    cout << "Luas 3: " << hitungLuasLingkaran(10.0) << endl;
    // Mau 100 lingkaran? Tinggal panggil terus!
}
\`\`\`

---

## 📐 Anatomi Fungsi di C++

\`\`\`cpp
// Struktur fungsi:
// tipeReturn namaFungsi(parameter1, parameter2, ...) {
//     isi fungsi
//     return nilai;
// }

// Contoh:
int tambah(int a, int b) {
    int hasil = a + b;
    return hasil;   // Kembalikan hasilnya
}

// Penjelasan:
// - "int"    = tipe data yang dikembalikan fungsi ini (integer)
// - "tambah" = nama fungsi (bebas, tapi harus deskriptif)
// - "int a"  = parameter pertama bernama a, tipe integer
// - "int b"  = parameter kedua bernama b, tipe integer
// - "return" = kata kunci untuk mengembalikan nilai
\`\`\`

---

## 🔧 Berbagai Jenis Fungsi

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

// 1. Fungsi yang mengembalikan nilai (return value)
double hitungDiskon(double harga, double persen) {
    double diskon = harga * (persen / 100.0);
    return harga - diskon;
}

// 2. Fungsi void — tidak mengembalikan nilai, cukup lakukan sesuatu
void cetakGarisHias() {
    cout << "================================" << endl;
}

void cetakSalam(string nama) {
    cout << "Halo, " << nama << "! Selamat datang!" << endl;
}

// 3. Fungsi dengan nilai default — parameter opsional
double hitungPPN(double harga, double persenPPN = 11.0) {
    // Kalau persenPPN tidak diisi, otomatis pakai 11.0
    return harga * (1 + persenPPN / 100.0);
}

int main() {
    // Panggil fungsi dengan return value
    double hargaSetelahDiskon = hitungDiskon(200000, 20);
    cout << "Harga setelah diskon: Rp " << hargaSetelahDiskon << endl;
    // Output: Harga setelah diskon: Rp 160000

    // Panggil fungsi void
    cetakGarisHias();
    cetakSalam("Budi");
    cetakGarisHias();

    // Panggil dengan dan tanpa nilai default
    cout << "PPN default: Rp " << hitungPPN(100000) << endl;       // Pakai 11%
    cout << "PPN 5%: Rp " << hitungPPN(100000, 5) << endl;         // Pakai 5%
    cout << "PPN 12%: Rp " << hitungPPN(100000, 12) << endl;       // Pakai 12%

    return 0;
}
\`\`\`

---

## 📦 Pass by Value vs Pass by Reference

Ini konsep penting yang sering bikin bingung. Analogi dulu:

**Pass by Value** = kamu kasih teman FOTOKOPI dokumennya. Dia bisa coret-coret fotokopinya, tapi dokumen aslimu tetap aman.

**Pass by Reference** = kamu kasih teman DOKUMEN ASLINYA. Kalau dia ubah, dokumen aslimu juga berubah.

\`\`\`cpp
#include <iostream>
using namespace std;

// Pass by VALUE — fungsi dapat salinan, nilai asli tidak berubah
void cobaUbahValue(int angka) {
    angka = angka * 2;    // Hanya ubah salinan!
    cout << "Di dalam fungsi: " << angka << endl;
}

// Pass by REFERENCE — fungsi dapat referensi ke variabel asli
void cobaUbahReference(int &angka) {  // Tanda & = reference
    angka = angka * 2;    // Ubah yang asli!
    cout << "Di dalam fungsi: " << angka << endl;
}

// Contoh nyata: fungsi tukar dua angka
void tukar(int &a, int &b) {
    int temp = a;   // Simpan a sementara
    a = b;          // a dapat nilai b
    b = temp;       // b dapat nilai a yang disimpan
}

int main() {
    int x = 10;

    cobaUbahValue(x);
    cout << "Setelah cobaUbahValue: x = " << x << endl;
    // Output: x tetap 10! (tidak berubah)

    cobaUbahReference(x);
    cout << "Setelah cobaUbahReference: x = " << x << endl;
    // Output: x = 20 (berubah!)

    int p = 5, q = 8;
    cout << "Sebelum tukar: p=" << p << ", q=" << q << endl;
    tukar(p, q);
    cout << "Setelah tukar: p=" << p << ", q=" << q << endl;
    // Output: p=8, q=5

    return 0;
}
\`\`\`

---

## 🔄 Rekursi — Fungsi yang Memanggil Dirinya Sendiri

\`\`\`cpp
#include <iostream>
using namespace std;

// Faktorial: 5! = 5 × 4 × 3 × 2 × 1 = 120
// Polanya: n! = n × (n-1)!
long long faktorial(int n) {
    if (n <= 1) return 1;          // Base case — berhenti di sini
    return n * faktorial(n - 1);   // Panggil diri sendiri dengan n lebih kecil
}

// Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21...
int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    for (int i = 1; i <= 10; i++) {
        cout << i << "! = " << faktorial(i) << endl;
    }

    cout << "\nDeret Fibonacci: ";
    for (int i = 0; i < 10; i++) {
        cout << fibonacci(i) << " ";
    }
    cout << endl;

    return 0;
}
\`\`\`

---

## 🏦 Praktik: Sistem Kasir Toko

\`\`\`cpp
#include <iostream>
#include <string>
#include <iomanip>   // Untuk setprecision
using namespace std;

// Fungsi hitung total belanja
double hitungTotal(double harga, int qty) {
    return harga * qty;
}

// Fungsi hitung diskon berdasarkan total
double hitungDiskon(double total) {
    if (total >= 500000)  return total * 0.15;   // Diskon 15% kalau >= 500rb
    if (total >= 200000)  return total * 0.10;   // Diskon 10% kalau >= 200rb
    if (total >= 100000)  return total * 0.05;   // Diskon 5% kalau >= 100rb
    return 0;                                     // Tidak ada diskon
}

// Fungsi hitung PPN
double hitungPPN(double total) {
    return total * 0.11;   // PPN 11%
}

// Fungsi cetak struk
void cetakStruk(string namaProduk, double harga, int qty) {
    double subtotal = hitungTotal(harga, qty);
    double diskon   = hitungDiskon(subtotal);
    double setelahDiskon = subtotal - diskon;
    double ppn      = hitungPPN(setelahDiskon);
    double totalBayar = setelahDiskon + ppn;

    cout << fixed << setprecision(0);   // Tampilkan tanpa desimal
    cout << "\n========== STRUK PEMBELIAN ==========" << endl;
    cout << "Produk  : " << namaProduk << endl;
    cout << "Harga   : Rp " << harga << " x " << qty << " pcs" << endl;
    cout << "Subtotal: Rp " << subtotal << endl;

    if (diskon > 0) {
        cout << "Diskon  : Rp -" << diskon << endl;
    }

    cout << "PPN 11% : Rp " << ppn << endl;
    cout << "--------------------------------------" << endl;
    cout << "TOTAL   : Rp " << totalBayar << endl;
    cout << "======================================" << endl;
}

int main() {
    string nama;
    double harga;
    int qty;

    cout << "=== KASIR TOKO DIGITAL ===" << endl;
    cout << "Nama produk : ";
    getline(cin, nama);
    cout << "Harga satuan: Rp ";
    cin >> harga;
    cout << "Jumlah beli : ";
    cin >> qty;

    cetakStruk(nama, harga, qty);

    return 0;
}
\`\`\`

**Output contoh:**
\`\`\`
=== KASIR TOKO DIGITAL ===
Nama produk : Sepatu Nike
Harga satuan: Rp 350000
Jumlah beli : 2

========== STRUK PEMBELIAN ==========
Produk  : Sepatu Nike
Harga   : Rp 350000 x 2 pcs
Subtotal: Rp 700000
Diskon  : Rp -105000
PPN 11% : Rp 65450
--------------------------------------
TOTAL   : Rp 660450
======================================
\`\`\`

---

## 📝 Ringkasan

- Fungsi dibuat dengan: \`tipeReturn namaFungsi(parameter) { ... return nilai; }\`
- Fungsi \`void\` tidak mengembalikan nilai
- **Pass by value**: fungsi dapat salinan, nilai asli aman
- **Pass by reference** (\`&\`): fungsi dapat akses ke variabel asli
- Default parameter: nilai otomatis kalau parameter tidak diisi
- Rekursi: fungsi memanggil dirinya sendiri (butuh base case!)

> **Selanjutnya: OOP (Object-Oriented Programming) — cara bikin program yang lebih terstruktur dengan class dan object!** 🚀
`;
