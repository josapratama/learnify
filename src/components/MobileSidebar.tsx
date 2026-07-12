"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronLeft,
  PlayCircle,
  FileText,
  CheckCircle,
} from "lucide-react";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  contentType: string;
  isCompleted: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface MobileSidebarProps {
  sections: Section[];
  courseSlug: string;
  currentLessonSlug: string;
}

export default function MobileSidebar({
  sections,
  courseSlug,
  currentLessonSlug,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Buka daftar materi"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(300px,85vw)] flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Link
            href={`/courses/${courseSlug}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali ke Detail
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0">
                {section.title}
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {section.lessons.map((lesson) => {
                  const isActive = lesson.slug === currentLessonSlug;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseSlug}/learn/${lesson.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-start gap-3 px-4 py-3.5 transition ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-white dark:bg-gray-900"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : lesson.contentType === "video" ? (
                          <PlayCircle
                            className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}
                          />
                        ) : (
                          <FileText
                            className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm leading-snug ${
                          isActive
                            ? "text-blue-700 dark:text-blue-400 font-bold"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lesson.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
