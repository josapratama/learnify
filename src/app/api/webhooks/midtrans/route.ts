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
      payment_type,
    } = body;

    // Log Transaction safely
    try {
      await prisma.transactionLog.create({
        data: {
          orderId: String(order_id || "unknown"),
          status: String(transaction_status || "unknown"),
          payload: body,
        },
      });
    } catch (logErr) {
      console.warn("Could not log transaction:", logErr);
    }

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

    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: order_id },
      include: {
        course: { select: { title: true } },
        user: { select: { email: true, fullName: true } },
      },
    });

    if (!existingEnrollment) {
      console.warn(`[Midtrans Webhook] Enrollment not found for order_id: ${order_id}`);
      return NextResponse.json(
        { message: "Order processed: record not found" },
        { status: 200 },
      );
    }

    // Tentukan status di database
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

    // Update payment record if exists
    try {
      await prisma.payment.upsert({
        where: { enrollmentId: order_id },
        update: {
          status:
            dbStatus === "paid"
              ? "SUCCESS"
              : dbStatus === "cancelled"
                ? "FAILED"
                : "PENDING",
        },
        create: {
          enrollmentId: order_id,
          amount: Number(gross_amount) || 0,
          status:
            dbStatus === "paid"
              ? "SUCCESS"
              : dbStatus === "cancelled"
                ? "FAILED"
                : "PENDING",
          paymentMethod: payment_type || "midtrans",
        },
      });
    } catch (paymentErr) {
      console.warn("Payment upsert warning:", paymentErr);
    }

    // Notify User on Success
    if (dbStatus === "paid") {
      await prisma.notification.create({
        data: {
          userId: enrollment.userId,
          title: "Pembayaran Berhasil!",
          message: `Selamat! Pembayaran untuk kursus "${enrollment.course.title}" telah berhasil dikonfirmasi.`,
          type: "success",
          link: "/dashboard",
        },
      }).catch((notifErr) => console.warn("Notif warning:", notifErr));

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
