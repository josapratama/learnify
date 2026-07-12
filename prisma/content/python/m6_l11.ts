export const lesson11 = `
# Object-Oriented Programming (OOP) — Class & Object

Sejauh ini kita nulis kode secara prosedural — fungsi satu, fungsi dua, data di sana-sini, tidak ada keterkaitan yang jelas. Ini fine untuk program kecil, tapi untuk program yang lebih besar, sulit dikelola.

**OOP** adalah cara mengelompokkan data dan fungsi yang berkaitan ke dalam satu entitas bernama **class**. Bayangkan kamu buat aplikasi bank — daripada punya variabel \`saldo_budi\`, \`saldo_siti\`, \`saldo_andi\` yang terpisah, kamu punya class \`AkunBank\` yang masing-masing punya saldo sendiri dan bisa melakukan operasi sendiri.

Lebih terstruktur, lebih mudah dikelola, lebih mudah dipakai ulang.

---

## 🏛️ Class Pertama Kamu

\`\`\`python
# Tanpa OOP — data berantakan
nama_mobil1   = "Avanza"
warna_mobil1  = "Putih"
kecepatan1    = 0

nama_mobil2   = "Innova"
warna_mobil2  = "Hitam"
kecepatan2    = 0

# Dengan OOP — terstruktur dan elegan
class Mobil:
    def __init__(self, nama, warna):   # Constructor
        self.nama       = nama          # Atribut
        self.warna      = warna
        self.kecepatan  = 0

    def gas(self, tambah):              # Method
        self.kecepatan += tambah
        print(f"{self.nama} → {self.kecepatan} km/h")

mobil1 = Mobil("Avanza", "Putih")   # Buat object dari class
mobil2 = Mobil("Innova", "Hitam")   # Buat object lain dari class yang sama

mobil1.gas(60)   # Avanza → 60 km/h
mobil2.gas(80)   # Innova → 80 km/h
\`\`\`

**\`self\`** = referensi ke object itu sendiri. Setiap method harus punya \`self\` sebagai parameter pertama.

---

## 🏛️ Anatomi Class Python

\`\`\`python
class NamaClass:           # ← PascalCase (konvensi Python)
    
    # Class variable — diSHARE semua object
    jumlah_instance = 0
    
    def __init__(self, param1, param2):
        """Constructor — dijalankan saat object dibuat."""
        # Instance variable — MILIK SENDIRI tiap object
        self.param1 = param1
        self.param2 = param2
        NamaClass.jumlah_instance += 1
    
    def method_biasa(self):
        """Method biasa — perlu 'self'."""
        return f"Param1: {self.param1}"
    
    @classmethod
    def class_method(cls):
        """Class method — akses class, bukan instance."""
        return f"Total: {cls.jumlah_instance}"
    
    @staticmethod
    def static_method():
        """Static method — tidak akses class maupun instance."""
        return "Ini fungsi umum yang dikelompokkan di sini"
    
    def __str__(self):
        """Representasi string — dipakai oleh print()."""
        return f"NamaClass({self.param1})"
\`\`\`

---

## 💻 Contoh Lengkap: Class Mahasiswa

\`\`\`python
class Mahasiswa:
    # Class variable
    universitas = "Universitas Indonesia"
    total_mahasiswa = 0
    
    def __init__(self, nama, nim, jurusan):
        """Inisialisasi mahasiswa baru."""
        self.nama    = nama
        self.nim     = nim
        self.jurusan = jurusan
        self.nilai   = {}        # Dictionary untuk simpan nilai per matkul
        self.ipk     = 0.0
        
        Mahasiswa.total_mahasiswa += 1
    
    def tambah_nilai(self, matkul, nilai):
        """Tambahkan nilai mata kuliah."""
        if 0 <= nilai <= 100:
            self.nilai[matkul] = nilai
            self.hitung_ipk()
            print(f"✅ Nilai {matkul}: {nilai} ditambahkan")
        else:
            print("❌ Nilai harus antara 0-100")
    
    def hitung_ipk(self):
        """Hitung IPK berdasarkan nilai yang ada."""
        if not self.nilai:
            self.ipk = 0.0
            return
        
        total = sum(self.nilai.values())
        rata  = total / len(self.nilai)
        
        # Konversi ke skala 4.0
        if   rata >= 85: self.ipk = 4.0
        elif rata >= 75: self.ipk = 3.0
        elif rata >= 65: self.ipk = 2.0
        elif rata >= 55: self.ipk = 1.0
        else:            self.ipk = 0.0
    
    def tampilkan_transkrip(self):
        """Tampilkan transkrip nilai mahasiswa."""
        print(f"\\n{'='*40}")
        print(f"  TRANSKRIP AKADEMIK")
        print(f"  {self.universitas}")
        print(f"{'='*40}")
        print(f"  Nama    : {self.nama}")
        print(f"  NIM     : {self.nim}")
        print(f"  Jurusan : {self.jurusan}")
        print(f"{'-'*40}")
        
        for matkul, nilai in self.nilai.items():
            huruf = "A" if nilai >= 85 else "B" if nilai >= 75 else "C" if nilai >= 65 else "D"
            print(f"  {matkul:<25} {nilai:>3}  ({huruf})")
        
        print(f"{'-'*40}")
        print(f"  IPK: {self.ipk:.2f}")
        print(f"{'='*40}")
    
    @classmethod
    def info_universitas(cls):
        """Tampilkan info universitas."""
        return f"{cls.universitas} — Total mahasiswa: {cls.total_mahasiswa}"
    
    def __str__(self):
        return f"Mahasiswa({self.nama}, {self.nim})"
    
    def __repr__(self):
        return f"Mahasiswa(nama='{self.nama}', nim='{self.nim}', jurusan='{self.jurusan}')"


# Menggunakan class
mhs1 = Mahasiswa("Andi Saputra", "21001", "Informatika")
mhs2 = Mahasiswa("Budi Santoso", "21002", "Sistem Informasi")

# Tambah nilai
mhs1.tambah_nilai("Algoritma", 88)
mhs1.tambah_nilai("Basis Data", 92)
mhs1.tambah_nilai("Jaringan Komputer", 76)
mhs1.tambah_nilai("Pemrograman Web", 85)

# Tampilkan transkrip
mhs1.tampilkan_transkrip()

# Class method
print(Mahasiswa.info_universitas())
# Universitas Indonesia — Total mahasiswa: 2

# Representasi string
print(mhs1)        # Mahasiswa(Andi Saputra, 21001)
print(repr(mhs2))  # Mahasiswa(nama='Budi Santoso', ...)
\`\`\`

---

## 🔮 Magic Methods (Dunder Methods)

Method dengan double underscore — dipanggil otomatis oleh Python:

\`\`\`python
class Vektor:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):      # Untuk print()
        return f"Vektor({self.x}, {self.y})"
    
    def __add__(self, other):   # Untuk operator +
        return Vektor(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar):  # Untuk operator *
        return Vektor(self.x * scalar, self.y * scalar)
    
    def __len__(self):      # Untuk len()
        import math
        return int(math.sqrt(self.x**2 + self.y**2))
    
    def __eq__(self, other):    # Untuk operator ==
        return self.x == other.x and self.y == other.y

v1 = Vektor(3, 4)
v2 = Vektor(1, 2)

print(v1)           # Vektor(3, 4)
print(v1 + v2)      # Vektor(4, 6)
print(v1 * 3)       # Vektor(9, 12)
print(len(v1))      # 5 (magnitude: sqrt(9+16))
print(v1 == v2)     # False
\`\`\`

---

## 📝 Ringkasan

- Class = blueprint/cetakan, Object = hasil instansiasi dari class
- \`__init__()\` adalah constructor yang dijalankan saat object dibuat
- \`self\` = referensi ke object itu sendiri (wajib ada sebagai parameter pertama)
- Instance variable (\`self.x\`) — dimiliki masing-masing object
- Class variable — dibagi semua object dari class yang sama
- Magic methods (\`__str__\`, \`__add__\`, dll.) mendefinisikan perilaku operator
- \`@classmethod\` untuk method yang akses class, \`@staticmethod\` untuk utility

> **Di pelajaran berikutnya, kita belajar Inheritance dan Encapsulation — dua pilar OOP yang membuat kode lebih modular!** 🏛️
`;
