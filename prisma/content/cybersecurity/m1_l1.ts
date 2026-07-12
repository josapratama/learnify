export const cyber_l1 = `
# Dunia Digital Kita Sedang Diserang — Pengantar Keamanan Siber

Mungkin kamu berpikir: "Saya bukan orang penting, ngapain hacker nyerang saya?"

Itu justru pemikiran yang diinginkan hacker.

Kenyataannya, hacker tidak pilih-pilih korban berdasarkan "seberapa penting" kamu. Mereka menyerang siapa saja yang punya celah — akun email yang passwordnya lemah, WhatsApp yang OTP-nya bocor, rekening yang tidak pakai verifikasi dua langkah. Semuanya adalah target.

Dan Indonesia termasuk salah satu negara dengan korban terbanyak.

---

## 🏠 Analogi: Rumah Digital Kamu

Bayangkan semua yang kamu punya di dunia digital — email, foto, akun sosmed, rekening bank online, akun marketplace — itu seperti rumah yang sangat berharga.

Di rumah fisik, kamu pasti pasang kunci pintu, mungkin juga pagar, mungkin CCTV. Tapi di dunia digital, banyak orang masih "tinggal di rumah dengan pintu terbuka" — password "123456", tidak ada 2FA, pakai WiFi publik untuk transaksi bank.

| Rumah Fisik | Dunia Digital |
|---|---|
| Kunci pintu yang kuat | Password yang kuat & unik |
| Pagar pembatas | Firewall |
| CCTV & alarm | Antivirus & monitoring |
| Sistem keamanan berlapis | Multi-Factor Authentication (MFA) |
| Tidak buka pintu untuk orang asing | Tidak klik link mencurigakan |
| Simpan dokumen penting di brankas | Enkripsi data sensitif |

Bedanya dengan rumah fisik: ancaman di dunia digital tidak perlu datang ke lokasi kamu. Mereka bisa menyerang dari mana saja di dunia, kapan saja, bahkan tanpa kamu sadari berbulan-bulan.

---

## Angka-angka yang Bikin Nggak Bisa Santai

Ini bukan cerita fiksi. Angka-angka ini nyata:

### Global
- Setiap **39 detik**, ada serangan siber yang terjadi di seluruh dunia
- Kerugian akibat kejahatan siber global mencapai **$8 triliun** di 2023
- **95%** pelanggaran keamanan siber disebabkan oleh kesalahan manusia — bukan kegagalan teknologi

### Indonesia
- Indonesia masuk **10 besar negara** dengan serangan siber terbanyak di dunia
- Kasus penipuan online meningkat **300%** pasca pandemi
- Kerugian akibat penipuan digital di Indonesia: **Rp 2,5 triliun** per tahun
- Kebocoran data besar sudah terjadi di BPJS Kesehatan (2021), PLN (2022), Bank Indonesia (2022), Kominfo (2023)

### Yang Bikin Kaget
- Rata-rata orang baru sadar akunnya diretas setelah **6 bulan**
- **80%** serangan siber menggunakan password yang sudah pernah bocor sebelumnya
- Hanya **35%** pengguna internet Indonesia yang pakai password berbeda untuk tiap akun
- Lebih dari **3 miliar** pasangan email-password tersedia di dark web saat ini

---

## Tipe Ancaman yang Paling Sering Ditemui

### 1. Phishing — Yang Paling Berbahaya karena Terlihat Normal

Upaya penipuan dengan menyamar sebagai entitas yang kamu percaya — bank, marketplace, ojol — untuk mencuri info sensitif.

**Contoh yang sudah banyak makan korban di Indonesia:**
"Selamat! Anda menang hadiah dari BRI. Klik link ini untuk klaim: bit.ly/xxx"

Variannya banyak:
- **Email phishing** — email palsu dari "bank" atau "marketplace"
- **Smishing** — SMS tipuan seperti contoh di atas
- **Vishing** — telepon dari "CS bank" yang minta OTP kamu
- **Spear phishing** — phishing yang sudah riset target dulu, jauh lebih meyakinkan

### 2. Malware — Software Jahat yang Bersembunyi

Perangkat lunak yang sengaja dibuat untuk merusak, mencuri data, atau mengambil alih sistem.

- **Virus** — menempel pada file, menyebar saat dibuka
- **Ransomware** — mengenkripsi semua data kamu, minta tebusan (WannaCry 2017 menginfeksi 200.000 komputer di 150 negara)
- **Spyware** — diam-diam memata-matai aktivitasmu
- **Trojan** — menyamar sebagai aplikasi berguna

### 3. Social Engineering — Eksploitasi Manusianya, Bukan Teknologinya

Manipulasi psikologis untuk mengelabui korban. Ini yang paling sulit dilawan karena teknisnya tidak perlu canggih.

**Contoh:** Telepon dari seseorang yang mengaku "teknisi IT kantor" dan minta password kamu untuk "maintenance rutin." Terdengar aneh, tapi ini berhasil lebih sering dari yang kamu kira.

### 4. Data Breach — Datamu Bocor dari Layanan yang Kamu Percaya

Akses tidak sah ke database yang berisi info penggunanya. Kamu tidak melakukan kesalahan, tapi data kamu bocor karena layanan yang kamu pakai diretas.

Ini kenapa memakai password yang sama di semua akun itu sangat berbahaya — satu layanan diretas, semua akunmu bisa diakses.

### 5. Man-in-the-Middle — Ada yang Nyadap Komunikasimu

Penyerang masuk di antara dua pihak yang berkomunikasi, bisa baca dan manipulasi data yang lewat.

**Contoh:** WiFi publik palsu di kafe yang dibuat hacker untuk mencegat transaksi perbankanmu.

---

## Kenapa Ini Bukan Cuma Urusan Orang IT?

Kesalahpahaman paling umum: "Saya bukan orang IT, jadi keamanan siber bukan urusan saya."

Ini cara berpikir yang berbahaya, karena:

1. **Kamu punya data yang berharga** — email, foto, kontak, riwayat pembelian, data keuangan. Semua ini bisa dimonetisasi oleh penjahat siber.

2. **Kamu bisa jadi pintu masuk ke organisasi** — 95% serangan memanfaatkan kesalahan manusia. Tidak peduli secanggih apa sistem IT perusahaannya, kalau satu karyawan klik link phishing, semuanya bisa runtuh.

3. **Orang IT juga bisa jadi korban** — Overconfidence ("saya tahu teknologi, tidak mungkin kena") justru berbahaya. Banyak developer yang hardcode API key di kode yang di-push ke GitHub, atau tidak update dependency yang ada celah keamanan.

### Kasus Nyata di Indonesia yang Bisa Kamu Pelajari

**Kasus 1: Ibu rumah tangga di Surabaya kehilangan Rp 150 juta**
Menerima telepon dari seseorang yang mengaku CS BCA, diminta "verifikasi" dengan memberikan OTP. Uang habis dalam hitungan menit.

**Kasus 2: Rumah sakit di Jakarta tidak bisa akses data pasien selama 3 hari**
Terkena ransomware. Operasi terpaksa ditunda.

**Kasus 3: Influencer kehilangan 500.000 followers Instagram**
Pakai password yang sama dengan email yang sudah bocor di data breach sebelumnya. Akun diambil alih.

**Kasus 4: Pemilik toko online kehilangan akses ke marketplace**
Klik link "verifikasi akun" palsu. Omset bulanan raib seminggu penuh.

---

## CIA Triad — Tiga Pilar Keamanan Informasi

Setiap sistem keamanan yang baik dibangun di atas tiga prinsip ini:

### Confidentiality (Kerahasiaan)
Data hanya bisa diakses pihak yang berwenang. Kalau kamu simpan password di database, harus di-hash dulu — bukan disimpan teks biasa.

### Integrity (Integritas)
Data tidak boleh dimodifikasi tanpa izin, dan harus akurat. Kalau kamu download file software, ada checksum yang bisa diverifikasi bahwa file tidak diubah di tengah jalan.

### Availability (Ketersediaan)
Sistem dan data harus tersedia ketika dibutuhkan. Backup rutin, server yang redundant, proteksi dari DDoS — semua ini untuk memastikan layanan tetap jalan.

Ketiga-tiganya sama penting. Keamanan yang bagus tapi sistem sering down itu tidak berguna. Sistem yang selalu up tapi datanya bisa diakses semua orang juga berbahaya.

---

## Langkah Pertama yang Bisa Dilakukan Sekarang Juga

Tidak perlu jadi ahli keamanan untuk mulai melindungi diri. Lima langkah ini saja sudah jauh lebih aman dari rata-rata:

1. ✅ **Cek apakah datamu sudah bocor** — buka haveibeenpwned.com, masukkan email kamu
2. ✅ **Aktifkan 2FA** di akun email, bank, dan sosmed utama
3. ✅ **Pakai password manager** — LastPass, Bitwarden, atau 1Password. Jangan hafal password yang unik, biarkan password manager yang hafal
4. ✅ **Update software secara rutin** — OS, browser, dan aplikasi yang selalu up-to-date
5. ✅ **Jangan klik link sembarangan** — kalau ragu, buka langsung websitenya, jangan lewat link

---

## Ringkasan

Keamanan siber bukan tentang paranoid. Ini tentang memahami risiko dan mengambil langkah-langkah wajar untuk melindungi diri.

Di kursus ini, kita akan bahas setiap aspek keamanan siber secara praktis — dari password yang kuat, cara mengenali phishing, keamanan jaringan, sampai cara berpikir seperti attacker untuk membangun sistem yang lebih aman.

**Keamanan yang baik bukan tentang sistem yang sempurna. Ini tentang membuat kamu jadi target yang lebih sulit dari orang di sebelahmu.**

> **Di pelajaran berikutnya, kita bahas password — kenapa "123456" itu bencana, dan cara buat password yang benar-benar aman.** 🔐
`;
