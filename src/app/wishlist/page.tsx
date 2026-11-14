import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist Saya | Learnify",
  description: "Daftar kursus favorit yang Anda simpan untuk dipelajari di Learnify.",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await requireValidUser();

  if (!user) {
    redirect("/login?from=/wishlist");
  }

  const [dbUser, wishlistItems] = await Promise.all([
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
    prisma.wishlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          include: {
            instructor: { select: { fullName: true, avatarUrl: true } },
            reviews: { select: { rating: true } },
            enrollments: { select: { id: true } },
          },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800 shadow-sm">
              <Heart className="w-6 h-6 fill-rose-500/20" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Wishlist Kursus Saya
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Simpanan kursus favorit yang siap Anda ikuti kapan saja.
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition shadow-md shadow-blue-500/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Katalog Kursus</span>
          </Link>
        </div>

        {/* Client Interactive Wishlist */}
        <WishlistClient initialItems={wishlistItems} />
      </main>

      <Footer />
    </div>
  );
}
