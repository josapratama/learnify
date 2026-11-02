import Link from "next/link";
import {
  BookOpen,
  Code,
  Cpu,
  Globe,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import CourseFilters from "@/components/CourseFilters";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home({
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
    categoryCounts.map((c) => [c.category, c._count.id]),
  );

  const categories = [
    {
      name: "Programming",
      icon: <Code className="w-5 h-5" />,
      count: `${countMap["Programming"] || 0} Kursus`,
    },
    {
      name: "Internet of Things",
      icon: <Cpu className="w-5 h-5" />,
      count: `${countMap["Internet of Things"] || 0} Kursus`,
    },
    {
      name: "Web Development",
      icon: <Globe className="w-5 h-5" />,
      count: `${countMap["Web Development"] || 0} Kursus`,
    },
    {
      name: "Fundamental",
      icon: <BookOpen className="w-5 h-5" />,
      count: `${countMap["Fundamental"] || 0} Kursus`,
    },
  ];

  // Build filters dynamically to avoid empty objects in AND array
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
        : sort === "rating"
          ? { createdAt: "desc" }
          : { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      {/* Unified Global Navbar */}
      <Navbar user={dbUser} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-600 via-indigo-700 to-indigo-900 text-white py-16 sm:py-24 lg:py-32">
        {/* Glow & Geometric accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-black mb-6 text-blue-100 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Platform Pembelajaran Teknologi #1 Modern</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.15] tracking-tight">
            Kuasai Keahlian Digital, <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-blue-200 via-sky-200 to-indigo-100 bg-clip-text text-transparent">
              Bangun Portofolio Berkelas
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Akses kurikulum terstruktur dalam Web Development, Python, IoT, Cloud, dan AI dengan studi kasus nyata, code playground, dan sertifikat terverifikasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              href="#courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-7 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-900/30 hover:scale-105 transition-all text-sm"
            >
              <span>Jelajahi Kursus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learning-paths"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-7 py-3.5 rounded-2xl font-black backdrop-blur-md transition-all text-sm"
            >
              <span>Learning Paths</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter & Categories Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/80 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            <Link
              href={`/${level ? `?level=${level}` : ""}${price ? `${level ? "&" : "?"}price=${price}` : ""}${sort ? `${level || price ? "&" : "?"}sort=${sort}` : ""}`}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                !category
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:text-blue-600"
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/?category=${encodeURIComponent(cat.name)}${level ? `&level=${level}` : ""}${price ? `&price=${price}` : ""}${sort ? `&sort=${sort}` : ""}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                  category === cat.name
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:text-blue-600"
                }`}
              >
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          {/* Advanced Filter Bar */}
          <div className="w-full">
            <CourseFilters
              initialSort={sort}
              initialLevel={level}
              initialPrice={price}
            />
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section
        id="courses"
        className="flex-1 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Title & Count */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Katalog Pilihan</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {q
                  ? `Hasil pencarian untuk "${q}"`
                  : category
                    ? `Kursus ${category}`
                    : "Kursus Unggulan & Terpopuler"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm sm:text-base font-medium">
                {courses.length > 0
                  ? `Menampilkan ${courses.length} kursus berkualitas tinggi untuk upgrade skill Anda.`
                  : "Belum ada kursus yang sesuai dengan kombinasi filter yang dipilih."}
              </p>
            </div>
          </div>

          {/* Grid */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
                Tidak ada kursus ditemukan
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau bersihkan filter untuk melihat pilihan kursus lainnya.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20"
              >
                Reset Semua Filter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Global Modern Footer */}
      <Footer />
    </div>
  );
}
