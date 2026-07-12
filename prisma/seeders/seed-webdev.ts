import { PrismaClient, User } from "@prisma/client";

import { web_l1 } from "../content/webdev/m1_l1.ts";
import { web_l2 } from "../content/webdev/m1_l2.ts";
import { web_l3 } from "../content/webdev/m2_l3.ts";
import { web_l3b } from "../content/webdev/m3_l3b.ts";
import { web_l4 } from "../content/webdev/m4_l4.ts";
import { web_l5 } from "../content/webdev/m5_l5.ts";
import { web_l6 } from "../content/webdev/m6_l6.ts";
import { web_l7 } from "../content/webdev/m9_l7.ts";
import { web_l8 } from "../content/webdev/m10_l8.ts";

export async function seedWebDev(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Fullstack Web Dev dengan Next.js 15 & Prisma",
      slug: "fullstack-nextjs-prisma",
      description:
        "Belajar membangun aplikasi web modern yang scalable menggunakan Next.js, Tailwind, dan Prisma ORM.",
      price: 249000,
      category: "Web Development",
      level: "advanced",
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  async function createSection(
    title: string,
    orderIndex: number,
    lessons: {
      title: string;
      slug: string;
      bodyText: string;
      isPreview?: boolean;
    }[],
  ) {
    const section = await prisma.section.create({
      data: { title, orderIndex, courseId: course.id },
    });
    await prisma.lesson.createMany({
      data: lessons.map((l, i) => ({
        title: l.title,
        slug: l.slug,
        contentType: "article",
        bodyText: l.bodyText,
        orderIndex: i + 1,
        sectionId: section.id,
        isPreview: l.isPreview ?? false,
      })),
    });
  }

  await createSection("Modul 1: Arsitektur Next.js 15", 1, [
    {
      title: "Pengenalan App Router",
      slug: "intro-app-router",
      bodyText: web_l1,
      isPreview: true,
    },
    {
      title: "Server vs Client Components",
      slug: "server-client-comp",
      bodyText: web_l2,
    },
  ]);

  await createSection("Modul 2: Styling & UI", 2, [
    {
      title: "Tailwind CSS v4 Oxide Engine",
      slug: "tailwind-v4",
      bodyText: web_l3,
    },
  ]);

  await createSection("Modul 3: React Fundamentals", 3, [
    {
      title: "React Components, State & Props",
      slug: "react-fundamentals-nextjs",
      bodyText: web_l3b,
    },
  ]);

  await createSection("Modul 4: Database & ORM", 4, [
    {
      title: "Setup Prisma 7 & PostgreSQL",
      slug: "prisma-setup",
      bodyText: web_l4,
    },
  ]);

  await createSection("Modul 5: Keamanan & Auth", 5, [
    { title: "Autentikasi JWT Manual", slug: "jwt-auth-web", bodyText: web_l5 },
  ]);

  await createSection("Modul 6: Interaksi Server", 6, [
    {
      title: "Server Actions & Form Handling",
      slug: "server-actions-web",
      bodyText: web_l6,
    },
  ]);

  await createSection("Modul 9: Monetisasi", 9, [
    {
      title: "Integrasi Midtrans Payment",
      slug: "midtrans-web",
      bodyText: web_l7,
    },
  ]);

  await createSection("Modul 10: Launching", 10, [
    {
      title: "Deployment ke Vercel",
      slug: "deployment-vercel",
      bodyText: web_l8,
    },
  ]);

  console.log("✅ WebDev course seeded");
  return course;
}
