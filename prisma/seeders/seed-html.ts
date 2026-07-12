import { PrismaClient, User } from "@prisma/client";

import { html_l1 } from "../content/html/m1_l1.ts";
import { html_l2 } from "../content/html/m1_l2.ts";
import { html_l3 } from "../content/html/m2_l3.ts";
import { html_l4 } from "../content/html/m2_l4.ts";
import { html_l5 } from "../content/html/m3_l5.ts";
import { html_l6 } from "../content/html/m3_l6.ts";
import { html_l7 } from "../content/html/m4_l7.ts";
import { html_l8 } from "../content/html/m4_l8.ts";

export async function seedHtml(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "HTML untuk Pemula: Bangun Website Pertamamu",
      slug: "html-pemula-website-pertama",
      description:
        "Pelajari HTML dari nol — pondasi semua website di dunia. Dari struktur dasar, tabel, form, multimedia, hingga semantic HTML dan HTML5 APIs. Tidak butuh pengalaman coding sama sekali!",
      price: 79000,
      category: "Web Development",
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

  await createSection("Modul 1: Pengenalan HTML", 1, [
    {
      title: "Apa itu HTML? — Pondasi Semua Website di Dunia",
      slug: "apa-itu-html",
      bodyText: html_l1,
      isPreview: true,
    },
    {
      title: "Teks, Link, Gambar & List",
      slug: "teks-link-gambar-list-html",
      bodyText: html_l2,
    },
  ]);

  await createSection("Modul 2: Tabel & Form", 2, [
    {
      title: "Tabel HTML — Sajikan Data dengan Rapi",
      slug: "tabel-html",
      bodyText: html_l3,
    },
    {
      title: "Form & Input — Terima Masukan Pengguna",
      slug: "form-input-html",
      bodyText: html_l4,
    },
  ]);

  await createSection("Modul 3: Semantic HTML & Proyek", 3, [
    {
      title: "Semantic HTML — HTML yang Lebih Pintar untuk SEO",
      slug: "semantic-html",
      bodyText: html_l5,
    },
    {
      title: "Proyek: Halaman Profil Personal Lengkap",
      slug: "proyek-profil-html",
      bodyText: html_l6,
    },
  ]);

  await createSection("Modul 4: Multimedia & HTML5 Modern", 4, [
    {
      title: "Video, Audio, Maps & Embed Konten",
      slug: "multimedia-video-audio-html",
      bodyText: html_l7,
    },
    {
      title: "HTML5 APIs & Accessibility",
      slug: "html5-apis-accessibility",
      bodyText: html_l8,
    },
  ]);

  console.log("✅ HTML course seeded");
  return course;
}
