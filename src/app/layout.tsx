import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "EduTech - Platform Belajar Online",
  description: "Belajar IoT, Programming, dan Teknologi Masa Depan",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduTech",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen font-sans antialiased"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="beforeInteractive"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
