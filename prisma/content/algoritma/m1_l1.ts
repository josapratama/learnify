export const algo_l1 = `
# Algoritma & Kompleksitas — Kenapa Kode Kamu Bisa Jadi Lambat Banget?

Oke, sebelum kita masuk ke kode, ada satu pertanyaan yang sering bikin orang bingung: **kalau kode saya sudah berjalan dan hasilnya benar, kenapa harus dipusingkan dengan algoritma?**

Jawaban singkatnya: karena kode yang *benar* dan kode yang *efisien* itu dua hal berbeda.

Bayangin dua orang disuruh susun 1.000 kartu berdasarkan nomor. Orang pertama ambil satu kartu, bandingkan dengan semua kartu yang lain, taruh di posisi yang tepat — ulangi 1.000 kali. Orang kedua bagi jadi dua tumpuk, susun masing-masing, gabungkan. Keduanya berhasil, tapi waktunya beda jauh banget.

Di dunia nyata, perbedaannya bisa lebih ekstrem. Kode yang salah algoritma bisa butuh **jam** untuk memproses data yang seharusnya selesai dalam **detik**. Ini yang kita pelajari di sini.

---

## 🧩 Algoritma Itu Apa, Sih?

Sederhananya: **urutan langkah yang jelas untuk menyelesaikan suatu masalah**.

Resep masakan itu algoritma. "Nyalakan kompor → tuang minyak → masukkan bawang → aduk sampai harum" — itu langkah-langkah yang kalau diikuti, menghasilkan hasil yang sama setiap kali. Algoritma pemrograman sama konsepnya, tapi untuk komputer.

Yang membedakan algoritma yang *baik* dari yang *buruk* bukan hasil akhirnya (sama-sama benar), tapi:
- Seberapa cepat dia selesai?
- Seberapa banyak memori yang dipakai?
- Kalau datanya 10x lebih besar, apakah 10x lebih lambat, atau malah 100x lebih lambat?

Nah, untuk ngukur ini, para programmer punya alat ukur namanya **Big O Notation**.

---

## ⏱️ Big O Notation — Cara Ukur Seberapa "Boros" Kode Kamu

Big O itu kayak label konsumsi bahan bakar di mobil — dia nggak bilang persis berapa detik kodenya jalan, tapi kasih gambaran: *kalau datanya tambah besar, seberapa jauh dampaknya ke waktu eksekusi?*

\`\`\`
O(1)        — Konstan      ← kayak search di kamus dengan tahu halamannya langsung
O(log n)    — Logaritmik   ← cari nama di buku telepon dengan cara buka tengah-tengah
O(n)        — Linear       ← cari nama dengan baca dari halaman pertama
O(n log n)  — Linearitmik  ← sorting yang efisien
O(n²)       — Kuadratik    ← nested loop, mulai kerasa lambat kalau data besar
O(2ⁿ)       — Eksponensial ← hindari kalau bisa, data 30 item = miliaran operasi
\`\`\`

Contoh nyata biar kebayang:
- **1 juta data** dicari dengan O(n) = 1 juta langkah
- **1 juta data** dicari dengan O(log n) = cuma sekitar **20 langkah**

Itu bedanya cari nilai di array biasa vs binary search. Dramatis kan?

Lihat perbedaannya di kode:

\`\`\`python
# O(1) — selalu 1 langkah, berapa pun ukuran array
# Langsung ambil, tidak perlu cari-carian
def ambil_pertama(arr):
    return arr[0]

# O(n) — semakin besar data, semakin lama secara proporsional
# Kalau ada 1 juta item, paling buruk 1 juta langkah
def cari_linear(arr, target):
    for item in arr:
        if item == target:
            return True
    return False

# O(n²) — ada loop di dalam loop, ini yang bikin lambat
# 100 item = 10.000 langkah, 1000 item = 1.000.000 langkah!
def cari_duplikat_lambat(arr):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):   # Loop di dalam loop = bahaya
            if arr[i] == arr[j]:
                return True
    return False

# O(n) — sama hasilnya, tapi jauh lebih cepat
# Pakai Set karena lookup di Set itu O(1) (konstan)
def cari_duplikat_cepat(arr):
    seen = set()
    for item in arr:
        if item in seen:    # O(1) — cek langsung, tidak perlu loop
            return True
        seen.add(item)
    return False
\`\`\`

Kedua fungsi cari_duplikat hasilnya sama, tapi performanya beda langit dan bumi kalau datanya jutaan.

---

## 🔍 Searching — Dua Cara Cari Data

### Linear Search — O(n): Cara Sederhana

Ini cara paling intuitif: periksa satu per satu dari awal sampai ketemu.

\`\`\`python
def linear_search(arr, target):
    for i, item in enumerate(arr):
        if item == target:
            return i       # Ketemu! Kembalikan posisinya
    return -1              # -1 berarti tidak ditemukan (konvensi umum)

# Test
data = [15, 3, 8, 22, 7, 30]
print(linear_search(data, 22))  # 3 (ada di index ke-3)
print(linear_search(data, 99))  # -1 (tidak ada)

# Kapan pakai ini?
# - Data tidak diurutkan
# - Data kecil (di bawah ratusan item)
# - Cuma cari sekali-sekali
\`\`\`

### Binary Search — O(log n): Cara Cerdas

Nah ini yang menarik. Syaratnya array harus sudah **terurut**, tapi imbalannya luar biasa.

Cara kerjanya: tebak di tengah, kalau target lebih kecil → cari di kiri, kalau lebih besar → cari di kanan. Setiap langkah, setengah data langsung dibuang dari pertimbangan.

\`\`\`python
def binary_search(arr, target):
    kiri, kanan = 0, len(arr) - 1

    while kiri <= kanan:
        tengah = (kiri + kanan) // 2   # Cari posisi tengah

        if arr[tengah] == target:
            return tengah              # Ketemu!
        elif arr[tengah] < target:
            kiri = tengah + 1          # Target pasti di kanan
        else:
            kanan = tengah - 1         # Target pasti di kiri

    return -1   # Tidak ditemukan

# Test — data HARUS sudah terurut
data_urut = [3, 7, 8, 15, 22, 30]
print(binary_search(data_urut, 22))   # 4
print(binary_search(data_urut, 99))   # -1

# Ini yang bikin binary search dahsyat:
# 1.000.000 data → maksimal 20 langkah saja!
# log2(1_000_000) ≈ 20
# Bandingkan linear search yang butuh sampai 1.000.000 langkah
\`\`\`

---

## 🔢 Sorting — Susun Data Itu Ternyata Ilmu Tersendiri

### Bubble Sort — O(n²): Yang Paling Mudah Dipahami, Tapi Paling Lambat

Cara kerjanya persis kayak namanya: elemen "gelembung" ke posisi yang tepat satu per satu. Mudah dipahami, tapi di data besar ini pilihan paling buruk.

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    arr = arr.copy()   # Jangan ubah array aslinya

    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Tukar posisi kalau urutan salah
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
# [11, 12, 22, 25, 34, 64, 90]

# 1.000 item = ~500.000 perbandingan. Lumayan, tapi...
# 100.000 item = ~5.000.000.000 perbandingan. Ini udah tidak masuk akal!
\`\`\`

### Merge Sort — O(n log n): Strategi "Pecah dan Gabungkan"

Ini pendekatan yang lebih cerdas. Bagi array jadi dua, urutkan masing-masing, lalu gabungkan. Ini pola pikir "divide and conquer" yang dipakai di banyak masalah lain juga.

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr    # Kalau cuma 1 item, sudah "terurut"

    tengah = len(arr) // 2
    kiri  = merge_sort(arr[:tengah])    # Rekursif: urutkan kiri
    kanan = merge_sort(arr[tengah:])    # Rekursif: urutkan kanan

    return merge(kiri, kanan)           # Gabungkan keduanya

def merge(kiri, kanan):
    hasil = []
    i = j = 0

    # Bandingkan satu per satu dari dua array yang sudah terurut
    while i < len(kiri) and j < len(kanan):
        if kiri[i] <= kanan[j]:
            hasil.append(kiri[i])
            i += 1
        else:
            hasil.append(kanan[j])
            j += 1

    # Tambahkan sisa yang belum masuk
    hasil.extend(kiri[i:])
    hasil.extend(kanan[j:])
    return hasil

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
# [3, 9, 10, 27, 38, 43, 82]

# 100.000 item = ~1.700.000 perbandingan — jauh lebih manusiawi!
\`\`\`

### Quick Sort — O(n log n) rata-rata: Favorit Banyak Developer

Quick Sort pilih satu elemen sebagai "pivot", taruh semua yang lebih kecil di kiri, semua yang lebih besar di kanan. Ulangi rekursif.

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot  = arr[len(arr) // 2]
    kiri   = [x for x in arr if x < pivot]
    tengah = [x for x in arr if x == pivot]
    kanan  = [x for x in arr if x > pivot]

    return quick_sort(kiri) + tengah + quick_sort(kanan)
\`\`\`

**Catatan penting:** Di Python sehari-hari, kamu tidak perlu implement sorting manual — cukup pakai \`sorted()\` atau \`.sort()\` yang sudah super optimal. Tapi memahami cara kerjanya penting banget buat wawancara kerja dan problem solving!

---

## 📝 Ringkasan — Kapan Pakai Yang Mana?

| Algoritma | Kompleksitas | Kapan Pakai |
|-----------|--------------|-------------|
| Linear Search | O(n) | Data tidak terurut, jumlah kecil |
| Binary Search | O(log n) | Data terurut, performa penting |
| Bubble Sort | O(n²) | Belajar konsep saja, jangan di produksi |
| Merge Sort | O(n log n) | Data besar, butuh performa stabil |
| Quick Sort | O(n log n) avg | Default pilihan untuk data umum |

**Hal penting yang perlu diingat:**
- O(1) dan O(log n) = impian setiap developer
- O(n) = oke untuk kebanyakan kasus
- O(n²) = mulai waspada kalau data lebih dari ribuan item
- O(2ⁿ) = hindari sebisa mungkin, ini bisa membuat server mati kuyu

Satu tips praktis: sebelum nulis kode yang kompleks, tanya dulu ke diri sendiri — "kalau datanya 1000x lebih besar, kodenya masih masuk akal?"

> **Di pelajaran berikutnya, kita belajar struktur data: Array, Linked List, Stack, Queue, Tree & Hash Table — cara menyimpan dan mengorganisir data yang masing-masing punya kelebihan tersendiri!** 🌳
`;
