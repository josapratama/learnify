import { PrismaClient, User } from "@prisma/client";

import { sql_l1 } from "../content/sql/m1_l1.ts";
import { sql_l2 } from "../content/sql/m1_l2.ts";
import { sql_l3 } from "../content/sql/m2_l3.ts";
import { sql_l4 } from "../content/sql/m2_l4.ts";
import { sql_l5 } from "../content/sql/m3_l5.ts";
import { sql_l6 } from "../content/sql/m3_l6.ts";
import { sql_l7 } from "../content/sql/m4_l7.ts";
import { sql_l8 } from "../content/sql/m4_l8.ts";
import { sql_l9 } from "../content/sql/m5_l9.ts";
import { sql_l10 } from "../content/sql/m5_l10.ts";

export async function seedSQL(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "SQL & Database: Dari Nol Sampai Mahir",
      slug: "sql-database-nol-sampai-mahir",
      description:
        "Kuasai SQL dan desain database dari dasar hingga query kompleks. Dengan contoh toko online yang nyata dan relevan.",
      price: 149000,
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

  await createSection("Modul 1: Pengenalan Database", 1, [
    {
      title: "Apa itu Database?",
      slug: "apa-itu-database",
      bodyText: sql_l1,
      isPreview: true,
    },
    {
      title: "Setup & Buat Tabel Pertama",
      slug: "setup-database-sql",
      bodyText: sql_l2,
    },
  ]);

  await createSection("Modul 2: Operasi Data Dasar", 2, [
    { title: "SELECT — Mengambil Data", slug: "select-sql", bodyText: sql_l3 },
    {
      title: "INSERT, UPDATE, DELETE",
      slug: "insert-update-delete-sql",
      bodyText: sql_l4,
    },
  ]);

  await createSection("Modul 3: Relasi & Agregasi", 3, [
    { title: "Relasi Tabel & JOIN", slug: "join-sql", bodyText: sql_l5 },
    {
      title: "Agregasi & GROUP BY",
      slug: "agregasi-group-by-sql",
      bodyText: sql_l6,
    },
  ]);

  await createSection("Modul 4: Query Lanjutan", 4, [
    { title: "Subquery & View", slug: "subquery-view-sql", bodyText: sql_l7 },
    {
      title: "Index & Optimasi Performa",
      slug: "index-optimasi-sql",
      bodyText: sql_l8,
    },
  ]);

  await createSection("Modul 5: Expert SQL", 5, [
    {
      title: "Fungsi Lanjutan & Window Functions",
      slug: "fungsi-window-sql",
      bodyText: sql_l9,
    },
    {
      title: "Desain Database & Best Practices",
      slug: "desain-database-best-practices",
      bodyText: sql_l10,
    },
  ]);

  console.log("✅ SQL course seeded");
  return course;
}
