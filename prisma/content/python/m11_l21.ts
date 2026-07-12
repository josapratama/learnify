export const python_expert_l1 = `
# Advanced Python: Decorators & Wrappers

Di production code, kamu akan sering melihat pola ini: fungsi yang dibungkus dengan fungsi lain untuk menambah behavior — logging, autentikasi, caching, timing — tanpa mengubah kode fungsi aslinya.

Itulah **decorator** — salah satu fitur Python yang paling elegan dan powerful.

---

## 🔑 Prasyarat: Fungsi adalah "Objek"

Di Python, fungsi bisa diperlakukan seperti nilai biasa — disimpan di variabel, dikirim sebagai argumen, dikembalikan dari fungsi lain.

\`\`\`python
def sapa():
    return "Halo!"

# Simpan fungsi di variabel
fungsi_saya = sapa
print(fungsi_saya())   # Halo!

# Kirim fungsi sebagai argumen
def jalankan(f):
    return f()

print(jalankan(sapa))  # Halo!

# Fungsi yang mengembalikan fungsi
def pembuat_sapa(nama):
    def sapa_orang():
        return f"Halo, {nama}!"
    return sapa_orang   # Kembalikan fungsi, bukan hasilnya!

sapa_budi = pembuat_sapa("Budi")
print(sapa_budi())     # Halo, Budi!
\`\`\`

Ini fondasi dari cara decorator bekerja.

---

## 🏗️ Anatomi Decorator

\`\`\`python
def decorator_saya(fungsi):
    def wrapper(*args, **kwargs):
        print("⏩ Sebelum fungsi")
        
        hasil = fungsi(*args, **kwargs)   # Jalankan fungsi asli
        
        print("⏮️ Sesudah fungsi")
        return hasil
    return wrapper

# Cara panjang — bungkus manual:
def sapa(nama):
    return f"Halo, {nama}!"

sapa = decorator_saya(sapa)   # Bungkus

# Cara singkat dengan @:
@decorator_saya
def sapa2(nama):
    return f"Hei, {nama}!"

# Keduanya sama persis
print(sapa("Andi"))
print(sapa2("Budi"))
\`\`\`

---

## 💡 Use Case 1: Logging

\`\`\`python
import functools
import time
from datetime import datetime

def log_panggilan(fungsi):
    """Log setiap kali fungsi dipanggil."""
    @functools.wraps(fungsi)  # Pertahankan nama & docstring fungsi asli
    def wrapper(*args, **kwargs):
        waktu = datetime.now().strftime("%H:%M:%S")
        print(f"[{waktu}] 📝 Memanggil '{fungsi.__name__}' "
              f"dengan args={args}, kwargs={kwargs}")
        
        try:
            hasil = fungsi(*args, **kwargs)
            print(f"[{waktu}] ✅ '{fungsi.__name__}' selesai → {hasil}")
            return hasil
        except Exception as e:
            print(f"[{waktu}] ❌ '{fungsi.__name__}' error: {e}")
            raise
    
    return wrapper


@log_panggilan
def tambah(a, b):
    """Tambahkan dua angka."""
    return a + b

@log_panggilan
def bagi(a, b):
    """Bagi dua angka."""
    return a / b


tambah(5, 3)
tambah(10, 20)
bagi(10, 2)
bagi(5, 0)    # Akan error, tapi ter-log!
\`\`\`

---

## ⏱️ Use Case 2: Timer Performance

\`\`\`python
import functools
import time

def ukur_waktu(fungsi):
    """Ukur waktu eksekusi fungsi."""
    @functools.wraps(fungsi)
    def wrapper(*args, **kwargs):
        mulai = time.perf_counter()
        hasil = fungsi(*args, **kwargs)
        selesai = time.perf_counter()
        durasi = selesai - mulai
        
        print(f"⏱️  '{fungsi.__name__}' selesai dalam {durasi:.6f} detik")
        return hasil
    
    return wrapper


@ukur_waktu
def hitung_fibonacci(n):
    """Hitung fibonacci ke-n secara rekursif (lambat)."""
    if n <= 1:
        return n
    return hitung_fibonacci(n-1) + hitung_fibonacci(n-2)

@ukur_waktu
def hitung_fibonacci_cepat(n):
    """Hitung fibonacci ke-n secara iteratif (cepat)."""
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b


print(hitung_fibonacci(30))        # Lambat!
print(hitung_fibonacci_cepat(30))  # Instan!
\`\`\`

---

## 🔐 Use Case 3: Autentikasi & Autorisasi

\`\`\`python
import functools

# Simulasi session user
session = {"user_id": None, "role": None}

def login(user_id, role):
    session["user_id"] = user_id
    session["role"]    = role

def logout():
    session["user_id"] = None
    session["role"]    = None

def butuh_login(fungsi):
    """Decorator: fungsi hanya bisa diakses jika sudah login."""
    @functools.wraps(fungsi)
    def wrapper(*args, **kwargs):
        if not session["user_id"]:
            print("❌ Akses ditolak: Harap login terlebih dahulu!")
            return None
        return fungsi(*args, **kwargs)
    return wrapper

def butuh_role(*role_yang_diizinkan):
    """Decorator dengan argumen: cek role user."""
    def decorator(fungsi):
        @functools.wraps(fungsi)
        def wrapper(*args, **kwargs):
            if not session["user_id"]:
                print("❌ Belum login!")
                return None
            if session["role"] not in role_yang_diizinkan:
                print(f"❌ Role '{session['role']}' tidak punya akses!")
                return None
            return fungsi(*args, **kwargs)
        return wrapper
    return decorator


@butuh_login
def lihat_profil():
    print(f"✅ Profil user #{session['user_id']}")

@butuh_role("admin", "moderator")
def hapus_komentar(komentar_id):
    print(f"✅ Komentar #{komentar_id} dihapus oleh {session['role']}")

@butuh_role("admin")
def akses_panel_admin():
    print("✅ Selamat datang di panel admin!")


# Test
print("=== Tanpa Login ===")
lihat_profil()
hapus_komentar(42)

print("\\n=== Login sebagai User Biasa ===")
login(1, "user")
lihat_profil()
hapus_komentar(42)   # Ditolak

print("\\n=== Login sebagai Admin ===")
login(2, "admin")
lihat_profil()
hapus_komentar(42)
akses_panel_admin()
\`\`\`

---

## 💾 Use Case 4: Caching (Memoization)

\`\`\`python
import functools

def cache_hasil(fungsi):
    """Cache hasil fungsi agar tidak dihitung ulang."""
    simpan = {}
    
    @functools.wraps(fungsi)
    def wrapper(*args):
        if args not in simpan:
            print(f"🔄 Hitung {fungsi.__name__}{args}...")
            simpan[args] = fungsi(*args)
        else:
            print(f"📦 Dari cache: {fungsi.__name__}{args}")
        return simpan[args]
    
    wrapper.cache = simpan   # Akses cache dari luar
    return wrapper


@cache_hasil
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)


fibonacci(10)
fibonacci(10)   # Dari cache, instan!
fibonacci(12)   # Hanya perlu hitung 11 dan 12, sisanya dari cache
print(f"Cache berisi {len(fibonacci.cache)} nilai")

# Python sudah punya lru_cache bawaan!
from functools import lru_cache

@lru_cache(maxsize=128)
def fib_builtin(n):
    if n <= 1:
        return n
    return fib_builtin(n-1) + fib_builtin(n-2)
\`\`\`

---

## 🔗 Menggabungkan Beberapa Decorator

\`\`\`python
@log_panggilan       # Dijalankan paling luar (terakhir)
@ukur_waktu          # Dijalankan kedua
@butuh_login         # Dijalankan pertama
def operasi_penting(nilai):
    """Operasi yang butuh login, diukur waktu, dan di-log."""
    return nilai ** 2

# Sama dengan: log_panggilan(ukur_waktu(butuh_login(operasi_penting)))
\`\`\`

---

## 🏷️ Class Decorator

\`\`\`python
class RateLimiter:
    """Batasi berapa kali fungsi bisa dipanggil dalam periode tertentu."""
    
    def __init__(self, maks_panggilan=5, per_detik=60):
        self.maks = maks_panggilan
        self.periode = per_detik
        self.catatan = []
    
    def __call__(self, fungsi):
        @functools.wraps(fungsi)
        def wrapper(*args, **kwargs):
            sekarang = time.time()
            
            # Bersihkan catatan lama
            self.catatan = [t for t in self.catatan if sekarang - t < self.periode]
            
            if len(self.catatan) >= self.maks:
                sisa = self.periode - (sekarang - self.catatan[0])
                print(f"⏳ Rate limit! Tunggu {sisa:.0f} detik")
                return None
            
            self.catatan.append(sekarang)
            return fungsi(*args, **kwargs)
        return wrapper


@RateLimiter(maks_panggilan=3, per_detik=10)
def kirim_email(penerima):
    print(f"📧 Email dikirim ke {penerima}")

kirim_email("a@email.com")
kirim_email("b@email.com")
kirim_email("c@email.com")
kirim_email("d@email.com")  # Rate limited!
\`\`\`

---

## 📝 Ringkasan

- Decorator = fungsi yang membungkus fungsi lain dengan fungsionalitas tambahan
- \`@nama_decorator\` adalah sintaksis shortcut untuk \`fungsi = decorator(fungsi)\`
- Gunakan \`@functools.wraps(fungsi)\` agar nama dan docstring asli tetap terjaga
- \`*args, **kwargs\` untuk meneruskan semua argumen ke fungsi asli
- Decorator populer: logging, timing, caching, autentikasi, rate limiting
- Decorator bisa menerima argumen: \`@decorator(param)\` → fungsi mengembalikan decorator

> **Di pelajaran berikutnya, kita belajar Asynchronous Programming — cara membuat Python berjalan lebih efisien untuk tugas I/O!** ⚡
`;
