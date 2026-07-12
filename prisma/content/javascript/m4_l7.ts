export const js_l7 = `
# OOP & Module di JavaScript Modern

JavaScript modern punya sistem class yang clean dan sistem module yang sangat bagus untuk organisasi kode. Di pelajaran terakhir ini, kita tutup dengan dua topik penting ini.

---

## 🏗️ Class — OOP di JavaScript

\`\`\`javascript
class KursusOnline {
    // Static property
    static totalKursus = 0;

    // Constructor
    constructor(judul, instruktur, harga) {
        this.judul = judul;
        this.instruktur = instruktur;
        this.harga = harga;
        this.siswa = [];
        this.rating = 0;
        this.id = ++KursusOnline.totalKursus;
    }

    // Method
    daftar(namaSiswa) {
        this.siswa.push(namaSiswa);
        console.log(\`\${namaSiswa} berhasil daftar ke "\${this.judul}"\`);
        return this;  // Chainable!
    }

    // Getter
    get jumlahSiswa() {
        return this.siswa.length;
    }

    // Getter
    get hargaFormat() {
        return \`Rp\${this.harga.toLocaleString("id-ID")}\`;
    }

    // Setter
    set setRating(nilai) {
        if (nilai < 1 || nilai > 5) throw new Error("Rating harus 1-5");
        this.rating = nilai;
    }

    // Static method
    static bandingkan(k1, k2) {
        return k2.rating - k1.rating;
    }

    // toString
    toString() {
        return \`[\${this.id}] \${this.judul} - \${this.instruktur} (\${this.hargaFormat})\`;
    }
}

// Inheritance
class KursusGratis extends KursusOnline {
    constructor(judul, instruktur) {
        super(judul, instruktur, 0); // Panggil constructor parent
        this.sertifikat = false;
    }

    daftar(namaSiswa) {
        super.daftar(namaSiswa); // Panggil method parent
        console.log("Kursus gratis! Tidak ada sertifikat.");
        return this;
    }
}

// Penggunaan
const kursus1 = new KursusOnline("Python Dasar", "Budi", 149000);
kursus1.daftar("Andi").daftar("Budi").daftar("Cici");
kursus1.setRating = 4.8;
console.log(kursus1.jumlahSiswa); // 3
console.log(String(kursus1));     // [1] Python Dasar - Budi (Rp149.000)

const gratis = new KursusGratis("HTML Dasar", "Siti");
console.log(gratis instanceof KursusOnline); // true (inheritance!)
\`\`\`

---

## 📦 ES Modules — Organisasi Kode

\`\`\`javascript
// utils/format.js — Named exports
export function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);
}

export function formatTanggal(tanggal) {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
    }).format(new Date(tanggal));
}

export const VERSION = "1.0.0";

// api/kursus.js — Default export
export default class KursusAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async getAll(params = {}) {
        const url = new URL(\`\${this.baseURL}/courses\`);
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        const res = await fetch(url);
        return res.json();
    }

    async getById(id) {
        const res = await fetch(\`\${this.baseURL}/courses/\${id}\`);
        return res.json();
    }
}

// main.js — Import
import KursusAPI from "./api/kursus.js";
import { formatRupiah, formatTanggal } from "./utils/format.js";

// Import semua dengan alias
import * as Format from "./utils/format.js";
Format.formatRupiah(150000);

// Dynamic import — lazy loading
const { formatRupiah: fr } = await import("./utils/format.js");
\`\`\`

---

## 🔧 Error Handling

\`\`\`javascript
// Custom Error classes
class ValidationError extends Error {
    constructor(field, message) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

class NetworkError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "NetworkError";
        this.status = status;
    }
}

// Gunakan
function validasiEmail(email) {
    if (!email) throw new ValidationError("email", "Email wajib diisi");
    if (!email.includes("@")) throw new ValidationError("email", "Format email tidak valid");
    return true;
}

try {
    validasiEmail("bukan-email");
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(\`Error pada field '\${error.field}': \${error.message}\`);
    } else {
        throw error; // Re-throw yang tidak dikenal
    }
}
\`\`\`

---

## 💾 LocalStorage & SessionStorage

\`\`\`javascript
// localStorage — tersimpan permanen (sampai dihapus)
localStorage.setItem("token", "abc123");
const token = localStorage.getItem("token");
localStorage.removeItem("token");
localStorage.clear();  // Hapus semua

// Simpan object (perlu JSON)
const preferensi = { tema: "gelap", bahasa: "id", notifikasi: true };
localStorage.setItem("preferensi", JSON.stringify(preferensi));
const tersimpan = JSON.parse(localStorage.getItem("preferensi"));

// sessionStorage — hilang saat tab/browser ditutup
sessionStorage.setItem("form-draft", JSON.stringify(formData));

// Helper functions
const storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key, defaultValue = null) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    },
    remove(key) { localStorage.removeItem(key); }
};
\`\`\`

---

## 📝 Ringkasan Kursus JavaScript

Anda telah menguasai:

| Modul | Topik |
|-------|-------|
| 1 | Dasar: variabel, tipe data, operator |
| 2 | Kontrol alur, array methods |
| 3 | Fungsi, closure, higher-order functions |
| 4 | Object & array mendalam, destructuring |
| 5 | DOM manipulation, event handling |
| 6 | Async/await, Fetch API |
| 7 | OOP, modules, error handling |

**Langkah selanjutnya:**
- Pelajari TypeScript (JavaScript dengan tipe statis)
- Framework: React, Vue, atau Svelte
- Backend: Node.js + Express/Fastify

> **Selamat! Anda kini adalah JavaScript developer!** 🎉
`;
