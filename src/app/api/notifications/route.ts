import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function GET() {
  const user = await requireValidUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(notifications);
}

export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  if (id) {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
  }

  return NextResponse.json({ success: true });
}
