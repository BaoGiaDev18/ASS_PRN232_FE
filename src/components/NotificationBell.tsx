import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../api/studentService";
import type { NotificationDto } from "../api/types";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await studentService.getNotifications();
      setNotifications(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!open) fetchNotifications();
    setOpen((prev) => !prev);
  };

  const handleClickNotification = async (notification: NotificationDto) => {
    if (!notification.isRead) {
      try {
        await studentService.markNotificationRead(notification.notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notification.notificationId
              ? { ...n, isRead: true }
              : n,
          ),
        );
      } catch {
        // silent
      }
    }
    setOpen(false);
    if (notification.questionId) {
      navigate(`/student/question/${notification.questionId}`);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-slate-400">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <span className="text-3xl block mb-2">🔔</span>
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.notificationId}
                  onClick={() => handleClickNotification(n)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !n.isRead ? "bg-orange-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.isRead ? "bg-slate-200" : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          n.isRead
                            ? "text-slate-500"
                            : "text-slate-700 font-medium"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
