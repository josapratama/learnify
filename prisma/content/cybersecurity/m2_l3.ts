export const cyber_l3 = `
# Phishing & Social Engineering — Bahaya Terbesar

## Mengapa Phishing adalah Ancaman Nomor Satu?

Jika Anda berpikir hacker adalah orang jenius yang membobol sistem dengan kode kompleks, pikirkan ulang. **95% serangan siber** dimulai dari satu hal sederhana: menipu manusianya, bukan sistemnya.

Phishing dan social engineering adalah seni manipulasi — mengeksploitasi psikologi manusia alih-alih celah teknologi. Tidak ada antivirus atau firewall yang bisa melindungi Anda dari diri sendiri yang tertipu.

**Statistik yang mengkhawatirkan:**
- **1 dari 99 email** adalah phishing
- **30%** pengguna membuka email phishing
- **12%** mengklik link berbahaya di dalamnya
- Kerugian rata-rata per korban phishing di Indonesia: **Rp 5-50 juta**
- Serangan phishing meningkat **61%** setiap tahun

---

## Cara Kerja Phishing

### Siklus Serangan Phishing

\`\`\`
1. RECONNAISSANCE (Pengumpulan Info)
   ↓ Cari target → LinkedIn, media sosial, website perusahaan
   
2. CRAFTING (Pembuatan Jebakan)
   ↓ Buat email/SMS/website palsu yang meyakinkan
   
3. DELIVERY (Pengiriman)
   ↓ Kirim ke target melalui email, SMS, atau media sosial
   
4. EXPLOITATION (Eksploitasi)
   ↓ Korban klik link, masukkan kredensial, atau download file
   
5. HARVEST (Panen)
   ↓ Penyerang dapatkan akses, data, atau uang korban
\`\`\`

### Teknik Psikologis yang Digunakan

Phishing bekerja karena mengeksploitasi kelemahan psikologi manusia:

**1. Urgency (Urgensi)**
"Akun Anda akan ditutup dalam 24 jam jika tidak diverifikasi!"
→ Panik → tindakan cepat tanpa berpikir

**2. Fear (Ketakutan)**
"Aktivitas mencurigakan terdeteksi di akun Anda. Klik di sini segera!"
→ Takut kehilangan → reaksi emosional

**3. Authority (Otoritas)**
"Dari: Direktur Utama BCA — Harap verifikasi segera"
→ Respect terhadap otoritas → kepatuhan

**4. Curiosity (Rasa Ingin Tahu)**
"Anda tercatat dalam daftar pemenang undian. Klik untuk lihat hadiah."
→ FOMO (fear of missing out) → klik tanpa pikir

**5. Greed (Keserakahan)**
"Transfer Rp 10 juta sekarang untuk cairkan warisan Rp 1 miliar"
→ Iming-iming keuntungan besar

**6. Trust/Familiarity (Kepercayaan)**
Email dari "teman" yang minta bantuan transfer darurat
→ Kepercayaan kepada orang dikenal

---

## Jenis-Jenis Phishing

### 1. Email Phishing (Paling Umum)

Email yang menyamar sebagai bank, marketplace, institusi pemerintah, atau layanan yang Anda gunakan.

**Contoh nyata dari Indonesia:**

**Email BRI Palsu:**
\`\`\`
From: info@bri-bank-indonesia.com
Subject: [PENTING] Akun BRImo Anda Perlu Diverifikasi Segera

Kepada Nasabah Yth,

Sistem kami mendeteksi aktivitas tidak biasa pada akun BRImo Anda.
Untuk keamanan, harap verifikasi akun Anda dalam 24 JAM.

Klik link berikut: http://bri-secure-verify.xyz/login

Jika tidak diverifikasi, akun Anda akan DIBLOKIR sementara.

Hormat Kami,
Tim Keamanan BRI
\`\`\`

**Yang perlu dicurigai:**
- Domain pengirim: \`bri-bank-indonesia.com\` (bukan \`bri.co.id\`)
- Urgensi artifisial ("24 JAM", "DIBLOKIR")
- Link ke domain mencurigakan (\`bri-secure-verify.xyz\`)
- Tata bahasa yang agak kaku

### 2. SMS Phishing (Smishing)

SMS berisi link berbahaya atau nomor telepon palsu.

**Contoh smishing yang beredar di Indonesia:**

\`\`\`
BCA: Akun anda diblokir karna ada aktifitas mencurigakan.
Aktifkan segera di: http://bca-verify.info/aktifkan
Atau hub CS kami: 0812-xxxx-xxxx
\`\`\`

\`\`\`
[Shopee] Pesanan #SPX-789123 anda berhasil dibatalkan.
Jika bukan anda, lapor ke: bit.ly/shopee-bantuan-id
\`\`\`

\`\`\`
Selamat! Nomor anda terpilih mendapat hadiah Rp. 50.000.000
dari undian Tokopedia. Klik: tokopedia-hadiah.net/klaim
\`\`\`

**Tanda-tanda smishing:**
- Nomor pengirim bukan nomor resmi (nomor resmi biasanya berupa nama, bukan angka)
- Kata-kata dengan tanda baca/ejaan tidak standar
- Link yang dipersingkat atau domain mencurigakan
- Hadiah tiba-tiba tanpa pernah ikut undian

### 3. Voice Phishing (Vishing)

Penelepon mengaku sebagai petugas bank, OJK, polisi, atau customer service.

**Script umum yang digunakan penipu:**

\`\`\`
Penipu: "Selamat pagi, saya dari tim keamanan BCA. Nama saya
         Budi Santoso. Apakah benar ini dengan Bapak/Ibu [nama]?"

Korban: "Iya, benar."

Penipu: "Kami mendeteksi transaksi mencurigakan dari akun Bapak/Ibu
         sebesar Rp 5 juta ke rekening tidak dikenal. Untuk
         membatalkan transaksi ini, kami butuh verifikasi."

Korban: "Oh, itu bukan saya yang transaksi."

Penipu: "Baik, untuk membatalkan, tolong buka m-banking Bapak/Ibu
         dan beritahu kode OTP yang masuk ke HP Bapak/Ibu."

--- JANGAN LAKUKAN INI ---
OTP = kunci brankas digital Anda. Bank TIDAK PERNAH meminta OTP!
\`\`\`

**Kasus nyata Indonesia:**
Seorang dosen di Yogyakarta kehilangan Rp 350 juta setelah memberikan kode OTP kepada seseorang yang mengaku CS BNI. Penipu sangat profesional, tahu nama lengkap, nama ibu kandung, dan saldo tabungan korban (kemungkinan dari data breach).

### 4. Spear Phishing

Phishing yang ditargetkan khusus, dengan informasi personal korban untuk terlihat lebih meyakinkan.

**Contoh:**
\`\`\`
From: pak.direktur@perusahaan-anda.co.id
Subject: Urgent - Transfer Dana Proyek

Kepada Bagian Keuangan,

Saya sedang dalam rapat dengan klien. Tolong segera transfer
Rp 450 juta ke rekening vendor baru berikut:
Bank BCA, No. Rek: 123-456-7890, a/n PT Mitra Jaya

Ini sangat urgent. Jangan hubungi saya dulu karena saya dalam rapat.
Konfirmasi via email setelah transfer dilakukan.

Salam,
[Nama Direktur]
\`\`\`

Serangan ini disebut **Business Email Compromise (BEC)** — penyerang sudah riset tentang struktur perusahaan, nama direktur, dan proses keuangan. Kerugian BEC global mencapai $43 miliar dalam 5 tahun.

### 5. Whaling

Spear phishing yang menargetkan "ikan paus" — eksekutif senior, CEO, CFO.

Target high-value karena:
- Akses ke sistem dan data paling sensitif
- Otoritas untuk autorisasi transaksi besar
- Informasi strategis perusahaan

### 6. Pharming

Manipulasi DNS untuk redirect pengguna ke website palsu meskipun mengetik URL yang benar.

Contoh: Anda ketik \`bca.co.id\` tapi DNS mengarahkan ke website palsu yang tampilannya identik.

---

## Deepfake Threats: Ancaman Era Baru

### Apa itu Deepfake?

Deepfake adalah konten (foto, video, audio) yang dimanipulasi dengan AI sehingga terlihat/terdengar seperti seseorang yang asli, namun sebenarnya dibuat-buat.

**Kasus nyata:**
- **Hong Kong 2024:** Karyawan keuangan bank di-scam Rp 400 miliar setelah menghadiri video call deepfake yang menampilkan CFO dan beberapa eksekutif perusahaan palsu
- **India 2023:** Deepfake suara CEO digunakan untuk menginstruksikan transfer dana darurat
- **Indonesia:** Mulai muncul kasus deepfake video artis untuk penipuan investasi

### Cara Mendeteksi Deepfake

**Visual cues:**
- Kedipan mata tidak natural atau terlalu jarang
- Gerakan kepala/mulut yang tidak sinkron dengan suara
- Tepi wajah yang blur atau "glitchy"
- Pencahayaan wajah tidak konsisten dengan latar
- Ekspresi yang terlalu statis

**Audio cues:**
- Suara terdengar flat, kurang emosi natural
- Artefak audio — noise yang aneh
- Tempo bicara tidak natural

**Verifikasi aktif:**
- Minta orang menyentuh hidung, membuat gerakan tidak terduga
- Tanya pertanyaan yang hanya diketahui orang asli
- Hubungi melalui channel lain untuk verifikasi

---

## Social Engineering Lanjutan

### 1. Pretexting

Membangun skenario palsu (pretext) untuk mendapatkan kepercayaan korban dan mengekstrak informasi.

**Contoh:**
Penyerang mengaku sebagai peneliti survei dari lembaga terpercaya dan secara gradual menanyakan informasi sensitif sambil membangun rapport.

### 2. Baiting

Menggunakan iming-iming (bait) untuk mendorong korban melakukan tindakan tertentu.

**Contoh fisik:**
USB flashdisk ditinggalkan di parkiran kantor dengan label "Gaji Karyawan 2024". Siapa yang menemukan dan memasukkan ke komputer → komputer terinfeksi malware.

**Contoh digital:**
"Download software premium gratis tanpa crack di sini!" → Sebenarnya installer malware.

### 3. Quid Pro Quo

"Balas budi" — menawarkan layanan atau bantuan dengan imbalan informasi.

**Contoh:**
Penyerang menelepon karyawan acak dan menawarkan bantuan IT: "Saya dari tim support IT. Apakah Anda mengalami masalah dengan komputer?" Kemudian meminta kredensial untuk "memperbaiki masalah".

### 4. Tailgating / Piggybacking

Ancaman fisik — mengikuti karyawan yang berwenang masuk ke area terbatas.

Relevan untuk keamanan kantor dan server room.

### 5. Watering Hole Attack

Penyerang mengidentifikasi website yang sering dikunjungi target, menginfeksi website tersebut dengan malware, lalu menunggu target mengunjunginya.

---

## Tanda-Tanda Phishing: Checklist Deteksi

### Periksa Pengirim Email

☑️ Domain email benar? (\`@bca.co.id\` bukan \`@bca-official.com\`)
☑️ Nama pengirim cocok dengan email? (Nama "BCA" tapi email \`bca@gmail.com\`)
☑️ Email ini expected? Anda pernah mendaftar/bertransaksi dengan pengirim?

### Periksa Konten

☑️ Ada urgensi atau ancaman tidak masuk akal?
☑️ Tata bahasa dan ejaan benar? (Sering ada typo di phishing)
☑️ Ada permintaan informasi sensitif (password, OTP, nomor kartu)?
☑️ Penawaran terlalu bagus untuk jadi kenyataan?

### Periksa Link (SEBELUM klik)

☑️ Hover di atas link — URL yang muncul cocok dengan teks yang ditampilkan?
☑️ Domain URL benar? (bca.co.id vs bca-secure.co.id)
☑️ Ada subdomain mencurigakan? (bca.co.id.verify.xyz → domain aslinya adalah verify.xyz!)
☑️ HTTPS? (Perlu tapi tidak cukup — situs phishing pun bisa pakai HTTPS)

### Periksa Lampiran

☑️ File .exe, .zip, .doc, .xls dari pengirim tidak dikenal? Jangan buka!
☑️ Nama file mencurigakan? (Invoice_2024.pdf.exe)
☑️ Diminta enable macro di Word/Excel? Jangan!

---

## Checklist Verifikasi Sebelum Bertindak

### Sebelum Klik Link

\`\`\`
1. Perhatikan domain dengan teliti
   → bca.co.id ✓
   → bca-verify.net ✗
   → login.bca.co.id.phishing.com ✗ (domain asli = phishing.com)

2. Hover link tanpa klik untuk melihat URL asli

3. Jika ragu, ketik URL langsung di browser
   → Jangan klik link dari email/SMS
   → Ketik manual: bca.co.id

4. Cek SSL certificate (gembok hijau) tapi jangan stop di sini saja
\`\`\`

### Sebelum Berbagi Informasi

\`\`\`
1. Bank TIDAK PERNAH meminta:
   → Password / PIN
   → Kode OTP
   → Nomor kartu kredit lengkap + CVV
   
2. Verifikasi identitas penelepon secara independen:
   → Tutup telepon
   → Hubungi nomor resmi bank (dari website/kartu)
   → Tanya apakah ada staff yang menghubungi Anda

3. Jika ada tekanan untuk segera bertindak = tanda bahaya
\`\`\`

### Sebelum Download File

\`\`\`
1. Scan dengan VirusTotal (virustotal.com)
   → Upload file atau paste link untuk dicek

2. Cek ekstensi file
   → Invoice.pdf ✓
   → Invoice.pdf.exe ✗ (ini executable, bukan PDF!)

3. Sumber file terpercaya?
   → Official website ✓
   → Link dari email asing ✗
\`\`\`

---

## Contoh Kasus Nyata Indonesia

### Kasus 1: Penipuan Mama Minta Pulsa
Penelepon mengaku sebagai anak korban yang sedang dalam musibah dan butuh transfer segera. Memanfaatkan kepanikan orangtua. Jutaan rupiah melayang sebelum korban sempat verifikasi.

**Pelajaran:** Selalu verifikasi melalui channel lain. Telepon balik nomor anak yang sebenarnya.

### Kasus 2: Link Undangan Pernikahan
File APK berkedok undangan pernikahan dikirim via WhatsApp. Ketika diinstall, malware mencuri data SMS (termasuk OTP) dan menguras rekening bank.

**Pelajaran:** Jangan install APK dari luar Google Play Store. Undangan pernikahan asli tidak perlu diinstall!

### Kasus 3: Lowongan Kerja Palsu
Email "rekrutmen" dari perusahaan besar meminta calon pelamar mengisi form lengkap termasuk nomor KTP, nomor rekening, dan data keluarga. Data ini digunakan untuk penipuan identity theft.

**Pelajaran:** Lowongan kerja resmi tidak meminta data rekening atau KTP sebelum tahap lanjut.

### Kasus 4: Phishing via Telegram
Bot Telegram mengklaim bisa "double uang" dalam 24 jam. Korban diarahkan ke website investasi palsu, diminta deposit, dan tidak bisa withdraw.

**Pelajaran:** Tidak ada investasi yang menjamin return cepat tanpa risiko.

### Kasus 5: Malware via Link STNK/SIM
Link "cek denda" yang beredar di WhatsApp group ternyata adalah phishing. Pengguna diminta "login" untuk cek denda, namun kredensial dicuri.

---

## Apa yang Harus Dilakukan Jika Sudah Terkena Phishing?

### Jika Sudah Klik Link

\`\`\`
1. Jangan panik — ambil tindakan cepat
2. Putuskan koneksi internet segera
3. Scan komputer/HP dengan antivirus
4. Jika sudah isi form (credential):
   → Segera ganti password akun terdampak
   → Aktifkan 2FA jika belum
   → Cek aktivitas akun untuk transaksi mencurigakan
\`\`\`

### Jika Sudah Kasih OTP/Password ke Bank

\`\`\`
1. Hubungi bank SEGERA melalui nomor resmi
2. Blokir semua kartu dan akun yang terdampak
3. Minta freeze transaksi
4. Laporkan ke polisi (untuk proses hukum)
5. Laporkan ke OJK: 157 atau ojk.go.id
6. Lapor ke BSSN jika terkait instansi pemerintah
\`\`\`

### Jika Download File Berbahaya

\`\`\`
1. Jangan buka file tersebut
2. Hapus langsung
3. Scan sistem dengan antivirus
4. Jika sudah terlanjur buka: restart ke Safe Mode, scan ulang
5. Jika infeksi parah: pertimbangkan factory reset (HP) atau reinstall OS
\`\`\`

---

## Tools untuk Melindungi Diri dari Phishing

**Browser Extensions:**
- **uBlock Origin** — Blokir iklan dan tracker yang bisa jadi pintu masuk phishing
- **Google Safe Browsing** — Built-in di Chrome, peringatan jika mengunjungi situs berbahaya

**Email:**
- Gmail memiliki filter phishing bawaan yang cukup kuat
- **ProtonMail** — Email privat dengan keamanan lebih tinggi

**Verifikasi URL:**
- **Google Safe Browsing** — transparencyreport.google.com/safe-browsing/search
- **VirusTotal** — virustotal.com untuk scan URL dan file
- **URLvoid** — urlvoid.com untuk cek reputasi URL

**Anti-phishing:**
- **Netcraft Extension** — Deteksi phishing di browser
- **PhishTank** — Database situs phishing yang dikurasi komunitas

---

## Ringkasan

Phishing dan social engineering adalah ancaman siber nomor satu bukan karena teknologinya canggih, tapi karena memanfaatkan kelemahan manusia — kepanikan, keserakahan, kepercayaan, dan rasa ingin tahu.

**Prinsip emas:**
1. **Verifikasi sebelum aksi** — Jangan pernah terburu-buru karena ada "urgensi"
2. **Sceptis terhadap permintaan tidak terduga** — Terutama yang minta OTP, password, atau transfer uang
3. **Gunakan channel resmi** — Telepon nomor resmi, buka website dengan ketik manual
4. **Satu kesalahan cukup mahal** — 30 detik verifikasi lebih baik dari kerugian puluhan juta

Ingat: **Bank, marketplace, dan instansi resmi tidak akan pernah meminta OTP atau password Anda melalui telepon, SMS, atau email.**
`;
