import { Metadata } from "next";
import Link from "next/link";
import { Code2, Sparkles, BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaygroundClient from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "Code Playground | Learnify",
  description: "Coba dan eksekusi kode pemrograman (JavaScript, Python, TypeScript, HTML, SQL) langsung di browser Anda.",
};

export const dynamic = "force-dynamic";

export default async function PlaygroundPage() {
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm shrink-0">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Interactive Code Playground
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Uji coba, jalankan, dan eksperimen dengan beragam bahasa pemrograman secara instan di browser.
            </p>
          </div>
        </div>

        {/* Dynamic Multi-Language Playground Workspace */}
        <PlaygroundClient />
      </main>

      <Footer />
    </div>
  );
}
