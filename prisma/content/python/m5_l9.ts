export const lesson9 = `
# Mendefinisikan Fungsi di Python

Kamu pasti sudah sering pakai fungsi bawaan Python — \`print()\`, \`len()\`, \`sorted()\`. Sekarang kita belajar **buat fungsi sendiri**.

Kenapa perlu? Bayangkan kamu punya kode yang menghitung diskon, dan kode itu perlu dipakai di 10 tempat berbeda. Tanpa fungsi, kamu copy-paste 10 kali. Kalau ada bug, kamu perbaiki di 10 tempat. Dengan fungsi, kamu tulis sekali, pakai di mana saja, perbaiki sekali juga.

---

## 📐 Anatomi Fungsi Python

\`\`\`python
#    Kata kunci  Nama fungsi    Parameter
def hitung_luas(panjang, lebar):
    """
    Menghitung luas persegi panjang.   ← Docstring (penjelasan fungsi)
    """
    luas = panjang * lebar             # Body fungsi
    return luas                        # Nilai yang dikembalikan

# Memanggil fungsi:
hasil = hitung_luas(5, 3)     # Kirim argumen
print(f"Luas: {hasil}")       # Output: Luas: 15
\`\`\`

---

## 🎯 Fungsi Tanpa Return

\`\`\`python
def sapa(nama):
    print(f"Halo, {nama}! Selamat datang!")
    # Tidak ada return → mengembalikan None secara implisit

sapa("Budi")      # Halo, Budi! Selamat datang!
hasil = sapa("Cici")
print(hasil)      # None
\`\`\`

---

## 📌 Jenis Parameter

### 1. Parameter Biasa (Positional)

\`\`\`python
def perkenalan(nama, umur, kota):
    print(f"Nama: {nama}, Umur: {umur}, Kota: {kota}")

# Urutan argumen harus sesuai!
perkenalan("Andi", 25, "Jakarta")
# Output: Nama: Andi, Umur: 25, Kota: Jakarta
\`\`\`

### 2. Parameter dengan Nilai Default

\`\`\`python
def buat_akun(nama, role="user", aktif=True):
    print(f"Akun '{nama}' dibuat — Role: {role}, Aktif: {aktif}")

buat_akun("Pratama")                         # Pakai default
buat_akun("Admin Boss", role="admin")        # Override satu default
buat_akun("Moderator", "moderator", False)   # Override semua
\`\`\`

### 3. Keyword Arguments

\`\`\`python
def kirim_email(penerima, subjek, isi, cc=None):
    print(f"Ke: {penerima}")
    print(f"CC: {cc}")
    print(f"Subjek: {subjek}")
    print(f"Isi: {isi}")

# Urutan bebas jika pakai keyword
kirim_email(
    isi      = "Terima kasih atas waktunya.",
    subjek   = "Follow up meeting",
    penerima = "bos@perusahaan.com",
    cc       = "hrd@perusahaan.com"
)
\`\`\`

### 4. *args — Jumlah Argumen Tidak Tentu

\`\`\`python
# *args mengumpulkan semua argumen positional ke dalam tuple
def jumlahkan(*angka):
    print(f"Angka yang diterima: {angka}")  # Tuple
    return sum(angka)

print(jumlahkan(1, 2, 3))          # 6
print(jumlahkan(5, 10, 15, 20))    # 50
print(jumlahkan(100))              # 100

# Contoh nyata: cetak semua item
def tampilkan_menu(*menu_items):
    print("MENU HARI INI:")
    for i, item in enumerate(menu_items, 1):
        print(f"  {i}. {item}")

tampilkan_menu("Nasi Goreng", "Mie Ayam", "Soto Betawi", "Es Teh")
\`\`\`

### 5. **kwargs — Keyword Arguments Tidak Tentu

\`\`\`python
# **kwargs mengumpulkan keyword arguments ke dalam dictionary
def buat_profil(**info):
    print("PROFIL:")
    for kunci, nilai in info.items():
        print(f"  {kunci}: {nilai}")

buat_profil(nama="Siti", umur=23, kota="Surabaya", hobi="Memasak")
# PROFIL:
#   nama: Siti
#   umur: 23
#   kota: Surabaya
#   hobi: Memasak
\`\`\`

---

## 📤 Return Values

\`\`\`python
# Return satu nilai
def kuadrat(n):
    return n ** 2

# Return multiple values (sebenarnya return tuple)
def bagi_dan_sisa(a, b):
    hasil = a // b
    sisa  = a % b
    return hasil, sisa       # Return tuple

# Terima multiple return values
quotient, remainder = bagi_dan_sisa(17, 5)
print(f"17 ÷ 5 = {quotient} sisa {remainder}")
# 17 ÷ 5 = 3 sisa 2

# Early return
def cek_usia(umur):
    if umur < 0:
        return "Error: umur tidak valid"    # Keluar lebih awal
    if umur < 18:
        return "Remaja"
    if umur < 60:
        return "Dewasa"
    return "Lansia"
\`\`\`

---

## 🔭 Scope — Jangkauan Variabel

\`\`\`python
# Variabel di dalam fungsi hanya ada di dalam fungsi
x = 10  # Variabel global

def ubah_x():
    x = 99  # Variabel lokal (beda dengan x global!)
    print(f"Di dalam fungsi: x = {x}")

ubah_x()                          # Di dalam fungsi: x = 99
print(f"Di luar fungsi: x = {x}") # Di luar fungsi: x = 10  (tidak berubah!)

# Gunakan 'global' untuk mengubah variabel global (tidak direkomendasikan)
def paksa_ubah():
    global x
    x = 999

paksa_ubah()
print(x)  # 999
\`\`\`

---

## ⚡ Lambda — Fungsi Mini Satu Baris

\`\`\`python
# Fungsi biasa:
def tambah_10(x):
    return x + 10

# Lambda (fungsi anonim):
tambah_10 = lambda x: x + 10

print(tambah_10(5))   # 15

# Lambda sangat berguna untuk sorting dan filtering
data = [("Andi", 85), ("Budi", 92), ("Cici", 78), ("Dedi", 90)]

# Urut berdasarkan nilai (elemen kedua tuple)
terurut = sorted(data, key=lambda x: x[1], reverse=True)
print(terurut)
# [('Budi', 92), ('Dedi', 90), ('Andi', 85), ('Cici', 78)]

# Filter dengan lambda
nilai_tinggi = list(filter(lambda x: x[1] >= 90, data))
print(nilai_tinggi)  # [('Budi', 92), ('Dedi', 90)]

# Map — terapkan fungsi ke semua elemen
angka = [1, 2, 3, 4, 5]
kuadrat = list(map(lambda x: x**2, angka))
print(kuadrat)  # [1, 4, 9, 16, 25]
\`\`\`

---

## 💡 Contoh Program: Kalkulator Ilmiah

\`\`\`python
import math

def luas_lingkaran(jari_jari):
    """Hitung luas lingkaran."""
    return math.pi * jari_jari ** 2

def keliling_lingkaran(jari_jari):
    """Hitung keliling lingkaran."""
    return 2 * math.pi * jari_jari

def volume_bola(jari_jari):
    """Hitung volume bola."""
    return (4/3) * math.pi * jari_jari ** 3

def konversi_suhu(nilai, dari, ke):
    """
    Konversi suhu.
    Mendukung: Celsius (C), Fahrenheit (F), Kelvin (K)
    """
    # Konversi ke Celsius dulu
    if dari == "F":
        celsius = (nilai - 32) * 5/9
    elif dari == "K":
        celsius = nilai - 273.15
    else:
        celsius = nilai
    
    # Konversi dari Celsius ke target
    if ke == "F":
        return celsius * 9/5 + 32
    elif ke == "K":
        return celsius + 273.15
    else:
        return celsius

# Demo kalkulator
r = 7
print(f"Lingkaran dengan jari-jari {r} cm:")
print(f"  Luas     : {luas_lingkaran(r):.2f} cm²")
print(f"  Keliling : {keliling_lingkaran(r):.2f} cm")
print(f"  Vol Bola : {volume_bola(r):.2f} cm³")

print()
suhu_c = 100
print(f"{suhu_c}°C = {konversi_suhu(suhu_c, 'C', 'F'):.1f}°F")
print(f"{suhu_c}°C = {konversi_suhu(suhu_c, 'C', 'K'):.2f} K")
\`\`\`

---

## 📝 Ringkasan

- \`def nama(parameter):\` untuk mendefinisikan fungsi
- Parameter bisa punya nilai default: \`def f(x, y=10)\`
- \`*args\` untuk jumlah argumen tidak tentu (tuple)
- \`**kwargs\` untuk keyword arguments tidak tentu (dict)
- \`return\` untuk mengembalikan nilai, bisa multiple: \`return a, b\`
- Lambda: \`lambda x: ekspresi\` — fungsi mini satu baris
- Variabel di dalam fungsi bersifat lokal (tidak mempengaruhi luar)

> **Di pelajaran berikutnya, kita belajar cara menggunakan library eksternal — membuka akses ke ribuan alat siap pakai!** 📚
`;
