"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface CopyCertificateLinkButtonProps {
  certificateUrl: string;
}

export default function CopyCertificateLinkButton({
  certificateUrl,
}: CopyCertificateLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = certificateUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-sm transition shadow-xs"
      title="Salin Tautan Verifikasi Sertifikat"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-black">
            Tautan Tersalin!
          </span>
        </>
      ) : (
        <>
          <Link2 className="w-4 h-4 text-blue-500" />
          <span>Salin Tautan</span>
        </>
      )}
    </button>
  );
}
