"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export interface AdminTransactionItem {
  id: string;
  status: string;
  paymentId: string | null;
  amount: number;
  enrolledAt: Date | string;
  user: {
    fullName: string | null;
    email: string;
  };
  course: {
    title: string;
    slug: string;
    price: number;
  };
}

export default function AdminTransactionsTable({
  transactions,
}: {
  transactions: AdminTransactionItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "pending" | "cancelled"
  >("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const userMatch =
        (t.user.fullName || "").toLowerCase().includes(q) ||
        t.user.email.toLowerCase().includes(q);
      const courseMatch = t.course.title.toLowerCase().includes(q);
      const paymentIdMatch = (t.paymentId || "").toLowerCase().includes(q);

      return userMatch || courseMatch || paymentIdMatch;
    });
  }, [transactions, statusFilter, searchQuery]);

  const exportCSV = () => {
    const headers = [
      "ID Transaksi",
      "Nama Siswa",
      "Email Siswa",
      "Kursus",
      "Nominal (IDR)",
      "Status",
      "Payment ID",
      "Waktu Transaksi",
    ];

    const rows = filteredTransactions.map((t) => [
      `"${t.id}"`,
      `"${(t.user.fullName || "").replace(/"/g, '""')}"`,
      `"${t.user.email}"`,
      `"${t.course.title.replace(/"/g, '""')}"`,
      t.amount || t.course.price,
      t.status,
      `"${t.paymentId || "-"}"`,
      `"${new Date(t.enrolledAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `transaksi-learnify-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 border-b border-gray-100 dark:border-gray-800">
        {/* Status Filter Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shrink-0">
          {(
            [
              { id: "all", label: "Semua" },
              { id: "paid", label: "Paid (Berhasil)" },
              { id: "pending", label: "Pending" },
              { id: "cancelled", label: "Cancelled" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa, email, payment ID..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50/70 dark:bg-gray-800/40 text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-3.5">Siswa</th>
              <th className="px-6 py-3.5">Kursus</th>
              <th className="px-6 py-3.5">Nominal</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Tanggal</th>
              <th className="px-6 py-3.5">Payment ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Tidak ada data transaksi yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const effectiveAmount = tx.amount || tx.course.price;
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {tx.user.fullName || "Siswa Learnify"}
                      </p>
                      <p className="text-[11px] text-gray-400">{tx.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/courses/${tx.course.slug}`}
                        target="_blank"
                        className="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 max-w-xs flex items-center gap-1.5"
                      >
                        <span>{tx.course.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                      {effectiveAmount === 0
                        ? "Gratis"
                        : `Rp ${effectiveAmount.toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
                      ) : tx.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <AlertCircle className="w-3 h-3" /> {tx.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {new Date(tx.enrolledAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(tx.enrolledAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                      {tx.paymentId || tx.id.slice(0, 8)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
