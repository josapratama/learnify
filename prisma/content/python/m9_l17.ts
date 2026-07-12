export const lesson17 = `
# Berinteraksi dengan Web API

Di pelajaran sebelumnya kita sudah belajar cara fetch data dari internet menggunakan \`requests\`. Sekarang kita masuk lebih dalam: cara kerja API, autentikasi, error handling yang tepat, dan beberapa contoh API nyata yang bisa langsung dicoba.

API adalah cara program "berbicara" satu sama lain lewat internet. Setiap aplikasi modern — cuaca, maps, media sosial, pembayaran — punya API. Dan Python dengan library \`requests\` bisa mengaksesnya semua.

\`\`\`bash
pip install requests
\`\`\`

---

## 📥 HTTP GET — Ambil Data

\`\`\`python
import requests

# GitHub API — bebas, tidak perlu API key
url = "https://api.github.com/users/torvalds"
response = requests.get(url)

print(f"Status: {response.status_code}")
# 200 = OK, 404 = Not Found, 500 = Server Error

if response.status_code == 200:
    data = response.json()   # Parse JSON otomatis
    print(f"Nama     : {data['name']}")
    print(f"Bio      : {data['bio']}")
    print(f"Followers: {data['followers']:,}")
else:
    print(f"Gagal: {response.status_code}")
\`\`\`

---

## 🔐 API dengan Parameter & Header

\`\`\`python
# GET dengan query parameters
params = {
    "q"       : "python programming",
    "language": "Indonesian",
    "page"    : 1
}

# Cara 1: Manual (kurang baik)
url_manual = "https://api.contoh.com/search?q=python&language=Indonesian"

# Cara 2: Pakai params (lebih baik — auto URL encode!)
response = requests.get("https://api.contoh.com/search", params=params)
print(response.url)  # Lihat URL yang dibentuk

# API yang butuh autentikasi — pakai header
API_KEY = "rahasia-api-key-anda"  # Jangan hardcode di kode produksi!
headers = {
    "Authorization" : f"Bearer {API_KEY}",
    "Content-Type"  : "application/json",
    "Accept"        : "application/json"
}

response = requests.get("https://api.berbayar.com/data",
                        headers=headers,
                        params=params,
                        timeout=10)  # Timeout 10 detik
\`\`\`

---

## 📤 HTTP POST — Mengirim Data

\`\`\`python
import requests

# Kirim data form (JSON)
url      = "https://jsonplaceholder.typicode.com/posts"
payload  = {
    "title"  : "Belajar API Python",
    "body"   : "API sangat berguna untuk integrasi sistem.",
    "userId" : 1
}

response = requests.post(url, json=payload)  # json= otomatis set Content-Type

if response.status_code == 201:  # 201 = Created
    hasil = response.json()
    print(f"Post dibuat dengan ID: {hasil['id']}")
else:
    print(f"Gagal: {response.status_code} - {response.text}")

# PUT — Update data
response = requests.put(
    f"{url}/1",
    json={"title": "Judul Baru", "body": "Konten baru", "userId": 1}
)

# DELETE — Hapus data
response = requests.delete(f"{url}/1")
print(f"Delete status: {response.status_code}")  # 200 = OK
\`\`\`

---

## 🛡️ Error Handling untuk API

\`\`\`python
import requests
from requests.exceptions import (
    ConnectionError, Timeout, HTTPError, RequestException
)

def panggil_api(url, params=None, timeout=10):
    """
    Wrapper fungsi API call dengan error handling lengkap.
    """
    try:
        response = requests.get(url, params=params, timeout=timeout)
        
        # Raise exception untuk status 4xx dan 5xx
        response.raise_for_status()
        
        return response.json()
    
    except Timeout:
        print(f"❌ Timeout: Server tidak merespons dalam {timeout} detik")
    except ConnectionError:
        print("❌ Koneksi gagal: Periksa koneksi internet Anda")
    except HTTPError as e:
        status = e.response.status_code
        if status == 401:
            print("❌ Unauthorized: API key tidak valid")
        elif status == 403:
            print("❌ Forbidden: Tidak ada izin akses")
        elif status == 404:
            print("❌ Not Found: Endpoint tidak ditemukan")
        elif status == 429:
            print("❌ Rate Limit: Terlalu banyak request, tunggu sebentar")
        elif status >= 500:
            print(f"❌ Server Error ({status}): Masalah di sisi server")
        else:
            print(f"❌ HTTP Error {status}: {e}")
    except RequestException as e:
        print(f"❌ Error tidak terduga: {e}")
    
    return None  # Kembalikan None jika ada error


# Penggunaan
data = panggil_api("https://api.github.com/users/python")
if data:
    print(f"Python org followers: {data.get('followers', 'N/A')}")
\`\`\`

---

## 💱 Contoh Nyata: API Kurs Mata Uang

\`\`\`python
import requests

def ambil_kurs(base="USD", target="IDR"):
    """Ambil kurs mata uang real-time."""
    # API gratis tanpa key: exchangerate-api atau frankfurter
    url = f"https://api.frankfurter.app/latest?from={base}&to={target}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data["rates"][target]
    except Exception as e:
        print(f"Error ambil kurs: {e}")
        return None

def konversi_mata_uang(jumlah, dari, ke):
    """Konversi mata uang."""
    kurs = ambil_kurs(dari, ke)
    if kurs:
        hasil = jumlah * kurs
        print(f"{jumlah:,.0f} {dari} = {hasil:,.2f} {ke}")
        print(f"(Kurs: 1 {dari} = {kurs:,.4f} {ke})")
        return hasil
    return None

# Demo konversi
konversi_mata_uang(100, "USD", "IDR")
konversi_mata_uang(1,   "EUR", "IDR")
konversi_mata_uang(500_000, "JPY", "IDR")
\`\`\`

---

## 🌦️ Contoh Nyata: API Cuaca

\`\`\`python
import requests
import os

def ambil_cuaca(kota):
    """
    Ambil data cuaca kota menggunakan OpenWeatherMap API.
    Daftar gratis di openweathermap.org untuk dapat API key.
    """
    API_KEY = os.getenv("OPENWEATHER_API_KEY", "demo-key")
    url     = "https://api.openweathermap.org/data/2.5/weather"
    
    params = {
        "q"     : kota,
        "appid" : API_KEY,
        "units" : "metric",   # Celsius
        "lang"  : "id"        # Bahasa Indonesia
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        return {
            "kota"       : data["name"],
            "negara"     : data["sys"]["country"],
            "suhu"       : data["main"]["temp"],
            "terasa_spt" : data["main"]["feels_like"],
            "kelembapan" : data["main"]["humidity"],
            "cuaca"      : data["weather"][0]["description"],
            "angin"      : data["wind"]["speed"]
        }
    except Exception as e:
        print(f"Gagal ambil cuaca: {e}")
        return None

def tampilkan_cuaca(info):
    if not info:
        return
    
    print(f"\\n🌤️ Cuaca di {info['kota']}, {info['negara']}")
    print(f"{'='*35}")
    print(f"  Suhu        : {info['suhu']}°C (terasa {info['terasa_spt']}°C)")
    print(f"  Kondisi     : {info['cuaca'].capitalize()}")
    print(f"  Kelembapan  : {info['kelembapan']}%")
    print(f"  Kecepatan Angin: {info['angin']} m/s")

info = ambil_cuaca("Jakarta")
tampilkan_cuaca(info)
\`\`\`

---

## 💾 Cache API Response untuk Efisiensi

\`\`\`python
import json
import time
from pathlib import Path

class APICache:
    """Cache sederhana untuk respons API."""
    
    def __init__(self, durasi_menit=60):
        self.durasi   = durasi_menit * 60  # Konversi ke detik
        self.cache_dir = Path("cache")
        self.cache_dir.mkdir(exist_ok=True)
    
    def get(self, kunci):
        """Ambil dari cache jika masih valid."""
        file = self.cache_dir / f"{kunci}.json"
        if file.exists():
            data = json.loads(file.read_text())
            if time.time() - data["timestamp"] < self.durasi:
                return data["value"]
        return None
    
    def set(self, kunci, nilai):
        """Simpan ke cache."""
        file = self.cache_dir / f"{kunci}.json"
        file.write_text(json.dumps({
            "timestamp": time.time(),
            "value": nilai
        }))

# Penggunaan dengan cache
cache = APICache(durasi_menit=30)

def ambil_data_dengan_cache(url):
    hasil = cache.get(url)
    if hasil:
        print("📦 Dari cache")
        return hasil
    
    print("🌐 Fetch dari API...")
    response = requests.get(url)
    data     = response.json()
    cache.set(url, data)
    return data
\`\`\`

---

## 📝 Ringkasan

- \`requests.get()\`, \`requests.post()\`, \`requests.put()\`, \`requests.delete()\` untuk HTTP methods
- \`response.json()\` untuk parse respons JSON
- Gunakan \`params=\` untuk query parameter, \`headers=\` untuk autentikasi
- Selalu tangkap exception: \`Timeout\`, \`ConnectionError\`, \`HTTPError\`
- \`response.raise_for_status()\` untuk raise exception pada status 4xx/5xx
- Jangan hardcode API key — gunakan environment variable!
- Cache respons API untuk hemat bandwidth dan kuota

> **Di pelajaran berikutnya, kita belajar cara membangun web backend sendiri menggunakan Python!** ⚙️
`;
