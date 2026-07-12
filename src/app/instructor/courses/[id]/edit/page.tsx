import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  Save,
} from "lucide-react";
import CurriculumEditor from "@/components/CurriculumEditor";
import ThemeToggle from "@/components/ThemeToggle";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    redirect("/dashboard");
  }

  const course = await prisma.course.findUnique({
    where: { id, instructorId: user.id },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/instructor"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-8 h-8" />
            <span className="tracking-tight">
              EduTech{" "}
              <span className="text-gray-400 font-medium text-xs ml-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Editor
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/instructor"
              className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Batal</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Edit Kurikulum
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-2 italic">
            Kursus:{" "}
            <span className="text-blue-600 dark:text-blue-400 font-black not-italic">
              {course.title}
            </span>
          </p>
        </div>

        <CurriculumEditor
          initialSections={course.sections}
          courseId={course.id}
          initialIsPublished={course.isPublished}
        />
      </div>
    </div>
  );
}
