import { PrismaClient } from "@prisma/client";

export async function seedLearningPaths(prisma: PrismaClient) {
  // Hapus dulu
  await prisma.learningPathCourse.deleteMany({});
  await prisma.learningPath.deleteMany({});

  // Ambil semua kursus yang published
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, slug: true, title: true, category: true, level: true },
  });

  const findCourse = (slug: string) => courses.find((c) => c.slug === slug);

  const paths = [
    {
      title: "Jalur Web Developer",
      slug: "jalur-web-developer",
      description:
        "Dari nol hingga siap deploy aplikasi web modern menggunakan JavaScript, TypeScript, dan Next.js.",
      level: "beginner",
      color: "#3b82f6",
      orderIndex: 1,
      courseSlugs: [
        "javascript-modern-nol-ke-fullstack",
        "typescript-javascript-superpower",
        "fullstack-nextjs-prisma",
        "sql-database-nol-sampai-mahir",
        "docker-kontainerisasi-aplikasi",
        "git-github-version-control",
      ],
    },
    {
      title: "Jalur Python Developer",
      slug: "jalur-python-developer",
      description:
        "Kuasai Python dari dasar hingga Data Science dan Web Backend. Jalur paling serbaguna.",
      level: "beginner",
      color: "#10b981",
      orderIndex: 2,
      courseSlugs: [
        "python-masterclass",
        "algoritma-struktur-data-cs",
        "sql-database-nol-sampai-mahir",
        "git-github-version-control",
        "linux-terminal-server-devops",
      ],
    },
    {
      title: "Jalur IoT Engineer",
      slug: "jalur-iot-engineer",
      description:
        "Bangun sistem IoT nyata menggunakan ESP32, sensor, dan cloud platform.",
      level: "intermediate",
      color: "#f59e0b",
      orderIndex: 3,
      courseSlugs: [
        "mastering-iot-esp32",
        "python-masterclass",
        "linux-terminal-server-devops",
        "git-github-version-control",
      ],
    },
    {
      title: "Jalur DevOps & Cloud",
      slug: "jalur-devops-cloud",
      description:
        "Kuasai Linux, Docker, Git, dan keamanan sistem untuk karir di bidang DevOps.",
      level: "intermediate",
      color: "#8b5cf6",
      orderIndex: 4,
      courseSlugs: [
        "linux-terminal-server-devops",
        "git-github-version-control",
        "docker-kontainerisasi-aplikasi",
        "sql-database-nol-sampai-mahir",
        "keamanan-siber-digital",
      ],
    },
    {
      title: "Jalur Keamanan Siber",
      slug: "jalur-keamanan-siber",
      description:
        "Dari literasi digital dasar hingga ethical hacking dan penetration testing.",
      level: "beginner",
      color: "#ef4444",
      orderIndex: 5,
      courseSlugs: [
        "keamanan-siber-digital",
        "linux-terminal-server-devops",
        "sql-database-nol-sampai-mahir",
        "python-masterclass",
        "git-github-version-control",
      ],
    },
    {
      title: "Jalur Fundamental IT",
      slug: "jalur-fundamental-it",
      description:
        "Fondasi wajib untuk siapapun yang ingin masuk dunia teknologi. Cocok untuk pemula total.",
      level: "beginner",
      color: "#06b6d4",
      orderIndex: 6,
      courseSlugs: [
        "git-github-version-control",
        "linux-terminal-server-devops",
        "sql-database-nol-sampai-mahir",
        "keamanan-siber-digital",
        "algoritma-struktur-data-cs",
      ],
    },
  ];

  for (const pathData of paths) {
    const { courseSlugs, ...rest } = pathData;
    const path = await prisma.learningPath.create({ data: rest });

    let order = 1;
    for (const slug of courseSlugs) {
      const course = findCourse(slug);
      if (course) {
        await prisma.learningPathCourse.create({
          data: {
            learningPathId: path.id,
            courseId: course.id,
            orderIndex: order++,
          },
        });
      }
    }

    console.log(`✅ Learning path: ${path.title} (${order - 1} kursus)`);
  }

  console.log("✅ All learning paths seeded");
}
