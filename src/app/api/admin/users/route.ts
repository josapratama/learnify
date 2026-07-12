import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await requireValidUser();
  if (!user || user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { fullName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        streak: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user || user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, role } = await req.json();
  if (!userId || !role)
    return NextResponse.json(
      { error: "userId dan role wajib" },
      { status: 400 },
    );
  if (!["student", "instructor", "admin"].includes(role)) {
    return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}
