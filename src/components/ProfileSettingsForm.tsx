"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  User,
  Globe,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ProfileSettingsFormProps {
  user: {
    fullName: string | null;
    bio: string | null;
    website: string | null;
    avatarUrl: string | null;
  };
}

export default function ProfileSettingsForm({
  user,
}: ProfileSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
    website: user.website || "",
    avatarUrl: user.avatarUrl || "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setStatus({ type: "error", msg: "Nama lengkap tidak boleh kosong." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus({ type: "success", msg: "Profil berhasil diperbarui!" });
        router.refresh();
      } else {
        const data = await res.json();
        setStatus({
          type: "error",
          msg: data.error || "Gagal menyimpan perubahan.",
        });
      }
    } catch {
      setStatus({ type: "error", msg: "Tidak dapat terhubung ke server." });
    } finally {
      setLoading(false);
    }
  };

  const ic =
    "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition outline-none placeholder-gray-400 dark:placeholder-gray-600 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
            status.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {status.msg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />{" "}
          Informasi Dasar
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={ic}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              URL Foto Profil
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                className={`${ic} pl-10`}
                placeholder="https://example.com/avatar.jpg"
              />
              <Camera className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Bio
          &amp; Profesional
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Bio Singkat
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className={`${ic} min-h-[120px] resize-y`}
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Website / Portofolio
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className={`${ic} pl-10`}
                placeholder="https://yourwebsite.com"
              />
              <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
