import { PrismaClient, User } from "@prisma/client";

import { cyber_l1 } from "../content/cybersecurity/m1_l1.ts";
import { cyber_l2 } from "../content/cybersecurity/m1_l2.ts";
import { cyber_l3 } from "../content/cybersecurity/m2_l3.ts";
import { cyber_l4 } from "../content/cybersecurity/m2_l4.ts";
import { cyber_l5 } from "../content/cybersecurity/m3_l5.ts";
import { cyber_l6 } from "../content/cybersecurity/m3_l6.ts";
import { cyber_l7 } from "../content/cybersecurity/m4_l7.ts";
import { cyber_l8 } from "../content/cybersecurity/m4_l8.ts";
import { cyber_l9 } from "../content/cybersecurity/m5_l9.ts";
import { cyber_l10 } from "../content/cybersecurity/m5_l10.ts";

export async function seedCybersecurity(
  prisma: PrismaClient,
  instructor: User,
) {
  const course = await prisma.course.create({
    data: {
      title: "Keamanan Siber: Lindungi Diri & Bisnis Anda di Era Digital",
      slug: "keamanan-siber-digital",
      description:
        "Dari password kuat hingga ethical hacking. Kursus cybersecurity lengkap untuk semua kalangan — non-IT maupun profesional IT.",
      price: 129000,
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

  await createSection("Modul 1: Fondasi Keamanan Digital", 1, [
    {
      title: "Pengantar Keamanan Siber",
      slug: "pengantar-keamanan-siber",
      bodyText: cyber_l1,
      isPreview: true,
    },
    {
      title: "Password & Autentikasi Kuat",
      slug: "password-autentikasi-kuat",
      bodyText: cyber_l2,
    },
  ]);

  await createSection("Modul 2: Ancaman Umum & Pencegahan", 2, [
    {
      title: "Phishing & Social Engineering",
      slug: "phishing-social-engineering",
      bodyText: cyber_l3,
    },
    {
      title: "Keamanan Jaringan & WiFi",
      slug: "keamanan-jaringan-wifi",
      bodyText: cyber_l4,
    },
  ]);

  await createSection("Modul 3: Malware & Privasi", 3, [
    {
      title: "Malware, Virus & Ransomware",
      slug: "malware-virus-ransomware",
      bodyText: cyber_l5,
    },
    {
      title: "Privasi Digital & Perlindungan Data",
      slug: "privasi-digital-data",
      bodyText: cyber_l6,
    },
  ]);

  await createSection("Modul 4: Keamanan Tingkat Lanjut", 4, [
    {
      title: "Secure Coding untuk Developer",
      slug: "secure-coding-developer",
      bodyText: cyber_l7,
    },
    {
      title: "Keamanan Perusahaan & Incident Response",
      slug: "keamanan-perusahaan-incident-response",
      bodyText: cyber_l8,
    },
  ]);

  await createSection("Modul 5: Ethical Hacking & Karir", 5, [
    {
      title: "Ethical Hacking & Bug Bounty",
      slug: "ethical-hacking-bug-bounty",
      bodyText: cyber_l9,
    },
    {
      title: "Checklist Keamanan & Kesimpulan",
      slug: "checklist-keamanan-kesimpulan",
      bodyText: cyber_l10,
    },
  ]);

  console.log("✅ Cybersecurity course seeded");
  return course;
}
