import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, slug, description, price, category, level } = await req.json();

  try {
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        price: parseInt(price),
        category,
        level,
        instructorId: user.id,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("Create course error", error);
    return NextResponse.json(
      { error: "Slug sudah digunakan atau data tidak valid" },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, price, category, level, isPublished } =
    await req.json();

  const course = await prisma.course.update({
    where: { id, instructorId: user.id },
    data: {
      title,
      description,
      price: price !== undefined ? parseInt(price) : undefined,
      category,
      level,
      isPublished,
    },
  });

  return NextResponse.json(course);
}

export async function DELETE(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  try {
    // Hapus data berjenjang secara manual karena schema tidak pakai onDelete: Cascade
    const sections = await prisma.section.findMany({
      where: { courseId: id },
      select: { id: true },
    });
    const sectionIds = sections.map((s) => s.id);

    if (sectionIds.length > 0) {
      const lessons = await prisma.lesson.findMany({
        where: { sectionId: { in: sectionIds } },
        select: { id: true },
      });
      const lessonIds = lessons.map((l) => l.id);

      if (lessonIds.length > 0) {
        await prisma.quiz.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
        await prisma.quizAttempt.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
        await prisma.progress.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
        await prisma.discussion.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
        await prisma.note.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
        await prisma.attachment.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
      }
      await prisma.lesson.deleteMany({
        where: { sectionId: { in: sectionIds } },
      });
    }
    await prisma.section.deleteMany({ where: { courseId: id } });
    await prisma.enrollment.deleteMany({ where: { courseId: id } });
    await prisma.review.deleteMany({ where: { courseId: id } });
    await prisma.wishlist.deleteMany({ where: { courseId: id } });

    await prisma.course.delete({ where: { id, instructorId: user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete course error", error);
    return NextResponse.json(
      { error: "Gagal menghapus kursus" },
      { status: 500 },
    );
  }
}
