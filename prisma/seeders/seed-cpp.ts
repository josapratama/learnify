import { PrismaClient, User } from "@prisma/client";

import { cpp_l1 } from "../content/cpp/m1_l1.ts";
import { cpp_l2 } from "../content/cpp/m1_l2.ts";
import { cpp_l3 } from "../content/cpp/m2_l3.ts";
import { cpp_l4 } from "../content/cpp/m2_l4.ts";
import { cpp_l5 } from "../content/cpp/m3_l5.ts";
import { cpp_l6 } from "../content/cpp/m3_l6.ts";
import { cpp_l7 } from "../content/cpp/m4_l7.ts";
import { cpp_l8 } from "../content/cpp/m4_l8.ts";
import { cpp_l9 } from "../content/cpp/m5_l9.ts";
import { cpp_l10 } from "../content/cpp/m5_l10.ts";

export async function seedCpp(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "C++ untuk Pemula: Dari Nol ke Aplikasi Nyata",
      slug: "cpp-pemula-nol-ke-aplikasi",
      description:
        "Pelajari C++ dari dasar hingga OOP, STL, pointer, dan template. Bahasa yang dipakai di game, sistem operasi, dan embedded systems. Cocok untuk pemula yang ingin memahami cara kerja komputer dari level dalam.",
      price: 129000,
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

  await createSection("Modul 1: Fondasi C++", 1, [
    {
      title: "Apa itu C++? — Bahasa di Balik Game dan OS",
      slug: "apa-itu-cpp",
      bodyText: cpp_l1,
      isPreview: true,
    },
    {
      title: "Variabel, Tipe Data & Input Output",
      slug: "variabel-tipe-data-cpp",
      bodyText: cpp_l2,
    },
  ]);

  await createSection("Modul 2: Kontrol Alur & Fungsi", 2, [
    {
      title: "Kondisi, Loop dan Array di C++",
      slug: "loop-array-cpp",
      bodyText: cpp_l3,
    },
    {
      title: "Fungsi — Tulis Sekali, Pakai Berkali-kali",
      slug: "fungsi-cpp",
      bodyText: cpp_l4,
    },
  ]);

  await createSection("Modul 3: OOP — Berpikir Seperti Dunia Nyata", 3, [
    {
      title: "OOP di C++ — Class, Object & Inheritance",
      slug: "oop-class-object-cpp",
      bodyText: cpp_l5,
    },
    {
      title: "Proyek: Sistem Perpustakaan Mini dengan OOP",
      slug: "proyek-perpustakaan-cpp",
      bodyText: cpp_l6,
    },
  ]);

  await createSection("Modul 4: Pointer & STL", 4, [
    {
      title: "Pointer & Memory Management — Kunci Memahami Komputer",
      slug: "pointer-memory-cpp",
      bodyText: cpp_l7,
    },
    {
      title: "STL — Gudang Senjata Tersembunyi C++",
      slug: "stl-vector-map-cpp",
      bodyText: cpp_l8,
    },
  ]);

  await createSection("Modul 5: Fitur Lanjutan C++", 5, [
    {
      title: "File I/O & Exception Handling",
      slug: "file-io-exception-cpp",
      bodyText: cpp_l9,
    },
    {
      title: "Template & Lambda — Kode Modern C++",
      slug: "template-lambda-cpp",
      bodyText: cpp_l10,
    },
  ]);

  console.log("✅ C++ course seeded");
  return course;
}
