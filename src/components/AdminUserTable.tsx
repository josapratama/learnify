"use client";

import { useState } from "react";
import { Shield, User } from "lucide-react";

interface AdminUser {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export default function AdminUserTable({ users }: { users: AdminUser[] }) {
  const [list, setList] = useState(users);

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

  return (
    <div className="overflow-x-auto">
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
          {list.map((u) => (
            <tr
              key={u.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
