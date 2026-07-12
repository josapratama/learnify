import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, sections, isPublished } = await req.json();

  try {
    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: user.id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Batch update using a transaction
    await prisma.$transaction(async (tx) => {
      // 0. Update course publish status
      if (isPublished !== undefined) {
        await tx.course.update({
          where: { id: courseId },
          data: { isPublished },
        });
      }
      // 1. Get existing sections/lessons to identify what to delete
      const existingSections = await tx.section.findMany({
        where: { courseId },
        include: { lessons: true },
      });

      const sectionIdsInPayload = sections
        .filter((s: any) => !s.id.startsWith("new-"))
        .map((s: any) => s.id);
      const lessonIdsInPayload = sections.flatMap((s: any) =>
        s.lessons
          .filter((l: any) => !l.id.startsWith("new-"))
          .map((l: any) => l.id),
      );

      // 2. Delete sections/lessons not in payload
      for (const section of existingSections) {
        if (!sectionIdsInPayload.includes(section.id)) {
          // Lessons will be deleted automatically if onCascade is set,
          // but let's be safe if not
          await tx.lesson.deleteMany({ where: { sectionId: section.id } });
          await tx.section.delete({ where: { id: section.id } });
          continue;
        }

        for (const lesson of section.lessons) {
          if (!lessonIdsInPayload.includes(lesson.id)) {
            await tx.lesson.delete({ where: { id: lesson.id } });
          }
        }
      }

      // 3. Upsert sections and lessons
      for (let i = 0; i < sections.length; i++) {
        const sectionData = sections[i];
        const isNewSection = sectionData.id.startsWith("new-");

        const section = isNewSection
          ? await tx.section.create({
              data: {
                title: sectionData.title,
                orderIndex: i + 1,
                courseId: courseId,
              },
            })
          : await tx.section.update({
              where: { id: sectionData.id },
              data: {
                title: sectionData.title,
                orderIndex: i + 1,
              },
            });

        for (let j = 0; j < sectionData.lessons.length; j++) {
          const lessonData = sectionData.lessons[j];
          const isNewLesson = lessonData.id.startsWith("new-");

          if (isNewLesson) {
            await tx.lesson.create({
              data: {
                title: lessonData.title,
                slug: lessonData.slug || `lesson-${Date.now()}-${j}`,
                contentType: lessonData.contentType || "article",
                orderIndex: j + 1,
                sectionId: section.id,
              },
            });
          } else {
            await tx.lesson.update({
              where: { id: lessonData.id },
              data: {
                title: lessonData.title,
                orderIndex: j + 1,
                sectionId: section.id, // Support moving between sections
                contentType: lessonData.contentType,
                videoUrl: lessonData.videoUrl,
                bodyText: lessonData.bodyText,
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan urutan kurikulum" },
      { status: 500 },
    );
  }
}
