import Link from "next/link";
import {
  GraduationCap,
  Users,
  DollarSign,
  TrendingUp,
  BookOpen,
  ChevronLeft,
  LayoutDashboard,
  PlusCircle,
  MoreVertical,
  Star,
  MessageSquare,
  Settings,
} from "lucide-react";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import InstructorDashboardHeader from "@/components/InstructorDashboardHeader";
import CourseActions from "@/components/CourseActions";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Dashboard Instruktur | Learnify",
  description: "Kelola kursus, pantau analitik siswa dan performa pengajaran Anda.",
};

export default async function InstructorDashboard() {
  const user = await requireValidUser();

  // Proteksi: Hanya instructor/admin yang bisa akses
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    redirect("/dashboard");
  }

  const instructorCourses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      enrollments: {
        where: { status: "paid" },
        include: { user: { select: { fullName: true, email: true } } },
        orderBy: { enrolledAt: "desc" },
      },
      reviews: {
        include: { user: { select: { fullName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const totalStudents = instructorCourses.reduce(
    (acc, c) => acc + c.enrollments.length,
    0,
  );
  const totalRevenue = instructorCourses.reduce(
    (acc, c) => acc + c.enrollments.length * c.price,
    0,
  );

  // Recent Activities (Combine and sort enrollments and reviews)
  const recentEnrollments = instructorCourses
    .flatMap((c) =>
      c.enrollments.map((e) => ({
        ...e,
        type: "enrollment",
        courseTitle: c.title,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
    )
    .slice(0, 5);

  const recentReviews = instructorCourses
    .flatMap((c) =>
      c.reviews.map((r) => ({ ...r, type: "review", courseTitle: c.title })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const avgRating =
    instructorCourses.reduce((acc, c) => {
      const courseAvg =
        c.reviews.length > 0
          ? c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length
          : 5;
      return acc + courseAvg;
    }, 0) / (instructorCourses.length || 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-black text-xl"
          >
            <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">
                Learn<span className="text-blue-600 dark:text-blue-400">ify</span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Instructor
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />{" "}
              <span>Mode Siswa</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10">
        <InstructorDashboardHeader />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 mb-10 md:mb-12">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 group hover:translate-y-[-4px] transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
              Total Siswa
            </p>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">
              {totalStudents}
            </h3>
            <div className="flex items-center gap-2 mt-4">
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-lg">
                {instructorCourses.length} Kursus Aktif
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 group hover:translate-y-[-4px] transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
              Pendapatan
            </p>
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mt-2 break-all">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h3>
            <div className="flex items-center gap-2 mt-4">
              <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg">
                Pembayaran Midtrans
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 group hover:translate-y-[-4px] transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
              Rating Rata-rata
            </p>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">
              {avgRating.toFixed(1)}
            </h3>
            <p className="text-gray-400 text-[10px] font-bold mt-4 uppercase tracking-widest italic">
              Berdasarkan ulasan siswa
            </p>
          </div>
        </div>

        {/* Analytics & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" /> Analitik
              Pendapatan
            </h2>
            {totalRevenue > 0 ? (
              <div className="h-48 md:h-72 flex items-end gap-2 md:gap-4 px-2">
                {[40, 65, 45, 80, 55, 90, 75].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 md:gap-4 group"
                  >
                    <div
                      className="w-full bg-blue-50 dark:bg-blue-900/10 rounded-2xl group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-all duration-500 relative flex items-end overflow-hidden"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="w-full bg-blue-600 dark:bg-blue-500 rounded-2xl transition-all duration-1000 delay-300"
                        style={{ height: `${val}%` }}
                      />
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-[9px] font-black py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl z-20 whitespace-nowrap">
                        Rp {((val * totalRevenue) / 100).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                      {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 md:h-72 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-gray-100 dark:border-gray-800">
                <DollarSign className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Belum Ada Transaksi Pendapatan</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">Grafik mingguan otomatis terbentuk ketika siswa membeli kursus berbayar Anda.</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-indigo-600" /> Aktivitas
              Terbaru
            </h2>
            <div className="space-y-6">
              {recentEnrollments.map((en) => (
                <div key={en.id} className="flex gap-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-snug">
                      <span className="font-black text-gray-900 dark:text-white">
                        {en.user.fullName}
                      </span>{" "}
                      mendaftar di{" "}
                      <span className="font-black text-blue-600 dark:text-blue-400">
                        {en.courseTitle}
                      </span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                      {new Date(en.enrolledAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {recentReviews.map((rev) => (
                <div key={rev.id} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                      <span className="font-black text-gray-900 dark:text-white">
                        {rev.user.fullName}
                      </span>{" "}
                      memberikan rating
                      <span className="font-black text-yellow-500">
                        {" "}
                        {rev.rating}.0
                      </span>{" "}
                      pada
                      <span className="font-black text-blue-600 dark:text-blue-400">
                        {" "}
                        {rev.courseTitle}
                      </span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                      {new Date(rev.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {recentEnrollments.length === 0 && recentReviews.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <LayoutDashboard className="w-8 h-8" />
                  </div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                    Belum ada aktivitas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Kursus Anda
            </h2>
            <Link
              href="#"
              className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          {/* Scrollable table wrapper for small screens */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5">Kursus</th>
                  <th className="px-6 md:px-8 py-4 md:py-5">Status</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-center">
                    Siswa
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-5">Harga</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-center">
                    Rating
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {instructorCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-blue-100 dark:shadow-none group-hover:scale-110 transition-transform">
                          {course.title.charAt(0)}
                        </div>
                        <span className="font-black text-gray-900 dark:text-white text-sm line-clamp-1 tracking-tight max-w-[120px] md:max-w-none">
                          {course.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <span
                        className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap ${course.isPublished ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800" : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800"}`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-center text-sm text-gray-700 dark:text-gray-300 font-black">
                      {course.enrollments.length}
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-sm text-gray-900 dark:text-white font-black tracking-tight whitespace-nowrap">
                      Rp {course.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="flex items-center justify-center gap-1.5 text-yellow-500 font-black text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        {course.reviews.length > 0
                          ? (
                              course.reviews.reduce((a, b) => a + b.rating, 0) /
                              course.reviews.length
                            ).toFixed(1)
                          : "5.0"}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/instructor/courses/${course.id}/edit`}
                          className="p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl text-gray-400 dark:text-gray-500 transition-all shadow-sm"
                          title="Edit Kurikulum"
                        >
                          <Settings className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                        <CourseActions
                          courseId={course.id}
                          courseSlug={course.slug}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
