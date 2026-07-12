export const lesson7 = `
# Struktur Data: List & Tuple

Sampai sini kamu sudah bisa simpan satu nilai di satu variabel. Tapi bagaimana kalau kamu punya 100 nama siswa? Atau 1000 transaksi? Tidak mungkin buat 1000 variabel.

Di sinilah **List** dan **Tuple** berperan — dua cara Python untuk menyimpan banyak nilai sekaligus dalam satu "wadah".

**List** (\`[]\`) — untuk data yang perlu berubah. Tambah, hapus, susun ulang — semua bisa.

**Tuple** (\`()\`) — untuk data yang tidak boleh berubah. Koordinat GPS, warna RGB, konstanta — nilai yang harus tetap.

---

## 📋 List — Koleksi yang Bisa Diubah

\`\`\`python
# List bisa berisi tipe data apapun, bahkan campuran
buah      = ["apel", "mangga", "pisang"]
angka     = [1, 2, 3, 4, 5]
campuran  = ["Budi", 25, True, 3.14]
kosong    = []
bersarang = [[1, 2], [3, 4], [5, 6]]   # List di dalam list
\`\`\`

### Mengakses Elemen

\`\`\`python
buah = ["apel", "mangga", "pisang", "jeruk", "anggur"]

print(buah[0])   # "apel"   — index mulai dari 0
print(buah[2])   # "pisang"
print(buah[-1])  # "anggur" — index negatif dari belakang
print(buah[-2])  # "jeruk"
\`\`\`

### Slicing — Ambil Sebagian

\`\`\`python
angka = [10, 20, 30, 40, 50, 60, 70]

print(angka[1:4])    # [20, 30, 40]
print(angka[:3])     # [10, 20, 30]
print(angka[3:])     # [40, 50, 60, 70]
print(angka[::2])    # [10, 30, 50, 70] — setiap 2 elemen
print(angka[::-1])   # [70, 60, 50, 40, 30, 20, 10] — terbalik!
\`\`\`

---

## ✏️ Memodifikasi List

\`\`\`python
belanjaan = ["susu", "roti", "telur"]

# Ubah elemen
belanjaan[1] = "mentega"      # ["susu", "mentega", "telur"]

# Tambah di akhir
belanjaan.append("keju")      # ["susu", "mentega", "telur", "keju"]

# Sisipkan di posisi tertentu
belanjaan.insert(1, "kopi")   # ["susu", "kopi", "mentega", "telur", "keju"]

# Tambah banyak sekaligus
belanjaan.extend(["gula", "garam"])

# Hapus berdasarkan nilai
belanjaan.remove("kopi")      # Hapus "kopi"

# Hapus berdasarkan index
del belanjaan[0]              # Hapus index 0

# Pop — hapus dan simpan nilainya
item_terakhir = belanjaan.pop()    # Hapus dan kembalikan elemen terakhir
item_kedua    = belanjaan.pop(1)   # Hapus dan kembalikan index 1

# Kosongkan list
belanjaan.clear()
\`\`\`

---

## 🔍 Operasi Pencarian & Info

\`\`\`python
nilai = [85, 92, 78, 92, 65, 90, 92]

# Cek keberadaan
print("92" in nilai)         # False (tipe salah, string vs int)
print(92 in nilai)           # True

# Hitung kemunculan
print(nilai.count(92))       # 3

# Cari posisi pertama
print(nilai.index(92))       # 1 (index pertama yang ditemukan)

# Info dasar
print(len(nilai))            # 7 (jumlah elemen)
print(max(nilai))            # 92
print(min(nilai))            # 65
print(sum(nilai))            # 594
print(sum(nilai) / len(nilai))  # 84.857... (rata-rata)
\`\`\`

---

## 🔃 Pengurutan

\`\`\`python
angka = [5, 2, 8, 1, 9, 3]

# sort() — ubah list asli (in-place)
angka.sort()
print(angka)  # [1, 2, 3, 5, 8, 9]

angka.sort(reverse=True)
print(angka)  # [9, 8, 5, 3, 2, 1]

# sorted() — buat list baru, asli tidak berubah
asli   = [5, 2, 8, 1, 9, 3]
terurut = sorted(asli)
print(asli)    # [5, 2, 8, 1, 9, 3]  (tidak berubah)
print(terurut) # [1, 2, 3, 5, 8, 9]

# Urut berdasarkan panjang string
nama = ["Charlie", "Ali", "Bob", "Donny"]
nama.sort(key=len)
print(nama)  # ['Ali', 'Bob', 'Charlie', 'Donny']
\`\`\`

---

## 🔒 Tuple — Koleksi yang Tidak Bisa Diubah

\`\`\`python
# Membuat tuple
koordinat    = (-6.2088, 106.8456)  # Koordinat GPS Jakarta
warna_RGB    = (255, 128, 0)        # Orange dalam RGB
satu_elemen  = (42,)                # Tuple 1 elemen (koma wajib!)
kosong       = ()

# Akses sama seperti list
print(koordinat[0])   # -6.2088
print(koordinat[-1])  # 106.8456

# Unpacking tuple
lat, lon = koordinat
print(f"Latitude: {lat}, Longitude: {lon}")

# Multiple assignment (sebenarnya menggunakan tuple)
a, b, c = 1, 2, 3
print(a, b, c)  # 1 2 3

# Swap variabel (cara Python yang elegan!)
x, y = 10, 20
x, y = y, x     # Tukar tanpa variabel sementara
print(x, y)     # 20 10
\`\`\`

### Kenapa Tuple Tidak Bisa Diubah?

\`\`\`python
koordinat = (-6.2088, 106.8456)
# koordinat[0] = -7.0  # ← ERROR: 'tuple' object does not support item assignment

# Tuple lebih aman untuk data yang tidak boleh berubah:
# - Koordinat GPS
# - Tanggal lahir
# - Warna tema aplikasi
# - Pasangan kunci-nilai yang tetap
\`\`\`

---

## 🔄 Konversi List & Tuple

\`\`\`python
# List → Tuple
daftar = [1, 2, 3, 4]
tuple_baru = tuple(daftar)
print(type(tuple_baru))   # <class 'tuple'>

# Tuple → List
koordinat = (10.5, 20.3)
list_baru = list(koordinat)
list_baru.append(30.1)    # Sekarang bisa dimodifikasi
\`\`\`

---

## 💡 Contoh Program: Manajemen Nilai Siswa

\`\`\`python
# Program untuk kelola nilai siswa

nama_siswa = ["Andi", "Budi", "Cici", "Dedi", "Eka"]
nilai_ujian = [78, 92, 85, 67, 90]

# Hitung statistik
rata_rata  = sum(nilai_ujian) / len(nilai_ujian)
nilai_maks = max(nilai_ujian)
nilai_min  = min(nilai_ujian)

print("=" * 40)
print("     LAPORAN NILAI KELAS")
print("=" * 40)

# Tampilkan nilai dengan rank
nilai_terurut = sorted(zip(nilai_ujian, nama_siswa), reverse=True)
for rank, (nilai, nama) in enumerate(nilai_terurut, 1):
    status = "✅ Lulus" if nilai >= 75 else "❌ Remedial"
    print(f"{rank}. {nama:<8} {nilai:3}  {status}")

print("-" * 40)
print(f"Rata-rata : {rata_rata:.1f}")
print(f"Tertinggi : {nilai_maks} ({nama_siswa[nilai_ujian.index(nilai_maks)]})")
print(f"Terendah  : {nilai_min} ({nama_siswa[nilai_ujian.index(nilai_min)]})")

# Hitung jumlah lulus
lulus = sum(1 for n in nilai_ujian if n >= 75)
print(f"Lulus     : {lulus}/{len(nilai_ujian)} siswa")
print("=" * 40)
\`\`\`

---

## ⚖️ Perbandingan List vs Tuple

| Fitur | List | Tuple |
|-------|------|-------|
| Bisa diubah? | ✅ Ya | ❌ Tidak |
| Simbol | \`[ ]\` | \`( )\` |
| Kecepatan | Lebih lambat | Lebih cepat |
| Memori | Lebih besar | Lebih kecil |
| Cocok untuk | Data yang berubah | Data tetap/konstanta |

---

## 📝 Ringkasan

- List \`[]\` = koleksi berurutan yang bisa diubah (mutable)
- Tuple \`()\` = koleksi berurutan yang tidak bisa diubah (immutable)
- Index mulai dari 0, index negatif dari belakang
- Slicing \`[start:stop:step]\` untuk ambil subset
- \`append()\`, \`remove()\`, \`sort()\` untuk manipulasi list
- Tuple bagus untuk data yang tidak boleh berubah dan lebih hemat memori

> **Di pelajaran berikutnya, kita belajar Dictionary — struktur data key-value yang sangat sering digunakan!** 🗂️
`;
