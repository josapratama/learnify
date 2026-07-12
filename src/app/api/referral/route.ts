import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import { randomBytes } from "crypto";

function generateCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function GET() {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { referralCode: true },
  });

  // Generate code jika belum punya
  if (!dbUser?.referralCode) {
    let code = generateCode();
    // Pastikan unik
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = generateCode();
    }
    dbUser = await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code },
      select: { referralCode: true },
    });
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerId: user.id },
    include: {
      referred: { select: { fullName: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ referralCode: dbUser?.referralCode, referrals });
}

// POST: Claim referral saat register
export async function POST(req: Request) {
  const { referralCode, newUserId } = await req.json();
  if (!referralCode || !newUserId)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const referrer = await prisma.user.findUnique({ where: { referralCode } });
  if (!referrer || referrer.id === newUserId)
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  const existing = await prisma.referral.findUnique({
    where: { referredId: newUserId },
  });
  if (existing)
    return NextResponse.json({ error: "Already referred" }, { status: 400 });

  const referral = await prisma.referral.create({
    data: { referrerId: referrer.id, referredId: newUserId, reward: 30000 },
  });

  // Notifikasi referrer
  await prisma.notification.create({
    data: {
      userId: referrer.id,
      title: "Referral Berhasil! 🎉",
      message:
        "Seseorang mendaftar menggunakan kode referral Anda. Reward Rp30.000 menunggu!",
      type: "success",
      link: "/referral",
    },
  });

  return NextResponse.json(referral);
}
