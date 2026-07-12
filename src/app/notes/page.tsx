import Link from "next/link";
import { redirect } from "next/navigation";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GraduationCap, FileText, Clock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = { title: "Catatan Saya | EduTech" };

export default async function NotesPage() {
  const user = await requireValidUser();
  if (!user) redirect("/login?from=/notes");

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" /> EduTech
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-10">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Catatan Saya
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {notes.length} catatan dari semua kursus
            </p>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Belum ada catatan
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Buat catatan saat belajar di halaman pelajaran
            </p>
            <Link
              href="/"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
            >
              Mulai Belajar
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(byCourse).map(
              ({ courseTitle, courseSlug, notes: courseNotes }) => (
                <div key={courseSlug}>
                  <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    {courseTitle}
                  </h2>
                  <div className="space-y-3">
                    {courseNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <Link
                            href={`/courses/${courseSlug}/learn/${note.lesson.slug}`}
                            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            📖 {note.lesson.title}
                          </Link>
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(note.updatedAt), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
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
      </div>
    </div>
  );
}
