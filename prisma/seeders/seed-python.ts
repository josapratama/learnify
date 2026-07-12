import { PrismaClient, User } from "@prisma/client";

import { lesson1 } from "../content/python/m1_l1.ts";
import { lesson2 } from "../content/python/m1_l2.ts";
import { lesson3 } from "../content/python/m2_l3.ts";
import { lesson4 } from "../content/python/m2_l4.ts";
import { lesson5 } from "../content/python/m3_l5.ts";
import { lesson6 } from "../content/python/m3_l6.ts";
import { lesson7 } from "../content/python/m4_l7.ts";
import { lesson8 } from "../content/python/m4_l8.ts";
import { lesson9 } from "../content/python/m5_l9.ts";
import { lesson10 } from "../content/python/m5_l10.ts";
import { lesson11 } from "../content/python/m6_l11.ts";
import { lesson12 } from "../content/python/m6_l12.ts";
import { lesson13 } from "../content/python/m7_l13.ts";
import { lesson14 } from "../content/python/m7_l14.ts";
import { lesson15 } from "../content/python/m8_l15.ts";
import { lesson16 } from "../content/python/m8_l16.ts";
import { lesson17 } from "../content/python/m9_l17.ts";
import { lesson18 } from "../content/python/m9_l18.ts";
import { lesson19 } from "../content/python/m10_l19.ts";
import { lesson20 } from "../content/python/m10_l20.ts";
import { python_expert_l1 } from "../content/python/m11_l21.ts";
import { python_expert_l2 } from "../content/python/m12_l22.ts";

export async function seedPython(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Python Masterclass: Dari Nol Hingga Mahir",
      slug: "python-masterclass",
      description:
        "Kursus Python paling lengkap yang mencakup dasar-dasar hingga konsep lanjutan untuk membangun aplikasi nyata.",
      price: 149000,
      category: "Programming",
      level: "beginner",
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  // Helper: buat section + lessons artikel biasa
  async function createSection(
    title: string,
    orderIndex: number,
    lessons: {
      title: string;
      slug: string;
      bodyText: string;
      isPreview?: boolean;
      contentType?: string;
    }[],
  ) {
    const section = await prisma.section.create({
      data: { title, orderIndex, courseId: course.id },
    });
    await prisma.lesson.createMany({
      data: lessons.map((l, i) => ({
        title: l.title,
        slug: l.slug,
        contentType: l.contentType ?? "article",
        bodyText: l.bodyText,
        orderIndex: i + 1,
        sectionId: section.id,
        isPreview: l.isPreview ?? false,
      })),
    });
    return section;
  }

  await createSection("Modul 1: Pendahuluan", 1, [
    {
      title: "Apa itu Python?",
      slug: "apa-itu-python",
      bodyText: lesson1,
      isPreview: true,
    },
    {
      title: "Instalasi & Setup Lingkungan",
      slug: "instalasi-python",
      bodyText: lesson2,
    },
  ]);

  await createSection("Modul 2: Dasar-Dasar Python", 2, [
    {
      title: "Variabel & Tipe Data",
      slug: "variabel-python",
      bodyText: lesson3,
    },
    {
      title: "Operator Aritmatika & Logika",
      slug: "operator-python",
      bodyText: lesson4,
    },
  ]);

  await createSection("Modul 3: Struktur Kontrol", 3, [
    {
      title: "Percabangan (If, Else)",
      slug: "if-else-python",
      bodyText: lesson5,
    },
    {
      title: "Perulangan (For, While)",
      slug: "loop-python",
      bodyText: lesson6,
    },
  ]);

  await createSection("Modul 4: Struktur Data", 4, [
    { title: "List & Tuple", slug: "list-tuple-python", bodyText: lesson7 },
    { title: "Dictionary", slug: "dict-python", bodyText: lesson8 },
  ]);

  await createSection("Modul 5: Fungsi & Modul", 5, [
    {
      title: "Mendefinisikan Fungsi",
      slug: "fungsi-python",
      bodyText: lesson9,
    },
    {
      title: "Menggunakan Library Eksternal",
      slug: "library-python",
      bodyText: lesson10,
    },
  ]);

  await createSection("Modul 6: Object-Oriented Programming", 6, [
    {
      title: "Class & Object",
      slug: "class-object-python",
      bodyText: lesson11,
    },
    {
      title: "Inheritance & Enkapsulasi",
      slug: "inheritance-python",
      bodyText: lesson12,
    },
  ]);

  await createSection("Modul 7: File & Exception Handling", 7, [
    {
      title: "Membaca & Menulis File",
      slug: "file-handling-python",
      bodyText: lesson13,
    },
    {
      title: "Penanganan Error (Try-Except)",
      slug: "exception-handling-python",
      bodyText: lesson14,
    },
  ]);

  await createSection("Modul 8: Dasar Data Science", 8, [
    { title: "Dasar NumPy", slug: "numpy-python", bodyText: lesson15 },
    {
      title: "Manipulasi Data dengan Pandas",
      slug: "pandas-python",
      bodyText: lesson16,
    },
  ]);

  await createSection("Modul 9: Python untuk Web & API", 9, [
    {
      title: "Berinteraksi dengan API",
      slug: "api-python",
      bodyText: lesson17,
    },
    {
      title: "Membangun Web Backend (Teori)",
      slug: "backend-python",
      bodyText: lesson18,
    },
  ]);

  // Modul 10 — lesson quiz dibuat manual agar bisa attach quiz
  const sectionP10 = await prisma.section.create({
    data: {
      title: "Modul 10: Penutup & Proyek Akhir",
      orderIndex: 10,
      courseId: course.id,
    },
  });

  // lesson orderIndex 1 — artikel karir
  await prisma.lesson.create({
    data: {
      title: "Tips Karir & Langkah Selanjutnya",
      slug: "karir-python",
      contentType: "article",
      bodyText: lesson19,
      orderIndex: 1,
      sectionId: sectionP10.id,
    },
  });

  // lesson orderIndex 2 — proyek akhir + quiz
  const lessonFinal = await prisma.lesson.create({
    data: {
      title: "Panduan Proyek Akhir",
      slug: "proyek-akhir-python",
      contentType: "quiz",
      bodyText: lesson20,
      orderIndex: 2,
      sectionId: sectionP10.id,
    },
  });

  await prisma.quiz.createMany({
    data: [
      {
        question:
          "Manakah yang merupakan cara yang benar untuk mendefinisikan fungsi di Python?",
        options: [
          "func my_function():",
          "def my_function():",
          "function my_function():",
          "create my_function():",
        ],
        correctOption: 1,
        explanation:
          "Di Python, kata kunci 'def' digunakan untuk mendefinisikan sebuah fungsi.",
        lessonId: lessonFinal.id,
      },
      {
        question: "Apa output dari print(2 ** 3)?",
        options: ["6", "8", "9", "5"],
        correctOption: 1,
        explanation:
          "** adalah operator eksponen (pangkat) di Python. 2 pangkat 3 adalah 8.",
        lessonId: lessonFinal.id,
      },
    ],
  });

  await createSection("Modul 11: Advanced Python Concepts", 11, [
    {
      title: "Decorators & Wrappers",
      slug: "decorators-python",
      bodyText: python_expert_l1,
    },
  ]);

  await createSection("Modul 12: Asynchronous Programming", 12, [
    {
      title: "Asyncio & Await",
      slug: "asyncio-python",
      bodyText: python_expert_l2,
    },
  ]);

  console.log("✅ Python course seeded");
  return course;
}
