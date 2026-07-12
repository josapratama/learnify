import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireValidUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, rating, comment } = await req.json();

    if (!courseId || !rating) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek apakah user sudah terdaftar di kursus ini
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Anda harus terdaftar untuk memberi ulasan" },
        { status: 403 }
      );
    }

    // Simpan atau update review
    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: user.id,
        courseId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan review" }, { status: 500 });
  }
}
