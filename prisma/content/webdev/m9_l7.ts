export const web_l7 = `
# Integrasi Midtrans Payment Gateway

Kalau kamu mau jual kursus atau produk digital, ini bagian yang tidak bisa dilewati: sistem pembayaran.

Midtrans adalah payment gateway lokal yang paling banyak dipakai di Indonesia. Satu integrasi, kamu sudah bisa terima transfer bank, kartu kredit, GoPay, OVO, DANA, QRIS, Indomaret — lebih dari 30 metode pembayaran.

## 🔄 Flow Pembayaran (Snap)

\`\`\`
User klik "Beli"
    ↓
Server buat Snap Token (panggil API Midtrans)
    ↓
Client tampilkan popup Midtrans (pakai Snap.js)
    ↓
User pilih metode bayar & bayar
    ↓
Midtrans kirim Webhook ke server kita
    ↓
Server verifikasi signature → update database
    ↓
User dapat akses kursus
\`\`\`

Kuncinya ada dua: buat token di server, dan verifikasi webhook dengan signature. Jangan pernah percaya notifikasi pembayaran tanpa verifikasi signature.

---

## 📦 Setup

\`\`\`bash
npm install midtrans-client
npm install -D @types/midtrans-client
\`\`\`

\`\`\`bash
# .env.local
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx   # Sandbox untuk testing
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
\`\`\`

---

## 🔧 Konfigurasi Midtrans Client

\`\`\`typescript
// src/lib/midtrans.ts
import Midtrans from "midtrans-client";

// Snap API untuk popup pembayaran
export const snap = new Midtrans.Snap({
  isProduction : process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey    : process.env.MIDTRANS_SERVER_KEY!,
  clientKey    : process.env.MIDTRANS_CLIENT_KEY!,
});

// Core API untuk pembayaran langsung (tanpa popup)
export const core = new Midtrans.CoreApi({
  isProduction : process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey    : process.env.MIDTRANS_SERVER_KEY!,
  clientKey    : process.env.MIDTRANS_CLIENT_KEY!,
});

// Generate order ID unik
export function generateOrderId(courseId: string): string {
  const timestamp = Date.now();
  const random    = Math.random().toString(36).substring(2, 7).toUpperCase();
  return \`ORDER-\${courseId.substring(0, 6)}-\${timestamp}-\${random}\`;
}
\`\`\`

---

## 🛒 API Route: Buat Transaksi

\`\`\`typescript
// src/app/api/courses/enroll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { snap, generateOrderId } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    // Ambil info kursus
    const kursus = await prisma.course.findUnique({
      where  : { id: courseId },
      include: { instructor: { select: { fullName: true } } }
    });

    if (!kursus || !kursus.isPublished) {
      return NextResponse.json({ error: "Kursus tidak ditemukan" }, { status: 404 });
    }

    // Cek sudah enrolled?
    const sudahDaftar = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.userId, courseId } }
    });

    if (sudahDaftar) {
      return NextResponse.json(
        { error: "Anda sudah terdaftar di kursus ini" },
        { status: 400 }
      );
    }

    // Kursus gratis — langsung enroll
    if (kursus.price === 0) {
      await prisma.enrollment.create({
        data: { userId: user.userId, courseId, paymentStatus: "completed" }
      });
      return NextResponse.json({ redirect: \`/courses/\${kursus.slug}/learn\` });
    }

    // Ambil data user lengkap
    const userData = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    const orderId = generateOrderId(courseId);

    // Parameter transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id    : orderId,
        gross_amount: kursus.price,  // Dalam Rupiah
      },
      item_details: [{
        id      : kursus.id,
        price   : kursus.price,
        quantity: 1,
        name    : kursus.title.substring(0, 50),  // Max 50 karakter
        category: kursus.category,
        merchant_name: kursus.instructor.fullName,
      }],
      customer_details: {
        first_name: userData!.fullName.split(" ")[0],
        last_name : userData!.fullName.split(" ").slice(1).join(" ") || "-",
        email     : userData!.email,
      },
      callbacks: {
        finish: \`\${process.env.NEXT_PUBLIC_BASE_URL}/payment/finish?order_id=\${orderId}\`,
      },
      expiry: {
        unit    : "hours",
        duration: 24,  // Token kadaluarsa dalam 24 jam
      },
    };

    // Buat transaksi & dapatkan Snap Token
    const transaction = await snap.createTransaction(parameter);

    // Simpan record transaksi ke database
    await prisma.enrollment.create({
      data: {
        userId       : user.userId,
        courseId,
        paymentStatus: "pending",
        orderId,
        snapToken    : transaction.token,
      }
    });

    return NextResponse.json({
      snapToken: transaction.token,
      orderId,
    });

  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Gagal membuat transaksi" }, { status: 500 });
  }
}
\`\`\`

---

## 🔔 Webhook — Verifikasi Pembayaran

\`\`\`typescript
// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import prisma from "@/lib/prisma";

function verifySignature(
  orderId       : string,
  statusCode    : string,
  grossAmount   : string,
  serverKey     : string,
  signatureKey  : string
): boolean {
  const hash = createHash("sha512")
    .update(\`\${orderId}\${statusCode}\${grossAmount}\${serverKey}\`)
    .digest("hex");
  return hash === signatureKey;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = body;

    // WAJIB: Verifikasi signature untuk mencegah pemalsuan
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      process.env.MIDTRANS_SERVER_KEY!,
      signature_key
    );

    if (!isValid) {
      console.warn("Invalid webhook signature from Midtrans!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Ambil enrollment berdasarkan orderId
    const enrollment = await prisma.enrollment.findFirst({
      where: { orderId: order_id }
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle status pembayaran
    let newStatus: string;

    switch (transaction_status) {
      case "capture":
      case "settlement":
        // Pembayaran berhasil!
        newStatus = "completed";
        break;
      case "pending":
        newStatus = "pending";
        break;
      case "deny":
      case "cancel":
      case "expire":
        newStatus = "failed";
        break;
      default:
        newStatus = "pending";
    }

    // Update status di database
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data : {
        paymentStatus: newStatus,
        paymentMethod: payment_type,
        paidAt       : newStatus === "completed" ? new Date() : undefined,
      }
    });

    // Jika berhasil: kirim email konfirmasi (opsional)
    if (newStatus === "completed") {
      // await kirimEmailKonfirmasi(enrollment.userId, enrollment.courseId);
      console.log(\`✅ Pembayaran berhasil: \${order_id}\`);
    }

    return NextResponse.json({ status: "OK" });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
\`\`\`

---

## 🖥️ Komponen Client: Tombol Bayar

\`\`\`tsx
"use client";

import { useState } from "react";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: object) => void;
    };
  }
}

export function TombolBeli({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleBeli() {
    setLoading(true);
    try {
      // 1. Minta server buat transaksi
      const res = await fetch("/api/courses/enroll", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Terjadi kesalahan");
        return;
      }

      // Jika kursus gratis, langsung redirect
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }

      // 2. Buka popup Midtrans
      window.snap.pay(data.snapToken, {
        onSuccess: (result: object) => {
          console.log("Pembayaran berhasil:", result);
          window.location.href = "/dashboard?payment=success";
        },
        onPending: (result: object) => {
          console.log("Menunggu pembayaran:", result);
          window.location.href = "/dashboard?payment=pending";
        },
        onError: (result: object) => {
          console.error("Pembayaran gagal:", result);
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          console.log("Popup ditutup");
          setLoading(false);
        },
      });

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Load Midtrans Snap JS */}
      <script
        src={
          process.env.NEXT_PUBLIC_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        async
      />

      <button
        onClick   = {handleBeli}
        disabled  = {loading}
        className = "btn-primary w-full py-3 text-lg"
      >
        {loading ? "Memproses..." : "Beli Sekarang"}
      </button>
    </>
  );
}
\`\`\`

---

## 🔒 Keamanan Penting

\`\`\`typescript
// ✅ SELALU verifikasi signature_key dari Midtrans
// ✅ Cek status ke Midtrans API, jangan cuma percaya webhook body
// ✅ Gunakan server key hanya di server (JANGAN di client!)
// ✅ Log semua transaksi untuk audit
// ✅ Test di Sandbox sebelum production

// Verifikasi manual via Midtrans API (double check):
async function cekStatusTransaksi(orderId: string) {
  const response = await fetch(
    \`https://api.sandbox.midtrans.com/v2/\${orderId}/status\`,
    {
      headers: {
        Authorization: \`Basic \${Buffer.from(
          process.env.MIDTRANS_SERVER_KEY + ":"
        ).toString("base64")}\`,
      },
    }
  );
  return response.json();
}
\`\`\`

---

## 📝 Ringkasan

- Midtrans Snap = solusi pembayaran popup yang mendukung 30+ metode
- Flow: Server buat token → Client buka popup → Midtrans proses → Webhook ke server
- **Webhook WAJIB diverifikasi** dengan \`signature_key\` sebelum dipercaya
- Server key hanya di server — jangan pernah expose ke client!
- Test di Sandbox (mode development) sebelum switch ke production
- Nomor kartu test Sandbox: \`4811 1111 1111 1114\` (Visa)

> **Di modul terakhir, kita deploy aplikasi ke Vercel dan lakukan optimasi production!** 🚀
`;
