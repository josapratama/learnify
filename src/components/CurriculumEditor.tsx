"use client";

import { useState } from "react";
import {
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit3,
  Video,
  FileText,
  HelpCircle,
  Check,
  X,
  Loader2,
  Save,
  Rocket,
  FileEdit,
  Globe,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import QuizEditor from "./QuizEditor";
import { useRouter } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  orderIndex: number;
  videoUrl?: string | null;
  bodyText?: string | null;
}

interface Section {
  id: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export default function CurriculumEditor({
  initialSections,
  courseId,
  initialIsPublished,
  courseTitle,
  courseCategory,
  courseLevel,
}: {
  initialSections: any[];
  courseId: string;
  initialIsPublished: boolean;
  courseTitle?: string;
  courseCategory?: string;
  courseLevel?: string;
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  // Deletion confirmation states
  const [confirmDeleteSecId, setConfirmDeleteSecId] = useState<string | null>(null);
  const [confirmDeleteLesId, setConfirmDeleteLesId] = useState<string | null>(null);

  // AI Syllabus Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopicPrompt, setAiTopicPrompt] = useState("");
  const [aiAppendMode, setAiAppendMode] = useState<"replace" | "append">("append");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/instructor/curriculum/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, sections, isPublished }),
      });

      if (res.ok) {
        showToast("success", "Kurikulum dan status kursus berhasil disimpan!");
        router.refresh();
      } else {
        showToast("error", "Gagal menyimpan kurikulum. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Terjadi kesalahan saat menyimpan kurikulum.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiSyllabus = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/instructor/ai/generate-syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: courseTitle || "",
          courseCategory: courseCategory || "",
          courseLevel: courseLevel || "",
          topicPrompt: aiTopicPrompt || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat silabus dengan AI");

      if (Array.isArray(data.sections) && data.sections.length > 0) {
        if (aiAppendMode === "replace") {
          setSections(data.sections);
        } else {
          // Re-index appended sections
          const currentCount = sections.length;
          const reindexed = data.sections.map((sec: Section, idx: number) => ({
            ...sec,
            orderIndex: currentCount + idx + 1,
          }));
          setSections([...sections, ...reindexed]);
        }
        setShowAiModal(false);
        showToast(
          "success",
          `Berhasil membuat ${data.sections.length} modul dengan AI! Jangan lupa klik 'Simpan Semua'.`,
        );
      }
    } catch (err: any) {
      showToast("error", err.message || "Gagal membuat silabus AI");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];
    setSections(newSections);
  };

  const moveLesson = (
    sectionIndex: number,
    lessonIndex: number,
    direction: "up" | "down",
  ) => {
    const newSections = [...sections];
    const lessons = [...newSections[sectionIndex].lessons];
    const targetIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;
    [lessons[lessonIndex], lessons[targetIndex]] = [
      lessons[targetIndex],
      lessons[lessonIndex],
    ];
    newSections[sectionIndex].lessons = lessons;
    setSections(newSections);
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
    setConfirmDeleteSecId(null);
  };

  const deleteLesson = (sectionIndex: number, lessonId: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter(
      (l) => l.id !== lessonId,
    );
    setSections(newSections);
    setConfirmDeleteLesId(null);
  };

  const updateLessonContent = (
    sIndex: number,
    lIndex: number,
    field: string,
    value: string,
  ) => {
    const newSections = [...sections];
    // @ts-ignore
    newSections[sIndex].lessons[lIndex][field] = value;
    setSections(newSections);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-red-500 text-white shadow-red-500/20"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              isPublished
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
            }`}
          >
            {isPublished ? (
              <Globe className="w-6 h-6" />
            ) : (
              <FileEdit className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Status Kursus: {isPublished ? "Published" : "Draft"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isPublished
                ? "Siswa dapat melihat dan mempelajari kursus ini."
                : "Kursus hanya bisa dilihat dan disunting oleh Anda."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* AI Syllabus Generator Button */}
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-sm bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ AI Silabus</span>
          </button>

          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              isPublished
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800"
                : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/20"
            }`}
          >
            {isPublished ? (
              <FileEdit className="w-4 h-4" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            {isPublished ? "Ubah ke Draft" : "Publish Sekarang"}
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Semua
          </button>
        </div>
      </div>

      {/* AI Syllabus Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 max-w-lg w-full rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    AI Kurikulum Generator
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Rancang struktur modul dan materi secara instan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Judul Kursus
                </label>
                <input
                  type="text"
                  disabled
                  value={courseTitle || "Kursus"}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Fokus Topik / Instruksi Khusus (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={aiTopicPrompt}
                  onChange={(e) => setAiTopicPrompt(e.target.value)}
                  placeholder="Contoh: Fokus pada praktik project Next.js 15, REST API, dan deployment Vercel..."
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Metode Penggabungan
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setAiAppendMode("append")}
                    className={`p-3 rounded-xl border text-left font-medium transition ${
                      aiAppendMode === "append"
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 font-bold"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    + Tambah ke Silabus
                    <span className="block text-[11px] font-normal text-gray-500 dark:text-gray-400 mt-0.5">
                      Menambahkan modul baru di bawah
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiAppendMode("replace")}
                    className={`p-3 rounded-xl border text-left font-medium transition ${
                      aiAppendMode === "replace"
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 font-bold"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    🔄 Ganti Semua
                    <span className="block text-[11px] font-normal text-gray-500 dark:text-gray-400 mt-0.5">
                      Ganti seluruh silabus saat ini
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerateAiSyllabus}
                disabled={isGeneratingAi}
                className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-purple-500/20 disabled:opacity-60 flex items-center gap-2"
              >
                {isGeneratingAi ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGeneratingAi ? "Membuat Silabus..." : "Generate Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, sIndex) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs transition-colors"
          >
            {/* Section Header */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                {editingId === section.id ? (
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      className="bg-white dark:bg-gray-900 border border-blue-400 dark:border-blue-600 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white w-full outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        const newSections = [...sections];
                        newSections[sIndex].title = editValue;
                        setSections(newSections);
                        setEditingId(null);
                      }}
                      className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      Modul {sIndex + 1}
                    </span>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      {section.title}
                    </h4>
                    <button
                      onClick={() => {
                        setEditingId(section.id);
                        setEditValue(section.title);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSection(sIndex, "up")}
                  disabled={sIndex === 0}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 disabled:opacity-20"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSection(sIndex, "down")}
                  disabled={sIndex === sections.length - 1}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 disabled:opacity-20"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {confirmDeleteSecId === section.id ? (
                  <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded-lg border border-red-200 dark:border-red-800 text-xs">
                    <span className="text-red-600 dark:text-red-400 font-semibold mr-1">
                      Hapus modul?
                    </span>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="px-2 py-0.5 bg-red-600 text-white rounded font-bold hover:bg-red-700"
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => setConfirmDeleteSecId(null)}
                      className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-bold"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteSecId(section.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 ml-2"
                    title="Hapus Modul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Lessons Inside Section */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {section.lessons.map((lesson, lIndex) => (
                <div key={lesson.id} className="transition-colors">
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
                        {lesson.contentType === "video" ? (
                          <Video className="w-4 h-4 text-blue-500" />
                        ) : lesson.contentType === "quiz" ? (
                          <HelpCircle className="w-4 h-4 text-orange-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {editingId === lesson.id ? (
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <input
                            type="text"
                            className="bg-white dark:bg-gray-900 border border-blue-400 dark:border-blue-600 rounded-lg px-3 py-1 text-sm font-semibold text-gray-900 dark:text-white w-full outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              const newSections = [...sections];
                              newSections[sIndex].lessons[lIndex].title = editValue;
                              setSections(newSections);
                              setEditingId(null);
                            }}
                            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {lesson.title}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(lesson.id);
                              setEditValue(lesson.title);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lesson.contentType}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[sIndex].lessons[lIndex].contentType =
                            e.target.value;
                          setSections(newSections);
                        }}
                        className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-gray-600 dark:text-gray-400 outline-none"
                      >
                        <option value="article">Artikel / Catatan</option>
                        <option value="video">Video</option>
                        <option value="quiz">Kuis Pilihan Ganda</option>
                      </select>

                      <button
                        onClick={() =>
                          setExpandedLesson(
                            expandedLesson === lesson.id ? null : lesson.id,
                          )
                        }
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                          expandedLesson === lesson.id
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        {expandedLesson === lesson.id ? "Tutup Edit" : "Isi Materi"}
                      </button>

                      <div className="flex items-center gap-0.5 border-l border-gray-100 dark:border-gray-800 pl-2">
                        <button
                          onClick={() => moveLesson(sIndex, lIndex, "up")}
                          disabled={lIndex === 0}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 disabled:opacity-20"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveLesson(sIndex, lIndex, "down")}
                          disabled={lIndex === section.lessons.length - 1}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 disabled:opacity-20"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {confirmDeleteLesId === lesson.id ? (
                          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded-lg border border-red-200 dark:border-red-800 text-xs ml-1">
                            <span className="text-red-600 dark:text-red-400 font-semibold mr-1">
                              Hapus?
                            </span>
                            <button
                              onClick={() => deleteLesson(sIndex, lesson.id)}
                              className="px-2 py-0.5 bg-red-600 text-white rounded font-bold hover:bg-red-700"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setConfirmDeleteLesId(null)}
                              className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-bold"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteLesId(lesson.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 ml-1"
                            title="Hapus Materi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Editor */}
                  {expandedLesson === lesson.id && (
                    <div className="px-6 sm:px-8 pb-8 pt-2 bg-blue-50/30 dark:bg-blue-900/5 border-t border-blue-50 dark:border-blue-900/20 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 shadow-xs">
                        {lesson.contentType === "video" ? (
                          <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              URL Video (YouTube / Vimeo / MP4)
                            </label>
                            <input
                              type="text"
                              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition text-gray-900 dark:text-white"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={lesson.videoUrl || ""}
                              onChange={(e) =>
                                updateLessonContent(
                                  sIndex,
                                  lIndex,
                                  "videoUrl",
                                  e.target.value,
                                )
                              }
                            />
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                              * Masukkan URL video untuk ditampilkan di pemutar video.
                            </p>
                          </div>
                        ) : lesson.contentType === "article" ? (
                          <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Isi Materi (Markdown Didukung)
                            </label>
                            <textarea
                              rows={8}
                              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition font-mono text-gray-900 dark:text-white"
                              placeholder="Tuliskan isi materi lengkap di sini..."
                              value={lesson.bodyText || ""}
                              onChange={(e) =>
                                updateLessonContent(
                                  sIndex,
                                  lIndex,
                                  "bodyText",
                                  e.target.value,
                                )
                              }
                            />
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                                * Anda dapat menggunakan format Markdown seperti # Judul, **Tebal**, list, dsb.
                              </p>
                              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                Preview Aktif
                              </div>
                            </div>
                          </div>
                        ) : (
                          <QuizEditor
                            lessonId={lesson.id}
                            isNewLesson={lesson.id.startsWith("new-")}
                            lessonTitle={lesson.title}
                            lessonContent={lesson.bodyText || ""}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => {
                  const newLesson: Lesson = {
                    id: `new-lesson-${Date.now()}`,
                    title: "Materi Baru",
                    slug: `materi-baru-${Date.now()}`,
                    contentType: "article",
                    orderIndex: section.lessons.length + 1,
                    videoUrl: "",
                    bodyText: "",
                  };
                  const newSections = [...sections];
                  newSections[sIndex].lessons.push(newLesson);
                  setSections(newSections);
                  setEditingId(newLesson.id);
                  setEditValue(newLesson.title);
                }}
                className="w-full py-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2 transition uppercase tracking-widest border-t border-gray-50 dark:border-gray-800"
              >
                <Plus className="w-4 h-4" /> Tambah Materi Baru
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            const newSection: Section = {
              id: `new-${Date.now()}`,
              title: "Modul Baru",
              orderIndex: sections.length + 1,
              lessons: [],
            };
            setSections([...sections, newSection]);
          }}
          className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 dark:text-gray-500 hover:border-blue-400 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition flex flex-col items-center gap-2 bg-white/50 dark:bg-gray-900/50"
        >
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">
            Tambah Modul Baru
          </span>
        </button>
      </div>
    </div>
  );
}
