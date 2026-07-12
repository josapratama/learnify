export const cpp_l10 = `
# Template & Lambda — Kode yang Fleksibel dan Modern

Di pelajaran terakhir sebelum proyek, kita bahas dua fitur C++ yang sangat powerful: **Template** untuk kode yang bisa bekerja dengan tipe apapun, dan **Lambda** untuk fungsi ringkas yang bisa ditulis inline.

---

## 🧪 Template Fungsi — Satu Kode, Semua Tipe

\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Tanpa template — harus buat 3 versi terpisah:
int tambahInt(int a, int b) { return a + b; }
double tambahDouble(double a, double b) { return a + b; }
string tambahString(string a, string b) { return a + b; }

// Dengan template — satu fungsi untuk semua!
template <typename T>
T tambah(T a, T b) {
    return a + b;
}

// Kompiler otomatis "generate" versi yang sesuai saat dipanggil
// Ini disebut template instantiation

// Template dengan banyak tipe
template <typename T, typename U>
void cetakPasangan(T pertama, U kedua) {
    cout << "(" << pertama << ", " << kedua << ")" << endl;
}

// Template dengan default type
template <typename T = int>
T kali(T a, T b) {
    return a * b;
}

int main() {
    cout << tambah(10, 20) << endl;              // int: 30
    cout << tambah(3.14, 2.72) << endl;          // double: 5.86
    cout << tambah<string>("Halo", " Dunia!") << endl;  // string: Halo Dunia!

    cetakPasangan("Nama", 25);            // (Nama, 25)
    cetakPasangan(3.14, true);            // (3.14, 1)

    cout << kali(5, 6) << endl;           // 30 (int, pakai default)
    cout << kali(2.5, 4.0) << endl;       // 10.0 (double)

    return 0;
}
\`\`\`

---

## 🏗️ Template Class — Container Generic

\`\`\`cpp
#include <iostream>
#include <stdexcept>
using namespace std;

// Stack generic — bisa simpan tipe apapun
template <typename T>
class Stack {
private:
    T* data;
    int kapasitas;
    int ukuran;

public:
    Stack(int kap = 100) : kapasitas(kap), ukuran(0) {
        data = new T[kapasitas];
    }

    ~Stack() { delete[] data; }

    void push(const T& nilai) {
        if (ukuran >= kapasitas) throw runtime_error("Stack penuh!");
        data[ukuran++] = nilai;
    }

    T pop() {
        if (kosong()) throw runtime_error("Stack kosong!");
        return data[--ukuran];
    }

    const T& top() const {
        if (kosong()) throw runtime_error("Stack kosong!");
        return data[ukuran - 1];
    }

    bool kosong() const { return ukuran == 0; }
    int size() const { return ukuran; }
};

// Pasangan generic
template <typename First, typename Second>
struct Pasangan {
    First pertama;
    Second kedua;

    Pasangan(First p, Second k) : pertama(p), kedua(k) {}

    void tampilkan() const {
        cout << "(" << pertama << ", " << kedua << ")" << endl;
    }
};

int main() {
    // Stack integer
    Stack<int> stackInt;
    stackInt.push(10);
    stackInt.push(20);
    stackInt.push(30);
    cout << "Pop: " << stackInt.pop() << endl;  // 30
    cout << "Top: " << stackInt.top() << endl;  // 20

    // Stack string
    Stack<string> stackStr;
    stackStr.push("Python");
    stackStr.push("C++");
    cout << "Pop: " << stackStr.pop() << endl;  // C++

    // Pasangan
    Pasangan<string, int> nilai("Budi", 95);
    nilai.tampilkan();   // (Budi, 95)

    Pasangan<double, bool> koordinat(3.14, true);
    koordinat.tampilkan();  // (3.14, 1)

    return 0;
}
\`\`\`

---

## 🎯 Lambda Expression — Fungsi Mini Tanpa Nama

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

int main() {
    // Lambda sintaks: [capture](parameter) -> returnType { body }
    // Return type sering bisa dihilangkan (auto-deduced)

    // Lambda dasar
    auto salam = [](string nama) {
        cout << "Halo, " << nama << "!" << endl;
    };
    salam("Budi");    // Halo, Budi!

    auto kuadrat = [](int n) { return n * n; };
    cout << kuadrat(5) << endl;    // 25

    // Lambda dengan capture — tangkap variabel dari luar
    int faktor = 3;
    auto kali = [faktor](int n) { return n * faktor; };  // Copy faktor
    cout << kali(7) << endl;   // 21

    faktor = 10;
    cout << kali(7) << endl;   // Masih 21! (copy, bukan reference)

    // Capture by reference
    int total = 0;
    auto tambahKeTotal = [&total](int n) { total += n; };  // Reference
    tambahKeTotal(10);
    tambahKeTotal(20);
    tambahKeTotal(30);
    cout << "Total: " << total << endl;   // 60 (total berubah!)

    // Capture semua
    int a = 5, b = 10;
    auto jumlahkan = [=]() { return a + b; };       // [=] copy semua
    auto modifikasi = [&]() { a += b; };            // [&] reference semua

    // Lambda sebagai parameter fungsi
    vector<int> angka = {5, 2, 8, 1, 9, 3};

    // Sort dengan lambda custom
    sort(angka.begin(), angka.end(), [](int x, int y) {
        return x > y;   // Descending
    });
    for (int n : angka) cout << n << " ";  // 9 8 5 3 2 1
    cout << endl;

    // Filter dengan copy_if
    vector<int> genap;
    copy_if(angka.begin(), angka.end(), back_inserter(genap),
            [](int n) { return n % 2 == 0; });
    for (int n : genap) cout << n << " ";  // 8 2
    cout << endl;

    // std::function — simpan lambda sebagai variabel bertipe
    function<int(int, int)> operasi;

    char op = '+';
    if      (op == '+') operasi = [](int a, int b) { return a + b; };
    else if (op == '*') operasi = [](int a, int b) { return a * b; };

    cout << "Hasil: " << operasi(5, 3) << endl;  // 8

    return 0;
}
\`\`\`

---

## 🔧 Praktik: Pipeline Transformasi Data

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
#include <functional>
using namespace std;

struct Transaksi {
    string id;
    string kategori;
    double jumlah;
    bool sukses;
};

// Fungsi template yang terima lambda sebagai parameter
template <typename Container, typename Predicate>
Container filter(const Container& data, Predicate pred) {
    Container hasil;
    copy_if(data.begin(), data.end(), back_inserter(hasil), pred);
    return hasil;
}

template <typename Container, typename Transform>
auto transform_data(const Container& data, Transform fn) {
    vector<decltype(fn(*data.begin()))> hasil;
    transform(data.begin(), data.end(), back_inserter(hasil), fn);
    return hasil;
}

int main() {
    vector<Transaksi> transaksi = {
        {"T001", "Makanan",  50000,  true},
        {"T002", "Transport",25000,  true},
        {"T003", "Hiburan",  150000, true},
        {"T004", "Makanan",  75000,  false},
        {"T005", "Belanja",  200000, true},
        {"T006", "Transport",30000,  true},
        {"T007", "Makanan",  45000,  true},
    };

    // Filter hanya yang sukses
    auto sukses = filter(transaksi, [](const Transaksi& t) {
        return t.sukses;
    });

    // Filter kategori makanan
    auto makanan = filter(sukses, [](const Transaksi& t) {
        return t.kategori == "Makanan";
    });

    // Ambil jumlahnya saja
    auto jumlahMakanan = transform_data(makanan, [](const Transaksi& t) {
        return t.jumlah;
    });

    // Hitung total
    double totalMakanan = accumulate(jumlahMakanan.begin(), jumlahMakanan.end(), 0.0);
    cout << "Total pengeluaran makanan: Rp " << totalMakanan << endl;  // 95000

    // Group by kategori
    map<string, double> perKategori;
    for (const auto& t : sukses) {
        perKategori[t.kategori] += t.jumlah;
    }

    cout << "\nPengeluaran per kategori:" << endl;
    // Sort berdasarkan nilai (pakai vector of pair)
    vector<pair<string, double>> sorted(perKategori.begin(), perKategori.end());
    sort(sorted.begin(), sorted.end(), [](const auto& a, const auto& b) {
        return a.second > b.second;
    });

    for (const auto& [kat, total] : sorted) {
        cout << "  " << kat << ": Rp " << total << endl;
    }

    return 0;
}
\`\`\`

---

## 📝 Ringkasan

- **Template fungsi**: \`template <typename T> T fungsi(T a)\` — satu fungsi untuk semua tipe
- **Template class**: container/struktur yang bisa simpan tipe apapun
- **Lambda**: \`[capture](param) { body }\` — fungsi mini inline
- **Capture**: \`[=]\` copy semua, \`[&]\` reference semua, \`[var]\` copy spesifik
- **std::function**: simpan lambda sebagai variabel yang bisa dipassing
- Lambda sangat berguna dengan STL algorithm (\`sort\`, \`filter\`, \`transform\`)

> **Modul selanjutnya: Proyek final yang lebih kompleks — Game Text-based dengan C++!** 🚀
`;
