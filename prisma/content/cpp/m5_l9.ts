export const cpp_l9 = `
# File I/O & Exception Handling — Baca Tulis File dan Tangani Error

Program yang bagus tidak hanya bisa menghitung, tapi juga bisa **menyimpan data ke file** dan **tidak crash saat ada yang salah**. Dua kemampuan ini yang kita pelajari sekarang.

---

## 📁 Baca & Tulis File

\`\`\`cpp
#include <iostream>
#include <fstream>     // File stream
#include <sstream>     // String stream
#include <string>
#include <vector>
using namespace std;

// ─── Tulis ke file ───
void tulisKeFile() {
    // ofstream = output file stream (tulis)
    ofstream file("data.txt");

    if (!file.is_open()) {
        cout << "Gagal buka file!" << endl;
        return;
    }

    file << "Nama,Umur,Kota" << endl;       // Header CSV
    file << "Budi,25,Jakarta" << endl;
    file << "Siti,28,Bandung" << endl;
    file << "Andi,22,Surabaya" << endl;

    file.close();   // Selalu close setelah selesai!
    cout << "File berhasil ditulis." << endl;
}

// ─── Baca dari file ───
void bacaFile() {
    // ifstream = input file stream (baca)
    ifstream file("data.txt");

    if (!file) {    // Cara singkat cek is_open
        cout << "File tidak ditemukan!" << endl;
        return;
    }

    string baris;
    int nomor = 0;
    while (getline(file, baris)) {    // Baca baris per baris
        cout << ++nomor << ". " << baris << endl;
    }

    file.close();
}

// ─── Append ke file (tambah di akhir, tidak timpa) ───
void appendKeFile() {
    ofstream file("data.txt", ios::app);    // ios::app = append mode
    file << "Dewi,30,Yogyakarta" << endl;
    file.close();
}

// ─── Baca file CSV ke vector ───
struct Orang {
    string nama;
    int umur;
    string kota;
};

vector<Orang> bacaCSV(const string& namaFile) {
    vector<Orang> hasil;
    ifstream file(namaFile);
    string baris;

    getline(file, baris);   // Skip header

    while (getline(file, baris)) {
        stringstream ss(baris);
        Orang o;
        string umurStr;

        getline(ss, o.nama,   ',');   // Baca sampai koma
        getline(ss, umurStr,  ',');
        getline(ss, o.kota,   ',');

        o.umur = stoi(umurStr);       // String ke integer
        hasil.push_back(o);
    }

    return hasil;
}

int main() {
    tulisKeFile();
    bacaFile();
    appendKeFile();

    auto orang = bacaCSV("data.txt");
    cout << "\nData yang dibaca:" << endl;
    for (const auto& o : orang) {
        cout << o.nama << " (" << o.umur << " tahun) dari " << o.kota << endl;
    }

    return 0;
}
\`\`\`

---

## 🚨 Exception Handling — Tangani Error dengan Elegan

\`\`\`cpp
#include <iostream>
#include <stdexcept>   // Untuk standar exception
#include <string>
using namespace std;

// Tanpa exception handling:
double bagi_berbahaya(double a, double b) {
    return a / b;   // Kalau b=0, hasil undefined (Inf atau NaN)
}

// Dengan exception handling:
double bagi_aman(double a, double b) {
    if (b == 0) {
        throw runtime_error("Tidak bisa bagi dengan nol!");
        // throw = lempar exception
    }
    return a / b;
}

void contohExceptionDasar() {
    // try = coba jalankan kode ini
    // catch = tangkap exception yang terjadi
    try {
        double hasil = bagi_aman(10.0, 0.0);
        cout << "Hasil: " << hasil << endl;  // Baris ini tidak akan dijalankan
    }
    catch (const runtime_error& e) {
        cout << "Error tertangkap: " << e.what() << endl;
        // Output: Error tertangkap: Tidak bisa bagi dengan nol!
    }

    cout << "Program tetap jalan setelah exception!" << endl;
}

// ─── Berbagai jenis exception ───
void berbagaiException(int pilihan) {
    try {
        if (pilihan == 1) {
            throw runtime_error("Error runtime!");
        }
        else if (pilihan == 2) {
            vector<int> v = {1, 2, 3};
            cout << v.at(10) << endl;    // out_of_range exception
        }
        else if (pilihan == 3) {
            string s = "abc";
            int n = stoi(s);             // invalid_argument exception
        }
    }
    catch (const out_of_range& e) {
        cout << "Indeks di luar batas: " << e.what() << endl;
    }
    catch (const invalid_argument& e) {
        cout << "Argumen tidak valid: " << e.what() << endl;
    }
    catch (const exception& e) {
        // Catch-all untuk exception standar
        cout << "Exception standar: " << e.what() << endl;
    }
    catch (...) {
        // Catch-all untuk exception apapun
        cout << "Exception tidak dikenal!" << endl;
    }
}
\`\`\`

---

## 🏗️ Custom Exception

\`\`\`cpp
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

// Buat exception sendiri yang lebih deskriptif
class SaldoTidakCukup : public runtime_error {
public:
    double saldoAda;
    double jumlahTarik;

    SaldoTidakCukup(double ada, double tarik)
        : runtime_error("Saldo tidak mencukupi"),
          saldoAda(ada), jumlahTarik(tarik) {}

    string pesanLengkap() const {
        return "Saldo Rp " + to_string((int)saldoAda) +
               " tidak cukup untuk tarik Rp " + to_string((int)jumlahTarik);
    }
};

class InputTidakValid : public invalid_argument {
public:
    explicit InputTidakValid(const string& pesan)
        : invalid_argument("Input tidak valid: " + pesan) {}
};

class RekeningBank {
    string pemilik;
    double saldo;

public:
    RekeningBank(const string& nama, double saldoAwal) {
        if (nama.empty()) throw InputTidakValid("nama tidak boleh kosong");
        if (saldoAwal < 0) throw InputTidakValid("saldo awal tidak boleh negatif");
        pemilik = nama;
        saldo   = saldoAwal;
    }

    void tarik(double jumlah) {
        if (jumlah <= 0) throw InputTidakValid("jumlah tarik harus positif");
        if (jumlah > saldo) throw SaldoTidakCukup(saldo, jumlah);
        saldo -= jumlah;
        cout << "Tarik Rp " << jumlah << " berhasil. Saldo: Rp " << saldo << endl;
    }
};

int main() {
    try {
        RekeningBank rek("Budi", 500000);

        rek.tarik(200000);   // OK
        rek.tarik(400000);   // Gagal: saldo kurang

    }
    catch (const SaldoTidakCukup& e) {
        cout << e.pesanLengkap() << endl;
    }
    catch (const InputTidakValid& e) {
        cout << e.what() << endl;
    }

    // finally di C++ = RAII (Resource Acquisition Is Initialization)
    // Destructor otomatis dipanggil saat objek keluar scope
    // Ini lebih reliable dari try-finally

    return 0;
}
\`\`\`

---

## 🔒 RAII — Resource Management Otomatis

\`\`\`cpp
#include <iostream>
#include <fstream>
using namespace std;

// RAII = resource dikelola lewat object
// Constructor: akuisisi resource
// Destructor: bebaskan resource (otomatis!)

class FileManager {
    ofstream file;
    string namaFile;

public:
    explicit FileManager(const string& nama) : namaFile(nama) {
        file.open(nama);
        if (!file.is_open()) {
            throw runtime_error("Gagal buka file: " + nama);
        }
        cout << "File " << nama << " dibuka." << endl;
    }

    ~FileManager() {
        // Destructor OTOMATIS dipanggil saat FileManager keluar scope
        if (file.is_open()) {
            file.close();
            cout << "File " << namaFile << " ditutup otomatis." << endl;
        }
    }

    void tulis(const string& teks) {
        file << teks << endl;
    }
};

void prosesData() {
    FileManager fm("output.txt");    // File dibuka
    fm.tulis("Data baris 1");
    fm.tulis("Data baris 2");

    // throw exception di sini pun, file TETAP ditutup!
    // Destructor ~FileManager() dipanggil otomatis

}   // ← fm destructor dipanggil di sini, file ditutup otomatis

int main() {
    try {
        prosesData();
    }
    catch (const exception& e) {
        cout << "Error: " << e.what() << endl;
    }

    return 0;
}
\`\`\`

---

## 📝 Ringkasan

- \`ofstream\` = tulis ke file, \`ifstream\` = baca dari file
- \`ios::app\` = mode append (tambah di akhir)
- \`getline(file, baris)\` = baca satu baris
- \`throw\` = lempar exception, \`try-catch\` = tangkap exception
- Custom exception: buat class turunan dari \`runtime_error\` atau \`exception\`
- **RAII**: resource dikelola lewat constructor/destructor, lebih aman dari manual

> **Selanjutnya: Template & Generic Programming — tulis kode yang bekerja untuk semua tipe data!** 🚀
`;
