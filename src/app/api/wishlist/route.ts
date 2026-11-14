import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireValidUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: { select: { fullName: true, avatarUrl: true } },
            reviews: { select: { rating: true } },
            enrollments: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireValidUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await req.json();

    const wishlist = await prisma.wishlist.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: {}, // No change if already exists
      create: {
        userId: user.id,
        courseId,
      },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireValidUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await req.json();

    await prisma.wishlist.delete({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus wishlist" }, { status: 500 });
  }
}
