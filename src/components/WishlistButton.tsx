"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistButton({
  courseId,
  initialIsWishlisted,
  courseSlug,
}: {
  courseId: string;
  initialIsWishlisted: boolean;
  courseSlug?: string;
}) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const res = await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (res.status === 401) {
        router.push(`/login?from=/courses/${courseSlug || ""}`);
        return;
      }

      if (res.ok) {
        setIsWishlisted(!isWishlisted);
      }
    } catch {
      // silent fail — wishlist bukan fitur kritis
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      title={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
      className={`p-2.5 rounded-xl border transition ${
        isWishlisted
          ? "bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800"
          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
    </button>
  );
}
