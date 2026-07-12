import Link from "next/link";
import { GraduationCap, ChevronLeft, Settings } from "lucide-react";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import ThemeToggle from "@/components/ThemeToggle";

export default async function SettingsPage() {
  const user = await requireValidUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      fullName: true,
      bio: true,
      website: true,
      avatarUrl: true,
    },
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 px-6 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <GraduationCap className="w-7 h-7" />
            <span>EduTech</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali ke Profil
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-gray-400 dark:text-gray-600" />{" "}
            Pengaturan Akun
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Perbarui informasi profil dan publik Anda di platform.
          </p>
        </div>

        <ProfileSettingsForm user={dbUser} />
      </div>
    </div>
  );
}
