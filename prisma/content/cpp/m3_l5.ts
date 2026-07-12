export const cpp_l5 = `
# OOP di C++ — Berpikir Seperti Dunia Nyata

Sampai sini, cara kita nulis program masih seperti daftar instruksi dari atas ke bawah. **Object-Oriented Programming (OOP)** mengubah cara pikir itu jadi: *"Aku punya banyak 'benda', masing-masing benda punya sifat dan kemampuan sendiri."*

Kedengarannya abstrak? Tenang, analoginya sederhana banget.

---

## 🤔 Kenapa OOP?

Bayangkan kamu bikin game RPG. Ada banyak karakter: Warrior, Mage, Archer. Tanpa OOP, kamu harus buat variabel terpisah untuk setiap karakter:

\`\`\`cpp
// Tanpa OOP — ribet dan tidak terstruktur
string warrior_nama = "Arjuna";
int warrior_hp = 100;
int warrior_attack = 50;

string mage_nama = "Gandalf";
int mage_hp = 60;
int mage_attack = 80;

// Kalau ada 50 karakter... bayangkan kekacauannya!
\`\`\`

Dengan OOP, kamu buat satu "blueprint" bernama **Class**, lalu dari situ bisa buat banyak **Object**:

\`\`\`cpp
// Dengan OOP — rapi dan terstruktur
class Karakter {
public:
    string nama;
    int hp;
    int attack;
};

// Buat banyak karakter dari satu blueprint!
Karakter warrior = {"Arjuna", 100, 50};
Karakter mage    = {"Gandalf", 60, 80};
Karakter archer  = {"Legolas", 80, 70};
\`\`\`

---

## 🏗️ Class dan Object

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

// CLASS = blueprint / cetakan
class Mahasiswa {
public:
    // Atribut (data yang dimiliki)
    string nama;
    int nim;
    double ipk;
    string jurusan;

    // Method (kemampuan / aksi yang bisa dilakukan)
    void perkenalan() {
        cout << "Halo! Saya " << nama << endl;
        cout << "NIM     : " << nim << endl;
        cout << "Jurusan : " << jurusan << endl;
        cout << "IPK     : " << ipk << endl;
    }

    string statusKelulusan() {
        if (ipk >= 3.5) return "Cumlaude";
        if (ipk >= 3.0) return "Sangat Memuaskan";
        if (ipk >= 2.0) return "Memuaskan";
        return "Perlu Bimbingan";
    }
};

int main() {
    // OBJECT = instance dari class (benda nyata dari blueprint)
    Mahasiswa budi;
    budi.nama    = "Budi Santoso";
    budi.nim     = 12345678;
    budi.ipk     = 3.7;
    budi.jurusan = "Informatika";

    Mahasiswa siti;
    siti.nama    = "Siti Rahayu";
    siti.nim     = 87654321;
    siti.ipk     = 3.2;
    siti.jurusan = "Sistem Informasi";

    // Panggil method
    budi.perkenalan();
    cout << "Status: " << budi.statusKelulusan() << endl;
    cout << endl;
    siti.perkenalan();
    cout << "Status: " << siti.statusKelulusan() << endl;

    return 0;
}
\`\`\`

---

## 🔧 Constructor — Inisialisasi Otomatis

Constructor adalah method khusus yang **otomatis dijalankan saat object dibuat**. Namanya sama dengan nama class, dan tidak punya tipe return.

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

class RekeningBank {
public:
    string pemilik;
    string noRekening;
    double saldo;

    // Constructor — otomatis jalan saat object dibuat
    RekeningBank(string namaPemilik, string noRek, double saldoAwal) {
        pemilik     = namaPemilik;
        noRekening  = noRek;
        saldo       = saldoAwal;
        cout << "Rekening baru dibuat untuk: " << pemilik << endl;
    }

    // Method setor
    void setor(double jumlah) {
        if (jumlah <= 0) {
            cout << "Jumlah setor harus lebih dari 0!" << endl;
            return;
        }
        saldo += jumlah;
        cout << "Berhasil setor Rp " << jumlah << ". Saldo: Rp " << saldo << endl;
    }

    // Method tarik
    void tarik(double jumlah) {
        if (jumlah <= 0) {
            cout << "Jumlah tarik harus lebih dari 0!" << endl;
            return;
        }
        if (jumlah > saldo) {
            cout << "Saldo tidak mencukupi!" << endl;
            return;
        }
        saldo -= jumlah;
        cout << "Berhasil tarik Rp " << jumlah << ". Saldo: Rp " << saldo << endl;
    }

    void cekSaldo() {
        cout << "Saldo rekening " << pemilik << ": Rp " << saldo << endl;
    }
};

int main() {
    // Constructor dipanggil otomatis saat object dibuat
    RekeningBank rek1("Budi Santoso", "1234-5678", 500000);
    RekeningBank rek2("Siti Rahayu", "8765-4321", 1000000);

    rek1.setor(200000);
    rek1.tarik(100000);
    rek1.tarik(700000);   // Gagal! Saldo tidak cukup
    rek1.cekSaldo();

    cout << endl;
    rek2.cekSaldo();
    rek2.tarik(250000);
    rek2.cekSaldo();

    return 0;
}
\`\`\`

---

## 🔒 Encapsulation — Data yang Terlindungi

Encapsulation = menyembunyikan data dari akses luar. Bayangkan ATM — kamu bisa setor dan tarik, tapi kamu tidak bisa langsung akses database saldo banknya.

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

class SuhuKonverter {
private:
    // private = tidak bisa diakses dari luar class
    double celsius;

    // Validasi suhu (logika internal)
    bool validSuhu(double suhu) {
        return suhu >= -273.15;   // Suhu tidak bisa di bawah 0 Kelvin absolut
    }

public:
    // Setter — satu-satunya cara ubah nilai celsius dari luar
    void setCelsius(double suhu) {
        if (!validSuhu(suhu)) {
            cout << "Error: Suhu tidak valid (di bawah 0 Kelvin)" << endl;
            return;
        }
        celsius = suhu;
    }

    // Getter — cara baca nilai
    double getCelsius()    { return celsius; }
    double getFahrenheit() { return (celsius * 9.0 / 5.0) + 32; }
    double getKelvin()     { return celsius + 273.15; }

    void tampilkanSemua() {
        cout << "Celsius   : " << getCelsius() << " °C" << endl;
        cout << "Fahrenheit: " << getFahrenheit() << " °F" << endl;
        cout << "Kelvin    : " << getKelvin() << " K" << endl;
    }
};

int main() {
    SuhuKonverter konverter;
    konverter.setCelsius(100);
    konverter.tampilkanSemua();
    cout << endl;

    konverter.setCelsius(37);    // Suhu tubuh normal
    konverter.tampilkanSemua();
    cout << endl;

    konverter.setCelsius(-300);  // Error! Di bawah 0 Kelvin

    return 0;
}
\`\`\`

---

## 🧬 Inheritance — Turunkan Sifat dari Class Lain

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

// Class induk (parent)
class Kendaraan {
public:
    string merek;
    int tahunBuat;
    double kecepatan;

    Kendaraan(string m, int t) {
        merek      = m;
        tahunBuat  = t;
        kecepatan  = 0;
    }

    void gas(double tambahan) {
        kecepatan += tambahan;
        cout << merek << " melaju " << kecepatan << " km/h" << endl;
    }

    void rem() {
        kecepatan = 0;
        cout << merek << " berhenti." << endl;
    }

    virtual void info() {   // virtual = bisa di-override anak
        cout << "Kendaraan: " << merek << " (" << tahunBuat << ")" << endl;
    }
};

// Class anak — mewarisi semua dari Kendaraan
class Mobil : public Kendaraan {
public:
    int jumlahPintu;

    Mobil(string m, int t, int pintu) : Kendaraan(m, t) {
        // : Kendaraan(m, t) = panggil constructor parent
        jumlahPintu = pintu;
    }

    // Override method info dari parent
    void info() override {
        cout << "Mobil: " << merek << " (" << tahunBuat << ") "
             << jumlahPintu << " pintu" << endl;
    }

    void klakson() {
        cout << merek << ": Tin tin! 🚗" << endl;
    }
};

class Motor : public Kendaraan {
public:
    bool adaSidecar;

    Motor(string m, int t) : Kendaraan(m, t) {
        adaSidecar = false;
    }

    void info() override {
        cout << "Motor: " << merek << " (" << tahunBuat << ")" << endl;
    }

    void klakson() {
        cout << merek << ": Bim bim! 🏍️" << endl;
    }
};

int main() {
    Mobil avanza("Toyota Avanza", 2022, 4);
    Motor vario("Honda Vario", 2023);

    avanza.info();
    avanza.gas(60);       // Method dari parent
    avanza.klakson();     // Method dari Mobil sendiri
    avanza.rem();

    cout << endl;

    vario.info();
    vario.gas(80);
    vario.klakson();
    vario.rem();

    return 0;
}
\`\`\`

---

## 📝 Ringkasan

OOP adalah cara berpikir yang lebih alami — seperti dunia nyata dimana ada banyak "benda" dengan sifat dan kemampuan masing-masing:

- **Class** = blueprint / cetakan
- **Object** = benda nyata yang dibuat dari class
- **Constructor** = method yang otomatis jalan saat object dibuat
- **Encapsulation** = sembunyikan data internal, beri akses lewat method
- **Inheritance** = class anak mewarisi semua dari class induk

> **Pelajaran terakhir: Proyek akhir C++ — gabungkan semua yang sudah kamu pelajari!** 🚀
`;
