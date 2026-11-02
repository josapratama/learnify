import Link from "next/link";
import { ArrowRight, BookOpen, Star, Compass } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Learning Paths | Learnify",
  description: "Jalur belajar terstruktur dari nol hingga siap kerja di industri teknologi.",
};
export const dynamic = "force-dynamic";

export default async function LearningPathsPage() {
  const user = await requireValidUser();

  const dbUser = user
    ? await prisma.user.findUnique({
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
    : null;

  const paths = await prisma.learningPath.findMany({
    where: { isPublished: true },
    orderBy: { orderIndex: "asc" },
    include: {
      courses: {
        orderBy: { orderIndex: "asc" },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              level: true,
              price: true,
              thumbnailUrl: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      {/* Hero Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-800">
            <Compass className="w-4 h-4" />
            <span>Kurikulum Terpadu</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Learning Paths Terstruktur
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Jalur belajar komprehensif dari dasar hingga mahir. Ikuti urutan modul yang sudah dirancang oleh praktisi tanpa perlu bingung menentukan langkah selanjutnya.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {paths.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Belum ada learning path tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/learning-paths/${path.slug}`}
                className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="h-3.5" style={{ backgroundColor: path.color || "#3b82f6" }} />
                  <div className="p-7 sm:p-9">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1.5 block">
                          {path.level}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                          {path.title}
                        </h2>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                      {path.description}
                    </p>

                    <div className="flex items-center gap-5 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        {path.courses.length} Kursus Terintegrasi
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        Kurikulum Industri
                      </span>
                    </div>

                    {/* Courses Pills */}
                    <div className="flex gap-2 flex-wrap mt-5 pt-5 border-t border-gray-50 dark:border-gray-800">
                      {path.courses.slice(0, 3).map((pc) => (
                        <span
                          key={pc.id}
                          className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-xl truncate max-w-[200px]"
                        >
                          {pc.course.title}
                        </span>
                      ))}
                      {path.courses.length > 3 && (
                        <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/50">
                          +{path.courses.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
