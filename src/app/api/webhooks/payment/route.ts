import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPayGatewayWebhook } from "@/lib/payment-gateway";
import { sendPaymentConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-payment-signature");
    const event = request.headers.get("x-payment-event");

    // 1. Verifikasi HMAC Signature dari PayGateway Hub
    const isValid = verifyPayGatewayWebhook(rawBody, signature);
    if (!isValid) {
      console.warn("[PayGateway Webhook] Invalid signature rejected!");
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const { event: payloadEvent, data } = payload;
    const currentEvent = event || payloadEvent;

    // 2. Logging transaksi
    try {
      await prisma.transactionLog.create({
        data: {
          orderId: String(data?.orderId || data?.id || "unknown"),
          status: String(currentEvent || data?.status || "unknown"),
          payload: payload,
        },
      });
    } catch (logErr) {
      console.warn("Could not log transaction:", logErr);
    }

    const orderId = data?.orderId;
    const transactionId = data?.id;

    if (!orderId && !transactionId) {
      return NextResponse.json(
        { message: "Missing orderId / transactionId" },
        { status: 400 }
      );
    }

    // 3. Cari record Enrollment berdasarkan orderId atau paymentId
    let enrollment = null;
    if (orderId) {
      enrollment = await prisma.enrollment.findUnique({
        where: { id: orderId },
        include: {
          course: { select: { title: true, slug: true } },
          user: { select: { email: true, fullName: true } },
        },
      });
    }

    if (!enrollment && transactionId) {
      enrollment = await prisma.enrollment.findUnique({
        where: { paymentId: transactionId },
        include: {
          course: { select: { title: true, slug: true } },
          user: { select: { email: true, fullName: true } },
        },
      });
    }

    if (!enrollment) {
      console.warn(
        `[PayGateway Webhook] Enrollment not found for orderId: ${orderId}, txId: ${transactionId}`
      );
      return NextResponse.json(
        { message: "Order processed: record not found" },
        { status: 200 }
      );
    }

    // 4. Proses status event
    if (currentEvent === "payment.settled" || data?.status === "SETTLED") {
      // Update enrollment ke status paid
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          status: "paid",
          paymentId: transactionId || enrollment.paymentId,
        },
      });

      // Beri notifikasi in-app ke pengguna
      await prisma.notification
        .create({
          data: {
            userId: enrollment.userId,
            title: "Pembayaran Berhasil! 🎉",
            message: `Pembayaran sebesar Rp ${Number(data?.totalAmount || data?.amount || enrollment.amount).toLocaleString("id-ID")} untuk kursus "${enrollment.course.title}" telah diterima. Selamat belajar!`,
            type: "success",
            link: `/courses/${enrollment.course.slug}`,
          },
        })
        .catch((notifErr) => console.warn("Notif warning:", notifErr));

      // Kirim email konfirmasi
      if (enrollment.user.email) {
        sendPaymentConfirmationEmail(
          enrollment.user.email,
          enrollment.user.fullName || "Pengguna Learnify",
          enrollment.course.title
        ).catch((emailErr) => console.warn("Email warning:", emailErr));
      }

      console.log(
        `[PayGateway Webhook] Successfully settled enrollment ${enrollment.id} for ${enrollment.user.email}`
      );

      return NextResponse.json({
        success: true,
        message: "Enrollment activated successfully",
      });
    }

    if (
      currentEvent === "payment.cancelled" ||
      currentEvent === "payment.expired" ||
      data?.status === "EXPIRED" ||
      data?.status === "CANCELLED"
    ) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: "cancelled" },
      });

      return NextResponse.json({
        success: true,
        message: "Enrollment marked as cancelled",
      });
    }

    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error: any) {
    console.error("[PayGateway Webhook Error]:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

