import { PrismaClient, User } from "@prisma/client";

import { docker_l1 } from "../content/docker/m1_l1.ts";
import { docker_l2 } from "../content/docker/m1_l2.ts";
import { docker_l3 } from "../content/docker/m2_l3.ts";
import { docker_l4 } from "../content/docker/m2_l4.ts";
import { docker_l5 } from "../content/docker/m3_l5.ts";
import { docker_l6 } from "../content/docker/m3_l6.ts";
import { docker_l7 } from "../content/docker/m4_l7.ts";
import { docker_l8 } from "../content/docker/m4_l8.ts";

export async function seedDocker(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Docker: Kontainerisasi Aplikasi Modern",
      slug: "docker-kontainerisasi-aplikasi",
      description:
        "Dari konsep dasar hingga orchestration dengan Swarm dan Kubernetes. Pelajari Docker untuk deploy aplikasi yang konsisten, aman, dan scalable di mana saja.",
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

  await createSection("Modul 1: Dasar Docker", 1, [
    {
      title: "Apa itu Docker? — Solusi untuk Works on My Machine",
      slug: "apa-itu-docker",
      bodyText: docker_l1,
      isPreview: true,
    },
    {
      title: "Network, Best Practices & CI/CD Dasar",
      slug: "docker-network-cicd",
      bodyText: docker_l2,
    },
  ]);

  await createSection("Modul 2: Dockerfile Lanjutan & Compose", 2, [
    {
      title: "Dockerfile Lebih Dalam — Layer Cache & Multi-Stage",
      slug: "dockerfile-lanjutan",
      bodyText: docker_l3,
    },
    {
      title: "Docker Compose — Multi Container Stack",
      slug: "docker-compose-multi-container",
      bodyText: docker_l4,
    },
  ]);

  await createSection("Modul 3: Production & Proyek", 3, [
    {
      title: "Deploy ke Server — Docker di Production",
      slug: "docker-deploy-production",
      bodyText: docker_l5,
    },
    {
      title: "Praktik: Bangun Full-Stack App dengan Docker",
      slug: "docker-project-fullstack",
      bodyText: docker_l6,
    },
  ]);

  await createSection("Modul 4: Orchestration & Security", 4, [
    {
      title: "Docker Swarm & Kubernetes — Skala ke Level Berikutnya",
      slug: "docker-swarm-kubernetes",
      bodyText: docker_l7,
    },
    {
      title: "Docker Security & Production Hardening",
      slug: "docker-security-hardening",
      bodyText: docker_l8,
    },
  ]);

  console.log("✅ Docker course seeded");
  return course;
}
