export const python_expert_l2 = `
# Asynchronous Programming dengan Asyncio

Kamu mungkin pernah lihat kode Python yang pakai \`async\` dan \`await\` dan bertanya-tanya: untuk apa ini?

Jawabannya: **efisiensi saat menunggu**.

Bayangkan kamu harus download 10 file dari internet. Secara sinkron, kamu download satu per satu — total waktu = 10 × waktu download. Secara async, kamu mulai semua download sekaligus — total waktu = waktu download yang paling lambat.

Ini yang membuat web server async bisa handle ribuan request bersamaan tanpa butuh ribuan thread.

---

## 🤔 Kapan Pakai Async?

Async berguna untuk **I/O bound tasks** — tugas yang banyak MENUNGGU:
- HTTP request ke API
- Query database
- Baca/tulis file besar
- Kirim/terima pesan

**Tidak berguna untuk CPU-bound** (perhitungan berat):
- Kompresi video
- Machine learning training
- Enkripsi kompleks

---

## 🔑 Konsep Dasar

\`\`\`python
import asyncio

# 'async def' mendefinisikan coroutine
async def fungsi_async():
    await asyncio.sleep(1)   # 'await' = tunggu ini, tapi boleh lakukan hal lain dulu
    return "Selesai!"

# Entry point
async def main():
    hasil = await fungsi_async()
    print(hasil)

asyncio.run(main())
\`\`\`

---

## ⏱️ Perbandingan Sinkron vs Asinkron

\`\`\`python
import asyncio
import time
import requests

# ============================================
# CARA SINKRON — Satu per satu
# ============================================
def download_sinkron(url, nama):
    """Download biasa — blocking."""
    print(f"🔄 Mulai download {nama}...")
    # Simulasi download dengan sleep
    time.sleep(2)   # Bayangkan ini request.get() yang butuh 2 detik
    print(f"✅ Selesai download {nama}")
    return f"data_{nama}"

def main_sinkron():
    mulai = time.time()
    
    hasil1 = download_sinkron("https://api1.com/data", "File_A")
    hasil2 = download_sinkron("https://api2.com/data", "File_B")
    hasil3 = download_sinkron("https://api3.com/data", "File_C")
    
    selesai = time.time()
    print(f"\\n⏱️  Total waktu SINKRON: {selesai-mulai:.1f} detik")
    # Butuh ~6 detik (3 × 2 detik)


# ============================================
# CARA ASINKRON — Bersamaan!
# ============================================
async def download_async(url, nama):
    """Download async — non-blocking."""
    print(f"🔄 Mulai download {nama}...")
    await asyncio.sleep(2)   # Non-blocking! Program bisa lakukan hal lain
    print(f"✅ Selesai download {nama}")
    return f"data_{nama}"

async def main_async():
    mulai = time.time()
    
    # gather() = jalankan SEMUA sekaligus, tunggu semua selesai
    hasil1, hasil2, hasil3 = await asyncio.gather(
        download_async("https://api1.com/data", "File_A"),
        download_async("https://api2.com/data", "File_B"),
        download_async("https://api3.com/data", "File_C"),
    )
    
    selesai = time.time()
    print(f"\\n⏱️  Total waktu ASYNC: {selesai-mulai:.1f} detik")
    # Butuh hanya ~2 detik (3 download bersamaan!)


# Jalankan keduanya untuk perbandingan
print("=== SINKRON ===")
main_sinkron()

print("\\n=== ASINKRON ===")
asyncio.run(main_async())
\`\`\`

**Output:**
\`\`\`
=== SINKRON ===
🔄 Mulai download File_A...
✅ Selesai download File_A
🔄 Mulai download File_B...
✅ Selesai download File_B
🔄 Mulai download File_C...
✅ Selesai download File_C
⏱️  Total waktu SINKRON: 6.0 detik

=== ASINKRON ===
🔄 Mulai download File_A...
🔄 Mulai download File_B...
🔄 Mulai download File_C...
✅ Selesai download File_A
✅ Selesai download File_B
✅ Selesai download File_C
⏱️  Total waktu ASYNC: 2.0 detik
\`\`\`

---

## 🌐 HTTP Async dengan aiohttp

\`\`\`bash
pip install aiohttp
\`\`\`

\`\`\`python
import asyncio
import aiohttp
import time

async def ambil_user(session, user_id):
    """Ambil data user dari API secara async."""
    url = f"https://jsonplaceholder.typicode.com/users/{user_id}"
    
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
            if response.status == 200:
                data = await response.json()
                return {"id": user_id, "nama": data["name"], "email": data["email"]}
            return {"id": user_id, "error": f"Status {response.status}"}
    except Exception as e:
        return {"id": user_id, "error": str(e)}

async def ambil_semua_user(user_ids: list):
    """Ambil banyak user sekaligus."""
    async with aiohttp.ClientSession() as session:
        # Buat semua task sekaligus
        tasks = [ambil_user(session, uid) for uid in user_ids]
        
        # Jalankan semua dan tunggu
        results = await asyncio.gather(*tasks)
    
    return results

async def main():
    mulai = time.time()
    
    user_ids = list(range(1, 11))   # User ID 1-10
    print(f"Mengambil {len(user_ids)} user sekaligus...")
    
    users = await ambil_semua_user(user_ids)
    
    for user in users:
        if "error" not in user:
            print(f"  {user['id']:2}. {user['nama']:<25} {user['email']}")
    
    print(f"\\n⏱️  {len(users)} user diambil dalam {time.time()-mulai:.2f} detik")

asyncio.run(main())
\`\`\`

---

## 🔄 Tasks — Jalankan Background Tanpa Menunggu

\`\`\`python
async def task_lama(nama, durasi):
    print(f"  [{nama}] Mulai...")
    await asyncio.sleep(durasi)
    print(f"  [{nama}] Selesai setelah {durasi}s")
    return nama

async def main():
    print("Membuat tasks...")
    
    # Buat tasks — tidak langsung menunggu!
    task1 = asyncio.create_task(task_lama("Task-A", 3))
    task2 = asyncio.create_task(task_lama("Task-B", 1))
    task3 = asyncio.create_task(task_lama("Task-C", 2))
    
    print("Tasks dibuat, melakukan hal lain sebentar...")
    await asyncio.sleep(0.5)
    print("Selesai hal lain, menunggu semua task...")
    
    # Sekarang tunggu semua
    hasil1 = await task1
    hasil2 = await task2
    hasil3 = await task3
    
    print(f"Semua selesai: {hasil1}, {hasil2}, {hasil3}")

asyncio.run(main())
# Output: Task-B selesai pertama (1s), lalu Task-C (2s), lalu Task-A (3s)
\`\`\`

---

## 🗄️ Async dengan Database (asyncpg/SQLAlchemy async)

\`\`\`python
import asyncio
import asyncpg

async def setup_database():
    """Contoh operasi database async dengan PostgreSQL."""
    
    conn = await asyncpg.connect(
        host     = "localhost",
        database = "mydb",
        user     = "postgres",
        password = "password"
    )
    
    try:
        # Query async
        rows = await conn.fetch(
            "SELECT id, nama, email FROM users WHERE aktif = $1 LIMIT $2",
            True, 10
        )
        
        for row in rows:
            print(f"User #{row['id']}: {row['nama']} ({row['email']})")
        
        # Insert async
        await conn.execute(
            "INSERT INTO users(nama, email) VALUES($1, $2)",
            "User Baru", "baru@email.com"
        )
        
        print("✅ Data berhasil dimasukkan")
    
    finally:
        await conn.close()

asyncio.run(setup_database())
\`\`\`

---

## 🌐 FastAPI — Framework Async Terbaik

FastAPI sudah async by default — salah satu alasan ia sangat cepat:

\`\`\`python
from fastapi import FastAPI
import asyncio
import aiohttp

app = FastAPI()

@app.get("/cuaca/{kota}")
async def ambil_cuaca(kota: str):
    """Endpoint async — tidak blokir server saat request ke API cuaca."""
    async with aiohttp.ClientSession() as session:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={kota}&appid=KEY"
        async with session.get(url) as resp:
            if resp.status == 200:
                data = await resp.json()
                return {
                    "kota"  : kota,
                    "suhu"  : data["main"]["temp"] - 273.15,
                    "cuaca" : data["weather"][0]["description"]
                }
    return {"error": "Kota tidak ditemukan"}

@app.get("/laporan")
async def laporan_gabungan():
    """Ambil data dari 3 source sekaligus."""
    async with aiohttp.ClientSession() as session:
        user_task  = asyncio.create_task(session.get("https://api.example.com/users"))
        order_task = asyncio.create_task(session.get("https://api.example.com/orders"))
        stock_task = asyncio.create_task(session.get("https://api.example.com/stocks"))
        
        user_resp, order_resp, stock_resp = await asyncio.gather(
            user_task, order_task, stock_task
        )
        
        return {
            "users"  : await user_resp.json(),
            "orders" : await order_resp.json(),
            "stocks" : await stock_resp.json()
        }
\`\`\`

---

## ⚠️ Gotchas & Best Practices

\`\`\`python
# ❌ SALAH: Gunakan blocking I/O dalam async function
async def buruk():
    import requests
    data = requests.get("https://api.com/data")   # BLOCKING! Blokir event loop!
    await asyncio.sleep(1)

# ✅ BENAR: Gunakan library async
async def benar():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.com/data") as resp:
            data = await resp.json()
    await asyncio.sleep(1)

# ❌ SALAH: CPU-intensive task dalam async
async def cpu_buruk():
    hasil = [i**2 for i in range(10_000_000)]   # Blokir event loop!
    return hasil

# ✅ BENAR: Gunakan run_in_executor untuk CPU tasks
async def cpu_benar():
    loop = asyncio.get_event_loop()
    hasil = await loop.run_in_executor(
        None,  # Default ThreadPoolExecutor
        lambda: [i**2 for i in range(10_000_000)]
    )
    return hasil
\`\`\`

---

## 📊 Kapan Pakai Apa?

| Situasi | Pendekatan |
|---------|-----------|
| Download banyak URL | \`asyncio.gather()\` |
| Background task ringan | \`asyncio.create_task()\` |
| CPU-intensive | \`multiprocessing\` atau \`concurrent.futures\` |
| Web framework | FastAPI (async) atau Django (sync) |
| Database query banyak | asyncpg, SQLAlchemy async |
| File I/O besar | \`aiofiles\` |

---

## 📝 Ringkasan

- Async cocok untuk I/O bound — tugas yang banyak menunggu (network, database, file)
- \`async def\` mendefinisikan coroutine, \`await\` untuk menunggu async operation
- \`asyncio.gather()\` menjalankan banyak coroutine secara bersamaan
- \`asyncio.create_task()\` untuk task yang boleh jalan di background
- Jangan gunakan library blocking (requests, psycopg2) dalam kode async!
- FastAPI adalah framework Python yang memanfaatkan async secara penuh
- Speedup signifikan hanya untuk I/O bound — bukan magic bullet untuk semua situasi

---

## 🏆 Anda Telah Menyelesaikan Kursus Python!

Dari \`print("Halo Python!")\` hingga Async Programming dan Decorators — perjalanan yang luar biasa!

**Rangkuman perjalanan Anda:**
- ✅ Dasar Python (variabel, kontrol alir, fungsi)
- ✅ Struktur Data (list, dict, tuple)
- ✅ OOP (class, inheritance, encapsulation)
- ✅ File Handling & Error Handling
- ✅ Data Science (NumPy, Pandas)
- ✅ Web API & Backend Development
- ✅ Advanced: Decorators & Async

Anda sudah memiliki fondasi yang kuat untuk berkarir sebagai Python Developer. Langkah selanjutnya: **bangun proyek nyata, upload ke GitHub, dan mulai apply pekerjaan!**

> **Selamat! Anda adalah seorang Python Developer sekarang.** 🐍🎉
`;
