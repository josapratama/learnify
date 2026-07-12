import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendStreakReminderEmail } from "@/lib/email";

// Endpoint ini dipanggil via cron job (misal: Vercel Cron atau external scheduler)
// GET /api/email/streak-reminder?secret=YOUR_CRON_SECRET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (
    secret !== process.env.CRON_SECRET &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil user yang terakhir belajar kemarin (streak bisa putus hari ini)
  const kemarin = new Date();
  kemarin.setDate(kemarin.getDate() - 1);
  kemarin.setHours(0, 0, 0, 0);

  const besokKemarin = new Date(kemarin);
  besokKemarin.setDate(besokKemarin.getDate() + 1);

  const users = await prisma.user.findMany({
    where: {
      streak: { gt: 0 },
      lastLearnDate: {
        gte: kemarin,
        lt: besokKemarin,
      },
    },
    select: { id: true, email: true, fullName: true, streak: true },
    take: 100, // Batch 100 per run
  });

  let sent = 0;
  for (const user of users) {
    if (user.email) {
      const result = await sendStreakReminderEmail(
        user.email,
        user.fullName || "Pengguna",
        user.streak,
      );
      if (result) sent++;
    }
  }

  return NextResponse.json({
    message: `Streak reminder terkirim ke ${sent}/${users.length} user`,
  });
}
