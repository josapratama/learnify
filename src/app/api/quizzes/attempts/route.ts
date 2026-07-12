import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, score, answers } = await req.json();

  if (!lessonId || score === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      lessonId,
      score,
      answers,
    },
  });

  return NextResponse.json(attempt);
}

export async function GET(req: Request) {
  const user = await requireValidUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: user.id,
      lessonId,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json(attempts);
}
