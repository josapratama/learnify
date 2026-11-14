"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  PlayCircle,
  FileText,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export interface CourseSectionData {
  id: string;
  title: string;
  orderIndex: number;
  lessons: {
    id: string;
    title: string;
    slug: string;
    contentType: string;
    isPreview: boolean;
  }[];
}

interface CourseCurriculumAccordionProps {
  sections: CourseSectionData[];
  courseSlug: string;
}

export default function CourseCurriculumAccordion({
  sections,
  courseSlug,
}: CourseCurriculumAccordionProps) {
  // Buka 2 section pertama secara default
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(sections.slice(0, 2).map((s) => s.id)),
  );

  const toggleSection = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="space-y-4">
      {/* Top Header with Total & Toggle buttons */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
          Total <span className="text-gray-900 dark:text-white font-black">{sections.length}</span> Modul •{" "}
          <span className="text-gray-900 dark:text-white font-black">{totalLessons}</span> Pelajaran
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Buka Semua
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button
            onClick={collapseAll}
            className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:underline"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Accordion Sections List */}
      <div className="space-y-3.5">
        {sections.map((section, sIdx) => {
          const isOpen = openIds.has(section.id);

          return (
            <div
              key={section.id}
              className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all shadow-2xs bg-white dark:bg-gray-900"
            >
              {/* Header Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left bg-gray-50/80 dark:bg-gray-900 px-5 sm:px-6 py-4 font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between gap-4 hover:bg-gray-100/60 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-black truncate text-gray-900 dark:text-white">
                    {section.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {section.lessons.length} Materi
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                      isOpen
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rotate-180"
                        : "text-gray-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Lessons List Body */}
              {isOpen && (
                <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800 animate-in fade-in duration-150">
                  {section.lessons.map((lesson) => {
                    const isVideo = lesson.contentType === "video";
                    const isQuiz = lesson.contentType === "quiz";

                    return (
                      <div
                        key={lesson.id}
                        className="px-5 sm:px-6 py-3.5 flex justify-between items-center hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition bg-white dark:bg-gray-950 gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isVideo ? (
                            <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          ) : isQuiz ? (
                            <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm truncate font-medium">
                            {lesson.title}
                          </span>
                        </div>

                        {lesson.isPreview && (
                          <Link
                            href={`/courses/${courseSlug}/learn/${lesson.slug}`}
                            className="text-[11px] font-black text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Preview Gratis</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
