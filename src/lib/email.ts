import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_for_build");
const FROM = process.env.RESEND_FROM_EMAIL || "Learnify <noreply@learnify.app>";

// Helper: kirim email, graceful fail jika API key belum diset
async function sendEmail(to: string, subject: string, html: string) {
  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === "re_YOUR_RESEND_API_KEY"
  ) {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    return { id: "mock" };
  }
  try {
    const result = await resend.emails.send({ from: FROM, to, subject, html });
    return result;
  } catch (err) {
    console.error("Email send error:", err);
    return null;
  }
}

// =============================================
// Template Emails
// =============================================

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 600px; margin: 0 auto; background: #ffffff;
`;
const headerStyle = `background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 32px 40px; border-radius: 16px 16px 0 0;`;
const bodyStyle = `padding: 32px 40px; background: #f9fafb;`;
const footerStyle = `padding: 20px 40px; background: #f3f4f6; border-radius: 0 0 16px 16px; text-align: center; color: #9ca3af; font-size: 12px;`;
const btnStyle = `display: inline-block; background: #6366f1; color: #ffffff; padding: 14px 28px; border-radius: 10px; font-weight: bold; text-decoration: none; margin-top: 16px;`;

function wrap(content: string): string {
  return `<div style="${baseStyle}">
    ${content}
    <div style="${footerStyle}">
      <p>© ${new Date().getFullYear()} Learnify — Platform Belajar Online Modern</p>
      <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
    </div>
  </div>`;
}

// 1. Welcome email setelah register
export async function sendWelcomeEmail(to: string, name: string) {
  const html = wrap(`
    <div style="${headerStyle}">
      <h1 style="color:#fff; margin:0; font-size:28px;">🎓 Selamat Datang di Learnify!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#374151; font-size:16px;">Halo <strong>${name}</strong>,</p>
      <p style="color:#6b7280;">Terima kasih sudah bergabung! Akun Anda sudah aktif dan siap digunakan.</p>
      <p style="color:#6b7280;">Mulai eksplorasi puluhan kursus berkualitas — dari pemula hingga expert.</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="${btnStyle}">🚀 Mulai Belajar Sekarang</a>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280; font-size:14px;">💡 <strong>Tips:</strong> Gunakan fitur Learning Path untuk jalur belajar yang terstruktur!</p>
    </div>
  `);
  return sendEmail(to, "🎓 Selamat Datang di Learnify!", html);
}

// 2. Konfirmasi pembayaran
export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  courseTitle: string,
) {
  const html = wrap(`
    <div style="${headerStyle}">
      <h1 style="color:#fff; margin:0; font-size:24px;">✅ Pembayaran Berhasil!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#374151;">Halo <strong>${name}</strong>,</p>
      <p style="color:#6b7280;">Pembayaran untuk kursus berikut telah dikonfirmasi:</p>
      <div style="background:#ede9fe; border-left:4px solid #6366f1; padding:16px; border-radius:8px; margin:16px 0;">
        <p style="margin:0; font-weight:bold; color:#4f46e5; font-size:18px;">📚 ${courseTitle}</p>
        <p style="margin:4px 0 0; color:#7c3aed; font-size:14px;">Akses selamanya</p>
      </div>
      <p style="color:#6b7280;">Selamat belajar! Anda kini memiliki akses penuh ke semua materi kursus ini.</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="${btnStyle}">🎓 Pergi ke Dashboard</a>
    </div>
  `);
  return sendEmail(to, `✅ Pembayaran Dikonfirmasi - ${courseTitle}`, html);
}

// 3. Notifikasi balasan diskusi
export async function sendDiscussionReplyEmail(
  to: string,
  name: string,
  lessonTitle: string,
  replierName: string,
  replyContent: string,
  url: string,
) {
  const html = wrap(`
    <div style="${headerStyle}">
      <h1 style="color:#fff; margin:0; font-size:22px;">💬 Ada Balasan untuk Diskusi Anda</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#374151;">Halo <strong>${name}</strong>,</p>
      <p style="color:#6b7280;"><strong>${replierName}</strong> membalas diskusi Anda di:</p>
      <p style="color:#4f46e5; font-weight:bold;">📖 ${lessonTitle}</p>
      <div style="background:#f3f4f6; border-radius:8px; padding:16px; margin:12px 0; border-left:4px solid #d1d5db;">
        <p style="margin:0; color:#374151; font-style:italic;">"${replyContent.slice(0, 200)}${replyContent.length > 200 ? "..." : ""}"</p>
      </div>
      <a href="${url}" style="${btnStyle}">💬 Lihat Diskusi</a>
    </div>
  `);
  return sendEmail(to, `💬 ${replierName} membalas diskusi Anda`, html);
}

