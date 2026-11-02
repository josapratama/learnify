import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";
import { snap } from "@/lib/midtrans";
import { createPayGatewayInvoice } from "@/lib/payment-gateway";

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

    // Jika kursus gratis (0 rupiah), langsung aktifkan enrollment
    if (course.price <= 0) {
      if (!enrollment) {
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
            status: "paid",
            amount: 0,
            paymentId: `FREE-${Date.now()}`,
          },
        });
      } else {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: "paid", paymentId: `FREE-${Date.now()}` },
        });
      }
      return NextResponse.json({ demo: true });
    }

    // 1. Integrasi Utama: Direct Self-Hosted Payment Gateway (QRIS, BCA, Mandiri, BRI, DANA, GoPay)
    const usePayGateway = process.env.USE_PAYGATEWAY !== "false";

    if (usePayGateway) {
      const orderId =
        enrollment?.id ||
        `ENR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      if (!enrollment) {
        enrollment = await prisma.enrollment.create({
          data: {
            id: orderId,
            userId: user.id,
            courseId: courseId,
            status: "pending",
            amount: course.price,
          },
        });
      }

      const baseUrl =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "https://learnify.josapratama.com";

      const pgResult = await createPayGatewayInvoice({
        orderId: enrollment.id,
        amount: course.price,
        customerName: user.fullName || user.email.split("@")[0],
        customerEmail: user.email,
        description: `Beli Kursus: ${course.title}`,
        metadata: {
          courseId: course.id,
          courseSlug: course.slug,
          userId: user.id,
          returnUrl: `${baseUrl}/courses/${course.slug}`,
        },
      });

      if (!pgResult.success || !pgResult.data?.checkoutUrl) {
        console.error("PayGateway creation failed:", pgResult);
        return NextResponse.json(
          {
            message:
              pgResult.message || "Gagal membuat tagihan pembayaran pada gateway.",
          },
          { status: 500 },
        );
      }

      // Simpan ID transaksi payment gateway
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          paymentId: pgResult.data.id,
        },
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: pgResult.data.checkoutUrl,
        orderId: enrollment.id,
        totalAmount: pgResult.data.totalAmount,
        uniqueCode: pgResult.data.uniqueCode,
      });
    }

    // Fallback: DEMO MODE
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      if (!enrollment) {
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
            status: "paid",
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

    // Fallback: Legacy Midtrans
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
    return NextResponse.json(
      { message: error.message || "Gagal membuat transaksi" },
      { status: 500 },
    );
  }
}
