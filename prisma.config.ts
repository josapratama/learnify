import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://myuser:mypassword@localhost:5432/edutech",
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
