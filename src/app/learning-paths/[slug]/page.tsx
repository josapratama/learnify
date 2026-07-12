import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  CheckCircle,
  Lock,
  ChevronRight,
  Clock,
  BookOpen,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

export default async function LearningPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireValidUser();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" /> EduTech
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/learning-paths"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition"
            >
              ← Semua Paths
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {path.level}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          {path.title}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mb-8">
          {path.description}
        </p>

        {user && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 mb-10 max-w-md">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Progress Anda
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                {completedCount}/{totalCourses} kursus terdaftar
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Kursus List */}
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
                className={`flex gap-4 bg-white dark:bg-gray-900 rounded-2xl p-6 border transition-all ${isEnrolled ? "border-green-200 dark:border-green-800" : "border-gray-100 dark:border-gray-800"} ${isLocked ? "opacity-60" : "hover:shadow-md"}`}
              >
                {/* Step Number */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${isEnrolled ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
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
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Langkah {index + 1}
                      </p>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                        {pc.course.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        oleh {pc.course.instructor.fullName}
                      </p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />{" "}
                          {pc.course._count.sections} modul
                        </span>
                        <span className="capitalize">{pc.course.level}</span>
                        <span>
                          {pc.course.price === 0
                            ? "Gratis"
                            : `Rp${pc.course.price.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                    </div>
                    {!isLocked && (
                      <Link
                        href={`/courses/${pc.course.slug}`}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-sm shrink-0 transition ${isEnrolled ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      >
                        {isEnrolled ? "Lanjutkan" : "Mulai"}{" "}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
