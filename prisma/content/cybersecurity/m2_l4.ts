export const cyber_l4 = `
# Keamanan Jaringan & WiFi

Setiap kali terhubung ke internet — di rumah, kafe, bandara, hotel — kamu membuka jalur antara perangkatmu dan dunia luar. Jalur itu bisa dimanfaatkan penyerang kalau tidak dijaga.

Ini bukan teori. Alat untuk menyadap WiFi publik bisa dibeli seharga $30 dan dioperasikan pemula sekalipun. Dan di Indonesia, lebih dari 70% pengguna smartphone menggunakan WiFi publik tanpa perlindungan apapun.

**Fakta penting:**
- WiFi publik di 58% kafe dan hotel Indonesia tidak menggunakan enkripsi memadai
- 1 dari 4 hotspot WiFi publik berpotensi berbahaya
- Serangan Man-in-the-Middle bisa dilakukan dengan alat yang sangat murah

---

## Bahaya WiFi Publik

### Apa yang Bisa Dilakukan Penyerang?

**1. Packet Sniffing**
Menangkap semua data yang melintas di jaringan. Data tidak terenkripsi (HTTP) terbaca jelas — URL yang dikunjungi, data form, cookie sesi.

**2. Evil Twin / Rogue Hotspot**
Penyerang buat hotspot dengan nama mirip atau sama. "Starbucks_Wifi" asli vs "Starbucks_Wifi" palsu dengan sinyal lebih kuat — perangkatmu otomatis connect ke yang lebih kuat.

**3. Man-in-the-Middle (MitM)**

\`\`\`
Normal: [Perangkat] → [Router WiFi] → [Internet]

MitM:   [Perangkat] → [Penyerang] → [Router WiFi] → [Internet]
        Semua data melewati penyerang dulu!
\`\`\`

**4. Session Hijacking**
Mencuri cookie sesi untuk "masuk" ke akunmu tanpa perlu password.

---

## HTTPS vs HTTP: Perbedaan yang Krusial

### HTTP: Komunikasi Tanpa Enkripsi

HTTP (HyperText Transfer Protocol) mengirimkan data dalam format teks biasa (plaintext). Siapa pun yang bisa menyadap jaringan dapat membaca semua yang dikirimkan.

\`\`\`
Browser Anda mengirimkan:
POST http://toko-online.com/login
username=anda@email.com&password=Password123

→ Penyerang di jaringan yang sama dapat membaca ini!
\`\`\`

### HTTPS: Komunikasi Terenkripsi

HTTPS (HTTP Secure) menambahkan lapisan enkripsi SSL/TLS di atas HTTP. Data dienkripsi sebelum dikirim.

\`\`\`
Browser Anda mengirimkan:
POST https://toko-online.com/login
[DATA TERENKRIPSI - tidak terbaca tanpa private key]

→ Penyerang hanya melihat noise yang tidak bermakna
\`\`\`

### Cara Cek Koneksi HTTPS

Perhatikan di address bar browser:
- **🔒 Gembok + https://** = Koneksi terenkripsi ✅
- **⚠️ Not Secure + http://** = Koneksi tidak terenkripsi ❌
- **Gembok dengan tanda seru** = Sertifikat bermasalah, hati-hati ⚠️

**Peringatan:** HTTPS hanya menjamin enkripsi antara Anda dan server. Bukan jaminan website itu aman atau tidak phishing. Website phishing pun bisa pakai HTTPS!

---

## SSL/TLS: Teknologi di Balik HTTPS

### Penjelasan Sederhana

SSL (Secure Sockets Layer) dan TLS (Transport Layer Security — penggantinya) adalah protokol kriptografi yang mengamankan komunikasi di internet. TLS adalah versi modern dan lebih aman.

**Analoginya:** Bayangkan Anda mengirim surat rahasia. SSL/TLS seperti memasukkan surat ke dalam kotak terkunci — hanya penerima yang punya kunci untuk membukanya. Meski orang lain bisa pegang kotak itu, mereka tidak bisa baca isinya.

### Cara Kerja SSL/TLS (Handshake)

\`\`\`
1. Browser: "Halo server! Saya bisa pakai enkripsi ini."
   
2. Server: "Halo! Ini sertifikat saya + public key saya."
   
3. Browser:
   → Verifikasi sertifikat (apakah dari CA yang terpercaya?)
   → Generate session key acak
   → Enkripsi session key dengan public key server
   → Kirim ke server
   
4. Server:
   → Decrypt dengan private key
   → Sekarang keduanya punya session key yang sama
   
5. Komunikasi selanjutnya: semua dienkripsi dengan session key
\`\`\`

### Versi TLS

- **TLS 1.0 / 1.1** — Sudah usang, berbahaya, harus dihindari
- **TLS 1.2** — Masih aman, tapi sudah ada yang lebih baik
- **TLS 1.3** — Versi terbaru (2018), paling aman dan cepat

Browser modern sudah tidak support TLS 1.0/1.1. Anda bisa cek versi TLS website di: ssllabs.com/ssltest

---

## VPN (Virtual Private Network)

### Apa itu VPN?

VPN membuat "terowongan terenkripsi" antara perangkat Anda dan server VPN. Semua traffic internet Anda melewati terowongan ini.

\`\`\`
Tanpa VPN:
[Perangkat] → [ISP/WiFi] → [Internet]
     ↑ ISP dan siapapun di jaringan bisa lihat traffic

Dengan VPN:
[Perangkat] → [Terowongan Terenkripsi] → [Server VPN] → [Internet]
     ↑ ISP hanya tahu Anda connect ke VPN, tidak tahu isinya
     ↑ Situs tujuan melihat IP server VPN, bukan IP asli Anda
\`\`\`

### Kapan Harus Menggunakan VPN?

**Harus menggunakan VPN:**
- ☑️ Menggunakan WiFi publik (kafe, bandara, hotel, pusat perbelanjaan)
- ☑️ Kerja remote dari tempat umum
- ☑️ Mengakses data sensitif perusahaan dari luar kantor
- ☑️ Di negara dengan sensor internet ketat

**Tidak wajib VPN:**
- Di jaringan rumah yang sudah aman
- Di jaringan kantor yang dikelola IT
- Untuk aktivitas tidak sensitif di jaringan terpercaya

### VPN Mana yang Harus Dipilih?

**Hal yang harus dicari di VPN:**
- **No-log policy** — Tidak menyimpan riwayat aktivitas Anda
- **Audit keamanan independen** — Klaim keamanan diverifikasi pihak ketiga
- **Kill switch** — Otomatis putus internet jika VPN terputus (mencegah data bocor)
- **Protokol modern** — WireGuard, OpenVPN
- **Yurisdiksi** — Negara dengan undang-undang privasi yang kuat

**VPN Berbayar Terpercaya:**

| VPN | Harga/bulan | Kelebihan |
|---|---|---|
| Mullvad | ~$5 | No-log ketat, terima pembayaran anonim |
| ProtonVPN | $4-$8 | Swiss berbasis, no-log, ada tier gratis |
| ExpressVPN | $8-$12 | Cepat, mudah digunakan, luas coverage |
| NordVPN | $3-$5 | Populer, fitur lengkap, double VPN |

**VPN Gratis — Waspada!**
Banyak VPN gratis yang justru menjual data Anda ke pengiklan atau bahkan menjadi malware. VPN yang baik membutuhkan infrastruktur mahal — jika gratis, biasanya Anda yang jadi produknya.

**Pengecualian VPN gratis yang layak:**
- **ProtonVPN** — Tier gratis terbatas tapi tanpa iklan dan no-log
- **Windscribe** — 10GB/bulan gratis

### VPN Tidak Membuat Anda Anonim Sepenuhnya

Penting untuk dipahami:
- VPN menyembunyikan traffic dari ISP dan jaringan lokal
- VPN **tidak** membuat Anda anonim dari website yang Anda login
- VPN **tidak** melindungi dari malware atau phishing
- VPN provider bisa diminta data oleh pemerintah (bergantung yurisdiksi)

---

## DNS over HTTPS (DoH)

### Masalah dengan DNS Biasa

DNS (Domain Name System) adalah "buku telepon" internet — mengubah nama domain (google.com) menjadi alamat IP (142.250.185.46). 

Normalnya, query DNS dikirim dalam plaintext. Artinya:
- ISP Anda bisa melihat semua domain yang Anda kunjungi
- Penyerang di jaringan bisa memanipulasi DNS (DNS spoofing)

### Solusi: DNS over HTTPS

DoH mengenkripsi query DNS menggunakan HTTPS, sehingga tidak bisa disadap atau dimanipulasi.

**DNS Resolver yang mendukung DoH:**
- **Cloudflare** (1.1.1.1) — Cepat, privat, tidak jual data
- **Google** (8.8.8.8) — Cepat, tapi Google menggunakan data untuk iklan
- **NextDNS** — Customizable, bisa blokir tracker dan malware

**Cara aktifkan DoH di browser:**

Chrome:
\`\`\`
Settings → Privacy and Security → Security
→ Use secure DNS → Aktifkan
→ Pilih provider (Cloudflare, Google, dll)
\`\`\`

Firefox:
\`\`\`
Settings → General → Network Settings → Settings
→ Enable DNS over HTTPS
→ Pilih provider
\`\`\`

---

## Tips Aman di Tempat Umum

### Di Kafe

\`\`\`
✅ DO:
- Tanyakan nama WiFi resmi ke barista sebelum connect
- Gunakan VPN segera setelah connect
- Gunakan koneksi seluler (4G/5G) untuk transaksi sensitif
- Aktifkan firewall di laptop
- Gunakan screen privacy filter untuk layar

❌ DON'T:
- Jangan login ke m-banking atau internet banking
- Jangan isi data kartu kredit untuk belanja online
- Jangan biarkan perangkat tanpa pengawasan
- Jangan connect ke hotspot tanpa password
\`\`\`

### Di Bandara

\`\`\`
✅ DO:
- Prefer koneksi seluler daripada WiFi bandara
- Jika harus pakai WiFi: gunakan VPN
- Gunakan website resmi bandara untuk WiFi login
- Aktifkan "Forget Network" setelah selesai

❌ DON'T:
- Hindari download attachment besar (bisa intercepted)
- Jangan akses sistem kerja tanpa VPN perusahaan
- Jangan charge perangkat di USB charging station publik
  (risiko "juice jacking" — malware via USB)
\`\`\`

**USB Juice Jacking:** Charger USB publik (bandara, mall) bisa diretas untuk mengirimkan malware ke perangkat yang terhubung. Gunakan charger sendiri atau power bank. Jika terpaksa, gunakan "USB condom" (data blocker) yang hanya mengizinkan aliran listrik, bukan data.

### Di Hotel

\`\`\`
- WiFi hotel biasanya tidak terenkripsi dengan baik
- Gunakan VPN
- Jangan lakukan transaksi finansial kecuali lewat 4G/VPN
- Jika harus cetak dokumen sensitif: hapus dari printer setelah selesai
\`\`\`

---

## Setup WiFi Rumah yang Aman

### Standar Enkripsi WiFi

| Standar | Status | Keamanan |
|---|---|---|
| WEP (1997) | JANGAN DIGUNAKAN | Sangat lemah, bisa dibobol dalam menit |
| WPA (2003) | JANGAN DIGUNAKAN | Sudah usang |
| WPA2 (2004) | Minimum diterima | Cukup aman jika password kuat |
| WPA3 (2018) | Direkomendasikan | Standar terbaru, lebih aman |

**Cara cek dan ubah di router:**
\`\`\`
1. Buka browser → ketik 192.168.1.1 atau 192.168.0.1
2. Login ke admin panel router
3. Cari menu "Wireless Security" atau "WiFi Security"
4. Ubah ke WPA3 atau WPA2 minimum
5. Simpan dan restart router
\`\`\`

### Ubah Kredensial Default Router

**BAHAYA DEFAULT CREDENTIALS!**
Router baru biasanya punya username/password admin default (admin/admin, admin/password, dll). Ribuan router Indonesia bisa diakses dari internet karena tidak mengubah password default ini.

\`\`\`
Yang harus diubah:
1. Username/password admin panel router
   → Ganti dari "admin/admin" ke sesuatu yang kuat

2. Nama jaringan WiFi (SSID)
   → Jangan gunakan nama yang mengidentifikasi Anda
   → Hindari: "Rumah Pak Budi No 5", "Budi_Family"
   → Gunakan: nama acak yang tidak personal

3. Password WiFi
   → Minimal 12 karakter
   → Kombinasi huruf, angka, simbol
   → Contoh kuat: Matahari7#Pantai
\`\`\`

### Network Segmentation (Segmentasi Jaringan)

Pisahkan perangkat di jaringan berbeda untuk membatasi kerusakan jika satu perangkat terinfeksi.

**Praktis untuk rumah:**
\`\`\`
Jaringan Utama (WPA3, password kuat):
→ Laptop kerja, komputer desktop
→ Smartphone

Jaringan Tamu (Guest Network):
→ Untuk tamu yang datang berkunjung
→ Smart TV, smart speaker (IoT devices)
→ Konsol game
→ Perangkat anak-anak
\`\`\`

Dengan segmentasi ini, jika smart TV Anda terinfeksi malware, malware tersebut tidak bisa langsung menyerang laptop kerja Anda di jaringan berbeda.

**Cara setup Guest Network:**
\`\`\`
1. Login ke router admin panel
2. Cari "Guest Network" atau "Wireless Guest"
3. Aktifkan dan atur nama + password tersendiri
4. Pastikan "Client Isolation" aktif (tamu tidak bisa lihat perangkat satu sama lain)
\`\`\`

### Fitur Keamanan Router yang Harus Diaktifkan

\`\`\`
✅ Firewall bawaan router — Aktifkan
✅ UPnP (Universal Plug and Play) — Nonaktifkan jika tidak perlu
   (UPnP bisa dieksploitasi malware untuk buka port)
✅ Remote Management — Nonaktifkan jika tidak butuh
✅ WPS (WiFi Protected Setup) — Nonaktifkan
   (WPS punya kelemahan keamanan yang diketahui)
✅ DNS aman — Atur ke Cloudflare (1.1.1.1) atau NextDNS
✅ Firmware update — Update secara rutin
\`\`\`

### Update Firmware Router

Router, seperti semua software, memiliki celah keamanan yang ditemukan dari waktu ke waktu. Pembuat router merilis update firmware untuk menambal celah tersebut.

\`\`\`
Cara update firmware:
1. Login ke admin panel router
2. Cari menu "Firmware Update" atau "Software Update"
3. Check for update
4. Download dan install jika tersedia
5. Restart router
\`\`\`

**Tip:** Catat jadwal untuk cek firmware router setiap 3 bulan sekali.

---

## HSTS: Keamanan HTTPS yang Lebih Kuat

HSTS (HTTP Strict Transport Security) adalah mekanisme keamanan yang memaksa browser selalu menggunakan HTTPS untuk domain tertentu, menolak koneksi HTTP.

Dari sudut pandang pengguna:
- Browser modern sudah built-in daftar domain HSTS
- Jika situs di-downgrade ke HTTP, browser menolak koneksi
- Melindungi dari SSL stripping attack

Anda bisa cek apakah situs menggunakan HSTS di: hstspreload.org

---

## Checklist Keamanan Jaringan Lengkap

### WiFi Rumah
- [ ] Gunakan WPA3 (atau minimal WPA2 dengan AES)
- [ ] Password WiFi kuat dan unik (minimal 12 karakter)
- [ ] Ubah password admin router dari default
- [ ] Ganti nama SSID dari nama default
- [ ] Nonaktifkan WPS
- [ ] Aktifkan Guest Network untuk tamu dan IoT devices
- [ ] Update firmware router secara berkala
- [ ] Nonaktifkan UPnP dan Remote Management
- [ ] Atur DNS ke Cloudflare atau NextDNS

### Saat di Luar Rumah
- [ ] Selalu gunakan VPN di WiFi publik
- [ ] Prefer koneksi 4G/5G untuk transaksi sensitif
- [ ] Verify nama WiFi resmi sebelum connect
- [ ] Aktifkan "Forget Network" setelah selesai menggunakan WiFi umum
- [ ] Gunakan adaptor USB data-only (USB condom) jika charge di tempat publik
- [ ] Jangan tinggalkan perangkat tanpa pengawasan

### Di Browser
- [ ] Aktifkan DNS over HTTPS
- [ ] Perhatikan ikon gembok dan HTTPS di address bar
- [ ] Gunakan browser up-to-date
- [ ] Install uBlock Origin untuk blokir tracker berbahaya
- [ ] Jangan abaikan peringatan "Certificate Error"

---

## Ringkasan

Keamanan jaringan adalah tentang **memahami apa yang bisa dilihat pihak lain** ketika Anda menggunakan internet. Di jaringan publik, data Anda bisa disadap. HTTPS mengenkripsi komunikasi, tapi tidak semua website dan semua kondisi terlindungi.

VPN adalah perisai terbaik saat menggunakan jaringan tidak terpercaya. Di rumah, pastikan WiFi Anda menggunakan WPA3, password kuat, dan segmentasi jaringan yang baik.

**Prinsip kunci:** Anggap setiap jaringan publik sebagai musuh sampai terbukti sebaliknya. Gunakan VPN, stick to HTTPS, dan jangan pernah akses data sensitif di WiFi publik tanpa perlindungan.
`;
