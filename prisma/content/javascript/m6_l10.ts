export const js_l10 = `
# Node.js Dasar — JavaScript di Sisi Server

Selama ini JavaScript kita jalankan di browser. **Node.js** memungkinkan JavaScript berjalan di server — artinya kamu bisa buat backend API, tool CLI, script otomasi, semuanya pakai bahasa yang sama.

---

## 🤔 Kenapa Node.js?

- **Satu bahasa** untuk frontend dan backend — tidak perlu belajar PHP atau Python terpisah
- **Non-blocking I/O** — bisa handle ribuan koneksi bersamaan dengan resource minimal
- **npm** — ekosistem package terbesar di dunia (2+ juta package)
- Dipakai oleh Netflix, LinkedIn, Uber, PayPal

---

## 🛠️ Setup

\`\`\`bash
# Install Node.js dari https://nodejs.org (pilih LTS)
# Cek versi
node --version    # v20.x.x
npm --version     # 10.x.x

# Jalankan file JavaScript langsung
node hello.js

# REPL — interactive shell
node
> 2 + 2        # 4
> .exit         # Keluar
\`\`\`

---

## 📦 Module System — CommonJS vs ES Modules

\`\`\`javascript
// CommonJS (cara lama, masih banyak dipakai)
// require() dan module.exports

// math.js
function tambah(a, b) { return a + b; }
function kali(a, b)   { return a * b; }

module.exports = { tambah, kali };
// atau: module.exports.tambah = tambah;

// app.js
const math = require("./math");
console.log(math.tambah(2, 3));  // 5

const { tambah, kali } = require("./math");
console.log(kali(4, 5));  // 20

// ─────────────────────────────────────

// ES Modules (cara modern, pakai di package.json: "type": "module")
// import dan export

// math.mjs (atau package.json punya "type": "module")
export function tambah(a, b) { return a + b; }
export function kali(a, b)   { return a * b; }
export default { tambah, kali };

// app.mjs
import { tambah, kali } from "./math.mjs";
import math from "./math.mjs";

// Import package dari npm
import express from "express";
import { readFile } from "fs/promises";
\`\`\`

---

## 📂 File System (fs) — Baca Tulis File

\`\`\`javascript
import { readFile, writeFile, readdir, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname tidak ada di ES Modules, ini gantinya:
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function contohFS() {
    // Baca file teks
    const isi = await readFile("./data.txt", "utf-8");
    console.log(isi);

    // Tulis file
    await writeFile("./output.txt", "Halo dari Node.js!\n");

    // Append ke file
    await writeFile("./output.txt", "Baris baru\n", { flag: "a" });

    // Baca semua file dalam folder
    const files = await readdir("./src");
    console.log("Files:", files);

    // Buat folder kalau belum ada
    if (!existsSync("./build")) {
        await mkdir("./build", { recursive: true });
    }

    // Hapus file
    await unlink("./temp.txt");

    // Baca file JSON
    const rawData = await readFile("./config.json", "utf-8");
    const config  = JSON.parse(rawData);

    // Tulis file JSON
    const data = { nama: "Budi", umur: 25 };
    await writeFile("./user.json", JSON.stringify(data, null, 2));
}

contohFS().catch(console.error);
\`\`\`

---

## 🌐 HTTP Server Bawaan Node.js

\`\`\`javascript
import { createServer } from "http";
import { readFile } from "fs/promises";
import path from "path";

const PORT = 3000;

const server = createServer(async (req, res) => {
    const url    = req.url;
    const method = req.method;

    console.log(\`\${method} \${url}\`);

    // Routing sederhana
    if (url === "/" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Halo dari Node.js!</h1>");

    } else if (url === "/api/halo" && method === "GET") {
        const data = { pesan: "Halo dari API!", waktu: new Date().toISOString() };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));

    } else if (url === "/api/data" && method === "POST") {
        // Baca body dari POST request
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", () => {
            const data = JSON.parse(body);
            console.log("Data diterima:", data);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ sukses: true, data }));
        });

    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route tidak ditemukan" }));
    }
});

server.listen(PORT, () => {
    console.log(\`Server berjalan di http://localhost:\${PORT}\`);
});
\`\`\`

---

## ⚡ Express.js — Framework Web Minimalis

\`\`\`bash
npm init -y
npm install express
\`\`\`

\`\`\`javascript
import express from "express";

const app  = express();
const PORT = 3000;

// Middleware — proses request sebelum sampai handler
app.use(express.json());           // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// Logging middleware custom
app.use((req, res, next) => {
    console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
    next();  // Lanjut ke handler berikutnya
});

// ─── Routes ───
app.get("/", (req, res) => {
    res.send("Halo dari Express!");
});

// Route dengan parameter
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    res.json({ userId: id, nama: "Budi" });
});

// Query string: /search?q=laptop&limit=10
app.get("/search", (req, res) => {
    const { q = "", limit = 10 } = req.query;
    res.json({ query: q, limit: Number(limit), hasil: [] });
});

// POST — terima dan proses data
app.post("/users", (req, res) => {
    const { nama, email } = req.body;

    if (!nama || !email) {
        return res.status(400).json({ error: "nama dan email wajib" });
    }

    const user = { id: Date.now(), nama, email, dibuat: new Date() };
    res.status(201).json({ sukses: true, data: user });
});

// PUT — update
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const update  = req.body;
    res.json({ sukses: true, id, update });
});

// DELETE
app.delete("/users/:id", (req, res) => {
    res.json({ sukses: true, pesan: \`User \${req.params.id} dihapus\` });
});

// Error handling middleware (4 parameter!)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route tidak ditemukan" });
});

app.listen(PORT, () => console.log(\`Express berjalan di http://localhost:\${PORT}\`));
\`\`\`

---

## 📦 npm — Kelola Package

\`\`\`bash
# Buat project baru
npm init -y

# Install package
npm install express            # Dependency
npm install --save-dev nodemon  # Dev dependency (tidak masuk production)
npm install -g typescript       # Global

# Jalankan script dari package.json
npm run dev
npm start
npm test

# package.json scripts
{
  "scripts": {
    "start": "node src/index.js",
    "dev":   "nodemon src/index.js",
    "build": "tsc",
    "test":  "jest"
  }
}

# Hapus package
npm uninstall express

# Update semua package
npm update

# Audit keamanan
npm audit
npm audit fix
\`\`\`

---

## 🎯 Praktik: REST API dengan Data In-Memory

\`\`\`javascript
import express from "express";

const app = express();
app.use(express.json());

// Data in-memory (produksi pakai database)
let produk = [
    { id: 1, nama: "Laptop ASUS", harga: 8500000, stok: 10 },
    { id: 2, nama: "Mouse Logitech", harga: 150000, stok: 50 },
    { id: 3, nama: "Keyboard Mechanical", harga: 750000, stok: 25 },
];
let nextId = 4;

// GET semua produk
app.get("/api/produk", (req, res) => {
    const { search, minHarga, maxHarga } = req.query;
    let hasil = [...produk];

    if (search) {
        hasil = hasil.filter(p =>
            p.nama.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (minHarga) hasil = hasil.filter(p => p.harga >= Number(minHarga));
    if (maxHarga) hasil = hasil.filter(p => p.harga <= Number(maxHarga));

    res.json({ data: hasil, total: hasil.length });
});

// GET satu produk
app.get("/api/produk/:id", (req, res) => {
    const item = produk.find(p => p.id === Number(req.params.id));
    if (!item) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json({ data: item });
});

// POST tambah produk
app.post("/api/produk", (req, res) => {
    const { nama, harga, stok } = req.body;
    if (!nama || !harga) {
        return res.status(400).json({ error: "nama dan harga wajib" });
    }
    const baru = { id: nextId++, nama, harga, stok: stok ?? 0 };
    produk.push(baru);
    res.status(201).json({ sukses: true, data: baru });
});

// PUT update
app.put("/api/produk/:id", (req, res) => {
    const idx = produk.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Tidak ditemukan" });
    produk[idx] = { ...produk[idx], ...req.body };
    res.json({ sukses: true, data: produk[idx] });
});

// DELETE
app.delete("/api/produk/:id", (req, res) => {
    const idx = produk.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Tidak ditemukan" });
    produk.splice(idx, 1);
    res.json({ sukses: true, pesan: "Produk dihapus" });
});

app.listen(3000, () => console.log("API berjalan di http://localhost:3000"));
\`\`\`

---

## 📝 Ringkasan

- **Node.js**: JavaScript di server — file system, HTTP, database
- **CommonJS vs ES Modules**: \`require()\` vs \`import/export\`
- **fs/promises**: baca tulis file secara async
- **Express.js**: framework web minimalis — routing, middleware, error handling
- **npm**: package manager — install, update, script
- **REST API**: GET/POST/PUT/DELETE dengan Express

> **Selanjutnya: JavaScript Testing & Tooling — pastikan kode kamu selalu benar!** 🚀
`;
