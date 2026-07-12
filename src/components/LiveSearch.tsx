"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnailUrl: string | null;
}

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/courses/search?q=${query}`);
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/?q=${query}`);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kursus..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white transition outline-none shadow-inner"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-110 overflow-hidden">
          <div className="py-2">
            {results.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/courses/${course.slug}`);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="w-12 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg relative shrink-0 overflow-hidden">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400">
                      IMG
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                    {course.title}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {course.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
