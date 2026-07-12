export const lesson8 = `
# Dictionary — Struktur Data Key-Value

List menyimpan data dengan index angka (0, 1, 2). Tapi kadang kamu butuh akses data dengan nama yang lebih bermakna — "nama", "umur", "kota" — bukan sekadar angka.

Itulah **Dictionary**: struktur data yang menyimpan pasangan \`kunci: nilai\`, mirip seperti buku kontak di HP — kamu cari orang berdasarkan nama, bukan nomor urut.

Dictionary adalah salah satu struktur data paling sering dipakai di Python, terutama karena formatnya identik dengan **JSON** yang digunakan di hampir semua API web.

---

## 🏗️ Membuat Dictionary

\`\`\`python
# Kurung kurawal, pasangan kunci: nilai
profil = {
    "nama"     : "Pratama Dev",
    "umur"     : 28,
    "kota"     : "Bandung",
    "is_aktif" : True,
    "skill"    : ["Python", "JavaScript", "SQL"]   # Value bisa apa saja
}

# Cara lain dengan dict()
setting = dict(tema="gelap", bahasa="id", notifikasi=True)

# Dictionary kosong
data = {}
\`\`\`

---

## 🔍 Mengakses & Memodifikasi Data

\`\`\`python
profil = {"nama": "Pratama", "umur": 28, "kota": "Bandung"}

# Akses dengan kunci
print(profil["nama"])      # "Pratama"
print(profil["umur"])      # 28

# ⚠️ Kunci tidak ada → KeyError!
# print(profil["email"])   # KeyError: 'email'

# Cara aman: .get() — kembalikan None jika tidak ada
print(profil.get("email"))           # None (tidak error)
print(profil.get("email", "N/A"))    # "N/A" (default value)

# Tambah/ubah data
profil["email"] = "pratama@email.com"   # Tambah kunci baru
profil["umur"]  = 29                    # Ubah nilai yang ada

# Hapus data
del profil["kota"]                      # Hapus kunci "kota"
email = profil.pop("email")             # Hapus dan simpan nilainya
print(email)                            # "pratama@email.com"
\`\`\`

---

## 🔄 Iterasi Dictionary

\`\`\`python
mahasiswa = {
    "nama"   : "Siti Rahayu",
    "nim"    : "2021001",
    "jurusan": "Informatika",
    "ipk"    : 3.85
}

# Iterasi kunci saja
for kunci in mahasiswa:
    print(kunci)
# Output: nama, nim, jurusan, ipk

# Iterasi nilai saja
for nilai in mahasiswa.values():
    print(nilai)
# Output: Siti Rahayu, 2021001, Informatika, 3.85

# Iterasi kunci dan nilai sekaligus (paling sering dipakai!)
for kunci, nilai in mahasiswa.items():
    print(f"{kunci:10} : {nilai}")
# Output:
# nama       : Siti Rahayu
# nim        : 2021001
# jurusan    : Informatika
# ipk        : 3.85
\`\`\`

---

## 🔎 Operasi Berguna pada Dictionary

\`\`\`python
inventori = {"apel": 50, "mangga": 30, "pisang": 75, "jeruk": 20}

# Cek keberadaan kunci
print("apel" in inventori)        # True
print("durian" in inventori)      # False
print("durian" not in inventori)  # True

# Semua kunci, nilai, pasangan
print(inventori.keys())     # dict_keys(['apel', 'mangga', 'pisang', 'jeruk'])
print(inventori.values())   # dict_values([50, 30, 75, 20])
print(inventori.items())    # dict_items([('apel', 50), ...])

# Jumlah pasangan
print(len(inventori))       # 4

# Update/merge dictionary
tambahan = {"anggur": 45, "apel": 60}  # "apel" akan di-override!
inventori.update(tambahan)
print(inventori["apel"])    # 60 (diperbarui)
print(inventori["anggur"])  # 45 (ditambahkan)

# Python 3.9+: merge dengan operator |
inventori2 = inventori | {"durian": 10}
\`\`\`

---

## 🏗️ Dictionary Bersarang (Nested)

\`\`\`python
# Dictionary di dalam dictionary — sangat umum untuk data kompleks
karyawan = {
    "EMP001": {
        "nama"    : "Andi Saputra",
        "divisi"  : "Engineering",
        "gaji"    : 12_000_000,
        "skills"  : ["Python", "Docker", "AWS"]
    },
    "EMP002": {
        "nama"    : "Budi Hartono",
        "divisi"  : "Marketing",
        "gaji"    : 8_500_000,
        "skills"  : ["Excel", "Canva", "SEO"]
    }
}

# Akses nested
print(karyawan["EMP001"]["nama"])      # "Andi Saputra"
print(karyawan["EMP001"]["skills"][0]) # "Python"

# Iterasi nested
for id_karyawan, data in karyawan.items():
    print(f"\\n{id_karyawan}: {data['nama']}")
    print(f"  Divisi : {data['divisi']}")
    print(f"  Gaji   : Rp {data['gaji']:,}")
    print(f"  Skills : {', '.join(data['skills'])}")
\`\`\`

---

## 🔢 Dict Comprehension

\`\`\`python
# Buat dictionary dari list secara singkat
nama_list  = ["Andi", "Budi", "Cici"]
nilai_list = [85, 92, 78]

# Cara biasa:
nilai_dict = {}
for nama, nilai in zip(nama_list, nilai_list):
    nilai_dict[nama] = nilai

# Dict comprehension:
nilai_dict = {nama: nilai for nama, nilai in zip(nama_list, nilai_list)}
print(nilai_dict)  # {'Andi': 85, 'Budi': 92, 'Cici': 78}

# Dengan kondisi:
lulus = {nama: nilai for nama, nilai in nilai_dict.items() if nilai >= 80}
print(lulus)  # {'Budi': 92}

# Pangkatkan semua nilai:
kuadrat = {k: v**2 for k, v in {"a": 2, "b": 3, "c": 4}.items()}
print(kuadrat)  # {'a': 4, 'b': 9, 'c': 16}
\`\`\`

---

## 💡 Contoh Program Nyata: Sistem Inventori Toko

\`\`\`python
# Sistem manajemen inventori sederhana

inventori = {
    "P001": {"nama": "Laptop ASUS",   "stok": 10, "harga": 8_500_000},
    "P002": {"nama": "Mouse Logitech","stok": 45, "harga": 250_000},
    "P003": {"nama": "Keyboard Mech", "stok": 0,  "harga": 750_000},
    "P004": {"nama": "Monitor LG",    "stok": 7,  "harga": 3_200_000},
    "P005": {"nama": "Headset Sony",  "stok": 12, "harga": 1_800_000},
}

def tampilkan_inventori():
    print("\\n" + "="*60)
    print(f"{'KODE':<8}{'NAMA PRODUK':<22}{'STOK':>6}{'HARGA':>12}{'STATUS':>10}")
    print("="*60)
    
    total_nilai = 0
    for kode, produk in inventori.items():
        nilai    = produk["stok"] * produk["harga"]
        total_nilai += nilai
        status   = "Habis" if produk["stok"] == 0 else "Tersedia"
        
        print(f"{kode:<8}{produk['nama']:<22}{produk['stok']:>6}"
              f"  Rp {produk['harga']:>9,}  {status}")
    
    print("="*60)
    print(f"Total Nilai Inventori: Rp {total_nilai:,}")

def cari_produk(kata_kunci):
    hasil = {
        kode: data for kode, data in inventori.items()
        if kata_kunci.lower() in data["nama"].lower()
    }
    return hasil

def perbarui_stok(kode_produk, jumlah):
    if kode_produk in inventori:
        inventori[kode_produk]["stok"] += jumlah
        nama  = inventori[kode_produk]["nama"]
        stok  = inventori[kode_produk]["stok"]
        print(f"✅ {nama}: stok diperbarui → {stok} unit")
    else:
        print(f"❌ Kode produk {kode_produk} tidak ditemukan")

# Jalankan program
tampilkan_inventori()

print("\\n🔍 Cari 'keyboard':")
hasil = cari_produk("keyboard")
for kode, data in hasil.items():
    print(f"  {kode}: {data['nama']} - Stok: {data['stok']}")

print()
perbarui_stok("P003", 15)  # Keyboard habis, tambah stok 15
\`\`\`

---

## 📊 Ringkasan

- Dictionary \`{}\` menyimpan data sebagai pasangan kunci:nilai
- Kunci harus unik dan immutable (string, angka, tuple)
- \`dict[kunci]\` untuk akses, \`dict.get(kunci, default)\` cara aman
- \`.keys()\`, \`.values()\`, \`.items()\` untuk iterasi
- \`in\` untuk cek keberadaan kunci
- Nested dictionary untuk data kompleks (seperti JSON)
- Dict comprehension untuk membuat dict secara singkat

> **Di modul berikutnya, kita belajar fungsi — cara mengemas kode agar bisa dipakai ulang dan lebih terorganisir!** 🔧
`;
