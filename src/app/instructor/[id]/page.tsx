import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Globe,
  Mail,
  BookOpen,
  Users,
  Star,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default async function InstructorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const instructor = await prisma.user.findUnique({
    where: { id },
    include: {
      courses: {
        where: { isPublished: true },
        include: {
          reviews: { select: { rating: true } },
          enrollments: { select: { id: true } },
        },
      },
    },
  });

  if (!instructor || instructor.role !== "instructor") {
    notFound();
  }

  const totalStudents = instructor.courses.reduce(
    (acc, c) => acc + c.enrollments.length,
    0,
  );
  const allRatings = instructor.courses.flatMap((c) =>
    c.reviews.map((r) => r.rating),
  );
  const avgRating =
    allRatings.length > 0
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : 5;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" />
            <span>EduTech</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center transition-colors duration-200">
              <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-6 flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-md overflow-hidden">
                {instructor.avatarUrl ? (
                  <Image
                    src={instructor.avatarUrl}
                    alt={instructor.fullName || ""}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  instructor.fullName?.charAt(0)
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {instructor.fullName}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-6 uppercase text-xs tracking-widest">
                Instruktur Profesional
              </p>

              <div className="flex justify-center gap-4 mb-8">
                {instructor.website && (
                  <a
                    href={instructor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                <a
                  href={`mailto:${instructor.email}`}
                  className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStudents}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    Siswa
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {instructor.courses.length}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    Kursus
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Tentang Saya
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {instructor.bio ||
                  "Instruktur ini belum menambahkan bio profil."}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />{" "}
                Kursus oleh {instructor.fullName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {instructor.courses.map((course) => {
                  const courseAvg =
                    course.reviews.length > 0
                      ? course.reviews.reduce((a, b) => a + b.rating, 0) /
                        course.reviews.length
                      : 5;

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md dark:hover:shadow-none hover:translate-y-[-4px] transition-all duration-300 group"
                    >
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                        {course.thumbnailUrl ? (
                          <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 text-sm">
                            Thumbnail
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg uppercase">
                            {course.level}
                          </span>
                          <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{courseAvg.toFixed(1)}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                          <Users className="w-3 h-3" />{" "}
                          {course.enrollments.length} Siswa
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
