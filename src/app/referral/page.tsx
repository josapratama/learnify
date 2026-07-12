import { redirect } from "next/navigation";
import Link from "next/link";
import { requireValidUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GraduationCap, Gift, Copy, Users, CheckCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ReferralCopyButton from "@/components/ReferralCopyButton";

export const metadata = { title: "Program Referral | EduTech" };

export default async function ReferralPage() {
  const user = await requireValidUser();
  if (!user) redirect("/login?from=/referral");

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { referralCode: true, fullName: true },
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
      select: { referralCode: true, fullName: true },
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const referralLink = `${baseUrl}/register?ref=${dbUser?.referralCode}`;

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
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-10 text-white text-center mb-10">
          <Gift className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-black mb-3">Program Referral 🎁</h1>
          <p className="text-purple-100 text-lg max-w-lg mx-auto">
            Ajak teman belajar di EduTech. Setiap teman yang daftar menggunakan
            kode Anda, Anda mendapat reward <strong>Rp30.000</strong>!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Referral", value: referrals.length, icon: Users },
            {
              label: "Total Reward",
              value: `Rp${totalReward.toLocaleString("id-ID")}`,
              icon: Gift,
            },
            {
              label: "Kode Aktif",
              value: dbUser?.referralCode || "-",
              icon: CheckCircle,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center"
            >
              <Icon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Copy className="w-5 h-5 text-blue-500" /> Link Referral Anda
          </h2>
          <ReferralCopyButton
            referralLink={referralLink}
            referralCode={dbUser?.referralCode || ""}
          />
        </div>

        {/* Cara Kerja */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Cara Kerja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Bagikan Link",
                desc: "Kirim link referral ke teman atau posting di media sosial",
              },
              {
                step: "2",
                title: "Teman Daftar",
                desc: "Teman Anda mendaftar menggunakan link atau kode referral Anda",
              },
              {
                step: "3",
                title: "Dapat Reward",
                desc: "Anda mendapat reward Rp30.000 per teman yang berhasil daftar",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Referral */}
        {referrals.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Riwayat Referral
            </h2>
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                      {ref.referred.fullName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {ref.referred.fullName || ref.referred.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(ref.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                    +Rp{ref.reward.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
