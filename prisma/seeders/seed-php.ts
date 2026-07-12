import { PrismaClient, User } from "@prisma/client";

import { php_l1 } from "../content/php/m1_l1.ts";
import { php_l2 } from "../content/php/m1_l2.ts";
import { php_l3 } from "../content/php/m2_l3.ts";
import { php_l4 } from "../content/php/m2_l4.ts";
import { php_l5 } from "../content/php/m3_l5.ts";
import { php_l6 } from "../content/php/m3_l6.ts";
import { php_l7 } from "../content/php/m4_l7.ts";
import { php_l8 } from "../content/php/m4_l8.ts";

export async function seedPhp(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "PHP: Bahasa di Balik 77% Website Dunia",
      slug: "php-bahasa-website-dunia",
      description:
        "Pelajari PHP dari dasar hingga OOP, PDO, keamanan web, dan REST API. Fondasi wajib sebelum belajar Laravel. Cocok untuk pemula yang ingin membangun web dinamis.",
      price: 109000,
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

  await createSection("Modul 1: Dasar PHP", 1, [
    {
      title: "Apa itu PHP? — Bahasa di Balik Jutaan Website",
      slug: "apa-itu-php",
      bodyText: php_l1,
      isPreview: true,
    },
    {
      title: "String & Array — Dua Senjata Utama PHP",
      slug: "string-array-php",
      bodyText: php_l2,
    },
  ]);

  await createSection("Modul 2: Kontrol Alur & OOP", 2, [
    {
      title: "Kondisi, Loop & Fungsi — Kontrol Alur PHP",
      slug: "kondisi-loop-fungsi-php",
      bodyText: php_l3,
    },
    {
      title: "OOP di PHP — Class, Object & Inheritance",
      slug: "oop-php",
      bodyText: php_l4,
    },
  ]);

  await createSection("Modul 3: Database & Keamanan", 3, [
    {
      title: "Database MySQL & PDO — PHP Ngobrol dengan Database",
      slug: "database-pdo-php",
      bodyText: php_l5,
    },
    {
      title: "Form, Validasi & Keamanan Web",
      slug: "form-validasi-keamanan-php",
      bodyText: php_l6,
    },
  ]);

  await createSection("Modul 4: API, Composer & Proyek Akhir", 4, [
    {
      title: "Session, Autentikasi & REST API",
      slug: "session-auth-rest-api-php",
      bodyText: php_l7,
    },
    {
      title: "Composer, PHP 8 Modern & Proyek Blog Mini",
      slug: "composer-php8-proyek-akhir",
      bodyText: php_l8,
    },
  ]);

  console.log("✅ PHP course seeded");
  return course;
}
