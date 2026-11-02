import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  Lock,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Sparkles,
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

  const completedCount = enrolledCourseIds.size;
  const totalCourses = path.courses.length;
  const progressPct =
    totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

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
                  Progres Belajar Anda
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  {completedCount} dari {totalCourses} Kursus Dimulai
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
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

            return (
              <div
                key={pc.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 border transition-all duration-200 ${
                  isEnrolled
                    ? "border-emerald-200 dark:border-emerald-800/80 shadow-md shadow-emerald-500/5"
                    : "border-gray-100 dark:border-gray-800/80 hover:shadow-lg"
                } ${isLocked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number / Status Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                      isEnrolled
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : isLocked
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                    }`}
                  >
                    {isEnrolled ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 block">
                      Langkah {index + 1}
                    </span>
                    <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-1 leading-snug">
                      {pc.course.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Dipandu oleh {pc.course.instructor.fullName || "Mentor Learnify"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {pc.course._count.sections} Modul
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
                  </div>
                </div>

                {/* Action Button */}
                {!isLocked && (
                  <Link
                    href={`/courses/${pc.course.slug}`}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 transition-all ${
                      isEnrolled
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                    }`}
                  >
                    <span>{isEnrolled ? "Lanjutkan Belajar" : "Mulai Kursus"}</span>
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
