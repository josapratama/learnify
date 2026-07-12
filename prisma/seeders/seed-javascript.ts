import { PrismaClient, User } from "@prisma/client";

import { js_l1 } from "../content/javascript/m1_l1.ts";
import { js_l2 } from "../content/javascript/m1_l2.ts";
import { js_l3 } from "../content/javascript/m2_l3.ts";
import { js_l4 } from "../content/javascript/m2_l4.ts";
import { js_l5 } from "../content/javascript/m3_l5.ts";
import { js_l6 } from "../content/javascript/m3_l6.ts";
import { js_l7 } from "../content/javascript/m4_l7.ts";
import { js_l8 } from "../content/javascript/m5_l8.ts";
import { js_l9 } from "../content/javascript/m5_l9.ts";
import { js_l10 } from "../content/javascript/m6_l10.ts";
import { js_l11 } from "../content/javascript/m7_l11.ts";

export async function seedJavaScript(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "JavaScript Modern: Dari Nol ke Fullstack",
      slug: "javascript-modern-nol-ke-fullstack",
      description:
        "Kuasai JavaScript dari dasar hingga async programming, DOM manipulation, Node.js, testing, dan tooling modern. Fondasi wajib untuk semua web developer.",
      price: 119000,
      category: "Programming",
      level: "beginner",
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

  await createSection("Modul 1: Dasar JavaScript", 1, [
    {
      title: "Apa itu JavaScript?",
      slug: "apa-itu-javascript",
      bodyText: js_l1,
      isPreview: true,
    },
    {
      title: "Kontrol Alur — If, Switch, Loop",
      slug: "kontrol-alur-javascript",
      bodyText: js_l2,
    },
  ]);

  await createSection("Modul 2: Fungsi & Struktur Data", 2, [
    {
      title: "Fungsi & Closure",
      slug: "fungsi-closure-javascript",
      bodyText: js_l3,
    },
    {
      title: "Object & Array Mendalam",
      slug: "object-array-javascript",
      bodyText: js_l4,
    },
  ]);

  await createSection("Modul 3: Browser & DOM", 3, [
    {
      title: "DOM Manipulation",
      slug: "dom-manipulation-javascript",
      bodyText: js_l5,
    },
    {
      title: "Fetch API & Async JavaScript",
      slug: "fetch-api-async-javascript",
      bodyText: js_l6,
    },
  ]);

  await createSection("Modul 4: OOP & Module", 4, [
    {
      title: "OOP, Module & Error Handling",
      slug: "oop-module-javascript",
      bodyText: js_l7,
    },
  ]);

  await createSection("Modul 5: ES6+ & Async Lanjutan", 5, [
    {
      title: "ES6+ Modern — Destructuring, Spread, Optional Chaining",
      slug: "es6-modern-javascript",
      bodyText: js_l8,
    },
    {
      title: "Promise & Async Lanjutan — all, allSettled, race, retry",
      slug: "promise-async-lanjutan-javascript",
      bodyText: js_l9,
    },
  ]);

  await createSection("Modul 6: Node.js & Express", 6, [
    {
      title: "Node.js Dasar — JavaScript di Server",
      slug: "nodejs-dasar-javascript",
      bodyText: js_l10,
    },
  ]);

  await createSection("Modul 7: Testing & Tooling", 7, [
    {
      title: "Testing dengan Jest, ESLint, Prettier & Vite",
      slug: "testing-tooling-javascript",
      bodyText: js_l11,
    },
  ]);

  console.log("✅ JavaScript course seeded");
  return course;
}
