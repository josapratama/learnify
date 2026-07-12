export const algo_l2 = `
# Struktur Data — Pilih Wadah yang Tepat untuk Data

Algoritma dan struktur data itu dua sisi dari koin yang sama. Kita sudah bahas algoritma di pelajaran sebelumnya. Sekarang giliran struktur data.

Sederhananya: **struktur data adalah cara kamu mengorganisir data** di memori. Dan pilihan yang salah bisa mengubah operasi O(1) jadi O(n).

Contoh nyata: kalau kamu simpan data di list Python dan sering \`del list[0]\` (hapus dari depan), setiap operasi itu O(n) karena semua elemen harus digeser. Tapi kalau pakai \`collections.deque\`, operasi yang sama jadi O(1). Data yang sama, cara simpan berbeda, performa beda jauh.

---

## 📚 Array & Dynamic Array

\`\`\`python
# List Python adalah dynamic array
arr = [10, 20, 30, 40, 50]

# Kompleksitas operasi yang perlu diketahui:
arr[2]           # O(1) — akses by index, langsung ke alamat memori
arr.append(60)   # O(1) amortized — tambah di akhir, biasanya instan
arr.pop()        # O(1) — hapus dari akhir
arr.insert(0, 5) # O(n) — insert di depan: harus geser semua elemen!
arr.remove(30)   # O(n) — cari dulu baru hapus

# Kapan pakai: akses acak, iterasi, tambah/hapus di akhir
# Hindari kalau: sering insert/delete di tengah atau awal
\`\`\`

---

## 🔗 Linked List

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None  # Pointer ke node berikutnya

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        node_baru = Node(data)
        if not self.head:
            self.head = node_baru
            return
        current = self.head
        while current.next:  # Jalan ke akhir
            current = current.next
        current.next = node_baru

    def prepend(self, data):  # O(1) — tambah di depan
        node_baru = Node(data)
        node_baru.next = self.head
        self.head = node_baru

    def hapus(self, data):
        if not self.head:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next

    def tampilkan(self):
        items = []
        current = self.head
        while current:
            items.append(str(current.data))
            current = current.next
        print(" → ".join(items))

# Test
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
ll.prepend(5)
ll.tampilkan()  # 5 → 10 → 20 → 30
ll.hapus(20)
ll.tampilkan()  # 5 → 10 → 30
\`\`\`

**Perbandingan Array vs Linked List:**

| Operasi | Array | Linked List |
|---------|-------|-------------|
| Akses by index | O(1) ✅ | O(n) |
| Insert di awal | O(n) | O(1) ✅ |
| Insert di akhir | O(1) | O(n) / O(1) if tail tracked |
| Delete | O(n) | O(n) |
| Memori | Contiguous, efisien | Extra pointer per node |

---

## 📚 Stack — LIFO (Last In First Out)

\`\`\`python
# Analogi: tumpukan piring — taruh di atas, ambil dari atas

class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):   # Masukkan
        self._data.append(item)

    def pop(self):          # Ambil teratas
        if self.is_empty():
            raise IndexError("Stack kosong")
        return self._data.pop()

    def peek(self):         # Lihat teratas tanpa hapus
        if self.is_empty():
            raise IndexError("Stack kosong")
        return self._data[-1]

    def is_empty(self): return len(self._data) == 0
    def size(self):     return len(self._data)

# Contoh nyata: validasi kurung
def kurung_valid(ekspresi):
    stack = Stack()
    pasangan = {")": "(", "}": "{", "]": "["}

    for char in ekspresi:
        if char in "({[":
            stack.push(char)
        elif char in ")}]":
            if stack.is_empty() or stack.pop() != pasangan[char]:
                return False
    return stack.is_empty()

print(kurung_valid("({[]})"))   # True
print(kurung_valid("({[})"))    # False
print(kurung_valid("((()))"))   # True
\`\`\`

---

## 🚶 Queue — FIFO (First In First Out)

\`\`\`python
from collections import deque

# Analogi: antrian kasir — masuk dari belakang, keluar dari depan

class Queue:
    def __init__(self):
        self._data = deque()  # deque lebih efisien dari list untuk queue

    def enqueue(self, item):    # Masuk dari belakang
        self._data.append(item)

    def dequeue(self):          # Keluar dari depan
        if self.is_empty():
            raise IndexError("Queue kosong")
        return self._data.popleft()  # O(1) dengan deque

    def peek(self):
        return self._data[0]

    def is_empty(self): return len(self._data) == 0
    def size(self):     return len(self._data)

# BFS (Breadth-First Search) menggunakan Queue
def bfs(graph, start):
    visited = set()
    queue = Queue()
    urutan = []

    queue.enqueue(start)
    visited.add(start)

    while not queue.is_empty():
        node = queue.dequeue()
        urutan.append(node)

        for tetangga in graph[node]:
            if tetangga not in visited:
                visited.add(tetangga)
                queue.enqueue(tetangga)

    return urutan
\`\`\`

---

## 🌳 Binary Tree & Binary Search Tree

\`\`\`python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node

    def search(self, val) -> bool:    # O(log n) average
        return self._search(self.root, val)

    def _search(self, node, val):
        if not node:      return False
        if node.val == val: return True
        if val < node.val:
            return self._search(node.left, val)
        return self._search(node.right, val)

    def inorder(self):    # Traversal: kiri → root → kanan (menghasilkan urutan)
        result = []
        def _inorder(node):
            if node:
                _inorder(node.left)
                result.append(node.val)
                _inorder(node.right)
        _inorder(self.root)
        return result

# Test
bst = BST()
for val in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(val)

print(bst.inorder())     # [1, 3, 4, 5, 6, 7, 8]  (terurut!)
print(bst.search(4))     # True
print(bst.search(9))     # False
\`\`\`

---

## 🗂️ Hash Table (Dictionary)

\`\`\`python
# Python dict = Hash Table bawaan
# Akses, insert, delete: O(1) average

# Implementasi sederhana
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return hash(key) % self.size

    def set(self, key, value):
        idx = self._hash(key)
        bucket = self.table[idx]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # Update
                return
        bucket.append((key, value))  # Tambah baru

    def get(self, key):
        idx = self._hash(key)
        for k, v in self.table[idx]:
            if k == key:
                return v
        raise KeyError(key)

# Contoh nyata: hitung frekuensi kata
def hitung_frekuensi(teks):
    kata_list = teks.lower().split()
    freq = {}
    for kata in kata_list:
        freq[kata] = freq.get(kata, 0) + 1
    return sorted(freq.items(), key=lambda x: x[1], reverse=True)

teks = "the quick brown fox jumps over the lazy dog the fox"
print(hitung_frekuensi(teks))
# [('the', 3), ('fox', 2), ...]
\`\`\`

---

## 🎯 Soal Interview Klasik

\`\`\`python
# Two Sum — cari dua angka yang jumlahnya = target
# O(n) dengan Hash Map

def two_sum(nums, target):
    seen = {}  # {nilai: index}
    for i, num in enumerate(nums):
        komplemen = target - num
        if komplemen in seen:
            return [seen[komplemen], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))   # [0, 1] (2 + 7 = 9)
print(two_sum([3, 2, 4], 6))        # [1, 2] (2 + 4 = 6)

# Valid Anagram
def is_anagram(s, t):
    return sorted(s) == sorted(t)  # O(n log n)
    # atau: Counter(s) == Counter(t)  # O(n)

print(is_anagram("anagram", "nagaram"))  # True
print(is_anagram("rat", "car"))           # False
\`\`\`

---

## 📝 Ringkasan

| Struktur Data | Akses | Cari | Insert | Delete | Kapan Digunakan |
|---------------|-------|------|--------|--------|-----------------|
| Array | O(1) | O(n) | O(n) | O(n) | Index access, iterasi |
| Linked List | O(n) | O(n) | O(1) | O(1) | Frequent insert/delete di awal |
| Stack | O(n) | O(n) | O(1) | O(1) | Undo/redo, call stack |
| Queue | O(n) | O(n) | O(1) | O(1) | BFS, job queue |
| BST | O(log n) | O(log n) | O(log n) | O(log n) | Sorted data, range query |
| Hash Table | O(1) | O(1) | O(1) | O(1) | Key-value lookup |

> **Struktur data adalah fondasi yang membedakan developer yang "bisa coding" dari yang "bisa memecahkan masalah dengan efisien"!** 🚀
`;
