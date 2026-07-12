import { PrismaClient, User } from "@prisma/client";

import { algo_l1 } from "../content/algoritma/m1_l1.ts";
import { algo_l2 } from "../content/algoritma/m1_l2.ts";
import { algo_l3 } from "../content/algoritma/m2_l3.ts";
import { algo_l4 } from "../content/algoritma/m2_l4.ts";
import { algo_l5 } from "../content/algoritma/m3_l5.ts";
import { algo_l6 } from "../content/algoritma/m3_l6.ts";
import { algo_l7 } from "../content/algoritma/m4_l7.ts";
import { algo_l8 } from "../content/algoritma/m4_l8.ts";

export async function seedAlgoritma(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Algoritma & Struktur Data: Fondasi Computer Science",
      slug: "algoritma-struktur-data-cs",
      description:
        "Kuasai algoritma sorting, searching, rekursi, dynamic programming, graph, greedy, dan backtracking. Persiapan interview teknis dan pemahaman mendalam tentang efisiensi kode.",
      price: 129000,
      category: "Programming",
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

  await createSection("Modul 1: Algoritma & Struktur Data Dasar", 1, [
    {
      title: "Algoritma & Kompleksitas (Big O Notation)",
      slug: "algoritma-big-o-notation",
      bodyText: algo_l1,
      isPreview: true,
    },
    {
      title: "Struktur Data: Array, Stack, Queue, Tree & Hash Table",
      slug: "struktur-data-lengkap",
      bodyText: algo_l2,
    },
  ]);

  await createSection("Modul 2: Rekursi & Dynamic Programming", 2, [
    {
      title: "Rekursi — Fungsi yang Memanggil Dirinya Sendiri",
      slug: "rekursi-algoritma",
      bodyText: algo_l3,
    },
    {
      title: "Dynamic Programming — Jangan Hitung Dua Kali",
      slug: "dynamic-programming",
      bodyText: algo_l4,
    },
  ]);

  await createSection("Modul 3: Graph & Interview Patterns", 3, [
    {
      title: "Graph, BFS, DFS, Dijkstra & Topological Sort",
      slug: "graph-bfs-dfs-dijkstra",
      bodyText: algo_l5,
    },
    {
      title: "Pola Soal Interview & Proyek LRU Cache",
      slug: "soal-interview-lru-cache",
      bodyText: algo_l6,
    },
  ]);

  await createSection("Modul 4: Greedy & Backtracking", 4, [
    {
      title: "Greedy Algorithm — Ambil yang Terbaik Sekarang",
      slug: "greedy-algorithm",
      bodyText: algo_l7,
    },
    {
      title: "Backtracking — Eksplorasi Semua Kemungkinan",
      slug: "backtracking-algorithm",
      bodyText: algo_l8,
    },
  ]);

  console.log("✅ Algoritma course seeded");
  return course;
}
