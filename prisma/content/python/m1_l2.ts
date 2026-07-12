export const lesson2 = `
# Instalasi & Setup Lingkungan Python

Sebelum nulis kode, kita perlu satu hal dulu: setup "dapur" tempat kode Python akan berjalan.

Ada dua komponen yang dibutuhkan:
1. **Python Interpreter** — yang menjalankan kode kamu
2. **Code Editor** — tempat kamu nulis kode

---

## 📥 Install Python

### Windows

1. Buka **python.org/downloads**
2. Klik tombol "Download Python 3.x.x"
3. Jalankan installer
4. ⚠️ **PENTING:** Centang **"Add Python to PATH"** sebelum klik Install Now!

\`\`\`
┌─────────────────────────────────────┐
│  Python 3.x Installer               │
│                                     │
│  ○ Install Now                      │
│                                     │
│  ☑ Add Python to PATH  ← CENTANG!  │
└─────────────────────────────────────┘
\`\`\`

Kalau lupa centang ini, Python tidak bisa dipanggil dari terminal. Harus install ulang.

### macOS

\`\`\`bash
# Cara termudah: via Homebrew
brew install python3
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
sudo apt update && sudo apt install python3 python3-pip
\`\`\`

---

## ✅ Langkah 2: Verifikasi Instalasi

Buka **Terminal** (CMD di Windows, Terminal di Mac/Linux) dan ketik:

\`\`\`bash
python --version
# atau jika tidak bekerja:
python3 --version
\`\`\`

**Output yang diharapkan:**
\`\`\`
Python 3.11.5
\`\`\`

Jika muncul versi Python, instalasi berhasil! 🎉

Jika muncul error seperti "python not found" → kemungkinan lupa centang "Add to PATH" saat install.

---

## ✏️ Langkah 3: Pilih Code Editor (IDE)

### Opsi 1: VS Code (Rekomendasi untuk Pemula) ⭐

**Visual Studio Code** adalah editor gratis yang paling populer di dunia saat ini.

**Cara setup:**
1. Download dari **code.visualstudio.com**
2. Install extension **Python** oleh Microsoft
3. Buka Command Palette (Ctrl+Shift+P) → "Python: Select Interpreter"
4. Pilih Python yang baru Anda install

**Fitur berguna VS Code untuk Python:**
- ✅ Autocomplete cerdas (IntelliSense)
- ✅ Highlight error sebelum kode dijalankan
- ✅ Debugger visual (bisa pause kode, lihat nilai variabel)
- ✅ Terminal terintegrasi

### Opsi 2: PyCharm

IDE khusus Python buatan JetBrains. Lebih lengkap tapi lebih berat.
- **PyCharm Community** = Gratis
- **PyCharm Professional** = Berbayar (ada fitur web dev)

Cocok untuk: Developer yang fokus 100% pada Python.

### Opsi 3: Jupyter Notebook

Bukan editor biasa, tapi "notebook" interaktif — kode dan hasil langsung muncul berdampingan.

\`\`\`bash
pip install jupyter
jupyter notebook
\`\`\`

Cocok untuk: Data Science, analisis data, belajar dengan eksperimen cepat.

### Opsi 4: Google Colab (Tanpa Install!)

Jika tidak mau repot install apapun, gunakan **Google Colab** (colab.research.google.com) — Jupyter Notebook yang berjalan di cloud Google. Gratis, hanya butuh akun Google!

---

## 🚀 Langkah 4: Jalankan Program Python Pertama

### Cara 1: Via Terminal

\`\`\`bash
# Buat file baru
# (Di Windows: buka Notepad, ketik kode, simpan sebagai hello.py)
# (Di Mac/Linux: gunakan nano atau vim)

# Jalankan file
python hello.py
\`\`\`

Isi file **hello.py:**
\`\`\`python
print("Halo dari Python!")
nama = "Programmer"
print(f"Selamat datang, {nama}!")
\`\`\`

**Output:**
\`\`\`
Halo dari Python!
Selamat datang, Programmer!
\`\`\`

### Cara 2: Python Interactive Shell (REPL)

Ketik \`python\` di terminal tanpa nama file → masuk ke mode interaktif:

\`\`\`bash
$ python
Python 3.11.5
>>> print("Langsung muncul!")
Langsung muncul!
>>> 2 + 3
5
>>> nama = "Budi"
>>> print(nama)
Budi
>>> exit()  # keluar dari shell
\`\`\`

REPL (Read-Eval-Print Loop) sangat berguna untuk eksperimen cepat tanpa perlu buat file.

### Cara 3: Langsung di VS Code

1. Buka VS Code
2. Buat file baru dengan ekstensi \`.py\`
3. Ketik kode
4. Klik tombol ▶ (Run) di pojok kanan atas, atau tekan **F5**

---

## 📦 Mengenal pip — Manajer Paket Python

pip adalah alat untuk menginstall library Python dari internet. Seperti App Store, tapi untuk library coding.

\`\`\`bash
# Install library
pip install requests

# Install versi spesifik
pip install requests==2.31.0

# Lihat library yang terinstall
pip list

# Hapus library
pip uninstall requests

# Export daftar library (untuk berbagi ke orang lain)
pip freeze > requirements.txt

# Install dari daftar yang sudah ada
pip install -r requirements.txt
\`\`\`

---

## 🗂️ Virtual Environment — Dapur Terpisah per Proyek

Analogi: bayangkan punya **dapur terpisah** untuk setiap proyek. Bumbu di dapur A tidak mencampur dengan dapur B.

Virtual Environment memastikan library tiap proyek tidak saling tabrakan.

\`\`\`bash
# Buat virtual environment di folder proyek
python -m venv venv

# Aktifkan (Windows)
venv\\Scripts\\activate

# Aktifkan (Mac/Linux)
source venv/bin/activate

# Prompt berubah, tandanya venv aktif:
# (venv) C:\\Users\\Anda\\ProyekSaya>

# Install library (hanya berlaku di venv ini)
pip install django

# Nonaktifkan venv
deactivate
\`\`\`

> 💡 **Kebiasaan baik**: Selalu buat virtual environment untuk setiap proyek Python!

---

## ⚡ Quick Checklist Setup

- [ ] Python 3.10+ terinstall (\`python --version\` menampilkan versi)
- [ ] pip berfungsi (\`pip --version\`)
- [ ] Code editor terpilih (VS Code direkomendasikan)
- [ ] Extension Python terinstall di VS Code
- [ ] Bisa menjalankan file \`.py\` pertama

---

## 📝 Ringkasan

- Install Python dari python.org, **jangan lupa centang "Add to PATH"**
- VS Code adalah editor terbaik untuk pemula Python
- \`python namafile.py\` untuk menjalankan program
- pip untuk install library eksternal
- Virtual environment untuk isolasi dependensi per proyek

> **Lingkungan sudah siap! Di pelajaran berikutnya, kita mulai belajar variabel dan tipe data — fondasi dari semua program Python.** 💡
`;
