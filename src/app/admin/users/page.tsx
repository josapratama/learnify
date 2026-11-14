import { redirect } from "next/navigation";
import Link from "next/link";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  GraduationCap,
  Users,
  Shield,
  UserCheck,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AdminUserTable from "@/components/AdminUserTable";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kelola Pengguna | Admin Learnify",
  description: "Daftar seluruh pengguna, pengaturan role, dan ekspor data pengguna.",
};

export default async function AdminUsersPage() {
  const user = await requireValidUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const [totalCount, studentCount, instructorCount, adminCount, allUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "instructor" } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl">
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/admin"
              className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Admin Panel</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 mb-6">
          <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Admin Panel
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 dark:text-gray-200">Kelola Pengguna</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pantau seluruh akun terdaftar, ubah hak akses (role), dan ekspor data ke format CSV.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Pengguna",
              value: totalCount,
              icon: Users,
              color: "blue",
            },
            {
              label: "Siswa / Pelajar",
              value: studentCount,
              icon: UserCheck,
              color: "emerald",
            },
            {
              label: "Instruktur",
              value: instructorCount,
              icon: GraduationCap,
              color: "indigo",
            },
            {
              label: "Administrator",
              value: adminCount,
              icon: Shield,
              color: "rose",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    color === "blue"
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      : color === "emerald"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                        : color === "indigo"
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                          : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {value.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* Users Table Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              Daftar Semua Pengguna ({allUsers.length})
            </h2>
          </div>
          <AdminUserTable users={allUsers} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
