export const lesson6 = `
# Perulangan — For & While

Setelah bisa membuat program yang "memilih" jalur (if/else), sekarang kita belajar membuat program yang **mengulang** tugas.

Bayangin kamu harus cetak nama 100 pengguna. Tanpa loop, kamu tulis 100 baris \`print()\`. Dengan loop, cukup 3 baris — dan bisa handle 1 juta pengguna tanpa perlu ubah kode.

---

## 🔢 For Loop — Untuk Sesuatu yang Sudah Diketahui Jumlahnya

\`for\` dipakai saat kamu tahu akan mengulang berapa kali, atau mau memproses tiap elemen dari sebuah koleksi.

### \`range()\` — Generator Urutan Angka

\`\`\`python
# range(stop) — dari 0 sampai sebelum stop
for i in range(5):
    print(i)
# Output: 0 1 2 3 4

# range(start, stop) — dari start sampai sebelum stop
for i in range(1, 6):
    print(i)
# Output: 1 2 3 4 5

# range(start, stop, step) — dengan langkah
for i in range(0, 10, 2):
    print(i)
# Output: 0 2 4 6 8

# Mundur
for i in range(10, 0, -1):
    print(i)
# Output: 10 9 8 7 6 5 4 3 2 1
\`\`\`

### Iterasi Langsung ke List

\`\`\`python
buah = ["apel", "mangga", "pisang", "jeruk"]

for nama_buah in buah:
    print(f"Buah: {nama_buah}")

# Output:
# Buah: apel
# Buah: mangga
# Buah: pisang
# Buah: jeruk
\`\`\`

### \`enumerate()\` — Dapat Index Sekaligus

\`\`\`python
peserta = ["Andi", "Budi", "Cici", "Dedi"]

for nomor, nama in enumerate(peserta, start=1):
    print(f"{nomor}. {nama}")

# Output:
# 1. Andi
# 2. Budi
# 3. Cici
# 4. Dedi
\`\`\`

### Iterasi String

\`\`\`python
kata = "Python"
for huruf in kata:
    print(huruf, end=" ")
# Output: P y t h o n
\`\`\`

---

## ♾️ While Loop — Untuk Kondisi yang Belum Diketahui

Gunakan \`while\` ketika tidak tahu berapa kali mengulang — selama kondisi masih \`True\`, terus jalan.

\`\`\`python
# Contoh sederhana: hitung mundur
hitungan = 5

while hitungan > 0:
    print(f"Hitungan: {hitungan}")
    hitungan -= 1  # PENTING: selalu ada yang mengubah kondisi!

print("Selesai!")

# Output:
# Hitungan: 5
# Hitungan: 4
# Hitungan: 3
# Hitungan: 2
# Hitungan: 1
# Selesai!
\`\`\`

> ⚠️ **Bahaya Infinite Loop!** Jika kondisi while tidak pernah False, program jalan selamanya! Tekan **Ctrl+C** untuk hentikan paksa.
> \`\`\`python
> # JANGAN LAKUKAN INI tanpa kondisi berhenti!
> while True:
>     print("Ini jalan selamanya!!")  # Infinite loop!
> \`\`\`

### While untuk Input Validasi

\`\`\`python
# Minta input sampai benar
while True:
    umur_input = input("Masukkan umur Anda (18-60): ")
    
    if umur_input.isdigit():
        umur = int(umur_input)
        if 18 <= umur <= 60:
            print(f"Umur {umur} diterima ✅")
            break  # Keluar dari loop
        else:
            print("❌ Umur harus antara 18-60")
    else:
        print("❌ Harap masukkan angka!")
\`\`\`

---

## ⏹️ Break — Hentikan Loop Paksa

\`\`\`python
# Analogi: Cari nama di daftar, berhenti begitu ketemu
daftar = ["Andi", "Budi", "Cici", "Dedi", "Eko"]
cari   = "Cici"

for i, nama in enumerate(daftar):
    if nama == cari:
        print(f"✅ Ditemukan '{cari}' di posisi ke-{i}!")
        break  # Langsung keluar, tidak perlu cek sisanya
    print(f"Bukan {nama}...")

# Output:
# Bukan Andi...
# Bukan Budi...
# ✅ Ditemukan 'Cici' di posisi ke-2!
\`\`\`

---

## ⏭️ Continue — Lewati Iterasi Ini

\`\`\`python
# Hanya cetak angka ganjil (lewati yang genap)
for angka in range(1, 11):
    if angka % 2 == 0:
        continue  # Lewati angka genap
    print(angka, end=" ")

# Output: 1 3 5 7 9

# Contoh lain: filter data kosong
data = ["Apel", "", "Mangga", None, "Pisang", ""]

for item in data:
    if not item:        # Jika item kosong/None
        continue        # Lewati
    print(f"Proses: {item}")

# Output:
# Proses: Apel
# Proses: Mangga
# Proses: Pisang
\`\`\`

---

## 📋 Klausa \`else\` pada Loop

Loop di Python punya \`else\` yang dijalankan ketika loop selesai **tanpa** dihentikan \`break\`:

\`\`\`python
# Cek apakah ada bilangan prima dalam range
bilangan = [4, 6, 8, 9, 10]

for n in bilangan:
    if n % 2 != 0:
        print(f"{n} adalah bilangan ganjil!")
        break
else:
    print("Semua bilangan genap, tidak ada yang ganjil")

# Output: Semua bilangan genap, tidak ada yang ganjil
\`\`\`

---

## 🎯 List Comprehension — For Loop yang Elegan

Python punya cara ringkas untuk membuat list dari loop:

\`\`\`python
# Cara biasa:
kuadrat = []
for i in range(1, 6):
    kuadrat.append(i ** 2)
print(kuadrat)  # [1, 4, 9, 16, 25]

# List Comprehension (lebih pythonic):
kuadrat = [i ** 2 for i in range(1, 6)]
print(kuadrat)  # [1, 4, 9, 16, 25]

# Dengan filter:
genap = [i for i in range(1, 11) if i % 2 == 0]
print(genap)  # [2, 4, 6, 8, 10]

# Contoh nyata: ubah semua teks ke huruf besar
nama_list = ["andi", "budi", "cici"]
nama_besar = [n.upper() for n in nama_list]
print(nama_besar)  # ['ANDI', 'BUDI', 'CICI']
\`\`\`

---

## 💡 Contoh Program: Tabel Perkalian

\`\`\`python
# Buat tabel perkalian 1-10

print("TABEL PERKALIAN")
print("-" * 55)

# Header
print(f"{'':4}", end="")
for j in range(1, 11):
    print(f"{j:5}", end="")
print()
print("-" * 55)

# Isi tabel
for i in range(1, 11):
    print(f"{i:3} |", end="")
    for j in range(1, 11):
        print(f"{i*j:5}", end="")
    print()  # Newline
\`\`\`

---

## 💡 Contoh Program: FizzBuzz (Klasik!)

FizzBuzz adalah soal wawancara coding yang sangat terkenal:

\`\`\`python
# Cetak 1-30
# Jika kelipatan 3: cetak "Fizz"
# Jika kelipatan 5: cetak "Buzz"
# Jika keduanya: cetak "FizzBuzz"

for i in range(1, 31):
    if i % 15 == 0:         # Kelipatan 3 dan 5
        print("FizzBuzz")
    elif i % 3 == 0:        # Kelipatan 3 saja
        print("Fizz")
    elif i % 5 == 0:        # Kelipatan 5 saja
        print("Buzz")
    else:
        print(i)

# Output: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, ...
\`\`\`

---

## ⚖️ Kapan Pakai For vs While?

| Situasi | Gunakan |
|---------|---------|
| Tahu jumlah iterasi | \`for\` |
| Iterasi melalui koleksi (list, string) | \`for\` |
| Kondisi belum tentu kapan berhenti | \`while\` |
| Tunggu input user | \`while\` |
| Game loop (jalan sampai game over) | \`while\` |

---

## 📝 Ringkasan

- \`for\` loop untuk iterasi urutan yang diketahui — list, range, string
- \`while\` loop untuk iterasi selama kondisi True
- \`break\` hentikan loop sepenuhnya, \`continue\` lewati iterasi saat ini
- \`range(start, stop, step)\` untuk menghasilkan urutan angka
- \`enumerate()\` untuk dapat index + nilai sekaligus
- List comprehension \`[ekspresi for item in list]\` cara pythonic membuat list

> **Di modul berikutnya, kita belajar struktur data — cara menyimpan dan mengelola kumpulan data yang lebih kompleks!** 📦
`;
