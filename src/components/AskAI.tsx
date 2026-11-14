"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  RotateCcw,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

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
  }, [messages, loading]);

  const sendMessageText = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    setInput("");
    const newHistory: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lessonTitle,
          lessonContent,
          history: messages,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Terjadi kesalahan saat memproses jawaban.";
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
            "⚠️ Tidak dapat terhubung ke server AI. Periksa koneksi internet Anda.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageText(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput("");
  };

  const promptSuggestions = [
    {
      title: "Jelaskan Sederhana",
      prompt: `Jelaskan materi "${lessonTitle}" ini secara sederhana dan mudah dipahami untuk pemula.`,
    },
    {
      title: "Studi Kasus Nyata",
      prompt: `Berikan contoh studi kasus atau implementasi nyata di dunia industri untuk topik "${lessonTitle}".`,
    },
    {
      title: "Kesalahan Umum",
      prompt: `Apa saja kesalahan umum atau jebakan pemula saat mempelajari topik "${lessonTitle}" ini?`,
    },
    {
      title: "Ringkasan 3 Poin",
      prompt: `Buat ringkasan 3 poin kunci paling penting dari materi "${lessonTitle}".`,
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all z-50 flex items-center gap-2 group scale-100 hover:scale-105 cursor-pointer border border-white/20"
        title="Buka Asisten Belajar AI"
      >
        <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-xs uppercase tracking-wider">
          Tanya AI
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm block leading-tight">
                  Asisten Belajar AI
                </span>
                <span className="text-[10px] text-blue-100 truncate max-w-[180px] block">
                  {lessonTitle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="hover:bg-white/20 p-1.5 rounded-lg transition text-blue-100 hover:text-white cursor-pointer"
                  title="Reset / Bersihkan Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition text-blue-100 hover:text-white cursor-pointer"
                title="Tutup Panel AI"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            ref={scrollRef}
          >
            {messages.length === 0 && (
              <div className="py-4 px-2 space-y-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    Halo! Ada yang ingin ditanyakan?
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
                    Saya siap menjelaskan materi <strong className="text-gray-800 dark:text-gray-200">{lessonTitle}</strong> atau membantu memecahkan kesulitan koding Anda.
                  </p>
                </div>

                {/* Prompt Suggestions */}
                <div className="text-left space-y-2 pt-2">
                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span>Saran Pertanyaan Cepat:</span>
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {promptSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendMessageText(item.prompt)}
                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-800 text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between group"
                      >
                        <span>{item.title}</span>
                        <Sparkles className="w-3 h-3 text-gray-300 group-hover:text-blue-500 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none font-medium shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700/60"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                  <span>Sedang memproses jawaban...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0 bg-white dark:bg-gray-900"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan untuk AI..."
              disabled={loading}
              className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
