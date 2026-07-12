import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const { courseId, platform } = await req.json();
  if (!courseId)
    return NextResponse.json({ error: "courseId required" }, { status: 400 });

  await prisma.courseShare.create({
    data: { courseId, userId: user?.id || null, platform: platform || "link" },
  });

  return NextResponse.json({ success: true });
}
