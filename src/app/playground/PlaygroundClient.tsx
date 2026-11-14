"use client";

import { useState } from "react";
import {
  Code2,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Layers,
  ChevronRight,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

type SupportedLang = "javascript" | "python" | "typescript" | "html" | "sql";

interface CodeTemplate {
  name: string;
  code: string;
}

const TEMPLATES: Record<SupportedLang, CodeTemplate[]> = {
  javascript: [
    {
      name: "Array Methods & HOF",
      code: `// Eksplorasi array methods JavaScript
const produk = [
  { nama: "Laptop Pro 16", harga: 21000000, stok: 5 },
  { nama: "Mechanical Keyboard", harga: 1250000, stok: 12 },
  { nama: "Monitor 4K 27 inch", harga: 4500000, stok: 8 },
  { nama: "Ergonomic Mouse", harga: 650000, stok: 20 },
];

// 1. Filter produk premium (> 2 juta)
const premium = produk.filter(p => p.harga > 2000000);
console.log("=== Produk Premium ===");
premium.forEach(p => console.log(\`- \${p.nama}: Rp \${p.harga.toLocaleString("id-ID")}\`));

// 2. Hitung total nilai inventaris
const totalInventaris = produk.reduce((total, p) => total + (p.harga * p.stok), 0);
console.log("\\nTotal Nilai Inventaris: Rp", totalInventaris.toLocaleString("id-ID"));`,
    },
    {
      name: "Async / Await Simulation",
      code: `// Simulasi proses async & Promise.all
async function ambilDataUser(id) {
  await new Promise(resolve => setTimeout(resolve, 60));
  return { id, nama: "Programmer #" + id, level: "Senior Engineer" };
}

async function jalankan() {
  console.log("Memulai sinkronisasi data paralel...");
  const users = await Promise.all([1, 2, 3].map(ambilDataUser));
  users.forEach(u => console.log(\`✅ [ID \${u.id}] \${u.nama} — \${u.level}\`));
  console.log("Sinkronisasi 100% selesai!");
}

jalankan();`,
    },
  ],
  python: [
    {
      name: "Fibonacci & List Comprehension",
      code: `# Menghitung deret Fibonacci & kuadrat genap
def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

deret = fibonacci(12)
print("Deret Fibonacci (12 angka pertama):", deret)

# List comprehension: filter bilangan genap dan kuadratkan
genap_kuadrat = [x**2 for x in deret if x % 2 == 0]
print("Kuadrat dari angka genap:", genap_kuadrat)`,
    },
    {
      name: "Class & OOP Python",
      code: `# Struktur Object Oriented Programming di Python
class Mahasiswa:
    def __init__(self, nama, nim, ipk):
        self.nama = nama
        self.nim = nim
        self.ipk = ipk

    def status_kelulusan(self):
        if self.ipk >= 3.5:
            return "Cum Laude"
        elif self.ipk >= 3.0:
            return "Sangat Memuaskan"
        return "Memuaskan"

mhs1 = Mahasiswa("Ahmad Pratama", "20261101", 3.85)
mhs2 = Mahasiswa("Siti Rahma", "20261102", 3.40)

for m in [mhs1, mhs2]:
    print(f"{m.nama} ({m.nim}) -> IPK: {m.ipk} -> Predikat: {m.status_kelulusan()}")`,
    },
  ],
  typescript: [
    {
      name: "Interface & Type Safety",
      code: `// TypeScript Interface & Generic Type Simulation
interface Kursus {
  id: string;
  judul: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durasiJam: number;
}

const daftarKursus: Kursus[] = [
  { id: "c1", judul: "Fullstack Next.js 16", level: "Advanced", durasiJam: 18 },
  { id: "c2", judul: "Python Fundamental", level: "Beginner", durasiJam: 10 },
  { id: "c3", judul: "IoT dengan ESP32", level: "Intermediate", durasiJam: 14 },
];

console.log("=== Katalog Kursus Terdaftar ===");
daftarKursus.forEach(c => {
  console.log(\`[\${c.level.toUpperCase()}] \${c.judul} (\${c.durasiJam} Jam Belajar)\`);
});`,
    },
  ],
  html: [
    {
      name: "Interactive Card & Button",
      code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      padding: 32px;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      max-width: 380px;
      width: 100%;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: #eff6ff;
      color: #2563eb;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 12px;
    }
    h1 { color: #0f172a; font-size: 22px; margin-bottom: 8px; font-weight: 800; }
    p { color: #64748b; font-size: 13px; line-height: 1.6; margin-bottom: 24px; }
    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37,99,235,0.3);
      transition: all 0.2s;
    }
    button:hover { background: #1d4ed8; transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">LEARNIFY PLAYGROUND</span>
    <h1>Belajar Koding Interaktif</h1>
    <p>Tulis kode HTML dan CSS Anda lalu lihat hasilnya langsung di jendela output.</p>
    <button onclick="alert('Halo dari Playground Learnify! 🚀')">Coba Klik Saya</button>
  </div>
</body>
</html>`,
    },
  ],
  sql: [
    {
      name: "SELECT & Aggregation Demo",
      code: `-- Simulasi SQL Query di Learnify
SELECT 
    'Platform Learnify' AS nama_sistem,
    'PostgreSQL 15' AS database_engine,
    CURRENT_TIMESTAMP AS waktu_eksekusi;`,
    },
  ],
};

const LANG_DETAILS = [
  { id: "javascript", label: "JavaScript", type: "Browser / Sandbox" },
  { id: "python", label: "Python", type: "Server-side" },
  { id: "typescript", label: "TypeScript", type: "Browser / Sandbox" },
  { id: "html", label: "HTML & CSS", type: "Live Preview" },
  { id: "sql", label: "SQL", type: "Query Runner" },
] as const;

export default function PlaygroundClient() {
  const [selectedLang, setSelectedLang] = useState<SupportedLang>("javascript");
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
  const [editorKey, setEditorKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTemplates = TEMPLATES[selectedLang] || [];
  const activeCode = currentTemplates[activeTemplateIdx]?.code || "";

  const handleLangChange = (lang: SupportedLang) => {
    setSelectedLang(lang);
    setActiveTemplateIdx(0);
    setEditorKey((k) => k + 1);
  };

  const handleTemplateChange = (idx: number) => {
    setActiveTemplateIdx(idx);
    setEditorKey((k) => k + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEditorKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Language Switcher Tabs */}
      <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-blue-500" />
            Pilih Bahasa Pemrograman:
          </span>
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
            Lingkungan:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {LANG_DETAILS.find((l) => l.id === selectedLang)?.type}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {LANG_DETAILS.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleLangChange(lang.id as SupportedLang)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-750"
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Editor Container */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 p-5 sm:p-8 shadow-xs">
        {/* Template Selector & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Template:
            </span>
            {currentTemplates.map((tmpl, idx) => (
              <button
                key={tmpl.name}
                onClick={() => handleTemplateChange(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  activeTemplateIdx === idx
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold transition"
              title="Salin Kode"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold transition"
              title="Reset ke Template Awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* CodeEditor with Dynamic Language & InitialCode */}
        <CodeEditor
          key={`${selectedLang}-${activeTemplateIdx}-${editorKey}`}
          language={selectedLang}
          initialCode={activeCode}
          title={`Playground — ${LANG_DETAILS.find((l) => l.id === selectedLang)?.label}`}
          showRunButton
        />
      </div>
    </div>
  );
}
