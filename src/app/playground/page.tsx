import Link from "next/link";
import { Code2, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import CodeEditor from "@/components/CodeEditor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Code Playground | Learnify",
  description: "Coba dan eksekusi kode pemrograman langsung di browser Anda.",
};

const contoh = [
  {
    title: "JavaScript: Array Methods",
    lang: "javascript" as const,
    code: `// Eksplorasi array methods JavaScript
const produk = [
  { nama: "Laptop High-End", harga: 15500000 },
  { nama: "Mechanical Keyboard", harga: 1250000 },
  { nama: "4K Monitor 27 inch", harga: 4200000 },
];

// Filter produk dengan harga di atas 2 juta
const premium = produk.filter(p => p.harga > 2000000);
console.log("Produk Premium:", premium.map(p => p.nama));

// Hitung total belanja
const total = produk.reduce((sum, p) => sum + p.harga, 0);
console.log("Total Belanja:", "Rp " + total.toLocaleString("id-ID"));`,
  },
  {
    title: "JavaScript: Async / Await Fetch Simulation",
    lang: "javascript" as const,
    code: `// Simulasi asynchronous request
async function fetchUserStatus(id) {
  await new Promise(resolve => setTimeout(resolve, 80));
  return { id, nama: "Developer #" + id, level: "Fullstack Pro" };
}

async function run() {
  console.log("Memulai simulasi sinkronisasi data...");
  const users = await Promise.all([1, 2, 3].map(fetchUserStatus));
  users.forEach(u => console.log(\`[User \${u.id}] \${u.nama} (\${u.level})\`));
  console.log("Semua data berhasil dimuat!");
}

run();`,
  },
  {
    title: "HTML: Card Modern Learnify",
    lang: "html" as const,
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      max-width: 380px;
      width: 100%;
      text-align: center;
    }
    h1 { color: #1e1b4b; font-size: 24px; margin-bottom: 8px; font-weight: 800; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 8px 16px rgba(79,70,229,0.3);
      transition: all 0.2s;
    }
    button:hover { background: #4338ca; transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎓 Learnify</h1>
    <p>Platform belajar online interaktif untuk membangun masa depan teknologi Anda.</p>
    <button onclick="alert('Selamat Belajar di Learnify!')">Mulai Sekarang</button>
  </div>
</body>
</html>`,
  },
];

export default async function PlaygroundPage() {
  const user = await requireValidUser();

  const dbUser = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          streak: true,
          avatarUrl: true,
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Interactive Code Playground
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Uji coba dan jalankan potongan kode secara instan langsung dari peramban Anda.
            </p>
          </div>
        </div>

        {/* Language badges */}
        <div className="flex gap-2 flex-wrap mb-8">
          {["JavaScript", "TypeScript", "HTML", "CSS", "Python (Server)"].map(
            (lang) => (
              <span
                key={lang}
                className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 rounded-xl text-xs font-black"
              >
                {lang}
              </span>
            ),
          )}
        </div>

        {/* Free editor */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Editor Eksplorasi Bebas</span>
            </h2>
            <span className="text-xs font-bold text-gray-400">
              Live Runner
            </span>
          </div>
          <CodeEditor language="javascript" title="Free Workspace" />
        </div>

        {/* Contoh */}
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          📚 Studi Kasus & Contoh Interaktif
        </h2>
        <div className="space-y-6">
          {contoh.map((c) => (
            <div
              key={c.title}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 p-6 sm:p-8 shadow-xs"
            >
              <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-3">
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
      </main>

      <Footer />
    </div>
  );
}
