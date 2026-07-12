# Learnify

Platform e-learning berbasis web yang dibangun dengan Next.js 16, Prisma, dan PostgreSQL. Mendukung berbagai tipe konten pembelajaran (video, artikel, kuis), manajemen kursus oleh instruktur, serta fitur-fitur pendukung seperti diskusi, catatan, sertifikat, dan referral.

## Tech Stack

| Layer       | Teknologi                         |
| ----------- | --------------------------------- |
| Framework   | Next.js 16 (App Router)           |
| Language    | TypeScript                        |
| Database    | PostgreSQL 15                     |
| ORM         | Prisma 7 + `@prisma/adapter-pg`   |
| Auth        | JWT via `jose` + HTTP-only cookie |
| Styling     | Tailwind CSS v4                   |
| Payment     | Midtrans (Snap)                   |
| AI          | Google Gemini API                 |
| Email       | Resend                            |
| Code Editor | Monaco Editor                     |

## Fitur

### Untuk Siswa

- **Katalog Kursus** — browse, filter, dan live search kursus
- **Learning Path** — jalur belajar terstruktur dari kurator
- **Pembelajaran** — materi video, artikel (Markdown), dan kuis interaktif
- **Progress Tracking** — tandai materi selesai, resume video dari posisi terakhir
- **Quiz** — soal pilihan ganda dengan skor dan penjelasan jawaban
- **Diskusi** — forum diskusi per-lesson dengan like dan balasan
- **Catatan** — buat catatan pribadi per-lesson
- **Wishlist** — simpan kursus favorit
- **Sertifikat** — cetak sertifikat setelah kursus selesai
- **Referral** — program referral dengan kode unik
- **Notifikasi** — bell notifikasi real-time
- **Code Playground** — editor kode online dengan Monaco Editor
- **Dark/Light Mode** — toggle tema

### Untuk Instruktur

- **Dashboard Instruktur** — statistik siswa, pendapatan, rating, aktivitas terbaru
- **Course Builder** — buat dan edit kursus dengan modul (section) dan materi (lesson)
- **Curriculum Editor** — reorder section/lesson, isi konten video/artikel, kelola kuis
- **Quiz Editor** — tambah, edit, hapus pertanyaan kuis per-lesson dengan UI inline
- **Publish/Draft** — kontrol visibilitas kursus

### Untuk Admin

- **User Management** — lihat dan kelola semua pengguna

## Struktur Proyek

```
learnify/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Entry point seeder
│   ├── seeders/               # Seeder per kursus/topik
│   └── content/               # Konten materi kursus (TypeScript)
│       ├── python/
│       ├── javascript/
│       ├── iot/
│       └── ...
├── src/
│   ├── app/
│   │   ├── api/               # API Routes (Next.js Route Handlers)
│   │   │   ├── auth/          # login, register, logout
│   │   │   ├── courses/       # catalog, enroll, review, search
│   │   │   ├── instructor/    # courses, sections, lessons, quizzes, curriculum
│   │   │   ├── admin/         # user management
│   │   │   ├── progress/      # tracking & video position
│   │   │   ├── discussions/   # forum & likes
│   │   │   ├── notes/         # catatan siswa
│   │   │   ├── quizzes/       # quiz attempts
│   │   │   ├── notifications/ # notifikasi
│   │   │   ├── referral/      # program referral
│   │   │   ├── ai/            # Gemini AI chat
│   │   │   ├── code/          # code runner
│   │   │   ├── email/         # email service
│   │   │   ├── share/         # course sharing
│   │   │   └── webhooks/      # Midtrans webhook
│   │   ├── courses/[slug]/    # halaman detail & pembelajaran kursus
│   │   ├── instructor/        # dashboard & course editor instruktur
│   │   ├── dashboard/         # dashboard siswa
│   │   ├── learning-paths/    # halaman learning path
│   │   ├── profile/           # profil & settings
│   │   ├── admin/             # halaman admin
│   │   ├── playground/        # code playground
│   │   ├── certificate/       # halaman sertifikat
│   │   ├── referral/          # halaman referral
│   │   └── notes/             # halaman catatan
│   ├── components/            # Reusable React components
│   └── lib/                   # auth, prisma client, utils
├── docker-compose.yml         # PostgreSQL via Docker
└── middleware.ts              # Route protection (JWT)
```

## Kursus Tersedia (Seed Data)

