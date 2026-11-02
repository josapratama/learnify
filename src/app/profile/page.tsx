import Link from "next/link";
import {
  GraduationCap,
  Award,
  User as UserIcon,
  ChevronLeft,
  Calendar,
  Download,
  ExternalLink,
  Settings,
} from "lucide-react";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Profil & Pengaturan | Learnify",
  description: "Pengaturan akun, profil siswa, dan sertifikat kelulusan Learnify.",
};

export default async function ProfilePage() {
  const user = await requireValidUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      enrollments: {
        where: { status: "paid" },
        include: {
          course: {
            include: {
              sections: {
                include: {
                  lessons: {
                    include: {
                      progress: { where: { userId: user.id } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!dbUser) redirect("/login");

  const completedCourses = dbUser.enrollments
    .map((en) => {
      const allLessons = en.course.sections.flatMap((s) => s.lessons);
      const completedCount = allLessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].isCompleted,
      ).length;
      const progress =
        allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;

      return { ...en.course, progress, enrolledAt: en.enrolledAt };
    })
    .filter((c) => c.progress === 100);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      {/* Unified Navbar */}
      <Navbar user={dbUser} />

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-10 flex flex-col md:flex-row items-center gap-8 transition-colors duration-200">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-100 dark:shadow-none overflow-hidden border-4 border-white dark:border-gray-800">
            {dbUser.avatarUrl ? (
              <img
                src={dbUser.avatarUrl}
                alt={dbUser.fullName || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              dbUser.fullName?.charAt(0) || dbUser.email.charAt(0)
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {dbUser.fullName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-4">
              <UserIcon className="w-4 h-4" /> {dbUser.email} • Member sejak{" "}
              {new Date(dbUser.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
              })}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Total Kursus
                </p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {dbUser.enrollments.length}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-100 dark:border-green-900">
                <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">
                  Selesai
                </p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {completedCourses.length}
                </p>
              </div>
            </div>
            <Link
              href="/profile/settings"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-xl transition"
            >
              <Settings className="w-4 h-4" /> Edit Profil
            </Link>
          </div>
        </div>

        {/* Certificates Section */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" /> Sertifikat Kelulusan
        </h2>

        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-md dark:hover:shadow-none hover:translate-y-[-2px] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                    <Award className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 px-2 py-1 rounded-lg uppercase">
                    Verified
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Lulus pada{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    title="Lihat Kursus"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 p-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Belum ada sertifikat
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">
              Selesaikan salah satu kursus hingga 100% untuk mendapatkan
              sertifikat kelulusan resmi.
            </p>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 dark:shadow-none"
            >
              Lanjutkan Belajar
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
