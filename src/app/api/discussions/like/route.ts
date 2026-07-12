import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { discussionId } = await req.json();
  if (!discussionId)
    return NextResponse.json(
      { error: "discussionId required" },
      { status: 400 },
    );

  // Toggle like
  const existing = await prisma.discussionLike.findUnique({
    where: { userId_discussionId: { userId: user.id, discussionId } },
  });

  if (existing) {
    await prisma.discussionLike.delete({ where: { id: existing.id } });
    const count = await prisma.discussionLike.count({
      where: { discussionId },
    });
    return NextResponse.json({ liked: false, count });
  } else {
    await prisma.discussionLike.create({
      data: { userId: user.id, discussionId },
    });
    const count = await prisma.discussionLike.count({
      where: { discussionId },
    });
    return NextResponse.json({ liked: true, count });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const discussionId = searchParams.get("discussionId");
  const userId = searchParams.get("userId");

  if (!discussionId)
    return NextResponse.json(
      { error: "discussionId required" },
      { status: 400 },
    );

  const count = await prisma.discussionLike.count({ where: { discussionId } });
  let liked = false;
  if (userId) {
    const existing = await prisma.discussionLike.findUnique({
      where: { userId_discussionId: { userId, discussionId } },
    });
    liked = !!existing;
  }
  return NextResponse.json({ liked, count });
}
