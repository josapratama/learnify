import Link from "next/link";
import { redirect } from "next/navigation";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FileText, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotesClient from "./NotesClient";

export const metadata = {
  title: "Catatan Saya | Learnify",
  description: "Rangkuman dan catatan penting dari setiap materi kursus Anda.",
};

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const user = await requireValidUser();
  if (!user) redirect("/login?from=/notes");

  const [dbUser, notes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
        streak: true,
      },
    }),
    prisma.note.findMany({
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
    }),
  ]);

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
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-xs">
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

        <NotesClient initialNotes={notes as any} />
      </main>

      <Footer />
    </div>
  );
}
