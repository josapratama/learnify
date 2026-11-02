import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { GraduationCap, Award, Globe, Share2, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import PrintCertificateButton from "@/components/PrintCertificateButton";
import QRCode from "qrcode";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const currentUser = await getCurrentUser();

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
                  progress: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Calculate completed count for the enrolled student
  const lessons = enrollment?.course?.sections.flatMap((s) => s.lessons) || [];
  const completedCount = enrollment
    ? lessons.filter((l) =>
        l.progress.some((p) => p.userId === enrollment.userId && p.isCompleted),
      ).length
    : 0;
  const isFullyCompleted = lessons.length > 0 && completedCount === lessons.length;

  if (!enrollment || !isFullyCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sertifikat Tidak Ditemukan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            ID sertifikat tidak valid atau kursus yang bersangkutan belum diselesaikan secara penuh.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://learnify.josapratama.com";
  const certificateUrl = `${baseUrl}/certificate/${enrollment.id}`;
  const shareText = `Saya baru saja menyelesaikan kursus "${enrollment.course.title}" di Learnify! 🎓`;
  const isOwner = currentUser?.id === enrollment.userId;

  // Generate SVG QR Code pointing directly to this verification page
  let qrSvg = "";
  try {
    qrSvg = await QRCode.toString(certificateUrl, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Failed to generate certificate QR:", err);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 flex flex-col items-center transition-colors duration-200">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { background: #ffffff !important; margin: 0; padding: 0; }
              .no-print { display: none !important; }
              .certificate-card {
                box-shadow: none !important;
                border: 8px double #1e293b !important;
                margin: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
                page-break-inside: avoid;
              }
            }
          `,
        }}
      />

      {/* Verification Banner */}
      <div className="no-print max-w-4xl w-full mb-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              Sertifikat Terverifikasi Resmi
              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Diterbitkan secara sah oleh Learnify untuk {enrollment.user.fullName}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block font-mono text-xs px-2.5 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">
          ID: {enrollment.id.substring(0, 12).toUpperCase()}
        </span>
      </div>

      {/* Certificate Sheet */}
      <div className="certificate-card max-w-4xl w-full bg-white dark:bg-gray-900 p-8 sm:p-14 rounded-2xl shadow-2xl border-8 border-double border-gray-200 dark:border-gray-800 relative overflow-hidden mb-8 transition-colors duration-200">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 -mr-20 -mt-20 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/5 -ml-20 -mb-20 rounded-full pointer-events-none" />

        <div className="text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-widest">
            Sertifikat Kelulusan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 italic mb-8 sm:mb-10 text-sm sm:text-base">
            Diberikan dengan bangga kepada:
          </p>

          <h2 className="text-3xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-8 border-b-2 border-gray-100 dark:border-gray-800 pb-4 inline-block px-8 sm:px-12">
            {enrollment.user.fullName}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Telah berhasil menyelesaikan seluruh kurikulum dan persyaratan kursus daring:
            <span className="block font-bold text-gray-900 dark:text-white mt-2 text-xl sm:text-2xl font-sans">
              &quot;{enrollment.course.title}&quot;
            </span>
          </p>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 mt-12 max-w-2xl mx-auto">
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                {enrollment.course.instructor.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                Instruktur Kursus
              </p>
            </div>
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                {new Date(enrollment.enrolledAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                Tanggal Terbit
              </p>
            </div>
          </div>

          {/* Verification Badge + Real QR Code */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Learnify Verified Credential</p>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  ID: {enrollment.id.substring(0, 16).toUpperCase()}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  https://learnify.josapratama.com
                </p>
              </div>
            </div>

            {qrSvg && (
              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 bg-white p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-mono">
                  Pindai Verifikasi
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar (Hidden on print) */}
      <div className="no-print max-w-4xl w-full flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <PrintCertificateButton />
          {isOwner && (
            <Link
              href="/dashboard"
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm flex items-center justify-center"
            >
              Kembali ke Dashboard
            </Link>
          )}
          {!isOwner && (
            <Link
              href="/courses"
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm flex items-center justify-center"
            >
              Jelajahi Kursus Lain
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Bagikan:
          </span>
          <div className="flex gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0077b5] text-white rounded-xl hover:opacity-90 transition"
              title="Bagikan ke LinkedIn"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(certificateUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
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
