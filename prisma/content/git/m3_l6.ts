export const git_l6 = `
# Kolaborasi Tim — Fork, Pull Request & Code Review

Sejauh ini kita pakai Git untuk proyek sendiri. Sekarang level berikutnya: **kolaborasi dengan orang lain**.

Di tim profesional, tidak ada yang push langsung ke \`main\`. Semua perubahan melalui proses yang terstruktur: buat branch → kerjakan → ajukan untuk di-review → setelah disetujui, baru digabungkan.

Ini menjaga kualitas kode dan memastikan tidak ada yang merusak apa yang sudah jalan.

---

## 🍴 Fork — Salin Repo Orang Lain

Fork = membuat salinan repo ke akun GitHub kamu sendiri. Digunakan saat ingin berkontribusi ke proyek orang lain atau proyek open source.

\`\`\`bash
# Setelah fork di GitHub, clone repo fork kamu
git clone git@github.com:USERNAME_KAMU/nama-repo-fork.git
cd nama-repo-fork

# Tambahkan repo asli sebagai upstream
git remote add upstream git@github.com:PEMILIK_ASLI/nama-repo.git

# Verifikasi
git remote -v
# origin    git@github.com:USERNAME_KAMU/nama-repo-fork.git
# upstream  git@github.com:PEMILIK_ASLI/nama-repo.git
\`\`\`

---

## 📤 Alur Kontribusi Lengkap

\`\`\`bash
# 1. Pastikan fork Anda up-to-date dengan repo asli
git fetch upstream
git switch main
git merge upstream/main
git push origin main

# 2. Buat branch baru untuk perubahan Anda
git switch -c fix/typo-di-readme

# 3. Buat perubahan
# (edit file yang perlu diperbaiki)

# 4. Commit
git add .
git commit -m "fix: Perbaiki typo di README.md"

# 5. Push ke fork Anda
git push origin fix/typo-di-readme
\`\`\`

---

## 📬 Buat Pull Request

Setelah push ke fork:

1. Buka halaman repo fork Anda di GitHub
2. Klik **"Compare & pull request"** (banner kuning yang muncul)
3. Isi form PR:
   - **Title**: Ringkasan singkat perubahan
   - **Description**: Penjelasan detail, screenshot jika ada
4. Klik **"Create pull request"**

### Contoh Deskripsi PR yang Baik

\`\`\`markdown
## Perubahan yang Dilakukan
- Perbaiki typo "hallo" menjadi "halo" di README.md
- Update nomor versi di header

## Jenis Perubahan
- [x] Bug fix
- [ ] Fitur baru
- [ ] Breaking change

## Screenshot (jika ada)
[lampirkan screenshot sebelum/sesudah]

## Checklist
- [x] Kode sudah saya test
- [x] Tidak ada breaking change
\`\`\`

---

## 👀 Code Review

Setelah PR diajukan, maintainer (atau rekan tim) akan mereview:

### Yang Dilakukan Reviewer

\`\`\`
1. Baca perubahan di tab "Files changed"
2. Beri komentar di baris yang perlu didiskusikan
3. Pilih satu dari tiga opsi:
   - ✅ Approve (setuju, siap di-merge)
   - 💬 Comment (ada yang perlu didiskusikan)
   - ❌ Request changes (harus diperbaiki dulu)
\`\`\`

### Respons terhadap Review

\`\`\`bash
# Jika reviewer minta perubahan:
# 1. Edit file sesuai saran
git add .
git commit -m "fix: Perbaiki sesuai review - tambah validasi input"

# 2. Push ke branch yang sama (PR akan otomatis update)
git push origin fix/typo-di-readme
\`\`\`

---

## 🏢 Git Workflow untuk Tim (GitHub Flow)

Ini adalah workflow yang digunakan sebagian besar tim modern:

\`\`\`
main ────────────────────────────────────────────────►
      |              |                    |
      ↓              ↓                    ↓
  [branch]      [branch]            [branch]
  fitur-A       fix-bug-B           fitur-C
      |              |                    |
   [PR review]   [PR review]         [PR review]
      |              |                    |
      └──────────────┴────────────────────┘
                 (semua merge ke main)
\`\`\`

**Aturan GitHub Flow:**
1. \`main\` selalu dalam kondisi stabil & bisa di-deploy
2. Semua perubahan dibuat di branch baru
3. Semua branch merge melalui PR
4. PR harus di-review sebelum di-merge
5. Deploy setelah merge ke \`main\`

---

## 🏷️ Issues — Sistem Pelacakan Tugas

GitHub Issues adalah cara untuk melacak bug, fitur yang diinginkan, dan diskusi:

\`\`\`markdown
# Buat Issue yang Baik

**Judul:** [BUG] Tombol submit tidak berfungsi di Safari

**Deskripsi:**
Saat mengklik tombol submit di form registrasi, tidak ada respon.

**Langkah Reproduksi:**
1. Buka halaman /register di Safari
2. Isi semua field
3. Klik "Daftar"
4. Tidak ada yang terjadi (tidak ada error console)

**Expected Behavior:** Form tersubmit dan redirect ke dashboard

**Screenshots:** [lampirkan]

**Environment:** Safari 17, macOS Sonoma
\`\`\`

### Hubungkan Issue dengan PR

\`\`\`bash
# Di commit message atau deskripsi PR:
git commit -m "fix: Perbaiki tombol submit di Safari

Closes #42"    ← GitHub akan otomatis close Issue #42 saat PR di-merge!
\`\`\`

---

## 🤖 GitHub Actions (Preview)

GitHub bisa otomatis menjalankan test, build, dan deploy setiap kali ada push:

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
\`\`\`

---

## 📝 Ringkasan

- Fork = salinan repo ke akun sendiri untuk bereksperimen bebas
- Pull Request (PR) = proposal untuk menggabungkan perubahan Anda
- Code Review = proses pemeriksaan kode oleh rekan sebelum merge
- GitHub Flow = branch → PR → review → merge ke main
- Issues = sistem pelacakan tugas dan bug di GitHub

> **Di modul berikutnya, kita pelajari teknik-teknik Git lanjutan seperti rebase, stash, dan reset!** 🚀
`;
