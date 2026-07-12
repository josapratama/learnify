"use client";

import { Download } from "lucide-react";

export default function PrintCertificateButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
    >
      <Download className="w-5 h-5" /> Cetak / Simpan PDF
    </button>
  );
}
