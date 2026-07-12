export const lesson14 = `
# Exception Handling — Tangani Error dengan Elegan

Program yang bagus bukan program yang tidak pernah error — program yang bagus adalah program yang **menangani error dengan elegan** alih-alih crash.

Coba bayangkan aplikasi bank yang crash setiap kali pengguna salah input, atau web server yang mati karena satu request bermasalah. Tidak bisa dipakai.

Python punya sistem exception handling yang membuat kamu bisa menangkap error, bereaksi dengan tepat, dan melanjutkan program seolah tidak ada yang terjadi.

---

## 🔴 Apa itu Exception?

Ini adalah error yang terjadi saat program sedang berjalan — bukan saat ditulis:

\`\`\`python
# Setiap baris ini akan crash tanpa exception handling:
print(10 / 0)           # ZeroDivisionError
int("abc")              # ValueError
daftar = [1, 2, 3]
print(daftar[10])       # IndexError
data = {"nama": "Budi"}
print(data["email"])    # KeyError
open("tidak_ada.txt")   # FileNotFoundError
"5" + 5                 # TypeError
\`\`\`

Semua crash menampilkan traceback yang menakutkan ke user. Exception handling mencegah itu.

---

## 🛡️ Struktur Try-Except

\`\`\`python
try:
    # Kode yang mungkin error
    angka = int(input("Masukkan angka: "))
    hasil = 10 / angka
    print(f"Hasilnya: {hasil}")

except ZeroDivisionError:
    # Tangkap error spesifik ini
    print("❌ Tidak bisa membagi dengan nol!")

except ValueError:
    # Tangkap error spesifik lain
    print("❌ Bukan angka yang valid!")

except Exception as e:
    # Tangkap semua error lain yang tidak tertangkap di atas
    print(f"❌ Error tidak terduga: {type(e).__name__}: {e}")

else:
    # Dijalankan HANYA jika tidak ada exception
    print("✅ Perhitungan berhasil!")

finally:
    # SELALU dijalankan apapun yang terjadi — untuk cleanup
    print("Program selesai.")
\`\`\`

---

## 📋 Exception Umum Python

| Exception | Kapan Terjadi |
|-----------|---------------|
| \`ValueError\` | Nilai tidak sesuai (misal: \`int("abc")\`) |
| \`TypeError\` | Tipe data salah (\`"5" + 5\`) |
| \`ZeroDivisionError\` | Bagi dengan nol |
| \`IndexError\` | Index di luar jangkauan list |
| \`KeyError\` | Kunci tidak ada di dictionary |
| \`FileNotFoundError\` | File tidak ditemukan |
| \`AttributeError\` | Object tidak punya atribut/method |
| \`NameError\` | Variabel belum didefinisikan |
| \`MemoryError\` | Memori habis |
| \`TimeoutError\` | Operasi melebihi batas waktu |

---

## 🎯 Contoh Nyata: Validasi Input User

\`\`\`python
def minta_angka(prompt, min_val=None, max_val=None):
    """
    Minta input angka dari user dengan validasi.
    Terus minta sampai input valid.
    """
    while True:
        try:
            nilai = float(input(prompt))
            
            if min_val is not None and nilai < min_val:
                raise ValueError(f"Nilai harus >= {min_val}")
            
            if max_val is not None and nilai > max_val:
                raise ValueError(f"Nilai harus <= {max_val}")
            
            return nilai
            
        except ValueError as e:
            print(f"❌ Input tidak valid: {e}")
            print("   Silakan coba lagi.\\n")


# Penggunaan
umur   = minta_angka("Umur Anda (1-120): ", 1, 120)
tinggi = minta_angka("Tinggi badan (cm): ", 50, 250)
berat  = minta_angka("Berat badan (kg) : ", 1, 500)

imt = berat / (tinggi/100) ** 2
print(f"\\nIMT Anda: {imt:.1f}")
\`\`\`

---

## 🔗 Tangkap Banyak Exception Sekaligus

\`\`\`python
def baca_konfigurasi(path):
    """Baca file konfigurasi JSON."""
    import json
    
    try:
        with open(path, "r") as f:
            config = json.load(f)
        return config
    
    except FileNotFoundError:
        print(f"⚠️ File config tidak ada: {path}")
        print("   Menggunakan konfigurasi default...")
        return {"debug": False, "host": "localhost", "port": 8080}
    
    except json.JSONDecodeError as e:
        print(f"❌ Format JSON salah di baris {e.lineno}: {e.msg}")
        return None
    
    except PermissionError:
        print(f"❌ Tidak ada izin membaca file: {path}")
        return None

# Penggunaan
config = baca_konfigurasi("config.json")
if config:
    print(f"Server: {config['host']}:{config['port']}")
\`\`\`

---

## 🚨 Membuat Custom Exception

\`\`\`python
# Buat hierarchy exception sendiri
class AplikasiError(Exception):
    """Base exception untuk aplikasi kita."""
    pass

class ValidationError(AplikasiError):
    """Error validasi data input."""
    def __init__(self, field, pesan):
        self.field = field
        self.pesan = pesan
        super().__init__(f"Validasi gagal pada '{field}': {pesan}")

class DatabaseError(AplikasiError):
    """Error koneksi atau operasi database."""
    pass

class AuthError(AplikasiError):
    """Error autentikasi."""
    def __init__(self, pesan="Akses ditolak"):
        super().__init__(pesan)


# Penggunaan custom exception
def daftarkan_user(email, password, umur):
    # Validasi email
    if "@" not in email:
        raise ValidationError("email", "Format email tidak valid")
    
    # Validasi password
    if len(password) < 8:
        raise ValidationError("password", "Password minimal 8 karakter")
    
    # Validasi umur
    if not isinstance(umur, int) or umur < 17:
        raise ValidationError("umur", "Umur minimal 17 tahun")
    
    # Simulasi cek duplikat email
    email_terdaftar = ["admin@app.com", "user@app.com"]
    if email in email_terdaftar:
        raise DatabaseError(f"Email '{email}' sudah terdaftar")
    
    print(f"✅ User {email} berhasil didaftarkan!")

# Handle custom exception
try:
    daftarkan_user("bukan-email", "pass", 25)
except ValidationError as e:
    print(f"❌ {e}")
    print(f"   Field: {e.field}")

try:
    daftarkan_user("andi@email.com", "password123", 20)
except ValidationError as e:
    print(f"❌ Validasi: {e}")
except DatabaseError as e:
    print(f"❌ Database: {e}")
except AplikasiError as e:
    print(f"❌ Aplikasi: {e}")
\`\`\`

---

## 🔄 Context Manager (with Statement)

Context manager memastikan resource selalu "dibersihkan" meski ada exception:

\`\`\`python
# Buat context manager sendiri
class DatabaseConnection:
    def __init__(self, host):
        self.host = host
    
    def __enter__(self):
        print(f"Membuka koneksi ke {self.host}...")
        # Simulasi koneksi
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Menutup koneksi database...")
        # Selalu dijalankan, seperti finally
        if exc_type is not None:
            print(f"  (Ada error: {exc_type.__name__})")
        return False  # False = exception tetap diteruskan


# Penggunaan
try:
    with DatabaseConnection("localhost:5432") as db:
        print("Menjalankan query...")
        # raise Exception("Query gagal!")  # Uncomment untuk test
        print("Query berhasil!")
except Exception as e:
    print(f"Ditangkap: {e}")
\`\`\`

---

## 📏 Best Practices

\`\`\`python
# ✅ BAIK: Tangkap exception spesifik
try:
    nilai = int(input("Angka: "))
except ValueError:
    print("Bukan angka!")

# ❌ BURUK: Tangkap semua secara buta
try:
    nilai = int(input("Angka: "))
except:                          # Hindari ini!
    pass                         # Telan error diam-diam = bug tersembunyi!

# ✅ BAIK: Log error sebelum handle
import logging
try:
    proses_data()
except Exception as e:
    logging.error(f"Error saat proses data: {e}", exc_info=True)
    # exc_info=True = sertakan full traceback di log

# ✅ BAIK: Re-raise exception setelah ditangani
def baca_file(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"File tidak ditemukan: {path}")
        raise  # Re-raise agar pemanggil juga tahu
\`\`\`

---

## 📝 Ringkasan

- \`try-except\` untuk menangkap error tanpa crash
- Tangkap exception **spesifik** dulu, baru \`Exception\` umum
- \`else\` dijalankan jika tidak ada exception
- \`finally\` selalu dijalankan — cocok untuk cleanup
- Buat custom exception dengan \`class NamaError(Exception)\`
- \`raise\` untuk melempar exception, \`raise\` tanpa argumen untuk re-raise
- Hindari menangkap semua exception secara diam-diam (\`except: pass\`)

> **Di modul berikutnya, kita masuk ke Data Science — belajar NumPy dan Pandas untuk mengolah data!** 📊
`;
