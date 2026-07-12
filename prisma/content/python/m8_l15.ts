export const lesson15 = `
# Dasar NumPy untuk Data Science

Kalau kamu mau terjun ke data science, machine learning, atau analisis data — NumPy adalah fondasi yang harus dikuasai. Hampir semua library data science Python (Pandas, TensorFlow, PyTorch, scikit-learn) dibangun di atas NumPy.

Alasan utamanya sederhana: **Python list itu lambat untuk komputasi numerik besar**. NumPy menyimpan data dalam format yang jauh lebih efisien dan mengeksekusi operasi di level C, bukan Python.

\`\`\`python
import time
import numpy as np

# 1 juta angka
python_list = list(range(1_000_000))
numpy_arr   = np.arange(1_000_000)

# Kalikan semua dengan 2
start = time.time()
hasil_list = [x * 2 for x in python_list]
print(f"List Python : {time.time() - start:.4f} detik")

start = time.time()
hasil_numpy = numpy_arr * 2
print(f"NumPy Array : {time.time() - start:.4f} detik")

# NumPy biasanya 10-100x lebih cepat!
\`\`\`

---

## 📦 Membuat Array NumPy

\`\`\`python
import numpy as np

# Dari list Python
arr1D = np.array([1, 2, 3, 4, 5])
arr2D = np.array([[1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9]])

print(arr1D)          # [1 2 3 4 5]
print(arr2D.shape)    # (3, 3)

# Array siap pakai
zeros    = np.zeros((3, 4))          # Semua nol
ones     = np.ones((2, 3))           # Semua satu
eye      = np.eye(4)                  # Identity matrix
rand     = np.random.rand(3, 3)      # Random 0-1
ints     = np.random.randint(1, 100, size=(3, 3))

arange   = np.arange(0, 10, 2)       # [0 2 4 6 8]
linspace = np.linspace(0, 1, 5)      # [0. 0.25 0.5 0.75 1.]
\`\`\`

---

## 📐 Atribut Array

\`\`\`python
arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

print(arr.shape)    # (3, 4)   ← 3 baris, 4 kolom
print(arr.ndim)     # 2        ← 2 dimensi
print(arr.size)     # 12       ← total elemen
print(arr.dtype)    # int64    ← tipe data

# Ubah dtype
arr_float = arr.astype(float)
print(arr_float.dtype)  # float64
\`\`\`

---

## ✏️ Indexing & Slicing

\`\`\`python
arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

# Akses elemen
print(arr[0, 0])    # 1  (baris 0, kolom 0)
print(arr[1, 2])    # 7  (baris 1, kolom 2)
print(arr[-1, -1])  # 12 (terakhir)

# Slicing baris & kolom
print(arr[0])       # [1 2 3 4]    ← baris pertama
print(arr[:, 1])    # [2 6 10]     ← kolom kedua
print(arr[1:, 2:])  # [[7 8], [11 12]]  ← sub-matrix

# Boolean indexing — filter
angka = np.array([15, 3, 8, 22, 7, 30, 11])
besar = angka[angka > 10]  # [15 22 30 11]
print(besar)

ganjil = angka[angka % 2 != 0]  # [15 3 7 11]
print(ganjil)
\`\`\`

---

## ➕ Operasi Matematika (Vectorization)

\`\`\`python
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

# Operasi element-wise (per elemen)
print(a + b)        # [11 22 33 44 55]
print(a * b)        # [10 40 90 160 250]
print(b / a)        # [10. 10. 10. 10. 10.]
print(a ** 2)       # [1 4 9 16 25]

# Broadcasting — operasi dengan scalar
print(a + 100)      # [101 102 103 104 105]
print(a * 3)        # [3 6 9 12 15]

# Perkalian matrix (beda dengan *)
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)        # Matrix multiplication
# [[19 22]
#  [43 50]]
\`\`\`

---

## 📊 Fungsi Statistik

\`\`\`python
data = np.array([85, 92, 78, 90, 85, 88, 76, 95, 82, 89])

print(f"Rata-rata    : {np.mean(data):.1f}")     # 86.0
print(f"Median       : {np.median(data):.1f}")   # 87.0
print(f"Standar Dev  : {np.std(data):.2f}")      # 5.46
print(f"Varians      : {np.var(data):.2f}")      # 29.8
print(f"Nilai min    : {np.min(data)}")           # 76
print(f"Nilai maks   : {np.max(data)}")           # 95
print(f"Total        : {np.sum(data)}")           # 860
print(f"Index min    : {np.argmin(data)}")        # 6 (index nilai terendah)
print(f"Index maks   : {np.argmax(data)}")        # 7 (index nilai tertinggi)

# Persentil
print(f"Persentil 25 : {np.percentile(data, 25)}")
print(f"Persentil 75 : {np.percentile(data, 75)}")
\`\`\`

---

## 🔄 Reshape & Manipulasi

\`\`\`python
arr = np.arange(12)   # [0 1 2 3 4 5 6 7 8 9 10 11]

# Reshape — ubah bentuk (jumlah elemen harus sama!)
matrix3x4 = arr.reshape(3, 4)
matrix4x3 = arr.reshape(4, 3)
matrix2x6 = arr.reshape(2, 6)
print(matrix3x4)

# Flatten — kembalikan ke 1D
flat = matrix3x4.flatten()

# Transpose
print(matrix3x4.T)    # Balik baris dan kolom

# Stack — gabungkan array
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

horizontal = np.hstack([a, b])  # [1 2 3 4 5 6]
vertikal   = np.vstack([a, b])  # [[1 2 3], [4 5 6]]
print(horizontal)
print(vertikal)
\`\`\`

---

## 💡 Contoh Program: Analisis Nilai Kelas

\`\`\`python
import numpy as np

# Data nilai 30 siswa, 4 mata pelajaran
np.random.seed(42)
nilai = np.random.randint(60, 100, size=(30, 4))
matkul = ["Matematika", "IPA", "Bahasa Ind.", "Inggris"]

print("ANALISIS NILAI KELAS")
print("=" * 50)

# Rata-rata per mata pelajaran
rata_per_matkul = np.mean(nilai, axis=0)  # axis=0 = per kolom
for nama, rata in zip(matkul, rata_per_matkul):
    print(f"{nama:<15}: {rata:.1f}")

print("-" * 50)

# Rata-rata per siswa
rata_per_siswa = np.mean(nilai, axis=1)   # axis=1 = per baris

# Statistik nilai siswa
print(f"\\nRata-rata kelas : {np.mean(rata_per_siswa):.1f}")
print(f"Siswa terbaik   : Siswa #{np.argmax(rata_per_siswa)+1} ({np.max(rata_per_siswa):.1f})")
print(f"Siswa terendah  : Siswa #{np.argmin(rata_per_siswa)+1} ({np.min(rata_per_siswa):.1f})")

# Berapa siswa lulus? (rata-rata >= 75)
lulus = np.sum(rata_per_siswa >= 75)
print(f"Lulus           : {lulus}/30 siswa ({lulus/30*100:.0f}%)")

# Distribusi nilai
sangat_baik = np.sum(rata_per_siswa >= 90)
baik        = np.sum((rata_per_siswa >= 80) & (rata_per_siswa < 90))
cukup       = np.sum((rata_per_siswa >= 70) & (rata_per_siswa < 80))
kurang      = np.sum(rata_per_siswa < 70)

print(f"\\nDistribusi Predikat:")
print(f"  A (>=90)  : {sangat_baik} siswa")
print(f"  B (80-89) : {baik} siswa")
print(f"  C (70-79) : {cukup} siswa")
print(f"  D (<70)   : {kurang} siswa")
\`\`\`

---

## 📝 Ringkasan

- NumPy = library komputasi numerik yang cepat dan efisien
- Array NumPy: semua elemen harus tipe yang sama
- Operasi vectorized — berlaku untuk semua elemen sekaligus (tanpa loop!)
- Shape \`(baris, kolom)\` — penting untuk operasi matrix
- \`axis=0\` untuk operasi per kolom, \`axis=1\` untuk per baris
- Boolean indexing untuk filter data: \`arr[arr > 10]\`
- Reshaping untuk mengubah bentuk array

> **Di pelajaran berikutnya, kita belajar Pandas — library untuk analisis data tabel seperti Excel dengan superpowers!** 🐼
`;
