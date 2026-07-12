import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, slug, contentType, videoUrl, bodyText, orderIndex, isPreview, sectionId } = await req.json();

  const lesson = await prisma.lesson.create({
    data: { 
      title, 
      slug, 
      contentType, 
      videoUrl, 
      bodyText, 
      orderIndex, 
      isPreview, 
      sectionId 
    },
  });

  return NextResponse.json(lesson);
}

export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, videoUrl, bodyText, orderIndex, isPreview } = await req.json();

  const lesson = await prisma.lesson.update({
    where: { id },
    data: { title, videoUrl, bodyText, orderIndex, isPreview },
  });

  return NextResponse.json(lesson);
}
