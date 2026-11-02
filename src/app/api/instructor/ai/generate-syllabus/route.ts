import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "instructor" && user.role !== "admin")) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya instruktur yang dapat mengakses fitur ini." },
        { status: 403 },
      );
    }

    const { courseTitle, courseCategory, courseLevel, topicPrompt } = await req.json();

    if (!courseTitle && !topicPrompt) {
      return NextResponse.json(
        { error: "Judul kursus atau topik wajib diisi." },
        { status: 400 },
      );
    }

    const targetTitle = courseTitle || topicPrompt;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Anda adalah instructional designer ahli kurikulum e-learning.
Buatlah rancangan silabus kurikulum lengkap yang komprehensif, logis, dan bertahap dalam Bahasa Indonesia untuk kursus berikut:
- Judul Kursus: "${targetTitle}"
- Kategori: "${courseCategory || 'Teknologi & Pemrograman'}"
- Tingkat Kesulitan: "${courseLevel || 'BEGINNER'}"
- Catatan Tambahan Instruktur: "${topicPrompt || 'Standar industri modern'}"

Format output HARUS berupa JSON murni (array of sections) tanpa markdown ticks (\`\`\`json) dan tanpa teks pembuka/penutup lainnya. Format schema:
[
  {
    "title": "Modul 1: Fondasi & Pengenalan",
    "lessons": [
      {
        "title": "1.1 Pengantar Konsep Dasar",
        "contentType": "video",
        "bodyText": "Ringkasan konsep dasar materi...",
        "videoUrl": ""
      },
      {
        "title": "1.2 Praktik Langkah Pertama",
        "contentType": "article",
        "bodyText": "# Praktik Pertama\\n\\nPelajari langkah demi langkah instalasi dan konfigurasi awal.",
        "videoUrl": ""
      },
      {
        "title": "1.3 Kuis Pemahaman Dasar",
        "contentType": "quiz",
        "bodyText": "",
        "videoUrl": ""
      }
    ]
  }
]
Buatlah minimal 3 modul dan masing-masing modul memiliki 3-4 materi (campuran video, article, dan quiz di akhir modul).`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        const cleaned = rawText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Format with fresh client-side ids
          const formattedSections = parsed.map((sec: any, sIdx: number) => ({
            id: `new-sec-${Date.now()}-${sIdx}`,
            title: sec.title || `Modul ${sIdx + 1}`,
            orderIndex: sIdx + 1,
            lessons: Array.isArray(sec.lessons)
              ? sec.lessons.map((les: any, lIdx: number) => ({
                  id: `new-les-${Date.now()}-${sIdx}-${lIdx}`,
                  title: les.title || `Materi ${lIdx + 1}`,
                  slug: `${(les.title || `materi-${lIdx + 1}`)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${lIdx}`,
                  contentType: les.contentType || "article",
                  orderIndex: lIdx + 1,
                  videoUrl: les.videoUrl || "",
                  bodyText: les.bodyText || "",
                }))
              : [],
          }));

          return NextResponse.json({ sections: formattedSections });
        }
      } catch (geminiError) {
        console.warn("Gemini syllabus generation fallback:", geminiError);
      }
    }

    // High quality intelligent template fallback if AI service or API key is not ready
    const fallbackSections = [
      {
        id: `new-sec-${Date.now()}-0`,
        title: `Modul 1: Pengenalan & Fondasi ${targetTitle}`,
        orderIndex: 1,
        lessons: [
          {
            id: `new-les-${Date.now()}-0-0`,
            title: `1.1 Roadmap & Apa yang Akan Dipelajari`,
            slug: `roadmap-dan-pengenalan-${Date.now()}`,
            contentType: "video",
            orderIndex: 1,
            videoUrl: "",
            bodyText: `Selamat datang di kursus ${targetTitle}! Pada materi ini kita akan membahas gambaran besar serta persiapan yang dibutuhkan.`,
          },
          {
            id: `new-les-${Date.now()}-0-1`,
            title: `1.2 Instalasi & Konfigurasi Lingkungan Kerja`,
            slug: `instalasi-lingkungan-kerja-${Date.now()}`,
            contentType: "article",
            orderIndex: 2,
            videoUrl: "",
            bodyText: `# Panduan Konfigurasi Lingkungan\\n\\n1. Unduh dan pasang perangkat lunak yang diperlukan.\\n2. Lakukan pengecekan versi di terminal.\\n3. Siapkan direktori kerja proyek.`,
          },
          {
            id: `new-les-${Date.now()}-0-2`,
            title: `1.3 Evaluasi Pemahaman Bab 1`,
            slug: `evaluasi-bab-1-${Date.now()}`,
            contentType: "quiz",
            orderIndex: 3,
            videoUrl: "",
            bodyText: "",
          },
        ],
      },
      {
        id: `new-sec-${Date.now()}-1`,
        title: `Modul 2: Implementasi Inti & Studi Kasus`,
        orderIndex: 2,
        lessons: [
          {
            id: `new-les-${Date.now()}-1-0`,
            title: `2.1 Arsitektur & Prinsip Utama`,
            slug: `arsitektur-dan-prinsip-${Date.now()}`,
            contentType: "video",
            orderIndex: 1,
            videoUrl: "",
            bodyText: `Membahas prinsip-prinsip esensial dalam ${targetTitle} untuk performa optimal.`,
          },
          {
            id: `new-les-${Date.now()}-1-1`,
            title: `2.2 Praktik Coding: Membangun Komponen Kunci`,
            slug: `praktik-membangun-fitur-${Date.now()}`,
            contentType: "article",
            orderIndex: 2,
            videoUrl: "",
            bodyText: `# Studi Kasus Praktik\\n\\nKembangkan komponen utama dengan menerapkan best practice kode bersih dan teruji.`,
          },
          {
            id: `new-les-${Date.now()}-1-2`,
            title: `2.3 Penanganan Error & Best Practice`,
            slug: `error-handling-${Date.now()}`,
            contentType: "article",
            orderIndex: 3,
            videoUrl: "",
            bodyText: `# Troubleshooting & Best Practices\\n\\nTips mendiagnosis masalah umum dan optimasi alur kerja.`,
          },
        ],
      },
      {
        id: `new-sec-${Date.now()}-2`,
        title: `Modul 3: Penerapan Lanjut, Proyek Akhir & Deployment`,
        orderIndex: 3,
        lessons: [
          {
            id: `new-les-${Date.now()}-2-0`,
            title: `3.1 Merampungkan Proyek Portofolio`,
            slug: `proyek-portofolio-${Date.now()}`,
            contentType: "video",
            orderIndex: 1,
            videoUrl: "",
            bodyText: `Menyelesaikan proyek utuh yang siap dimasukkan ke dalam portofolio profesional Anda.`,
          },
          {
            id: `new-les-${Date.now()}-2-1`,
            title: `3.2 Deploy ke Produksi & Pengujian`,
            slug: `deploy-ke-produksi-${Date.now()}`,
            contentType: "article",
            orderIndex: 2,
            videoUrl: "",
            bodyText: `# Deployment ke Lingkungan Produksi\\n\\nLangkah-langkah merilis aplikasi ke server VPS atau cloud hosting modern.`,
          },
          {
            id: `new-les-${Date.now()}-2-2`,
            title: `3.3 Ujian Akhir Sertifikasi`,
            slug: `ujian-akhir-sertifikasi-${Date.now()}`,
            contentType: "quiz",
            orderIndex: 3,
            videoUrl: "",
            bodyText: "",
          },
        ],
      },
    ];

    return NextResponse.json({ sections: fallbackSections });
  } catch (error) {
    console.error("AI Syllabus Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat silabus otomatis. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
