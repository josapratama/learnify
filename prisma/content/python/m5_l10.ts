export const lesson10 = `
# Modul & Library Eksternal Python

Salah satu kekuatan terbesar Python adalah ekosistemnya. Apapun yang ingin kamu buat, hampir pasti sudah ada library-nya.

Perlu scraping web? \`BeautifulSoup\`. Analisis data? \`Pandas\`. Machine learning? \`scikit-learn\`. Buat API? \`FastAPI\`. Semuanya tinggal \`pip install\`.

**PyPI (Python Package Index)** menyimpan lebih dari **500.000 library** siap pakai — dan semua gratis.

---

## 📦 Tiga Tingkat Modul Python

### 1. Built-in — Langsung Tersedia

\`\`\`python
import math        # Matematika lanjutan
import random      # Angka acak
import datetime    # Tanggal dan waktu
import os          # Interaksi dengan OS
import json        # Parse/buat JSON
import re          # Regular Expression
\`\`\`

### 2. Standard Library — Import, Sudah Ada di Python

\`\`\`python
from pathlib import Path        # File system modern
from collections import Counter # Hitung frekuensi
from typing import List, Dict   # Type hints
\`\`\`

### 3. Third-party — Perlu \`pip install\`

\`\`\`bash
pip install requests    # HTTP client
pip install numpy       # Komputasi numerik
pip install pandas      # Analisis data
pip install flask       # Web framework
\`\`\`

---

## 🔧 Cara Import Modul

\`\`\`python
# Import seluruh modul
import math
print(math.sqrt(144))    # 12.0
print(math.pi)           # 3.14159...

# Import dengan alias (nama lebih pendek)
import numpy as np       # Konvensi standar
import pandas as pd
print(np.array([1, 2, 3]))

# Import fungsi tertentu saja
from math import sqrt, pi, ceil
print(sqrt(256))         # 16.0 (tanpa 'math.' di depan)
print(ceil(4.2))         # 5

# Import semua (tidak direkomendasikan — bisa bentrok nama!)
# from math import *
\`\`\`

---

## 🧮 Library Built-in Populer

### \`math\` — Matematika

\`\`\`python
import math

print(math.sqrt(81))        # 9.0  — akar kuadrat
print(math.ceil(4.3))       # 5    — bulatkan ke atas
print(math.floor(4.9))      # 4    — bulatkan ke bawah
print(math.abs(-7))         # Error! Gunakan abs() bawaan Python
print(abs(-7))              # 7
print(math.log(100, 10))    # 2.0  — logaritma basis 10
print(math.sin(math.pi/2))  # 1.0  — sinus 90 derajat
print(math.factorial(5))    # 120  — 5! = 5×4×3×2×1
\`\`\`

### \`random\` — Angka Acak

\`\`\`python
import random

# Angka acak
print(random.random())          # 0.0 - 1.0 (float)
print(random.randint(1, 100))   # 1 - 100 (int, inklusif)
print(random.uniform(1.5, 5.5)) # Float antara 1.5 - 5.5

# Pilih acak dari list
buah = ["apel", "mangga", "pisang", "jeruk"]
print(random.choice(buah))       # Satu pilihan acak
print(random.sample(buah, 2))    # Dua pilihan acak, tidak berulang

# Acak urutan list
kartu = list(range(1, 53))
random.shuffle(kartu)
print(kartu[:5])                 # 5 kartu pertama setelah dikocok

# Seed untuk hasil yang reproducible (berguna untuk testing)
random.seed(42)
print(random.randint(1, 100))   # Selalu sama jika seed sama
\`\`\`

### \`datetime\` — Tanggal & Waktu

\`\`\`python
from datetime import datetime, date, timedelta

# Sekarang
sekarang = datetime.now()
print(sekarang)                     # 2024-01-15 14:30:25.123456
print(sekarang.strftime("%d/%m/%Y %H:%M"))  # 15/01/2024 14:30

# Tanggal tertentu
ulang_tahun = date(1995, 8, 17)
print(ulang_tahun)                  # 1995-08-17

# Selisih tanggal
hari_ini = date.today()
selisih  = hari_ini - ulang_tahun
print(f"Umur: {selisih.days // 365} tahun")

# Tambah/kurang waktu
besok   = hari_ini + timedelta(days=1)
seminggu_lalu = hari_ini - timedelta(weeks=1)
\`\`\`

### \`os\` & \`pathlib\` — File System

\`\`\`python
import os
from pathlib import Path

# Info direktori
print(os.getcwd())               # Direktori saat ini
print(os.listdir("."))           # List file di direktori ini

# Path modern dengan pathlib (lebih direkomendasikan)
folder = Path("data")
folder.mkdir(exist_ok=True)      # Buat folder, tidak error jika sudah ada

file = folder / "hasil.txt"      # Gabung path dengan /
file.write_text("Data tersimpan!")
print(file.read_text())

# Iterasi file
for f in Path(".").glob("*.py"): # Semua file .py di direktori ini
    print(f.name, f.stat().st_size, "bytes")
\`\`\`

---

## 🌐 Library Eksternal: \`requests\`

\`\`\`bash
pip install requests
\`\`\`

\`\`\`python
import requests

# GET — ambil data
response = requests.get("https://jsonplaceholder.typicode.com/users/1")

print(f"Status: {response.status_code}")  # 200 = sukses

if response.status_code == 200:
    data = response.json()
    print(f"Nama : {data['name']}")
    print(f"Email: {data['email']}")
    print(f"Kota : {data['address']['city']}")

# POST — kirim data
payload = {"nama": "Pengguna Baru", "email": "baru@email.com"}
response = requests.post(
    "https://jsonplaceholder.typicode.com/users",
    json=payload,
    timeout=10  # Timeout 10 detik
)
print(f"Status POST: {response.status_code}")
\`\`\`

---

## 📁 Membuat Modul Sendiri

\`\`\`python
# File: kalkulator.py
"""Modul kalkulator sederhana."""

def tambah(a, b):
    return a + b

def kurang(a, b):
    return a - b

def kali(a, b):
    return a * b

def bagi(a, b):
    if b == 0:
        raise ValueError("Tidak bisa bagi dengan nol!")
    return a / b

PI = 3.14159  # Konstanta modul

# Kode ini HANYA jalan jika file dijalankan langsung (bukan diimport)
if __name__ == "__main__":
    print("Testing kalkulator...")
    print(tambah(5, 3))    # 8
    print(bagi(10, 2))     # 5.0
\`\`\`

\`\`\`python
# File: main.py — gunakan modul kita
import kalkulator                        # Import seluruh modul
from kalkulator import tambah, PI        # Import spesifik

print(kalkulator.kali(4, 5))  # 20
print(tambah(10, 3))          # 13
print(PI)                     # 3.14159
\`\`\`

---

## 📋 Cheat Sheet pip

\`\`\`bash
# Install
pip install pandas
pip install pandas==2.1.0          # Versi spesifik

# Update
pip install --upgrade pandas

# Hapus
pip uninstall pandas

# Lihat semua yang terinstall
pip list
pip show pandas                    # Info detail satu library

# Export / Import dependensi
pip freeze > requirements.txt
pip install -r requirements.txt    # Install dari file

# Cari library
pip search "http client"           # Cari di PyPI
\`\`\`

---

## 📝 Ringkasan

- Python punya tiga level modul: built-in, standard library, third-party
- \`import modul\` atau \`from modul import fungsi\` untuk menggunakan
- \`pip install nama_library\` untuk install library dari internet
- Library wajib tahu: \`math\`, \`random\`, \`datetime\`, \`os\`, \`json\`, \`requests\`
- Buat modul sendiri = buat file \`.py\` yang bisa diimport di tempat lain
- \`if __name__ == "__main__":\` untuk kode yang hanya jalan saat file dijalankan langsung

> **Di modul berikutnya, kita masuk ke dunia Object-Oriented Programming — cara menulis kode yang lebih terstruktur dan elegan!** 🏗️
`;
