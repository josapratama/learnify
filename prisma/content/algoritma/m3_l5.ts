export const algo_l5 = `
# Graph — Cara Komputer Memahami Peta dan Jaringan

Kalau kamu pernah pakai Google Maps, LinkedIn, atau lihat "orang yang mungkin kamu kenal" di Facebook — itu semua berjalan di atas struktur data bernama **Graph**.

Graph adalah cara paling alami untuk merepresentasikan hubungan antar entitas. Kota dan jalan, orang dan pertemanan, halaman web dan link — semuanya bisa dimodelkan sebagai graph.

---

## 🗺️ Apa itu Graph?

\`\`\`
Graph = kumpulan Node (simpul) + Edge (sisi/hubungan)

Contoh nyata:
- Node  = kota,       Edge = jalan yang menghubungkan
- Node  = orang,      Edge = pertemanan
- Node  = halaman web, Edge = hyperlink
- Node  = mata pelajaran, Edge = prasyarat ("A harus sebelum B")

Jenis graph:
- Undirected: hubungan dua arah (pertemanan — kalau A kenal B, B kenal A)
- Directed:   hubungan satu arah (Instagram follow — A follow B ≠ B follow A)
- Weighted:   setiap edge punya bobot (jalan — jarak atau waktu tempuh)
\`\`\`

---

## 🏗️ Representasi Graph di Kode

\`\`\`python
# Ada dua cara umum menyimpan graph:
# 1. Adjacency List  — daftar tetangga setiap node (efisien untuk graph jarang)
# 2. Adjacency Matrix — tabel 2D (efisien untuk graph padat)

# ─── Adjacency List — yang paling umum dipakai ───
class Graph:
    def __init__(self, directed=False):
        self.adjacency = {}       # {node: [tetangga1, tetangga2, ...]}
        self.directed  = directed

    def tambah_node(self, node):
        if node not in self.adjacency:
            self.adjacency[node] = []

    def tambah_edge(self, u, v, bobot=1):
        self.tambah_node(u)
        self.tambah_node(v)
        self.adjacency[u].append((v, bobot))
        if not self.directed:
            self.adjacency[v].append((u, bobot))    # Dua arah

    def tetangga(self, node):
        return self.adjacency.get(node, [])

    def tampilkan(self):
        for node, tetangga in self.adjacency.items():
            print(f"{node} → {[t for t, _ in tetangga]}")


# Contoh: Peta kota
peta = Graph(directed=False)
peta.tambah_edge("Jakarta", "Bandung", 150)      # 150 km
peta.tambah_edge("Jakarta", "Bogor", 60)
peta.tambah_edge("Bandung", "Cirebon", 130)
peta.tambah_edge("Bogor",   "Bandung", 120)
peta.tambah_edge("Cirebon", "Semarang", 210)

peta.tampilkan()
# Jakarta → ['Bandung', 'Bogor']
# Bandung → ['Jakarta', 'Cirebon', 'Bogor']
# ...
\`\`\`

---

## 🌊 BFS — Breadth First Search (Cari Level per Level)

\`\`\`python
from collections import deque

# BFS: jelajah semua node terdekat dulu, baru yang lebih jauh
# Analogi: gelombang di air — menyebar ke semua arah secara merata

def bfs(graph, start):
    visited = set()
    queue   = deque([start])
    urutan  = []

    visited.add(start)

    while queue:
        node = queue.popleft()    # Ambil dari depan
        urutan.append(node)

        for tetangga, _ in graph.tetangga(node):
            if tetangga not in visited:
                visited.add(tetangga)
                queue.append(tetangga)

    return urutan

# Cari jalur TERPENDEK dengan BFS (dalam jumlah langkah)
def jalur_terpendek_bfs(graph, start, end):
    if start == end: return [start]

    visited  = {start}
    queue    = deque([[start]])    # Simpan PATH, bukan hanya node

    while queue:
        path = queue.popleft()
        node = path[-1]    # Node terakhir di path saat ini

        for tetangga, _ in graph.tetangga(node):
            if tetangga == end:
                return path + [tetangga]    # Ketemu!

            if tetangga not in visited:
                visited.add(tetangga)
                queue.append(path + [tetangga])

    return []    # Tidak ada jalur

# Test
print(bfs(peta, "Jakarta"))
# ['Jakarta', 'Bandung', 'Bogor', 'Cirebon', 'Semarang']

jalur = jalur_terpendek_bfs(peta, "Jakarta", "Semarang")
print(" → ".join(jalur))   # Jakarta → Bandung → Cirebon → Semarang
\`\`\`

---

## 🔍 DFS — Depth First Search (Telusuri Sedalam Mungkin)

\`\`\`python
# DFS: terus masuk sedalam mungkin, baru balik kalau sudah mentok
# Analogi: jelajah labirin — terus maju, kalau buntu baru mundur

def dfs_iteratif(graph, start):
    visited = set()
    stack   = [start]
    urutan  = []

    while stack:
        node = stack.pop()    # Ambil dari paling atas (LIFO)

        if node not in visited:
            visited.add(node)
            urutan.append(node)

            for tetangga, _ in graph.tetangga(node):
                if tetangga not in visited:
                    stack.append(tetangga)

    return urutan

# DFS rekursif — lebih bersih untuk kode
def dfs_rekursif(graph, node, visited=None):
    if visited is None:
        visited = set()

    visited.add(node)
    urutan = [node]

    for tetangga, _ in graph.tetangga(node):
        if tetangga not in visited:
            urutan.extend(dfs_rekursif(graph, tetangga, visited))

    return urutan

# Cek apakah graph terhubung (semua node bisa dicapai)
def terhubung(graph):
    if not graph.adjacency: return True
    start = next(iter(graph.adjacency))
    return len(dfs_rekursif(graph, start)) == len(graph.adjacency)

# Deteksi cycle (perputaran) dalam graph
def ada_cycle(graph):
    visited = set()

    def dfs(node, parent):
        visited.add(node)
        for tetangga, _ in graph.tetangga(node):
            if tetangga not in visited:
                if dfs(tetangga, node):
                    return True
            elif tetangga != parent:    # Kembali ke node yang bukan parent = cycle!
                return True
        return False

    for node in graph.adjacency:
        if node not in visited:
            if dfs(node, None):
                return True

    return False
\`\`\`

---

## 🗺️ Dijkstra — Jalur Terpendek Berbobot

\`\`\`python
import heapq    # Priority queue yang efisien

# BFS mencari jalur terpendek dalam LANGKAH.
# Dijkstra mencari jalur terpendek dalam BOBOT (jarak, waktu, biaya).

def dijkstra(graph, start):
    # jarak[node] = jarak terpendek dari start ke node itu
    jarak    = {node: float("inf") for node in graph.adjacency}
    jarak[start] = 0
    sebelumnya   = {start: None}    # Untuk rekonstruksi jalur

    # Priority queue: (jarak, node) — selalu proses yang terdekat dulu
    pq = [(0, start)]

    while pq:
        jarak_saat_ini, node = heapq.heappop(pq)

        # Kalau kita sudah temukan jarak yang lebih baik sebelumnya, skip
        if jarak_saat_ini > jarak[node]:
            continue

        for tetangga, bobot in graph.tetangga(node):
            jarak_baru = jarak[node] + bobot
            if jarak_baru < jarak[tetangga]:
                jarak[tetangga] = jarak_baru
                sebelumnya[tetangga] = node
                heapq.heappush(pq, (jarak_baru, tetangga))

    return jarak, sebelumnya

def rekonstruksi_jalur(sebelumnya, end):
    jalur = []
    node  = end
    while node is not None:
        jalur.append(node)
        node = sebelumnya[node]
    return list(reversed(jalur))

# Test dengan peta kota
jarak, prev = dijkstra(peta, "Jakarta")
print(jarak)
# {'Jakarta': 0, 'Bandung': 150, 'Bogor': 60, 'Cirebon': 280, 'Semarang': 490}

jalur_ke_semarang = rekonstruksi_jalur(prev, "Semarang")
print(" → ".join(jalur_ke_semarang))
# Jakarta → Bandung → Cirebon → Semarang (total 490 km)
\`\`\`

---

## 🏫 Topological Sort — Urutan Dependensi

\`\`\`python
# Masalah: ada n mata pelajaran, beberapa punya prasyarat.
# Tentukan urutan belajar yang valid.

# Graph: Matematika → Statistik → Machine Learning → AI

def topological_sort(graph):
    # Hitung in-degree (berapa yang mengarah ke node ini)
    in_degree = {node: 0 for node in graph.adjacency}
    for node in graph.adjacency:
        for tetangga, _ in graph.tetangga(node):
            in_degree[tetangga] += 1

    # Mulai dari node tanpa prasyarat
    queue  = deque([n for n, d in in_degree.items() if d == 0])
    urutan = []

    while queue:
        node = queue.popleft()
        urutan.append(node)

        for tetangga, _ in graph.tetangga(node):
            in_degree[tetangga] -= 1
            if in_degree[tetangga] == 0:    # Semua prasyaratnya sudah selesai
                queue.append(tetangga)

    if len(urutan) != len(graph.adjacency):
        raise ValueError("Ada cycle! Urutan tidak mungkin.")

    return urutan

# Contoh kurikulum belajar
kurikulum = Graph(directed=True)
kurikulum.tambah_edge("HTML",        "CSS")
kurikulum.tambah_edge("CSS",         "JavaScript")
kurikulum.tambah_edge("JavaScript",  "React")
kurikulum.tambah_edge("JavaScript",  "Node.js")
kurikulum.tambah_edge("React",       "Next.js")
kurikulum.tambah_edge("Node.js",     "Next.js")

print(topological_sort(kurikulum))
# ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Next.js']
# Urutan belajar yang valid!
\`\`\`

---

## 📝 Ringkasan

| Algoritma | Kompleksitas | Kegunaan |
|-----------|-------------|---------|
| BFS | O(V + E) | Jalur terpendek (langkah), level traversal |
| DFS | O(V + E) | Deteksi cycle, connected components |
| Dijkstra | O((V+E) log V) | Jalur terpendek berbobot |
| Topological Sort | O(V + E) | Urutan dependensi, build systems |

V = jumlah vertex (node), E = jumlah edge

- **BFS** = level per level, baik untuk "cari yang paling dekat"
- **DFS** = sedalam mungkin, baik untuk "jelajah semua kemungkinan"
- **Dijkstra** = BFS tapi aware terhadap bobot edge

> **Selanjutnya: Proyek akhir dan soal interview — terapkan semua yang sudah dipelajari!** 🚀
`;
