import Link from "next/link";
import { GraduationCap, Code2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CodeEditor from "@/components/CodeEditor";

export const metadata = { title: "Code Playground | EduTech" };

const contoh = [
  {
    title: "JavaScript: Array Methods",
    lang: "javascript" as const,
    code: `// Eksplorasi array methods JavaScript
const produk = [
  { nama: "Laptop", harga: 8500000 },
  { nama: "Mouse",  harga: 250000  },
  { nama: "Monitor",harga: 3200000 },
];

// Filter produk mahal
const mahal = produk.filter(p => p.harga > 1000000);
console.log("Produk mahal:", mahal.map(p => p.nama));

// Total harga
const total = produk.reduce((sum, p) => sum + p.harga, 0);
console.log("Total:", "Rp" + total.toLocaleString("id-ID"));`,
  },
  {
    title: "JavaScript: Async/Await",
    lang: "javascript" as const,
    code: `// Simulasi fetch data dengan async/await
async function ambilData(id) {
  // Simulasi network delay
  await new Promise(r => setTimeout(r, 100));
  return { id, nama: "User #" + id, aktif: id % 2 === 0 };
}

async function main() {
  console.log("Mengambil data...");
  
  const users = await Promise.all([1, 2, 3].map(ambilData));
  users.forEach(u => console.log(u.nama, "-", u.aktif ? "Aktif" : "Nonaktif"));
}

main();`,
  },
  {
    title: "HTML: Landing Page Sederhana",
    lang: "html" as const,
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    h1 { color: #6366f1; font-size: 2rem; margin-bottom: 10px; }
    p { color: #6b7280; line-height: 1.6; }
    button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 20px;
      transition: background 0.2s;
    }
    button:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎓 EduTech</h1>
    <p>Belajar teknologi dengan cara yang menyenangkan dan interaktif.</p>
    <button onclick="alert('Selamat Datang!')">Mulai Belajar</button>
  </div>
</body>
</html>`,
  },
];

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" /> EduTech
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition"
            >
              ← Beranda
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">
              Code Playground
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Coba kode langsung di browser — JavaScript, HTML, CSS, dan Python!
            </p>
          </div>
        </div>

        {/* Language badges */}
        <div className="flex gap-2 flex-wrap mb-10">
          {["JavaScript", "TypeScript", "HTML", "CSS", "Python (server)"].map(
            (lang) => (
              <span
                key={lang}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold"
              >
                {lang}
              </span>
            ),
          )}
        </div>

        {/* Free editor */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ✏️ Editor Bebas
          </h2>
          <CodeEditor language="javascript" title="Free Editor" />
        </div>

        {/* Contoh */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📚 Contoh Interaktif
        </h2>
        <div className="space-y-6">
          {contoh.map((c) => (
            <div
              key={c.title}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {c.title}
              </h3>
              <CodeEditor
                initialCode={c.code}
                language={c.lang}
                title={c.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
