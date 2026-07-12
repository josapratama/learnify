export const lesson4 = `
# Operator Aritmatika & Logika di Python

Variabel sudah, tipe data sudah. Sekarang kita pelajari cara **mengolah** data itu: menghitung, membandingkan, dan menggabungkan kondisi.

---

## ➕ Operator Aritmatika

\`\`\`python
a = 10
b = 3

print(a + b)   # 13 — penjumlahan
print(a - b)   # 7  — pengurangan
print(a * b)   # 30 — perkalian
print(a / b)   # 3.3333... — pembagian (SELALU menghasilkan float)
print(a // b)  # 3  — floor division (bulatkan ke bawah)
print(a % b)   # 1  — modulus (sisa bagi)
print(a ** b)  # 1000 — pangkat (10 pangkat 3)
\`\`\`

| Operator | Nama | Hasil |
|----------|------|-------|
| \`+\` | Penjumlahan | \`10 + 3 = 13\` |
| \`-\` | Pengurangan | \`10 - 3 = 7\` |
| \`*\` | Perkalian | \`10 * 3 = 30\` |
| \`/\` | Pembagian | \`10 / 3 = 3.333\` |
| \`//\` | Floor Division | \`10 // 3 = 3\` |
| \`%\` | Modulus | \`10 % 3 = 1\` |
| \`**\` | Pangkat | \`2 ** 8 = 256\` |

### Kapan Pakai \`//\` dan \`%\`?

\`\`\`python
# // untuk konversi satuan
total_menit = 145
jam   = total_menit // 60   # 2
menit = total_menit % 60    # 25
print(f"{total_menit} menit = {jam} jam {menit} menit")
# Output: 145 menit = 2 jam 25 menit

# % untuk cek genap/ganjil
angka = 17
if angka % 2 == 0:
    print("Genap")
else:
    print("Ganjil")   # Output: Ganjil
\`\`\`

---

## ⚖️ Operator Perbandingan

Operator ini menghasilkan \`True\` atau \`False\`.

| Operator | Arti | Contoh | Hasil |
|----------|------|--------|-------|
| \`==\` | Sama dengan | \`5 == 5\` | \`True\` |
| \`!=\` | Tidak sama | \`5 != 3\` | \`True\` |
| \`>\` | Lebih besar | \`7 > 3\` | \`True\` |
| \`<\` | Lebih kecil | \`2 < 9\` | \`True\` |
| \`>=\` | Lebih besar/sama | \`5 >= 5\` | \`True\` |
| \`<=\` | Lebih kecil/sama | \`4 <= 3\` | \`False\` |

\`\`\`python
nilai = 78

print(nilai >= 90)   # False (tidak lulus dengan pujian)
print(nilai >= 75)   # True  (lulus)
print(nilai == 100)  # False (bukan sempurna)

# Sangat umum digunakan di if statement:
if nilai >= 60:
    print("Lulus!")
else:
    print("Remedial")
\`\`\`

> ⚠️ **Jebakan umum**: \`=\` untuk mengisi nilai, \`==\` untuk membandingkan!
> \`\`\`python
> x = 5     # Isi x dengan 5
> x == 5    # Cek apakah x sama dengan 5 → True
> \`\`\`

---

## 🤔 Operator Logika

Operator logika menggabungkan beberapa kondisi sekaligus.

### \`and\` — Kedua kondisi harus True

\`\`\`python
# Analogi: "Kamu bisa masuk jika SUDAH BESAR dan PUNYA TIKET"
umur   = 20
tiket  = True

if umur >= 17 and tiket == True:
    print("Silakan masuk!")
else:
    print("Tidak bisa masuk")

# Output: Silakan masuk!
\`\`\`

Tabel kebenaran \`and\`:
| A | B | A and B |
|---|---|---------|
| True | True | **True** |
| True | False | False |
| False | True | False |
| False | False | False |

### \`or\` — Salah satu kondisi cukup True

\`\`\`python
# Analogi: "Kamu bisa diskon jika PELAJAR atau LANSIA"
is_pelajar = False
is_lansia  = True

if is_pelajar or is_lansia:
    print("Dapat diskon 50%!")

# Output: Dapat diskon 50%!
\`\`\`

Tabel kebenaran \`or\`:
| A | B | A or B |
|---|---|--------|
| True | True | True |
| True | False | True |
| False | True | True |
| False | False | **False** |

### \`not\` — Membalik nilai

\`\`\`python
# Analogi: "NOT True = False, NOT False = True"
hujan = False

if not hujan:
    print("Ayo piknik!")  # Output: Ayo piknik!

# not sering digunakan untuk menyederhanakan kondisi negatif
terdaftar = False
if not terdaftar:
    print("Silakan daftar dulu")
\`\`\`

---

## 🔗 Menggabungkan Operator

\`\`\`python
# Contoh nyata: Validasi form login
email     = "user@email.com"
password  = "rahasia123"
is_banned = False

# User bisa login jika: email dan password benar, DAN tidak di-banned
email_benar = email == "user@email.com"
pass_benar  = password == "rahasia123"

bisa_login = email_benar and pass_benar and not is_banned

if bisa_login:
    print("Login berhasil!")
else:
    print("Login gagal")
\`\`\`

---

## 📝 Operator Penugasan (Shortcut)

\`\`\`python
skor = 100

# Cara panjang:
skor = skor + 10   # skor sekarang 110

# Shortcut (lebih pythonic):
skor += 10    # sama dengan: skor = skor + 10
skor -= 5     # sama dengan: skor = skor - 5
skor *= 2     # sama dengan: skor = skor * 2
skor /= 4     # sama dengan: skor = skor / 4
skor **= 2    # sama dengan: skor = skor ** 2
skor //= 3    # sama dengan: skor = skor // 3
skor %= 7     # sama dengan: skor = skor % 7
\`\`\`

---

## 🔢 Prioritas Operator (Order of Operations)

Seperti matematika, Python punya urutan eksekusi (PEMDAS):

\`\`\`python
# Tanpa tanda kurung:
hasil = 2 + 3 * 4    # 14, bukan 20 (perkalian dulu)
print(hasil)

# Dengan tanda kurung (eksplisit):
hasil = (2 + 3) * 4  # 20 (kurung dievaluasi dulu)
print(hasil)

# Contoh yang membingungkan:
x = 10 - 3 + 2    # 9 (kiri ke kanan untuk sama prioritas)
y = 2 ** 3 ** 2   # 512 (pangkat dari kanan: 2**(3**2) = 2**9 = 512)
\`\`\`

> 💡 **Tips**: Kalau ragu, **selalu pakai tanda kurung** untuk kejelasan!

---

## 💡 Contoh Program: Kalkulator IMT (BMI)

\`\`\`python
# Hitung Indeks Massa Tubuh (IMT/BMI)

berat_kg  = 70    # kilogram
tinggi_m  = 1.75  # meter

# Rumus IMT = berat / (tinggi^2)
imt = berat_kg / (tinggi_m ** 2)
print(f"IMT Anda: {imt:.1f}")

# Tentukan kategori
if imt < 18.5:
    kategori = "Kurus"
elif imt < 25.0:
    kategori = "Normal ✅"
elif imt < 30.0:
    kategori = "Kelebihan Berat"
else:
    kategori = "Obesitas"

print(f"Kategori : {kategori}")

# Output:
# IMT Anda: 22.9
# Kategori : Normal ✅
\`\`\`

---

## 📝 Ringkasan

- Operator aritmatika: \`+\`, \`-\`, \`*\`, \`/\`, \`//\`, \`%\`, \`**\`
- \`//\` = floor division (bulatkan bawah), \`%\` = modulus (sisa bagi)
- Operator perbandingan selalu menghasilkan \`True\` atau \`False\`
- \`==\` untuk membandingkan (bukan \`=\` yang untuk mengisi nilai!)
- Operator logika: \`and\` (keduanya), \`or\` (salah satu), \`not\` (balik)
- Gunakan \`+=\`, \`-=\`, dst. sebagai shortcut penugasan

> **Di modul berikutnya, kita belajar percabangan — cara membuat program yang bisa "mengambil keputusan"!** 🔀
`;
