import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  Lock,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Award,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function LearningPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  const path = await prisma.learningPath.findUnique({
    where: { slug },
    include: {
      courses: {
        orderBy: { orderIndex: "asc" },
        include: {
          course: {
            include: {
              instructor: { select: { fullName: true } },
              _count: { select: { enrollments: true, sections: true } },
              sections: {
                orderBy: { orderIndex: "asc" },
                include: {
                  lessons: {
                    orderBy: { orderIndex: "asc" },
                    include: {
                      progress: user ? { where: { userId: user.id } } : false,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!path) notFound();

  // Cek enrollment user untuk setiap kursus
  let enrolledCourseIds = new Set<string>();
  if (user) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id,
        courseId: { in: path.courses.map((pc) => pc.courseId) },
      },
      select: { courseId: true },
    });
    enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  }

  // Hitung jumlah kursus yang 100% selesai dan kursus yang sudah diambil
  const totalCourses = path.courses.length;
  let fullyCompletedCoursesCount = 0;
  let enrolledCoursesCount = 0;

  path.courses.forEach((pc) => {
    const isEnrolled = enrolledCourseIds.has(pc.courseId);
    if (isEnrolled) enrolledCoursesCount++;

    const lessons = pc.course.sections.flatMap((s) => s.lessons);
    const completedLessons = lessons.filter((l) =>
      l.progress?.some((p: any) => p.isCompleted),
    ).length;
    if (lessons.length > 0 && completedLessons === lessons.length) {
      fullyCompletedCoursesCount++;
    }
  });

  const pathProgressPct =
    totalCourses > 0
      ? Math.round((fullyCompletedCoursesCount / totalCourses) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/learning-paths"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Learning Paths</span>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {path.level}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {path.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
            {path.description}
          </p>

          {/* User Progress Card */}
          {user && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700/80 max-w-lg">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-3">
                <span className="text-gray-700 dark:text-gray-300">
                  Progres Jalur Belajar
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  {fullyCompletedCoursesCount} dari {totalCourses} Kursus Tuntas ({pathProgressPct}%)
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fullyCompletedCoursesCount === totalCourses
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-blue-500 to-indigo-600"
                  }`}
                  style={{ width: `${pathProgressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {enrolledCoursesCount} kursus telah Anda daftarkan dalam kurikulum ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Roadmap Steps */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          Tahapan Kursus (Roadmap)
        </h2>

        <div className="space-y-4">
          {path.courses.map((pc, index) => {
            const isEnrolled = enrolledCourseIds.has(pc.courseId);
            const isFirst = index === 0;
            const prevEnrolled =
              index === 0 ||
              enrolledCourseIds.has(path.courses[index - 1]?.courseId);
            const isLocked = !isFirst && !prevEnrolled && !isEnrolled;

            // Perhitungan progress per-kursus
            const lessons = pc.course.sections.flatMap((s) => s.lessons);
            const totalLessons = lessons.length;
            const completedLessons = lessons.filter((l) =>
              l.progress?.some((p: any) => p.isCompleted),
            ).length;
            const coursePct =
              totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;
            const isCourseFinished =
              totalLessons > 0 && completedLessons === totalLessons;

            // Target smart learn link
            const nextUncompleted = lessons.find(
              (l) => !l.progress?.some((p: any) => p.isCompleted),
            );
            const resumeSlug = (nextUncompleted || lessons[0])?.slug || "";
            const targetUrl =
              isEnrolled && resumeSlug
                ? `/courses/${pc.course.slug}/learn/${resumeSlug}`
                : `/courses/${pc.course.slug}`;

            return (
              <div
                key={pc.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 border transition-all duration-200 ${
                  isCourseFinished
                    ? "border-emerald-300 dark:border-emerald-800 shadow-md shadow-emerald-500/10"
                    : isEnrolled
                      ? "border-blue-200 dark:border-blue-800/80 shadow-md shadow-blue-500/5"
                      : "border-gray-100 dark:border-gray-800/80 hover:shadow-lg"
                } ${isLocked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Step Number / Status Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                      isCourseFinished
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : isEnrolled
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : isLocked
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400"
                            : "bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {isCourseFinished ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    ) : isEnrolled ? (
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Langkah {index + 1}
                      </span>
                      {isCourseFinished ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Lulus 100%
                        </span>
                      ) : isEnrolled ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Sedang Belajar ({coursePct}%)
                        </span>
                      ) : isLocked ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-400">
                          Terkunci
                        </span>
                      ) : null}
                    </div>

                    <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-1 leading-snug">
                      {pc.course.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Dipandu oleh {pc.course.instructor.fullName || "Mentor Learnify"}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {pc.course._count.sections} Modul ({totalLessons} Pelajaran)
                      </span>
                      <span>•</span>
                      <span className="capitalize">{pc.course.level}</span>
                      <span>•</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {pc.course.price === 0
                          ? "Gratis"
                          : `Rp ${pc.course.price.toLocaleString("id-ID")}`}
                      </span>
                    </div>

                    {/* Mini Progress Bar Per-Course */}
                    {isEnrolled && (
                      <div className="mt-3 max-w-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                          <span>{completedLessons} dari {totalLessons} materi selesai</span>
                          <span
                            className={
                              isCourseFinished
                                ? "text-emerald-600 dark:text-emerald-400 font-black"
                                : "text-blue-600 dark:text-blue-400 font-black"
                            }
                          >
                            {coursePct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCourseFinished
                                ? "bg-emerald-500"
                                : "bg-linear-to-r from-blue-500 to-indigo-600"
                            }`}
                            style={{ width: `${coursePct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {!isLocked && (
                  <Link
                    href={targetUrl}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 transition-all ${
                      isCourseFinished
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        : isEnrolled
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                          : "bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-md"
                    }`}
                  >
                    <span>
                      {isCourseFinished
                        ? "Tinjau Kursus"
                        : isEnrolled
                          ? "Lanjutkan Belajar"
                          : "Mulai Kursus"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
