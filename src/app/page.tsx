import Link from "next/link";
import {
  BookOpen,
  Code,
  Cpu,
  Globe,
  GraduationCap,
  Search,
  Star,
  User,
  Bell,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import Image from "next/image";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import CourseFilters from "@/components/CourseFilters";
import LiveSearch from "@/components/LiveSearch";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    sort?: string;
    level?: string;
    price?: string;
  };
}) {
  const { q, category, sort, level, price } = await searchParams;
  const user = await requireValidUser();

  const categories = [
    {
      name: "Programming",
      icon: <Code className="w-6 h-6" />,
      count: "12 Kursus",
    },
    {
      name: "Internet of Things",
      icon: <Cpu className="w-6 h-6" />,
      count: "5 Kursus",
    },
    {
      name: "Web Development",
      icon: <Globe className="w-6 h-6" />,
      count: "8 Kursus",
    },
    {
      name: "Fundamental",
      icon: <BookOpen className="w-6 h-6" />,
      count: "4 Kursus",
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
          ? { createdAt: "desc" } // Prisma doesn't support sorting by relation aggregate directly in findMany
          : { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-3 px-4 sticky top-0 z-[100] transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Mobile Actions */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl shrink-0"
            >
              <GraduationCap className="w-8 h-8" />
              <span className="tracking-tight">EduTech</span>
            </Link>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              {user && <NotificationBell />}
              {!user && (
                <Link href="/login" className="p-2 text-gray-500">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full md:max-w-md lg:max-w-lg">
            <LiveSearch />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/learning-paths"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
            >
              🗺️ Learning Paths
            </Link>
            <Link
              href="/playground"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
            >
              ⚡ Playground
            </Link>
            <ThemeToggle />
            {user ? (
              <>
                <NotificationBell />
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-2xl font-black hover:scale-105 transition shadow-lg shadow-gray-200 dark:shadow-none text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition text-sm px-2"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black hover:bg-blue-700 transition text-sm shadow-lg shadow-blue-100 dark:shadow-none"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-blue-600 dark:bg-blue-700 text-white overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16 md:py-28 lg:py-36 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
            Kuasai Teknologi, <br className="hidden sm:block" />
            <span className="text-blue-200">Bangun Masa Depan</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 opacity-90 max-w-2xl mx-auto font-medium">
            Platform belajar online terpercaya untuk menguasai programming, IoT,
            dan teknologi terbaru dengan kurikulum industri.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#courses"
              className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:shadow-xl transition-all text-sm"
            >
              Mulai Belajar Sekarang
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-blue-500 border border-white/20 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-400 transition-all text-sm"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-8">
            {/* Categories */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              <Link
                href={`/${level ? `?level=${level}` : ""}${price ? `${level ? "&" : "?"}price=${price}` : ""}${sort ? `${level || price ? "&" : "?"}sort=${sort}` : ""}`}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${!category ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 dark:shadow-none" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900"}`}
              >
                Semua Kategori
              </Link>
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  href={`/?category=${cat.name}${level ? `&level=${level}` : ""}${price ? `&price=${price}` : ""}${sort ? `&sort=${sort}` : ""}`}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${category === cat.name ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 dark:shadow-none" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="w-full">
              <CourseFilters
                initialSort={sort}
                initialLevel={level}
                initialPrice={price}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section
        id="courses"
        className="py-20 px-4 md:px-6 bg-white dark:bg-gray-950 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {q
                  ? `Hasil pencarian untuk "${q}"`
                  : category
                    ? `Kursus ${category}`
                    : "Kursus Unggulan"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                {courses.length > 0
                  ? `Menampilkan ${courses.length} kursus terbaik untuk Anda.`
                  : "Maaf, tidak ada kursus yang sesuai dengan kriteria Anda."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {courses.map((course) => {
              const totalReviews = course.reviews.length;
              const avgRating =
                totalReviews > 0
                  ? course.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                    totalReviews
                  : 0;

              return (
                <Link
                  href={`/courses/${course.slug}`}
                  key={course.id}
                  className="group bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:translate-y-[-8px] transition-all duration-500 flex flex-col h-full shadow-xl shadow-gray-200/50 dark:shadow-none"
                >
                  <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800 relative shrink-0 overflow-hidden">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                          <BookOpen className="w-8 h-8 opacity-20" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                          Thumbnail Kursus
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <span className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md text-blue-600 dark:text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/20">
                        {course.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-black">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition tracking-tight line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-black text-[10px]">
                          {course.instructor.fullName?.charAt(0) ?? "?"}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {course.instructor.fullName?.split(" ")[0] ??
                            "Instruktur"}
                        </span>
                      </div>
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight">
                        {course.price === 0
                          ? "Gratis"
                          : `Rp ${course.price.toLocaleString("id-ID")}`}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
