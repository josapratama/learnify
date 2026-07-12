"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  AlertCircle,
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

  if (showResult) {
    const passed = score / quizzes.length >= 0.7;
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {passed ? "Selamat! Kamu Lulus" : "Ayo Coba Lagi!"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Skor kamu:{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {score} dari {quizzes.length}
          </span>{" "}
          ({Math.round((score / quizzes.length) * 100)}%)
        </p>
        <button
          onClick={() => {
            setCurrentIdx(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setScore(0);
            setShowResult(false);
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Ulangi Kuis
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Progress */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-blue-600 font-bold">
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
