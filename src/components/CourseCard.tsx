import Link from "next/link";
import Image from "next/image";
import {
  Star,
  BookOpen,
  Code2,
  Cpu,
  Globe,
  Database,
  Shield,
  Sparkles,
  Terminal,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface CourseCardData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category: string;
  level: string;
  price: number;
  thumbnailUrl?: string | null;
  instructor?: {
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
  reviews?: { rating: number }[];
  _count?: {
    enrollments?: number;
    sections?: number;
  };
}

// Helper untuk visual gradient & ikon berdasarkan kategori/judul kursus
function getCategoryVisual(category: string, title: string) {
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (cat.includes("iot") || cat.includes("internet of things") || t.includes("esp32") || t.includes("arduino") || t.includes("raspberry")) {
    return {
      gradient: "from-emerald-600 via-teal-600 to-cyan-700",
      accent: "text-emerald-400",
      bgSoft: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <Cpu className="w-10 h-10 text-white/90" />,
      tag: "Hardware & IoT",
    };
  }

  if (cat.includes("web") || t.includes("react") || t.includes("next") || t.includes("vue") || t.includes("frontend") || t.includes("css")) {
    return {
      gradient: "from-blue-600 via-indigo-600 to-violet-700",
      accent: "text-blue-400",
      bgSoft: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: <Globe className="w-10 h-10 text-white/90" />,
      tag: "Web Development",
    };
  }

  if (cat.includes("ai") || cat.includes("intelligence") || t.includes("machine learning") || t.includes("gemini") || t.includes("gpt")) {
    return {
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      accent: "text-purple-400",
      bgSoft: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: <Sparkles className="w-10 h-10 text-white/90" />,
      tag: "Artificial Intelligence",
    };
  }

  if (cat.includes("database") || cat.includes("sql") || t.includes("postgresql") || t.includes("mysql") || t.includes("redis")) {
    return {
      gradient: "from-sky-600 via-blue-700 to-indigo-900",
      accent: "text-sky-400",
      bgSoft: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      icon: <Database className="w-10 h-10 text-white/90" />,
      tag: "Database & SQL",
    };
  }

  if (cat.includes("security") || cat.includes("cyber") || t.includes("ethical") || t.includes("network")) {
    return {
      gradient: "from-zinc-800 via-slate-800 to-neutral-900",
      accent: "text-cyan-400",
      bgSoft: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      icon: <Shield className="w-10 h-10 text-white/90" />,
      tag: "Cybersecurity",
    };
  }

  if (cat.includes("fundamental") || t.includes("dasar") || t.includes("algoritma")) {
    return {
      gradient: "from-amber-600 via-orange-600 to-red-600",
      accent: "text-amber-400",
      bgSoft: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: <Layers className="w-10 h-10 text-white/90" />,
      tag: "Fundamental CS",
    };
  }

  // Default: Programming
  return {
    gradient: "from-indigo-600 via-violet-600 to-blue-700",
    accent: "text-indigo-400",
    bgSoft: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    icon: <Terminal className="w-10 h-10 text-white/90" />,
    tag: category || "Programming",
  };
}

export default function CourseCard({ course }: { course: CourseCardData }) {
  const reviews = course.reviews || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  const visual = getCategoryVisual(course.category, course.title);

  const levelColor =
    course.level === "Pemula"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : course.level === "Menengah"
        ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
        : "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail Banner */}
      <div className="aspect-[16/10] relative shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Bespoke Gradient Banner */
          <div
            className={`w-full h-full bg-linear-to-br ${visual.gradient} p-6 flex flex-col justify-between relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />

            {/* Top Row: Category Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                {visual.tag}
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm">
                {visual.icon}
              </div>
            </div>

            {/* Center/Bottom Highlight */}
            <div className="relative z-10 pt-4">
              <p className="text-white font-extrabold text-lg line-clamp-2 leading-tight tracking-tight drop-shadow-xs">
                {course.title}
              </p>
            </div>
          </div>
        )}

        {/* Level Badge Overlay */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl backdrop-blur-md border ${levelColor}`}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-3">
          <span
            className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${visual.bgSoft}`}
          >
            {course.category}
          </span>
          <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 text-xs font-black">
            <Star className="w-4 h-4 fill-current" />
            <span>{avgRating > 0 ? avgRating.toFixed(1) : "Baru"}</span>
            {totalReviews > 0 && (
              <span className="text-gray-400 dark:text-gray-500 text-[11px] font-normal">
                ({totalReviews})
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
          {course.description || "Tingkatkan keahlian teknologimu dengan kurikulum berbasis praktik nyata."}
        </p>

        {/* Bottom Details */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center">
          {/* Instructor */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
              {course.instructor?.fullName?.charAt(0) || "L"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                {course.instructor?.fullName || "Learnify Mentor"}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                Instruktur
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            {course.price === 0 ? (
              <span className="inline-flex items-center text-xs font-black px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Gratis
              </span>
            ) : (
              <span className="text-base font-black text-blue-600 dark:text-blue-400 tracking-tight">
                Rp {course.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

