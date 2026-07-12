export const algo_l4 = `
# Dynamic Programming — Jangan Hitung Dua Kali Hal yang Sama

Dynamic Programming (DP) terdengar sangat akademis dan menakutkan. Padahal ide dasarnya sangat sederhana: **kalau kamu sudah menghitung sesuatu, simpan hasilnya — jangan hitung lagi**.

Teknik ini mengubah banyak masalah yang tadinya butuh waktu eksponensial (O(2^n)) menjadi jauh lebih cepat, bahkan O(n). Ini salah satu topik yang paling sering muncul di interview kerja developer.

---

## 🧠 Dua Pendekatan DP

**Top-Down (Memoization)** = Rekursi + Cache
- Mulai dari masalah besar, pecah ke yang kecil
- Simpan hasil yang sudah pernah dihitung
- Lebih intuitif, kode mirip rekursi biasa

**Bottom-Up (Tabulation)** = Iterasi
- Mulai dari masalah terkecil, bangun ke yang besar
- Biasanya lebih efisien karena tidak ada overhead rekursi
- Butuh sedikit lebih banyak pemikiran di awal

---

## 💰 Masalah Kembalian Koin — Contoh Klasik

\`\`\`python
# Diberi koin dengan nilai tertentu, berapa koin minimal untuk kembalian sebesar target?
# Contoh: koin = [1, 5, 10, 25], target = 30
# Jawaban: 2 koin (25 + 5)

# ─── Pendekatan 1: Rekursi biasa — O(nilai^n) = SANGAT lambat ───
def koin_lambat(koin, target):
    if target == 0: return 0
    if target < 0:  return float("inf")

    minimal = float("inf")
    for k in koin:
        hasil = koin_lambat(koin, target - k)
        minimal = min(minimal, hasil + 1)
    return minimal

# ─── Pendekatan 2: Top-down dengan memoization — O(nilai × n) ───
def koin_memo(koin, target, memo=None):
    if memo is None: memo = {}
    if target in memo: return memo[target]    # ← Sudah pernah dihitung!
    if target == 0: return 0
    if target < 0:  return float("inf")

    minimal = float("inf")
    for k in koin:
        hasil = koin_memo(koin, target - k, memo)
        minimal = min(minimal, hasil + 1)

    memo[target] = minimal    # ← Simpan hasilnya
    return minimal

# ─── Pendekatan 3: Bottom-up — paling efisien ───
def koin_dp(koin, target):
    # dp[i] = koin minimal untuk membuat kembalian sebesar i
    dp = [float("inf")] * (target + 1)
    dp[0] = 0    # Base case: 0 koin untuk target = 0

    for i in range(1, target + 1):
        for k in koin:
            if k <= i:    # Koin tidak boleh lebih besar dari target saat ini
                dp[i] = min(dp[i], dp[i - k] + 1)

    return dp[target] if dp[target] != float("inf") else -1

print(koin_dp([1, 5, 10, 25], 30))   # 2 (25 + 5)
print(koin_dp([1, 5, 10, 25], 11))   # 2 (10 + 1)
print(koin_dp([2], 3))               # -1 (tidak mungkin)
\`\`\`

---

## 🎒 0/1 Knapsack — Masukkan Barang ke Ransel

\`\`\`python
# Kamu punya ransel kapasitas W kg.
# Ada n barang, masing-masing punya berat dan nilai.
# Pilih barang mana saja agar nilai total MAKSIMAL tanpa melebihi kapasitas.
# Setiap barang hanya bisa diambil SEKALI (0 atau 1).

def knapsack(kapasitas, berat, nilai, n):
    # dp[i][j] = nilai maksimal menggunakan i barang pertama dengan kapasitas j
    dp = [[0] * (kapasitas + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(kapasitas + 1):
            # Pilihan 1: tidak ambil barang ke-i
            dp[i][j] = dp[i-1][j]

            # Pilihan 2: ambil barang ke-i (kalau muat)
            if berat[i-1] <= j:
                ambil = nilai[i-1] + dp[i-1][j - berat[i-1]]
                dp[i][j] = max(dp[i][j], ambil)

    return dp[n][kapasitas]

# Contoh: Liburan dengan ransel 50 kg
nama_barang = ["Laptop", "Kamera", "Buku", "Charger", "Baju Ganti"]
berat        = [15,       8,        2,       1,         3]
nilai        = [100,      80,       20,      10,        30]    # Skor kepentingan

print(knapsack(20, berat, nilai, len(nama_barang)))   # 190
# Ambil: Laptop (100) + Baju Ganti (30) + Kamera (80)... tapi bisa lebih optimal

# Versi dengan tracking (tau barang mana yang diambil)
def knapsack_dengan_tracking(kapasitas, berat, nilai, n):
    dp = [[0] * (kapasitas + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(kapasitas + 1):
            dp[i][j] = dp[i-1][j]
            if berat[i-1] <= j:
                ambil = nilai[i-1] + dp[i-1][j - berat[i-1]]
                dp[i][j] = max(dp[i][j], ambil)

    # Trace back untuk tahu barang yang diambil
    diambil = []
    j = kapasitas
    for i in range(n, 0, -1):
        if dp[i][j] != dp[i-1][j]:    # Barang ini diambil!
            diambil.append(nama_barang[i-1])
            j -= berat[i-1]

    return dp[n][kapasitas], diambil

nilai_total, pilihan = knapsack_dengan_tracking(20, berat, nilai, len(nama_barang))
print(f"Nilai total: {nilai_total}")
print(f"Barang yang dibawa: {pilihan}")
\`\`\`

---

## 📏 Longest Common Subsequence (LCS)

\`\`\`python
# LCS: cari subsequence terpanjang yang sama dari dua string
# "ABCBDAB" dan "BDCABA" → LCS = "BCBA" (panjang 4)
# Aplikasi nyata: diff tool (git diff), spell checker, DNA sequence analysis

def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1    # Karakter sama, lanjutkan
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])    # Ambil yang terpanjang

    return dp[m][n]

print(lcs("ABCBDAB", "BDCABA"))     # 4
print(lcs("AGGTAB",  "GXTXAYB"))    # 4 (GTAB)

# Versi dengan rekonstruksi subsequence-nya
def lcs_dengan_string(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    # Trace back
    hasil = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            hasil.append(s1[i-1])
            i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1

    return dp[m][n], "".join(reversed(hasil))

panjang, string_lcs = lcs_dengan_string("ABCBDAB", "BDCABA")
print(f"LCS length: {panjang}, LCS: {string_lcs}")   # LCS length: 4, LCS: BCBA
\`\`\`

---

## 🏃 Climbing Stairs — Soal Interview Favorit

\`\`\`python
# Ada tangga dengan n anak tangga.
# Setiap langkah bisa naik 1 atau 2 anak tangga.
# Ada berapa cara berbeda untuk sampai ke atas?

def naik_tangga(n):
    if n <= 2: return n

    dp = [0] * (n + 1)
    dp[1] = 1    # 1 cara untuk 1 tangga
    dp[2] = 2    # 2 cara untuk 2 tangga (1+1 atau 2)

    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]    # Ini Fibonacci!

    return dp[n]

print(naik_tangga(3))    # 3 cara: (1+1+1), (1+2), (2+1)
print(naik_tangga(5))    # 8 cara
print(naik_tangga(10))   # 89 cara

# Versi dengan langkah yang bisa dikustomisasi
def naik_tangga_flex(n, langkah_diperbolehkan=[1, 2, 3]):
    dp = [0] * (n + 1)
    dp[0] = 1    # 1 cara untuk tangga 0 (tidak naik sama sekali)

    for i in range(1, n + 1):
        for langkah in langkah_diperbolehkan:
            if i >= langkah:
                dp[i] += dp[i - langkah]

    return dp[n]

print(naik_tangga_flex(4, [1, 2, 3]))   # 7 cara
\`\`\`

---

## 📝 Pola Umum DP yang Perlu Dikenali

\`\`\`
Jenis masalah yang biasanya diselesaikan dengan DP:

1. Optimization (maksimum/minimum):
   - Knapsack, Coin Change, shortest path

2. Counting (hitung berapa cara):
   - Climbing Stairs, unique paths, kombinatorik

3. Existence (mungkin/tidak):
   - Subset sum, word break

Cara kenali masalah DP:
- "Berapa cara/jalur terbaik/minimum untuk..."
- Jawaban bisa dibangun dari sub-jawaban yang lebih kecil
- Ada "tumpang tindih" — submasalah yang sama dihitung berulang

Pola koding:
1. Tentukan dp[i] artinya apa (jawaban untuk submasalah ukuran i)
2. Tulis base case
3. Tulis recurrence relation (dp[i] dari dp[...] sebelumnya)
4. Jawab pertanyaan akhirnya dengan dp[n]
\`\`\`

---

## 📝 Ringkasan

DP bukan teknik yang rumit — ini cara berpikir yang berbeda:

- **Identifikasi submasalah** yang tumpang tindih
- **Simpan hasilnya** (memoization atau tabulation) agar tidak dihitung dua kali
- **Bangun jawaban besar** dari jawaban kecil yang sudah diketahui
- **Top-down** (rekursi + cache) vs **Bottom-up** (iterasi dari kecil ke besar) — dua cara menulis DP, pilih yang lebih nyaman

DP yang kamu pelajari hari ini persis yang ditanyakan di interview Google, Meta, dan perusahaan tech besar lainnya.

> **Selanjutnya: Graph — cara memodelkan jaringan, peta, dan hubungan antar data, beserta algoritma pencariannya!** 🚀
`;
