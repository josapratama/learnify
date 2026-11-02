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
}: {
  initialSections: any[];
  courseId: string;
  initialIsPublished: boolean;
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
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
    if (confirm("Hapus modul ini beserta semua materinya?")) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const deleteLesson = (sectionIndex: number, lessonId: string) => {
    if (confirm("Hapus materi ini?")) {
      const newSections = [...sections];
      newSections[sectionIndex].lessons = newSections[
        sectionIndex
      ].lessons.filter((l) => l.id !== lessonId);
      setSections(newSections);
    }
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${isPublished ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"}`}
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
                ? "Siswa dapat melihat dan membeli kursus ini."
                : "Kursus hanya bisa dilihat oleh Anda."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              isPublished
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800"
                : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none"
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
            className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100 dark:shadow-none"
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

      <div className="space-y-4">
        {sections.map((section, sIndex) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors"
          >
            {/* Section Header */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 dark:bg-gray-700 p-1.5 rounded-lg cursor-move">
                  <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                {editingId === section.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      className="text-sm font-bold bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-900 rounded-lg px-3 py-1.5 outline-none shadow-inner text-gray-900 dark:text-white"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        const newSections = [...sections];
                        newSections[sIndex].title = editValue;
                        setSections(newSections);
                        setEditingId(null);
                      }}
                      className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 group">
                    {section.title}
                    <button
                      onClick={() => {
                        setEditingId(section.id);
                        setEditValue(section.title);
                      }}
                      className="p-1 text-gray-300 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSection(sIndex, "up")}
                  disabled={sIndex === 0}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSection(sIndex, "down")}
                  disabled={sIndex === sections.length - 1}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lessons List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {section.lessons.map((lesson, lIndex) => (
                <div key={lesson.id} className="group">
                  <div
                    className={`px-8 py-5 flex justify-between items-center transition ${expandedLesson === lesson.id ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/30"}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          lesson.contentType === "video"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400"
                            : lesson.contentType === "quiz"
                              ? "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/50 text-orange-600 dark:text-orange-400"
                              : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {lesson.contentType === "video" ? (
                          <Video className="w-4 h-4" />
                        ) : lesson.contentType === "quiz" ? (
                          <HelpCircle className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1">
                        {editingId === lesson.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              className="text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-900 rounded-lg px-3 py-1.5 outline-none shadow-inner w-full max-w-md text-gray-900 dark:text-white"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                            <button
                              onClick={() => {
                                const newSections = [...sections];
                                newSections[sIndex].lessons[lIndex].title =
                                  editValue;
                                setSections(newSections);
                                setEditingId(null);
                              }}
                              className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              {lesson.title}
                              <button
                                onClick={() => {
                                  setEditingId(lesson.id);
                                  setEditValue(lesson.title);
                                }}
                                className="p-1 text-gray-300 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </span>

                            {/* Content Type Toggle */}
                            <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                              {[
                                { id: "video", icon: Video, label: "Video" },
                                {
                                  id: "article",
                                  icon: FileText,
                                  label: "Teks",
                                },
                                { id: "quiz", icon: HelpCircle, label: "Kuis" },
                              ].map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => {
                                    const newSections = [...sections];
                                    newSections[sIndex].lessons[
                                      lIndex
                                    ].contentType = type.id;
                                    setSections(newSections);
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
                                    lesson.contentType === type.id
                                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-600"
                                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  }`}
                                >
                                  <type.icon className="w-3 h-3" />
                                  <span className="hidden lg:inline">
                                    {type.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() =>
                          setExpandedLesson(
                            expandedLesson === lesson.id ? null : lesson.id,
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                          expandedLesson === lesson.id
                            ? "bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none"
                            : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        {expandedLesson === lesson.id
                          ? "Tutup Edit"
                          : "Isi Materi"}
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
                        <button
                          onClick={() => deleteLesson(sIndex, lesson.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Editor */}
                  {expandedLesson === lesson.id && (
                    <div className="px-8 pb-8 pt-2 bg-blue-50/30 dark:bg-blue-900/5 border-t border-blue-50 dark:border-blue-900/20 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 shadow-sm">
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
                              * Masukkan URL video untuk ditampilkan di pemutar
                              video.
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
                                * Anda dapat menggunakan format Markdown seperti
                                # Judul, **Tebal**, dll.
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
                className="w-full py-5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2 transition uppercase tracking-widest border-t border-gray-50 dark:border-gray-800"
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
          className="w-full py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 dark:text-gray-600 hover:border-blue-300 dark:hover:border-blue-800 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition flex flex-col items-center gap-3 bg-white/50 dark:bg-gray-900/50"
        >
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">
            Tambah Modul Baru
          </span>
        </button>
      </div>
    </div>
  );
}
