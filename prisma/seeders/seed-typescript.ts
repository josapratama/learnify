import { PrismaClient, User } from "@prisma/client";

import { ts_l1 } from "../content/typescript/m1_l1.ts";
import { ts_l2 } from "../content/typescript/m1_l2.ts";
import { ts_l3 } from "../content/typescript/m2_l3.ts";
import { ts_l4 } from "../content/typescript/m2_l4.ts";
import { ts_l5 } from "../content/typescript/m3_l5.ts";
import { ts_l6 } from "../content/typescript/m3_l6.ts";
import { ts_l7 } from "../content/typescript/m4_l7.ts";
import { ts_l8 } from "../content/typescript/m4_l8.ts";

export async function seedTypeScript(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "TypeScript: JavaScript dengan Superpower",
      slug: "typescript-javascript-superpower",
      description:
        "Pelajari TypeScript dari dasar hingga advanced patterns, conditional types, mapped types, decorators, dan dependency injection. Wajib untuk developer Next.js, React, dan Node.js modern.",
      price: 99000,
      category: "Programming",
      level: "intermediate",
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

  await createSection("Modul 1: Fondasi TypeScript", 1, [
    {
      title: "Apa itu TypeScript? — JavaScript yang Lebih Jujur",
      slug: "apa-itu-typescript",
      bodyText: ts_l1,
      isPreview: true,
    },
    {
      title: "Utility Types & Praktik Nyata",
      slug: "utility-types-typescript",
      bodyText: ts_l2,
    },
  ]);

  await createSection("Modul 2: Fungsi & OOP", 2, [
    {
      title: "Fungsi di TypeScript",
      slug: "fungsi-typescript",
      bodyText: ts_l3,
    },
    {
      title: "Class dan OOP di TypeScript",
      slug: "class-oop-typescript",
      bodyText: ts_l4,
    },
  ]);

  await createSection("Modul 3: TypeScript di React & Praktik Lanjutan", 3, [
    {
      title: "TypeScript di React & Next.js",
      slug: "typescript-react-nextjs",
      bodyText: ts_l5,
    },
    {
      title: "TypeScript Patterns & Tips Praktis",
      slug: "typescript-patterns-tips",
      bodyText: ts_l6,
    },
  ]);

  await createSection("Modul 4: Advanced Type System", 4, [
    {
      title: "Conditional Types & Mapped Types Lanjutan",
      slug: "conditional-mapped-types-typescript",
      bodyText: ts_l7,
    },
    {
      title: "Dekorator & Metadata — TypeScript Level Enterprise",
      slug: "dekorator-metadata-typescript",
      bodyText: ts_l8,
    },
  ]);

  console.log("✅ TypeScript course seeded");
  return course;
}
