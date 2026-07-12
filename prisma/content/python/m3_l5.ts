export const lesson5 = `
# Percabangan — Cara Program Mengambil Keputusan

Sejauh ini kode kita lurus dari atas ke bawah — satu jalur, tidak ada pilihan. Tapi program yang berguna harus bisa bereaksi berbeda tergantung situasi.

Harga diskon kalau sudah member. Tampilkan error kalau email tidak valid. Izinkan akses hanya kalau sudah login. Semua itu butuh percabangan — program memilih jalur yang dijalankan berdasarkan kondisi.

---

## 🚦 If, Elif, Else

\`\`\`python
nilai = 85

if nilai >= 90:
    print("Predikat A — Sangat Baik!")
elif nilai >= 80:
    print("Predikat B — Baik")
elif nilai >= 70:
    print("Predikat C — Cukup")
elif nilai >= 60:
    print("Predikat D — Kurang")
else:
    print("Predikat E — Sangat Kurang")

# Output: Predikat B — Baik
\`\`\`

Cara membacanya:
- \`if\` = "jika kondisi ini benar, jalankan blok ini"
- \`elif\` = "atau jika kondisi ini benar" (bisa sebanyak yang dibutuhkan)
- \`else\` = "kalau semua kondisi di atas tidak terpenuhi" (opsional)

Python hanya menjalankan **satu blok** — yang pertama kondisinya benar.

---

## 📐 PENTING: Indentasi di Python

Python menggunakan **spasi/tab (indentasi)** untuk menentukan blok kode. Ini berbeda dari bahasa lain yang pakai \`{}\`.

\`\`\`python
# ✅ BENAR — Indentasi 4 spasi (standar Python)
x = 10
if x > 5:
    print("x lebih besar dari 5")   # 4 spasi
    print("Ini masih di dalam if")  # 4 spasi
print("Ini di luar if")             # 0 spasi

# ❌ SALAH — Akan Error!
if x > 5:
print("Lupa indentasi!")  # IndentationError!
\`\`\`

> 💡 **Tips**: Di VS Code, tekan Tab untuk indentasi otomatis 4 spasi. Jangan campur spasi dan tab!

---

## 🔁 If Sederhana (Tanpa Else)

\`\`\`python
# If tanpa else — hanya lakukan sesuatu jika kondisi terpenuhi
suhu = 38.5

if suhu > 37.5:
    print("Demam! Segera istirahat.")
    print("Minum parasetamol.")

# Jika suhu = 36.5, tidak ada yang dicetak — tidak apa-apa
\`\`\`

---

## 🪆 If Bersarang (Nested If)

If di dalam if:

\`\`\`python
# Contoh: Cek kelayakan kredit
umur      = 25
pendapatan = 5_000_000  # Rp 5 juta
has_ktp   = True

if has_ktp:
    print("KTP ada ✅")
    
    if umur >= 21:
        print("Umur memenuhi syarat ✅")
        
        if pendapatan >= 3_000_000:
            print("Pendapatan cukup ✅")
            print("🎉 Kredit DISETUJUI!")
        else:
            print("❌ Pendapatan kurang dari syarat minimum")
    else:
        print("❌ Umur belum memenuhi syarat (minimal 21 tahun)")
else:
    print("❌ Tidak ada KTP, tidak bisa proses")
\`\`\`

> ⚠️ Jangan terlalu dalam nested if — kode jadi sulit dibaca. Maksimal 3 level saja.

---

## ✨ Ternary Expression (If Satu Baris)

Untuk kondisi sederhana, Python punya cara penulisan if yang lebih ringkas:

\`\`\`python
# Cara biasa:
nilai = 75
if nilai >= 60:
    status = "Lulus"
else:
    status = "Gagal"

# Ternary (satu baris):
status = "Lulus" if nilai >= 60 else "Gagal"
print(status)  # Lulus

# Contoh lain
umur    = 20
label   = "Dewasa" if umur >= 18 else "Remaja"
diskon  = 0.5 if umur < 12 else 0.1
\`\`\`

---

## 🔎 Operator \`in\` dan \`not in\`

Sangat berguna untuk cek keanggotaan:

\`\`\`python
# Cek apakah item ada di list
buah_favorit = ["apel", "mangga", "pisang"]

if "mangga" in buah_favorit:
    print("Kamu suka mangga!")

if "durian" not in buah_favorit:
    print("Kamu tidak suka durian")

# Cek karakter dalam string
email = "user@gmail.com"
if "@" in email:
    print("Format email valid")
else:
    print("Bukan email yang valid!")
\`\`\`

---

## 💡 Contoh Program Nyata: Kalkulator Diskon

\`\`\`python
# Program kalkulator diskon belanja online

total_belanja = 350_000  # Rp 350.000
kode_voucher  = "HEMAT20"
is_member     = True

# Tentukan diskon dasar berdasarkan total belanja
if total_belanja >= 500_000:
    diskon_persen = 15
elif total_belanja >= 300_000:
    diskon_persen = 10
elif total_belanja >= 100_000:
    diskon_persen = 5
else:
    diskon_persen = 0

# Tambahan diskon voucher
if kode_voucher == "HEMAT20":
    diskon_persen += 20
    print("Voucher HEMAT20 berhasil diterapkan! ✅")
elif kode_voucher == "LEBARAN":
    diskon_persen += 30
    print("Voucher LEBARAN berhasil diterapkan! ✅")
else:
    print("Kode voucher tidak valid")

# Tambahan diskon member
if is_member:
    diskon_persen += 5
    print("Diskon member +5% ✅")

# Batas maksimal diskon
if diskon_persen > 50:
    diskon_persen = 50  # Diskon maksimal 50%

# Hitung total
diskon_nominal = total_belanja * (diskon_persen / 100)
total_bayar    = total_belanja - diskon_nominal

print(f"\\n{'='*35}")
print(f"  Total Belanja : Rp {total_belanja:,.0f}")
print(f"  Diskon {diskon_persen:2d}%    : Rp {diskon_nominal:,.0f}")
print(f"  Total Bayar   : Rp {total_bayar:,.0f}")
print(f"{'='*35}")
\`\`\`

**Output:**
\`\`\`
Voucher HEMAT20 berhasil diterapkan! ✅
Diskon member +5% ✅

===================================
  Total Belanja : Rp 350,000
  Diskon 35%    : Rp 122,500
  Total Bayar   : Rp 227,500
===================================
\`\`\`

---

## ⚡ Short-circuit Evaluation

Python "malas" dalam mengevaluasi kondisi — berhenti saat sudah pasti hasilnya:

\`\`\`python
# Dengan 'and': jika yang pertama False, yang kedua tidak dicek
x = 0
if x != 0 and 10 / x > 1:  # x != 0 adalah False → langsung stop, tidak ada error ZeroDivision
    print("Benar")

# Dengan 'or': jika yang pertama True, yang kedua tidak dicek
nama = "Budi"
if nama or nama.upper():  # nama ada isinya → True → tidak perlu cek bagian kanan
    print("Ada nama")
\`\`\`

---

## 📝 Ringkasan

- \`if/elif/else\` untuk pengambilan keputusan berdasarkan kondisi
- Indentasi 4 spasi **wajib** di Python — menentukan blok kode
- \`elif\` bisa digunakan berkali-kali, \`else\` hanya satu di akhir
- Ternary: \`nilai_a if kondisi else nilai_b\` untuk kondisi sederhana
- \`in\` dan \`not in\` untuk cek keanggotaan di list atau string

> **Di pelajaran berikutnya, kita belajar perulangan — cara membuat program melakukan hal yang sama berulang kali tanpa kita tulis berulang!** 🔄
`;
