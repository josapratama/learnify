import { PrismaClient, User } from "@prisma/client";

import { git_l1 } from "../content/git/m1_l1.ts";
import { git_l2 } from "../content/git/m1_l2.ts";
import { git_l3 } from "../content/git/m2_l3.ts";
import { git_l4 } from "../content/git/m2_l4.ts";
import { git_l5 } from "../content/git/m3_l5.ts";
import { git_l6 } from "../content/git/m3_l6.ts";
import { git_l7 } from "../content/git/m4_l7.ts";
import { git_l8 } from "../content/git/m5_l8.ts";

export async function seedGit(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Git & GitHub: Version Control dari Nol hingga Pro",
      slug: "git-github-version-control",
      description:
        "Kuasai Git dan GitHub dari dasar hingga workflow profesional. Untuk developer, penulis, desainer — siapapun yang bekerja dengan file.",
      price: 99000,
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

  await createSection("Modul 1: Pengenalan Git", 1, [
    {
      title: "Apa itu Git?",
      slug: "apa-itu-git",
      bodyText: git_l1,
      isPreview: true,
    },
    { title: "Instalasi & Konfigurasi", slug: "install-git", bodyText: git_l2 },
  ]);

  await createSection("Modul 2: Dasar-Dasar Git", 2, [
    {
      title: "Repo & Commit Pertama",
      slug: "repo-commit-pertama",
      bodyText: git_l3,
    },
    {
      title: "Branching & Merging",
      slug: "branching-merging",
      bodyText: git_l4,
    },
  ]);

  await createSection("Modul 3: GitHub & Kolaborasi", 3, [
    {
      title: "GitHub & Remote Repository",
      slug: "github-remote",
      bodyText: git_l5,
    },
    {
      title: "Fork, Pull Request & Code Review",
      slug: "fork-pull-request",
      bodyText: git_l6,
    },
  ]);

  await createSection("Modul 4: Git Lanjutan", 4, [
    {
      title: "Rebase, Stash & Reset",
      slug: "git-advanced-techniques",
      bodyText: git_l7,
    },
  ]);

  await createSection("Modul 5: Workflow Profesional", 5, [
    {
      title: "Git Workflow & Best Practices",
      slug: "git-workflow-professional",
      bodyText: git_l8,
    },
  ]);

  console.log("✅ Git course seeded");
  return course;
}
