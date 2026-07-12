import { PrismaClient, User } from "@prisma/client";

import { css_l1 } from "../content/css/m1_l1.ts";
import { css_l2 } from "../content/css/m1_l2.ts";
import { css_l3 } from "../content/css/m2_l3.ts";
import { css_l4 } from "../content/css/m2_l4.ts";
import { css_l5 } from "../content/css/m3_l5.ts";
import { css_l6 } from "../content/css/m3_l6.ts";
import { css_l7 } from "../content/css/m4_l7.ts";
import { css_l8 } from "../content/css/m4_l8.ts";

export async function seedCss(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "CSS Modern: Dari Polos ke Website yang Indah",
      slug: "css-modern-website-indah",
      description:
        "Kuasai CSS dari dasar hingga Flexbox, Grid, animasi, position, transform, filter, dan responsive design. Buat website yang tampil bagus di HP, tablet, dan desktop — lengkap dengan dark mode dan efek visual premium!",
      price: 89000,
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

  await createSection("Modul 1: Fondasi CSS", 1, [
    {
      title: "Apa itu CSS? — Sulap Website Polos Jadi Cantik",
      slug: "apa-itu-css",
      bodyText: css_l1,
      isPreview: true,
    },
    {
      title: "Box Model & Typography",
      slug: "box-model-typography-css",
      bodyText: css_l2,
    },
  ]);

  await createSection("Modul 2: Layout Modern", 2, [
    {
      title: "Flexbox — Susun Layout Seperti Main Lego",
      slug: "flexbox-css",
      bodyText: css_l3,
    },
    {
      title: "CSS Grid & Responsive Design",
      slug: "css-grid-responsive",
      bodyText: css_l4,
    },
  ]);

  await createSection("Modul 3: CSS Lanjutan & Proyek", 3, [
    {
      title: "Animasi, Variables & Pseudo-Elements",
      slug: "animasi-variables-css",
      bodyText: css_l5,
    },
    {
      title: "Proyek: Halaman Profil dengan Dark Mode",
      slug: "proyek-profil-dark-mode-css",
      bodyText: css_l6,
    },
  ]);

  await createSection("Modul 4: Efek Visual & UI Premium", 4, [
    {
      title: "Position & Z-Index — Susun Elemen di Mana Saja",
      slug: "position-zindex-css",
      bodyText: css_l7,
    },
    {
      title: "Transform & Filter — Efek Visual Premium",
      slug: "transform-filter-css",
      bodyText: css_l8,
    },
  ]);

  console.log("✅ CSS course seeded");
  return course;
}
