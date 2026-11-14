import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireValidUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireValidUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Semua kolom kata sandi wajib diisi." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal harus 6 karakter." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Konfirmasi kata sandi baru tidak cocok." },
        { status: 400 },
      );
    }

    // Ambil user dan hash password saat ini
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan." },
        { status: 404 },
      );
    }

    // Verifikasi kata sandi saat ini
    const isCurrentValid = await bcrypt.compare(
      currentPassword,
      dbUser.password,
    );
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Kata sandi saat ini yang Anda masukkan salah." },
        { status: 400 },
      );
    }

    // Enkripsi kata sandi baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Kata sandi berhasil diperbarui dengan aman.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat mengubah kata sandi." },
      { status: 500 },
    );
  }
}
