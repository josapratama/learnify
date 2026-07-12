import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json(
      {
        message: 'Login berhasil',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