// 4. Pengingat streak
export async function sendStreakReminderEmail(
  to: string,
  name: string,
  streak: number,
) {
  const html = wrap(`
    <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:32px 40px;border-radius:16px 16px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:26px;">🔥 Jangan Biarkan Streakmu Padam!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#374151;">Halo <strong>${name}</strong>,</p>
      <p style="color:#6b7280;">Kamu sudah belajar selama <strong>${streak} hari berturut-turut</strong>. Sayang sekali jika terputus!</p>
      <div style="background:#fef3c7; border-radius:12px; padding:20px; text-align:center; margin:16px 0;">
        <p style="font-size:48px; margin:0;">🔥</p>
        <p style="font-size:32px; font-weight:black; color:#b45309; margin:8px 0;">${streak} Hari</p>
        <p style="color:#92400e; margin:0;">Streak belajar Anda</p>
      </div>
      <p style="color:#6b7280;">Luangkan 5 menit hari ini untuk menjaga semangat belajarmu!</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="display:inline-block;background:#f59e0b;color:#fff;padding:14px 28px;border-radius:10px;font-weight:bold;text-decoration:none;margin-top:16px;">⚡ Lanjutkan Belajar</a>
    </div>
  `);
  return sendEmail(to, `🔥 Streak ${streak} hari Anda hampir terputus!`, html);
}

// 5. Sertifikat tersedia
export async function sendCertificateEmail(
  to: string,
  name: string,
  courseTitle: string,
  certUrl: string,
) {
  const html = wrap(`
    <div style="background:linear-gradient(135deg,#eab308,#f59e0b);padding:32px 40px;border-radius:16px 16px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:24px;">🏆 Sertifikat Anda Siap!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#374151;">Selamat <strong>${name}</strong>! 🎉</p>
      <p style="color:#6b7280;">Anda telah berhasil menyelesaikan kursus:</p>
      <div style="background:#fefce8; border:2px solid #eab308; border-radius:12px; padding:20px; text-align:center; margin:16px 0;">
        <p style="font-size:20px; font-weight:bold; color:#713f12; margin:0;">📚 ${courseTitle}</p>
      </div>
      <p style="color:#6b7280;">Sertifikat Anda sudah tersedia dan siap diunduh atau dibagikan ke LinkedIn.</p>
      <a href="${certUrl}" style="display:inline-block;background:#eab308;color:#fff;padding:14px 28px;border-radius:10px;font-weight:bold;text-decoration:none;margin-top:16px;">🏆 Lihat Sertifikat</a>
    </div>
  `);
  return sendEmail(to, `🏆 Sertifikat "${courseTitle}" Siap Diunduh!`, html);
}

// 6. Referral berhasil
export async function sendReferralSuccessEmail(
  to: string,
  referrerName: string,
  referredName: string,
  reward: number,
) {
  const html = wrap(`
    <div style="background:linear-gradient(135deg,#8b5cf6,#6366f1);padding:32px 40px;border-radius:16px 16px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:24px;">🎁 Referral Berhasil!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#374151;">Halo <strong>${referrerName}</strong>,</p>
      <p style="color:#6b7280;"><strong>${referredName}</strong> baru saja bergabung menggunakan kode referral Anda!</p>
      <div style="background:#ede9fe; border-radius:12px; padding:20px; text-align:center; margin:16px 0;">
        <p style="font-size:32px; font-weight:black; color:#7c3aed; margin:0;">+Rp${reward.toLocaleString("id-ID")}</p>
        <p style="color:#6d28d9; margin:4px 0 0;">Reward referral Anda</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/referral" style="${btnStyle}">🎁 Lihat Program Referral</a>
    </div>
  `);
  return sendEmail(
    to,
    `🎁 Referral berhasil! +Rp${reward.toLocaleString("id-ID")} reward`,
    html,
  );
}
