import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPaymentConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
    } = body;

    // Log Transaction
    await prisma.transactionLog.create({
      data: {
        orderId: order_id,
        status: transaction_status,
        payload: body,
      },
    });

    // Verifikasi Signature Key (Keamanan)
    const serverKey =
      process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-YOUR_SERVER_KEY";
    const hash = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json(
        { message: "Invalid Signature" },
        { status: 400 },
      );
    }

    // Update status di database
    let dbStatus = "pending";
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      dbStatus = "paid";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      dbStatus = "cancelled";
    }

    const enrollment = await prisma.enrollment.update({
      where: { id: order_id },
      data: { status: dbStatus },
      include: {
        course: { select: { title: true } },
        user: { select: { email: true, fullName: true } },
      },
    });

    // Notify User on Success
    if (dbStatus === "paid") {
      await prisma.notification.create({
        data: {
          userId: enrollment.userId,
          title: "Pembayaran Berhasil!",
          message: `Selamat! Pembayaran untuk kursus ${enrollment.course.title} telah berhasil dikonfirmasi.`,
          type: "success",
          link: "/dashboard",
        },
      });

      // Kirim email konfirmasi pembayaran
      if (enrollment.user.email) {
        sendPaymentConfirmationEmail(
          enrollment.user.email,
          enrollment.user.fullName || "Pengguna",
          enrollment.course.title,
        ).catch(() => {});
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
