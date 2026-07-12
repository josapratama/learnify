export const web_l4 = `
# Setup Prisma 7 & PostgreSQL

Prisma adalah ORM (Object-Relational Mapper) yang sangat populer untuk Node.js dan TypeScript. Alih-alih nulis SQL langsung, kamu menulis kode TypeScript yang familiar — dan Prisma yang menerjemahkannya ke SQL.

Yang membuat Prisma istimewa adalah **type-safety penuh**: editor kamu akan autocomplete nama tabel, kolom, dan mendeteksi error sebelum kode dijalankan. Jauh lebih aman dari SQL string biasa.

---

## 🏗️ Arsitektur Prisma 7

\`\`\`
.
├── prisma/
│   ├── schema.prisma    ← Definisi model & koneksi DB
│   └── seed.ts          ← Data awal (opsional)
├── prisma.config.ts     ← Konfigurasi adapter Prisma 7
├── src/
│   └── lib/
│       └── prisma.ts    ← Instance Prisma client
└── .env                 ← Connection string (rahasia!)
\`\`\`

---

## ⚙️ Instalasi

\`\`\`bash
# Install Prisma CLI dan Client
npm install prisma @prisma/client

# Untuk PostgreSQL dengan adapter baru di Prisma 7
npm install @prisma/adapter-pg pg

# Inisialisasi Prisma
npx prisma init
\`\`\`

---

## 📋 schema.prisma — Definisi Model

\`\`\`prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  // Prisma 7 pakai output untuk type-safety yang lebih kuat
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// Model User
// ==========================================
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  fullName  String
  role      Role     @default(student)
  avatar    String?  // ? = opsional (nullable)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relasi
  enrollments  Enrollment[]
  reviews      Review[]
  courses      Course[]      @relation("InstructorCourses")
  
  @@map("users")  // Nama tabel di database
}

enum Role {
  student
  instructor
  admin
}

// ==========================================
// Model Course
// ==========================================
model Course {
  id          String  @id @default(cuid())
  title       String
  slug        String  @unique
  description String
  price       Int     // Simpan dalam sen/rupiah terkecil
  thumbnail   String?
  level       Level   @default(beginner)
  isPublished Boolean @default(false)
  category    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Foreign key
  instructorId String
  instructor   User     @relation("InstructorCourses", fields: [instructorId], references: [id])
  
  // Relasi satu ke banyak
  sections    Section[]
  enrollments Enrollment[]
  reviews     Review[]
  
  @@index([slug])       // Index untuk performa query
  @@index([category])
  @@map("courses")
}

enum Level {
  beginner
  intermediate
  advanced
}

// ==========================================
// Model Section & Lesson
// ==========================================
model Section {
  id         String   @id @default(cuid())
  title      String
  orderIndex Int
  courseId   String
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons    Lesson[]
  
  @@map("sections")
}

model Lesson {
  id          String      @id @default(cuid())
  title       String
  slug        String
  contentType ContentType @default(article)
  bodyText    String?     @db.Text  // Text panjang
  videoUrl    String?
  duration    Int?        // Durasi dalam detik
  orderIndex  Int
  isPreview   Boolean     @default(false)
  sectionId   String
  section     Section     @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  
  @@unique([sectionId, slug])
  @@map("lessons")
}

enum ContentType {
  article
  video
  quiz
}
\`\`\`

---

## 🔧 Konfigurasi Prisma 7 (prisma.config.ts)

\`\`\`typescript
// prisma.config.ts (di root folder)
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export default defineConfig({
  earlyAccess: true,
  datasource: {
    provider: "postgresql",
    url      : process.env.DATABASE_URL!,
  },
});
\`\`\`

---

## 🔌 Prisma Client — Singleton Pattern

\`\`\`typescript
// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Singleton: pastikan hanya ada satu instance di development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 10,              // Maksimal 10 koneksi bersamaan
    idleTimeoutMillis: 30000,
  });
  
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
\`\`\`

---

## 🚀 Operasi CRUD Dasar

\`\`\`typescript
import prisma from "@/lib/prisma";

// =============================
// CREATE
// =============================
const userBaru = await prisma.user.create({
  data: {
    email    : "user@email.com",
    password : hashedPassword,
    fullName : "Budi Santoso",
    role     : "student",
  },
});

// Create dengan relasi
const kursusLengkap = await prisma.course.create({
  data: {
    title    : "Belajar Python",
    slug     : "belajar-python",
    description: "Kursus Python dari dasar",
    price    : 149000,
    category : "Programming",
    instructorId: instruktur.id,
    
    // Buat sections sekaligus
    sections: {
      create: [
        {
          title     : "Modul 1: Pengantar",
          orderIndex: 1,
          lessons: {
            create: {
              title      : "Apa itu Python?",
              slug       : "apa-itu-python",
              contentType: "article",
              orderIndex : 1,
            }
          }
        }
      ]
    }
  },
  include: { sections: { include: { lessons: true } } }
});

// =============================
// READ
// =============================

// Cari satu
const user = await prisma.user.findUnique({
  where: { email: "user@email.com" },
});

const kursus = await prisma.course.findUnique({
  where : { slug: "belajar-python" },
  include: {
    instructor : { select: { fullName: true, avatar: true } },
    sections   : {
      orderBy : { orderIndex: "asc" },
      include : { lessons: { orderBy: { orderIndex: "asc" } } }
    },
    _count: { select: { enrollments: true, reviews: true } }
  }
});

// Cari banyak dengan filter
const kursusPublik = await prisma.course.findMany({
  where: {
    isPublished : true,
    category    : "Programming",
    price       : { lte: 200000 },  // Harga <= 200000
  },
  orderBy : { createdAt: "desc" },
  skip    : 0,                       // Pagination
  take    : 10,
  select  : {                        // Pilih field yang diperlukan saja
    id         : true,
    title      : true,
    slug       : true,
    price      : true,
    thumbnail  : true,
    instructor : { select: { fullName: true } },
  }
});

// =============================
// UPDATE
// =============================
const userUpdated = await prisma.user.update({
  where : { id: userId },
  data  : { fullName: "Nama Baru" },
});

// Upsert: update jika ada, create jika tidak
const progress = await prisma.progress.upsert({
  where  : { userId_lessonId: { userId, lessonId } },
  update : { completedAt: new Date() },
  create : { userId, lessonId, completedAt: new Date() },
});

// =============================
// DELETE
// =============================
await prisma.user.delete({ where: { id: userId } });

// Delete banyak
await prisma.lesson.deleteMany({
  where: { sectionId: sectionId }
});
\`\`\`

---

## 🔍 Fitur Canggih: Transactions & Full-text Search

\`\`\`typescript
// Transaction — semua berhasil atau semua gagal
const [kursus, enrollment] = await prisma.$transaction([
  prisma.course.update({
    where : { id: kursusId },
    data  : { enrollments: { connect: { id: enrollmentId } } }
  }),
  prisma.enrollment.create({
    data: { userId, courseId: kursusId }
  }),
]);

// Full-text search (PostgreSQL)
const hasil = await prisma.course.findMany({
  where: {
    title: { contains: "python", mode: "insensitive" }
  }
});

// Aggregation
const statistik = await prisma.course.aggregate({
  where    : { isPublished: true },
  _count   : { id: true },
  _avg     : { price: true },
  _max     : { price: true },
  _min     : { price: true },
});
console.log(\`Total: \${statistik._count.id}, Rata harga: \${statistik._avg.price}\`);
\`\`\`

---

## 🌱 Seed Database

\`\`\`bash
# Jalankan seed
node prisma/seed.js

# Atau via package.json:
# "prisma": { "seed": "node prisma/seed.js" }
# npx prisma db seed
\`\`\`

---

## 📝 Workflow Harian Prisma

\`\`\`bash
# 1. Edit schema.prisma

# 2. Buat & terapkan migrasi
npx prisma migrate dev --name tambah_kolom_avatar

# 3. Generate Prisma Client (otomatis setelah migrate)
npx prisma generate

# 4. Lihat database via GUI
npx prisma studio
\`\`\`

---

## 📝 Ringkasan

- Prisma = ORM type-safe untuk Node.js/TypeScript
- \`schema.prisma\` mendefinisikan model, relasi, dan koneksi database
- Prisma 7 menggunakan adapter pattern (\`@prisma/adapter-pg\`) yang lebih fleksibel
- Singleton pattern untuk Prisma Client di Next.js (hindari koneksi berlebih)
- CRUD: \`create\`, \`findUnique\`, \`findMany\`, \`update\`, \`upsert\`, \`delete\`
- \`include\` untuk eager loading relasi, \`select\` untuk pilih field tertentu
- \`$transaction\` untuk operasi yang harus atomik

> **Di modul berikutnya, kita bangun sistem autentikasi JWT yang aman!** 🔐
`;
