export const web_l6 = `
# Server Actions — Form Handling Modern di Next.js

Kalau dulu untuk submit form perlu buat API route terpisah, lalu fetch dari client, lalu handle loading/error — sekarang ada cara yang jauh lebih simpel: **Server Actions**.

Server Actions adalah fungsi server yang bisa dipanggil langsung dari komponen React. Tidak perlu API route terpisah, tidak perlu \`fetch()\` manual, dan type-safety penuh.

\`\`\`tsx
// Cara LAMA dengan API Route:
async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  const res = await fetch("/api/courses/enroll", {
    method: "POST",
    body  : JSON.stringify({ courseId }),
    headers: { "Content-Type": "application/json" }
  });
  const result = await res.json();
  setLoading(false);
  // handle result...
}

// Cara BARU dengan Server Action — jauh lebih ringkas:
async function enrollAction(formData: FormData) {
  "use server";   // ← Directive ini yang membuat fungsi jadi Server Action!
  const courseId = formData.get("courseId") as string;
  await prisma.enrollment.create({ data: { courseId, userId: user.id } });
  revalidatePath("/dashboard");
}
\`\`\`

---

## 📝 Form Dasar dengan Server Action

\`\`\`tsx
// src/app/courses/[slug]/enroll-button.tsx
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Definisikan Server Action
async function daftarKursus(formData: FormData) {
  "use server";   // ← Directive: fungsi ini berjalan di server

  const courseId = formData.get("courseId") as string;
  const user     = await getCurrentUser();

  if (!user) {
    throw new Error("Harap login terlebih dahulu");
  }

  // Cek sudah enrolled
  const sudahDaftar = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId } }
  });

  if (sudahDaftar) {
    throw new Error("Anda sudah terdaftar di kursus ini");
  }

  // Daftarkan
  await prisma.enrollment.create({
    data: { userId: user.userId, courseId }
  });

  // Revalidate halaman agar data terbaru
  revalidatePath(\`/courses/\${formData.get("slug")}\`);
  revalidatePath("/dashboard");
}

// Komponen Form
export function TombolDaftar({
  courseId,
  slug,
  sudahDaftar
}: {
  courseId   : string;
  slug       : string;
  sudahDaftar: boolean;
}) {
  if (sudahDaftar) {
    return (
      <a href={\`/courses/\${slug}/learn\`}
         className="btn-primary w-full text-center">
        Lanjut Belajar →
      </a>
    );
  }

  return (
    <form action={daftarKursus}>
      {/* Hidden fields */}
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="slug"     value={slug} />

      <button type="submit" className="btn-primary w-full">
        Daftar Kursus Gratis
      </button>
    </form>
  );
}
\`\`\`

---

## 🔄 useFormState — Validasi & Feedback

\`\`\`tsx
// src/components/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

type FormState = {
  error  : string | null;
  success: boolean;
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    loginAction,
    { error: null, success: false }
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* Tampilkan error */}
      {state.error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id          = "email"
          name        = "email"
          type        = "email"
          required
          className   = "input"
          placeholder = "nama@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id          = "password"
          name        = "password"
          type        = "password"
          required
          className   = "input"
          minLength   = {8}
        />
      </div>

      <button
        type      = "submit"
        disabled  = {isPending}
        className = "btn-primary w-full disabled:opacity-50"
      >
        {isPending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
\`\`\`

\`\`\`typescript
// src/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function loginAction(
  prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  // Validasi input
  if (!email || !password) {
    return { error: "Email dan password wajib diisi", success: false };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return { error: "Email atau password salah", success: false };
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return { error: "Email atau password salah", success: false };
    }

    // Set cookie
    const token = await signToken({
      userId  : user.id,
      email   : user.email,
      role    : user.role,
      fullName: user.fullName,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure  : process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge  : 7 * 24 * 3600,
    });

  } catch (error) {
    return { error: "Terjadi kesalahan server", success: false };
  }

  // Redirect setelah sukses (harus di luar try-catch)
  redirect("/dashboard");
}
\`\`\`

---

## 🔁 Revalidation — Update Cache

\`\`\`typescript
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

async function updateProfilAction(formData: FormData) {
  "use server";
  
  const nama = formData.get("nama") as string;
  // ... update database

  // Revalidate halaman spesifik
  revalidatePath("/profile");
  revalidatePath("/dashboard");

  // Revalidate semua halaman yang pakai tag ini
  revalidateTag("user-profile");
}

// Cara fetch data dengan tag:
const data = await fetch("https://api.com/user", {
  next: { tags: ["user-profile"] }  // ← Bisa direvalidasi dengan tag
});
\`\`\`

---

## 🚀 Optimistic Updates

\`\`\`tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLikeAction } from "@/actions/likes";

export function LikeButton({
  reviewId,
  initialLikes,
  initialLiked
}: {
  reviewId    : string;
  initialLikes: number;
  initialLiked: boolean;
}) {
  const [liked,   setLiked]   = useOptimistic(initialLiked);
  const [likes,   setLikes]   = useOptimistic(initialLikes);
  const [pending, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      // Update UI seketika (optimistic)
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);

      // Kirim ke server di background
      await toggleLikeAction(reviewId);
      // Jika server gagal → UI kembali ke state asli otomatis
    });
  }

  return (
    <button
      onClick   = {handleLike}
      disabled  = {pending}
      className = {\`flex items-center gap-2 \${liked ? "text-red-500" : "text-gray-500"}\`}
    >
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
}
\`\`\`

---

## 📊 Perbandingan Pendekatan

| | API Route + fetch | Server Action |
|---|---|---|
| **Boilerplate** | Banyak | Minimal |
| **Type safety** | Manual | Otomatis |
| **Loading state** | Manual | \`useFormStatus\` |
| **Error handling** | Manual | \`try-catch\` di action |
| **Progressive enhancement** | ❌ | ✅ (form tetap bekerja tanpa JS) |
| **Cocok untuk** | External API, webhook | Form, mutasi data internal |

---

## 📝 Ringkasan

- Server Actions = fungsi server yang bisa dipanggil dari React
- \`"use server"\` di dalam fungsi = Server Action inline
- \`"use server"\` di atas file = semua fungsi di file itu adalah Server Action
- \`useActionState\` untuk state form (error, loading, success)
- \`revalidatePath()\` dan \`revalidateTag()\` untuk update cache setelah mutasi
- \`useOptimistic\` untuk update UI seketika sambil menunggu server
- Server Actions mendukung **Progressive Enhancement** — form tetap bekerja tanpa JavaScript!

> **Di modul berikutnya, kita integrasikan Midtrans sebagai payment gateway!** 💳
`;
