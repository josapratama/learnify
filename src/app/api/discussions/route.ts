import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import { sendDiscussionReplyEmail } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json(
      { error: "Lesson ID is required" },
      { status: 400 },
    );
  }

  const discussions = await prisma.discussion.findMany({
    where: { lessonId, parentId: null },
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      replies: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(discussions);
}

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, lessonId, parentId } = await req.json();

  if (!content || !lessonId) {
    return NextResponse.json(
      { error: "Content and Lesson ID are required" },
      { status: 400 },
    );
  }

  const discussion = await prisma.discussion.create({
    data: {
      content,
      lessonId,
      userId: user.id,
      parentId: parentId || null,
    },
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      lesson: {
        select: {
          title: true,
          slug: true,
          section: {
            select: {
              course: { select: { id: true, slug: true, instructorId: true } },
            },
          },
        },
      },
    },
  });

  const lessonUrl = `/courses/${discussion.lesson.section.course.slug}/learn/${discussion.lesson.slug}`;

  // Notify Instructor or Parent User
  if (parentId) {
    const parentDiscussion = await prisma.discussion.findUnique({
      where: { id: parentId },
      select: {
        userId: true,
        user: { select: { email: true, fullName: true } },
      },
    });

    if (parentDiscussion && parentDiscussion.userId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: parentDiscussion.userId,
          title: "Balasan Diskusi Baru",
          message: `${user.fullName} membalas pertanyaan Anda di materi "${discussion.lesson.title}"`,
          type: "info",
          link: lessonUrl,
        },
      });

      // Kirim email notifikasi balasan
      if (parentDiscussion.user.email) {
        sendDiscussionReplyEmail(
          parentDiscussion.user.email,
          parentDiscussion.user.fullName || "Pengguna",
          discussion.lesson.title,
          user.fullName || user.email,
          discussion.content,
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://learnify.josapratama.com"}${lessonUrl}`,
        ).catch(() => {});
      }
    }
  } else {
    // Notify Instructor
    const instructorId = discussion.lesson.section.course.instructorId;
    if (instructorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: instructorId,
          title: "Pertanyaan Baru di Kursus",
          message: `${user.fullName} bertanya di materi "${discussion.lesson.title}"`,
          type: "info",
          link: lessonUrl,
        },
      });
    }
  }

  return NextResponse.json(discussion);
}
