import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireValidUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, isCompleted } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { message: "Lesson ID is required" },
        { status: 400 },
      );
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
      update: {
        isCompleted: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Update Streak Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { streak: true, lastLearnDate: true },
    });

    if (dbUser && isCompleted) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = dbUser.lastLearnDate
        ? new Date(dbUser.lastLearnDate)
        : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);

      const todayTime = today.getTime();
      const lastTime = lastDate?.getTime() ?? 0;

      // Hanya update streak jika hari ini belum dicatat
      if (todayTime > lastTime) {
        let newStreak: number;
        const oneDayMs = 86_400_000;

        if (lastDate && todayTime === lastTime + oneDayMs) {
          // Hari berturut-turut
          newStreak = dbUser.streak + 1;
        } else {
          // Gap lebih dari 1 hari — reset
          newStreak = 1;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { streak: newStreak, lastLearnDate: today },
        });
      }
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
