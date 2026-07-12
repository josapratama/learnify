"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl font-bold transition disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
      ) : (
        <LogOut className="w-5 h-5 shrink-0" />
      )}
      Keluar
    </button>
  );
}
