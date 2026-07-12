export const web_l5 = `
# Sistem Autentikasi JWT Manual di Next.js

Hampir semua aplikasi web butuh autentikasi — cara untuk tahu "siapa yang sedang menggunakan aplikasi ini?" dan "apakah mereka punya izin untuk ini?"

Kita akan implementasi autentikasi dengan **JWT (JSON Web Token)** — standar industri yang digunakan oleh jutaan aplikasi. Kodenya dari nol, tanpa magic library yang menyembunyikan detail penting.

---

## 🏗️ Cara Kerjanya

\`\`\`
1. User isi form login → POST /api/auth/login
2. Server verifikasi email + password di database
3. Server buat JWT token (berisi info user, ditandatangani dengan secret key)
4. Token disimpan di httpOnly cookie (tidak bisa diakses JavaScript)
5. Setiap request berikutnya, cookie otomatis terkirim
6. Middleware verifikasi token di setiap halaman yang perlu login
\`\`\`

---

## 📦 Library yang Digunakan

\`\`\`bash
npm install jose bcryptjs
npm install -D @types/bcryptjs
\`\`\`

- **\`jose\`** — Library JWT modern, ringan, berjalan di Edge Runtime
- **\`bcryptjs\`** — Hash password yang aman (pure JS)

---

## 🔑 Setup JWT Helper

\`\`\`typescript
// src/lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET!   // Minimal 32 karakter acak yang kuat
);

export interface JWTPayload {
  userId   : string;
  email    : string;
  role     : string;
  fullName : string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")     // Token berlaku 7 hari
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as JWTPayload;
  } catch {
    return null;   // Token invalid atau kadaluarsa
  }
}
\`\`\`

---

## 🔒 Password Hashing

\`\`\`typescript
// src/lib/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;   // Lebih tinggi = lebih aman, tapi lebih lambat

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password minimal 8 karakter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password harus mengandung huruf kapital";
  }
  if (!/[0-9]/.test(password)) {
    return "Password harus mengandung angka";
  }
  return null;  // null = valid
}
\`\`\`

---

## 📨 API Route: Register

\`\`\`typescript
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    // Validasi input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validasi password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password & simpan user
    const hashedPwd = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email    : email.toLowerCase(),
        password : hashedPwd,
        fullName : fullName.trim(),
        role     : "student",
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    // Buat JWT token
    const token = await signToken({
      userId   : user.id,
      email    : user.email,
      role     : user.role,
      fullName : user.fullName,
    });

    // Set httpOnly cookie — AMAN dari XSS!
    const response = NextResponse.json(
      { message: "Registrasi berhasil!", user },
      { status: 201 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly : true,          // Tidak bisa diakses JavaScript di browser!
      secure   : process.env.NODE_ENV === "production",  // HTTPS only di production
      sameSite : "lax",         // Proteksi CSRF
      maxAge   : 7 * 24 * 3600, // 7 hari dalam detik
      path     : "/",
    });

    return response;

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
\`\`\`

---

## 🔑 API Route: Login

\`\`\`typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Pesan error generik — jangan beritahu apakah email ada atau tidak
    const errorMsg = "Email atau password salah";

    if (!user) {
      // Tetap jalankan bcrypt untuk hindari timing attack
      await comparePassword(password, "$2a$12$dummy_hash_to_prevent_timing_attack");
      return NextResponse.json({ error: errorMsg }, { status: 401 });
    }

    // Verifikasi password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: errorMsg }, { status: 401 });
    }

    // Generate token
    const token = await signToken({
      userId   : user.id,
      email    : user.email,
      role     : user.role,
      fullName : user.fullName,
    });

    const response = NextResponse.json({
      message  : "Login berhasil!",
      user     : {
        id      : user.id,
        email   : user.email,
        fullName: user.fullName,
        role    : user.role,
        avatar  : user.avatar,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly : true,
      secure   : process.env.NODE_ENV === "production",
      sameSite : "lax",
      maxAge   : 7 * 24 * 3600,
      path     : "/",
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Kesalahan server" }, { status: 500 });
  }
}
\`\`\`

---

## 🛡️ Middleware — Proteksi Route

\`\`\`typescript
// middleware.ts (di ROOT folder proyek, bukan src/)
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Halaman yang memerlukan login
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/courses/learn"];

// Halaman yang hanya untuk tamu (tidak login)
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  // Verifikasi token
  const user = token ? await verifyToken(token) : null;

  // Halaman protected tanpa login → redirect ke login
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);  // Simpan tujuan asal
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi buka halaman auth → redirect ke dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Tambahkan info user ke header (opsional, untuk Server Components)
  const response = NextResponse.next();
  if (user) {
    response.headers.set("x-user-id",   user.userId);
    response.headers.set("x-user-role", user.role);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
\`\`\`

---

## 👤 Helper: Ambil User dari Request

\`\`\`typescript
// src/lib/auth.ts
import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "./jwt";

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Penggunaan di Server Component:
// const user = await requireAuth();
\`\`\`

---

## 📝 Ringkasan

- JWT = token terenkripsi berisi informasi user, ditandatangani dengan secret key
- \`bcryptjs\` untuk hash password — JANGAN simpan password plain text!
- \`jose\` untuk generate dan verify JWT — berjalan di Edge Runtime
- Cookie \`httpOnly\` = tidak bisa diakses JavaScript — aman dari XSS
- \`secure: true\` di production — hanya lewat HTTPS
- Middleware Next.js untuk proteksi route secara global
- Pesan error login yang generik — jangan bocorkan apakah email ada

> **Di modul berikutnya, kita belajar Server Actions — cara baru yang lebih simpel untuk handle form!** ⚡
`;
