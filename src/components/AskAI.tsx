"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface AskAIProps {
  lessonTitle: string;
  lessonContent: string;
}

export default function AskAI({ lessonTitle, lessonContent }: AskAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          lessonTitle,
          lessonContent,
          history: messages,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Terjadi kesalahan";
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `⚠️ ${errorMsg}` },
        ]);
        return;
      }

      if (data.text) {
        setMessages((prev) => [...prev, { role: "ai", content: data.text }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "⚠️ Tidak dapat terhubung ke AI. Periksa koneksi internet Anda.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50 flex items-center gap-2 group scale-100 hover:scale-105"
      >
        <Sparkles className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Tanya AI
        </span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold">Asisten Belajar AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-500 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            ref={scrollRef}
          >
            {messages.length === 0 && (
              <div className="text-center py-10 px-4">
                <Bot className="w-12 h-12 text-blue-200 dark:text-blue-800 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Halo! Saya asisten belajarmu. Ada bagian dari materi{" "}
                  <b className="text-gray-700 dark:text-gray-200">
                    {lessonTitle}
                  </b>{" "}
                  yang kurang jelas?
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
