import { PrismaClient, User } from "@prisma/client";

import { laravel_l1 } from "../content/laravel/m1_l1.ts";
import { laravel_l2 } from "../content/laravel/m1_l2.ts";
import { laravel_l3 } from "../content/laravel/m2_l3.ts";
import { laravel_l4 } from "../content/laravel/m2_l4.ts";
import { laravel_l5 } from "../content/laravel/m3_l5.ts";
import { laravel_l6 } from "../content/laravel/m3_l6.ts";
import { laravel_l7 } from "../content/laravel/m4_l7.ts";
import { laravel_l8 } from "../content/laravel/m4_l8.ts";
import { laravel_l9 } from "../content/laravel/m5_l9.ts";
import { laravel_l10 } from "../content/laravel/m5_l10.ts";

export async function seedLaravel(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Laravel: Bangun Web App PHP yang Profesional",
      slug: "laravel-web-app-php-profesional",
      description:
        "Framework PHP paling populer di dunia. Dari routing dan Eloquent ORM hingga testing, authentication, API dengan Sanctum, queue, storage, dan deploy production. Lengkap dengan proyek toko online nyata.",
      price: 149000,
      category: "Web Development",
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

  await createSection("Modul 1: Fondasi Laravel", 1, [
    {
      title: "Apa itu Laravel? — Framework PHP yang Bikin Produktif 10x",
      slug: "apa-itu-laravel",
      bodyText: laravel_l1,
      isPreview: true,
    },
    {
      title: "Database & Eloquent ORM",
      slug: "database-eloquent-laravel",
      bodyText: laravel_l2,
    },
  ]);

  await createSection("Modul 2: Form, Validasi & Auth", 2, [
    {
      title: "Form, Validasi & Authentication dengan Breeze",
      slug: "form-validasi-auth-laravel",
      bodyText: laravel_l3,
    },
    {
      title: "API, Blade Components, Cache & Best Practices",
      slug: "api-components-laravel",
      bodyText: laravel_l4,
    },
  ]);

  await createSection("Modul 3: Relasi Lanjutan & Proyek", 3, [
    {
      title: "Relationships Lanjutan & Query Builder Pro",
      slug: "relationships-query-builder-laravel",
      bodyText: laravel_l5,
    },
    {
      title: "Proyek: Toko Online Mini yang Lengkap",
      slug: "proyek-toko-online-laravel",
      bodyText: laravel_l6,
    },
  ]);

  await createSection("Modul 4: Middleware, Authorization & Testing", 4, [
    {
      title: "Middleware, Gates & Policies — Siapa Boleh Akses Apa?",
      slug: "middleware-gates-policies-laravel",
      bodyText: laravel_l7,
    },
    {
      title: "Testing di Laravel — Buktikan Kode Kamu Benar",
      slug: "testing-laravel",
      bodyText: laravel_l8,
    },
  ]);

  await createSection("Modul 5: Production Features & Deploy", 5, [
    {
      title: "Storage, Notifications & Queue Jobs",
      slug: "storage-notification-queue-laravel",
      bodyText: laravel_l9,
    },
    {
      title: "API Auth dengan Sanctum & Deploy ke Production",
      slug: "sanctum-deploy-laravel",
      bodyText: laravel_l10,
    },
  ]);

  console.log("✅ Laravel course seeded");
  return course;
}
