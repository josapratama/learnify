export const git_l1 = `
# Apa itu Git? — Mesin Waktu untuk Kode Anda

## 📼 Analogi: Git Seperti Tombol "Undo" yang Super Canggih

Pernah menulis dokumen Word, lalu menyesal karena sudah terlanjur dihapus dan tidak bisa dikembalikan?

Git adalah **sistem kontrol versi** — bayangkan seperti tombol Undo yang bisa:
- Kembali ke kondisi file **kapan saja** di masa lalu
- **Bekerja paralel** — coba ide baru tanpa merusak versi yang berjalan
- **Berkolaborasi** — 100 orang edit file yang sama tanpa kekacauan
- **Tahu siapa mengubah apa** — audit trail lengkap

---

## 🤔 Masalah yang Dipecahkan Git

### Tanpa Git — Situasi Familiar?

\`\`\`
📁 Proyek_Website/
├── index.html
├── index_BACKUP.html
├── index_FINAL.html
├── index_FINAL_v2.html
├── index_FINAL_BENERAN.html
└── index_FINAL_BENERAN_OK.html  ← Yang mana yang benar???
\`\`\`

Atau pernah:
- Kirim file via WhatsApp ke rekan, lalu masing-masing edit, lalu bingung versi mana yang terbaru?
- Hapus fungsi penting, baru sadar 3 hari kemudian?
- Tidak ingat **kenapa** suatu perubahan dibuat?

**Git menyelesaikan semua ini.**

---

## 🌍 Siapa yang Pakai Git?

Git bukan hanya untuk programmer! Digunakan oleh:

| Profesi | Penggunaan |
|---------|-----------|
| 💻 Developer | Kode sumber aplikasi |
| ✍️ Penulis | Draft artikel/buku dengan revisi |
| 🎨 Desainer | File desain & aset |
| 📊 Data Analyst | Script analisis data |
| 🔬 Peneliti | Paper ilmiah & dataset |
| 🏢 Perusahaan | Dokumen & konfigurasi sistem |

---

## 🧩 Konsep Kunci Git

### Repository (Repo)
Analogi: **Lemari arsip cerdas** untuk proyek Anda. Menyimpan semua file DAN seluruh riwayat perubahannya.

\`\`\`
Repo = Folder proyek + .git/ (folder tersembunyi berisi seluruh sejarah)
\`\`\`

### Commit
Analogi: **Foto snapshot** kondisi proyek di satu titik waktu. Setiap commit punya:
- Perubahan yang disimpan
- Pesan yang menjelaskan apa yang diubah
- Waktu dan nama pembuatnya

\`\`\`
Commit 1: "Buat halaman login"           ← Titik awal
Commit 2: "Tambah validasi email"        ← +2 jam kemudian
Commit 3: "Fix bug tombol submit"        ← +1 hari kemudian
Commit 4: "Desain ulang tampilan form"   ← Anda berada di sini
\`\`\`

### Branch (Cabang)
Analogi: **Paralel dunia** — cabang terpisah dari proyek utama untuk bereksperimen.

\`\`\`
main ────────────────────────────────► (versi stabil)
         └──── fitur-baru ──────────► (sedang dikembangkan)
         └──── perbaikan-bug ───────► (memperbaiki error)
\`\`\`

---

## ⚡ Git vs GitHub — Beda!

Ini yang sering membingungkan pemula:

| | Git | GitHub |
|--|-----|--------|
| **Apa** | Software di komputer Anda | Website di internet |
| **Fungsi** | Lacak perubahan file | Simpan & bagikan repo |
| **Offline?** | ✅ Bisa | ❌ Butuh internet |
| **Gratis?** | ✅ Selalu | ✅ Gratis (fitur dasar) |
| **Alternatif** | — | GitLab, Bitbucket, Gitea |

**Analogi:** Git = kamera foto Anda. GitHub = Instagram untuk menyimpan dan berbagi foto itu.

---

## 🎯 Apa yang Akan Kita Pelajari?

Di kursus ini, kita akan kuasai dari nol sampai expert:

1. ✅ Install & konfigurasi Git
2. ✅ Perintah dasar: init, add, commit, status, log
3. ✅ Branching & merging
4. ✅ GitHub: push, pull, clone
5. ✅ Kolaborasi tim: fork, pull request
6. ✅ Resolusi konflik
7. ✅ Git workflow profesional
8. ✅ Tips & trik advanced

---

## 📝 Ringkasan

- Git = sistem kontrol versi yang melacak semua perubahan file
- Bukan hanya untuk programmer — siapa pun yang bekerja dengan file bisa manfaatkan Git
- Git (lokal di komputer) ≠ GitHub (platform online)
- Konsep utama: Repository, Commit, Branch

> **Di pelajaran berikutnya, kita install Git dan siapkan identitas Anda!** 🛠️
`;
