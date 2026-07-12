export const cyber_l10 = `
# Checklist Keamanan Lengkap & Kesimpulan

Kita sudah cover banyak hal — dari password yang kuat, phishing, WiFi publik, malware, privasi digital, secure coding, sampai incident response. Sekarang saatnya mengkonsolidasikan semua itu menjadi checklist yang bisa langsung dieksekusi.

Luangkan 2-3 jam untuk lakukan ini sekarang. Ini investasi terbaik untuk keamanan digitalmu.

---

## ✅ Checklist Personal — Lakukan Sekarang

### Password & Autentikasi
\`\`\`
□ Install password manager (Bitwarden gratis, 1Password berbayar)
□ Ganti semua password lemah ke password unik 16+ karakter
□ Aktifkan 2FA di semua akun penting:
  □ Email (Gmail, Outlook)
  □ Media sosial (Instagram, Twitter, TikTok)
  □ Perbankan & e-wallet (BCA, OVO, GoPay, Dana)
  □ Platform kerja (Slack, GitHub, Figma)
□ Cek di haveibeenpwned.com apakah email bocor
□ Hapus akun yang tidak dipakai lagi
\`\`\`

### Perangkat
\`\`\`
□ Update OS ke versi terbaru (Windows, macOS, Android, iOS)
□ Update semua aplikasi
□ Aktifkan enkripsi disk (BitLocker di Windows, FileVault di Mac)
□ Pasang antivirus (Windows Defender sudah cukup untuk Windows)
□ Aktifkan screen lock dengan PIN/biometrik
□ Aktifkan Find My Device
□ Review app permissions di smartphone (siapa yang akses lokasi, kamera, mic)
\`\`\`

### Jaringan & Privasi
\`\`\`
□ Ganti password router WiFi dari default
□ Aktifkan WPA3 (atau WPA2 minimum)
□ Ganti password admin router
□ Pasang VPN untuk WiFi publik
□ Gunakan browser yang privacy-focused (Firefox + uBlock Origin)
□ Review privacy settings media sosial
□ Optout dari data broker jika memungkinkan
\`\`\`

### Backup
\`\`\`
□ Aktifkan backup otomatis (Google Drive, iCloud, atau solusi lain)
□ Test restore file dari backup
□ Backup file penting ke hard disk eksternal
□ Pastikan foto penting ada di minimal 2 tempat berbeda
\`\`\`

---

## 🛡️ Checklist Developer

\`\`\`
Kode & Repositori:
□ Semua secrets di environment variables (bukan di kode!)
□ .gitignore mencakup .env dan file sensitif
□ Tidak ada hardcoded password/API key di commit history
□ Dependency scanning aktif (GitHub Dependabot, Snyk)
□ Review kode sebelum merge (pull request + code review)

Autentikasi & Otorisasi:
□ Password di-hash dengan bcrypt (cost factor >= 12)
□ HTTPS di semua endpoint production
□ JWT expire time yang wajar (1 hari, bukan 1 tahun)
□ Rate limiting di endpoint login
□ Semua endpoint sensitif butuh autentikasi

Input & Output:
□ Semua user input divalidasi di server
□ Parameterized query untuk semua database query
□ Output di-escape untuk mencegah XSS
□ File upload: validasi tipe dan ukuran
□ Security headers terpasang (gunakan helmet.js)
\`\`\`

---

## 🏢 Checklist Bisnis Kecil

\`\`\`
Akun & Akses:
□ Setiap karyawan punya akun sendiri (tidak share)
□ 2FA wajib untuk akun bisnis
□ Offboarding: cabut akses segera saat karyawan keluar
□ Review akses aktif setiap 3 bulan

Email & Komunikasi:
□ Email filter anti-spam aktif
□ Training karyawan tentang phishing
□ Kebijakan tidak kirim data sensitif via WhatsApp pribadi

Backup & Recovery:
□ Backup data bisnis rutin (harian/mingguan)
□ Test restore backup pernah dilakukan
□ Ada rencana bisnis jika server down 1 hari/1 minggu

Kepatuhan:
□ Pahami kewajiban UU PDP (Perlindungan Data Pribadi) Indonesia
□ Privacy policy website sudah ada dan akurat
□ Data pelanggan tidak dijual atau dibagikan tanpa izin
\`\`\`

---

## 🛠️ Tools Gratis Terbaik untuk Keamanan

| Tool | Fungsi | Link |
|------|--------|------|
| Bitwarden | Password manager | bitwarden.com |
| Have I Been Pwned | Cek email bocor | haveibeenpwned.com |
| VirusTotal | Scan file/URL | virustotal.com |
| Shodan | Cari perangkat exposed | shodan.io |
| CyberChef | Enkripsi/dekripsi/encode | gchq.github.io/CyberChef |
| OWASP ZAP | Web security scanner | owasp.org/www-project-zap |
| Wireshark | Analisis network | wireshark.org |
| Kali Linux | Platform pentesting | kali.org |
| TryHackMe | Belajar cybersecurity | tryhackme.com |

---

## 📚 Sumber Belajar Lanjutan

\`\`\`
Gratis:
- OWASP.org                  → Standar keamanan web
- SecurityNow (podcast)       → Berita keamanan mingguan
- Cybrary.it                  → Video kursus keamanan
- TryHackMe / HackTheBox      → Praktik hands-on
- overthewire.org             → Game belajar Linux security

Buku:
- "The Web Application Hacker's Handbook"
- "Penetration Testing" by Georgia Weidman
- "Hacking: The Art of Exploitation"
- "Social Engineering: The Science of Human Hacking"

YouTube:
- John Hammond
- IppSec
- LiveOverflow
- Null Byte
- David Bombal
\`\`\`

---

## 🎓 Rangkuman Kursus Keamanan Siber

| Modul | Topik |
|-------|-------|
| 1 | Pengantar, password kuat, password manager, 2FA |
| 2 | Phishing, social engineering, cara deteksi serangan |
| 3 | WiFi aman, VPN, malware, ransomware, backup |
| 4 | Privasi digital, secure coding, OWASP, incident response |
| 5 | Ethical hacking, bug bounty, CTF, jalur karir |

---

## 🌟 Pesan Akhir

Keamanan siber bukan tujuan — ini **perjalanan yang tidak pernah selesai**. Ancaman terus berkembang, teknologi berubah, dan kita harus terus belajar.

Yang terpenting:
1. **Mulai dari hal kecil** — password manager + 2FA sudah melindungi Anda 90% lebih baik
2. **Edukasi orang sekitar** — keamanan komunitas bergantung pada literasi semua anggotanya
3. **Jangan panik** — security adalah tentang manajemen risiko, bukan zero risk
4. **Lapor jika menemukan celah** — responsible disclosure melindungi semua orang

> **Selamat! Anda kini adalah orang yang sadar keamanan digital. Sebarkan ilmu ini ke orang-orang terdekat Anda — karena keamanan digital adalah tanggung jawab bersama!** 🛡️
`;
