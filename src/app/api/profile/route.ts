import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fullName, bio, website, avatarUrl } = await req.json();

  // Validasi
  if (!fullName?.trim()) {
    return NextResponse.json(
      { error: "Nama lengkap tidak boleh kosong" },
      { status: 400 },
    );
  }
  if (website && !website.match(/^https?:\/\/.+/)) {
    return NextResponse.json(
      { error: "URL website tidak valid" },
      { status: 400 },
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      fullName: fullName.trim(),
      bio: bio?.trim() || null,
      website: website?.trim() || null,
      avatarUrl: avatarUrl?.trim() || null,
    },
    select: {
      id: true,
      fullName: true,
      bio: true,
      website: true,
      avatarUrl: true,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function GET() {
  const user = await requireValidUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      bio: true,
      website: true,
      avatarUrl: true,
      role: true,
    },
  });

  return NextResponse.json(dbUser);
}
