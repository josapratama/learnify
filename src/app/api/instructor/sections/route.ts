import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, orderIndex, courseId } = await req.json();

  const section = await prisma.section.create({
    data: { title, orderIndex, courseId },
  });

  return NextResponse.json(section);
}

export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, orderIndex } = await req.json();

  const section = await prisma.section.update({
    where: { id },
    data: { title, orderIndex },
  });

  return NextResponse.json(section);
}
