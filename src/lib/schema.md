# Rancangan Database Learnify (PostgreSQL)

## 1. Profiles (Tabel User)
Menyimpan informasi tambahan pengguna.
- `id`: uuid (references auth.users)
- `full_name`: text
- `avatar_url`: text
- `role`: enum ('student', 'instructor', 'admin')
- `created_at`: timestamp

## 2. Courses
Menyimpan informasi utama kursus.
- `id`: uuid (primary key)
- `title`: text
- `slug`: text (unique)
- `description`: text
- `thumbnail_url`: text
- `price`: integer
- `instructor_id`: uuid (references profiles.id)
- `category`: text
- `level`: enum ('beginner', 'intermediate', 'advanced')
- `is_published`: boolean
- `created_at`: timestamp

## 3. Sections
Pengelompokan materi dalam kursus (misal: "Bab 1: Pendahuluan").
- `id`: uuid (primary key)
- `course_id`: uuid (references courses.id)
- `title`: text
- `order_index`: integer
- `created_at`: timestamp

## 4. Lessons
Detail materi dalam setiap section.
- `id`: uuid (primary key)
- `section_id`: uuid (references sections.id)
- `title`: text
- `slug`: text
- `content_type`: enum ('video', 'article', 'quiz')
- `video_url`: text
- `body_text`: text
- `order_index`: integer
- `is_preview`: boolean (bisa diakses tanpa beli)
- `created_at`: timestamp

## 5. Enrollments
Mencatat siswa yang sudah membeli/mendaftar kursus.
- `id`: uuid (primary key)
- `user_id`: uuid (references profiles.id)
- `course_id`: uuid (references courses.id)
- `status`: enum ('active', 'completed')
- `enrolled_at`: timestamp

## 6. Progress
Melacak progres belajar siswa per lesson.
- `id`: uuid (primary key)
- `user_id`: uuid (references profiles.id)
- `lesson_id`: uuid (references lessons.id)
- `is_completed`: boolean
- `completed_at`: timestamp
