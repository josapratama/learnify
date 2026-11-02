import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Award, Globe, Share2, Copy, Check } from "lucide-react";
import PrintCertificateButton from "@/components/PrintCertificateButton";

export default async function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      user: true,
      course: {
        include: {
          instructor: true,
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
  });

  if (!enrollment || enrollment.userId !== user.id) {
    redirect("/dashboard");
  }

  // Double check progress
  const lessons = enrollment.course.sections.flatMap((s) => s.lessons);
  const completedCount = lessons.filter(
    (l) => l.progress.length > 0 && l.progress[0].isCompleted,
  ).length;
  const isFullyCompleted =
    lessons.length > 0 && completedCount === lessons.length;

  if (!isFullyCompleted) {
    redirect("/dashboard");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://learnify.josapratama.com";
  const certificateUrl = `${baseUrl}/certificate/${enrollment.id}`;
  const shareText = `Saya baru saja menyelesaikan kursus "${enrollment.course.title}" di Learnify! 🎓`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 flex flex-col items-center transition-colors duration-200">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 p-12 rounded-2xl shadow-2xl border-8 border-double border-gray-100 dark:border-gray-800 relative overflow-hidden mb-10 transition-colors duration-200">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-5 -mr-16 -mt-16 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 opacity-5 -ml-16 -mb-16 rounded-full"></div>

        <div className="text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
              <GraduationCap className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-widest">
            Sertifikat Kelulusan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 italic mb-12">
            Diberikan dengan bangga kepada:
          </p>

          <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-8 border-b-2 border-gray-100 dark:border-gray-800 pb-4 inline-block px-12">
            {enrollment.user.fullName}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Telah berhasil menyelesaikan seluruh kurikulum dan persyaratan
            kursus online
            <span className="block font-bold text-gray-900 dark:text-white mt-2 text-2xl">
              &quot;{enrollment.course.title}&quot;
            </span>
          </p>

          <div className="grid grid-cols-2 gap-12 mt-16 max-w-2xl mx-auto">
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-bold text-gray-900 dark:text-white">
                {enrollment.course.instructor.fullName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                Instruktur Kursus
              </p>
            </div>
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-bold text-gray-900 dark:text-white">
                {new Date(enrollment.enrolledAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                Tanggal Terbit
              </p>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2 text-blue-600 opacity-30">
              <Award className="w-12 h-12" />
              <div className="text-left leading-none">
                <p className="font-bold text-sm">Learnify Verified</p>
                <p className="text-[10px]">
                  ID: {enrollment.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-6 justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="flex gap-3">
          <PrintCertificateButton />
          <Link
            href="/dashboard"
            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Bagikan Ke:
          </span>
          <div className="flex gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`}
              target="_blank"
              className="p-3 bg-[#0077b5] text-white rounded-xl hover:opacity-90 transition"
              title="Bagikan ke LinkedIn"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(certificateUrl)}`}
              target="_blank"
              className="p-3 bg-[#1da1f2] text-white rounded-xl hover:opacity-90 transition"
              title="Bagikan ke Twitter"
            >
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
