"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string | null;
}

interface QuizPlayerProps {
  quizzes: QuizQuestion[];
  lessonId: string;
  onComplete?: () => void;
}

export default function QuizPlayer({
  quizzes,
  lessonId,
  onComplete,
}: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showReview, setShowReview] = useState(false);

  const currentQuiz = quizzes[currentIdx];

  const handleAnswer = () => {
    if (selectedOption === null) return;
    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    if (selectedOption === currentQuiz.correctOption) setScore(score + 1);
    setIsAnswered(true);
  };

  const saveAttempt = async (finalScore: number, finalAnswers: number[]) => {
    try {
      await fetch("/api/quizzes/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          score: finalScore,
          answers: finalAnswers,
        }),
      });
    } catch (error) {
      console.error("Failed to save attempt", error);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < quizzes.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      saveAttempt(score, userAnswers);
      onComplete?.();
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    setShowReview(false);
  };

  if (showResult) {
    const passed = quizzes.length > 0 ? score / quizzes.length >= 0.7 : false;
    const percentScore =
      quizzes.length > 0 ? Math.round((score / quizzes.length) * 100) : 0;

    return (
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
              passed
                ? "bg-green-100 dark:bg-green-900/40 text-green-600"
                : "bg-red-100 dark:bg-red-900/40 text-red-600"
            }`}
          >
            {passed ? (
              <CheckCircle2 className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
            {passed ? "🎉 Selamat! Kamu Berhasil Lulus" : "💪 Ayo Coba Lagi!"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Skor kamu:{" "}
            <span className="font-black text-gray-900 dark:text-white">
              {score} dari {quizzes.length} Soal Benar
            </span>{" "}
            ({percentScore}%)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowReview(!showReview)}
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <FileCheck2 className="w-4 h-4 text-blue-500" />
              <span>{showReview ? "Tutup Tinjauan" : "Tinjau Kunci Jawaban & Pembahasan"}</span>
            </button>

            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>

        {/* Detailed Review Section */}
        {showReview && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Rincian Evaluasi Jawaban</span>
            </h3>

            {quizzes.map((quiz, qIdx) => {
              const studentAnswerIdx = userAnswers[qIdx];
              const isCorrect = studentAnswerIdx === quiz.correctOption;

              return (
                <div
                  key={quiz.id}
                  className={`p-5 rounded-2xl border text-left ${
                    isCorrect
                      ? "bg-green-50/40 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                      : "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700">
                      Soal #{qIdx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                        isCorrect
                          ? "bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Kurang Tepat
                        </>
                      )}
                    </span>
                  </div>

                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-4 leading-relaxed">
                    {quiz.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-2 mb-4">
                    {quiz.options.map((opt, oIdx) => {
                      const isChosen = studentAnswerIdx === oIdx;
                      const isTargetCorrect = quiz.correctOption === oIdx;

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between border ${
                            isTargetCorrect
                              ? "bg-green-100/70 dark:bg-green-900/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200 font-bold"
                              : isChosen && !isTargetCorrect
                                ? "bg-red-100/70 dark:bg-red-900/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 font-bold line-through"
                                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <span>{opt}</span>
                          {isTargetCorrect && (
                            <span className="text-[11px] font-black uppercase text-green-700 dark:text-green-300 px-2 py-0.5 rounded bg-green-200/60 dark:bg-green-800/40">
                              Kunci Jawaban
                            </span>
                          )}
                          {isChosen && !isTargetCorrect && (
                            <span className="text-[11px] font-black uppercase text-red-700 dark:text-red-300 px-2 py-0.5 rounded bg-red-200/60 dark:bg-red-800/40">
                              Jawaban Kamu
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation text */}
                  {quiz.explanation && (
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block mb-0.5">
                          Pembahasan:
                        </span>
                        {quiz.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Progress */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
          <HelpCircle className="w-5 h-5" />
          <span>
            Pertanyaan {currentIdx + 1} dari {quizzes.length}
          </span>
        </div>
        <div className="w-32 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
        {currentQuiz.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-10">
        {currentQuiz.options.map((option, idx) => (
          <button
            key={idx}
            disabled={isAnswered}
            onClick={() => setSelectedOption(idx)}
            className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between ${
              isAnswered
                ? idx === currentQuiz.correctOption
                  ? "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400"
                  : selectedOption === idx
                    ? "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400"
                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                : selectedOption === idx
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400"
                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
          >
            <span className="font-medium">{option}</span>
            {isAnswered && idx === currentQuiz.correctOption && (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            {isAnswered &&
              selectedOption === idx &&
              idx !== currentQuiz.correctOption && (
                <XCircle className="w-5 h-5 shrink-0" />
              )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {isAnswered && currentQuiz.explanation && (
        <div className="mb-10 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-300 italic">
            <span className="font-bold text-gray-800 dark:text-white not-italic block mb-1">
              Penjelasan:
            </span>
            {currentQuiz.explanation}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleAnswer}
            disabled={selectedOption === null}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-10 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-white transition disabled:opacity-50"
          >
            Jawab
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
          >
            {currentIdx + 1 === quizzes.length ? "Lihat Hasil" : "Lanjut"}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
