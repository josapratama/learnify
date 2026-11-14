"use client";

import { useState, useMemo } from "react";
import { Star, MessageSquare, Send, Filter, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  userId?: string;
  user: { fullName: string | null };
}

interface ReviewSectionProps {
  courseId: string;
  reviews: Review[];
  isEnrolled: boolean;
  userReview?: Review | null;
}

export default function ReviewSection({
  courseId,
  reviews: initialReviews,
  isEnrolled,
  userReview: initialUserReview,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(initialUserReview?.rating || 5);
  const [comment, setComment] = useState(initialUserReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const router = useRouter();

  // Sudah pernah submit di sesi ini → tampilkan review terbaru dari state
  const userReview = submitted
    ? {
        id: "local",
        rating,
        comment,
        createdAt: new Date(),
        user: { fullName: "Anda" },
      }
    : (initialUserReview ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnrolled) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/courses/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, comment }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => {
          const exist = prev.findIndex((r) => r.userId === updated.userId);
          if (exist >= 0) {
            const next = [...prev];
            next[exist] = {
              ...next[exist],
              rating: updated.rating,
              comment: updated.comment,
            };
            return next;
          }
          return [{ ...updated, user: { fullName: "Anda" } }, ...prev];
        });
        setSubmitted(true);
        router.refresh();
      }
    } catch (error) {
      console.error("Gagal mengirim review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "0";

  // Rating breakdown statistics
  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star] || 0,
      percentage: totalReviews > 0 ? Math.round(((counts[star] || 0) / totalReviews) * 100) : 0,
    }));
  }, [reviews, totalReviews]);

  // Filtered reviews
  const displayedReviews = useMemo(() => {
    if (ratingFilter === null) return reviews;
    return reviews.filter((r) => Math.round(r.rating) === ratingFilter);
  }, [reviews, ratingFilter]);

  return (
    <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-16">
      {/* Header & Overview Stats */}
      <div className="mb-10 bg-gray-50/70 dark:bg-gray-900/40 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6">
          Ulasan & Penilaian Siswa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Rating Number */}
          <div className="md:col-span-4 text-center md:text-left md:border-r border-gray-200 dark:border-gray-800 md:pr-8">
            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">
              {averageRating}
              <span className="text-lg text-gray-400 font-normal"> / 5.0</span>
            </div>
            <div className="flex justify-center md:justify-start text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i <= Math.round(Number(averageRating))
                      ? "fill-current"
                      : "text-gray-200 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Berdasarkan {totalReviews} ulasan terverifikasi
            </p>
          </div>

          {/* Star Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {breakdown.map(({ star, count, percentage }) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                className={`w-full flex items-center gap-3 text-xs p-1.5 rounded-xl transition-all ${
                  ratingFilter === star
                    ? "bg-amber-50 dark:bg-amber-950/40 font-bold"
                    : "hover:bg-gray-100/70 dark:hover:bg-gray-800/50"
                }`}
              >
                <span className="w-12 text-left font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 shrink-0">
                  {star} <Star className="w-3.5 h-3.5 text-amber-400 fill-current inline" />
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-500 dark:text-gray-400 text-[11px] shrink-0">
                  {count}
                </span>
                <span className="w-10 text-right font-mono text-[10px] text-gray-400 shrink-0">
                  {percentage}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Bintang:
          </span>
          <button
            onClick={() => setRatingFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              ratingFilter === null
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Semua ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map((s) => {
            const count = breakdown.find((b) => b.star === s)?.count || 0;
            return (
              <button
                key={s}
                onClick={() => setRatingFilter(ratingFilter === s ? null : s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  ratingFilter === s
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-400"
                }`}
              >
                <span>{s}★</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          {isEnrolled ? (
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 lg:sticky lg:top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {userReview ? "Perbarui Ulasan Anda" : "Berikan Ulasan"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition ${star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                      >
                        <Star
                          className={`w-8 h-8 ${star <= rating ? "fill-current" : ""}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Komentar (Opsional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Apa pendapat Anda tentang kursus ini?"
                    className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[120px] placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-500/20"
                >
                  {isSubmitting ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {userReview ? "Update Review" : "Kirim Review"}
                    </>
                  )}
                </button>
                {submitted && (
                  <p className="text-green-600 dark:text-green-400 text-xs text-center font-medium pt-1">
                    ✅ Ulasan berhasil disimpan!
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-2xl border border-blue-100 dark:border-blue-900 text-center">
              <MessageSquare className="w-10 h-10 text-blue-300 dark:text-blue-700 mx-auto mb-3" />
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                Daftar kursus ini untuk memberikan ulasan dan membantu siswa lain.
              </p>
            </div>
          )}
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-sm shrink-0">
                    {review.user.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {review.user.fullName}
                      </h4>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                        {new Date(review.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-gray-200 dark:text-gray-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic pl-0 sm:pl-[52px]">
                  &ldquo;{review.comment || "Tidak ada komentar."}&rdquo;
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              {ratingFilter !== null
                ? `Tidak ada ulasan dengan rating ${ratingFilter} bintang.`
                : "Belum ada ulasan untuk kursus ini."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
