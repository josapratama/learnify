export const linux_l1 = `
# Apa itu Linux? — Sistem Operasi Gratis yang Menguasai Dunia

## 🏠 Analogi: Linux Seperti Rumah yang Bisa Direnovasi Total

Bayangkan dua pilihan rumah:

**Windows/macOS** = Apartemen mewah siap huni. Fasilitas lengkap, tampilan bagus, tapi ada aturan ketat: tidak boleh renovasi dinding, tidak boleh ganti pipa, tidak boleh tahu ada apa di dalam tembok. Jika ada masalah, tunggu tukang dari perusahaan.

**Linux** = Kavling tanah dengan gambar denah terbuka. Anda bisa bangun seperti yang Anda mau, ubah apapun, lihat semua detail konstruksi. Komunitas jutaan orang siap membantu. Dan **semuanya GRATIS**.

Itulah Linux — sistem operasi open source yang bisa dimodifikasi siapa saja.

---

## � Linux Menguasai Dunia (Tanpa Kita Sadari)

Mungkin Anda tidak pakai Linux di laptop, tapi Anda pakai Linux setiap hari:

| Platform | Menggunakan Linux |
|----------|------------------|
| 🌐 Server website (Google, Facebook, Amazon) | ✅ ~96% server |
| 📱 Smartphone Android | ✅ Kernel Linux |
| ☁️ Cloud (AWS, GCP, Azure) | ✅ Mayoritas |
| 🚀 Roket SpaceX | ✅ Linux |
| 🌍 Stasiun Luar Angkasa ISS | ✅ Linux |
| � ATM & sistem perbankan | ✅ Banyak yang Linux |
| 🤖 Supercomputer (500 terkuat) | ✅ 100% Linux |

---

## 🐧 Sejarah Singkat Linux

\`\`\`
1969 — UNIX dibuat di Bell Labs (AT&T)
1983 — Richard Stallman mulai proyek GNU (tools open source)
1991 — Linus Torvalds (mahasiswa Finlandia, 21 tahun) buat kernel Linux
         "Saya membuat sistem operasi gratis (hanya hobi, tidak profesional)"
2003 — Red Hat Enterprise Linux (RHEL) dirilis untuk bisnis
2004 — Ubuntu diluncurkan — Linux yang mudah untuk pemula
2008 — Android (berbasis Linux) dirilis Google
Kini  — Linux ada di mana-mana
\`\`\`

---

## 🍃 Distribusi Linux (Distro)

Linux bukan satu produk — ada ratusan "varian" yang disebut distribusi:

### Untuk Pemula
| Distro | Keterangan | Cocok Untuk |
|--------|-----------|-------------|
| **Ubuntu** | Paling populer, komunitas besar | Semua orang |
| **Linux Mint** | Mirip Windows, transisi mudah | Pindahan dari Windows |
| **Elementary OS** | Mirip macOS, cantik | Pindahan dari macOS |
| **Pop!_OS** | Cepat, cocok gaming | Gamer, developer |

### Untuk Menengah
| Distro | Keterangan |
|--------|-----------|
| **Fedora** | Terdepan teknologi, Red Hat berbasis |
| **Debian** | Stabil, fondasi Ubuntu |
| **openSUSE** | Populer di Eropa |

### Untuk Expert
| Distro | Keterangan |
|--------|-----------|
| **Arch Linux** | Install dari nol, kontrol penuh |
| **Gentoo** | Kompilasi semua dari source code |
| **NixOS** | Reproducible, deklaratif |

### Khusus Tujuan
| Distro | Tujuan |
|--------|--------|
| **Kali Linux** | Keamanan siber & penetration testing |
| **Tails** | Privasi maksimal, anonymous |
| **Raspbian/PiOS** | Raspberry Pi |
| **Ubuntu Server** | Server tanpa GUI |

---

## 🖥️ GUI vs CLI — Dua Cara Berinteraksi

### GUI (Graphical User Interface)
Tampilan grafis dengan ikon, menu, dan mouse — seperti Windows/macOS.
Linux punya banyak pilihan "desktop environment":

\`\`\`
GNOME    → Modern, clean (Ubuntu default)
KDE      → Sangat customizable, mirip Windows
XFCE     → Ringan, cocok hardware lama
LXDE     → Super ringan
Cinnamon → Klasik, mirip Windows (Linux Mint)
\`\`\`

### CLI (Command Line Interface)
Terminal — ketik perintah, lihat output teks. Terlihat menakutkan, tapi inilah **kekuatan sejati Linux**.

\`\`\`bash
# Contoh: Lihat isi folder
ls -la /home/budi

# Output:
total 48
drwxr-xr-x 6 budi budi 4096 Jun  5 10:30 .
drwxr-xr-x 3 root root 4096 Jun  1 09:00 ..
-rw-r--r-- 1 budi budi  220 Jun  1 09:00 .bash_logout
-rw-r--r-- 1 budi budi 3526 Jun  1 09:00 .bashrc
drwxr-xr-x 2 budi budi 4096 Jun  5 10:30 Documents
drwxr-xr-x 2 budi budi 4096 Jun  5 10:30 Downloads
\`\`\`

---

## ❓ Mengapa Belajar Linux?

### Untuk Non-IT
- 🔒 **Lebih aman** — virus Windows tidak jalan di Linux
- 💰 **Gratis total** — tidak perlu beli lisensi
- ♻️ **Hidupkan PC lama** — Linux bisa jalan di hardware 10 tahun lalu
- 🎓 **Belajar komputer lebih dalam** — pahami cara kerja sistem

### Untuk IT/Developer
- 🖥️ **Server production** — 96% server di dunia pakai Linux
- 🐳 **Docker & Kubernetes** — berjalan native di Linux
- 📊 **Data Science** — banyak tools ML berjalan optimal di Linux
- � **DevOps** — CI/CD, automation semua berbasis Linux shell
- 💼 **Karir** — hampir semua posisi teknik butuh skill Linux

---

## �️ Arsitektur Linux

\`\`\`
┌─────────────────────────────────────────┐
│        Aplikasi Pengguna                │  ← Browser, Editor, dll
├─────────────────────────────────────────┤
│        Shell (bash/zsh/fish)            │  ← Antarmuka teks
├─────────────────────────────────────────┤
│        GNU Tools & Libraries            │  ← ls, grep, glibc, dll
├─────────────────────────────────────────┤
│        Linux Kernel                     │  ← Inti sistem operasi
│  (Proses, Memori, Filesystem, Driver)   │
├─────────────────────────────────────────┤
│        Hardware                         │  ← CPU, RAM, Disk, dll
└─────────────────────────────────────────┘
\`\`\`

**Kernel** = jantung Linux, dibuat Linus Torvalds, mengelola hardware
**Shell** = penerjemah antara Anda dan kernel
**GNU Tools** = perintah-perintah yang Anda ketik (ls, grep, dll)

---

## 📂 Struktur Filesystem Linux

Berbeda dari Windows (C:\\, D:\\), Linux punya satu pohon direktori:

\`\`\`
/ (root — paling atas)
├── bin/     → Program penting (ls, cp, mv)
├── boot/    → File untuk booting
├── dev/     → Device files (disk, USB)
├── etc/     → File konfigurasi sistem
├── home/    → Folder pengguna (/home/budi, /home/ani)
├── lib/     → Library sistem
├── media/   → Mount point USB, CD
├── mnt/     → Mount point manual
├── opt/     → Aplikasi tambahan
├── proc/    → Info proses (virtual filesystem)
├── root/    → Home folder root user
├── srv/     → Data server
├── tmp/     → File sementara (terhapus saat reboot)
├── usr/     → Program pengguna
│   ├── bin/ → Aplikasi (Firefox, VSCode)
│   └── lib/ → Library aplikasi
└── var/     → Data variabel (log, database)
    └── log/ → File log sistem
\`\`\`

---

## � Ringkasan

- Linux = sistem operasi open source, gratis, bisa dimodifikasi bebas
- 96% server dunia pakai Linux — skill Linux = skill yang sangat dibutuhkan
- Ada ratusan distribusi (distro), Ubuntu paling ramah pemula
- Dua cara berinteraksi: GUI (grafis) dan CLI (terminal)
- Filesystem Linux: satu pohon dimulai dari \`/\`

> **Di pelajaran berikutnya, kita install Ubuntu dan buka terminal pertama kali!** 🖥️
`;
