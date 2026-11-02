import { redirect } from "next/navigation";
import Link from "next/link";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Gift, Copy, Users, CheckCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReferralCopyButton from "@/components/ReferralCopyButton";

export const metadata = {
  title: "Program Referral | Learnify",
  description: "Ajak teman belajar di Learnify dan dapatkan reward menarik.",
};

export default async function ReferralPage() {
  const user = await requireValidUser();
  if (!user) redirect("/login?from=/referral");

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      referralCode: true,
      fullName: true,
      email: true,
      role: true,
      streak: true,
      avatarUrl: true,
    },
  });

  if (!dbUser?.referralCode) {
    const { randomBytes } = await import("crypto");
    let code = randomBytes(4).toString("hex").toUpperCase();
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = randomBytes(4).toString("hex").toUpperCase();
    }
    dbUser = await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code },
      select: {
        id: true,
        referralCode: true,
        fullName: true,
        email: true,
        role: true,
        streak: true,
        avatarUrl: true,
      },
    });
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerId: user.id },
    include: {
      referred: { select: { fullName: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalReward = referrals.reduce((sum, r) => sum + r.reward, 0);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://learnify.josapratama.com";
  const referralLink = `${baseUrl}/register?ref=${dbUser?.referralCode}`;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Navbar user={dbUser} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Hero Card */}
        <div className="relative overflow-hidden bg-linear-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white text-center mb-8 shadow-xl shadow-purple-500/10">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-3 tracking-tight">
              Program Referral Siswa 🎁
            </h1>
            <p className="text-purple-100 text-sm sm:text-base max-w-lg mx-auto font-medium leading-relaxed">
              Ajak teman dan rekan belajar di Learnify. Setiap teman yang mendaftar menggunakan kode Anda, Anda akan mendapatkan reward saldo belajar <strong>Rp 30.000</strong>!
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Teman Terdaftar", value: `${referrals.length} Teman`, icon: Users },
            {
              label: "Total Reward Didapat",
              value: `Rp ${totalReward.toLocaleString("id-ID")}`,
              icon: Gift,
            },
            {
              label: "Kode Referral Anda",
              value: dbUser?.referralCode || "-",
              icon: CheckCircle,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800/80 text-center shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Referral Link Copy Area */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/80 mb-8 shadow-xs">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Copy className="w-5 h-5 text-blue-500" />
            <span>Bagikan Link & Kode Referral</span>
          </h2>
          <ReferralCopyButton
            referralLink={referralLink}
            referralCode={dbUser?.referralCode || ""}
          />
        </div>

        {/* Cara Kerja */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/80 mb-8 shadow-xs">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">
            Cara Kerja Referral
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Bagikan Link",
                desc: "Salin link referral Anda dan bagikan ke teman, grup kampus, atau media sosial.",
              },
              {
                step: "2",
                title: "Teman Mendaftar",
                desc: "Teman Anda mendaftar akun Learnify baru menggunakan kode atau tautan unik Anda.",
              },
              {
                step: "3",
                title: "Dapatkan Reward",
                desc: "Reward Rp 30.000 otomatis tercatat ke akun Anda untuk setiap teman yang bergabung.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center p-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Referral */}
        {referrals.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800/80 shadow-xs">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">
              Riwayat Referral ({referrals.length})
            </h2>
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-xs">
                      {ref.referred.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                        {ref.referred.fullName || ref.referred.email}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(ref.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm">
                    +Rp {ref.reward.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
