export const cpp_l8 = `
# STL — Gudang Senjata Tersembunyi C++

Kamu tidak perlu membuat semua struktur data dari nol. C++ sudah menyediakan **Standard Template Library (STL)** — kumpulan struktur data dan algoritma yang sudah dioptimasi dan siap pakai. Ini yang bikin programmer C++ sangat produktif.

---

## 🗃️ Vector — Array yang Bisa Tumbuh

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>   // Untuk sort, find, dll.
using namespace std;

int main() {
    // Vector = array dinamis yang bisa berubah ukuran
    vector<int> angka;

    // Tambah ke belakang
    angka.push_back(30);
    angka.push_back(10);
    angka.push_back(50);
    angka.push_back(20);
    angka.push_back(40);

    cout << "Ukuran : " << angka.size() << endl;    // 5
    cout << "Elemen pertama: " << angka.front() << endl;  // 30
    cout << "Elemen terakhir: " << angka.back() << endl;  // 40

    // Akses by index
    cout << "Indeks 2: " << angka[2] << endl;          // 50
    cout << "Indeks 2 (safe): " << angka.at(2) << endl; // 50, throw kalau invalid

    // Sort — sort in-place
    sort(angka.begin(), angka.end());
    cout << "Setelah sort: ";
    for (int n : angka) cout << n << " ";   // 10 20 30 40 50
    cout << endl;

    // Sort descending
    sort(angka.begin(), angka.end(), greater<int>());

    // Cari elemen
    auto it = find(angka.begin(), angka.end(), 30);
    if (it != angka.end()) {
        cout << "30 ditemukan di indeks: " << (it - angka.begin()) << endl;
    }

    // Hapus elemen
    angka.erase(angka.begin() + 2);  // Hapus indeks 2
    angka.pop_back();                  // Hapus elemen terakhir

    // Vector of string
    vector<string> nama = {"Budi", "Siti", "Andi", "Dewi"};
    sort(nama.begin(), nama.end());  // Sort alphabetically
    for (const string& n : nama) cout << n << " ";
    cout << endl;

    return 0;
}
\`\`\`

---

## 🗺️ Map — Kamus/Dictionary di C++

\`\`\`cpp
#include <iostream>
#include <map>
#include <unordered_map>
using namespace std;

int main() {
    // map = key-value pair, otomatis terurut berdasarkan key
    map<string, int> nilai;

    nilai["Matematika"] = 85;
    nilai["Bahasa Indonesia"] = 90;
    nilai["IPA"] = 78;
    nilai["IPS"] = 88;

    // Akses
    cout << "Nilai Matematika: " << nilai["Matematika"] << endl;

    // Iterasi (otomatis urut alphabetically)
    for (const auto& [pelajaran, skor] : nilai) {   // Structured binding C++17
        cout << pelajaran << ": " << skor << endl;
    }

    // Cek apakah key ada
    if (nilai.count("IPA") > 0) {
        cout << "IPA ada!" << endl;
    }
    // Atau:
    if (nilai.find("Olahraga") == nilai.end()) {
        cout << "Olahraga tidak ada!" << endl;
    }

    // Hapus
    nilai.erase("IPS");

    // unordered_map — lebih cepat tapi tidak urut
    unordered_map<string, int> stok;
    stok["Apel"]   = 50;
    stok["Mangga"] = 30;
    stok["Pisang"] = 80;
    stok["Apel"]  += 20;   // Update nilai
    cout << "Stok Apel: " << stok["Apel"] << endl;  // 70

    return 0;
}
\`\`\`

---

## 📚 Set & Multiset

\`\`\`cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    // set = kumpulan nilai unik, otomatis terurut, tidak ada duplikat
    set<int> angkaUnik;

    angkaUnik.insert(5);
    angkaUnik.insert(2);
    angkaUnik.insert(8);
    angkaUnik.insert(2);   // Duplikat, diabaikan!
    angkaUnik.insert(1);

    cout << "Set: ";
    for (int n : angkaUnik) cout << n << " ";   // 1 2 5 8 (terurut, unik)
    cout << endl;

    cout << "Ukuran: " << angkaUnik.size() << endl;  // 4 (bukan 5!)

    // Cek keberadaan
    if (angkaUnik.count(5)) cout << "5 ada!" << endl;

    // Hapus nilai duplikat dari vector menggunakan set
    vector<int> data = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
    set<int> unik(data.begin(), data.end());
    vector<int> hasilUnik(unik.begin(), unik.end());

    cout << "Unik: ";
    for (int n : hasilUnik) cout << n << " ";  // 1 2 3 4 5 6 9
    cout << endl;

    return 0;
}
\`\`\`

---

## 🔄 Stack & Queue dari STL

\`\`\`cpp
#include <iostream>
#include <stack>
#include <queue>
using namespace std;

int main() {
    // STACK — LIFO (Last In First Out)
    // Seperti tumpukan piring
    stack<int> tumpukan;
    tumpukan.push(10);
    tumpukan.push(20);
    tumpukan.push(30);

    cout << "Stack top: " << tumpukan.top() << endl;  // 30
    tumpukan.pop();   // Hapus 30
    cout << "Stack top: " << tumpukan.top() << endl;  // 20

    // QUEUE — FIFO (First In First Out)
    // Seperti antrian kasir
    queue<string> antrian;
    antrian.push("Budi");
    antrian.push("Siti");
    antrian.push("Andi");

    cout << "\nAntrian: ";
    while (!antrian.empty()) {
        cout << antrian.front() << " ";  // Budi dipanggil pertama
        antrian.pop();
    }
    cout << endl;

    // PRIORITY QUEUE — antrian dengan prioritas (max heap default)
    priority_queue<int> pq;
    pq.push(3);
    pq.push(7);
    pq.push(1);
    pq.push(9);
    pq.push(4);

    cout << "Priority Queue (descending): ";
    while (!pq.empty()) {
        cout << pq.top() << " ";  // 9 7 4 3 1
        pq.pop();
    }

    return 0;
}
\`\`\`

---

## ⚙️ Algorithm STL

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>     // Untuk accumulate
using namespace std;

int main() {
    vector<int> data = {5, 2, 8, 1, 9, 3, 7, 4, 6};

    // Min & Max
    auto [minIt, maxIt] = minmax_element(data.begin(), data.end());
    cout << "Min: " << *minIt << ", Max: " << *maxIt << endl;

    // Sum
    int total = accumulate(data.begin(), data.end(), 0);
    cout << "Total: " << total << endl;

    // Count tertentu
    vector<int> nilai = {70, 85, 90, 65, 90, 80, 90};
    int count90 = count(nilai.begin(), nilai.end(), 90);
    cout << "Nilai 90 ada: " << count90 << " kali" << endl;

    // Count dengan kondisi
    int lulusan = count_if(nilai.begin(), nilai.end(), [](int n) {
        return n >= 75;   // Lambda function
    });
    cout << "Lulus (>=75): " << lulusan << " orang" << endl;

    // Transform — ubah semua elemen
    vector<int> hasilKali;
    transform(data.begin(), data.end(), back_inserter(hasilKali),
              [](int n) { return n * 2; });

    cout << "Dikali 2: ";
    for (int n : hasilKali) cout << n << " ";
    cout << endl;

    // Remove + erase idiom
    vector<int> angka = {1, 2, 3, 2, 4, 2, 5};
    angka.erase(remove(angka.begin(), angka.end(), 2), angka.end());
    // Hapus semua elemen bernilai 2
    for (int n : angka) cout << n << " ";  // 1 3 4 5

    return 0;
}
\`\`\`

---

## 🎯 Praktik: Sistem Nilai Siswa dengan STL

\`\`\`cpp
#include <iostream>
#include <map>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
#include <iomanip>
using namespace std;

struct Siswa {
    string nama;
    map<string, int> nilai;  // Mapel → nilai

    double rataRata() const {
        if (nilai.empty()) return 0;
        int total = 0;
        for (const auto& [mapel, n] : nilai) total += n;
        return (double)total / nilai.size();
    }

    string predikat() const {
        double avg = rataRata();
        if (avg >= 90) return "A";
        if (avg >= 80) return "B";
        if (avg >= 70) return "C";
        if (avg >= 60) return "D";
        return "E";
    }
};

int main() {
    vector<Siswa> kelas = {
        {"Budi",  {{"MTK",85}, {"IND",90}, {"IPA",78}}},
        {"Siti",  {{"MTK",92}, {"IND",88}, {"IPA",95}}},
        {"Andi",  {{"MTK",70}, {"IND",75}, {"IPA",72}}},
        {"Dewi",  {{"MTK",95}, {"IND",91}, {"IPA",89}}},
    };

    // Sort berdasarkan rata-rata (tertinggi dulu)
    sort(kelas.begin(), kelas.end(), [](const Siswa& a, const Siswa& b) {
        return a.rataRata() > b.rataRata();
    });

    cout << "=== LAPORAN NILAI KELAS ===" << endl;
    cout << left << setw(10) << "Nama"
         << right << setw(8) << "Rata2"
         << setw(6) << "Pred" << endl;
    cout << string(24, '-') << endl;

    for (const Siswa& s : kelas) {
        cout << left << setw(10) << s.nama
             << right << setw(8) << fixed << setprecision(1) << s.rataRata()
             << setw(6) << s.predikat() << endl;
    }

    // Statistik kelas
    double avgKelas = 0;
    for (const Siswa& s : kelas) avgKelas += s.rataRata();
    avgKelas /= kelas.size();

    cout << string(24, '-') << endl;
    cout << "Rata-rata kelas: " << fixed << setprecision(1) << avgKelas << endl;
    cout << "Juara 1: " << kelas[0].nama << " (" << kelas[0].rataRata() << ")" << endl;

    return 0;
}
\`\`\`

---

## 📝 Ringkasan STL

| Kontainer | Kegunaan | Kompleksitas Akses |
|-----------|----------|-------------------|
| \`vector\`  | Array dinamis | O(1) random, O(n) insert tengah |
| \`map\`     | Key-value terurut | O(log n) |
| \`unordered_map\` | Key-value cepat | O(1) average |
| \`set\`     | Nilai unik terurut | O(log n) |
| \`stack\`   | LIFO | O(1) |
| \`queue\`   | FIFO | O(1) |

> **Selanjutnya: File I/O dan Exception Handling — baca/tulis file dan tangani error dengan elegan!** 🚀
`;
