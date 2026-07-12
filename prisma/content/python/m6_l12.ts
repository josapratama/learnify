export const lesson12 = `
# OOP Lanjutan — Inheritance & Encapsulation

Di pelajaran sebelumnya kita belajar buat class dasar. Sekarang dua konsep yang membuat OOP benar-benar powerful: **Inheritance** (mewarisi) dan **Encapsulation** (menyembunyikan detail).

**Inheritance** — kalau kamu sudah punya class \`Kendaraan\` dengan semua atribut dan method umumnya, kamu tidak perlu tulis ulang semuanya untuk class \`Mobil\` atau \`Motor\`. Cukup warisi dari \`Kendaraan\`, lalu tambahkan yang spesifik.

**Encapsulation** — tidak semua bagian dari object perlu bisa diakses bebas dari luar. Saldo rekening bank tidak boleh diubah langsung — harus lewat fungsi \`setor()\` atau \`tarik()\` yang tervalidasi. Ini yang encapsulation lakukan.

---

## 🏛️ Inheritance Dasar

\`\`\`python
# Class Induk — berisi yang umum untuk semua kendaraan
class Kendaraan:
    def __init__(self, merk, tahun, warna):
        self.merk       = merk
        self.tahun      = tahun
        self.warna      = warna
        self.kecepatan  = 0
    
    def gas(self, tambah):
        self.kecepatan += tambah
        print(f"{self.merk} → {self.kecepatan} km/h")
    
    def rem(self):
        self.kecepatan = max(0, self.kecepatan - 20)
    
    def info(self):
        return f"{self.tahun} {self.merk} ({self.warna})"


# Class Anak — warisi dari Kendaraan, tambah yang spesifik
class Mobil(Kendaraan):
    def __init__(self, merk, tahun, warna, jumlah_pintu=4):
        super().__init__(merk, tahun, warna)   # Panggil constructor parent
        self.jumlah_pintu = jumlah_pintu        # Atribut tambahan khusus Mobil
        self.AC_nyala     = False
    
    def nyalakan_AC(self):                      # Method baru, tidak ada di parent
        self.AC_nyala = True
        print(f"AC {self.merk} dinyalakan ❄️")
    
    def info(self):                             # Override method parent
        return f"{super().info()} | {self.jumlah_pintu} pintu"


class Motor(Kendaraan):
    def __init__(self, merk, tahun, warna, tipe="sport"):
        super().__init__(merk, tahun, warna)
        self.tipe = tipe
    
    def wheelie(self):
        if self.kecepatan > 50:
            print(f"🏍️ {self.merk} wheelie!")
        else:
            print("Kecepatan kurang untuk wheelie!")


avanza = Mobil("Toyota Avanza", 2023, "Putih")
ninja  = Motor("Kawasaki Ninja", 2022, "Hijau", "sport")

avanza.gas(60)          # Toyota Avanza → 60 km/h
avanza.nyalakan_AC()    # AC Toyota Avanza dinyalakan ❄️

ninja.gas(80)
ninja.wheelie()         # 🏍️ Kawasaki Ninja wheelie!

# Cek pewarisan
print(isinstance(avanza, Kendaraan))  # True — avanza adalah Kendaraan juga!
\`\`\`

---

## 🔗 Multiple Inheritance

Python memungkinkan satu class mewarisi dari beberapa class sekaligus:

\`\`\`python
class Bisa_Terbang:
    def terbang(self):
        print(f"{self.__class__.__name__} sedang terbang!")

class Bisa_Berenang:
    def berenang(self):
        print(f"{self.__class__.__name__} sedang berenang!")

class Bebek(Bisa_Terbang, Bisa_Berenang):
    def __init__(self, nama):
        self.nama = nama
    
    def bersuara(self):
        print("Kwek kwek!")

donald = Bebek("Donald")
donald.terbang()    # Bebek sedang terbang!
donald.berenang()   # Bebek sedang berenang!
donald.bersuara()   # Kwek kwek!
\`\`\`

---

## 🔒 Encapsulation — Menyembunyikan Detail

## 🏦 Analogi: Mesin ATM

Saat menarik uang dari ATM, Anda:
- Tahu cara **pakai**: masukkan kartu, PIN, pilih nominal
- **Tidak tahu** cara kerjanya di dalam: koneksi bank, enkripsi PIN, mekanisme dispenser uang

Itulah encapsulation — sembunyikan detail internal, sediakan "tombol" yang aman untuk digunakan.

\`\`\`python
class AkunBank:
    def __init__(self, pemilik, saldo_awal=0):
        self.pemilik   = pemilik           # Public — bebas diakses
        self._bank     = "Bank Python"     # Protected — konvensi "jangan akses langsung"
        self.__saldo   = saldo_awal        # Private — benar-benar disembunyikan
        self.__pin     = "0000"            # Private
        self.__riwayat = []
    
    # Getter — cara aman untuk membaca __saldo
    @property
    def saldo(self):
        return self.__saldo
    
    # Setter — cara aman untuk ubah __pin
    @property
    def pin(self):
        return "****"  # Jangan pernah tampilkan PIN asli!
    
    @pin.setter
    def pin(self, pin_baru):
        if len(str(pin_baru)) == 6 and str(pin_baru).isdigit():
            self.__pin = str(pin_baru)
            print("✅ PIN berhasil diubah")
        else:
            print("❌ PIN harus 6 digit angka!")
    
    def setor(self, jumlah, pin_input):
        """Setor tunai."""
        if not self.__verifikasi_pin(pin_input):
            return
        if jumlah <= 0:
            print("❌ Jumlah setoran harus positif!")
            return
        
        self.__saldo += jumlah
        self.__riwayat.append(f"Setor: +Rp{jumlah:,}")
        print(f"✅ Setor Rp{jumlah:,} | Saldo: Rp{self.__saldo:,}")
    
    def tarik(self, jumlah, pin_input):
        """Tarik tunai."""
        if not self.__verifikasi_pin(pin_input):
            return
        if jumlah > self.__saldo:
            print(f"❌ Saldo tidak cukup! Saldo: Rp{self.__saldo:,}")
            return
        
        self.__saldo -= jumlah
        self.__riwayat.append(f"Tarik: -Rp{jumlah:,}")
        print(f"✅ Tarik Rp{jumlah:,} | Saldo: Rp{self.__saldo:,}")
    
    def lihat_riwayat(self, pin_input):
        """Lihat riwayat transaksi."""
        if not self.__verifikasi_pin(pin_input):
            return
        print(f"\\nRiwayat Akun {self.pemilik}:")
        for item in self.__riwayat:
            print(f"  {item}")
    
    # Private method — hanya bisa dipanggil dari dalam class
    def __verifikasi_pin(self, pin_input):
        if str(pin_input) != self.__pin:
            print("❌ PIN salah!")
            return False
        return True
    
    def __str__(self):
        return f"Akun {self.pemilik} | Saldo: Rp{self.__saldo:,}"


# Penggunaan
akun = AkunBank("Pratama Dev", saldo_awal=5_000_000)
akun.__pin = "9999"     # Tidak berhasil mengubah PIN asli (name mangling)
print(akun.__dict__)    # PIN asli tidak bisa diakses langsung

# Cara yang benar
akun.setor(2_000_000, "0000")
akun.tarik(500_000,   "0000")
akun.tarik(10_000_000, "0000")  # Gagal, saldo tidak cukup
akun.lihat_riwayat("0000")

# Ubah PIN (via setter)
akun.pin = "123456"     # ← Setter property, tervalidasi
print(akun.saldo)       # 6_500_000 (via getter property)
print(akun)             # Akun Pratama Dev | Saldo: Rp6,500,000
\`\`\`

---

## 🎭 Polymorphism — Satu Interface, Banyak Perilaku

\`\`\`python
# Semua hewan bisa "bersuara", tapi bunyinya beda-beda
class Hewan:
    def __init__(self, nama):
        self.nama = nama
    
    def bersuara(self):
        return "..."  # Override di subclass

class Kucing(Hewan):
    def bersuara(self):
        return "Meong!"

class Anjing(Hewan):
    def bersuara(self):
        return "Woof!"

class Sapi(Hewan):
    def bersuara(self):
        return "Moooo!"

# Polymorphism — panggil bersuara() yang sama, hasil berbeda
hewan_kebun = [Kucing("Luna"), Anjing("Rex"), Sapi("Betsy")]

for hewan in hewan_kebun:
    print(f"{hewan.nama}: {hewan.bersuara()}")

# Output:
# Luna: Meong!
# Rex: Woof!
# Betsy: Moooo!
\`\`\`

---

## 📝 Ringkasan

**Inheritance:**
- Class anak \`class Anak(Induk):\` mewarisi semua milik class induk
- \`super()\` untuk memanggil method/constructor dari class induk
- Override method untuk ubah perilaku di class anak

**Encapsulation:**
- \`self.publik\` — bebas diakses dari mana saja
- \`self._protected\` — konvensi "internal use", masih bisa diakses
- \`self.__private\` — name mangling, tidak bisa diakses langsung dari luar
- \`@property\` untuk getter/setter yang aman dan tervalidasi

**Polymorphism:**
- Banyak class bisa punya method dengan nama sama, tapi implementasi berbeda
- Kode yang memanggil tidak perlu tahu tipe spesifik object-nya

> **Di modul berikutnya, kita belajar file handling dan exception handling — keterampilan penting untuk program yang tidak crash!** 📁
`;
