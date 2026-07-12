import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import prisma from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  return {
    id: payload.userId as string,
    email: payload.email as string,
    role: payload.role as string,
  };
}

/**
 * Ambil user dari cookie DAN validasi masih ada di DB.
 * Gunakan di route yang melakukan operasi dengan userId sebagai FK.
 * Return null jika token invalid ATAU user tidak ada di DB.
 */
export async function requireValidUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  const userId = payload.userId as string;

  // Validasi user masih ada di database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, fullName: true },
  });

  return user; // null jika tidak ada
}
