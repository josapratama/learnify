import { redirect } from "next/navigation";
import Link from "next/link";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Star,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AdminUserTable from "@/components/AdminUserTable";
import Footer from "@/components/Footer";

export const metadata = { title: "Admin Panel | Learnify" };

export default async function AdminPage() {
  const user = await requireValidUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    revenueData,
    recentUsers,
    discussionsCount,
    reviewStats,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count({ where: { status: "paid" } }),
    prisma.enrollment.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.discussion.count(),
    prisma.review.aggregate({
      _count: { id: true },
      _avg: { rating: true },
    }),
    prisma.enrollment.findMany({
      where: { status: "paid" },
      orderBy: { enrolledAt: "desc" },
      take: 5,
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { title: true, slug: true, price: true } },
      },
    }),
  ]);

  const totalRevenue = revenueData._sum.amount || 0;
  const avgRating = reviewStats._avg.rating
    ? reviewStats._avg.rating.toFixed(1)
    : "5.0";
  const totalReviews = reviewStats._count.id;

  const stats = [
    {
      label: "Total Pengguna",
      value: totalUsers.toLocaleString("id-ID"),
      icon: Users,
      bg: "bg-blue-50 dark:bg-blue-950/50",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Kursus",
      value: totalCourses.toLocaleString("id-ID"),
      icon: BookOpen,
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Enrollment Aktif",
      value: totalEnrollments.toLocaleString("id-ID"),
      icon: TrendingUp,
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Total Revenue",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      bg: "bg-amber-50 dark:bg-amber-950/50",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Diskusi Aktif",
      value: discussionsCount.toLocaleString("id-ID"),
      icon: MessageSquare,
      bg: "bg-purple-50 dark:bg-purple-950/50",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Rating Platform",
      value: `${avgRating} ★ (${totalReviews} ulasan)`,
      icon: Star,
      bg: "bg-yellow-50 dark:bg-yellow-950/50",
      textColor: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-xl"
          >
            <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">
                Learn<span className="text-blue-600 dark:text-blue-400">ify</span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                Admin
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl"
            >
              ← Dashboard Siswa
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-800">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Admin Platform Overview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Pantau seluruh aktivitas operasional, pertumbuhan pengguna, kursus, dan analitik pendapatan platform.
            </p>
          </div>
        </div>

        {/* Stats Grid — 6 Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, bg, textColor }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col justify-between"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${bg} ${textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight truncate">
                  {value}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              href: "/admin/users",
              label: "Kelola Pengguna",
              desc: `${totalUsers} akun terdaftar`,
            },
            {
              href: "/admin/courses",
              label: "Kelola Kursus",
              desc: `${totalCourses} kursus platform`,
            },
            {
              href: "/learning-paths",
              label: "Learning Paths",
              desc: "Kurikulum jalur belajar",
            },
            {
              href: "/admin/transactions",
              label: "Transaksi & Finansial",
              desc: "Riwayat pembayaran siswa",
            },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition group"
            >
              <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1 text-sm sm:text-base">
                {label}
              </p>
              <p className="text-xs text-gray-400">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs mb-8">
          <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                Pendaftaran &amp; Transaksi Terbaru
              </h2>
              <p className="text-xs text-gray-400">
                5 transaksi pendaftaran siswa terakhir yang berhasil diproses
              </p>
            </div>
            <Link
              href="/admin/transactions"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Transaksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentEnrollments.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Belum ada transaksi pendaftaran terbaru.
              </div>
            ) : (
              recentEnrollments.map((en) => {
                const effectiveAmount = en.amount || en.course.price;
                return (
                  <div
                    key={en.id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                          {en.user.fullName || en.user.email}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          Mendaftar pada: <strong className="text-gray-700 dark:text-gray-300">{en.course.title}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-gray-900 dark:text-white text-xs sm:text-sm">
                        {effectiveAmount === 0
                          ? "Gratis"
                          : `Rp ${effectiveAmount.toLocaleString("id-ID")}`}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(en.enrolledAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                Pengguna Terbaru
              </h2>
              <p className="text-xs text-gray-400">
                Daftar akun yang baru saja mendaftar ke platform Learnify
              </p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Kelola Pengguna Penuh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <AdminUserTable users={recentUsers} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
