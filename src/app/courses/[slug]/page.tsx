import { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  PlayCircle,
  FileText,
  Clock,
  BarChart,
  Star,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import EnrollButton from "@/components/EnrollButton";
import ReviewSection from "@/components/ReviewSection";
import WishlistButton from "@/components/WishlistButton";
import ThemeToggle from "@/components/ThemeToggle";
import ShareButton from "@/components/ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!course) {
    return { title: "Kursus Tidak Ditemukan" };
  }

  return {
    title: `${course.title} | EduTech`,
    description: course.description || "Belajar teknologi terbaru di EduTech",
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const user = await requireValidUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { fullName: true } },
      reviews: {
        include: { user: { select: { fullName: true } } },
        orderBy: { createdAt: "desc" },
        // userId diperlukan oleh ReviewSection untuk optimistic update
      },
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: { orderBy: { orderIndex: "asc" } },
        },
      },
    },
  });

  if (!course) {
    return (
      <div className="p-20 text-center text-gray-500 dark:text-gray-400">
        Kursus tidak ditemukan
      </div>
    );
  }

  const totalReviews = course.reviews.length;
  const avgRating =
    totalReviews > 0
      ? course.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
      : 0;

  const firstLessonSlug = course.sections[0]?.lessons[0]?.slug || "";

  let isEnrolled = false;
  let userReview = null;
  let isWishlisted = false;

  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId: course.id },
      },
    });
    isEnrolled = !!enrollment;

    userReview = course.reviews.find((r) => r.userId === user.id) || null;

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId: course.id },
      },
    });
    isWishlisted = !!wishlist;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" />
            <span>EduTech</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Course Header */}
      <div className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 text-white py-10 px-4 md:px-6 transition-colors duration-200">
        <div className="max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="md:col-span-2">
            <div className="flex gap-2 mb-3 text-xs text-blue-400 font-bold uppercase tracking-wider flex-wrap">
              <span>{course.category}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-snug">
              {course.title}
            </h1>
            <p className="text-gray-400 text-base mb-5 leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white font-bold">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-gray-400">({totalReviews} review)</span>
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Clock className="w-4 h-4" /> 12 Jam Materi
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <BarChart className="w-4 h-4" /> Level {course.level}
              </span>
              <span className="text-gray-400">
                Oleh:{" "}
                <Link
                  href={`/instructor/${course.instructorId}`}
                  className="text-white font-medium hover:text-blue-400 underline transition"
                >
                  {course.instructor.fullName}
                </Link>
              </span>
            </div>
          </div>

          {/* Purchase Card — floats to right on desktop, stacks on mobile */}
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5 md:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 w-full md:w-auto">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium">
              Preview Kursus
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {course.price === 0
                ? "Gratis"
                : `Rp ${course.price.toLocaleString("id-ID")}`}
            </div>
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <EnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  isEnrolled={isEnrolled}
                  firstLessonSlug={firstLessonSlug}
                />
              </div>
              {user && (
                <WishlistButton
                  courseId={course.id}
                  initialIsWishlisted={isWishlisted}
                  courseSlug={course.slug}
                />
              )}
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Akses selamanya ke semua materi
            </p>
            <div className="flex justify-center mt-3">
              <ShareButton
                title={course.title}
                url={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/courses/${course.slug}`}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-5xl mx-auto py-12 md:py-16 px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
          Kurikulum Kursus
        </h2>
        <div className="space-y-3 md:space-y-4">
          {course.sections.map((section) => (
            <div
              key={section.id}
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-900 px-4 md:px-6 py-4 font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 text-sm md:text-base">
                {section.title}
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="px-4 md:px-6 py-3.5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition bg-white dark:bg-gray-950 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {lesson.contentType === "video" ? (
                        <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                      )}
                      <span className="text-gray-700 dark:text-gray-300 text-sm truncate">
                        {lesson.title}
                      </span>
                    </div>
                    {lesson.isPreview && (
                      <Link
                        href={`/courses/${course.slug}/learn/${lesson.slug}`}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        Preview
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-5xl mx-auto pb-16 md:pb-24 px-4 md:px-6">
        <ReviewSection
          courseId={course.id}
          reviews={course.reviews}
          isEnrolled={isEnrolled}
          userReview={userReview}
        />
      </div>
    </div>
  );
}
