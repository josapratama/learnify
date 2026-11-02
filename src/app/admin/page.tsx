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
    discussions,
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
      take: 10,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.discussion.count(),
  ]);

  const totalRevenue = revenueData._sum.amount || 0;

  const stats = [
    {
      label: "Total Pengguna",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "blue",
    },
    {
      label: "Total Kursus",
      value: totalCourses.toLocaleString(),
      icon: BookOpen,
      color: "green",
    },
    {
      label: "Enrollment Aktif",
      value: totalEnrollments.toLocaleString(),
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Total Revenue",
      value: `Rp${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "yellow",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
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
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-10">
          <AlertCircle className="w-7 h-7 text-red-500" />
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Admin Panel
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <Icon className={`w-6 h-6 mb-3 text-${color}-500`} />
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              href: "/admin/users",
              label: "Kelola Pengguna",
              desc: `${totalUsers} user`,
            },
            {
              href: "/admin/courses",
              label: "Kelola Kursus",
              desc: `${totalCourses} kursus`,
            },
            {
              href: "/admin/learning-paths",
              label: "Learning Paths",
              desc: "Kelola jalur belajar",
            },
            {
              href: "/admin/transactions",
              label: "Transaksi",
              desc: "Riwayat pembayaran",
            },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition group"
            >
              <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1">
                {label}
              </p>
              <p className="text-sm text-gray-400">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Pengguna Terbaru
            </h2>
          </div>
          <AdminUserTable users={recentUsers} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
