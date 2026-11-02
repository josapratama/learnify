import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Pengaturan Akun | Learnify",
  description: "Perbarui profil, informasi publik, bio dan avatar siswa Learnify.",
};

export default async function SettingsPage() {
  const user = await requireValidUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      bio: true,
      website: true,
      avatarUrl: true,
      role: true,
      streak: true,
    },
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Pengaturan Akun & Profil
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Perbarui biodata publik, tautan portofolio, dan foto avatar profil Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 p-6 sm:p-8 shadow-xs">
          <ProfileSettingsForm user={dbUser} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
