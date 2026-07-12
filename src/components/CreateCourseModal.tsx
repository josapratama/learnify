"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, X } from "lucide-react";

export default function CreateCourseModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "0",
    category: "Programming",
    level: "beginner",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const course = await res.json();
        router.push(`/instructor/courses/${course.id}/edit`);
        onClose();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to create course", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";

  const labelClass =
    "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Buat Kursus Baru
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Judul Kursus</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, ""),
                })
              }
              className={inputClass}
              placeholder="Misal: Belajar Next.js Dasar"
            />
          </div>

          <div>
            <label className={labelClass}>Slug URL</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className={inputClass}
              placeholder="belajar-nextjs-dasar"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className={inputClass}
              >
                <option>Programming</option>
                <option>Web Development</option>
                <option>Internet of Things</option>
                <option>Fundamental</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className={inputClass}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Harga (Rp)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className={inputClass}
              placeholder="0 untuk gratis"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Buat Kursus & Lanjut ke Kurikulum
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
