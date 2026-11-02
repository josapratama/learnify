import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { seedUsers } from "./seeders/seed-users.ts";
import { seedIoT } from "./seeders/seed-iot.ts";
import { seedPython } from "./seeders/seed-python.ts";
import { seedWebDev } from "./seeders/seed-webdev.ts";
import { seedGit } from "./seeders/seed-git.ts";
import { seedLinux } from "./seeders/seed-linux.ts";
import { seedSQL } from "./seeders/seed-sql.ts";
import { seedCybersecurity } from "./seeders/seed-cybersecurity.ts";
import { seedJavaScript } from "./seeders/seed-javascript.ts";
import { seedTypeScript } from "./seeders/seed-typescript.ts";
import { seedDocker } from "./seeders/seed-docker.ts";
import { seedAlgoritma } from "./seeders/seed-algoritma.ts";
import { seedCpp } from "./seeders/seed-cpp.ts";
import { seedHtml } from "./seeders/seed-html.ts";
import { seedCss } from "./seeders/seed-css.ts";
import { seedLaravel } from "./seeders/seed-laravel.ts";
import { seedPhp } from "./seeders/seed-php.ts";
import { seedLearningPaths } from "./seeders/seed-learning-paths.ts";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://myuser:mypassword@localhost:5432/edutech",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Cleaning existing data...");
  await prisma.quizAttempt.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.discussionLike.deleteMany({});
  await prisma.discussion.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.learningPathCourse.deleteMany({});
  await prisma.learningPath.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.referral.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Starting seed...");

  const { instructor1, instructor2, instructor3 } = await seedUsers(prisma);

  // Kursus awal
  await seedIoT(prisma, instructor1);
  await seedWebDev(prisma, instructor1);
  await seedPython(prisma, instructor2);

  // Kursus tambahan
  await seedGit(prisma, instructor1);
  await seedLinux(prisma, instructor2);
  await seedSQL(prisma, instructor1);
  await seedCybersecurity(prisma, instructor2);

  // Kursus baru
  await seedJavaScript(prisma, instructor3);
  await seedTypeScript(prisma, instructor3);
  await seedDocker(prisma, instructor1);
  await seedAlgoritma(prisma, instructor2);

  // Kursus tambahan baru
  await seedCpp(prisma, instructor3);
  await seedHtml(prisma, instructor1);
  await seedCss(prisma, instructor1);
  await seedLaravel(prisma, instructor2);
  await seedPhp(prisma, instructor3);

  // Seed learning paths (setelah semua kursus dibuat)
  await seedLearningPaths(prisma);

  console.log("🎉 Seed completed successfully!");
  console.log("📊 Total: 16 kursus, 6 learning paths, 3 instructor");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
