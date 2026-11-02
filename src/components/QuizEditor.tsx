"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit3,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string | null;
}

type QuizDraft = Omit<Quiz, "id">;

interface QuizEditorProps {
  lessonId: string;
  isNewLesson?: boolean;
  lessonTitle?: string;
  lessonContent?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeEmptyDraft(): QuizDraft {
  return {
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    explanation: "",
  };
}

function validateDraft(form: QuizDraft): string | null {
  if (!form.question.trim()) return "Pertanyaan tidak boleh kosong.";
  const filled = form.options.filter((o) => o.trim());
  if (filled.length < 2) return "Minimal 2 pilihan jawaban harus diisi.";
  if (!form.options[form.correctOption]?.trim())
    return "Jawaban benar tidak boleh kosong.";
  return null;
}

// ─── QuizForm — standalone component (OUTSIDE QuizEditor) ────────────────────

interface QuizFormProps {
  form: QuizDraft;
  onChange: (form: QuizDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  saveLabel: string;
}

function QuizForm({
  form,
  onChange,
  onSave,
  onCancel,
  isSaving,
  saveLabel,
}: QuizFormProps) {
  const setField = <K extends keyof QuizDraft>(key: K, value: QuizDraft[K]) =>
    onChange({ ...form, [key]: value });

  const setOption = (idx: number, value: string) => {
    const opts = [...form.options];
    opts[idx] = value;
    onChange({ ...form, options: opts });
  };

  const addOption = () => {
    if (form.options.length >= 6) return;
    onChange({ ...form, options: [...form.options, ""] });
  };

  const removeOption = (idx: number) => {
    if (form.options.length <= 2) return;
    const opts = form.options.filter((_, i) => i !== idx);
    const correct =
      form.correctOption >= opts.length
        ? opts.length - 1
        : form.correctOption === idx
          ? 0
          : form.correctOption > idx
            ? form.correctOption - 1
            : form.correctOption;
    onChange({ ...form, options: opts, correctOption: correct });
  };

  return (
    <div className="space-y-5 p-5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-blue-100 dark:border-blue-900/40">
      {/* Question */}
      <div>
        <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Pertanyaan
        </label>
        <textarea
          rows={3}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition text-gray-900 dark:text-white resize-none"
          placeholder="Tulis pertanyaan kuis di sini..."
          value={form.question}
          onChange={(e) => setField("question", e.target.value)}
        />
      </div>

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Pilihan Jawaban
          </label>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">
            Klik lingkaran untuk set jawaban benar
          </span>
        </div>
        <div className="space-y-2.5">
          {form.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setField("correctOption", i)}
                title="Jadikan jawaban benar"
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  form.correctOption === i
                    ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-100 dark:shadow-none"
                    : "border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 hover:border-green-400 dark:hover:border-green-600"
                }`}
              >
                {form.correctOption === i && <Check className="w-3.5 h-3.5" />}
              </button>

              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase w-4 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>

              <input
                type="text"
                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition text-gray-900 dark:text-white"
                placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
              />

              <button
                type="button"
                onClick={() => removeOption(i)}
                disabled={form.options.length <= 2}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-20 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {form.options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 text-xs font-bold text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pilihan
          </button>
        )}
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Penjelasan Jawaban{" "}
          <span className="text-gray-400 dark:text-gray-600 normal-case font-normal">
            (opsional)
          </span>
        </label>
        <textarea
          rows={2}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition text-gray-900 dark:text-white resize-none"
          placeholder="Jelaskan mengapa jawaban itu benar..."
          value={form.explanation ?? ""}
          onChange={(e) => setField("explanation", e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

// ─── QuizEditor ───────────────────────────────────────────────────────────────

export default function QuizEditor({
  lessonId,
  isNewLesson,
  lessonTitle,
  lessonContent,
}: QuizEditorProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [saving, setSaving] = useState<string | null>(null); // quiz id or "new"
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<QuizDraft>(makeEmptyDraft());

  // New question form state
  const [showNewForm, setShowNewForm] = useState(false);
  const [newDraft, setNewDraft] = useState<QuizDraft>(makeEmptyDraft());

  // Pending delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Collapsed quiz cards
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchQuizzes = useCallback(async () => {
    if (isNewLesson) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/instructor/quizzes?lessonId=${lessonId}`);
      if (!res.ok) throw new Error("Gagal memuat pertanyaan");
      setQuizzes(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId, isNewLesson]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // ── Collapse ──────────────────────────────────────────────────────────────
  const toggleCollapse = (id: string) =>
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ── AI Generate Quiz ─────────────────────────────────────────────────────
  const handleAiGenerate = async () => {
    setGeneratingAi(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/instructor/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          lessonTitle,
          lessonContent,
          autoSave: !isNewLesson,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat kuis AI");

      if (Array.isArray(data.quizzes)) {
        if (!isNewLesson) {
          // If auto-saved, refresh from API or append returned records
          setQuizzes((prev) => [...prev, ...data.quizzes]);
        } else {
          // For client preview
          setQuizzes((prev) => [
            ...prev,
            ...data.quizzes.map((q: any, i: number) => ({
              id: `draft-quiz-${Date.now()}-${i}`,
              ...q,
            })),
          ]);
        }
        setSuccessMsg(`Berhasil membuat ${data.quizzes.length} pertanyaan dengan AI! ✨`);
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memproses AI generator");
    } finally {
      setGeneratingAi(false);
    }
  };

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const err = validateDraft(newDraft);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSaving("new");
    try {
      const res = await fetch("/api/instructor/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, ...newDraft }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Gagal menyimpan");
      }
      const created = await res.json();
      setQuizzes((prev) => [...prev, created]);
      setNewDraft(makeEmptyDraft());
      setShowNewForm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const startEdit = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setEditDraft({
      question: quiz.question,
      options: [...quiz.options],
      correctOption: quiz.correctOption,
      explanation: quiz.explanation ?? "",
    });
    setError(null);
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      next.delete(quiz.id);
      return next;
    });
  };

  const handleUpdate = async (id: string) => {
    const err = validateDraft(editDraft);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSaving(id);
    try {
      const res = await fetch("/api/instructor/quizzes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editDraft }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Gagal menyimpan");
      }
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...editDraft } : q)),
      );
      setEditingId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async (id: string) => {
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch("/api/instructor/quizzes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      if (editingId === id) setEditingId(null);
      setPendingDeleteId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (isNewLesson) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
        <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
          Simpan kurikulum terlebih dahulu agar materi memiliki ID permanen untuk menambahkan kuis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
          <span className="text-sm font-black text-gray-700 dark:text-gray-300">
            {quizzes.length} Pertanyaan Kuis
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={generatingAi}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-xl hover:from-purple-700 hover:to-indigo-700 transition shadow-sm disabled:opacity-50"
          >
            {generatingAi ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {generatingAi ? "Membuat Kuis..." : "✨ Generate Kuis AI"}
          </button>

          {!showNewForm && (
            <button
              type="button"
              onClick={() => {
                setShowNewForm(true);
                setNewDraft(makeEmptyDraft());
                setError(null);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 text-white text-xs font-black rounded-xl hover:bg-orange-600 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Manual
            </button>
          )}
        </div>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/40 text-sm font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
        </div>
      )}

      {/* Quiz list */}
      {!loading && (
        <div className="space-y-3">
          {quizzes.length === 0 && !showNewForm && (
            <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
              <HelpCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-3">
                Belum ada pertanyaan kuis pada materi ini.
              </p>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={generatingAi}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> Buat Kuis Otomatis dengan AI
              </button>
            </div>
          )}

          {quizzes.map((quiz, idx) => {
            const isEditing = editingId === quiz.id;
            const isCollapsed = collapsedIds.has(quiz.id);
            const isConfirmingDelete = pendingDeleteId === quiz.id;

            return (
              <div
                key={quiz.id}
                className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900"
              >
                {/* Row header */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="w-7 h-7 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>

                  <p className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                    {quiz.question}
                  </p>

                  <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40 px-2.5 py-1 rounded-lg shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    {String.fromCharCode(65 + quiz.correctOption)}
                  </span>

                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800">
                      <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        Hapus?
                      </span>
                      <button
                        type="button"
                        onClick={() => confirmDelete(quiz.id)}
                        disabled={deleting === quiz.id}
                        className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(null)}
                        className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg hover:bg-gray-300 transition"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => toggleCollapse(quiz.id)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 transition"
                      >
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => startEdit(quiz)}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(quiz.id)}
                        disabled={deleting === quiz.id}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-40 transition"
                      >
                        {deleting === quiz.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded body */}
                {!isCollapsed && (
                  <div className="px-5 pb-5 border-t border-gray-50 dark:border-gray-800 pt-4">
                    {isEditing ? (
                      <QuizForm
                        form={editDraft}
                        onChange={setEditDraft}
                        onSave={() => handleUpdate(quiz.id)}
                        onCancel={() => {
                          setEditingId(null);
                          setError(null);
                        }}
                        isSaving={saving === quiz.id}
                        saveLabel="Simpan Perubahan"
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {quiz.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                                i === quiz.correctOption
                                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300 font-bold"
                                  : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  i === quiz.correctOption
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                              {i === quiz.correctOption && (
                                <Check className="w-3.5 h-3.5 ml-auto text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>

                        {quiz.explanation && (
                          <div className="flex gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                            <span>{quiz.explanation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* New quiz form */}
          {showNewForm && (
            <div className="border border-blue-100 dark:border-blue-900/40 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  + Pertanyaan Baru
                </span>
              </div>
              <div className="p-5">
                <QuizForm
                  form={newDraft}
                  onChange={setNewDraft}
                  onSave={handleCreate}
                  onCancel={() => {
                    setShowNewForm(false);
                    setError(null);
                  }}
                  isSaving={saving === "new"}
                  saveLabel="Tambah Pertanyaan"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
