export const algo_l3 = `
# Rekursi — Fungsi yang Memanggil Dirinya Sendiri

Kalau kamu baru pertama kali dengar rekursi, reaksi pertamanya sering: "Hah? Fungsi manggil dirinya sendiri? Itu nggak bikin loop selamanya?"

Pertanyaan yang bagus. Jawabannya: bisa, kalau tidak ditulis dengan benar. Tapi kalau ditulis dengan benar, rekursi adalah salah satu teknik paling elegan di pemrograman.

---

## 🪞 Analogi: Cermin di Dalam Cermin

Pernah lihat dua cermin yang saling berhadapan? Kamu lihat pantulan di dalam pantulan di dalam pantulan... tapi ada batasnya — cahaya yang memantul makin redup, sampai akhirnya berhenti.

Rekursi persis seperti itu. Fungsi memanggil dirinya sendiri, tapi setiap panggilan membawa masalah yang sedikit lebih kecil, sampai akhirnya masalahnya cukup kecil untuk diselesaikan langsung. Titik berhenti itu disebut **base case**.

Setiap fungsi rekursif wajib punya dua hal:
1. **Base case** — kondisi berhenti (tanpa ini = infinite loop / stack overflow)
2. **Recursive case** — panggil diri sendiri dengan masalah yang lebih kecil

---

## 🔢 Faktorial — Contoh Klasik

\`\`\`python
# 5! = 5 × 4 × 3 × 2 × 1 = 120
# Perhatikan polanya: 5! = 5 × 4! = 5 × 4 × 3! = dst.

def faktorial(n):
    # Base case — jika n sudah 0 atau 1, jawaban langsung 1
    if n <= 1:
        return 1

    # Recursive case — n dikali faktorial dari n-1
    return n * faktorial(n - 1)
    #              ↑ Panggil diri sendiri dengan masalah yang lebih kecil!

# Coba trace eksekusinya:
faktorial(4)
# = 4 * faktorial(3)
# = 4 * (3 * faktorial(2))
# = 4 * (3 * (2 * faktorial(1)))
# = 4 * (3 * (2 * 1))           ← Base case! Berhenti di sini
# = 4 * (3 * 2)
# = 4 * 6
# = 24 ✅

print(faktorial(5))    # 120
print(faktorial(10))   # 3628800
\`\`\`

---

## 🌀 Fibonacci — Angka yang Ada di Mana-Mana di Alam

\`\`\`python
# Deret Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
# Setiap angka = jumlah dua angka sebelumnya
# fib(n) = fib(n-1) + fib(n-2)

# Versi naive — mudah dipahami tapi SANGAT lambat untuk n besar
def fib_lambat(n):
    if n <= 1:
        return n    # Base case: fib(0)=0, fib(1)=1
    return fib_lambat(n - 1) + fib_lambat(n - 2)

# fib_lambat(40) sudah terasa lambat (~1-2 detik!)
# Kenapa? Karena fib_lambat(40) menghitung fib_lambat(38) DUA kali,
# fib_lambat(38) menghitung fib_lambat(36) DUA kali... dst.
# Total pemanggilan: O(2^n) — eksponensial!

# Versi dengan memoization — simpan hasil yang sudah pernah dihitung
from functools import lru_cache   # LRU = Least Recently Used cache

@lru_cache(maxsize=None)    # Decorator yang auto-cache hasil
def fib_cepat(n):
    if n <= 1:
        return n
    return fib_cepat(n - 1) + fib_cepat(n - 2)

# Sekarang fib_cepat(100) langsung selesai — O(n)!
print(fib_cepat(50))    # 12586269025
print(fib_cepat(100))   # 354224848179261915075

# Versi iteratif — biasanya lebih efisien untuk production
def fib_iteratif(n):
    if n <= 1: return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
\`\`\`

---

## 🌳 Rekursi untuk Struktur Tree

\`\`\`python
# Rekursi dan tree seperti pasangan yang dibuat untuk satu sama lain
# Karena tree sendiri adalah struktur yang REKURSIF:
# Setiap node punya children yang juga berbentuk tree

# Hitung total nilai di semua node tree
def jumlah_tree(node):
    if node is None:
        return 0    # Base case: node kosong

    # Nilai node ini + jumlah subtree kiri + jumlah subtree kanan
    return node.val + jumlah_tree(node.left) + jumlah_tree(node.right)

# Hitung kedalaman tree
def kedalaman_tree(node):
    if node is None:
        return 0

    kedalaman_kiri  = kedalaman_tree(node.left)
    kedalaman_kanan = kedalaman_tree(node.right)

    # Ambil yang lebih dalam, plus 1 untuk node saat ini
    return 1 + max(kedalaman_kiri, kedalaman_kanan)

# Cari semua path dari root ke leaf yang jumlahnya = target
def cari_path(node, target, path_sekarang=None):
    if path_sekarang is None:
        path_sekarang = []

    if node is None:
        return []

    path_sekarang = path_sekarang + [node.val]    # Tambah node ke path

    # Apakah ini leaf dan jumlahnya pas?
    if node.left is None and node.right is None:
        if sum(path_sekarang) == target:
            return [path_sekarang]

    # Cari di kiri dan kanan
    return (cari_path(node.left, target, path_sekarang) +
            cari_path(node.right, target, path_sekarang))
\`\`\`

---

## 📂 Rekursi di Dunia Nyata: Jelajahi Direktori

\`\`\`python
import os

# Hitung total ukuran semua file dalam folder (termasuk subfolder)
def hitung_ukuran_folder(path):
    total = 0
    for item in os.scandir(path):
        if item.is_file():
            total += item.stat().st_size          # Tambah ukuran file
        elif item.is_dir():
            total += hitung_ukuran_folder(item.path)  # Rekursi ke subfolder!
    return total

# Cari semua file dengan ekstensi tertentu
def cari_file(path, ekstensi):
    hasil = []
    for item in os.scandir(path):
        if item.is_file() and item.name.endswith(ekstensi):
            hasil.append(item.path)
        elif item.is_dir():
            hasil.extend(cari_file(item.path, ekstensi))  # Rekursi!
    return hasil

# Contoh penggunaan
ukuran = hitung_ukuran_folder("C:/Users/Budi/Documents")
print(f"Total: {ukuran / 1024 / 1024:.1f} MB")

file_python = cari_file("./project", ".py")
print(f"Ditemukan {len(file_python)} file .py")
\`\`\`

---

## 💥 Stack Overflow — Bahaya Rekursi Tanpa Base Case

\`\`\`python
# ❌ INI BERBAHAYA — jangan dicoba tanpa tahu risikonya
def tidak_ada_batasnya(n):
    return tidak_ada_batasnya(n + 1)   # Tidak ada base case!

# Python akan lempar RecursionError setelah ~1000 panggilan
# (Python sengaja batasi ini untuk mencegah crash)

# Cek batas rekursi Python
import sys
print(sys.getrecursionlimit())   # 1000 (default)

# Bisa diubah, tapi tidak disarankan
sys.setrecursionlimit(5000)

# Untuk rekursi yang sangat dalam, lebih baik ganti ke iterasi
# atau pakai teknik "tail call optimization" dengan loop eksplisit

# ✅ Pola aman: selalu pastikan n berkurang menuju base case
def aman(n):
    if n <= 0: return 0    # ← Base case jelas
    return n + aman(n - 1)  # ← n selalu berkurang
\`\`\`

---

## 🔄 Kapan Rekursi, Kapan Iterasi?

\`\`\`
Pakai REKURSI kalau:
✅ Masalahnya sendiri bersifat rekursif (tree, graph, direktori)
✅ Solusinya jauh lebih mudah dibaca dengan rekursi
✅ Kedalamannya tidak akan sangat besar

Pakai ITERASI kalau:
✅ Kamu butuh performa maksimal
✅ Kedalamannya bisa sangat besar (risiko stack overflow)
✅ Bahasa tidak support tail call optimization
✅ Masalahnya lebih natural ditulis sebagai loop

Contoh nyata:
- Faktorial   → Iterasi lebih baik (mudah dan efisien)
- Tree search → Rekursi lebih natural dan mudah dibaca
- Fibonacci   → Iterasi atau memoization
- Direktori   → Rekursi jauh lebih mudah
\`\`\`

---

## 🎮 Tantangan: Tower of Hanoi

\`\`\`python
# Tower of Hanoi — puzzle klasik yang solusinya elegance tersendiri dengan rekursi
# 3 tiang, n disk. Pindahkan semua dari tiang A ke tiang C,
# dengan aturan: tidak boleh taruh disk besar di atas disk kecil.

def hanoi(n, dari, ke, via):
    if n == 1:
        # Base case: tinggal 1 disk, langsung pindahkan
        print(f"Pindahkan disk 1 dari {dari} ke {ke}")
        return

    # 1. Pindahkan n-1 disk dari 'dari' ke 'via' (lewat 'ke')
    hanoi(n - 1, dari, via, ke)

    # 2. Pindahkan disk terbesar ke tujuan
    print(f"Pindahkan disk {n} dari {dari} ke {ke}")

    # 3. Pindahkan n-1 disk dari 'via' ke 'ke' (lewat 'dari')
    hanoi(n - 1, via, ke, dari)

# Test dengan 3 disk
hanoi(3, "A", "C", "B")
# Pindahkan disk 1 dari A ke C
# Pindahkan disk 2 dari A ke B
# Pindahkan disk 1 dari C ke B
# Pindahkan disk 3 dari A ke C
# Pindahkan disk 1 dari B ke A
# Pindahkan disk 2 dari B ke C
# Pindahkan disk 1 dari A ke C
# 7 langkah untuk 3 disk — dan solusinya OPTIMAL!

# Kompleksitas: O(2^n) — 3 disk = 7 langkah, 10 disk = 1023 langkah
\`\`\`

---

## 📝 Ringkasan

Rekursi bukan sekedar teknik mewah — di banyak kasus, ini cara paling alami untuk ungkapkan solusi:

- Setiap fungsi rekursif butuh **base case** (berhenti) dan **recursive case** (masalah lebih kecil)
- Gunakan **memoization** (cache hasil) untuk menghindari perhitungan berulang
- Rekursi sangat cocok untuk **tree, graph, direktori** — struktur yang sendirinya rekursif
- Waspada **stack overflow** untuk rekursi yang sangat dalam — pertimbangkan iterasi

> **Selanjutnya: Dynamic Programming — teknik optimasi yang mengubah masalah O(2^n) menjadi O(n) dengan cara yang cerdas!** 🚀
`;
