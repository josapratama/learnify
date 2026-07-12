import Link from "next/link";
import { redirect } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  LayoutDashboard,
  Flame,
} from "lucide-react";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const user = await requireValidUser();

  if (!user) {
    redirect("/login");
  }

  // Get enrolled courses with progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          instructor: { select: { fullName: true } },
          sections: {
            include: {
              lessons: {
                include: {
                  progress: {
                    where: { userId: user.id },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      streak: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Dashboard Nav */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-8 h-8" />
            <span className="tracking-tight">EduTech</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100 dark:border-orange-800/50">
              <Flame className="w-4 h-4 fill-current" />
              <span>{dbUser?.streak || 0} Hari Belajar</span>
            </div>

            <ThemeToggle />

            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">
                {dbUser?.fullName?.split(" ")[0]}
              </span>
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-200 dark:shadow-none transition-transform hover:scale-105">
                {dbUser?.fullName?.charAt(0) || user.email.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 p-4 md:p-8 lg:p-10">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-3">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3.5 bg-blue-600 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700"
            >
              <BookOpen className="w-5 h-5 shrink-0" /> Kursus Saya
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl font-semibold transition mt-2"
            >
              <Award className="w-5 h-5 shrink-0" /> Sertifikat
            </Link>
            <Link
              href="/notes"
              className="flex items-center gap-3 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl font-semibold transition mt-2"
            >
              <BookOpen className="w-5 h-5 shrink-0" /> Catatan Saya
            </Link>
            <Link
              href="/referral"
              className="flex items-center gap-3 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl font-semibold transition mt-2"
            >
              <Clock className="w-5 h-5 shrink-0" /> Program Referral
            </Link>
            {dbUser?.role === "instructor" || dbUser?.role === "admin" ? (
              <Link
                href="/instructor"
                className="flex items-center gap-3 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl font-semibold transition mt-2"
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" /> Mode Instruktur
              </Link>
            ) : null}
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
              <LogoutButton />
            </div>
          </div>

          {/* User Streak — hidden on md+ (shown in navbar instead) */}
          <div className="md:hidden bg-linear-to-r from-orange-500 to-red-600 p-5 rounded-3xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-1">
              <Flame className="w-6 h-6 fill-current" />
              <span className="text-2xl font-black">
                {dbUser?.streak || 0} Hari
              </span>
            </div>
            <p className="text-orange-100 text-xs font-medium">
              Jangan biarkan streakmu terputus!
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Halo, {dbUser?.fullName?.split(" ")[0]}!{" "}
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">
              Ayo lanjutkan perjalanan belajarmu hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enrollments.length > 0 ? (
              enrollments.map((en) => {
                const lessons = en.course.sections.flatMap((s) => s.lessons);
                const totalLessons = lessons.length;
                const completedLessons = lessons.filter(
                  (l) => l.progress.length > 0 && l.progress[0].isCompleted,
                ).length;
                const progressPercent =
                  totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0;

                return (
                  <div
                    key={en.id}
                    className="bg-white dark:bg-gray-900 rounded-4xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:translate-y-[-4px] transition-all duration-300 group"
                  >
                    <div className="aspect-16/10 bg-gray-900 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-black p-8 text-center z-10 group-hover:scale-105 transition-transform duration-700">
                        {en.course.title}
                      </div>
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-br from-blue-600/80 to-purple-700/80 z-0"></div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30 z-20">
                        {en.course.instructor.fullName}
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-6 flex-1">
                        <div className="flex justify-between items-end mb-3">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${progressPercent === 100 ? "text-green-500" : "text-blue-500"}`}
                          >
                            {progressPercent === 100
                              ? "Selesai"
                              : "Progres Belajar"}
                          </span>
                          <span className="text-2xl font-black text-gray-900 dark:text-white">
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full transition-all duration-1000 ease-out rounded-full ${progressPercent === 100 ? "bg-linear-to-r from-green-400 to-green-600" : "bg-linear-to-r from-blue-500 to-indigo-600"}`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Link
                          href={`/courses/${en.course.slug}/learn/${en.course.sections[0]?.lessons[0]?.slug || ""}`}
                          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black transition-all ${
                            progressPercent === 100
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100"
                              : "bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-200 dark:shadow-none"
                          }`}
                        >
                          {progressPercent === 100
                            ? "Lihat Kembali"
                            : progressPercent > 0
                              ? "Lanjutkan Belajar"
                              : "Mulai Sekarang"}
                          <ChevronRight className="w-5 h-5" />
                        </Link>

                        {progressPercent === 100 && (
                          <Link
                            href={`/certificate/${en.id}`}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black bg-linear-to-r from-yellow-400 to-orange-500 text-white hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-100 dark:shadow-none"
                          >
                            <Award className="w-5 h-5" />
                            Klaim Sertifikat
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white dark:bg-gray-900 p-12 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Belum ada kursus
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Kamu belum terdaftar di kursus manapun.
                </p>
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition inline-block"
                >
                  Cari Kursus Sekarang
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
