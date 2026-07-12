export const algo_l6 = `
# Soal Interview & Proyek Akhir — Terapkan Semua yang Sudah Dipelajari

Ini pelajaran terakhir kursus Algoritma & Struktur Data. Kita akan simulasikan sesi interview coding yang sesungguhnya, plus membangun mini-project yang menggabungkan semuanya.

---

## 🎯 Pola Soal Interview yang Paling Sering Muncul

### Pola 1: Two Pointers

\`\`\`python
# Prinsip: dua pointer yang bergerak dari ujung berbeda atau bersama
# Cocok untuk: array terurut, palindrome, pasangan angka

# Cari pasangan yang jumlahnya = target (array sudah terurut)
def two_sum_sorted(arr, target):
    kiri, kanan = 0, len(arr) - 1

    while kiri < kanan:
        jumlah = arr[kiri] + arr[kanan]
        if jumlah == target:
            return [kiri, kanan]
        elif jumlah < target:
            kiri  += 1    # Perlu angka lebih besar
        else:
            kanan -= 1    # Perlu angka lebih kecil

    return []

print(two_sum_sorted([1, 3, 5, 7, 9], 12))   # [2, 4] (5 + 7)

# Cek palindrome
def is_palindrome(s):
    kiri, kanan = 0, len(s) - 1
    while kiri < kanan:
        if s[kiri] != s[kanan]:
            return False
        kiri  += 1
        kanan -= 1
    return True

print(is_palindrome("racecar"))   # True
print(is_palindrome("hello"))     # False

# Hapus duplikat dari sorted array in-place
def hapus_duplikat(arr):
    if not arr: return 0
    tulis = 1    # Pointer untuk posisi menulis
    for baca in range(1, len(arr)):
        if arr[baca] != arr[baca - 1]:
            arr[tulis] = arr[baca]
            tulis += 1
    return tulis    # Panjang array unik

arr = [1, 1, 2, 3, 3, 4]
n = hapus_duplikat(arr)
print(arr[:n])   # [1, 2, 3, 4]
\`\`\`

---

### Pola 2: Sliding Window

\`\`\`python
# Prinsip: window ukuran tetap atau variabel yang "digeser" sepanjang array/string
# Cocok untuk: substring, subarray, masalah berurutan

# Jumlah maksimum subarray ukuran k
def max_sum_subarray(arr, k):
    if len(arr) < k: return -1

    jumlah_window = sum(arr[:k])    # Hitung window pertama
    maks = jumlah_window

    for i in range(k, len(arr)):
        # Geser: tambah elemen baru, hapus elemen lama
        jumlah_window += arr[i] - arr[i - k]
        maks = max(maks, jumlah_window)

    return maks

print(max_sum_subarray([2, 1, 5, 1, 3, 2], k=3))   # 9 (5+1+3)

# Substring terpanjang tanpa karakter berulang
def terpanjang_tanpa_ulang(s):
    char_index = {}    # Simpan posisi terakhir setiap karakter
    kiri = maks = 0

    for kanan, char in enumerate(s):
        # Kalau char sudah ada dalam window, geser batas kiri
        if char in char_index and char_index[char] >= kiri:
            kiri = char_index[char] + 1

        char_index[char] = kanan
        maks = max(maks, kanan - kiri + 1)

    return maks

print(terpanjang_tanpa_ulang("abcabcbb"))   # 3 ("abc")
print(terpanjang_tanpa_ulang("pwwkew"))     # 3 ("wke")
\`\`\`

---

### Pola 3: Fast & Slow Pointers

\`\`\`python
# Prinsip: dua pointer bergerak dengan kecepatan berbeda
# Cocok untuk: deteksi cycle di linked list, cari tengah list

class Node:
    def __init__(self, val): self.val = val; self.next = None

# Deteksi cycle di linked list — O(n) waktu, O(1) ruang
def ada_cycle(head):
    lambat = cepat = head

    while cepat and cepat.next:
        lambat = lambat.next           # Maju 1 langkah
        cepat  = cepat.next.next      # Maju 2 langkah

        if lambat is cepat:
            return True    # Ketemu! Ada cycle

    return False

# Cari node tengah linked list
def cari_tengah(head):
    lambat = cepat = head

    while cepat and cepat.next:
        lambat = lambat.next
        cepat  = cepat.next.next

    return lambat    # lambat ada di tengah saat cepat sampai akhir

# Test
head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
head.next.next.next = Node(4)
head.next.next.next.next = Node(5)

print(cari_tengah(head).val)   # 3
print(ada_cycle(head))          # False

# Buat cycle untuk test
head.next.next.next.next.next = head.next.next    # Tail → Node(3)
print(ada_cycle(head))   # True
\`\`\`

---

### Pola 4: Binary Search pada Jawaban

\`\`\`python
# Binary search tidak hanya untuk cari di array —
# bisa dipakai untuk "cari nilai terkecil/terbesar yang memenuhi kondisi tertentu"

# Berapa waktu minimal untuk menyelesaikan semua pekerjaan?
# n pekerjaan dengan bobot, k pekerja
def min_waktu(jobs, k):
    def bisa_selesai(batas_waktu):
        # Cek: apakah k pekerja cukup kalau batas waktu tiap pekerja = batas_waktu?
        pekerja = 1
        waktu_sekarang = 0
        for job in jobs:
            if waktu_sekarang + job <= batas_waktu:
                waktu_sekarang += job
            else:
                pekerja += 1           # Butuh pekerja baru
                waktu_sekarang = job
                if pekerja > k:
                    return False
        return True

    # Binary search: cari batas_waktu minimum yang memungkinkan
    kiri  = max(jobs)         # Minimal: pekerjaan terbesar
    kanan = sum(jobs)         # Maksimal: satu orang kerjakan semuanya

    while kiri < kanan:
        tengah = (kiri + kanan) // 2
        if bisa_selesai(tengah):
            kanan = tengah    # Bisa! Coba yang lebih kecil
        else:
            kiri = tengah + 1

    return kiri

print(min_waktu([3, 2, 3], k=3))    # 3
print(min_waktu([1, 2, 3, 4, 5], k=2))   # 9
\`\`\`

---

## 🏗️ Mini Project: Simple LRU Cache

\`\`\`python
# LRU = Least Recently Used
# Cache dengan kapasitas terbatas — kalau penuh, buang yang paling jarang dipakai

# Pakai kombinasi: Hash Map (O(1) lookup) + Doubly Linked List (O(1) insert/delete)
# Ini struktur data yang dipakai di dunia nyata (Redis, browser cache, dll.)

class DLinkedNode:
    def __init__(self, key=0, val=0):
        self.key  = key
        self.val  = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, kapasitas):
        self.kapasitas = kapasitas
        self.cache     = {}    # {key: node}

        # Sentinel nodes — tidak perlu handle edge case!
        self.head = DLinkedNode()    # Dummy head (paling lama)
        self.tail = DLinkedNode()    # Dummy tail (paling baru)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _tambah_di_depan(self, node):
        # Tambah di depan tail (posisi "paling baru")
        node.prev      = self.tail.prev
        node.next      = self.tail
        self.tail.prev.next = node
        self.tail.prev      = node

    def _hapus(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def get(self, key):
        if key not in self.cache:
            return -1    # Tidak ada di cache

        node = self.cache[key]
        self._hapus(node)               # Pindahkan ke posisi "paling baru"
        self._tambah_di_depan(node)
        return node.val

    def put(self, key, value):
        if key in self.cache:
            self._hapus(self.cache[key])

        node = DLinkedNode(key, value)
        self.cache[key] = node
        self._tambah_di_depan(node)

        if len(self.cache) > self.kapasitas:
            # Hapus yang paling lama (tepat setelah head)
            lama = self.head.next
            self._hapus(lama)
            del self.cache[lama.key]

# Test
cache = LRUCache(3)
cache.put(1, "Satu")
cache.put(2, "Dua")
cache.put(3, "Tiga")

print(cache.get(1))   # "Satu" ← Ini sekarang jadi paling baru
cache.put(4, "Empat") # Cache penuh! Hapus yang paling lama = key 2

print(cache.get(2))   # -1 (sudah dibuang)
print(cache.get(3))   # "Tiga" ✅
print(cache.get(4))   # "Empat" ✅
\`\`\`

---

## 💡 Tips untuk Interview Coding

\`\`\`
Saat dapat soal interview, ikuti langkah ini:

1. PAHAMI dulu (2-3 menit)
   - Tanya kalau ada yang kurang jelas
   - Konfirmasi input dan output yang diharapkan
   - Tanya edge case: array kosong? Nilai negatif? Duplikat?

2. BRUTE FORCE dulu
   - Ungkapkan solusi paling sederhana (meski lambat)
   - Ini membuktikan kamu paham masalahnya

3. OPTIMASI
   - Analisa bottleneck: "Bagian mana yang bisa diperbaiki?"
   - Pikirkan struktur data yang bisa membantu
   - Terapkan pola: two pointer? sliding window? hash map?

4. KODE + JELASKAN
   - Sambil nulis, jelaskan apa yang kamu pikirkan
   - Interviewer lebih tertarik cara berpikirmu daripada kode yang sempurna

5. TEST
   - Test dengan contoh normal
   - Test edge case (input kosong, satu elemen, dll.)
   - Sebut kompleksitas waktu dan ruang di akhir

Jangan diam — interviewer ingin mendengar proses berpikirmu!
\`\`\`

---

## 📋 Ringkasan Kursus Algoritma & Struktur Data

| Modul | Topik |
|-------|-------|
| 1 | Big O Notation, Searching, Sorting |
| 2 | Array, Linked List, Stack, Queue, Tree, Hash Table |
| 3 | Rekursi & Memoization |
| 4 | Dynamic Programming |
| 5 | Graph, BFS, DFS, Dijkstra |
| 6 | Interview patterns & LRU Cache project |

**Kamu sekarang sudah memiliki fondasi Computer Science yang kuat.** Dengan memahami konsep-konsep ini, kamu bisa:
- Menulis kode yang lebih efisien dan terukur
- Menjawab pertanyaan interview di perusahaan tech
- Memahami codebase yang lebih kompleks
- Berpikir lebih terstruktur dalam memecahkan masalah

> **Selamat menyelesaikan kursus Algoritma & Struktur Data! Terus berlatih di LeetCode, HackerRank, atau Codeforces — consistency adalah kuncinya!** 🎉🚀
`;
