import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      thumbnailUrl: true,
    },
    take: 5,
  });

  return NextResponse.json(courses);
}
