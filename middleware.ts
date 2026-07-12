import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "rahasia-banget-123",
);

const PROTECTED_PATHS = ["/dashboard", "/profile", "/instructor"];
const AUTH_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Verifikasi token
  let payload = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, secret);
      payload = p;
    } catch {
      // Token expired atau invalid — hapus cookie dan redirect ke login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      // Hanya redirect jika sedang di halaman protected
      const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
      if (isProtected) return response;
      // Untuk halaman lain, lanjutkan tapi tanpa cookie
      const res = NextResponse.next();
      res.cookies.delete("auth-token");
      return res;
    }
  }

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Halaman protected tanpa login → redirect login
  if (isProtected && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi buka login/register → redirect dashboard
  if (isAuthPath && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
