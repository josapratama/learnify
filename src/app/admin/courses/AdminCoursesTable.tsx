"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Filter,
  X,
  BookOpen,
  ExternalLink,
  Edit,
  Globe,
  FileEdit,
} from "lucide-react";

export interface AdminCourseItem {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  level: string;
  price: number;
  isPublished: boolean;
  createdAt: Date | string;
  instructor: {
    fullName: string | null;
    email: string;
  };
  _count: {
    enrollments: number;
    sections: number;
    reviews: number;
  };
}

export default function AdminCoursesTable({
  courses,
}: {
  courses: AdminCourseItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (statusFilter === "published" && !c.isPublished) return false;
      if (statusFilter === "draft" && c.isPublished) return false;
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const titleMatch = c.title.toLowerCase().includes(q);
      const instructorMatch =
        (c.instructor.fullName || "").toLowerCase().includes(q) ||
        c.instructor.email.toLowerCase().includes(q);
      const catMatch = (c.category || "").toLowerCase().includes(q);

      return titleMatch || instructorMatch || catMatch;
    });
  }, [courses, statusFilter, categoryFilter, searchQuery]);

  const exportCSV = () => {
    const headers = [
      "ID",
      "Judul",
      "Slug",
      "Kategori",
      "Level",
      "Harga",
      "Status",
      "Instruktur",
      "Email Instruktur",
      "Total Siswa",
      "Total Modul",
    ];

    const rows = filteredCourses.map((c) => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.slug}"`,
      `"${c.category || "-"}"`,
      `"${c.level}"`,
      c.price,
      c.isPublished ? "Published" : "Draft",
      `"${(c.instructor.fullName || "").replace(/"/g, '""')}"`,
      `"${c.instructor.email}"`,
      c._count.enrollments,
      c._count.sections,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `admin-courses-learnify-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions Bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Pills */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {(
              [
                { id: "all", label: "Semua" },
                { id: "published", label: "Published" },
                { id: "draft", label: "Draft" },
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

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border-none text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kursus/instruktur..."
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
              <th className="px-6 py-3.5">Kursus</th>
              <th className="px-6 py-3.5">Kategori & Level</th>
              <th className="px-6 py-3.5">Instruktur</th>
              <th className="px-6 py-3.5">Harga</th>
              <th className="px-6 py-3.5">Siswa</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Tidak ada kursus yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1 max-w-xs">
                      {course.title}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      /{course.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">
                      {course.category || "-"}
                    </span>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {course.instructor.fullName || "Mentor Learnify"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[140px]">
                      {course.instructor.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {course.price === 0
                      ? "Gratis"
                      : `Rp ${course.price.toLocaleString("id-ID")}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-gray-900 dark:text-white">
                      {course._count.enrollments}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-1">siswa</span>
                  </td>
                  <td className="px-6 py-4">
                    {course.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <Globe className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <FileEdit className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
                        title="Buka Halaman Kursus"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/instructor/courses/${course.id}/edit`}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition"
                        title="Edit Kurikulum"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
