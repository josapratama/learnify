export const cyber_l9 = `
# Ethical Hacking & Karir Keamanan Siber

Setelah belajar bagaimana sistem diserang dan cara melindunginya, ada karir menarik di persimpangan keduanya: **ethical hacking**.

Ethical hacker dibayar untuk menyerang sistem — dengan izin — supaya kelemahan bisa ditemukan dan diperbaiki sebelum penjahat yang menemukan lebih dulu.

---

## 🎩 White Hat vs Black Hat

\`\`\`
⬛ Black Hat Hacker  → Menyerang sistem tanpa izin (kriminal)
⬜ White Hat Hacker  → Meretas sistem dengan IZIN untuk menemukan kelemahan (legal & dibayar!)
🔘 Grey Hat Hacker   → Kadang tanpa izin, tapi tidak berniat jahat
\`\`\`

Perbedaannya bukan skill — tapi **izin dan niat**. Skill yang sama bisa dipakai untuk jadi kriminal atau jadi profesional yang sangat dicari.

---

## 🐛 Bug Bounty — Dibayar Menemukan Celah

Program bug bounty: perusahaan membayar siapapun yang menemukan dan melaporkan kerentanan secara bertanggung jawab.

\`\`\`
Platform bug bounty populer:
- HackerOne (hackerone.com)
- Bugcrowd (bugcrowd.com)
- Intigriti (intigriti.com)
- Open Bug Bounty (openssl.org)

Contoh hadiah:
- Google: $100 - $31.337 per bug
- Facebook: $500 - $40.000 per bug
- Microsoft: $500 - $250.000 per bug (critical)
- Apple: hingga $1.000.000 untuk zero-day di iOS!

Cara mulai:
1. Daftar di HackerOne atau Bugcrowd
2. Pilih program dengan scope yang jelas
3. Baca rules dengan teliti
4. Mulai dari program private/invite-only untuk pemula
\`\`\`

---

## 🔬 Penetration Testing

Pentest = simulasi serangan terstruktur untuk menemukan kerentanan:

\`\`\`
Fase Penetration Testing:

1. RECONNAISSANCE (Pengintaian)
   - Kumpulkan info target (OSINT)
   - Tools: Shodan, theHarvester, Maltego

2. SCANNING & ENUMERATION
   - Scan port dan layanan
   - Tools: Nmap, Masscan

3. VULNERABILITY ANALYSIS
   - Identifikasi kerentanan
   - Tools: Nessus, OpenVAS, Nikto

4. EXPLOITATION
   - Eksploitasi kerentanan yang ditemukan
   - Tools: Metasploit, Burp Suite

5. POST-EXPLOITATION
   - Apa yang bisa dilakukan setelah masuk?
   - Privilege escalation, lateral movement

6. REPORTING
   - Dokumentasikan semua temuan
   - Rekomendasi perbaikan
\`\`\`

---

## 🚩 CTF — Capture the Flag

CTF = kompetisi keamanan siber di mana peserta memecahkan tantangan untuk mendapatkan "flag" (kode rahasia).

\`\`\`
Kategori CTF:
- Web Security (SQL injection, XSS, IDOR)
- Cryptography (decrypt pesan, crack cipher)
- Reverse Engineering (analisis binary/malware)
- Forensics (analisis log, file, memory)
- Pwn/Binary Exploitation
- OSINT (Open Source Intelligence)

Platform CTF untuk belajar:
- PicoCTF (cocok untuk pemula, picoctf.com)
- HackTheBox (htb.com) - level menengah
- TryHackMe (tryhackme.com) - sangat ramah pemula
- OverTheWire (overthewire.org) - gratis
- VulnHub (vulnhub.com) - VM untuk latihan
\`\`\`

---

## 🛠️ Tools Ethical Hacking

\`\`\`
Kali Linux: Distro Linux khusus security, berisi 600+ tools

Tools populer:
Reconnaissance: nmap, Shodan, theHarvester, Maltego
Web Testing: Burp Suite, OWASP ZAP, Nikto, sqlmap
Password: Hashcat, John the Ripper, Hydra
Network: Wireshark, tcpdump, Aircrack-ng
Exploitation: Metasploit Framework

Contoh Nmap:
nmap -sV -p- 192.168.1.1       # Scan semua port + versi service
nmap -A 192.168.1.1            # Aggressive scan (OS, scripts, traceroute)
nmap -sn 192.168.1.0/24        # Ping scan (cari host aktif)

Burp Suite:
- Intercept HTTP request/response
- Modifikasi request sebelum sampai ke server
- Fuzz parameter untuk cari kerentanan
\`\`\`

---

## 📋 Jalur Karir Keamanan Siber

\`\`\`
Entry Level (0-2 tahun):
├── SOC Analyst (Security Operations Center)
│   → Monitor alert, investigasi insiden, threat hunting
│   → Gaji: Rp 5-10 juta/bulan
│
├── Security Analyst
│   → Analisis kerentanan, review kode, compliance
│
└── IT Security Generalist
    → Kelola firewall, antivirus, patch management

Mid Level (2-5 tahun):
├── Penetration Tester / Ethical Hacker
│   → Lakukan pentest, bug bounty
│   → Gaji: Rp 10-25 juta/bulan
│
├── Incident Responder
│   → Tangani insiden keamanan
│
├── Security Engineer
│   → Bangun infrastruktur keamanan
│
└── Threat Intelligence Analyst
    → Analisis ancaman, profil threat actor

Senior Level (5+ tahun):
├── CISO (Chief Information Security Officer)
│   → Strategi keamanan perusahaan
│   → Gaji: Rp 50-200 juta/bulan (enterprise)
│
├── Red Team Lead
├── Security Architect
└── Malware Analyst / Reverse Engineer
\`\`\`

---

## 🎓 Sertifikasi Keamanan Siber

\`\`\`
Pemula (tidak perlu pengalaman):
- CompTIA Security+ → Fondasi keamanan umum
- CEH (Certified Ethical Hacker) → Ethical hacking dasar
- Google Cybersecurity Certificate → Mudah dan diakui

Menengah (butuh pengalaman):
- OSCP (Offensive Security Certified Professional)
  → Pentest Linux, PALING dihormati di industri
  → 24 jam exam praktis!
- GPEN, GWAPT (GIAC certifications)
- eJPT (eLearnSecurity Junior Penetration Tester)
  → Entry level pentesting, cocok pemula

Advanced:
- CISSP (Certified Information Systems Security Professional)
  → Manajemen keamanan, untuk senior
- CISM, CRISC → Governance & risk management
\`\`\`

---

## 🇮🇩 Komunitas Keamanan Siber Indonesia

\`\`\`
- ID-CERT (Indonesia Computer Emergency Response Team)
- BSSN (Badan Siber dan Sandi Negara) - pemerintah
- OWASP Indonesia Chapter
- Facebook Group: Indonesia Hacking Community
- Telegram: Indonesia Cybersecurity Community
- Dicoding Security Learning Path

Event:
- IDCH (Indonesia Cyber Hacker) CTF
- Gemastik (mahasiswa)
- HackFest Indonesia
\`\`\`

---

## 📝 Ringkasan

- Ethical hacking = legal jika ada izin tertulis dari pemilik sistem
- Bug bounty = cara terbaik untuk mulai karir dan mendapat penghasilan
- CTF = cara belajar yang menyenangkan dan terstruktur
- TryHackMe = platform terbaik untuk pemula total
- OSCP = sertifikasi paling dihormati untuk penetration tester

> **Di pelajaran terakhir, kita rangkum semua dan buat rencana belajar Anda!** 🎯
`;
