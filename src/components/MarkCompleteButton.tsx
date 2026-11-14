"use client";

import { useState } from "react";
import {
  CheckCircle,
  Loader2,
  ChevronRight,
  Circle,
  Award,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MarkCompleteButton({
  lessonId,
  nextLessonSlug,
  courseSlug,
  initialCompleted,
  enrollmentId,
  courseTitle,
}: {
  lessonId: string;
  nextLessonSlug?: string;
  courseSlug: string;
  initialCompleted: boolean;
  enrollmentId?: string;
  courseTitle?: string;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const router = useRouter();

  const isLastLesson = !nextLessonSlug;

  const handleToggle = async (markComplete: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, isCompleted: markComplete }),
      });

      if (res.ok) {
        setCompleted(markComplete);
        if (markComplete) {
          if (nextLessonSlug) {
            router.push(`/courses/${courseSlug}/learn/${nextLessonSlug}`);
          } else {
            // Ini materi terakhir! Buka selebrasi kelulusan
            setShowCelebration(true);
            router.refresh();
          }
        } else {
          router.refresh();
        }
      }
    } catch {
      // silent — progress bukan kritis
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        {completed ? (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleToggle(false)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition flex items-center gap-1.5 cursor-pointer"
              title="Tandai belum selesai"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
              <span>Tandai Belum Selesai</span>
            </button>

            <span className="flex items-center gap-1.5 px-4 py-2 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-xl text-sm font-bold border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4" />
              <span>Selesai</span>
            </span>

            {/* Jika ini materi terakhir & ada enrollmentId, tampilkan tombol sertifikat */}
            {isLastLesson && enrollmentId && (
              <Link
                href={`/certificate/${enrollmentId}`}
                className="inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-sm font-black shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Lihat Sertifikat</span>
              </Link>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleToggle(true)}
            disabled={loading}
            className="px-7 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLastLesson ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tuntaskan Kursus</span>
              </>
            ) : (
              <>
                <span>Selesai &amp; Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Celebration Modal Saat Menyelesaikan Materi Terakhir */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 text-center animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800 shadow-lg shadow-amber-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Kursus Tuntas</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2">
              Selamat! Kamu Berhasil Lulus! 🎓
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Anda telah menyelesaikan seluruh modul pada kursus{" "}
              <strong className="text-gray-900 dark:text-white">
                {courseTitle || "ini"}
              </strong>
              . Sertifikat resmi kelulusan telah diterbitkan dan siap diklaim!
            </p>

            <div className="flex flex-col gap-2.5">
              {enrollmentId && (
                <Link
                  href={`/certificate/${enrollmentId}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition"
                >
                  <Award className="w-4 h-4" />
                  <span>Klaim Sertifikat Resmi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                Tutup &amp; Tinjau Materi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
