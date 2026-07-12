export const cpp_l7 = `
# Pointer & Memori — Kunci Memahami Cara Kerja Komputer

Ini topik yang bikin banyak orang menyerah belajar C++. Tapi percayalah — kalau kamu ngerti pointer, kamu akan punya pemahaman yang jauh lebih dalam tentang bagaimana komputer bekerja dibanding kebanyakan programmer.

---

## 🤔 Kenapa Pointer Penting?

Bayangin sebuah kota besar. Setiap rumah punya **alamat** (misalnya "Jl. Sudirman No. 25"). Kalau kamu mau kirim paket ke seseorang, kamu tidak perlu bawa orangnya ke kantor pos — kamu cukup tahu alamatnya.

Pointer di C++ persis seperti itu. **Pointer adalah variabel yang menyimpan alamat memori** dari variabel lain. Bukan nilainya — tapi lokasinya di memori.

---

## 📍 Alamat Memori

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int angka = 42;

    // & = "address of" — ambil alamat memori variabel
    cout << "Nilai angka     : " << angka << endl;
    cout << "Alamat angka    : " << &angka << endl;
    // Output: Alamat angka : 0x7ffee4b2c  (angka hex, beda tiap komputer)

    double harga = 150000.0;
    cout << "Alamat harga    : " << &harga << endl;

    // Setiap variabel punya alamat unik di memori
    return 0;
}
\`\`\`

---

## 🔑 Deklarasi dan Penggunaan Pointer

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int angka = 42;

    // Deklarasi pointer: tipe* namaPointer
    int* ptr;          // ptr adalah pointer ke integer

    // Arahkan pointer ke alamat angka
    ptr = &angka;      // ptr sekarang "menunjuk" ke angka

    cout << "Nilai angka      : " << angka << endl;   // 42
    cout << "Alamat angka     : " << &angka << endl;  // Alamat memori
    cout << "Nilai ptr        : " << ptr << endl;     // Sama dengan &angka
    cout << "Nilai di ptr (*) : " << *ptr << endl;    // 42 (dereferencing)

    // * di depan pointer = ambil nilai yang ditunjuk (dereference)
    *ptr = 100;   // Ubah nilai angka LEWAT pointer
    cout << "Angka setelah *ptr = 100: " << angka << endl;   // 100!

    // nullptr — pointer yang tidak menunjuk ke mana-mana (aman!)
    int* kosong = nullptr;
    // *kosong  ← JANGAN! Ini crash (segmentation fault)

    return 0;
}
\`\`\`

---

## 🏗️ Pointer dan Array

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40, 50};

    // Nama array sendiri adalah pointer ke elemen pertama!
    int* ptr = arr;     // Sama dengan: int* ptr = &arr[0]

    cout << "arr[0]  = " << arr[0]  << endl;   // 10
    cout << "*ptr    = " << *ptr     << endl;   // 10 (sama)
    cout << "*(ptr+1)= " << *(ptr+1) << endl;   // 20 (elemen ke-2)
    cout << "*(ptr+2)= " << *(ptr+2) << endl;   // 30 (elemen ke-3)

    // Iterasi array dengan pointer
    cout << "Iterasi dengan pointer: ";
    for (int* p = arr; p < arr + 5; p++) {
        cout << *p << " ";    // Naik satu elemen tiap iterasi
    }
    cout << endl;
    // Output: 10 20 30 40 50

    return 0;
}
\`\`\`

---

## 🧠 Dynamic Memory — Alokasi Memori Manual

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Stack vs Heap:
    // Stack = memori otomatis (variabel biasa), terbatas ~1-8MB
    // Heap  = memori manual (new/delete), jauh lebih besar

    // Alokasi satu variabel di heap
    int* angka = new int;     // Alokasikan memori untuk int
    *angka = 42;
    cout << "Nilai: " << *angka << endl;
    delete angka;             // WAJIB! Bebaskan memori setelah selesai
    angka = nullptr;          // Hindari dangling pointer

    // Alokasi array di heap
    int n;
    cout << "Masukkan ukuran array: ";
    cin >> n;

    int* arr = new int[n];   // Array dengan ukuran yang ditentukan saat runtime!

    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }

    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    delete[] arr;    // Array: pakai delete[] (bukan delete)
    arr = nullptr;

    return 0;
}
\`\`\`

---

## 🔄 Pointer ke Fungsi

\`\`\`cpp
#include <iostream>
using namespace std;

// Fungsi yang parameternya menggunakan pointer
void gandakan(int* angka) {
    *angka = *angka * 2;   // Ubah nilai asli!
}

void isiArray(int* arr, int ukuran, int nilaiDefault) {
    for (int i = 0; i < ukuran; i++) {
        arr[i] = nilaiDefault;
    }
}

void tampilkanArray(const int* arr, int ukuran) {
    // const = jamin fungsi tidak akan ubah isi array
    for (int i = 0; i < ukuran; i++) {
        cout << arr[i];
        if (i < ukuran - 1) cout << ", ";
    }
    cout << endl;
}

int main() {
    int nilai = 10;
    cout << "Sebelum: " << nilai << endl;   // 10
    gandakan(&nilai);                        // Kirim alamat
    cout << "Sesudah: " << nilai << endl;   // 20

    int data[5];
    isiArray(data, 5, 99);
    tampilkanArray(data, 5);    // 99, 99, 99, 99, 99

    return 0;
}
\`\`\`

---

## 🎯 Smart Pointers (C++11) — Pointer yang Lebih Aman

\`\`\`cpp
#include <iostream>
#include <memory>    // Untuk smart pointers
using namespace std;

int main() {
    // unique_ptr — satu pemilik, otomatis hapus saat keluar scope
    unique_ptr<int> up = make_unique<int>(42);
    cout << "unique_ptr: " << *up << endl;
    // Tidak perlu delete! Otomatis bersih saat up keluar scope

    // shared_ptr — bisa punya banyak pemilik
    shared_ptr<int> sp1 = make_shared<int>(100);
    shared_ptr<int> sp2 = sp1;    // Keduanya menunjuk ke memori yang sama

    cout << "shared_ptr: " << *sp1 << endl;
    cout << "Jumlah pemilik: " << sp1.use_count() << endl;  // 2
    // Memori dibebaskan saat SEMUA shared_ptr menunjuknya hilang

    // Pointer ke struct/class
    struct Titik { int x, y; };
    unique_ptr<Titik> t = make_unique<Titik>();
    t->x = 10;     // -> untuk akses member lewat pointer
    t->y = 20;
    cout << "Titik: (" << t->x << ", " << t->y << ")" << endl;

    return 0;
}
\`\`\`

---

## 🎯 Praktik: Matrix 2D dengan Pointer

\`\`\`cpp
#include <iostream>
using namespace std;

// Buat matrix 2D secara dinamis
int** buatMatrix(int baris, int kolom) {
    int** m = new int*[baris];     // Array of pointers
    for (int i = 0; i < baris; i++) {
        m[i] = new int[kolom];      // Tiap baris punya array sendiri
        for (int j = 0; j < kolom; j++) {
            m[i][j] = (i * kolom) + j + 1;
        }
    }
    return m;
}

void tampilkanMatrix(int** m, int baris, int kolom) {
    for (int i = 0; i < baris; i++) {
        for (int j = 0; j < kolom; j++) {
            cout.width(4);
            cout << m[i][j];
        }
        cout << endl;
    }
}

void hapusMatrix(int** m, int baris) {
    for (int i = 0; i < baris; i++) {
        delete[] m[i];
    }
    delete[] m;
}

int main() {
    int baris, kolom;
    cout << "Ukuran matrix (baris kolom): ";
    cin >> baris >> kolom;

    int** matrix = buatMatrix(baris, kolom);
    tampilkanMatrix(matrix, baris, kolom);
    hapusMatrix(matrix, baris);

    return 0;
}
\`\`\`

---

## 📝 Ringkasan

- \`&variabel\` = alamat memori variabel
- \`int* ptr\` = deklarasi pointer ke int
- \`ptr = &angka\` = arahkan pointer ke alamat angka
- \`*ptr\` = dereferencing (ambil nilai yang ditunjuk)
- \`new\` / \`delete\` = alokasi/bebaskan memori heap
- \`nullptr\` = pointer kosong yang aman
- **Smart pointers** (\`unique_ptr\`, \`shared_ptr\`) = pointer modern yang auto-manage memori

> **Selanjutnya: STL (Standard Template Library) — struktur data dan algoritma siap pakai!** 🚀
`;
