import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Simple in-memory rate limit: max 20 requests per user per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Require authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Login diperlukan untuk menggunakan AI" },
        { status: 401 },
      );
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
        { status: 429 },
      );
    }

    const { message, lessonTitle, lessonContent, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 },
      );
    }

    // Batasi panjang konten agar tidak overload token
    const contentPreview = (lessonContent || "").slice(0, 2000);

    const systemPrompt = `Anda adalah asisten AI di platform Learnify.
Tugas Anda adalah membantu siswa memahami materi pelajaran yang sedang mereka pelajari.
Materi saat ini berjudul: "${lessonTitle}".
Ringkasan materi: "${contentPreview}".
Berikan jawaban yang ramah, jelas, dan mendidik dalam Bahasa Indonesia. Jika pertanyaan tidak relevan dengan materi, ingatkan siswa untuk tetap fokus pada topik, namun tetap bantu sebisa mungkin.`;

    const safeHistory = Array.isArray(history) ? history.slice(-10) : []; // Maks 10 pesan terakhir

    const chat = model.startChat({
      history: safeHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(
      `${systemPrompt}\n\nSiswa bertanya: ${message}`,
    );
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("AI Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    // Handle specific Gemini errors
    if (message.includes("API_KEY") || message.includes("API key")) {
      return NextResponse.json(
        { error: "Layanan AI belum dikonfigurasi. Hubungi administrator." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Gagal memproses permintaan AI. Coba lagi." },
      { status: 500 },
    );
  }
}
