export const html_l6 = `
# Proyek Akhir HTML — Bangun Halaman Profil Personal dari Nol

Ini dia saat yang ditunggu-tunggu! 🎉 Kita gabungkan semua yang sudah dipelajari menjadi satu halaman profil personal yang sesungguhnya.

Halaman profil ini bisa kamu pakai untuk portofolio, nanti tinggal tambah CSS biar makin keren!

---

## 🎯 Apa yang Akan Kita Buat?

Halaman profil dengan bagian:
1. **Header** — nama, foto, tagline, navigasi
2. **Tentang Saya** — perkenalan singkat
3. **Skills & Kemampuan** — daftar skill dalam tabel
4. **Pengalaman / Pendidikan** — riwayat dengan format rapi
5. **Portofolio** — daftar proyek atau karya
6. **Kontak** — form kontak + info kontak
7. **Footer** — copyright dan media sosial

---

## 💻 Kode Lengkap

Buat file baru: \`profil.html\`

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description"
        content="Halaman profil Budi Santoso - Web Developer pemula yang bersemangat.">
  <meta property="og:title"    content="Budi Santoso — Profil">
  <meta property="og:description" content="Web developer yang sedang tumbuh.">
  <title>Budi Santoso — Profil Personal</title>
</head>
<body>

  <!-- ════════════ HEADER ════════════ -->
  <header>
    <nav>
      <a href="#tentang">Tentang</a>
      <a href="#skills">Skills</a>
      <a href="#pendidikan">Pendidikan</a>
      <a href="#portofolio">Portofolio</a>
      <a href="#kontak">Kontak</a>
    </nav>

    <div>
      <img src="foto-profil.jpg" alt="Foto profil Budi Santoso" width="150">
      <h1>Budi Santoso</h1>
      <p>Web Developer &amp; Lifelong Learner 🚀</p>
      <p>
        <a href="mailto:budi@email.com">budi@email.com</a> |
        <a href="https://github.com/budi" target="_blank">GitHub</a> |
        <a href="https://linkedin.com/in/budi" target="_blank">LinkedIn</a>
      </p>
    </div>
  </header>

  <!-- ════════════ MAIN CONTENT ════════════ -->
  <main>

    <!-- Tentang Saya -->
    <section id="tentang">
      <h2>Tentang Saya</h2>
      <p>
        Halo! Saya Budi, seorang yang sangat antusias dengan dunia teknologi.
        Saat ini saya sedang mendalami web development, dimulai dari HTML dan CSS,
        menuju JavaScript dan framework modern.
      </p>
      <p>
        Di luar coding, saya suka membaca buku, hiking di akhir pekan,
        dan berbagi pengetahuan di komunitas tech lokal.
      </p>
      <p>
        Tujuan saya: menjadi <strong>Full-Stack Developer</strong> yang bisa
        membangun produk digital yang bermanfaat bagi masyarakat Indonesia.
      </p>

      <details>
        <summary>Baca lebih lanjut tentang perjalanan saya...</summary>
        <p>
          Perjalanan saya di dunia coding dimulai dari rasa penasaran saat
          melihat teman berhasil membuat website sendiri. Awalnya berat,
          tapi makin lama makin seru. Setiap hari ada hal baru yang dipelajari!
        </p>
      </details>
    </section>

    <!-- Skills -->
    <section id="skills">
      <h2>Skills &amp; Kemampuan</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Skill</th>
            <th>Level</th>
            <th>Pengalaman</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HTML5</strong></td>
            <td>⭐⭐⭐⭐ Mahir</td>
            <td>6 bulan</td>
            <td>Semantic HTML, forms, accessibility</td>
          </tr>
          <tr>
            <td><strong>CSS3</strong></td>
            <td>⭐⭐⭐ Menengah</td>
            <td>4 bulan</td>
            <td>Flexbox, Grid, responsive design</td>
          </tr>
          <tr>
            <td><strong>JavaScript</strong></td>
            <td>⭐⭐ Pemula</td>
            <td>2 bulan</td>
            <td>Dasar-dasar, DOM manipulation</td>
          </tr>
          <tr>
            <td><strong>Git &amp; GitHub</strong></td>
            <td>⭐⭐⭐ Menengah</td>
            <td>4 bulan</td>
            <td>Version control, kolaborasi</td>
          </tr>
          <tr>
            <td><strong>VS Code</strong></td>
            <td>⭐⭐⭐⭐ Mahir</td>
            <td>6 bulan</td>
            <td>Extensions, shortcuts, debugging</td>
          </tr>
        </tbody>
      </table>

      <h3>Soft Skills</h3>
      <ul>
        <li>Komunikasi yang baik</li>
        <li>Problem solving</li>
        <li>Belajar mandiri dan cepat</li>
        <li>Kerja sama tim</li>
        <li>Manajemen waktu</li>
      </ul>
    </section>

    <!-- Pendidikan & Pengalaman -->
    <section id="pendidikan">
      <h2>Pendidikan &amp; Pengalaman</h2>

      <article>
        <h3>🎓 Pendidikan</h3>

        <h4>S1 Manajemen Informatika</h4>
        <p>Universitas Nusantara | <time datetime="2019">2019</time> –
           <time datetime="2023">2023</time></p>
        <p>IPK: 3.7/4.0 | Predikat: Cumlaude</p>
        <ul>
          <li>Mengambil konsentrasi Sistem Informasi Bisnis</li>
          <li>Ketua Himpunan Mahasiswa Informatika</li>
          <li>Peserta aktif hackathon nasional</li>
        </ul>
      </article>

      <article>
        <h3>💼 Pengalaman</h3>

        <h4>Junior Web Developer — PT Teknologi Maju</h4>
        <p><time datetime="2023-07">Juli 2023</time> – Sekarang | Jakarta, Indonesia</p>
        <ul>
          <li>Mengembangkan fitur front-end menggunakan HTML, CSS, dan JavaScript</li>
          <li>Berkolaborasi dengan tim desain menggunakan Figma</li>
          <li>Memperbaiki bug dan meningkatkan performa halaman web</li>
          <li>Berpartisipasi dalam code review mingguan</li>
        </ul>

        <h4>Magang Frontend Developer — Startup Lokal</h4>
        <p><time datetime="2023-01">Januari</time> –
           <time datetime="2023-06">Juni 2023</time> | Remote</p>
        <ul>
          <li>Membantu pengembangan landing page produk</li>
          <li>Belajar workflow profesional tim development</li>
        </ul>
      </article>

      <article>
        <h3>📜 Sertifikasi</h3>
        <ul>
          <li>
            <strong>Responsive Web Design</strong> — freeCodeCamp
            (<time datetime="2023-03">Maret 2023</time>)
          </li>
          <li>
            <strong>JavaScript Algorithms and Data Structures</strong> — freeCodeCamp
            (<time datetime="2023-06">Juni 2023</time>)
          </li>
          <li>
            <strong>Git Essential Training</strong> — LinkedIn Learning
            (<time datetime="2022-12">Desember 2022</time>)
          </li>
        </ul>
      </article>
    </section>

    <!-- Portofolio -->
    <section id="portofolio">
      <h2>Portofolio Proyek</h2>

      <article>
        <h3>🌐 Website Toko Online Lokal</h3>
        <p><strong>Teknologi:</strong> HTML, CSS, JavaScript</p>
        <p>
          Website e-commerce sederhana untuk toko kerajinan tangan lokal.
          Fitur: katalog produk, keranjang belanja, form pemesanan.
        </p>
        <p>
          <a href="https://github.com/budi/toko-online" target="_blank">
            Lihat di GitHub
          </a> |
          <a href="https://budi-toko.netlify.app" target="_blank">
            Demo Live
          </a>
        </p>
      </article>

      <article>
        <h3>📱 App Kalkulator Keuangan</h3>
        <p><strong>Teknologi:</strong> HTML, CSS, JavaScript</p>
        <p>
          Kalkulator untuk menghitung cicilan KPR, bunga deposito,
          dan perencanaan dana pensiun.
        </p>
        <p>
          <a href="https://github.com/budi/kalkulator" target="_blank">GitHub</a> |
          <a href="https://budi-calc.netlify.app" target="_blank">Demo</a>
        </p>
      </article>

      <article>
        <h3>📝 Blog Personal</h3>
        <p><strong>Teknologi:</strong> HTML, CSS</p>
        <p>
          Blog pribadi berisi catatan perjalanan belajar coding,
          review buku, dan tips produktivitas.
        </p>
        <p>
          <a href="https://budi-blog.netlify.app" target="_blank">Kunjungi Blog</a>
        </p>
      </article>
    </section>

    <!-- Kontak -->
    <section id="kontak">
      <h2>Hubungi Saya</h2>

      <address>
        <p>📧 Email: <a href="mailto:budi@email.com">budi@email.com</a></p>
        <p>📱 HP/WA: <a href="tel:+6281234567890">+62 812-3456-7890</a></p>
        <p>📍 Lokasi: Jakarta, Indonesia</p>
        <p>🐙 GitHub: <a href="https://github.com/budi" target="_blank">github.com/budi</a></p>
        <p>💼 LinkedIn: <a href="https://linkedin.com/in/budi" target="_blank">linkedin.com/in/budi</a></p>
      </address>

      <h3>Kirim Pesan</h3>
      <form action="/kirim-pesan" method="POST">
        <label for="namaKontak">Nama Kamu:</label><br>
        <input type="text" id="namaKontak" name="nama"
               placeholder="Nama lengkap" required><br><br>

        <label for="emailKontak">Email Kamu:</label><br>
        <input type="email" id="emailKontak" name="email"
               placeholder="email@contoh.com" required><br><br>

        <label for="subjek">Subjek:</label><br>
        <input type="text" id="subjek" name="subjek"
               placeholder="Perihal pesan"><br><br>

        <label for="isiPesan">Pesan:</label><br>
        <textarea id="isiPesan" name="pesan" rows="5"
                  placeholder="Tulis pesanmu di sini..." required></textarea><br><br>

        <button type="submit">Kirim Pesan 📨</button>
      </form>
    </section>

  </main>

  <!-- ════════════ FOOTER ════════════ -->
  <footer>
    <p>
      <a href="https://github.com/budi">GitHub</a> |
      <a href="https://linkedin.com/in/budi">LinkedIn</a> |
      <a href="https://twitter.com/budi">Twitter</a>
    </p>
    <p>&copy; <time datetime="2024">2024</time> Budi Santoso.
       Dibuat dengan ❤️ menggunakan HTML murni.</p>
  </footer>

</body>
</html>
\`\`\`

---

## 🎨 Langkah Selanjutnya

Halaman ini sudah fungsional tapi masih "polos". Di kursus CSS nanti, kamu akan:
- Tambahkan warna, font cantik, dan background yang menarik
- Buat layout yang rapi dengan Flexbox dan Grid
- Animasi hover effect pada link dan tombol
- Buat tampilannya responsif di HP

---

## 📝 Rangkuman Kursus HTML Lengkap

| Modul | Topik |
|-------|-------|
| 1 | Struktur HTML, heading, paragraf, teks formatting |
| 2 | Link, gambar, list |
| 3 | Tabel — cara sajikan data |
| 4 | Form & Input — terima masukan pengguna |
| 5 | Semantic HTML — HTML yang bermakna |
| 6 | Proyek akhir — halaman profil personal |

**Kamu sekarang bisa:**
- Membuat halaman web dari nol
- Menyajikan berbagai jenis konten dengan tag yang tepat
- Membuat form interaktif
- Menulis HTML yang ramah SEO dan accessibility

> **Selamat menyelesaikan kursus HTML! Langkah selanjutnya: pelajari CSS untuk membuat tampilan website jadi luar biasa!** 🎉🎨
`;
