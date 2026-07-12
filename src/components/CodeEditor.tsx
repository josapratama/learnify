"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, Copy, Check, Loader2, Terminal } from "lucide-react";

// Lazy load Monaco Editor agar tidak memberatkan initial bundle
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-900 rounded-xl">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  ),
});

interface CodeEditorProps {
  initialCode?: string;
  language?: "javascript" | "typescript" | "python" | "sql" | "html" | "css";
  title?: string;
  readOnly?: boolean;
  showRunButton?: boolean;
}

// Jalankan JS/TS di browser via sandboxed eval
function runJavaScript(code: string): string {
  const logs: string[] = [];
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  };

  // Override console
  const capture = (...args: unknown[]) => {
    logs.push(
      args
        .map((a) =>
          typeof a === "object" ? JSON.stringify(a, null, 2) : String(a),
        )
        .join(" "),
    );
  };
  console.log = capture;
  console.warn = capture;
  console.error = capture;
  console.info = capture;

  try {
    // eslint-disable-next-line no-new-func
    new Function(code)();
  } catch (err) {
    logs.push(`❌ Error: ${(err as Error).message}`);
  } finally {
    Object.assign(console, originalConsole);
  }

  return logs.join("\n") || "(tidak ada output)";
}

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Tulis kode JavaScript Anda di sini
const angka = [1, 2, 3, 4, 5];
const kuadrat = angka.map(n => n ** 2);
console.log("Kuadrat:", kuadrat);

function faktorial(n) {
  if (n <= 1) return 1;
  return n * faktorial(n - 1);
}
console.log("Faktorial 5:", faktorial(5));`,

  typescript: `// TypeScript (dijalankan sebagai JavaScript)
interface Pengguna {
  nama: string;
  umur: number;
}

const pengguna: Pengguna = { nama: "Budi", umur: 25 };
console.log(\`Halo, \${pengguna.nama}! Umur: \${pengguna.umur}\`);`,

  python: `# Python — Kode berjalan di server
def faktorial(n):
    if n <= 1:
        return 1
    return n * faktorial(n - 1)

for i in range(1, 8):
    print(f"{i}! = {faktorial(i)}")`,

  sql: `-- SQL Editor
SELECT 
    'Halo dari SQL!' AS pesan,
    CURRENT_TIMESTAMP AS waktu_sekarang;`,

  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    h1 { color: #6366f1; }
  </style>
</head>
<body>
  <h1>Halo dari HTML!</h1>
  <p>Ini adalah preview HTML langsung.</p>
</body>
</html>`,

  css: `/* CSS Editor */
body {
  font-family: -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  color: white;
  font-size: 3rem;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
}`,
};

export default function CodeEditor({
  initialCode,
  language = "javascript",
  title,
  readOnly = false,
  showRunButton = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODE[language] || "");
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "output" | "preview">(
    "code",
  );

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput(null);

    try {
      if (language === "javascript" || language === "typescript") {
        const result = runJavaScript(code);
        setOutput(result);
        setActiveTab("output");
      } else if (language === "python") {
        // Kirim ke API untuk eksekusi server-side
        const res = await fetch("/api/code/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });
        const data = await res.json();
        setOutput(data.output || data.error || "Tidak ada output");
        setActiveTab("output");
      } else if (language === "html" || language === "css") {
        setActiveTab("preview");
      } else {
        setOutput("Bahasa ini tidak mendukung eksekusi langsung.");
        setActiveTab("output");
      }
    } catch {
      setOutput("❌ Gagal menjalankan kode.");
      setActiveTab("output");
    } finally {
      setRunning(false);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode || DEFAULT_CODE[language] || "");
    setOutput(null);
    setActiveTab("code");
  };

  const previewHtml =
    language === "css"
      ? `<html><head><style>${code}</style></head><body><h1>CSS Preview</h1><p>Ini preview CSS Anda.</p></body></html>`
      : code;

  const langLabel: Record<string, string> = {
    javascript: "JS",
    typescript: "TS",
    python: "PY",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg my-6">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs font-mono">
            {title || `${langLabel[language]} Editor`}
          </span>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white transition rounded-lg hover:bg-gray-700"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          {!readOnly && (
            <button
              onClick={handleReset}
              className="p-1.5 text-gray-400 hover:text-white transition rounded-lg hover:bg-gray-700"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {showRunButton && !readOnly && (
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition disabled:opacity-60"
            >
              {running ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {running ? "Running..." : "Run"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 flex border-b border-gray-700">
        {[
          "code",
          ...(output !== null ? ["output"] : []),
          ...(["html", "css"].includes(language) ? ["preview"] : []),
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "code" | "output" | "preview")}
            className={`px-4 py-2 text-xs font-bold capitalize transition ${
              activeTab === tab
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab === "output" ? (
              <>
                <Terminal className="w-3.5 h-3.5 inline mr-1" />
                Output
              </>
            ) : (
              tab
            )}
          </button>
        ))}
      </div>

      {/* Editor / Output / Preview */}
      <div className="bg-gray-900">
        {activeTab === "code" && (
          <MonacoEditor
            height="300px"
            language={language === "typescript" ? "typescript" : language}
            value={code}
            onChange={(val) => !readOnly && setCode(val || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              readOnly,
              lineNumbers: "on",
              folding: true,
              padding: { top: 12 },
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontLigatures: true,
            }}
          />
        )}

        {activeTab === "output" && (
          <div className="min-h-[150px] max-h-[300px] overflow-auto p-4">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {output || "Klik Run untuk menjalankan kode"}
            </pre>
          </div>
        )}

        {activeTab === "preview" && (
          <iframe
            srcDoc={previewHtml}
            className="w-full h-[300px] bg-white"
            sandbox="allow-scripts"
            title="HTML Preview"
          />
        )}
      </div>
    </div>
  );
}
