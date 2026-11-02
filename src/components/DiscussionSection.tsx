"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Discussion {
  id: string;
  content: string;
  createdAt: string;
  user: { fullName: string; avatarUrl: string | null };
  replies?: Discussion[];
}

export default function DiscussionSection({ lessonId }: { lessonId: string }) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authWarning, setAuthWarning] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscussions();
  }, [lessonId]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discussions?lessonId=${lessonId}`);
      const data = await res.json();
      setDiscussions(data);
    } catch (error) {
      console.error("Failed to fetch discussions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    let content: string;

    if (parentId) {
      const form = e.target as HTMLFormElement;
      const input = form.elements.namedItem("replyContent") as HTMLInputElement;
      content = input?.value || "";
    } else {
      content = newComment;
    }

    if (!content.trim()) return;

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, lessonId, parentId }),
      });
      if (res.ok) {
        if (!parentId) setNewComment("");
        setReplyTo(null);
        setAuthWarning(null);
        fetchDiscussions();
      } else if (res.status === 401) {
        setAuthWarning("Silakan masuk ke akun Anda terlebih dahulu untuk mengirim diskusi.");
      }
    } catch (error) {
      console.error("Failed to post discussion", error);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Diskusi &amp; Tanya Jawab
        </h3>
      </div>

      {authWarning && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-between">
          <span>{authWarning}</span>
          <a
            href="/login"
            className="underline hover:text-amber-950 dark:hover:text-amber-100"
          >
            Masuk Sekarang
          </a>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tanyakan sesuatu atau berikan tanggapan..."
          className="w-full p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition min-h-[100px] placeholder-gray-400 dark:placeholder-gray-600"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
          >
            <Send className="w-4 h-4" /> Kirim
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            Memuat diskusi...
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            Belum ada diskusi. Jadilah yang pertama bertanya!
          </div>
        ) : (
          discussions.map((discussion) => (
            <div key={discussion.id}>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">
                  {discussion.user.fullName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {discussion.user.fullName}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDistanceToNow(new Date(discussion.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed break-words">
                    {discussion.content}
                  </p>
                  <button
                    onClick={() =>
                      setReplyTo(
                        replyTo === discussion.id ? null : discussion.id,
                      )
                    }
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" /> Balas
                  </button>

                  {replyTo === discussion.id && (
                    <form
                      onSubmit={(e) => handleSubmit(e, discussion.id)}
                      className="mt-3 pl-3 border-l-2 border-gray-100 dark:border-gray-700"
                    >
                      <input
                        name="replyContent"
                        placeholder="Tulis balasan..."
                        className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400 dark:placeholder-gray-600"
                        autoFocus
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                        >
                          Balas
                        </button>
                      </div>
                    </form>
                  )}

                  {discussion.replies && discussion.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-bold shrink-0">
                            {reply.user.fullName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="font-bold text-gray-900 dark:text-white text-xs">
                                {reply.user.fullName}
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                {formatDistanceToNow(
                                  new Date(reply.createdAt),
                                  {
                                    addSuffix: true,
                                    locale: id,
                                  },
                                )}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-xs break-words leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
