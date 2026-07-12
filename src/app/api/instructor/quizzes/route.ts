import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

// GET — ambil semua quiz untuk satu lesson
export async function GET(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Verifikasi ownership melalui chain lesson → section → course
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } },
  });

  if (!lesson || lesson.section.course.instructorId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const quizzes = await prisma.quiz.findMany({
    where: { lessonId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(quizzes);
}

// POST — buat quiz baru
export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, question, options, correctOption, explanation } =
    await req.json();

  if (
    !lessonId ||
    !question ||
    !Array.isArray(options) ||
    options.length < 2 ||
    correctOption === undefined
  ) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Verifikasi ownership
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } },
  });

  if (!lesson || lesson.section.course.instructorId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const quiz = await prisma.quiz.create({
    data: { lessonId, question, options, correctOption, explanation },
  });

  return NextResponse.json(quiz);
}

// PATCH — update quiz
export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, question, options, correctOption, explanation } =
    await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // Verifikasi ownership
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      lesson: { include: { section: { include: { course: true } } } },
    },
  });

  if (!quiz || quiz.lesson.section.course.instructorId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.quiz.update({
    where: { id },
    data: { question, options, correctOption, explanation },
  });

  return NextResponse.json(updated);
}

// DELETE — hapus quiz
export async function DELETE(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // Verifikasi ownership
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      lesson: { include: { section: { include: { course: true } } } },
    },
  });

  if (!quiz || quiz.lesson.section.course.instructorId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
