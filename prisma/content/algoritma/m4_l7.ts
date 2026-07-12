export const algo_l7 = `
# Greedy Algorithm — Ambil yang Terbaik Sekarang

Greedy (serakah) — kedengarannya negatif, tapi ini adalah salah satu strategi algoritma yang paling berguna. Idenya sederhana: **di setiap langkah, ambil pilihan yang paling menguntungkan saat ini**, tanpa memikirkan konsekuensi jangka panjang.

---

## 🤔 Kapan Greedy Bekerja?

Greedy tidak selalu menghasilkan solusi optimal. Tapi untuk masalah tertentu yang punya "greedy choice property" dan "optimal substructure", greedy selalu berhasil.

Analoginya: kamu punya Rp 10.000 dan mau kembalian minimum dari kasir. Kasir akan pilih koin/uang kertas terbesar yang muat, lalu ulangi. Strategi ini optimal untuk sistem mata uang yang dirancang dengan baik.

---

## 💰 Coin Change — Versi Greedy

\`\`\`python
# Kembalian minimum — GREEDY (hanya optimal untuk koin tertentu!)
def kembalian_greedy(nominal_koin, target):
    koin = sorted(nominal_koin, reverse=True)  # Urutkan besar ke kecil
    hasil = []

    for k in koin:
        while target >= k:
            hasil.append(k)
            target -= k

    if target != 0:
        return None    # Tidak bisa dibuat

    return hasil

# Test dengan koin Indonesia
koin_indonesia = [1000, 500, 200, 100, 50]
print(kembalian_greedy(koin_indonesia, 2750))
# [1000, 1000, 500, 200, 50] = 5 koin ✅

# HATI-HATI: Greedy tidak selalu optimal!
koin_aneh = [1, 3, 4]
# Target: 6
# Greedy: 4 + 1 + 1 = 3 koin
# Optimal: 3 + 3   = 2 koin ← DP lebih baik untuk ini!
print(kembalian_greedy(koin_aneh, 6))  # [4, 1, 1] — bukan optimal
\`\`\`

---

## 📅 Activity Selection — Pilih Aktivitas Terbanyak

\`\`\`python
# Masalah: ada n kegiatan dengan waktu mulai dan selesai.
# Pilih kegiatan sebanyak mungkin tanpa ada yang bentrok.

def activity_selection(kegiatan):
    # Sort berdasarkan waktu SELESAI (greedy choice!)
    sorted_kegiatan = sorted(kegiatan, key=lambda x: x[1])

    dipilih = [sorted_kegiatan[0]]    # Selalu ambil yang selesai pertama

    for kegiatan in sorted_kegiatan[1:]:
        mulai, selesai = kegiatan
        # Ambil jika mulai setelah kegiatan terakhir yang dipilih selesai
        if mulai >= dipilih[-1][1]:
            dipilih.append(kegiatan)

    return dipilih

# Format: (mulai, selesai, nama)
jadwal = [
    (1, 4, "Matematika"),
    (3, 5, "IPA"),
    (0, 6, "Bahasa Indonesia"),
    (5, 7, "Sejarah"),
    (3, 9, "IPS"),
    (5, 9, "Olahraga"),
    (6, 10, "Kesenian"),
    (8, 11, "Prakarya"),
]

hasil = activity_selection(jadwal)
print("Kegiatan yang dipilih:")
for mulai, selesai, nama in hasil:
    print(f"  {nama}: jam {mulai}-{selesai}")

# Matematika: jam 1-4
# Sejarah: jam 5-7
# Prakarya: jam 8-11
# Total: 3 kegiatan (optimal!)
\`\`\`

---

## 🗜️ Huffman Coding — Kompresi Data

\`\`\`python
import heapq
from collections import Counter

class NodHuffman:
    def __init__(self, karakter, frekuensi):
        self.karakter  = karakter
        self.frekuensi = frekuensi
        self.kiri  = None
        self.kanan = None

    def __lt__(self, lain):
        return self.frekuensi < lain.frekuensi

def bangun_pohon_huffman(teks):
    frekuensi = Counter(teks)
    heap = [NodHuffman(k, f) for k, f in frekuensi.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        kiri  = heapq.heappop(heap)   # Dua terkecil
        kanan = heapq.heappop(heap)

        induk = NodHuffman(None, kiri.frekuensi + kanan.frekuensi)
        induk.kiri  = kiri
        induk.kanan = kanan
        heapq.heappush(heap, induk)

    return heap[0]    # Akar pohon

def buat_kode(nod, prefix="", kode=None):
    if kode is None: kode = {}
    if nod.karakter is not None:
        kode[nod.karakter] = prefix or "0"
    else:
        buat_kode(nod.kiri,  prefix + "0", kode)
        buat_kode(nod.kanan, prefix + "1", kode)
    return kode

def kompresi_huffman(teks):
    pohon = bangun_pohon_huffman(teks)
    kode  = buat_kode(pohon)

    dikompres = "".join(kode[c] for c in teks)

    ukuran_asli      = len(teks) * 8    # 8 bit per karakter
    ukuran_kompres   = len(dikompres)
    rasio_kompresi   = (1 - ukuran_kompres / ukuran_asli) * 100

    return dikompres, kode, rasio_kompresi

teks = "abracadabra mississippi"
dikompres, kode, rasio = kompresi_huffman(teks)

print("Kode Huffman:")
for karakter, kodenya in sorted(kode.items(), key=lambda x: len(x[1])):
    print(f"  '{karakter}': {kodenya}")

print(f"\nUkuran asli: {len(teks) * 8} bit")
print(f"Ukuran kompres: {len(dikompres)} bit")
print(f"Rasio kompresi: {rasio:.1f}%")
\`\`\`

---

## 🛤️ Kruskal & Prim — Minimum Spanning Tree

\`\`\`python
# Minimum Spanning Tree: hubungkan semua node dengan biaya minimum
# Kruskal: urutkan semua edge berdasarkan bobot, ambil yang tidak membentuk cycle

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank   = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # Path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False    # Sudah terhubung (cycle!)
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskal(n_node, edges):
    # edges: [(bobot, node1, node2), ...]
    edges.sort()    # Greedy: urutkan berdasarkan bobot
    uf  = UnionFind(n_node)
    mst = []
    total_bobot = 0

    for bobot, u, v in edges:
        if uf.union(u, v):
            mst.append((u, v, bobot))
            total_bobot += bobot
            if len(mst) == n_node - 1:
                break   # MST sudah lengkap

    return mst, total_bobot

# Contoh: jaringan kabel antar kota
# Node: 0=Jakarta, 1=Bandung, 2=Semarang, 3=Yogyakarta, 4=Surabaya
edges = [
    (150, 0, 1),    # Jakarta-Bandung: 150km
    (445, 0, 2),    # Jakarta-Semarang: 445km
    (560, 0, 3),    # Jakarta-Yogyakarta
    (730, 0, 4),    # Jakarta-Surabaya
    (120, 1, 2),    # Bandung-Semarang
    (70,  2, 3),    # Semarang-Yogyakarta
    (100, 3, 4),    # Yogyakarta-Surabaya
    (300, 1, 4),    # Bandung-Surabaya
]

kota = ["Jakarta", "Bandung", "Semarang", "Yogyakarta", "Surabaya"]
mst, total = kruskal(5, edges)

print("Jaringan kabel optimal (MST):")
for u, v, bobot in mst:
    print(f"  {kota[u]} - {kota[v]}: {bobot}km")
print(f"Total panjang kabel: {total}km")
\`\`\`

---

## 🎯 Interval Scheduling — Masalah Jadwal

\`\`\`python
# Berapa ruang kelas minimum yang dibutuhkan untuk semua mata pelajaran?
import heapq

def ruang_minimum(jadwal):
    if not jadwal: return 0

    # Sort berdasarkan waktu mulai
    sorted_jadwal = sorted(jadwal, key=lambda x: x[0])

    # Min-heap berisi waktu selesai setiap ruang yang sedang dipakai
    ruang = []

    for mulai, selesai, nama in sorted_jadwal:
        if ruang and ruang[0] <= mulai:
            # Ruang terakhir yang selesai sudah kosong, pakai itu
            heapq.heapreplace(ruang, selesai)
        else:
            # Butuh ruang baru
            heapq.heappush(ruang, selesai)

    return len(ruang)

jadwal = [
    (9, 10, "Matematika"),
    (9, 12, "Bahasa"),
    (10, 11, "IPA"),
    (11, 13, "IPS"),
    (12, 14, "Olahraga"),
]

print(f"Ruang minimum: {ruang_minimum(jadwal)}")  # 3
\`\`\`

---

## 📝 Ringkasan

**Greedy bekerja optimal untuk:**
- **Activity Selection**: pilih berdasarkan waktu selesai terkecil
- **Huffman Coding**: selalu gabungkan dua node dengan frekuensi terkecil
- **Kruskal/Prim MST**: selalu ambil edge dengan bobot terkecil
- **Interval Scheduling**: pilih berdasarkan waktu selesai

**Ciri masalah yang cocok untuk Greedy:**
1. Greedy choice property: pilihan lokal optimal → solusi global optimal
2. Optimal substructure: solusi optimal berisi sub-solusi optimal

> **Selanjutnya: Backtracking — eksplorasi semua kemungkinan secara cerdas!** 🚀
`;
