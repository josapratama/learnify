"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  CreditCard,
  UserCheck,
  MessageSquare,
  ArrowRight,
  X,
} from "lucide-react";

interface FaqItem {
  id: string;
  category: "account" | "learning" | "certificate" | "payment";
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  // Akun & Pendaftaran
  {
    id: "acc-1",
    category: "account",
    question: "Apakah pendaftaran akun di platform Learnify gratis?",
    answer:
      "Ya, membuat akun di Learnify 100% gratis. Anda dapat mendaftar dan langsung mengakses berbagai materi gratis, mencoba Code Playground interaktif, serta mengikuti program referral.",
  },
  {
    id: "acc-2",
    category: "account",
    question: "Bagaimana cara mengubah profil dan nama di sertifikat?",
    answer:
      "Anda dapat mengubah nama lengkap, foto avatar, dan bio melalui menu 'Profil & Pengaturan'. Nama lengkap yang tersimpan di akun Anda akan otomatis digunakan saat penerbitan sertifikat resmi.",
  },
  {
    id: "acc-3",
    category: "account",
    question: "Apakah platform Learnify dapat diakses melalui smartphone atau tablet?",
    answer:
      "Tentu saja! Antarmuka Learnify dirancang sepenuhnya responsif untuk smartphone, tablet, laptop, maupun monitor desktop dengan performa cepat dan mode Gelap (Dark Mode).",
  },

  // Pembelajaran & Kuis
  {
    id: "learn-1",
    category: "learning",
    question: "Apakah materi kursus dapat dipelajari ulang kapan saja?",
    answer:
      "Ya. Semua kursus yang telah Anda ikuti memiliki akses seumur hidup (Lifetime Access). Anda bebas memutar ulang video materi, membaca artikel ringkasan, dan membuka catatan penting kapan saja.",
  },
  {
    id: "learn-2",
    category: "learning",
    question: "Bagaimana cara kerja Code Playground di dalam materi pembelajaran?",
    answer:
      "Pada materi hands-on latihan koding, Learnify menyediakan editor kode interaktif bertenaga Monaco Editor. Anda dapat menulis dan mengeksekusi kode JavaScript, Python, TypeScript, HTML/CSS, dan SQL secara langsung di browser tanpa instalasi software tambahan.",
  },
  {
    id: "learn-3",
    category: "learning",
    question: "Berapa skor kelulusan minimal untuk kuis modul?",
    answer:
      "Nilai minimal kelulusan kuis adalah 70%. Jika belum mencapai nilai tersebut, Anda dapat meninjau kunci jawaban dan pembahasan konsep, lalu mengulangi kuis kembali tanpa batas kuota percobaan.",
  },
  {
    id: "learn-4",
    category: "learning",
    question: "Apakah saya bisa bertanya jika mengalami kendala saat koding?",
    answer:
      "Tentu! Setiap materi pelajaran dilengkapi dengan forum Diskusi & Tanya Jawab antar siswa dan instruktur, serta asisten AI Tutor 24/7 di samping materi yang siap menjawab pertanyaan teknis Anda.",
  },

  // Sertifikat & Kelulusan
  {
    id: "cert-1",
    category: "certificate",
    question: "Kapan sertifikat kelulusan kursus akan diterbitkan?",
    answer:
      "Sertifikat digital otomatis diterbitkan setelah Anda menyelesaikan 100% seluruh pelajaran (video/artikel) dan lulus semua kuis modul pada kursus yang bersangkutan.",
  },
  {
    id: "cert-2",
    category: "certificate",
    question: "Apakah sertifikat Learnify memiliki verifikasi keaslian digital?",
    answer:
      "Ya! Setiap sertifikat memiliki kode kredensial unik (UUID) serta QR Code yang dapat dipindai oleh pihak rekruter untuk memverifikasi keabsahan nama, tanggal kelulusan, dan silabus kursus secara publik.",
  },
  {
    id: "cert-3",
    category: "certificate",
    question: "Apakah sertifikat bisa dicetak ke PDF atau dibagikan ke LinkedIn?",
    answer:
      "Bisa. Halaman sertifikat dilengkapi tombol 'Cetak / Unduh PDF' siap cetak dokumen resmi, serta tombol bagikan langsung ke profil LinkedIn dan media sosial lainnya.",
  },

  // Pembayaran & Akses
  {
    id: "pay-1",
    category: "payment",
    question: "Metode pembayaran apa saja yang didukung untuk kursus berbayar?",
    answer:
      "Learnify mendukung pembayaran otomatis melalui QRIS (GoPay, OVO, Dana, ShopeePay, BCA Mobile), Transfer Virtual Account Bank, dan gateway pembayaran terintegrasi dengan konfirmasi otomatis instan.",
  },
  {
    id: "pay-2",
    category: "payment",
    question: "Berapa lama masa aktif kursus setelah transaksi berhasil?",
    answer:
      "Setelah pembayaran berhasil dikonfirmasi, akses kursus berlaku selamanya (seumur hidup) termasuk pembaruan kurikulum materi baru di masa mendatang tanpa biaya langganan tambahan.",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Kategori", icon: HelpCircle },
  { id: "account", label: "Akun & Pendaftaran", icon: UserCheck },
  { id: "learning", label: "Pembelajaran & Kuis", icon: BookOpen },
  { id: "certificate", label: "Sertifikat Kelulusan", icon: Award },
  { id: "payment", label: "Pembayaran & Akses", icon: CreditCard },
] as const;

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["acc-1", "learn-1", "cert-1"]));

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Controls */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
        {/* Live Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan... (contoh: sertifikat, pembayaran, kuis, playground)"
            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-750"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Results Count & Expand/Collapse All */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
          Menampilkan <span className="text-gray-900 dark:text-white font-black">{filteredFaqs.length}</span> pertanyaan
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Buka Semua
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button
            onClick={collapseAll}
            className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:underline"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Accordion Questions List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-900/60 shadow-sm"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rotate-180"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-gray-800/60 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
            Tidak ada jawaban yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Support Callout Banner */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-blue-200 block mb-1">
            Masih Butuh Bantuan?
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Punya Pertanyaan Lain yang Belum Terjawab?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Siswa dapat menggunakan AI Tutor 24/7 di ruang belajar kursus atau bertanya langsung di forum diskusi materi.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 shrink-0"
        >
          <span>Eksplorasi Kursus</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
