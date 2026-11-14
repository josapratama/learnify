"use client";

import { useState, useMemo } from "react";
import { Shield, User, Search, Download, Filter, X } from "lucide-react";

interface AdminUser {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  createdAt: Date | string;
}

export default function AdminUserTable({ users }: { users: AdminUser[] }) {
  const [list, setList] = useState(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const changeRole = async (userId: string, newRole: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    if (res.ok) {
      setList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return list.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      if (!matchesRole) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const matchesName = (u.fullName || "").toLowerCase().includes(q);
      const matchesEmail = u.email.toLowerCase().includes(q);
      return matchesName || matchesEmail;
    });
  }, [list, roleFilter, searchQuery]);

  const exportCSV = () => {
    const headers = ["ID", "Nama", "Email", "Role", "Tanggal Bergabung"];
    const rows = filteredUsers.map((u) => [
      `"${u.id}"`,
      `"${u.fullName || ""}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${new Date(u.createdAt).toISOString()}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `learnify-users-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="p-4 bg-gray-50/70 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna berdasarkan nama atau email..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 py-2 px-3 outline-none cursor-pointer"
          >
            <option value="all">Semua Role ({list.length})</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shrink-0"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {(searchQuery || roleFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
              }}
              className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-600 transition"
              title="Reset"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {["Pengguna", "Email", "Role", "Bergabung"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition bg-white dark:bg-gray-900"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                        {u.fullName?.charAt(0) || u.email.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {u.fullName || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer ${
                        u.role === "admin"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : u.role === "instructor"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs">
                  Tidak ada pengguna yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
