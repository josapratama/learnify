"use client";

import { useState } from "react";
import { Share2, Copy, Check, X as XIcon, MessageCircle } from "lucide-react";

export default function ShareButton({
  title,
  url,
  courseId,
}: {
  title: string;
  url: string;
  courseId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (courseId)
      fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, platform: "link" }),
      }).catch(() => {});
  };

  const shareWA = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Cek kursus ini: ${title} - ${url}`)}`,
    );
    if (courseId)
      fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, platform: "whatsapp" }),
      }).catch(() => {});
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Belajar ${title} di EduTech 🚀`)}&url=${encodeURIComponent(url)}`,
    );
    if (courseId)
      fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, platform: "twitter" }),
      }).catch(() => {});
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={shareNative}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <Share2 className="w-4 h-4" /> Bagikan
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 z-50 w-56">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Bagikan ke
            </p>
            <div className="space-y-1">
              <button
                onClick={copy}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Tersalin!" : "Salin Link"}
              </button>
              <button
                onClick={shareWA}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
              >
                <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
              </button>
              <button
                onClick={shareTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
              >
                <XIcon className="w-4 h-4 text-sky-500" /> Twitter/X
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
