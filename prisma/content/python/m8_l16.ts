export const lesson16 = `
# Manipulasi Data dengan Pandas

Kalau NumPy adalah fondasi untuk komputasi numerik, **Pandas** adalah alat untuk analisis data yang lebih "manusiawi" — data dengan nama kolom, tanggal, kategori, nilai kosong, dan semua kerumitan dunia nyata.

Hampir setiap data scientist dan analis data menghabiskan sebagian besar waktunya di Pandas. Format CSV, Excel, JSON — semua bisa dibaca dan dimanipulasi dengan mudah.

\`\`\`bash
pip install pandas
\`\`\`

---

## 🏗️ Dua Struktur Data Utama

### Series — Satu Kolom Data

\`\`\`python
import pandas as pd

# Series = array satu dimensi dengan label/index
nilai = pd.Series([88, 92, 75, 85, 90],
                  index=["Andi", "Budi", "Cici", "Dedi", "Eka"])

print(nilai)
# Andi    88
# Budi    92
# Cici    75
# dtype: int64

print(nilai["Budi"])       # 92
print(nilai.mean())        # 86.0
print(nilai[nilai > 85])   # Filter: Andi, Budi, Eka
\`\`\`

### DataFrame — Tabel Data

\`\`\`python
# Buat dari dictionary
data = {
    "nama"   : ["Andi", "Budi", "Cici", "Dedi", "Eka"],
    "umur"   : [25, 30, 22, 28, 35],
    "divisi" : ["IT", "HR", "IT", "Finance", "IT"],
    "gaji"   : [8_000_000, 7_500_000, 6_500_000, 9_000_000, 11_000_000],
    "aktif"  : [True, True, True, False, True]
}

df = pd.DataFrame(data)
print(df)
\`\`\`

---

## 🔍 Eksplorasi DataFrame

\`\`\`python
# Info dasar
print(df.shape)           # (5, 5) ← 5 baris, 5 kolom
print(df.dtypes)          # Tipe data tiap kolom
print(df.info())          # Info komprehensif
print(df.describe())      # Statistik numerik (count, mean, std, min, max...)

# Preview data
print(df.head(3))         # 3 baris pertama
print(df.tail(2))         # 2 baris terakhir
print(df.sample(3))       # 3 baris acak

# Cek nilai kosong
print(df.isnull().sum())  # Jumlah NaN per kolom
print(df.isnull().any())  # Ada NaN di kolom ini?
\`\`\`

---

## 🎯 Seleksi Data

\`\`\`python
# Pilih kolom
print(df["nama"])                          # Satu kolom (Series)
print(df[["nama", "gaji"]])               # Beberapa kolom (DataFrame)

# Pilih baris berdasarkan index
print(df.iloc[0])          # Baris index 0 (integer-based)
print(df.iloc[1:3])        # Baris index 1 dan 2
print(df.loc[0, "nama"])   # Baris 0, kolom "nama"

# Filter baris berdasarkan kondisi
it_staff    = df[df["divisi"] == "IT"]
gaji_tinggi = df[df["gaji"] > 8_000_000]
aktif_it    = df[(df["aktif"] == True) & (df["divisi"] == "IT")]

print(f"Karyawan IT: {len(it_staff)} orang")
print(aktif_it[["nama", "gaji"]])

# Filter dengan isin()
divisi_target = df[df["divisi"].isin(["IT", "HR"])]
\`\`\`

---

## ✏️ Modifikasi DataFrame

\`\`\`python
# Tambah kolom baru
df["level"] = df["gaji"].apply(
    lambda x: "Senior" if x >= 9_000_000 else "Junior"
)

df["gaji_per_hari"] = df["gaji"] / 22  # Asumsi 22 hari kerja

# Ubah nilai kolom
df.loc[df["nama"] == "Dedi", "aktif"] = True  # Aktifkan kembali Dedi

# Rename kolom
df = df.rename(columns={"nama": "name", "umur": "age"})

# Hapus kolom
df = df.drop(columns=["gaji_per_hari"])

# Hapus baris
df = df.drop(index=3)  # Hapus baris index 3
\`\`\`

---

## 📊 Groupby — Agregasi Data

\`\`\`python
# Reset ke data awal dengan lebih banyak data
np.random.seed(42)
n = 50
df_besar = pd.DataFrame({
    "nama"   : [f"Karyawan{i}" for i in range(n)],
    "divisi" : np.random.choice(["IT", "HR", "Finance", "Marketing"], n),
    "level"  : np.random.choice(["Junior", "Senior", "Manager"], n),
    "gaji"   : np.random.randint(5_000_000, 20_000_000, n),
    "nilai_kinerja": np.random.randint(60, 100, n)
})

# Rata-rata gaji per divisi
print(df_besar.groupby("divisi")["gaji"].mean().round())

# Agregasi multiple
ringkasan = df_besar.groupby("divisi").agg(
    jumlah_karyawan = ("nama", "count"),
    rata_gaji       = ("gaji", "mean"),
    total_gaji      = ("gaji", "sum"),
    rata_kinerja    = ("nilai_kinerja", "mean")
).round(0)

print(ringkasan)

# Groupby multiple kolom
print(df_besar.groupby(["divisi", "level"])["gaji"].mean())
\`\`\`

---

## 📁 Baca & Tulis File

\`\`\`python
# CSV
df.to_csv("karyawan.csv", index=False, encoding="utf-8")
df_baca = pd.read_csv("karyawan.csv")

# Excel
# pip install openpyxl
df.to_excel("laporan.xlsx", sheet_name="Karyawan", index=False)
df_excel = pd.read_excel("laporan.xlsx")

# JSON
df.to_json("karyawan.json", orient="records", indent=2, force_ascii=False)

# Langsung dari URL
# df_web = pd.read_csv("https://data.go.id/dataset/data.csv")
\`\`\`

---

## 🧹 Data Cleaning — Membersihkan Data Kotor

\`\`\`python
# Data kotor contoh
data_kotor = {
    "nama"  : ["Andi", "BUDI", "  Cici  ", "dedi", None, "Eka"],
    "email" : ["andi@email.com", "BUDI@EMAIL.COM", "cici@email.com",
               "bukan-email", "eka@email.com", "eka@email.com"],  # Duplikat
    "umur"  : [25, -5, 22, 150, 28, 35],    # Ada umur tidak valid
    "gaji"  : [8_000_000, None, 6_500_000, 9_000_000, None, 11_000_000]
}
df_kotor = pd.DataFrame(data_kotor)

# 1. Hapus baris duplikat
df_bersih = df_kotor.drop_duplicates(subset=["email"])

# 2. Tangani nilai kosong (NaN)
df_bersih["gaji"].fillna(df_bersih["gaji"].median(), inplace=True)  # Isi dengan median
df_bersih.dropna(subset=["nama"], inplace=True)                     # Hapus jika nama kosong

# 3. Standardisasi teks
df_bersih["nama"] = df_bersih["nama"].str.strip().str.title()  # "  cici  " → "Cici"
df_bersih["email"] = df_bersih["email"].str.lower()

# 4. Filter data tidak valid
df_bersih = df_bersih[(df_bersih["umur"] >= 17) & (df_bersih["umur"] <= 65)]

print("Data setelah dibersihkan:")
print(df_bersih)
\`\`\`

---

## 💡 Contoh Program: Analisis Penjualan

\`\`\`python
import pandas as pd
import numpy as np

# Simulasi data penjualan 3 bulan
np.random.seed(42)
n = 90

df_penjualan = pd.DataFrame({
    "tanggal"  : pd.date_range("2024-01-01", periods=n, freq="D"),
    "produk"   : np.random.choice(["Laptop", "Mouse", "Keyboard", "Monitor"], n),
    "wilayah"  : np.random.choice(["Jakarta", "Surabaya", "Bandung"], n),
    "qty"      : np.random.randint(1, 10, n),
    "harga"    : np.random.choice([8_500_000, 250_000, 750_000, 3_200_000], n),
})

df_penjualan["total"] = df_penjualan["qty"] * df_penjualan["harga"]
df_penjualan["bulan"] = df_penjualan["tanggal"].dt.month_name()

print("=== LAPORAN PENJUALAN ===\\n")

# Total revenue
total = df_penjualan["total"].sum()
print(f"Total Revenue : Rp {total:,.0f}")

# Top produk
top_produk = df_penjualan.groupby("produk")["total"].sum().sort_values(ascending=False)
print("\\nRevenue per Produk:")
for produk, rev in top_produk.items():
    print(f"  {produk:<12}: Rp {rev:>12,.0f}")

# Per wilayah
top_wilayah = df_penjualan.groupby("wilayah")["total"].sum().sort_values(ascending=False)
print("\\nRevenue per Wilayah:")
for wilayah, rev in top_wilayah.items():
    print(f"  {wilayah:<12}: Rp {rev:>12,.0f}")
\`\`\`

---

## 📝 Ringkasan

- \`pd.Series\` untuk satu kolom data, \`pd.DataFrame\` untuk tabel
- \`df.head()\`, \`df.info()\`, \`df.describe()\` untuk eksplorasi awal
- \`df[kondisi]\` untuk filter baris, \`df[["kol1", "kol2"]]\` untuk pilih kolom
- \`df.groupby()\` untuk agregasi per kategori
- \`df.to_csv()\`, \`pd.read_csv()\` untuk simpan dan baca data
- Data cleaning: \`fillna()\`, \`dropna()\`, \`drop_duplicates()\`, \`str.strip()\`

> **Di modul berikutnya, kita belajar cara berinteraksi dengan Web API — membuka akses ke data dari internet!** 🌐
`;
