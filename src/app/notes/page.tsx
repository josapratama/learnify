import Link from "next/link";
import { redirect } from "next/navigation";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FileText, Clock, BookOpen, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = {
  title: "Catatan Saya | Learnify",
  description: "Rangkuman dan catatan penting dari setiap materi kursus Anda.",
};

export default async function NotesPage() {
  const user = await requireValidUser();
  if (!user) redirect("/login?from=/notes");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      streak: true,
    },
  });

  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
          section: {
            select: { course: { select: { title: true, slug: true } } },
          },
        },
      },
    },
  });

  // Group by course
  const byCourse = notes.reduce(
    (acc, note) => {
      const courseTitle = note.lesson.section.course.title;
      const courseSlug = note.lesson.section.course.slug;
      const key = courseSlug;
      if (!acc[key]) acc[key] = { courseTitle, courseSlug, notes: [] };
      acc[key].notes.push(note);
      return acc;
    },
    {} as Record<
      string,
      { courseTitle: string; courseSlug: string; notes: typeof notes }
    >,
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Catatan Belajar Saya
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total {notes.length} catatan tersimpan di seluruh kursus aktif.
            </p>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1.5">
              Belum Ada Catatan Tersimpan
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              Saat mempelajari materi kursus, Anda dapat menulis catatan penting langsung di samping video atau teks artikel.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 transition"
            >
              <span>Buka Kursus Saya</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(byCourse).map(
              ({ courseTitle, courseSlug, notes: courseNotes }) => (
                <div key={courseSlug} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                      {courseTitle}
                    </h2>
                    <span className="text-xs font-medium text-gray-400">
                      ({courseNotes.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {courseNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 sm:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-gray-50 dark:border-gray-800">
                          <Link
                            href={`/courses/${courseSlug}/learn/${note.lesson.slug}`}
                            className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{note.lesson.title}</span>
                          </Link>
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(note.updatedAt), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
