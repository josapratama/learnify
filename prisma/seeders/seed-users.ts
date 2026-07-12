import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ─── Admin ───
  const admin = await prisma.user.create({
    data: {
      email: "admin@edutech.com",
      password: hashedPassword,
      fullName: "Admin EduTech",
      role: "admin",
      bio: "Administrator platform EduTech.",
    },
  });

  // ─── User / Student biasa ───
  const student = await prisma.user.create({
    data: {
      email: "student@edutech.com",
      password: hashedPassword,
      fullName: "Student Demo",
      role: "student",
      bio: "Siswa yang semangat belajar coding!",
    },
  });

  // ─── Instructor 1 ───
  const instructor1 = await prisma.user.create({
    data: {
      email: "pratama@edutech.com",
      password: hashedPassword,
      fullName: "Pratama Dev",
      role: "instructor",
      bio: "Senior Web Developer dengan 8 tahun pengalaman di industri.",
    },
  });

  // ─── Instructor 2 ───
  const instructor2 = await prisma.user.create({
    data: {
      email: "budi@edutech.com",
      password: hashedPassword,
      fullName: "Budi Santoso",
      role: "instructor",
      bio: "Data Engineer & Python Expert. Senang berbagi ilmu.",
    },
  });

  // ─── Instructor 3 ───
  const instructor3 = await prisma.user.create({
    data: {
      email: "siti@edutech.com",
      password: hashedPassword,
      fullName: "Siti Rahayu",
      role: "instructor",
      bio: "Frontend Developer & TypeScript enthusiast.",
    },
  });

  console.log("✅ Users seeded");
  console.log("   📧 admin@edutech.com     / password123 (admin)");
  console.log("   📧 student@edutech.com   / password123 (student)");
  console.log("   📧 pratama@edutech.com   / password123 (instructor)");
  console.log("   📧 budi@edutech.com      / password123 (instructor)");
  console.log("   📧 siti@edutech.com      / password123 (instructor)");

  return { admin, student, instructor1, instructor2, instructor3 };
}
