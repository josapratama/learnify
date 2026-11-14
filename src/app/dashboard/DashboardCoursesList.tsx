"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  ArrowRight,
  Sparkles,
  PlayCircle,
  FileText,
} from "lucide-react";

export interface EnrolledCourseItem {
  id: string;
  enrolledAt: Date | string;
  course: {
    id: string;
    title: string;
    slug: string;
    category?: string | null;
    instructor?: { fullName?: string | null } | null;
    sections: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        slug: string;
        contentType: string;
        progress: { isCompleted: boolean }[];
      }[];
    }[];
  };
}

interface DashboardCoursesListProps {
  enrollments: EnrolledCourseItem[];
}

export default function DashboardCoursesList({
  enrollments,
}: DashboardCoursesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in_progress" | "completed" | "not_started"
  >("all");

  const processedCourses = useMemo(() => {
    return enrollments.map((en) => {
      const lessons = en.course.sections.flatMap((s) => s.lessons);
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].isCompleted,
      ).length;
      const progressPercent =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      // Smart next lesson locator
      const nextUncompletedLesson = lessons.find(
        (l) => !l.progress.some((p) => p.isCompleted),
      );
      const targetLesson = nextUncompletedLesson || lessons[0];

      return {
        ...en,
        totalLessons,
        completedLessons,
        progressPercent,
        targetLessonSlug: targetLesson?.slug || "",
        targetLessonTitle: targetLesson?.title || "Mulai Pembelajaran",
        targetLessonType: targetLesson?.contentType || "video",
      };
    });
  }, [enrollments]);

  const filteredCourses = useMemo(() => {
    return processedCourses.filter((item) => {
      // Search matching
      const matchesSearch =
        item.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.course.category || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status matching
      if (statusFilter === "in_progress") {
        return item.progressPercent > 0 && item.progressPercent < 100;
      }
      if (statusFilter === "completed") {
        return item.progressPercent === 100;
      }
      if (statusFilter === "not_started") {
        return item.progressPercent === 0;
      }
      return true;
    });
  }, [processedCourses, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: processedCourses.length,
      in_progress: processedCourses.filter(
        (c) => c.progressPercent > 0 && c.progressPercent < 100,
      ).length,
      completed: processedCourses.filter((c) => c.progressPercent === 100).length,
      not_started: processedCourses.filter((c) => c.progressPercent === 0).length,
    };
  }, [processedCourses]);

  if (enrollments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1.5">
          Belum Ada Kursus Terdaftar
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          Jelajahi beragam katalog kursus pilihan kami dan mulai tingkatkan keahlian teknologi Anda hari ini.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition"
        >
          <span>Jelajahi Katalog Kursus</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              statusFilter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
            }`}
          >
            Semua ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter("in_progress")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              statusFilter === "in_progress"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
            }`}
          >
            Sedang Belajar ({counts.in_progress})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              statusFilter === "completed"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
            }`}
          >
            Selesai ({counts.completed})
          </button>
          {counts.not_started > 0 && (
            <button
              onClick={() => setStatusFilter("not_started")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                statusFilter === "not_started"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
              }`}
            >
              Belum Dimulai ({counts.not_started})
            </button>
          )}
        </div>

        {/* Live Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kursus saya..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredCourses.map((en) => {
            const isCompleted = en.progressPercent === 100;
            return (
              <div
                key={en.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Top Section */}
                <div className="p-6 pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {en.course.category || "Kursus"}
                    </span>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                      {en.completedLessons} / {en.totalLessons} Selesai
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {en.course.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Instruktur: {en.course.instructor?.fullName || "Learnify Mentor"}
                  </p>

                  {/* Target Lesson Preview Badge */}
                  {!isCompleted && en.targetLessonTitle && (
                    <div className="mb-5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {en.targetLessonType === "video" ? (
                          <PlayCircle className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Materi Berikutnya:
                        </span>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {en.targetLessonTitle}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar & CTA */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="mb-5">
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span
                        className={
                          isCompleted
                            ? "text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                            : "text-blue-600 dark:text-blue-400"
                        }
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isCompleted ? "Telah Selesai" : "Progres Belajar"}
                      </span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        {en.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out rounded-full ${
                          isCompleted
                            ? "bg-linear-to-r from-emerald-500 to-green-600"
                            : "bg-linear-to-r from-blue-500 to-indigo-600"
                        }`}
                        style={{ width: `${en.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      href={`/courses/${en.course.slug}/learn/${en.targetLessonSlug}`}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all ${
                        isCompleted
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:scale-[1.01]"
                      }`}
                    >
                      <span>
                        {isCompleted
                          ? "Pelajari Ulang Kursus"
                          : en.progressPercent > 0
                            ? "Lanjutkan Belajar"
                            : "Mulai Belajar"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    {isCompleted && (
                      <Link
                        href={`/certificate/${en.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black bg-linear-to-r from-amber-400 to-orange-500 text-white hover:opacity-95 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
                      >
                        <Award className="w-4 h-4" />
                        <span>Lihat Sertifikat Kelulusan</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
            Tidak ada kursus yang cocok dengan filter atau kata kunci &quot;{searchQuery}&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
