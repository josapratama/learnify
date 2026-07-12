import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  const where = lessonId ? { userId: user.id, lessonId } : { userId: user.id };
  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
          section: {
            select: { course: { select: { title: true, slug: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, content } = await req.json();
  if (!lessonId || !content?.trim()) {
    return NextResponse.json(
      { error: "lessonId dan content wajib" },
      { status: 400 },
    );
  }

  const note = await prisma.note.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { content: content.trim() },
    create: { userId: user.id, lessonId, content: content.trim() },
  });

  return NextResponse.json(note);
}

export async function DELETE(req: Request) {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId } = await req.json();
  await prisma.note.deleteMany({ where: { userId: user.id, lessonId } });
  return NextResponse.json({ success: true });
}
