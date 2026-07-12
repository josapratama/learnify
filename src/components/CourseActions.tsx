"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Edit2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseActions({
  courseId,
  courseSlug,
}: {
  courseId: string;
  courseSlug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus kursus ini? Semua data kurikulum akan hilang.",
      )
    ) {
      try {
        const res = await fetch("/api/instructor/courses", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: courseId }),
        });
        if (res.ok) router.refresh();
        else alert("Gagal menghapus kursus");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition ${
          isOpen
            ? "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-100 origin-top-right">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Opsi Kursus
            </p>
          </div>

          <Link
            href={`/courses/${courseSlug}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ExternalLink className="w-4 h-4" /> Lihat Halaman Kursus
          </Link>

          <Link
            href={`/instructor/courses/${courseId}/edit`}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Edit2 className="w-4 h-4" /> Edit Kurikulum
          </Link>

          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
          >
            <Trash2 className="w-4 h-4" /> Hapus Kursus
          </button>
        </div>
      )}
    </div>
  );
}
