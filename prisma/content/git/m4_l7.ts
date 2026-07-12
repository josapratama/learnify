export const git_l7 = `
# Teknik Git Lanjutan — Rebase, Stash & Reset

Kamu sudah bisa commit, branch, merge, dan push ke GitHub. Sekarang naik satu level ke teknik-teknik yang membedakan junior dari senior dalam penggunaan Git.

---

## 📦 Git Stash — Simpan Sementara

Kamu sedang coding di tengah jalan — perubahan sudah ada tapi belum selesai, tidak mau di-commit setengah jadi. Tiba-tiba ada bug urgent yang harus diperbaiki sekarang.

\`git stash\` menyimpan perubahan ke "laci" sementara, membersihkan working tree, lalu bisa dikembalikan kapan saja.

\`\`\`bash
# Situasi: sedang edit fitur-A, perlu fix bug urgent
git status
# Modified: fitur-a.js, fitur-a.css (belum selesai)

# Simpan ke stash
git stash push -m "WIP: setengah jadi form upload foto"

# Working tree bersih — bisa fix bug
git switch fix/urgent-bug
# ...kerjakan bug...
git commit -m "fix: Perbaiki crash saat upload"
git switch -    # Kembali ke branch sebelumnya

# Kembalikan perubahan
git stash pop    # Ambil stash terbaru, hapus dari stash
git stash apply  # Ambil stash terbaru, TETAP simpan di stash

# Lihat semua stash
git stash list
# stash@{0}: WIP: setengah jadi form upload foto

# Hapus stash
git stash drop stash@{0}
git stash clear   # Hapus semua
\`\`\`

---

## 🔄 Git Rebase — Riwayat yang Rapi

### Analogi: Rebase Seperti Rekonstruksi Bangunan

Merge menambahkan "jembatan" antara dua alur (commit merge baru). Rebase "memindahkan" seluruh alur Anda ke ujung alur lain — seolah Anda mulai dari kondisi terbaru.

\`\`\`
MERGE:
main:    A---B---C---M    ← M adalah commit merge
              \\     /
feature:      D---E

REBASE:
main:    A---B---C---D'---E'   ← D dan E di-"replay" ulang di atas C
\`\`\`

**Kapan pakai rebase vs merge?**

| Situasi | Gunakan |
|---------|---------|
| Sync branch lokal dengan main terbaru | Rebase |
| Gabungkan fitur selesai ke main | Merge |
| History publik (sudah di-push) | Merge (JANGAN rebase!) |
| History privat (belum di-push) | Rebase |

\`\`\`bash
# Scenario: branch fitur tertinggal dari main

# Di branch fitur
git switch fitur/dashboard

# Rebase ke main terbaru
git rebase main

# Jika ada conflict saat rebase:
# 1. Resolve conflict di file
# 2. git add file-yang-conflict
# 3. git rebase --continue
# (atau git rebase --abort untuk batalkan)

# Setelah rebase, push ke GitHub (perlu --force karena history berubah)
git push origin fitur/dashboard --force-with-lease
# --force-with-lease lebih aman dari --force biasa
\`\`\`

### Interactive Rebase — Edit Riwayat Commit

\`\`\`bash
# Edit 3 commit terakhir secara interaktif
git rebase -i HEAD~3

# Muncul editor dengan:
# pick a1b2c3d Commit pertama
# pick b2c3d4e Commit kedua
# pick c3d4e5f Commit ketiga

# Ganti "pick" dengan:
# r (reword)  = ubah pesan commit
# e (edit)    = berhenti dan edit file
# s (squash)  = gabungkan dengan commit sebelumnya
# d (drop)    = hapus commit ini
\`\`\`

**Squash commits** (gabungkan banyak WIP commits jadi satu):
\`\`\`bash
# 5 commit WIP menjadi 1 commit yang rapi
git rebase -i HEAD~5

# pick a1b2c3d WIP: mulai form
# s b2c3d4e WIP: tambah validasi
# s c3d4e5f WIP: fix typo
# s d4e5f6a WIP: styling
# s e5f6a7b WIP: selesai

# Semua commit dengan "s" digabung ke commit "pick" di atasnya
# Akan diminta tulis pesan commit baru:
# feat: Implementasi form registrasi dengan validasi
\`\`\`

---

## 🔁 Git Reset — Mundur ke Masa Lalu

**Perhatian:** Reset yang mengubah history publik bisa merepotkan tim. Gunakan dengan hati-hati.

\`\`\`bash
# Reset mode (dari aman ke berbahaya):

# --soft: Batalkan commit, tapi perubahan tetap di staging
git reset --soft HEAD~1   # Batalkan 1 commit terakhir

# --mixed (default): Batalkan commit dan staging, perubahan ada di working tree
git reset HEAD~1          # Sama dengan --mixed

# --hard: Batalkan commit, staging, DAN perubahan (HATI-HATI!)
git reset --hard HEAD~1   # Semua perubahan HILANG!

# Pergi ke commit tertentu
git reset --hard a1b2c3d

# Aman: "batalkan" commit yang sudah di-push dengan membuat commit baru
git revert HEAD           # Buat commit yang membalik commit terakhir
git revert a1b2c3d        # Balik commit tertentu
\`\`\`

---

## 🍒 Git Cherry-pick — Ambil Commit Tertentu

Ingin mengambil hanya satu commit dari branch lain tanpa merge seluruhnya:

\`\`\`bash
# Lihat riwayat branch lain
git log --oneline fitur/eksperimen

# Ambil commit tertentu ke branch saat ini
git cherry-pick a1b2c3d

# Ambil beberapa commit
git cherry-pick a1b2c3d b2c3d4e

# Cherry-pick dengan modifikasi (tanpa auto-commit dulu)
git cherry-pick -n a1b2c3d
# edit jika perlu, lalu:
git commit -m "cherry-pick: ambil fitur X dari eksperimen"
\`\`\`

---

## 🔍 Git Bisect — Cari Commit Penyebab Bug

Bug ditemukan hari ini, tapi kapan mulai rusak? Git Bisect melakukan binary search di seluruh riwayat commit:

\`\`\`bash
# Mulai bisect
git bisect start

# Tandai kondisi saat ini sebagai "rusak"
git bisect bad

# Tandai commit lama yang masih bagus
git bisect good a1b2c3d

# Git akan checkout commit di tengah-tengah
# Test apakah bug ada di sini:
# - Kalau ada: git bisect bad
# - Kalau tidak: git bisect good

# Ulangi sampai Git menemukan commit penyebab bug!
# Output akhir:
# a5b6c7d8 is the first bad commit
# commit a5b6c7d8
# Author: Developer <dev@email.com>
# feat: Tambah sorting di tabel produk

# Selesai bisect
git bisect reset
\`\`\`

---

## 🏷️ Git Tag — Penanda Versi

\`\`\`bash
# Buat tag versi rilis
git tag v1.0.0
git tag v1.0.0 -m "Rilis pertama dengan fitur login dan dashboard"

# Lihat semua tag
git tag

# Push tag ke GitHub
git push origin v1.0.0
git push origin --tags    # Push semua tag

# Checkout ke versi tertentu
git checkout v1.0.0
\`\`\`

---

## 📝 Ringkasan

| Perintah | Kapan Digunakan |
|----------|----------------|
| \`git stash\` | Simpan perubahan sementara, bersihkan working tree |
| \`git rebase\` | Sync branch dengan main, riwayat lebih rapi |
| \`git rebase -i\` | Edit/squash riwayat commit |
| \`git reset\` | Batalkan commit (lokal/private) |
| \`git revert\` | Batalkan commit yang sudah di-push |
| \`git cherry-pick\` | Ambil commit tertentu dari branch lain |
| \`git bisect\` | Cari commit penyebab bug |
| \`git tag\` | Tandai rilis/versi |

> **Di modul terakhir, kita bahas Git workflow profesional dan best practices!** 🏆
`;
