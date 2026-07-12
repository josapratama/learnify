import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, referralCode } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
        role: "student",
      },
    });

    // Proses referral jika ada kode (non-blocking)
    if (referralCode) {
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/referral`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referralCode, newUserId: user.id }),
        },
      ).catch(() => {});
    }

    // Kirim welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(() => {});

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
