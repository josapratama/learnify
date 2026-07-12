"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CourseFiltersProps {
  initialSort?: string;
  initialLevel?: string;
  initialPrice?: string;
}

export default function CourseFilters({
  initialSort,
  initialLevel,
  initialPrice,
}: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1">
          Urutkan
        </span>
        <select
          value={initialSort || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 py-2.5 px-4 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <option value="newest">Terbaru</option>
          <option value="popular">Terpopuler</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1">
          Level
        </span>
        <select
          value={initialLevel || ""}
          onChange={(e) => updateFilter("level", e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 py-2.5 px-4 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <option value="">Semua Level</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1">
          Harga
        </span>
        <select
          value={initialPrice || ""}
          onChange={(e) => updateFilter("price", e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 py-2.5 px-4 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <option value="">Semua Harga</option>
          <option value="free">Gratis</option>
          <option value="paid">Berbayar</option>
        </select>
      </div>
    </div>
  );
}
