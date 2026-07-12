"use client";

import { useState, useEffect } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        aria-label="Notifikasi"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900 min-w-[18px] text-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Responsive: full width on mobile, fixed width on desktop */}
          <div className="absolute right-0 mt-2 w-[min(320px,calc(100vw-1rem))] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                  Tidak ada notifikasi
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${
                      !n.isRead ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <p
                        className={`text-sm font-bold leading-snug ${!n.isRead ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}
                      >
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded shrink-0"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => {
                            setIsOpen(false);
                            markAsRead(n.id);
                          }}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                        >
                          Lihat <ExternalLink className="w-2 h-2" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
