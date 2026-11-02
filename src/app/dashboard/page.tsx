import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  FileText,
  Clock,
  LayoutDashboard,
  Compass,
  ArrowRight,
  Sparkles,
  Trophy,
  Zap,
  Medal,
} from "lucide-react";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "Dashboard Siswa | Learnify",
  description: "Pantau kemajuan belajar, modul aktif, dan sertifikat di Learnify.",
};

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
    orderBy: { enrolledAt: "desc" },
  });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      streak: true,
    },
  });

  // Calculate student XP & Leaderboard
  const topStudents = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      streak: true,
      progress: {
        where: { isCompleted: true },
        select: { id: true },
      },
    },
    take: 15,
  });

  const leaderboard = topStudents
    .map((s) => {
      const completed = s.progress.length;
      const xp = completed * 50 + (s.streak || 0) * 25;
      return {
        id: s.id,
        name: s.fullName || "Siswa",
        avatarUrl: s.avatarUrl,
        streak: s.streak || 0,
        completedLessons: completed,
        xp,
      };
    })
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  const myCompletedLessons = await prisma.progress.count({
    where: { userId: user.id, isCompleted: true },
  });
  const myXp = myCompletedLessons * 50 + (dbUser?.streak || 0) * 25;

  const totalEnrolled = enrollments.length;
  const completedCount = enrollments.filter((en) => {
    const lessons = en.course.sections.flatMap((s) => s.lessons);
    const completedLessons = lessons.filter(
      (l) => l.progress.length > 0 && l.progress[0].isCompleted,
    );
    return lessons.length > 0 && completedLessons.length === lessons.length;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar user={dbUser} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* User Welcome Banner */}
        <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/10 mb-8 sm:mb-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Area Belajar Siswa</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                Halo, {dbUser?.fullName?.split(" ")[0] || "Siswa"}! 👋
              </h1>
              <p className="text-blue-100 text-sm sm:text-base max-w-xl font-medium">
                Lanjutkan perjalanan belajarmu hari ini. Kumpulkan XP dan pertahankan streak belajarmu!
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 text-center">
                <div className="text-xl sm:text-2xl font-black">{totalEnrolled}</div>
                <div className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">
                  Kursus Aktif
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 text-center">
                <div className="text-xl sm:text-2xl font-black">{completedCount}</div>
                <div className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">
                  Telah Selesai
                </div>
              </div>
              <div className="bg-amber-500/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black">
                  <Zap className="w-5 h-5 fill-current text-yellow-200" />
                  <span>{myXp}</span>
                </div>
                <div className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
                  Total XP
                </div>
              </div>
              {(dbUser?.streak ?? 0) > 0 && (
                <div className="bg-orange-500/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black">
                    <Flame className="w-5 h-5 fill-current" />
                    <span>{dbUser?.streak}</span>
                  </div>
                  <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
                    Hari Streak
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shrink-0 shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Kursus Saya</span>
          </Link>
          <Link
            href="/notes"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0 border border-gray-200 dark:border-gray-800"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Catatan</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0 border border-gray-200 dark:border-gray-800"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Sertifikat</span>
          </Link>
          <Link
            href="/referral"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0 border border-gray-200 dark:border-gray-800"
          >
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Referral</span>
          </Link>
          {(dbUser?.role === "instructor" || dbUser?.role === "admin") && (
            <Link
              href="/instructor"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0 border border-gray-200 dark:border-gray-800"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>Instruktur</span>
            </Link>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar */}
          <aside className="hidden md:block md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-100 dark:border-gray-800/80 shadow-sm sticky top-24 space-y-4">
              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold transition shadow-md shadow-blue-500/20 text-sm"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Kursus Saya</span>
                </Link>
                <Link
                  href="/notes"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-2xl font-bold transition text-sm"
                >
                  <FileText className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Catatan Saya</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-2xl font-bold transition text-sm"
                >
                  <Award className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Sertifikat & Profil</span>
                </Link>
                <Link
                  href="/referral"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-2xl font-bold transition text-sm"
                >
                  <Clock className="w-4 h-4 shrink-0 text-purple-500" />
                  <span>Program Referral</span>
                </Link>
                {(dbUser?.role === "instructor" || dbUser?.role === "admin") && (
                  <Link
                    href="/instructor"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-2xl font-bold transition text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0 text-indigo-500" />
                    <span>Mode Instruktur</span>
                  </Link>
                )}
              </nav>

              {/* Leaderboard Sidebar Widget */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                      Peringkat Siswa
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Top XP
                  </span>
                </div>

                <div className="space-y-1.5">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((student, idx) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                          student.id === user.id
                            ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 font-bold"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-4 text-center font-bold text-xs shrink-0">
                            {idx === 0
                              ? "🥇"
                              : idx === 1
                                ? "🥈"
                                : idx === 2
                                  ? "🥉"
                                  : `${idx + 1}`}
                          </span>
                          <span className="truncate text-gray-900 dark:text-white">
                            {student.name.split(" ")[0]}{" "}
                            {student.id === user.id && (
                              <span className="text-[10px] text-blue-600 font-normal">
                                (Kamu)
                              </span>
                            )}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                          {student.xp} XP
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic px-2">
                      Belum ada skor XP.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <LogoutButton />
              </div>
            </div>
          </aside>

          {/* Main Courses Content */}
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Kursus Sedang Dipelajari
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Lanjutkan dari materi terakhir yang kamu selesaikan.
                </p>
              </div>
              <Link
                href="/#courses"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Cari Kursus Baru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Top Accent Strip & Category */}
                      <div className="p-6 pb-0">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            {en.course.category}
                          </span>
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            {completedLessons} / {totalLessons} Selesai
                          </span>
                        </div>

                        <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2">
                          {en.course.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                          Instruktur: {en.course.instructor?.fullName || "Learnify Mentor"}
                        </p>
                      </div>

                      {/* Progress bar & CTA */}
                      <div className="p-6 pt-0 mt-auto">
                        <div className="mb-5">
                          <div className="flex justify-between items-center text-xs font-bold mb-2">
                            <span
                              className={
                                progressPercent === 100
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-blue-600 dark:text-blue-400"
                              }
                            >
                              {progressPercent === 100
                                ? "Telah Selesai"
                                : "Progres Belajar"}
                            </span>
                            <span className="text-sm font-black text-gray-900 dark:text-white">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ease-out rounded-full ${
                                progressPercent === 100
                                  ? "bg-linear-to-r from-emerald-500 to-green-600"
                                  : "bg-linear-to-r from-blue-500 to-indigo-600"
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <Link
                            href={`/courses/${en.course.slug}/learn/${en.course.sections[0]?.lessons[0]?.slug || ""}`}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all ${
                              progressPercent === 100
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                            }`}
                          >
                            <span>
                              {progressPercent === 100
                                ? "Pelajari Ulang"
                                : progressPercent > 0
                                  ? "Lanjutkan Belajar"
                                  : "Mulai Belajar"}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </Link>

                          {progressPercent === 100 && (
                            <Link
                              href={`/certificate/${en.id}`}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black bg-linear-to-r from-amber-400 to-orange-500 text-white hover:opacity-95 shadow-md shadow-amber-500/20 transition-all"
                            >
                              <Award className="w-4 h-4" />
                              <span>Lihat Sertifikat Kelulusan</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-white dark:bg-gray-900 p-12 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1.5">
                    Belum Ada Kursus Terdaftar
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Jelajahi beragam katalog kursus pilihan kami dan mulai tingkatkan keahlian teknologi Anda hari ini.
                  </p>
                  <Link
                    href="/#courses"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition"
                  >
                    <span>Jelajahi Katalog Kursus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Gamification Rules Banner */}
            <div className="mt-8 bg-linear-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 border border-amber-200/60 dark:border-amber-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                  <Medal className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                    Cara Mendapatkan XP & Menaikkan Peringkat
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Selesaikan materi kursus (+50 XP) dan jaga streak belajar harianmu (+25 XP/hari).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <span className="block text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    +50 XP
                  </span>
                  <span className="text-[10px] text-gray-400">Tiap Materi</span>
                </div>
                <div className="text-center px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <span className="block text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                    +25 XP
                  </span>
                  <span className="text-[10px] text-gray-400">Streak Harian</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
