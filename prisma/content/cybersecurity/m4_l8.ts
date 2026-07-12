export const cyber_l8 = `
# Keamanan Perusahaan & Incident Response

Keamanan personal sudah — kita lindungi akun dan perangkat sendiri. Sekarang skala yang lebih besar: bagaimana perusahaan melindungi sistemnya, dan apa yang terjadi ketika ada insiden?

Ini penting buat kamu yang bekerja atau akan bekerja di perusahaan — karena kamu adalah bagian dari pertahanan (atau bisa jadi titik lemah) perusahaan tersebut.

---

## 🚫 Zero Trust — "Jangan Percaya Siapapun"

Model lama: "Kalau sudah masuk jaringan kantor = aman." Ini berbahaya karena begitu satu orang masuk, mereka bisa kemana saja.

Model **Zero Trust**: **Jangan pernah percaya, selalu verifikasi** — siapapun yang akses sistem harus diverifikasi, tidak peduli dari dalam atau luar kantor, tidak peduli di jaringan apa.

\`\`\`
Tiga prinsip Zero Trust:
1. Verify explicitly       → Selalu autentikasi dan otorisasi
2. Use least privilege     → Berikan akses minimal yang dibutuhkan
3. Assume breach           → Asumsikan sistem sudah dikompromis, desain untuk membatasi kerusakan
\`\`\`

---

## 🔑 Least Privilege — Akses Minimal

\`\`\`
Contoh implementasi:

Database:
├── app_user         → SELECT, INSERT, UPDATE (tidak bisa DROP, CREATE)
├── readonly_user    → SELECT saja (untuk reporting)
└── admin_user       → Semua (hanya DBA yang punya)

Server:
├── Deploy user      → Hanya bisa akses /var/www/
├── Monitoring user  → Hanya bisa baca logs
└── Backup user      → Hanya bisa baca data untuk backup

Aplikasi:
├── Karyawan biasa   → Baca data divisi sendiri
├── Manager          → Baca + approve data timnya
└── Admin            → Semua akses
\`\`\`

---

## 🔒 Multi-Factor Authentication Perusahaan

\`\`\`
Layer 1: Password (sesuatu yang Anda tahu)
Layer 2: OTP/Authenticator (sesuatu yang Anda punya)
Layer 3: Biometrik/Hardware key (sesuatu yang Anda adalah)

Untuk perusahaan: SSO (Single Sign-On) + MFA
Tools: Okta, Azure AD, Google Workspace
\`\`\`

---

## 📊 SIEM — Security Information & Event Management

SIEM = sistem yang mengumpulkan dan menganalisis log dari seluruh infrastruktur:

\`\`\`
[Server Log] ──────────┐
[Firewall Log] ─────────┤
[Aplikasi Log] ─────────├──► SIEM ──► Alert & Dashboard
[Database Log] ─────────┤
[Endpoint Log] ─────────┘

SIEM mendeteksi:
- 100 login gagal dalam 5 menit = Brute force attack!
- Login dari 2 negara berbeda dalam 1 jam = Account takeover?
- Database query yang tidak biasa tengah malam = Insider threat?
\`\`\`

Tools SIEM populer: Splunk, IBM QRadar, Microsoft Sentinel, Elastic SIEM (open source)

---

## 🚨 Incident Response Plan

Ketika terjadi insiden keamanan, tidak boleh panik — ada prosedur yang jelas:

### Framework PICERL

\`\`\`
1. PREPARATION  → Siapkan tim, tools, prosedur sebelum insiden
2. IDENTIFICATION → Deteksi dan konfirmasi bahwa insiden terjadi
3. CONTAINMENT  → Isolasi sistem yang terdampak, cegah menyebar
4. ERADICATION  → Hapus malware/akses tidak sah
5. RECOVERY     → Pulihkan sistem ke kondisi normal
6. LESSONS LEARNED → Pelajari apa yang terjadi, perbaiki prosedur
\`\`\`

### Contoh Skenario: Ransomware

\`\`\`
Identification:
- Karyawan lapor file tidak bisa dibuka
- Muncul pesan tebusan di layar
- Konfirmasi: YA, ini ransomware

Containment (dalam 15 menit pertama):
- CABUT kabel jaringan semua komputer yang terinfeksi
- Matikan WiFi di area tersebut
- Jangan restart komputer (forensic evidence)

Eradication:
- Format dan install ulang sistem yang terinfeksi
- Ganti semua password (semua mungkin sudah bocor)
- Scan seluruh jaringan

Recovery:
- Restore dari backup yang bersih (BUKAN dari backup terbaru yang mungkin sudah terinfeksi)
- Test sebelum kembali ke production
- Monitor ketat 30 hari ke depan

Lessons Learned:
- Bagaimana ransomware bisa masuk?
- Mengapa tidak terdeteksi lebih awal?
- Bagaimana memperkuat sistem?
\`\`\`

---

## 💾 Strategi Backup — 3-2-1 Rule

\`\`\`
3 → Simpan 3 salinan data
2 → Di 2 media yang berbeda (disk + cloud, atau disk + tape)
1 → 1 salinan off-site (lokasi fisik berbeda)

Contoh:
- Backup harian ke NAS di server room
- Backup mingguan ke cloud (AWS S3, Google Cloud Storage)
- Backup bulanan ke hard disk fisik di tempat yang berbeda (disaster recovery site)

PENTING: Test restore secara berkala! Backup yang tidak pernah di-test = tidak ada backup!
\`\`\`

---

## 👥 Security Awareness Training

Karyawan adalah pertahanan pertama DAN titik lemah terbesar:

\`\`\`
Pelatihan wajib untuk semua karyawan:
✅ Cara mengenali phishing email
✅ Password policy dan penggunaan password manager
✅ Prosedur laporan insiden ("Jika ragu, laporkan!")
✅ Kebijakan penggunaan perangkat pribadi (BYOD)
✅ Keamanan saat work from home
✅ Social engineering awareness

Simulasi phishing berkala:
- Kirim email phishing simulasi ke karyawan
- Yang klik = masuk training tambahan
- Tidak menghukum, tapi mendidik
\`\`\`

---

## 📝 Ringkasan

- Zero Trust: "Jangan percaya siapapun, selalu verifikasi"
- Least Privilege: berikan akses minimal yang benar-benar dibutuhkan
- Incident Response: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned
- Backup 3-2-1: 3 salinan, 2 media berbeda, 1 off-site
- People = titik lemah terbesar → training security awareness rutin

> **Di modul terakhir, kita bahas ethical hacking dan jalur karir di keamanan siber!** 🎯
`;