16 kursus dengan total ratusan lesson:

| Kursus                    | Kategori    |
| ------------------------- | ----------- |
| IoT (Internet of Things)  | Hardware    |
| Web Development           | Web         |
| Python                    | Programming |
| JavaScript                | Programming |
| TypeScript                | Programming |
| Git & GitHub              | Tools       |
| Linux                     | OS          |
| SQL                       | Database    |
| Cybersecurity             | Security    |
| Docker                    | DevOps      |
| Algoritma & Struktur Data | Fundamental |
| C++                       | Programming |
| HTML                      | Web         |
| CSS                       | Web         |
| Laravel                   | Web         |
| PHP                       | Programming |

**6 Learning Path:** Web Developer, Python Developer, IoT Engineer, DevOps & Cloud, Keamanan Siber, Fundamental IT

## Instalasi & Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (untuk PostgreSQL)
- Git

### 1. Clone repository

```bash
git clone https://github.com/josapratama/learnify.git
cd learnify
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Salin file contoh dan isi dengan nilai yang sesuai:

```bash
cp .env.example .env
```

Atau buat file `.env` manual:

```env
# Database
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/edutech"

# Auth
JWT_SECRET="ganti-dengan-secret-yang-kuat"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Midtrans (opsional — untuk payment)
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-..."

# Demo Mode (nonaktifkan payment gateway saat development)
NEXT_PUBLIC_DEMO_MODE="true"

# Email via Resend (opsional)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Learnify <noreply@yourdomain.com>"

# Google Gemini AI (opsional — untuk fitur Ask AI)
GEMINI_API_KEY="..."
```

### 4. Jalankan PostgreSQL dengan Docker

```bash
docker-compose up -d
```

### 5. Jalankan migrasi database

```bash
npx prisma migrate dev --name init
```

### 6. Seed database

Mengisi database dengan 16 kursus, 6 learning path, dan akun demo:

```bash
npx prisma db seed
```

### 7. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Akun Demo

Setelah seed, tersedia akun-akun berikut:

| Role       | Email                 | Password      |
| ---------- | --------------------- | ------------- |
| Admin      | `admin@edutech.com`   | `password123` |
| Student    | `student@edutech.com` | `password123` |
| Instructor | `pratama@edutech.com` | `password123` |
| Instructor | `budi@edutech.com`    | `password123` |
| Instructor | `siti@edutech.com`    | `password123` |

## Scripts

```bash
npm run dev        # Development server (http://localhost:3000)
npm run build      # Build production
npm run start      # Jalankan production build
npm run lint       # ESLint

npx prisma studio  # Prisma GUI untuk inspect database
npx prisma db seed # Reset & seed ulang database
```

## Database Schema (ringkas)

```
User
 ├── Course (instructor)
 │    ├── Section
 │    │    └── Lesson
 │    │         ├── Quiz
 │    │         ├── Attachment
 │    │         ├── Progress
 │    │         ├── Discussion
 │    │         ├── Note
 │    │         └── QuizAttempt
 │    ├── Enrollment
 │    ├── Review
 │    └── Wishlist
 ├── LearningPath
 │    └── LearningPathCourse
 ├── Notification
 └── Referral
```

## Environment Variables Lengkap

| Variable                          | Wajib | Keterangan                      |
| --------------------------------- | ----- | ------------------------------- |
| `DATABASE_URL`                    | ✅    | Connection string PostgreSQL    |
| `JWT_SECRET`                      | ✅    | Secret untuk signing JWT token  |
| `NEXT_PUBLIC_BASE_URL`            | ✅    | URL base aplikasi               |
| `MIDTRANS_SERVER_KEY`             | ❌    | Server key Midtrans (payment)   |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | ❌    | Client key Midtrans             |
| `NEXT_PUBLIC_DEMO_MODE`           | ❌    | Set `true` untuk skip payment   |
| `RESEND_API_KEY`                  | ❌    | API key Resend (email)          |
| `RESEND_FROM_EMAIL`               | ❌    | Sender email address            |
| `GEMINI_API_KEY`                  | ❌    | Google Gemini API key (AI chat) |

## Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b feat/nama-fitur`
3. Commit dengan conventional commits: `git commit -m "feat: tambah fitur X"`
4. Push: `git push origin feat/nama-fitur`
5. Buat Pull Request

## Lisensi

MIT License — bebas digunakan untuk keperluan pribadi maupun komersial.
