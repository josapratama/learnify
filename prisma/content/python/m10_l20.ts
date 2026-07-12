export const lesson20 = `
# Proyek Akhir: Aplikasi Pengelola Keuangan

Ini bukan sekadar latihan — ini proyek nyata yang bisa kamu pakai sehari-hari dan pajang di portfolio GitHub.

Kamu akan bangun **Aplikasi Pencatat Keuangan Pribadi** berbasis CLI yang menggabungkan hampir semua yang sudah dipelajari: OOP, file handling, exception handling, manipulasi data, dan struktur proyek yang baik.

---

## ✅ Fitur yang Harus Dibangun

### Wajib (MVP)
- Catat pemasukan dan pengeluaran dengan kategori, nominal, keterangan, tanggal
- Semua data tersimpan permanen ke file JSON/CSV
- Tampilkan total saldo, ringkasan bulan ini, dan 10 transaksi terakhir
- Cari dan filter transaksi
- Program tidak crash kalau input salah

### Opsional (Untuk Level Up)
\`\`\`
Menengah:
□ Budget per kategori dengan alert
□ Export laporan ke CSV
□ Grafik ASCII sederhana

Lanjut:
□ Database SQLite
□ REST API dengan FastAPI
□ GUI dengan tkinter
\`\`\`

---

## 🏗️ Struktur Proyek

\`\`\`
keuangan-app/
├── main.py           # Entry point, menu utama
├── transaksi.py      # Class Transaksi, logika CRUD
├── laporan.py        # Generate laporan
├── penyimpanan.py    # Load/save ke file
├── validasi.py       # Validasi input
├── data/
│   └── transaksi.json
└── README.md
\`\`\`

---

## 💡 Panduan Implementasi

### Langkah 1: Model Data

\`\`\`python
# transaksi.py
from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal
import uuid

TipeTransaksi = Literal["pemasukan", "pengeluaran"]

KATEGORI_PEMASUKAN = ["Gaji", "Freelance", "Investasi", "Hadiah", "Lainnya"]
KATEGORI_PENGELUARAN = [
    "Makanan & Minuman", "Transportasi", "Belanja", "Hiburan",
    "Kesehatan", "Pendidikan", "Tagihan & Utilitas", "Tabungan", "Lainnya"
]

@dataclass
class Transaksi:
    tipe       : TipeTransaksi
    kategori   : str
    nominal    : float
    keterangan : str
    tanggal    : str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    id         : str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    
    def to_dict(self):
        return {
            "id"         : self.id,
            "tipe"       : self.tipe,
            "kategori"   : self.kategori,
            "nominal"    : self.nominal,
            "keterangan" : self.keterangan,
            "tanggal"    : self.tanggal
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        t = cls(
            tipe       = data["tipe"],
            kategori   = data["kategori"],
            nominal    = data["nominal"],
            keterangan = data["keterangan"]
        )
        t.tanggal = data["tanggal"]
        t.id      = data["id"]
        return t
    
    def __str__(self):
        simbol = "+" if self.tipe == "pemasukan" else "-"
        return (f"[{self.tanggal}] {simbol}Rp{self.nominal:>12,.0f} "
                f"| {self.kategori:<25} | {self.keterangan}")
\`\`\`

### Langkah 2: Penyimpanan Data

\`\`\`python
# penyimpanan.py
import json
from pathlib import Path
from transaksi import Transaksi

FILE_DATA = Path("data/transaksi.json")

def muat_data() -> list[Transaksi]:
    """Muat semua transaksi dari file."""
    FILE_DATA.parent.mkdir(exist_ok=True)
    
    if not FILE_DATA.exists():
        return []
    
    try:
        with open(FILE_DATA, "r", encoding="utf-8") as f:
            data = json.load(f)
        return [Transaksi.from_dict(d) for d in data]
    except (json.JSONDecodeError, KeyError) as e:
        print(f"⚠️ Error membaca data: {e}. Mulai dengan data kosong.")
        return []

def simpan_data(transaksi_list: list[Transaksi]):
    """Simpan semua transaksi ke file."""
    FILE_DATA.parent.mkdir(exist_ok=True)
    
    with open(FILE_DATA, "w", encoding="utf-8") as f:
        json.dump([t.to_dict() for t in transaksi_list], f,
                  indent=2, ensure_ascii=False)
\`\`\`

### Langkah 3: Laporan

\`\`\`python
# laporan.py
from transaksi import Transaksi
from datetime import datetime

def ringkasan_bulan_ini(transaksi_list: list[Transaksi]):
    """Tampilkan ringkasan keuangan bulan ini."""
    bulan_ini = datetime.now().strftime("%Y-%m")
    
    bulan = [t for t in transaksi_list if t.tanggal.startswith(bulan_ini)]
    
    total_masuk  = sum(t.nominal for t in bulan if t.tipe == "pemasukan")
    total_keluar = sum(t.nominal for t in bulan if t.tipe == "pengeluaran")
    saldo_bulan  = total_masuk - total_keluar
    
    print(f"\\n{'='*45}")
    print(f"  RINGKASAN {bulan_ini}")
    print(f"{'='*45}")
    print(f"  💚 Pemasukan  : Rp {total_masuk:>12,.0f}")
    print(f"  ❤️  Pengeluaran: Rp {total_keluar:>12,.0f}")
    print(f"{'─'*45}")
    simbol = "+" if saldo_bulan >= 0 else ""
    print(f"  📊 Net Bulan  : {simbol}Rp {saldo_bulan:>11,.0f}")
    print(f"{'='*45}")

def saldo_total(transaksi_list: list[Transaksi]) -> float:
    """Hitung saldo total semua waktu."""
    masuk  = sum(t.nominal for t in transaksi_list if t.tipe == "pemasukan")
    keluar = sum(t.nominal for t in transaksi_list if t.tipe == "pengeluaran")
    return masuk - keluar

def laporan_per_kategori(transaksi_list: list[Transaksi], tipe: str):
    """Laporan pengeluaran/pemasukan per kategori."""
    filtered = [t for t in transaksi_list if t.tipe == tipe]
    
    if not filtered:
        print(f"Belum ada data {tipe}.")
        return
    
    per_kategori: dict[str, float] = {}
    for t in filtered:
        per_kategori[t.kategori] = per_kategori.get(t.kategori, 0) + t.nominal
    
    total = sum(per_kategori.values())
    urut  = sorted(per_kategori.items(), key=lambda x: x[1], reverse=True)
    
    print(f"\\n{'='*45}")
    print(f"  LAPORAN {tipe.upper()} PER KATEGORI")
    print(f"{'='*45}")
    
    for kategori, nominal in urut:
        persen = nominal / total * 100
        bar    = "█" * int(persen / 5)
        print(f"  {kategori:<25} {persen:5.1f}% {bar}")
        print(f"  {'':25} Rp {nominal:,.0f}")
    
    print(f"{'─'*45}")
    print(f"  {'TOTAL':<25} Rp {total:,.0f}")
    print(f"{'='*45}")
\`\`\`

### Langkah 4: Menu Utama

\`\`\`python
# main.py
from transaksi import Transaksi, KATEGORI_PEMASUKAN, KATEGORI_PENGELUARAN
from penyimpanan import muat_data, simpan_data
from laporan import ringkasan_bulan_ini, saldo_total, laporan_per_kategori

def tampilkan_menu():
    saldo = saldo_total(data)
    warna = "💚" if saldo >= 0 else "❤️ "
    print(f"\\n{warna} Saldo Total: Rp {saldo:,.0f}")
    print("═" * 40)
    print("  MENU UTAMA")
    print("═" * 40)
    print("  1. Catat Pemasukan")
    print("  2. Catat Pengeluaran")
    print("  3. Lihat 10 Transaksi Terakhir")
    print("  4. Ringkasan Bulan Ini")
    print("  5. Laporan per Kategori")
    print("  6. Cari Transaksi")
    print("  0. Keluar")
    print("═" * 40)

def input_transaksi(tipe: str):
    """Input transaksi baru."""
    print(f"\\n─── Catat {tipe.title()} ───")
    
    kategori_list = KATEGORI_PEMASUKAN if tipe == "pemasukan" else KATEGORI_PENGELUARAN
    for i, k in enumerate(kategori_list, 1):
        print(f"  {i}. {k}")
    
    # Pilih kategori
    while True:
        try:
            pilihan = int(input("Pilih kategori: "))
            if 1 <= pilihan <= len(kategori_list):
                kategori = kategori_list[pilihan - 1]
                break
            print("❌ Pilihan tidak valid")
        except ValueError:
            print("❌ Masukkan angka")
    
    # Input nominal
    while True:
        try:
            nominal = float(input("Nominal (Rp): ").replace(",", "").replace(".", ""))
            if nominal <= 0:
                print("❌ Nominal harus positif")
                continue
            break
        except ValueError:
            print("❌ Masukkan angka")
    
    keterangan = input("Keterangan: ").strip() or "(tidak ada)"
    
    t = Transaksi(tipe=tipe, kategori=kategori, nominal=nominal, keterangan=keterangan)
    data.append(t)
    simpan_data(data)
    
    simbol = "+" if tipe == "pemasukan" else "-"
    print(f"\\n✅ {tipe.title()} dicatat: {simbol}Rp{nominal:,.0f} ({kategori})")

# Global data
data = muat_data()

def main():
    print("\\n💰 APLIKASI KEUANGAN PRIBADI")
    print(f"   {len(data)} transaksi tersimpan")
    
    while True:
        tampilkan_menu()
        
        try:
            pilihan = input("Pilih menu: ").strip()
        except KeyboardInterrupt:
            print("\\n\\nTerima kasih! Selamat mengelola keuangan Anda! 👋")
            break
        
        if pilihan == "1":
            input_transaksi("pemasukan")
        elif pilihan == "2":
            input_transaksi("pengeluaran")
        elif pilihan == "3":
            print("\\n─── 10 Transaksi Terakhir ───")
            for t in reversed(data[-10:]):
                print(f" {t}")
        elif pilihan == "4":
            ringkasan_bulan_ini(data)
        elif pilihan == "5":
            tipe = input("Laporan apa? (pemasukan/pengeluaran): ").lower()
            if tipe in ["pemasukan", "pengeluaran"]:
                laporan_per_kategori(data, tipe)
        elif pilihan == "6":
            kata = input("Cari: ").lower()
            hasil = [t for t in data if kata in t.keterangan.lower() or kata in t.kategori.lower()]
            if hasil:
                for t in hasil:
                    print(f" {t}")
            else:
                print("Tidak ada hasil.")
        elif pilihan == "0":
            print("\\nTerima kasih! Selamat mengelola keuangan Anda! 👋")
            break

if __name__ == "__main__":
    main()
\`\`\`

---

## 📊 Kriteria Penilaian

| Kriteria | Poin |
|----------|------|
| Fungsionalitas dasar berjalan | 40 |
| Data tersimpan dan dimuat dengan benar | 20 |
| Penanganan error tidak ada crash | 20 |
| Kode terstruktur (fungsi, class, modul) | 10 |
| Fitur tambahan (opsional) | 10 |
| **Total** | **100** |

---

## 🚀 Langkah Setelah Selesai

1. **Upload ke GitHub** — tulis README yang bagus
2. **Tambahkan fitur** — jadikan lebih berguna
3. **Refactor** — buat kode lebih rapi dan efisien
4. **Test** — tulis unit test dengan pytest
5. **Share** — ceritakan ke komunitas Python Indonesia

**Semangat mengerjakan Proyek Akhir Anda! Ini adalah langkah pertama menuju karir sebagai Python Developer!** 🐍🚀
`;
