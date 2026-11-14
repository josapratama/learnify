"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Filter,
  X,
  Download,
  ChevronDown,
  FileCode,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export interface NoteItem {
  id: string;
  content: string;
  updatedAt: Date | string;
  lesson: {
    title: string;
    slug: string;
    section: {
      course: {
        title: string;
        slug: string;
      };
    };
  };
}

interface NotesClientProps {
  initialNotes: NoteItem[];
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>("all");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Distinct courses
  const coursesList = useMemo(() => {
    const map = new Map<string, string>();
    initialNotes.forEach((n) => {
      const c = n.lesson.section.course;
      if (!map.has(c.slug)) {
        map.set(c.slug, c.title);
      }
    });
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }));
  }, [initialNotes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return initialNotes.filter((note) => {
      const matchesCourse =
        selectedCourseSlug === "all" ||
        note.lesson.section.course.slug === selectedCourseSlug;
      if (!matchesCourse) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const matchesContent = note.content.toLowerCase().includes(q);
      const matchesLesson = note.lesson.title.toLowerCase().includes(q);
      const matchesCourseTitle = note.lesson.section.course.title
        .toLowerCase()
        .includes(q);

      return matchesContent || matchesLesson || matchesCourseTitle;
    });
  }, [initialNotes, selectedCourseSlug, searchQuery]);

  // Group filtered notes by course
  const groupedByCourse = useMemo(() => {
    return filteredNotes.reduce(
      (acc, note) => {
        const courseTitle = note.lesson.section.course.title;
        const courseSlug = note.lesson.section.course.slug;
        if (!acc[courseSlug]) {
          acc[courseSlug] = { courseTitle, courseSlug, notes: [] };
        }
        acc[courseSlug].notes.push(note);
        return acc;
      },
      {} as Record<
        string,
        { courseTitle: string; courseSlug: string; notes: NoteItem[] }
      >,
    );
  }, [filteredNotes]);

  const exportNotes = (format: "md" | "txt") => {
    if (filteredNotes.length === 0) return;
    setIsExportOpen(false);

    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let content = "";

    if (format === "md") {
      content += `# Catatan Belajar — Learnify LMS\n`;
      content += `*Tanggal Ekspor: ${nowStr}*\n`;
      content += `*Total Catatan: ${filteredNotes.length}*\n\n`;
      content += `---\n\n`;

      Object.values(groupedByCourse).forEach(({ courseTitle, notes }) => {
        content += `## 📚 Kursus: ${courseTitle}\n\n`;
        notes.forEach((note, idx) => {
          const dateStr = new Date(note.updatedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          content += `### ${idx + 1}. Materi: ${note.lesson.title}\n`;
          content += `*Pembaruan: ${dateStr}*\n\n`;
          content += `${note.content}\n\n`;
          content += `---\n\n`;
        });
      });
    } else {
      content += `CATATAN BELAJAR — LEARNIFY LMS\n`;
      content += `Tanggal Ekspor: ${nowStr}\n`;
      content += `Total Catatan: ${filteredNotes.length}\n`;
      content += `========================================================\n\n`;

      Object.values(groupedByCourse).forEach(({ courseTitle, notes }) => {
        content += `[KURSUS] ${courseTitle}\n`;
        content += `--------------------------------------------------------\n\n`;
        notes.forEach((note, idx) => {
          const dateStr = new Date(note.updatedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          content += `(${idx + 1}) MATERI: ${note.lesson.title} [${dateStr}]\n`;
          content += `${note.content}\n\n`;
        });
        content += `\n`;
      });
    }

    const mime =
      format === "md"
        ? "text/markdown;charset=utf-8"
        : "text/plain;charset=utf-8";
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catatan-belajar-learnify-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (initialNotes.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1.5">
          Belum Ada Catatan Tersimpan
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
          Saat mempelajari materi kursus, Anda dapat menulis catatan penting langsung di samping video atau teks artikel.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 transition"
        >
          <span>Buka Kursus Saya</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Course Filter Controls */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci dalam catatan atau materi..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
          <select
            value={selectedCourseSlug}
            onChange={(e) => setSelectedCourseSlug(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 py-2.5 px-3.5 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <option value="all">Semua Kursus ({initialNotes.length})</option>
            {coursesList.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>

          {(searchQuery || selectedCourseSlug !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCourseSlug("all");
              }}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition cursor-pointer"
              title="Reset Filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header with Export Button */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Ditemukan{" "}
          <span className="text-gray-900 dark:text-white font-black">
            {filteredNotes.length}
          </span>{" "}
          catatan
        </p>

        {filteredNotes.length > 0 && (
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Ekspor Catatan</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => exportNotes("md")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition cursor-pointer text-left"
                >
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <span>Markdown (.md)</span>
                </button>
                <button
                  onClick={() => exportNotes("txt")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition cursor-pointer text-left"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Plain Text (.txt)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes Display */}
      {filteredNotes.length > 0 ? (
        <div className="space-y-8">
          {Object.values(groupedByCourse).map(
            ({ courseTitle, courseSlug, notes: courseNotes }) => (
              <div key={courseSlug} className="space-y-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                      {courseTitle}
                    </h2>
                    <span className="text-xs font-medium text-gray-400">
                      ({courseNotes.length})
                    </span>
                  </div>
                  <Link
                    href={`/courses/${courseSlug}`}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Buka Kursus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {courseNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 sm:p-6 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-gray-50 dark:border-gray-800">
                        <Link
                          href={`/courses/${courseSlug}/learn/${note.lesson.slug}`}
                          className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{note.lesson.title}</span>
                        </Link>
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(note.updatedAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-8">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
            Tidak ada catatan yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCourseSlug("all");
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Hapus Filter Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
