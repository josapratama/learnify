"use client";

import { useState } from "react";
import { CheckCircle, Loader2, ChevronRight, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarkCompleteButton({
  lessonId,
  nextLessonSlug,
  courseSlug,
  initialCompleted,
}: {
  lessonId: string;
  nextLessonSlug?: string;
  courseSlug: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        if (markComplete && nextLessonSlug) {
          router.push(`/courses/${courseSlug}/learn/${nextLessonSlug}`);
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

  if (completed) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleToggle(false)}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition flex items-center gap-1"
          title="Tandai belum selesai"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Circle className="w-3.5 h-3.5" />
          )}
          Tandai Belum Selesai
        </button>
        <span className="flex items-center gap-1.5 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-bold">
          <CheckCircle className="w-4 h-4" /> Selesai
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => handleToggle(true)}
      disabled={loading}
      className="px-8 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          Selesai &amp; Lanjut <ChevronRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
