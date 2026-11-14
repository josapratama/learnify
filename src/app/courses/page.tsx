import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Code,
  Cpu,
  Globe,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  X,
  Compass,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import CourseFilters from "@/components/CourseFilters";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katalog Kursus | Learnify",
  description:
    "Jelajahi seluruh katalog kursus pemrograman, Web, IoT, dan Fundamental di Learnify.",
};

export default async function CoursesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    level?: string;
    price?: string;
  }>;
}) {
  const { q, category, sort, level, price } = await searchParams;
  const user = await requireValidUser();

  const [categoryCounts, dbUser] = await Promise.all([
    prisma.course.groupBy({
      by: ["category"],
      where: { isPublished: true },
      _count: { id: true },
    }),
    user
      ? prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            streak: true,
            avatarUrl: true,
          },
        })
      : null,
  ]);

  const countMap = Object.fromEntries(
    categoryCounts.map((c) => [c.category || "Lainnya", c._count.id])
  );

  const categories = [
    { name: "Programming", icon: Code, count: countMap["Programming"] || 0 },
    { name: "Internet of Things", icon: Cpu, count: countMap["Internet of Things"] || 0 },
    { name: "Web Development", icon: Globe, count: countMap["Web Development"] || 0 },
    { name: "Fundamental", icon: BookOpen, count: countMap["Fundamental"] || 0 },
  ];

  // Build filters dynamically
  const where: any = { isPublished: true };
  const andFilters = [];

  if (q) {
    andFilters.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (category) andFilters.push({ category: { equals: category } });
  if (level) andFilters.push({ level: { equals: level } });
  if (price === "free") andFilters.push({ price: { equals: 0 } });
  if (price === "paid") andFilters.push({ price: { gt: 0 } });

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      instructor: { select: { fullName: true } },
      reviews: { select: { rating: true } },
      enrollments: { select: { id: true } },
    },
    orderBy:
      sort === "popular"
        ? { enrollments: { _count: "desc" } }
        : { createdAt: "desc" },
  });

  const hasActiveFilters = Boolean(q || category || level || price || sort);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      {/* Header Banner */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Katalog Pembelajaran</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Eksplorasi Semua Kursus
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                Temukan materi terstruktur dari fundamental hingga tingkat lanjut dengan panduan instruktur ahli dan praktik koding interaktif.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/learning-paths"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-black transition"
              >
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Lihat Learning Paths</span>
              </Link>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-8">
            <Link
              href="/courses"
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                !category
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Semua Kursus ({categoryCounts.reduce((acc, c) => acc + c._count.id, 0)})
            </Link>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <Link
                  key={cat.name}
                  href={`/courses?category=${encodeURIComponent(cat.name)}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">({cat.count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid & Filters */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>Daftar Kursus</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {courses.length} Tersedia
              </span>
            </h2>
            {q && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Menampilkan hasil untuk kata kunci: <strong className="text-gray-900 dark:text-white">&quot;{q}&quot;</strong>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <CourseFilters
              initialSort={sort}
              initialLevel={level}
              initialPrice={price}
            />
            {hasActiveFilters && (
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-200 dark:border-red-800"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </Link>
            )}
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
              Tidak Ada Kursus Ditemukan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Tidak ada kursus yang cocok dengan filter atau kata kunci yang dipilih. Coba reset filter untuk melihat semua kursus.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition"
            >
              <span>Tampilkan Semua Kursus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
