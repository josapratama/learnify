export const js_l6 = `
# Fetch API & Async JavaScript

Semua yang kita pelajari sebelumnya berjalan secara sinkron — kode dieksekusi baris per baris, baris berikutnya tidak jalan sampai baris sebelumnya selesai.

Tapi bayangkan kalau setiap request ke server harus menunggu selesai dulu sebelum bisa lanjut. Halaman web akan beku selama data diambil. Tidak ada yang mau pakai website seperti itu.

JavaScript menyelesaikan ini dengan **async programming** — kode bisa terus berjalan sambil menunggu operasi yang lambat (request server, baca file, timer). Saat hasilnya siap, baru kode yang menangani hasil tersebut dijalankan.

---

## 🔄 Callback — Cara Lama

\`\`\`javascript
// Callback = fungsi yang dijalankan setelah operasi selesai
setTimeout(() => {
    console.log("Ini muncul setelah 2 detik");
}, 2000);

console.log("Ini muncul SEKARANG (tidak nunggu setTimeout)");
// Output urutan: "Ini muncul SEKARANG" → (2 detik) → "Ini muncul setelah 2 detik"

// Masalah callback: callback hell
getData(function(data) {
    prosesData(data, function(hasil) {
        simpanHasil(hasil, function(sukses) {
            // Bayangkan ini berlanjut 5-6 level lagi...
            // Ini disebut "callback hell" atau "pyramid of doom"
        });
    });
});
\`\`\`

---

## 🤝 Promise — Janji Nilai di Masa Depan

\`\`\`javascript
// Promise: "Saya berjanji akan memberikan nilai, entah berhasil atau gagal"

// Buat promise
const janji = new Promise((resolve, reject) => {
    const berhasil = Math.random() > 0.5;

    setTimeout(() => {
        if (berhasil) {
            resolve("Data berhasil diambil!");
        } else {
            reject(new Error("Gagal ambil data"));
        }
    }, 1000);
});

// Konsumsi promise
janji
    .then(data => console.log("Sukses:", data))
    .catch(err => console.error("Error:", err.message))
    .finally(() => console.log("Selesai (apapun hasilnya)"));

// Promise chaining
fetch("/api/user/1")
    .then(res => res.json())
    .then(user => fetch(\`/api/orders/\${user.id}\`))
    .then(res => res.json())
    .then(orders => console.log(orders))
    .catch(err => console.error(err));

// Promise.all — jalankan beberapa promise bersamaan
const [user, produk, pesanan] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/products").then(r => r.json()),
    fetch("/api/orders").then(r => r.json()),
]);
// Semua dijalankan paralel, selesai saat yang paling lambat selesai

// Promise.allSettled — seperti all tapi tidak berhenti meski ada yang gagal
const results = await Promise.allSettled([
    fetch("/api/data1"),
    fetch("/api/data2"),
    fetch("/api/data3"),
]);
results.forEach(result => {
    if (result.status === "fulfilled") console.log(result.value);
    else console.error(result.reason);
});
\`\`\`

---

## ✨ Async/Await — Cara Modern & Bersih

\`\`\`javascript
// async = fungsi yang selalu mengembalikan Promise
// await = tunggu Promise selesai (hanya bisa di dalam async function)

async function ambilPengguna(id) {
    try {
        const response = await fetch(\`/api/users/\${id}\`);

        if (!response.ok) {
            throw new Error(\`HTTP Error: \${response.status}\`);
        }

        const pengguna = await response.json();
        return pengguna;
    } catch (error) {
        console.error("Gagal ambil pengguna:", error.message);
        throw error; // Re-throw agar pemanggil bisa handle
    }
}

// Gunakan async function
async function main() {
    const pengguna = await ambilPengguna(1);
    console.log(pengguna.nama);
}

// Top-level await (di module modern)
const data = await ambilPengguna(1);
\`\`\`

---

## 🌐 Fetch API — HTTP Request

\`\`\`javascript
// GET — Ambil data
async function getProduk(id) {
    const res = await fetch(\`/api/produk/\${id}\`);
    if (!res.ok) throw new Error(\`Error \${res.status}\`);
    return res.json();
}

// POST — Kirim data
async function buatPesanan(data) {
    const res = await fetch("/api/pesanan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": \`Bearer \${token}\`
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

// PUT — Update data
async function updateProfil(id, data) {
    const res = await fetch(\`/api/users/\${id}\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

// DELETE
async function hapusProduk(id) {
    const res = await fetch(\`/api/produk/\${id}\`, { method: "DELETE" });
    return res.ok;
}

// Dengan query params
const params = new URLSearchParams({
    page: 1,
    limit: 10,
    kategori: "elektronik",
    sort: "harga"
});
const res = await fetch(\`/api/produk?\${params}\`);
\`\`\`

---

## 🛡️ Error Handling yang Baik

\`\`\`javascript
// Wrapper untuk fetch yang handle error secara konsisten
async function apiFetch(url, options = {}) {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        // Cek HTTP error
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw {
                status: res.status,
                message: errorData.message || \`HTTP Error \${res.status}\`,
            };
        }

        // Handle 204 No Content
        if (res.status === 204) return null;

        return res.json();
    } catch (error) {
        if (error.status) throw error; // Sudah diformat, re-throw

        // Network error
        throw { status: 0, message: "Tidak dapat terhubung ke server" };
    }
}

// Penggunaan
try {
    const user = await apiFetch("/api/users/1");
    console.log(user);
} catch (error) {
    if (error.status === 401) {
        window.location.href = "/login";
    } else if (error.status === 404) {
        console.log("Data tidak ditemukan");
    } else {
        console.error(error.message);
    }
}
\`\`\`

---

## 💡 Contoh Praktis: Tampilkan Data dari API

\`\`\`javascript
// Tampilkan daftar kursus dari API
async function tampilkanKursus() {
    const container = document.querySelector("#daftar-kursus");

    // Tampilkan skeleton loading
    container.innerHTML = \`
        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>
    \`;

    try {
        const kursus = await apiFetch("/api/courses?limit=6");

        container.innerHTML = kursus.map(k => \`
            <div class="kartu-kursus">
                <img src="\${k.thumbnailUrl || '/default.jpg'}" alt="\${k.title}">
                <h3>\${k.title}</h3>
                <p>\${k.instructor?.fullName}</p>
                <span>Rp\${k.price.toLocaleString("id-ID")}</span>
                <a href="/courses/\${k.slug}" class="btn-lihat">Lihat Kursus</a>
            </div>
        \`).join("");

    } catch (error) {
        container.innerHTML = \`
            <div class="error-state">
                <p>Gagal memuat kursus: \${error.message}</p>
                <button onclick="tampilkanKursus()">Coba Lagi</button>
            </div>
        \`;
    }
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", tampilkanKursus);
\`\`\`

---

## 📝 Ringkasan

| Konsep | Deskripsi |
|--------|-----------|
| Callback | Fungsi yang dipanggil setelah operasi selesai (cara lama) |
| Promise | Representasi nilai yang akan ada di masa depan |
| async/await | Sintaksis bersih untuk menulis kode async |
| fetch() | API bawaan browser untuk HTTP request |
| try/catch | Tangkap error di kode async |
| Promise.all | Jalankan banyak Promise paralel |

> **Di pelajaran berikutnya, kita belajar OOP & Prototype di JavaScript!** 🏗️
`;
