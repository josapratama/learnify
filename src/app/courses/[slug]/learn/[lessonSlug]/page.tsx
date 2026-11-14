import Link from "next/link";
import {
  GraduationCap,
  ChevronLeft,
  PlayCircle,
  FileText,
  CheckCircle,
  Download,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import MarkdownContent from "@/components/MarkdownContent";
import QuizPlayer from "@/components/QuizPlayer";
import DiscussionSection from "@/components/DiscussionSection";
import VideoPlayer from "@/components/VideoPlayer";
import AskAI from "@/components/AskAI";
import ThemeToggle from "@/components/ThemeToggle";
import MobileSidebar from "@/components/MobileSidebar";
import LessonNotes from "@/components/LessonNotes";
import ShareButton from "@/components/ShareButton";
import CodeEditor from "@/components/CodeEditor";

interface CodeEditorConfig {
  language: "javascript" | "typescript" | "python" | "sql" | "html" | "css";
  initialCode?: string;
}

// Menentukan apakah materi membutuhkan code editor secara kontekstual
function resolveLessonCodeEditor(
  course: { title: string; slug?: string; category: string | null },
  lesson: { title: string; contentType: string; bodyText?: string | null }
): CodeEditorConfig | null {
  // 1. Kuis tidak pernah memunculkan code editor
  if (lesson.contentType === "quiz") return null;

  const courseTitle = course.title.toLowerCase();
  const courseSlug = (course.slug || "").toLowerCase();
  const lessonTitle = lesson.title.toLowerCase();
  const bodyText = lesson.bodyText || "";

  // 2. DAFTAR BAHASA YANG DIDUKUNG OLEH CODE RUNNER DI BROWSER KITA
  // Hanya kursus yang secara eksplisit mengajarkan bahasa berikut yang didukung:
  let supportedLang: "javascript" | "python" | "sql" | "html" | null = null;

  if (courseSlug.includes("python") || courseTitle.includes("python")) {
    supportedLang = "python";
  } else if (courseSlug.includes("javascript") || courseTitle.includes("javascript")) {
    supportedLang = "javascript";
  } else if (courseSlug.includes("typescript") || courseTitle.includes("typescript")) {
    supportedLang = "javascript";
  } else if (courseSlug.includes("sql") || courseTitle.includes("sql")) {
    supportedLang = "sql";
  } else if (
    (courseSlug.includes("html") || courseTitle.includes("html") || courseSlug.includes("css") || courseTitle.includes("css")) &&
    !courseSlug.includes("php") &&
    !courseSlug.includes("laravel")
  ) {
    supportedLang = "html";
  }

  // Jika BUKAN kursus dengan bahasa runner di atas (misal: Laravel, PHP, Git, Docker, Linux, C++, Cybersecurity, IoT):
  // JANGAN PERNAH TAMPILKAN CODE EDITOR!
  if (!supportedLang) {
    return null;
  }

  // 3. MATERI TEORI, KONSEPTUAL, PENGENALAN, SETUP, ARSITEKTUR
  // Materi-materi ini murni bacaan/pemahaman konsep, BUKAN tempat latihan koding
  const theoryPatterns = [
    /\bapa itu\b/i,
    /\bpengenalan\b/i,
    /\bmengenal\b/i,
    /\bsejarah\b/i,
    /\bkonsep\b/i,
    /\barsitektur\b/i,
    /\binstalasi\b/i,
    /\bpersiapan\b/i,
    /\bsetup\b/i,
    /\boverview\b/i,
    /\broadmap\b/i,
    /\bkesimpulan\b/i,
    /\brangkuman\b/i,
    /\bpenutup\b/i,
    /\bteori\b/i,
    /\bkenapa\b/i,
    /\bmengapa\b/i,
    /\bstruktur proyek\b/i,
    /\bkonfigurasi\b/i,
    /\baturan\b/i,
    /\bmindset\b/i,
    /\bfondasi\b/i,
  ];

  const isTheoryLesson = theoryPatterns.some((pattern) => pattern.test(lessonTitle));
  if (isTheoryLesson) {
    return null;
  }

  // 4. HANYA MUNCUL DI MATERI LATIHAN / PRAKTIK KODING AKTIF
  // Siswa membutuhkan editor saat ada instruksi tugas, latihan, studi kasus, atau praktik langsung
  const isExplicitPractice = /\b(latihan|praktik|hands-on|tugas|tantangan|studi kasus|menulis kode|coding|playground|challenge)\b/i.test(
    lessonTitle
  );

  const hasPracticeSectionInBody = /(?:##|###)\s*(?:💻|⚡)?\s*(?:Latihan|Praktik|Tantangan|Coding Challenge|Tugas Praktik)/i.test(
    bodyText
  );

  // Jika bukan materi latihan/praktik eksplisit, jangan munculkan editor
  if (!isExplicitPractice && !hasPracticeSectionInBody) {
    return null;
  }

  // 5. AMBIL KODE LATIHAN YANG BENAR (BUKAN DIAGRAM ATAU COMMAND TERMINAL)
  let initialCode: string | undefined = undefined;

  // Cari blok kode yang secara spesifik memiliki tag bahasa yang didukung (```python, ```javascript, ```js, ```sql)
  const explicitCodeRegex = new RegExp(
    `\`\`\`(?:${supportedLang}|js|py)\\n([\\s\\S]*?)\`\`\``,
    "i"
  );
  const match = bodyText.match(explicitCodeRegex);

  if (match && match[1] && match[1].trim().length > 10) {
    const snippet = match[1].trim();
    // Validasi bahwa snippet adalah kode pemrograman valid (bukan sekadar diagram ASCII atau teks narasi)
    const looksLikeRealCode = /(?:def\s|print\(|const\s|let\s|var\s|function\s|console\.log|SELECT\s|CREATE\s|<[a-z]+>)/i.test(
      snippet
    );
    if (looksLikeRealCode) {
      initialCode = snippet;
    }
  }

  return {
    language: supportedLang,
    initialCode: initialCode || undefined,
  };
}

// Hitung estimasi waktu baca artikel (200 kata/menit)
function estimasiWaktaBaca(text: string): number {
  const kata = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(kata / 200));
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug: slug.trim() },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
            include: {
              progress: user ? { where: { userId: user.id } } : false,
              quizzes: true,
              attachments: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const allLessons = course.sections.flatMap((s) => s.lessons);

  const currentLesson =
    allLessons.find((l) => l.slug === lessonSlug) ||
    allLessons.find((l) => l.slug.toLowerCase() === lessonSlug?.toLowerCase());

  if (!currentLesson) {
    if (allLessons.length > 0)
      redirect(`/courses/${slug}/learn/${allLessons[0].slug}`);
    notFound();
  }

  // Cek akses: preview bebas, sisanya butuh login + enrollment
  const isPreviewLesson = currentLesson.isPreview;

  const enrollment = user
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  if (!isPreviewLesson) {
    // Belum login → redirect ke login
    if (!user) redirect(`/login?from=/courses/${slug}/learn/${lessonSlug}`);

    // Sudah login, cek enrollment
    if (!enrollment) redirect(`/courses/${slug}`);
  }

  const currentLessonIndex = allLessons.findIndex(
    (l) => l.id === currentLesson.id,
  );
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  // Progress hanya ada jika user login
  const progressEntry = user ? (currentLesson.progress as any[])?.[0] : null;
  const isCompleted = progressEntry?.isCompleted ?? false;
  const initialPosition = progressEntry?.lastPosition ?? 0;

  // Hitung progres kursus keseluruhan
  const completedLessonsCount = allLessons.filter(
    (l) => (l.progress as any[])?.some((p) => p.isCompleted),
  ).length;
  const totalLessonsCount = allLessons.length;
  const progressPercentage =
    totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;
  const isCourseFullyCompleted =
    totalLessonsCount > 0 && completedLessonsCount === totalLessonsCount;

  // Serialize sections for client component
  const sidebarSections = course.sections.map((s) => ({
    id: s.id,
    title: s.title,
    lessons: s.lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      contentType: l.contentType,
      isCompleted: user
        ? (l.progress as any[])?.length > 0 &&
          (l.progress as any[])[0].isCompleted
        : false,
    })),
  }));

  return (
    <div className="flex flex-col h-dvh bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      {/* Top Navbar */}
      <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-50 transition-colors duration-200">
        <div className="flex items-center gap-3">
          {/* Mobile: menu button to open sidebar */}
          <MobileSidebar
            sections={sidebarSections}
            courseSlug={slug}
            currentLessonSlug={currentLesson.slug}
          />
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="hidden sm:block text-gray-900 dark:text-white">
              Learn<span className="text-blue-600 dark:text-blue-400">ify</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px] md:max-w-xs hidden sm:block">
            {course.title}
          </h2>

          {/* Progress Indicator Header */}
          {user && enrollment && (
            <div className="hidden md:flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCourseFullyCompleted
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-blue-600 to-indigo-600"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                {progressPercentage}%
              </span>
              {isCourseFullyCompleted && (
                <Link
                  href={`/certificate/${enrollment.id}`}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Sertifikat</span>
                </Link>
              )}
            </div>
          )}
        </div>

        <ThemeToggle />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 flex-col bg-gray-50 dark:bg-gray-900 hidden md:flex transition-colors duration-200">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Link
              href={`/courses/${slug}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali ke Detail
            </Link>
          </div>

          {/* Progress Card in Sidebar */}
          {user && enrollment && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-500 dark:text-gray-400">Progres Belajar</span>
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCourseFullyCompleted
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-blue-600 to-indigo-600"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {completedLessonsCount} dari {totalLessonsCount} Pelajaran Selesai
              </p>
              {isCourseFullyCompleted && (
                <Link
                  href={`/certificate/${enrollment.id}`}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xs uppercase tracking-wider shadow-sm transition"
                >
                  <Award className="w-4 h-4" />
                  <span>Klaim Sertifikat Resmi</span>
                </Link>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {course.sections.map((section) => (
              <div key={section.id}>
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.title}
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {section.lessons.map((lesson) => {
                    const lessonIsCompleted = user
                      ? (lesson.progress as any[])?.length > 0 &&
                        (lesson.progress as any[])[0].isCompleted
                      : false;
                    const isActive = lesson.slug === currentLesson.slug;
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${slug}/learn/${lesson.slug}`}
                        className={`px-4 py-3 flex items-start gap-3 transition ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/50 border-r-4 border-blue-600"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800/60 bg-white dark:bg-gray-900"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {lessonIsCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : lesson.contentType === "video" ? (
                            <PlayCircle
                              className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}
                            />
                          ) : (
                            <FileText
                              className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm leading-snug ${isActive ? "text-blue-700 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {lesson.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 transition-colors duration-200">
          <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10">
            {/* Mobile back link */}
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4 md:hidden"
            >
              <ChevronLeft className="w-4 h-4" /> Detail Kursus
            </Link>

            {/* Completion Banner */}
            {isCourseFullyCompleted && enrollment && (
              <div className="mb-6 p-4 rounded-2xl bg-linear-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
                      Selamat! Anda Telah Menyelesaikan Kursus Ini 🎓
                    </h4>
                    <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300/80">
                      Sertifikat resmi kelulusan telah diterbitkan dan siap diunduh atau dibagikan ke LinkedIn.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/certificate/${enrollment.id}`}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-xs shrink-0"
                >
                  Lihat Sertifikat
                </Link>
              </div>
            )}

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-gray-900 dark:text-white leading-snug">
              {currentLesson.title}
            </h1>

            {/* Meta: estimated read time + share */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                {currentLesson.contentType === "article" &&
                  currentLesson.bodyText && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {estimasiWaktaBaca(currentLesson.bodyText)} mnt baca
                    </span>
                  )}
                <span className="capitalize">{currentLesson.contentType}</span>
              </div>
              <ShareButton
                title={currentLesson.title}
                url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://learnify.josapratama.com"}/courses/${slug}/learn/${currentLesson.slug}`}
              />
            </div>

            {currentLesson.contentType === "video" && currentLesson.videoUrl ? (
              <VideoPlayer
                url={currentLesson.videoUrl}
                lessonId={currentLesson.id}
                initialPosition={initialPosition}
              />
            ) : null}

            {/* Materi Teks */}
            {currentLesson.contentType !== "quiz" && currentLesson.bodyText && (
              <div className="prose prose-sm md:prose-base prose-blue dark:prose-invert max-w-none mb-10 text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <MarkdownContent content={currentLesson.bodyText} />
              </div>
            )}

            {/* Attachments */}
            {currentLesson.attachments.length > 0 && (
              <div className="mb-10 bg-blue-50 dark:bg-blue-950/30 p-4 md:p-6 rounded-xl border border-blue-100 dark:border-blue-900 transition-colors duration-200">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Lampiran Materi (
                  {currentLesson.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.attachments.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-600 transition group shadow-sm"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {file.title}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Kuis */}
            {currentLesson.contentType === "quiz" &&
              currentLesson.quizzes.length > 0 && (
                <div className="mb-10">
                  <QuizPlayer
                    quizzes={currentLesson.quizzes}
                    lessonId={currentLesson.id}
                  />
                </div>
              )}

            {!currentLesson.videoUrl &&
              !currentLesson.bodyText &&
              currentLesson.contentType !== "quiz" && (
                <div className="p-10 text-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                  Materi ini belum memiliki konten.
                </div>
              )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-8 border-t border-gray-100 dark:border-gray-800 mt-10">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/learn/${prevLesson.slug}`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Materi Sebelumnya
                </Link>
              ) : (
                <div />
              )}
              {user ? (
                <MarkCompleteButton
                  lessonId={currentLesson.id}
                  courseSlug={slug}
                  nextLessonSlug={nextLesson?.slug}
                  initialCompleted={isCompleted}
                  enrollmentId={enrollment?.id}
                  courseTitle={course.title}
                />
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition"
                >
                  Daftar Kursus untuk Lanjutkan
                </Link>
              )}
            </div>

            {/* Preview banner — hanya muncul untuk non-login */}
            {!user && (
              <div className="mt-8 p-5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-center">
                <p className="font-bold text-lg mb-1">
                  Anda sedang melihat materi preview
                </p>
                <p className="text-blue-100 text-sm mb-4">
                  Daftarkan diri untuk mengakses semua{" "}
                  {course.sections.flatMap((s) => s.lessons).length} pelajaran,
                  diskusi, dan sertifikat.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link
                    href={`/register`}
                    className="px-6 py-2 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
                  >
                    Daftar Gratis
                  </Link>
                  <Link
                    href={`/login?from=/courses/${slug}`}
                    className="px-6 py-2 bg-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/30 transition border border-white/30"
                  >
                    Sudah Punya Akun? Login
                  </Link>
                </div>
              </div>
            )}

            {user && <DiscussionSection lessonId={currentLesson.id} />}

            {/* Code Editor — hanya muncul pada materi hands-on / latihan coding yang relevan */}
            {(() => {
              const editorConfig = resolveLessonCodeEditor(course, currentLesson);
              if (!editorConfig) return null;
              return (
                <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        💻 Latihan / Praktik Koding
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Tulis dan uji kode latihan Anda di sini
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {editorConfig.language}
                    </span>
                  </div>
                  <CodeEditor
                    language={editorConfig.language}
                    initialCode={editorConfig.initialCode}
                    title={`Latihan — ${currentLesson.title}`}
                    showRunButton
                  />
                </div>
              );
            })()}

            {/* Catatan pelajaran */}
            {user && <LessonNotes lessonId={currentLesson.id} />}

            {user && (
              <AskAI
                lessonTitle={currentLesson.title}
                lessonContent={currentLesson.bodyText || "Materi Video"}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
