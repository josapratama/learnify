"use client";

import { useState } from "react";
import CreateCourseModal from "./CreateCourseModal";
import { PlusCircle } from "lucide-react";

export default function InstructorDashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Dashboard Instruktur
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Kelola kursus dan pantau performa pengajaran Anda.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Kursus Baru</span>
        </button>
      </div>

      {isModalOpen && <CreateCourseModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
