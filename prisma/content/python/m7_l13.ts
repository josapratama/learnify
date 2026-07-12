export const lesson13 = `
# File Handling di Python

Program kamu selama ini menggunakan variabel — data yang hidup di RAM dan hilang begitu program ditutup. Kadang kamu butuh data yang **bertahan**: log, hasil analisis, konfigurasi, atau data yang dikumpulkan bertahap.

Itulah fungsi **file** — penyimpanan permanen yang bisa dibaca dan ditulis oleh Python.

---

## 📖 Membuka & Membaca File

### \`with\` Statement — Cara yang Benar

\`\`\`python
# 'with' otomatis menutup file saat blok selesai
# Ini yang harus selalu dipakai
with open("catatan.txt", "r") as file:
    isi = file.read()   # Baca semua sekaligus
    print(isi)
# File otomatis tertutup di sini

# Tanpa 'with' — tidak direkomendasikan karena mudah lupa tutup
file = open("catatan.txt", "r")
isi  = file.read()
file.close()   # Harus manual
\`\`\`

### Berbagai Cara Baca

\`\`\`python
with open("data.txt", "r") as f:
    # Baca semua — cocok file kecil
    semua = f.read()
    
    f.seek(0)   # Reset ke awal
    
    # Baca satu baris
    baris1 = f.readline()
    baris2 = f.readline()   # Baris berikutnya
    
    f.seek(0)
    
    # Semua baris sebagai list — paling umum
    semua_baris = f.readlines()


# Iterasi langsung — paling efisien untuk file besar
with open("log.txt", "r") as f:
    for nomor, baris in enumerate(f, 1):
        baris = baris.strip()   # Hapus \\n
        print(f"Baris {nomor}: {baris}")
\`\`\`

---

## ✍️ Menulis File

\`\`\`python
# Mode 'w' — buat baru atau TIMPA isi lama
with open("output.txt", "w") as f:
    f.write("Baris pertama\\n")
    f.write("Baris kedua\\n")
    print("Ini juga masuk ke file", file=f)  # Cara alternatif

# Mode 'a' — tambahkan ke akhir file (tidak timpa)
with open("log.txt", "a") as f:
    from datetime import datetime
    waktu = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    f.write(f"[{waktu}] Program dijalankan\\n")

# Mode 'x' — buat baru, error jika sudah ada
try:
    with open("file_baru.txt", "x") as f:
        f.write("File baru berhasil dibuat!")
except FileExistsError:
    print("File sudah ada!")
\`\`\`

---

## 📋 Tabel Mode File

| Mode | Arti | File Tidak Ada | File Ada |
|------|------|----------------|----------|
| \`r\` | Read | Error | Baca dari awal |
| \`w\` | Write | Buat baru | **Timpa isi** |
| \`a\` | Append | Buat baru | Tambah di akhir |
| \`x\` | Exclusive | Buat baru | **Error** |
| \`r+\` | Read+Write | Error | Baca dan tulis |
| \`rb\` | Read Binary | Error | Baca sebagai bytes |
| \`wb\` | Write Binary | Buat baru | Tulis bytes |

---

## 📊 Bekerja dengan CSV

CSV (Comma-Separated Values) adalah format file data paling populer — bisa dibuka di Excel!

\`\`\`python
import csv

# Menulis CSV
siswa = [
    ["Nama", "NIS", "Nilai Matematika", "Nilai IPA"],
    ["Andi",  "001", 88, 92],
    ["Budi",  "002", 75, 80],
    ["Cici",  "003", 92, 88],
    ["Dedi",  "004", 67, 71],
]

with open("nilai_siswa.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(siswa)    # Tulis semua baris sekaligus
    print("✅ CSV berhasil ditulis")

# Membaca CSV
print("\\nData nilai siswa:")
print("-" * 45)
with open("nilai_siswa.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)  # Baca sebagai dictionary (pakai header)
    for baris in reader:
        print(f"{baris['Nama']:<10} NIS:{baris['NIS']} "
              f"MTK:{baris['Nilai Matematika']} IPA:{baris['Nilai IPA']}")
\`\`\`

---

## 🗂️ Bekerja dengan JSON

JSON adalah format data universal yang digunakan hampir semua web API.

\`\`\`python
import json

# Python dict/list → JSON string/file
data_produk = [
    {"id": 1, "nama": "Laptop ASUS", "harga": 8500000, "stok": 10},
    {"id": 2, "nama": "Mouse Logitech", "harga": 250000, "stok": 45},
    {"id": 3, "nama": "Keyboard Mech", "harga": 750000, "stok": 0},
]

# Simpan ke file JSON
with open("produk.json", "w", encoding="utf-8") as f:
    json.dump(data_produk, f, indent=2, ensure_ascii=False)
print("✅ JSON disimpan")

# Baca dari file JSON
with open("produk.json", "r", encoding="utf-8") as f:
    produk = json.load(f)

print(f"\\n{len(produk)} produk ditemukan:")
for p in produk:
    status = "✅" if p["stok"] > 0 else "❌ Habis"
    print(f"  {p['id']}. {p['nama']:<20} Rp{p['harga']:>9,}  {status}")

# Konversi JSON string ↔ dict (untuk data dari API)
json_string = '{"nama": "Budi", "umur": 25}'
orang = json.loads(json_string)           # String → Dict
print(orang["nama"])                       # Budi

dict_data = {"kota": "Jakarta", "kode": "JKT"}
json_str  = json.dumps(dict_data, indent=2)  # Dict → String
print(json_str)
\`\`\`

---

## 📁 Manajemen File & Folder dengan pathlib

\`\`\`python
from pathlib import Path

# Info tentang file
file = Path("nilai_siswa.csv")
print(f"Ada?       {file.exists()}")
print(f"Nama file: {file.name}")
print(f"Ekstensi : {file.suffix}")
print(f"Ukuran   : {file.stat().st_size} bytes")

# Navigasi
root   = Path(".")          # Direktori saat ini
data   = root / "data"      # Gabung path
laporan = data / "2024" / "januari.csv"

# Buat struktur folder
data.mkdir(exist_ok=True)
(data / "2024").mkdir(exist_ok=True)

# List file
print("\\nFile Python di direktori ini:")
for f in Path(".").glob("**/*.py"):  # Rekursif
    print(f"  {f}")

# Copy, rename, delete
from shutil import copy2
copy2("nilai_siswa.csv", "data/backup.csv")   # Copy
file.rename("data/nilai_final.csv")           # Pindah/rename
# file.unlink()                               # Hapus file
\`\`\`

---

## 💡 Contoh Program: Logger Sederhana

\`\`\`python
from datetime import datetime
from pathlib import Path
import json

class SimpleLogger:
    """Logger sederhana yang menyimpan log ke file."""
    
    def __init__(self, nama_app):
        self.nama_app = nama_app
        self.log_dir  = Path("logs")
        self.log_dir.mkdir(exist_ok=True)
        
        tanggal = datetime.now().strftime("%Y-%m-%d")
        self.file_log = self.log_dir / f"{nama_app}_{tanggal}.log"
    
    def _tulis(self, level, pesan):
        waktu = datetime.now().strftime("%H:%M:%S")
        baris = f"[{waktu}] [{level}] {pesan}\\n"
        
        with open(self.file_log, "a", encoding="utf-8") as f:
            f.write(baris)
        
        print(baris.strip())
    
    def info(self, pesan):
        self._tulis("INFO ", pesan)
    
    def peringatan(self, pesan):
        self._tulis("WARN ", pesan)
    
    def error(self, pesan):
        self._tulis("ERROR", pesan)


# Penggunaan
log = SimpleLogger("aplikasi_saya")
log.info("Aplikasi dimulai")
log.info("Menghubungkan ke database...")
log.peringatan("Koneksi lambat, mencoba ulang")
log.info("Koneksi berhasil!")
log.error("Tabel 'produk' tidak ditemukan")
\`\`\`

---

## 📝 Ringkasan

- \`open(file, mode)\` untuk membuka file, SELALU gunakan \`with\`
- Mode: \`r\` (baca), \`w\` (tulis/timpa), \`a\` (tambah), \`x\` (buat baru)
- \`read()\` semua, \`readline()\` satu baris, iterasi langsung untuk file besar
- Library \`csv\` untuk CSV, \`json\` untuk JSON
- \`pathlib.Path\` untuk manajemen file modern dan cross-platform
- Selalu sertakan \`encoding="utf-8"\` untuk teks berisi karakter Indonesia

> **Di pelajaran berikutnya, kita belajar Exception Handling — cara menangani error agar program tidak crash!** ⚠️
`;
