export const algo_l8 = `
# Backtracking — Jelajahi Semua Kemungkinan dengan Cerdas

Backtracking adalah teknik yang terkesan brute force tapi sebenarnya cerdas: **coba semua kemungkinan, tapi potong cabang yang jelas tidak akan berhasil lebih awal** (pruning).

Dipakai untuk: sudoku solver, N-Queens problem, permutasi/kombinasi, dan banyak puzzle.

---

## 🧩 Konsep Dasar

\`\`\`python
# Template umum backtracking:
def backtrack(state, hasil):
    if is_solusi(state):
        hasil.append(state.copy())
        return

    for pilihan in pilihan_tersedia(state):
        if is_valid(state, pilihan):
            state.tambah(pilihan)        # Buat pilihan
            backtrack(state, hasil)      # Rekursi
            state.hapus(pilihan)         # UNDO pilihan (backtrack!)
\`\`\`

---

## 🔢 Permutasi & Kombinasi

\`\`\`python
# Hasilkan semua permutasi dari array
def permutasi(nums):
    hasil = []

    def backtrack(current, sisa):
        if not sisa:
            hasil.append(current[:])
            return

        for i, num in enumerate(sisa):
            current.append(num)
            backtrack(current, sisa[:i] + sisa[i+1:])
            current.pop()   # UNDO

    backtrack([], nums)
    return hasil

print(permutasi([1, 2, 3]))
# [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

# Kombinasi — pilih k dari n
def kombinasi(n, k):
    hasil = []

    def backtrack(mulai, current):
        if len(current) == k:
            hasil.append(current[:])
            return

        for i in range(mulai, n + 1):
            current.append(i)
            backtrack(i + 1, current)   # i+1 bukan i karena tidak boleh ulang
            current.pop()

    backtrack(1, [])
    return hasil

print(kombinasi(4, 2))   # [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]

# Subset — semua kemungkinan himpunan bagian
def semua_subset(nums):
    hasil = []

    def backtrack(mulai, current):
        hasil.append(current[:])   # Setiap state adalah subset valid

        for i in range(mulai, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()

    backtrack(0, [])
    return hasil

print(semua_subset([1, 2, 3]))
# [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
\`\`\`

---

## 👑 N-Queens Problem

\`\`\`python
# Tempatkan N ratu di papan N×N
# sehingga tidak ada dua ratu yang saling menyerang

def n_queens(n):
    hasil = []

    def is_aman(papan, baris, kolom):
        # Cek kolom yang sama
        for r in range(baris):
            if papan[r] == kolom:
                return False

        # Cek diagonal kiri atas
        r, c = baris - 1, kolom - 1
        while r >= 0 and c >= 0:
            if papan[r] == c: return False
            r -= 1; c -= 1

        # Cek diagonal kanan atas
        r, c = baris - 1, kolom + 1
        while r >= 0 and c < n:
            if papan[r] == c: return False
            r -= 1; c += 1

        return True

    def backtrack(baris, papan):
        if baris == n:
            # Konversi ke format yang mudah dibaca
            solusi = []
            for r in range(n):
                baris_str = ["." for _ in range(n)]
                baris_str[papan[r]] = "Q"
                solusi.append("".join(baris_str))
            hasil.append(solusi)
            return

        for kolom in range(n):
            if is_aman(papan, baris, kolom):
                papan[baris] = kolom
                backtrack(baris + 1, papan)
                papan[baris] = -1  # Backtrack

    backtrack(0, [-1] * n)
    return hasil

solusi = n_queens(4)
print(f"Solusi N-Queens (4x4): {len(solusi)} solusi")
for s in solusi:
    print()
    for baris in s:
        print(baris)
\`\`\`

---

## 🟩 Sudoku Solver

\`\`\`python
def solve_sudoku(papan):
    def is_valid(papan, baris, kolom, angka):
        n = str(angka)

        # Cek baris
        if n in papan[baris]: return False

        # Cek kolom
        for r in range(9):
            if papan[r][kolom] == n: return False

        # Cek kotak 3x3
        start_r = (baris // 3) * 3
        start_c = (kolom // 3) * 3
        for r in range(start_r, start_r + 3):
            for c in range(start_c, start_c + 3):
                if papan[r][c] == n: return False

        return True

    def backtrack():
        for baris in range(9):
            for kolom in range(9):
                if papan[baris][kolom] == ".":
                    for angka in range(1, 10):
                        if is_valid(papan, baris, kolom, angka):
                            papan[baris][kolom] = str(angka)

                            if backtrack():
                                return True

                            papan[baris][kolom] = "."   # Backtrack!

                    return False   # Tidak ada angka yang valid

        return True   # Semua sel terisi

    backtrack()

# Test
papan = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
]

solve_sudoku(papan)
for baris in papan:
    print(" ".join(baris))
\`\`\`

---

## 🗺️ Word Search di Grid

\`\`\`python
# Cari kata di grid 2D (bisa ke semua 8 arah)
def cari_kata(grid, kata):
    baris_max, kolom_max = len(grid), len(grid[0])
    ditemukan = []

    def backtrack(r, c, idx, path):
        if idx == len(kata):
            ditemukan.append(path[:])
            return

        if (r < 0 or r >= baris_max or
            c < 0 or c >= kolom_max or
            (r, c) in path or
            grid[r][c] != kata[idx]):
            return

        path.add((r, c))
        for dr, dc in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]:
            backtrack(r + dr, c + dc, idx + 1, path)
        path.discard((r, c))   # Backtrack

    for r in range(baris_max):
        for c in range(kolom_max):
            if grid[r][c] == kata[0]:
                backtrack(r, c, 0, set())

    return len(ditemukan) > 0

grid = [
    ["A","B","C","E"],
    ["S","F","C","S"],
    ["A","D","E","E"],
]

print(cari_kata(grid, "ABCCED"))  # True
print(cari_kata(grid, "SEE"))     # True
print(cari_kata(grid, "ABCB"))    # False
\`\`\`

---

## 📝 Ringkasan

Backtracking = **coba semua kemungkinan + potong lebih awal kalau tidak valid**:

- Setiap langkah: buat pilihan → rekursi → undo (backtrack)
- Pruning: \`if not is_valid(): return\` — hemat waktu banyak!
- Kompleksitas: bisa O(n!) tapi pruning biasanya jauh lebih baik

Soal-soal yang cocok: permutasi, kombinasi, subset, N-Queens, Sudoku, word search, graph coloring, maze solving.

> **Selanjutnya: Advanced Sorting & Greedy Lanjutan — Radix Sort, Topological Sort, dan masalah klasik!** 🚀
`;
