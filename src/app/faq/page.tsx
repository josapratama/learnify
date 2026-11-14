import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowLeft, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Pusat Bantuan & FAQ | Learnify",
  description:
    "Pertanyaan yang sering diajukan seputar pendaftaran, materi koding, kuis, sertifikat digital, dan pembayaran di Learnify.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const user = await requireValidUser();

  const dbUser = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
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

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-800">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Bantuan Resmi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-xs sm:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
            Temukan jawaban cepat seputar platform e-learning, sertifikasi kelulusan, eksekusi kode, dan metode pembayaran.
          </p>
        </div>

        {/* Client Interactive FAQ */}
        <FaqClient />
      </main>

      <Footer />
    </div>
  );
}
