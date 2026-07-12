"use client";

import { useState } from "react";
import CreateCourseModal from "./CreateCourseModal";
import { PlusCircle } from "lucide-react";

export default function InstructorDashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Instruktur</h1>
          <p className="text-gray-500 text-sm">Kelola kursus dan pantau performa pengajaran Anda.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <PlusCircle className="w-4 h-4" /> Buat Kursus Baru
        </button>
      </div>

      {isModalOpen && <CreateCourseModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
