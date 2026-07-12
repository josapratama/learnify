"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function LessonNotes({ lessonId }: { lessonId: string }) {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!open || fetched) return;
    fetch(`/api/notes?lessonId=${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data[0]) {
          setContent(data[0].content);
          setSaved(data[0].content);
        }
        setFetched(true);
      })
      .catch(() => setFetched(true));
  }, [open, lessonId, fetched]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, content }),
      });
      setSaved(content);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Hapus catatan ini?")) return;
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    setContent("");
    setSaved("");
  };

  return (
    <div className="mt-8 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition"
      >
        <span className="flex items-center gap-2 font-bold text-yellow-800 dark:text-yellow-400 text-sm">
          <FileText className="w-4 h-4" />
          Catatan Saya{" "}
          {saved && (
            <span className="text-xs bg-yellow-200 dark:bg-yellow-800/50 px-2 py-0.5 rounded-full">
              Tersimpan
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        )}
      </button>

      {open && (
        <div className="p-4 bg-white dark:bg-gray-900">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis catatan Anda di sini... (Ctrl+S untuk simpan)"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSave();
              }
            }}
            className="w-full p-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none min-h-[120px] resize-y placeholder-gray-400"
          />
          <div className="flex justify-between mt-3">
            <button
              onClick={handleDelete}
              disabled={!saved}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
            <button
              onClick={handleSave}
              disabled={loading || content === saved}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {content === saved ? "Tersimpan" : "Simpan (Ctrl+S)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
