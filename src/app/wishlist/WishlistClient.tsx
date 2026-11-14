"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, BookOpen, Star, Sparkles } from "lucide-react";
import CourseCard from "@/components/CourseCard";

interface WishlistClientProps {
  initialItems: {
    id: string;
    courseId: string;
    createdAt: Date | string;
    course: any;
  }[];
}

export default function WishlistClient({ initialItems }: WishlistClientProps) {
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (courseId: string) => {
    setRemovingId(courseId);
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.courseId !== courseId));
      }
    } catch (err) {
      console.error("Gagal menghapus dari wishlist", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800">
          <Heart className="w-8 h-8 opacity-70" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2">
          Wishlist Masih Kosong
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          Belum ada kursus yang Anda simpan. Tekan ikon hati pada kursus mana pun untuk menyimpannya ke daftar wishlist ini.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition hover:scale-105"
        >
          <span>Eksplorasi Katalog Kursus</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          Menampilkan <span className="font-bold text-gray-900 dark:text-white">{items.length}</span> kursus tersimpan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {items.map(({ id, courseId, course }) => (
          <div key={id} className="relative group">
            <CourseCard course={course} />
            <button
              onClick={() => handleRemove(courseId)}
              disabled={removingId === courseId}
              title="Hapus dari Wishlist"
              className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-white/90 dark:bg-gray-900/90 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-800 transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
