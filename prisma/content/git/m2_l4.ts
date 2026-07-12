export const git_l4 = `
# Branching & Merging — Cara Kerja Paralel Tanpa Kekacauan

Ini salah satu fitur Git yang paling mengubah cara developer bekerja.

Bayangkan sebuah tim tanpa branch: semua orang push ke satu tempat yang sama. Developer A belum selesai fitur login, tapi sudah push kode setengah jadi. Developer B tiba-tiba dapat bug kritis di production dan harus perbaiki sekarang — tapi kode Developer A yang setengah jadi bikin aplikasi tidak bisa jalan.

Kacau.

**Branch** adalah solusinya: setiap pekerjaan berjalan di "jalur" terpisah, tidak saling ganggu, dan digabungkan hanya saat sudah siap.

---

## 🌿 Cara Kerjanya

Branch itu sebenarnya cuma "label" yang menunjuk ke suatu commit. Saat kamu buat branch baru, Git tidak duplikasi semua file — dia cuma buat pointer baru. Ringan dan instan.

\`\`\`
main:    A---B---C           ← Branch utama (stabil)
                  \\
fitur:            D---E      ← Branch fitur (sedang dikerjakan)
\`\`\`

Developer A bisa bikin branch \`fitur/login\`, kerja di sana, commit sesuka hati. Developer B bikin branch \`fix/crash-button\`, selesai dalam sejam, merge ke main. Keduanya tidak saling terganggu.

---

## 🌱 Perintah Branch yang Sering Dipakai

\`\`\`bash
# Lihat semua branch (* = branch yang aktif sekarang)
git branch

# Buat branch baru
git branch nama-branch

# Pindah ke branch lain
git switch nama-branch       # Cara modern (Git 2.23+)
git checkout nama-branch     # Cara lama, masih banyak dipakai

# Buat branch sekaligus langsung pindah ke sana — yang paling sering dipakai
git switch -c nama-branch
git checkout -b nama-branch  # Cara lama, sama hasilnya

# Balik ke branch sebelumnya
git switch -
\`\`\`

---

## 💻 Praktik Langsung

\`\`\`bash
# Mulai dari main
git switch main

# Buat branch untuk halaman baru
git switch -c fitur/halaman-tentang

# Kerja di branch ini — buat file baru
cat > tentang.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
    <h1>Tentang Kami</h1>
    <p>Kami adalah tim yang belajar Git.</p>
</body>
</html>
EOF

git add tentang.html
git commit -m "feat: Tambah halaman tentang kami"

# Tambah konten lagi
echo "<p>Berdiri sejak 2024</p>" >> tentang.html
git add tentang.html
git commit -m "feat: Tambah info tahun berdiri"

# Lihat riwayat semua branch secara visual
git log --oneline --all --graph
\`\`\`

**Output log — bisa kelihatan percabangannya:**
\`\`\`
* c4d5e6f (HEAD -> fitur/halaman-tentang) feat: Tambah info tahun berdiri
* b3c4d5e feat: Tambah halaman tentang kami
* a2b3c4d (main) feat: Buat halaman index dasar
\`\`\`

---

## 🔀 Merge — Gabungkan Branch

Setelah fitur selesai, gabungkan ke branch utama:

\`\`\`bash
# 1. Kembali ke branch tujuan (biasanya main)
git switch main

# 2. Merge branch fitur ke main
git merge fitur/halaman-tentang

# Output saat merge berhasil (fast-forward):
# Updating a2b3c4d..c4d5e6f
# Fast-forward
#  tentang.html | 7 +++++++
#  1 file changed, 7 insertions(+)
#  create mode 100644 tentang.html

# 3. Hapus branch yang sudah selesai (opsional tapi direkomendasikan)
git branch -d fitur/halaman-tentang
\`\`\`

### Jenis-jenis Merge

**Fast-forward merge** (paling sederhana):
\`\`\`
Sebelum:
main:    A---B
              \\
feature:      C---D

Sesudah merge (fast-forward):
main:    A---B---C---D
\`\`\`

**Three-way merge** (ketika main juga punya commit baru):
\`\`\`
Sebelum:
main:    A---B---E
              \\
feature:      C---D

Sesudah merge (buat commit baru M):
main:    A---B---E---M
              \\     /
feature:      C---D
\`\`\`

---

## ⚔️ Merge Conflict — Ketika Git Tidak Bisa Putuskan Sendiri

Conflict terjadi ketika dua branch **mengubah baris yang sama** di file yang sama. Git tidak bisa tebak versi mana yang benar — kamu yang harus putuskan.

\`\`\`bash
# Simulasi conflict:
# Di main, kita edit baris yang sama
git switch main
echo "<p>Footer dari main</p>" >> index.html
git add index.html
git commit -m "edit: Update footer di main"

# Di branch lain, kita edit baris yang sama
git switch -c branch-lain
# (edit index.html, baris yang sama)
echo "<p>Footer dari branch-lain</p>" >> index.html
git add index.html
git commit -m "edit: Update footer di branch-lain"

git switch main
git merge branch-lain   # 💥 Conflict!
\`\`\`

**Output:**
\`\`\`
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
\`\`\`

**Isi file yang conflict — Git kasih marker:**
\`\`\`html
<body>
<<<<<<< HEAD
    <p>Footer dari main</p>
=======
    <p>Footer dari branch-lain</p>
>>>>>>> branch-lain
</body>
\`\`\`

**Cara resolve:**
1. Buka file, hapus marker \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`
2. Pilih versi yang benar, atau gabungkan keduanya
3. \`git add index.html\`
4. \`git commit -m "merge: Resolve conflict footer"\`

Di VS Code ada tampilan visual yang memudahkan — "Accept Current Change", "Accept Incoming Change", atau "Accept Both Changes".

---

## 🏷️ Konvensi Penamaan Branch

Konsistensi nama branch penting supaya tim tahu isi branch dari namanya saja:

\`\`\`bash
fitur/nama-fitur        # Fitur baru
fix/nama-bug            # Perbaikan bug biasa
hotfix/critical-bug     # Perbaikan darurat di production
release/v1.2.0          # Persiapan rilis
docs/update-readme      # Perubahan dokumentasi

# Contoh nyata:
git switch -c fitur/sistem-autentikasi
git switch -c fix/crash-saat-logout
git switch -c hotfix/kerentanan-login
git switch -c docs/panduan-kontribusi
\`\`\`

---

## 📝 Ringkasan

| Perintah | Fungsi |
|----------|--------|
| \`git branch\` | Lihat semua branch |
| \`git switch -c nama\` | Buat & pindah ke branch baru |
| \`git switch main\` | Kembali ke main |
| \`git merge nama-branch\` | Gabungkan branch ke branch aktif |
| \`git branch -d nama\` | Hapus branch |

Branch = jalur pengembangan paralel yang aman. Merge = gabungkan hasilnya. Conflict = perlu keputusan manual dari kamu.

Satu aturan yang bagus: **satu branch untuk satu tujuan**. Jangan kerjakan dua fitur berbeda dalam satu branch — akan sulit di-review dan rawan conflict.

> **Di pelajaran berikutnya, kita hubungkan repo lokal ke GitHub — supaya kodenya ada di cloud dan bisa dikolaborasikan!** ☁️
`;
