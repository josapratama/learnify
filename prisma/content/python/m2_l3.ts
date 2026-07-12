export const lesson3 = `
# Variabel & Tipe Data di Python

Ini adalah fondasi dari semua program yang akan kamu buat. Variabel adalah cara kita menyimpan dan memberi nama pada data — tanpa variabel, kita tidak bisa ingat apapun antar baris kode.

---

## 📦 Variabel: Simpan Data dengan Nama

\`\`\`python
# Buat variabel — tulis nama, tanda sama dengan, lalu nilai
nama = "Pratama"
umur = 25
aktif = True

# Pakai variabelnya kapan saja
print(f"Halo {nama}, umur {umur} tahun")  # Halo Pratama, umur 25 tahun

# Nilai bisa diubah kapan saja
umur = 26    # Sekarang umur berubah jadi 26
nama = "Budi"  # Nama bisa diganti
\`\`\`

Python menentukan tipe data secara otomatis dari nilai yang kamu assign — tidak perlu ditulis manual seperti di Java atau C++.

---

## 🔤 Tipe Data Dasar Python

### String (str) — Teks

\`\`\`python
nama       = "Pratama"           # Tanda kutip ganda
kota       = 'Jakarta'           # Atau tanda kutip tunggal, sama saja
multiline  = """
Teks yang
panjang bisa
ditulis begini
"""

# Operasi string yang sering dipakai
sapaan     = "Halo " + nama      # Gabung: "Halo Pratama"
besar      = nama.upper()        # "PRATAMA"
kecil      = nama.lower()        # "pratama"
panjang    = len(nama)           # 7 (jumlah karakter)
\`\`\`

### Integer (int) — Angka Bulat

\`\`\`python
umur  = 25
minus = -10
besar = 1_000_000    # Underscore sebagai pemisah ribuan — lebih mudah dibaca

print(umur + 5)    # 30
print(umur ** 2)   # 625 (pangkat)
print(umur % 7)    # 4 (sisa bagi)
\`\`\`

### Float — Angka Desimal

\`\`\`python
tinggi = 175.5
pi     = 3.14159

# Hati-hati dengan presisi float:
print(0.1 + 0.2)                # 0.30000000000000004 (bukan bug, sifat float)
print(round(0.1 + 0.2, 2))     # 0.3 (gunakan round() kalau perlu presisi)
\`\`\`

### Boolean — True atau False

\`\`\`python
aktif    = True
is_admin = False

# Sering muncul dari perbandingan
print(10 > 5)    # True
print(3 == 7)    # False
print(5 != 3)    # True
\`\`\`

### None — Tidak Ada Nilai

\`\`\`python
# Seperti kotak kosong — ada kotaknya, tapi isinya tidak ada
hasil = None

if hasil is None:
    print("Belum ada hasil")
\`\`\`

---

## 🏷️ Aturan Penamaan Variabel

\`\`\`python
# ✅ BOLEH
nama_lengkap = "Budi"      # snake_case (rekomendasi Python)
umur2        = 25           # boleh ada angka (bukan di awal)
_private     = True         # boleh mulai dengan underscore
NamaKelas    = "Kelas7"    # PascalCase (untuk class, bukan variabel)

# ❌ TIDAK BOLEH
2umur   = 25    # Error: dimulai angka
nama-ku = "A"   # Error: ada tanda minus
for     = 10    # Error: "for" adalah kata kunci Python
\`\`\`

### Konvensi Penamaan Python (PEP 8)

| Jenis | Konvensi | Contoh |
|-------|---------|--------|
| Variabel | snake_case | \`nama_lengkap\` |
| Konstanta | UPPER_CASE | \`MAX_NILAI = 100\` |
| Fungsi | snake_case | \`hitung_luas()\` |
| Class | PascalCase | \`MahasiswaBaru\` |

---

## 🔍 Mengecek & Mengubah Tipe Data

\`\`\`python
# Cek tipe data dengan type()
x = 42
print(type(x))          # <class 'int'>
print(type("halo"))     # <class 'str'>
print(type(3.14))       # <class 'float'>
print(type(True))       # <class 'bool'>

# Konversi tipe data (Type Casting)
angka_string = "100"
angka_asli   = int(angka_string)    # String → Integer
print(angka_asli + 5)               # 105

pi_string    = str(3.14)            # Float → String
print("Nilai pi: " + pi_string)     # "Nilai pi: 3.14"

# Konversi yang gagal akan error!
# int("abc")  # ValueError: invalid literal
\`\`\`

---

## ✏️ f-String — Cara Terbaik Menyisipkan Variabel ke Teks

\`\`\`python
nama  = "Siti"
umur  = 22
nilai = 87.5

# Cara lama (kurang enak)
print("Halo " + nama + ", umur " + str(umur))

# f-String (Python 3.6+) — sangat direkomendasikan!
print(f"Halo {nama}, umur {umur}")
# Output: Halo Siti, umur 22

# Bisa langsung format angka
print(f"Nilai Anda: {nilai:.1f}")  # 87.5 (1 angka desimal)
print(f"Nilai Anda: {nilai:.0f}")  # 88 (dibulatkan, 0 desimal)

# Bisa ada ekspresi
print(f"Tahun depan Anda berumur {umur + 1} tahun")
# Output: Tahun depan Anda berumur 23 tahun
\`\`\`

---

## 📊 Tipe Data Koleksi (Preview)

Python juga punya tipe data untuk menampung banyak nilai sekaligus (akan dipelajari lebih dalam di modul berikutnya):

\`\`\`python
# List — kumpulan data, bisa diubah
buah = ["apel", "pisang", "mangga"]

# Tuple — kumpulan data, tidak bisa diubah
koordinat = (10.5, 20.3)

# Dictionary — pasangan kunci:nilai
profil = {"nama": "Budi", "umur": 25}

# Set — kumpulan unik, tanpa duplikat
angka_unik = {1, 2, 3, 3, 2}  # hasilnya {1, 2, 3}
\`\`\`

---

## 🔄 Variabel Bersifat Dinamis

Di Python, variabel bisa berganti tipe data kapan saja (tidak seperti Java/C++):

\`\`\`python
x = 10        # int
print(type(x))  # <class 'int'>

x = "sepuluh"  # Sekarang string
print(type(x))  # <class 'str'>

x = [1, 2, 3]  # Sekarang list
print(type(x))  # <class 'list'>
\`\`\`

---

## 💡 Contoh Program: Kartu Profil

\`\`\`python
# Program sederhana: tampilkan profil pengguna

nama       = "Pratama Dev"
umur       = 28
kota       = "Bandung"
pekerjaan  = "Backend Developer"
gaji       = 15_000_000  # Rp 15 juta
is_menikah = False

print("=" * 35)
print("       KARTU PROFIL")
print("=" * 35)
print(f"Nama      : {nama}")
print(f"Umur      : {umur} tahun")
print(f"Kota      : {kota}")
print(f"Pekerjaan : {pekerjaan}")
print(f"Gaji      : Rp {gaji:,}".replace(",", "."))  # Format ribuan
print(f"Menikah   : {'Ya' if is_menikah else 'Belum'}")
print("=" * 35)
\`\`\`

**Output:**
\`\`\`
===================================
       KARTU PROFIL
===================================
Nama      : Pratama Dev
Umur      : 28 tahun
Kota      : Bandung
Pekerjaan : Backend Developer
Gaji      : Rp 15.000.000
Menikah   : Belum
===================================
\`\`\`

---

## 📝 Ringkasan

- Variabel = wadah bernama untuk menyimpan data
- Python menentukan tipe data otomatis (dinamis)
- Tipe dasar: \`str\`, \`int\`, \`float\`, \`bool\`, \`None\`
- Penamaan variabel: gunakan \`snake_case\`, tidak boleh mulai angka
- \`type()\` untuk cek tipe, \`int()\` / \`str()\` / \`float()\` untuk konversi
- f-String adalah cara terbaik menyisipkan variabel ke dalam teks

> **Di pelajaran berikutnya, kita belajar operator — cara melakukan perhitungan dan perbandingan di Python.** ➕
`;
