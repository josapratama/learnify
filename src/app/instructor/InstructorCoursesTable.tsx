"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Settings,
  Star,
  Download,
  Filter,
  X,
  BookOpen,
  Users,
} from "lucide-react";
import CourseActions from "@/components/CourseActions";

export interface InstructorCourseItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  isPublished: boolean;
  category?: string | null;
  enrollments: {
    id: string;
    enrolledAt: Date | string;
    amount?: number;
    user: { fullName: string | null; email: string };
  }[];
  reviews: { rating: number }[];
}

interface InstructorCoursesTableProps {
  courses: InstructorCourseItem[];
}

export default function InstructorCoursesTable({
  courses,
}: InstructorCoursesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all",
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Status filter
      if (statusFilter === "published" && !c.isPublished) return false;
      if (statusFilter === "draft" && c.isPublished) return false;

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        c.title.toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q)
      );
    });
  }, [courses, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: courses.length,
      published: courses.filter((c) => c.isPublished).length,
      draft: courses.filter((c) => !c.isPublished).length,
    };
  }, [courses]);

  const exportStudentsCSV = () => {
    const headers = [
      "Nama Siswa",
      "Email Siswa",
      "Judul Kursus",
      "Tanggal Pendaftaran",
    ];
    const rows: string[][] = [];

    courses.forEach((c) => {
      c.enrollments.forEach((e) => {
        rows.push([
          `"${e.user.fullName || "Siswa"}"`,
          `"${e.user.email}"`,
          `"${c.title}"`,
          `"${new Date(e.enrolledAt).toISOString().slice(0, 10)}"`,
        ]);
      });
    });

    if (rows.length === 0) {
      alert("Belum ada data siswa terdaftar untuk diekspor.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `learnify-students-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Status Filter Toolbar */}
      <div className="p-4 sm:p-5 bg-gray-50/70 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kursus berdasarkan judul atau kategori..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Semua ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === "published"
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Published ({counts.published})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === "draft"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Draft ({counts.draft})
            </button>
          </div>

          <button
            onClick={exportStudentsCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition shadow-xs shrink-0"
            title="Download CSV Data Siswa Terdaftar"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Siswa CSV</span>
          </button>

          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
              title="Reset Filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <table className="w-full text-left min-w-[620px]">
          <thead className="bg-gray-50/70 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.15em]">
            <tr>
              <th className="px-6 py-4">Kursus</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Siswa</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4 text-center">Rating</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        {course.title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-black text-gray-900 dark:text-white text-sm line-clamp-1 tracking-tight">
                          {course.title}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {course.category || "Umum"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-widest whitespace-nowrap ${
                        course.isPublished
                          ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800"
                          : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300 font-black">
                    {course.enrollments.length}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-black tracking-tight whitespace-nowrap">
                    Rp {course.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/instructor/courses/${course.id}/edit`}
                        className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl text-gray-400 dark:text-gray-500 transition-all shadow-xs"
                        title="Edit Kurikulum"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                      <CourseActions
                        courseId={course.id}
                        courseSlug={course.slug}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-400 dark:text-gray-500 text-xs font-medium"
                >
                  Tidak ada kursus yang cocok dengan filter atau kata kunci &quot;{searchQuery}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
