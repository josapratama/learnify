"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Award,
  ShieldCheck,
  QrCode,
  Globe,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function CertificateSearchClient() {
  const [certId, setCertId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim();
    if (!cleanId) {
      setError("Silakan masukkan Nomor / ID Sertifikat yang ingin diverifikasi.");
      return;
    }
    setError(null);
    router.push(`/certificate/${cleanId}`);
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-12">
      {/* Search Verification Box */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800 shadow-lg shadow-amber-500/10">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Verifikasi Keaslian Sertifikat
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Masukkan ID unik sertifikat atau kode pendaftaran untuk memverifikasi keabsahan kelulusan dan kredensial siswa Learnify secara real-time.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={certId}
              onChange={(e) => {
                setCertId(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Masukkan ID Sertifikat (Contoh: b7c32e91-4d0f-...)"
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition outline-none font-mono text-xs sm:text-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Verifikasi Kredensial Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-4">
          * ID sertifikat dapat ditemukan di bagian bawah sertifikat fisik/PDF atau di tautan publik siswa.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">
            Tervalidasi Database
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Setiap sertifikat terhubung langsung ke record penyelesaian 100% modul di database terenkripsi Learnify.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-200 dark:border-blue-800">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">
            Autentikasi QR Code
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Pindai kode QR pada lembar sertifikat untuk diarahkan langsung ke halaman validasi resmi ini.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-purple-200 dark:border-purple-800">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">
            Diakui Industri
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Dapat ditautkan ke profil LinkedIn, portofolio kerja, atau CV untuk menunjukkan kompetensi nyata.
          </p>
        </div>
      </div>
    </div>
  );
}
