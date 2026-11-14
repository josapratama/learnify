import { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  PlayCircle,
  FileText,
  Clock,
  BarChart,
  Star,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import EnrollButton from "@/components/EnrollButton";
import ReviewSection from "@/components/ReviewSection";
import WishlistButton from "@/components/WishlistButton";
import ShareButton from "@/components/ShareButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCurriculumAccordion from "./CourseCurriculumAccordion";

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
    title: `${course.title} | Learnify`,
    description: course.description || "Belajar teknologi terbaru di Learnify",
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
          lessons: {
            orderBy: { orderIndex: "asc" },
            include: {
              progress: user ? { where: { userId: user.id } } : false,
            },
          },
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

  const allLessons = course.sections.flatMap((s) => s.lessons);
  const nextUncompleted = allLessons.find(
    (l) => !l.progress?.some((p: any) => p.isCompleted),
  );
  const smartLessonSlug = (nextUncompleted || allLessons[0])?.slug || "";
  const firstLessonSlug =
    smartLessonSlug || course.sections[0]?.lessons[0]?.slug || "";

  let isEnrolled = false;
  let userReview = null;
  let isWishlisted = false;
  let dbUser = null;

  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        streak: true,
        avatarUrl: true,
      },
    });

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
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <Navbar user={dbUser} />

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
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5 md:p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-200 w-full md:w-auto">
            <div className="aspect-video bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl mb-5 flex flex-col items-center justify-center text-white p-4 text-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-sm">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-100">
                {course.category}
              </span>
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
                url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://learnify.josapratama.com"}/courses/${course.slug}`}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Highlights & Features */}
      <div className="max-w-5xl mx-auto pt-10 px-4 md:px-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-gray-50/80 dark:bg-gray-900/60 rounded-3xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white">Sertifikat Resmi</p>
              <p className="text-[11px] text-gray-400">Terverifikasi Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white">Akses Selamanya</p>
              <p className="text-[11px] text-gray-400">Materi Terupdate</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white">Code Playground</p>
              <p className="text-[11px] text-gray-400">Praktik di Browser</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white">AI Tutor 24/7</p>
              <p className="text-[11px] text-gray-400">Bantuan Belajar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Accordion */}
      <div className="max-w-5xl mx-auto py-10 md:py-14 px-4 md:px-6 w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Kurikulum Kursus
        </h2>

        <CourseCurriculumAccordion
          sections={course.sections as any}
          courseSlug={course.slug}
        />
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

      <Footer />
    </div>
  );
}
