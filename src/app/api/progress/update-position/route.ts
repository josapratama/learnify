import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, lastPosition } = await req.json();

  if (!lessonId || lastPosition === undefined) {
    return NextResponse.json({ error: "Lesson ID and position are required" }, { status: 400 });
  }

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: {
      lastPosition,
    },
    create: {
      userId: user.id,
      lessonId,
      lastPosition,
    },
  });

  return NextResponse.json({ success: true });
}
