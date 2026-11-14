import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificateSearchClient from "./CertificateSearchClient";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat | Learnify",
  description:
    "Verifikasi keaslian dan status kelulusan sertifikat kursus resmi platform Learnify.",
};

export default async function CertificateVerificationPage() {
  const currentUser = await getCurrentUser();
  const dbUser = currentUser
    ? await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          streak: true,
          avatarUrl: true,
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col justify-center">
        <CertificateSearchClient />
      </main>

      <Footer />
    </div>
  );
}
