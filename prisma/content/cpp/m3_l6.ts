export const cpp_l6 = `
# Proyek Akhir C++ — Sistem Manajemen Perpustakaan Mini

Selamat sampai di pelajaran terakhir! 🎉 Di sini kita gabungkan semua yang sudah dipelajari — variabel, kondisi, loop, fungsi, dan OOP — menjadi satu program yang nyata dan berguna.

Kita akan buat **Sistem Manajemen Perpustakaan Mini**. Program ini bisa:
- Menyimpan daftar buku
- Mencari buku berdasarkan judul atau penulis
- Meminjam dan mengembalikan buku
- Menampilkan laporan

---

## 🎯 Kenapa Proyek Ini?

Setelah belajar teori, langkah terpenting adalah **praktek nyata**. Sistem perpustakaan mewakili masalah dunia nyata yang butuh:
- Struktur data (menyimpan banyak buku)
- Logika (validasi peminjaman)
- OOP (class Buku, class Perpustakaan)
- Input/output (interaksi dengan pengguna)

---

## 🏗️ Desain Program

\`\`\`
Struktur:
├── Class Buku        — data setiap buku (judul, penulis, tahun, status)
├── Class Perpustakaan — koleksi buku + semua operasinya
└── main()            — menu utama dan interaksi pengguna
\`\`\`

---

## 💻 Kode Lengkap

\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>      // Untuk menyimpan banyak buku
#include <algorithm>   // Untuk transform (ubah ke lowercase)
using namespace std;

// ═══════════════════════════════════════
// CLASS BUKU
// ═══════════════════════════════════════
class Buku {
public:
    int id;
    string judul;
    string penulis;
    int tahunTerbit;
    bool tersedia;      // true = ada di rak, false = sedang dipinjam
    string peminjam;    // Nama peminjam (kosong kalau tidak dipinjam)

    Buku(int idBuku, string j, string p, int t) {
        id          = idBuku;
        judul       = j;
        penulis     = p;
        tahunTerbit = t;
        tersedia    = true;
        peminjam    = "";
    }

    void tampilkan() {
        cout << "[" << id << "] " << judul << endl;
        cout << "     Penulis : " << penulis << " (" << tahunTerbit << ")" << endl;
        cout << "     Status  : ";
        if (tersedia) {
            cout << "Tersedia ✓" << endl;
        } else {
            cout << "Dipinjam oleh " << peminjam << endl;
        }
    }
};

// ═══════════════════════════════════════
// CLASS PERPUSTAKAAN
// ═══════════════════════════════════════
class Perpustakaan {
private:
    vector<Buku> koleksi;   // Daftar semua buku
    int idCounter;           // Auto-increment ID

    // Helper: ubah string jadi lowercase untuk pencarian
    string toLower(string s) {
        transform(s.begin(), s.end(), s.begin(), ::tolower);
        return s;
    }

    // Helper: cari buku berdasarkan ID
    int cariBukuById(int id) {
        for (int i = 0; i < koleksi.size(); i++) {
            if (koleksi[i].id == id) return i;   // Return index di vector
        }
        return -1;   // Tidak ditemukan
    }

public:
    Perpustakaan() {
        idCounter = 1;
        // Isi data awal
        tambahBuku("Clean Code", "Robert C. Martin", 2008);
        tambahBuku("The Pragmatic Programmer", "David Thomas", 1999);
        tambahBuku("Design Patterns", "Gang of Four", 1994);
        tambahBuku("Introduction to Algorithms", "Cormen et al.", 2009);
        tambahBuku("You Don't Know JS", "Kyle Simpson", 2015);
    }

    // ─── Tambah buku baru ───
    void tambahBuku(string judul, string penulis, int tahun) {
        Buku baru(idCounter++, judul, penulis, tahun);
        koleksi.push_back(baru);
        cout << "✓ Buku '" << judul << "' berhasil ditambahkan." << endl;
    }

    // ─── Tampilkan semua buku ───
    void tampilkanSemua() {
        if (koleksi.empty()) {
            cout << "Perpustakaan masih kosong." << endl;
            return;
        }
        cout << "\n══════════════════ DAFTAR BUKU ══════════════════" << endl;
        for (Buku& buku : koleksi) {
            buku.tampilkan();
            cout << "     ────────────────────────────────────────" << endl;
        }
        cout << "Total: " << koleksi.size() << " buku" << endl;
    }

    // ─── Cari buku ───
    void cariBuku(string kata) {
        string kataLower = toLower(kata);
        vector<int> hasil;

        for (int i = 0; i < koleksi.size(); i++) {
            string judulLower   = toLower(koleksi[i].judul);
            string penulisLower = toLower(koleksi[i].penulis);

            // Cek apakah kata pencarian ada di judul atau penulis
            if (judulLower.find(kataLower) != string::npos ||
                penulisLower.find(kataLower) != string::npos) {
                hasil.push_back(i);
            }
        }

        if (hasil.empty()) {
            cout << "Buku dengan kata '" << kata << "' tidak ditemukan." << endl;
            return;
        }

        cout << "\nHasil pencarian untuk '" << kata << "':" << endl;
        for (int i : hasil) {
            koleksi[i].tampilkan();
        }
    }

    // ─── Pinjam buku ───
    void pinjamBuku(int id, string namaPeminjam) {
        int idx = cariBukuById(id);

        if (idx == -1) {
            cout << "Buku dengan ID " << id << " tidak ditemukan." << endl;
            return;
        }

        if (!koleksi[idx].tersedia) {
            cout << "Maaf, buku ini sedang dipinjam oleh " << koleksi[idx].peminjam << "." << endl;
            return;
        }

        koleksi[idx].tersedia = false;
        koleksi[idx].peminjam = namaPeminjam;
        cout << "✓ Buku '" << koleksi[idx].judul << "' berhasil dipinjam oleh "
             << namaPeminjam << "." << endl;
    }

    // ─── Kembalikan buku ───
    void kembalikanBuku(int id) {
        int idx = cariBukuById(id);

        if (idx == -1) {
            cout << "Buku dengan ID " << id << " tidak ditemukan." << endl;
            return;
        }

        if (koleksi[idx].tersedia) {
            cout << "Buku ini tidak sedang dipinjam." << endl;
            return;
        }

        cout << "✓ Buku '" << koleksi[idx].judul << "' dikembalikan oleh "
             << koleksi[idx].peminjam << ". Terima kasih!" << endl;
        koleksi[idx].tersedia = true;
        koleksi[idx].peminjam = "";
    }

    // ─── Laporan ───
    void cetakLaporan() {
        int tersedia = 0, dipinjam = 0;
        cout << "\n══════════════════ LAPORAN ══════════════════" << endl;

        for (Buku& b : koleksi) {
            if (b.tersedia) tersedia++;
            else            dipinjam++;
        }

        cout << "Total koleksi : " << koleksi.size() << " buku" << endl;
        cout << "Tersedia      : " << tersedia << " buku" << endl;
        cout << "Sedang dipinjam: " << dipinjam << " buku" << endl;

        if (dipinjam > 0) {
            cout << "\nDaftar buku yang dipinjam:" << endl;
            for (Buku& b : koleksi) {
                if (!b.tersedia) {
                    cout << "  - [" << b.id << "] " << b.judul
                         << " → " << b.peminjam << endl;
                }
            }
        }
    }
};

// ═══════════════════════════════════════
// MAIN — Menu utama
// ═══════════════════════════════════════
void cetakMenu() {
    cout << "\n╔═══════════════════════════════╗" << endl;
    cout << "║   PERPUSTAKAAN DIGITAL MINI   ║" << endl;
    cout << "╠═══════════════════════════════╣" << endl;
    cout << "║ 1. Lihat semua buku           ║" << endl;
    cout << "║ 2. Cari buku                  ║" << endl;
    cout << "║ 3. Pinjam buku                ║" << endl;
    cout << "║ 4. Kembalikan buku            ║" << endl;
    cout << "║ 5. Tambah buku baru           ║" << endl;
    cout << "║ 6. Lihat laporan              ║" << endl;
    cout << "║ 0. Keluar                     ║" << endl;
    cout << "╚═══════════════════════════════╝" << endl;
    cout << "Pilih menu: ";
}

int main() {
    Perpustakaan perpus;   // Buat perpustakaan, data awal otomatis terisi
    int pilihan;

    cout << "Selamat datang di Perpustakaan Digital Mini! 📚" << endl;

    do {
        cetakMenu();
        cin >> pilihan;
        cin.ignore();   // Bersihkan newline dari buffer

        switch (pilihan) {
            case 1:
                perpus.tampilkanSemua();
                break;

            case 2: {
                string kata;
                cout << "Masukkan kata pencarian: ";
                getline(cin, kata);
                perpus.cariBuku(kata);
                break;
            }

            case 3: {
                int id;
                string nama;
                cout << "Masukkan ID buku yang ingin dipinjam: ";
                cin >> id;
                cin.ignore();
                cout << "Masukkan nama peminjam: ";
                getline(cin, nama);
                perpus.pinjamBuku(id, nama);
                break;
            }

            case 4: {
                int id;
                cout << "Masukkan ID buku yang dikembalikan: ";
                cin >> id;
                perpus.kembalikanBuku(id);
                break;
            }

            case 5: {
                string judul, penulis;
                int tahun;
                cout << "Judul buku  : ";
                getline(cin, judul);
                cout << "Penulis     : ";
                getline(cin, penulis);
                cout << "Tahun terbit: ";
                cin >> tahun;
                cin.ignore();
                perpus.tambahBuku(judul, penulis, tahun);
                break;
            }

            case 6:
                perpus.cetakLaporan();
                break;

            case 0:
                cout << "Terima kasih telah menggunakan Perpustakaan Digital! 👋" << endl;
                break;

            default:
                cout << "Menu tidak valid. Coba lagi." << endl;
        }

    } while (pilihan != 0);

    return 0;
}
\`\`\`

---

## 🧪 Cara Menjalankan

\`\`\`bash
# Kompilasi
g++ -o perpustakaan main.cpp

# Jalankan
./perpustakaan      # Linux/Mac
perpustakaan.exe    # Windows
\`\`\`

---

## 📝 Ringkasan Kursus C++

Kamu telah menempuh perjalanan dari nol sampai membuat program OOP yang nyata!

| Modul | Topik |
|-------|-------|
| 1 | Pengenalan C++, setup, variabel, tipe data, I/O |
| 2 | Kondisi (if/switch), loop (for/while), array |
| 3 | Fungsi, parameter, pass by reference |
| 4 | OOP: class, object, constructor, encapsulation, inheritance |
| 5 | Proyek akhir: sistem perpustakaan |

**Langkah selanjutnya:**
- **STL** (Standard Template Library) — struktur data canggih bawaan C++
- **Pointer dan Memory Management** — kendali penuh atas memori
- **Template dan Generic Programming** — kode yang fleksibel
- **Game Development** dengan SFML atau SDL2

> **Selamat! Kamu sudah punya pondasi C++ yang kuat. Terus berlatih dan explore!** 🎉
`;
