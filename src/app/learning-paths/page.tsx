import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = { title: "Learning Paths | EduTech" };

export default async function LearningPathsPage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" /> EduTech
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition"
            >
              Beranda
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            🗺️ Learning Paths
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Jalur belajar terstruktur dari nol hingga siap kerja. Ikuti urutan
            yang tepat, jangan bingung mulai dari mana.
          </p>
        </div>

        {paths.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Belum ada learning path tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/learning-paths/${path.slug}`}
                className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-3" style={{ backgroundColor: path.color }} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
                        {path.level}
                      </span>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {path.title}
                      </h2>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {path.courses.length} kursus
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      Terstruktur
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-4">
                    {path.courses.slice(0, 3).map((pc) => (
                      <span
                        key={pc.id}
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full"
                      >
                        {pc.course.title.length > 25
                          ? pc.course.title.slice(0, 25) + "..."
                          : pc.course.title}
                      </span>
                    ))}
                    {path.courses.length > 3 && (
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
                        +{path.courses.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
