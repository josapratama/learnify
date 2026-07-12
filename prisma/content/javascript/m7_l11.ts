export const js_l11 = `
# Testing & Tooling JavaScript — Kode yang Teruji dan Terorganisir

Satu hal yang bikin developer professional berbeda adalah menulis test. Dan tooling yang bagus bikin workflow kamu jauh lebih cepat. Di pelajaran terakhir ini kita tutup dengan dua topik penting itu.

---

## 🧪 Testing dengan Jest

\`\`\`bash
npm install --save-dev jest @jest/globals

# Untuk ES Modules:
npm install --save-dev jest @jest/globals babel-jest @babel/core @babel/preset-env

# package.json
{
  "scripts": {
    "test":     "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node"
  }
}

# Jalankan test
npm test
\`\`\`

\`\`\`javascript
// math.js
export function tambah(a, b)  { return a + b; }
export function bagi(a, b) {
    if (b === 0) throw new Error("Tidak bisa bagi dengan nol");
    return a / b;
}
export function hitungDiskon(harga, persen) {
    if (persen < 0 || persen > 100) throw new RangeError("Persen harus 0-100");
    return harga - (harga * persen / 100);
}

// math.test.js
import { tambah, bagi, hitungDiskon } from "./math.js";
import { describe, test, expect, beforeEach } from "@jest/globals";

// describe = grup test yang berkaitan
describe("fungsi tambah()", () => {
    test("menjumlahkan dua angka positif", () => {
        expect(tambah(2, 3)).toBe(5);   // toBe: ===
    });

    test("menjumlahkan angka negatif", () => {
        expect(tambah(-1, -2)).toBe(-3);
    });

    test("menjumlahkan nol", () => {
        expect(tambah(5, 0)).toBe(5);
    });
});

describe("fungsi bagi()", () => {
    test("membagi dua angka normal", () => {
        expect(bagi(10, 2)).toBe(5);
        expect(bagi(7, 2)).toBeCloseTo(3.5);  // Untuk float
    });

    test("melempar error kalau bagi nol", () => {
        expect(() => bagi(10, 0)).toThrow("Tidak bisa bagi dengan nol");
        expect(() => bagi(5, 0)).toThrow(Error);
    });
});

describe("hitungDiskon()", () => {
    test("diskon 10% dari 100000", () => {
        expect(hitungDiskon(100000, 10)).toBe(90000);
    });

    test("diskon 0% tidak mengurangi harga", () => {
        expect(hitungDiskon(100000, 0)).toBe(100000);
    });

    test("melempar error untuk persen di luar range", () => {
        expect(() => hitungDiskon(100000, -5)).toThrow(RangeError);
        expect(() => hitungDiskon(100000, 110)).toThrow();
    });
});
\`\`\`

---

## 🔬 Test Matcher Lengkap

\`\`\`javascript
test("berbagai matcher Jest", () => {
    // Equality
    expect(2 + 2).toBe(4);                      // ===
    expect({ a: 1 }).toEqual({ a: 1 });          // Deep equality
    expect({ a: 1 }).not.toBe({ a: 1 });         // Beda reference!

    // Truthy / Falsy
    expect(true).toBeTruthy();
    expect(0).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect("halo").toBeDefined();

    // Numbers
    expect(5).toBeGreaterThan(4);
    expect(5).toBeGreaterThanOrEqual(5);
    expect(3.14).toBeCloseTo(3.1, 1);   // 1 decimal precision

    // Strings
    expect("Halo Dunia").toContain("Dunia");
    expect("halo@email.com").toMatch(/\\w+@\\w+\\.\\w+/);

    // Arrays
    expect([1, 2, 3]).toContain(2);
    expect([1, 2, 3]).toHaveLength(3);
    expect([1, 2, 3]).toEqual(expect.arrayContaining([2, 3]));

    // Objects
    expect({ nama: "Budi", umur: 25 }).toMatchObject({ nama: "Budi" });
    expect({ nama: "Budi" }).toHaveProperty("nama", "Budi");
});
\`\`\`

---

## 🎭 Mock & Spy — Isolasi Dependensi

\`\`\`javascript
// service.js
import { readFile } from "fs/promises";

export async function bacaKonfigurasi(filePath) {
    const isi = await readFile(filePath, "utf-8");
    return JSON.parse(isi);
}

export async function ambilDataPengguna(userId) {
    const res  = await fetch(\`https://api.example.com/users/\${userId}\`);
    const data = await res.json();
    return data;
}

// service.test.js
import { describe, test, expect, jest, beforeEach } from "@jest/globals";

// Mock modul fs/promises
jest.mock("fs/promises", () => ({
    readFile: jest.fn(),
}));

import { readFile } from "fs/promises";
import { bacaKonfigurasi } from "./service.js";

describe("bacaKonfigurasi()", () => {
    beforeEach(() => {
        jest.clearAllMocks();   // Reset mock setiap test
    });

    test("berhasil baca dan parse JSON", async () => {
        const mockData = { port: 3000, debug: true };
        readFile.mockResolvedValueOnce(JSON.stringify(mockData));

        const hasil = await bacaKonfigurasi("./config.json");
        expect(hasil).toEqual(mockData);
        expect(readFile).toHaveBeenCalledWith("./config.json", "utf-8");
    });

    test("propagate error saat file tidak ada", async () => {
        readFile.mockRejectedValueOnce(new Error("ENOENT: file not found"));
        await expect(bacaKonfigurasi("./nope.json")).rejects.toThrow("ENOENT");
    });
});

// Mock fetch global
global.fetch = jest.fn();

test("ambilDataPengguna memanggil API yang benar", async () => {
    const mockUser = { id: 1, nama: "Budi" };
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
    });

    const hasil = await ambilDataPengguna(1);
    expect(hasil).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/users/1");
});
\`\`\`

---

## 🔧 Tooling: ESLint & Prettier

\`\`\`bash
# ESLint — cek kualitas dan potensi bug kode
npm install --save-dev eslint @eslint/js

# Prettier — format kode otomatis
npm install --save-dev prettier eslint-config-prettier

# Buat konfigurasi
npx eslint --init
\`\`\`

\`\`\`javascript
// eslint.config.js (ESLint 9+ flat config)
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars":   "warn",
            "no-console":       "warn",
            "eqeqeq":           "error",    // Wajib pakai === bukan ==
            "prefer-const":     "error",    // Pakai const kalau tidak di-reassign
            "no-var":           "error",    // Larang var, pakai let/const
            "arrow-body-style": ["warn", "as-needed"],
        },
        ignores: ["node_modules/", "dist/"],
    }
];
\`\`\`

\`\`\`json
// .prettierrc
{
    "semi": true,
    "singleQuote": false,
    "tabWidth": 4,
    "trailingComma": "es5",
    "printWidth": 100,
    "arrowParens": "avoid"
}
\`\`\`

\`\`\`json
// package.json scripts
{
    "scripts": {
        "lint":         "eslint src/",
        "lint:fix":     "eslint src/ --fix",
        "format":       "prettier --write src/",
        "format:check": "prettier --check src/"
    }
}
\`\`\`

---

## 📦 Bundling dengan Vite

\`\`\`bash
# Buat project dengan Vite (termasuk untuk vanilla JS, React, Vue)
npm create vite@latest nama-project
cd nama-project
npm install
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
\`\`\`

\`\`\`javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "dist",
        minify: "esbuild",
        sourcemap: true,
    },
    server: {
        port: 3000,
        open: true,  // Buka browser otomatis
    },
    // Environment variables: import.meta.env.VITE_API_URL
});
\`\`\`

---

## 🎯 Praktik: Setup Project JavaScript Modern Lengkap

\`\`\`bash
# 1. Init project
mkdir my-app && cd my-app
npm init -y

# 2. Install semua tools
npm install express
npm install --save-dev jest eslint prettier nodemon

# 3. Buat struktur folder
mkdir src tests

# 4. package.json final
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start":    "node src/index.js",
    "dev":      "nodemon src/index.js",
    "test":     "jest",
    "lint":     "eslint src/",
    "format":   "prettier --write src/"
  }
}

# 5. .gitignore
node_modules/
dist/
.env
coverage/
\`\`\`

---

## 📝 Ringkasan Kursus JavaScript

| Modul | Topik |
|-------|-------|
| 1 | Dasar JS: variabel, tipe data, operator |
| 2 | Kontrol alur: if, switch, loop |
| 3 | Fungsi, closure, higher-order function |
| 4 | Object, array, spread, destructuring |
| 5 | DOM manipulation, events |
| 6 | Fetch API, async/await dasar |
| 7 | OOP, class, module |
| 8 | ES6+ modern: destructuring, spread, optional chaining |
| 9 | Promise lanjutan: all, allSettled, race, async iteration |
| 10 | Node.js dasar, Express.js, REST API |
| 11 | Testing (Jest), ESLint, Prettier, Vite |

**Kamu sekarang punya fondasi JavaScript yang kuat — dari browser hingga server!**

> **Langkah selanjutnya: Pelajari React atau Vue untuk membangun UI yang dinamis dan modern!** 🚀
`;
