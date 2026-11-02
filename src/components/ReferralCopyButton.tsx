"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

export default function ReferralCopyButton({
  referralLink,
  referralCode,
}: {
  referralLink: string;
  referralCode: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: "Belajar di Learnify",
        text: `Daftar di Learnify pakai kode referralku: ${referralCode}`,
        url: referralLink,
      });
    } else {
      copy();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          readOnly
          value={referralLink}
          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-mono"
        />
        <button
          onClick={copy}
          className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition ${copied ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Tersalin!" : "Salin"}
        </button>
      </div>
      <div className="flex gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Kode Anda:
        </span>
        <code className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded">
          {referralCode}
        </code>
      </div>
      <button
        onClick={share}
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        <Share2 className="w-4 h-4" /> Bagikan ke WhatsApp / Media Sosial
      </button>
    </div>
  );
}
