"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  Compass,
  Code2,
  LayoutDashboard,
  FileText,
  Flame,
  User,
  LogOut,
  ChevronRight,
  Gift,
  Award,
  Sparkles,
  BookOpen,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import LiveSearch from "@/components/LiveSearch";

export interface NavbarUser {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
  avatarUrl?: string | null;
  streak?: number;
}

interface NavbarProps {
  user?: NavbarUser | null;
  showSearch?: boolean;
}

export default function Navbar({ user, showSearch = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/#courses", label: "Katalog Kursus", icon: BookOpen },
    { href: "/learning-paths", label: "Learning Paths", icon: Compass },
    { href: "/playground", label: "Playground", icon: Code2 },
  ];

  const userInitials =
    user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6 shrink-0">
              <Link
                href="/"
                className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                      Learn<span className="text-blue-600 dark:text-blue-400">ify</span>
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      LMS
                    </span>
                  </div>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-bold px-3.5 py-2 rounded-xl transition-all duration-150 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Middle: Search Bar (Desktop & Tablet) */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-md">
                <LiveSearch />
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Streak Badge (Desktop) */}
              {user && (user.streak ?? 0) > 0 && (
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-black border border-orange-200 dark:border-orange-900/60 transition-transform hover:scale-105"
                  title={`${user.streak} hari belajar berturut-turut!`}
                >
                  <Flame className="w-4 h-4 fill-current text-orange-500 animate-pulse" />
                  <span>{user.streak} Hari</span>
                </Link>
              )}

              {/* Notifications */}
              {user && <NotificationBell />}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Buttons / User Avatar Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                    aria-label="User menu"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                      {userInitials}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                            {user.fullName || "Pengguna Learnify"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                          {user.role && (
                            <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              {user.role}
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-500" />
                            Dashboard Siswa
                          </Link>
                          <Link
                            href="/notes"
                            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
                          >
                            <FileText className="w-4 h-4 text-emerald-500" />
                            Catatan Saya
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
                          >
                            <Award className="w-4 h-4 text-amber-500" />
                            Sertifikat & Profil
                          </Link>
                          <Link
                            href="/referral"
                            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
                          >
                            <Gift className="w-4 h-4 text-purple-500" />
                            Program Referral
                          </Link>
                          {(user.role === "instructor" || user.role === "admin") && (
                            <Link
                              href="/instructor"
                              className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition"
                            >
                              <Sparkles className="w-4 h-4 text-indigo-500" />
                              Mode Instruktur
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                          <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                          >
                            <LogOut className="w-4 h-4" />
                            {loggingOut ? "Keluar..." : "Keluar"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-black text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-105"
                  >
                    Daftar Gratis
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Buka navigasi mobile"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile LiveSearch (Below header for mobile) */}
          {showSearch && (
            <div className="pb-3 md:hidden">
              <LiveSearch />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-black text-gray-900 dark:text-white">
                    Learn<span className="text-blue-600">ify</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Tutup navigasi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card (if logged in) */}
              {user ? (
                <div className="my-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-gray-900 dark:text-white truncate">
                        {user.fullName || "Pengguna Learnify"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {(user.streak ?? 0) > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-xl text-xs font-black">
                      <Flame className="w-4 h-4 fill-current text-orange-500" />
                      <span>{user.streak} Hari Belajar Berturut-turut!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-5 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-black shadow-md shadow-blue-500/20"
                  >
                    Daftar Akun Gratis
                  </Link>
                </div>
              )}

              {/* Navigation Menu Links */}
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-2">
                  Menu Utama
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-500" />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mt-6 mb-2">
                      Area Belajar
                    </p>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                        <span>Dashboard Siswa</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/notes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        <span>Catatan Saya</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>Sertifikat & Profil</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/referral"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-purple-500" />
                        <span>Program Referral</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              {user && (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{loggingOut ? "Keluar..." : "Keluar Akun"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

