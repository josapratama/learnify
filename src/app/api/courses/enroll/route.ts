import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import { snap } from "@/lib/midtrans";

export async function POST(request: Request) {
  try {
    const user = await requireValidUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }

    const { courseId } = await request.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Kursus tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek apakah sudah ada enrollment
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (enrollment && enrollment.status === "paid") {
      return NextResponse.json(
        { message: "Anda sudah membeli kursus ini" },
        { status: 400 },
      );
    }

    // LOGIKA DEMO MODE: Lewati Midtrans jika diaktifkan
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      if (!enrollment) {
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
            status: "paid", // Langsung dianggap bayar
            amount: course.price,
            paymentId: `DEMO-${Date.now()}`,
          },
        });
      } else {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: "paid", paymentId: `DEMO-${Date.now()}` },
        });
      }
      return NextResponse.json({ demo: true });
    }

    // Jika menggunakan Midtrans asli
    const orderId =
      enrollment?.id || `ORDER-${Date.now()}-${user.id.slice(0, 4)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: course.price,
      },
      customer_details: {
        email: user.email,
      },
      item_details: [
        {
          id: course.id,
          price: course.price,
          quantity: 1,
          name: course.title.slice(0, 50),
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    if (!enrollment) {
      await prisma.enrollment.create({
        data: {
          id: orderId,
          userId: user.id,
          courseId: courseId,
          status: "pending",
          amount: course.price,
          snapToken: transaction.token,
        },
      });
    } else {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          snapToken: transaction.token,
        },
      });
    }

    return NextResponse.json({
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Enrollment API Error:", error);
    // Fallback info jika error Midtrans (misal key salah)
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        {
          message:
            "Midtrans API Key belum dikonfigurasi. Aktifkan DEMO_MODE di .env untuk mencoba pendaftaran.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Gagal membuat transaksi" },
      { status: 500 },
    );
  }
}
