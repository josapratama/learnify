import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomBytes } from "crypto";

// Rate limit sederhana
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRate(key: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function execAsync(
  cmd: string,
  timeout = 5000,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = exec(cmd, { timeout }, (error, stdout, stderr) => {
      if (error && !stdout && !stderr) reject(error);
      else resolve({ stdout: stdout || "", stderr: stderr || "" });
    });
    setTimeout(() => {
      proc.kill();
      reject(new Error("Timeout: kode berjalan terlalu lama (>5 detik)"));
    }, timeout + 500);
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const identifier = user?.id || req.headers.get("x-forwarded-for") || "anon";

  if (!checkRate(identifier)) {
    return NextResponse.json(
      { error: "Rate limit: maksimal 10 run per menit" },
      { status: 429 },
    );
  }

  const { code, language } = await req.json();

  if (!code?.trim())
    return NextResponse.json(
      { error: "Kode tidak boleh kosong" },
      { status: 400 },
    );

  // Validasi bahasa yang didukung
  const supported = ["python", "javascript", "typescript"];
  if (!supported.includes(language)) {
    return NextResponse.json(
      { error: `Bahasa ${language} tidak didukung untuk eksekusi server-side` },
      { status: 400 },
    );
  }

  // Blokir kode berbahaya (sederhana)
  const dangerous = [
    "import os",
    "import sys",
    "subprocess",
    "eval(",
    "exec(",
    "__import__",
    "open(",
    "rm ",
    "del ",
    "format(",
  ];
  const lower = code.toLowerCase();
  for (const d of dangerous) {
    if (lower.includes(d)) {
      return NextResponse.json(
        { error: `⚠️ Kode mengandung operasi yang tidak diizinkan: ${d}` },
        { status: 400 },
      );
    }
  }

  const id = randomBytes(8).toString("hex");
  let filePath = "";

  try {
    if (language === "python") {
      filePath = join(tmpdir(), `${id}.py`);
      await writeFile(filePath, code, "utf-8");

      const { stdout, stderr } = await execAsync(`python "${filePath}"`).catch(
        async () => execAsync(`python3 "${filePath}"`),
      );
      return NextResponse.json({
        output: stdout || stderr || "(tidak ada output)",
      });
    } else if (language === "javascript") {
      filePath = join(tmpdir(), `${id}.js`);
      await writeFile(filePath, code, "utf-8");
      const { stdout, stderr } = await execAsync(`node "${filePath}"`);
      return NextResponse.json({
        output: stdout || stderr || "(tidak ada output)",
      });
    }

    return NextResponse.json(
      { error: "Bahasa tidak didukung" },
      { status: 400 },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menjalankan kode";
    return NextResponse.json({ output: `❌ ${message}` });
  } finally {
    if (filePath) unlink(filePath).catch(() => {});
  }
}
