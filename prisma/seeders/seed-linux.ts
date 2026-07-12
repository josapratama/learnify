import { PrismaClient, User } from "@prisma/client";

import { linux_l1 } from "../content/linux/m1_l1.ts";
import { linux_l2 } from "../content/linux/m1_l2.ts";
import { linux_l3 } from "../content/linux/m2_l3.ts";
import { linux_l4 } from "../content/linux/m2_l4.ts";
import { linux_l5 } from "../content/linux/m3_l5.ts";
import { linux_l6 } from "../content/linux/m3_l6.ts";
import { linux_l7 } from "../content/linux/m4_l7.ts";
import { linux_l8 } from "../content/linux/m4_l8.ts";
import { linux_l9 } from "../content/linux/m5_l9.ts";
import { linux_l10 } from "../content/linux/m5_l10.ts";

export async function seedLinux(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Linux untuk Semua: Terminal, Server & DevOps",
      slug: "linux-terminal-server-devops",
      description:
        "Dari tidak kenal terminal hingga mengelola server production. Kursus Linux terlengkap dalam bahasa Indonesia.",
      price: 179000,
      category: "Fundamental",
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

  await createSection("Modul 1: Mengenal Linux", 1, [
    {
      title: "Apa itu Linux?",
      slug: "apa-itu-linux",
      bodyText: linux_l1,
      isPreview: true,
    },
    {
      title: "Instalasi & Terminal Pertama",
      slug: "install-ubuntu-terminal",
      bodyText: linux_l2,
    },
  ]);

  await createSection("Modul 2: Manajemen File", 2, [
    {
      title: "Manajemen File & Folder",
      slug: "manajemen-file-linux",
      bodyText: linux_l3,
    },
    {
      title: "Text Editor & Manipulasi Teks",
      slug: "text-editor-linux",
      bodyText: linux_l4,
    },
  ]);

  await createSection("Modul 3: Software & Sistem", 3, [
    {
      title: "Manajemen Paket & Software",
      slug: "package-manager-linux",
      bodyText: linux_l5,
    },
    {
      title: "Proses & Manajemen Sistem",
      slug: "proses-sistem-linux",
      bodyText: linux_l6,
    },
  ]);

  await createSection("Modul 4: Jaringan & Otomasi", 4, [
    { title: "Jaringan di Linux", slug: "jaringan-linux", bodyText: linux_l7 },
    {
      title: "Shell Scripting",
      slug: "shell-scripting-linux",
      bodyText: linux_l8,
    },
  ]);

  await createSection("Modul 5: Server & Keamanan", 5, [
    {
      title: "Linux untuk Server & DevOps",
      slug: "linux-server-devops",
      bodyText: linux_l9,
    },
    {
      title: "Keamanan & Administrasi Lanjutan",
      slug: "linux-security-admin",
      bodyText: linux_l10,
    },
  ]);

  console.log("✅ Linux course seeded");
  return course;
}
