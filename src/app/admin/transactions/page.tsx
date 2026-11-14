import { redirect } from "next/navigation";
import Link from "next/link";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  GraduationCap,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AdminTransactionsTable from "./AdminTransactionsTable";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Riwayat Transaksi | Admin Learnify",
  description: "Daftar seluruh transaksi pembayaran pendaftaran siswa, status, dan ekspor CSV.",
};

export default async function AdminTransactionsPage() {
  const user = await requireValidUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const [enrollments, paidSumData, pendingCount] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { title: true, slug: true, price: true } },
      },
    }),
    prisma.enrollment.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.enrollment.count({ where: { status: "pending" } }),
  ]);

  const totalPaidRevenue = paidSumData._sum.amount || 0;
  const totalPaidCount = paidSumData._count.id || 0;
  const avgOrderValue =
    totalPaidCount > 0 ? Math.round(totalPaidRevenue / totalPaidCount) : 0;

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
          <span className="text-gray-800 dark:text-gray-200">Riwayat Transaksi</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Laporan Keuangan &amp; Transaksi
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pantau seluruh riwayat checkout pendaftaran siswa, status pembayaran Midtrans / Payment Gateway, dan ekspor laporan ke CSV.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Pendapatan Sukses",
              value: `Rp ${totalPaidRevenue.toLocaleString("id-ID")}`,
              icon: DollarSign,
              color: "emerald",
            },
            {
              label: "Transaksi Berhasil (Paid)",
              value: `${totalPaidCount} transaksi`,
              icon: TrendingUp,
              color: "blue",
            },
            {
              label: "Menunggu Pembayaran",
              value: `${pendingCount} pending`,
              icon: Clock,
              color: "amber",
            },
            {
              label: "Rata-rata Order (AOV)",
              value: `Rp ${avgOrderValue.toLocaleString("id-ID")}`,
              icon: Receipt,
              color: "indigo",
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
                    color === "emerald"
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                      : color === "blue"
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : color === "amber"
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                          : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Transactions Table Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              Semua Transaksi Siswa ({enrollments.length})
            </h2>
          </div>
          <AdminTransactionsTable transactions={enrollments} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
