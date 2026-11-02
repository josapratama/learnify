"use client";

import { useState } from "react";
import { Loader2, ShoppingCart, PlayCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  firstLessonSlug,
}: {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  firstLessonSlug: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Jika kursus gratis / demo
        if (data.demo) {
          router.push(`/courses/${courseSlug}/learn/${firstLessonSlug}`);
          return;
        }

        // Jika mendapatkan checkoutUrl dari PayGateway Hub
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }

        // Fallback: Legacy Midtrans Snap
        if (data.snapToken) {
          // @ts-ignore
          window.snap?.pay(data.snapToken, {
            onSuccess: () => {
              router.push(`/courses/${courseSlug}/learn/${firstLessonSlug}`);
            },
            onPending: () => {
              setError("Pembayaran sedang diproses. Cek email Anda.");
              router.refresh();
            },
            onError: () => {
              setError("Pembayaran gagal. Silakan coba lagi.");
              setLoading(false);
            },
            onClose: () => {
              setLoading(false);
            },
          });
          return;
        }

        setError("Gagal memulai pembayaran. Coba lagi.");
      } else {
        if (res.status === 401) {
          router.push(`/login?from=/courses/${courseSlug}`);
        } else {
          setError(data.message || "Terjadi kesalahan. Coba lagi.");
        }
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <button
        onClick={() =>
          router.push(`/courses/${courseSlug}/learn/${firstLessonSlug}`)
        }
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition mb-3 flex items-center justify-center gap-2"
      >
        <PlayCircle className="w-5 h-5" /> Lanjut Belajar
      </button>
    );
  }

  return (
    <div>
      {error && (
        <div className="flex items-start gap-2 mb-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-3 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-blue-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Mempersiapkan Pembayaran...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" /> Beli Sekarang
          </>
        )}
      </button>
    </div>
  );
}
