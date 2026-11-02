import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "instructor" && user.role !== "admin")) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya instruktur yang dapat mengajukan penarikan." },
        { status: 403 },
      );
    }

    const { bankName, accountNumber, accountHolder, amount } = await req.json();

    if (!bankName || !accountNumber || !accountHolder || !amount) {
      return NextResponse.json(
        { error: "Semua data rekening dan nominal penarikan wajib diisi." },
        { status: 400 },
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 50000) {
      return NextResponse.json(
        { error: "Minimal penarikan saldo adalah Rp 50.000." },
        { status: 400 },
      );
    }

    // Calculate total verified revenue for this instructor
    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        enrollments: {
          include: {
            payment: true,
          },
        },
      },
    });

    const totalRevenue = instructorCourses.reduce((acc, c) => {
      const courseRev = c.enrollments.reduce((sum, en) => {
        if (en.payment && en.payment.status === "SUCCESS") {
          return sum + en.payment.amount;
        }
        return sum;
      }, 0);
      return acc + courseRev;
    }, 0);

    if (parsedAmount > totalRevenue && totalRevenue > 0) {
      return NextResponse.json(
        { error: `Nominal penarikan melebihi saldo yang tersedia (Rp ${totalRevenue.toLocaleString("id-ID")}).` },
        { status: 400 },
      );
    }

    // Generate reference transaction id
    const referenceId = `WD-${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;

    return NextResponse.json({
      success: true,
      message: "Permintaan penarikan saldo berhasil diajukan dan sedang diproses.",
      payout: {
        referenceId,
        amount: parsedAmount,
        bankName,
        accountNumber,
        accountHolder,
        status: "PROCESSING",
        estimatedTime: "1x24 jam kerja",
        requestedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Payout Request Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses penarikan saldo. Silakan coba kembali." },
      { status: 500 },
    );
  }
}
