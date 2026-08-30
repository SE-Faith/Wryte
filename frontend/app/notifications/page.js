"use client";

import React, { useEffect, Suspense } from "react";
import useSWR from "swr";
import api from "../../lib/api";
import { useAuthStore, useNotificationStore, useToastStore } from "../../lib/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Bell, Trash2, Heart, MessageSquare, UserPlus, Info, ShieldAlert } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

function NotificationsContent() {
  const { user } = useAuthStore();
  const { setNotifications, clearUnreadCount } = useNotificationStore();
  const { addToast } = useToastStore();

  const { data: notifsData, error, isLoading, mutate } = useSWR(
    user ? "/notification" : null,
    fetcher
  );

  const notificationsList = notifsData?.notifications || [];

  // Update store notifications and clear unread badge count on render
  useEffect(() => {
    if (notificationsList.length > 0) {
      setNotifications(notificationsList);
      clearUnreadCount();
    }
  }, [notificationsList, setNotifications, clearUnreadCount]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notification/${id}`);
      addToast("Notification cleared", "success");
      mutate();
    } catch (err) {
      addToast("Failed to clear notification", "error");
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Access Denied</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Please log in to view your real-time notification alerts.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-rose-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-rose-500">Failed to load alerts</h2>
        <p className="text-sm text-zinc-500 mt-2">
          Could not communicate with the database API. Try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Bell size={28} className="text-blue-500 fill-blue-500" />
          Alert Feed
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Stay updated on likes, comments, and new followers.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : notificationsList.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm mx-auto flex flex-col items-center gap-3">
          <Bell size={40} className="text-zinc-300 dark:text-zinc-700" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Inbox is clean</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            No new notification alerts have arrived yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificationsList.map((notif) => {
            let Icon = Info;
            let iconColor = "text-blue-500 bg-blue-50 dark:bg-blue-950/40";
            
            if (notif.type === "like") {
              Icon = Heart;
              iconColor = "text-rose-500 bg-rose-50 dark:bg-rose-950/40";
            } else if (notif.type === "comment") {
              Icon = MessageSquare;
              iconColor = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            } else if (notif.type === "follow") {
              Icon = UserPlus;
              iconColor = "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40";
            }

            return (
              <div
                key={notif._id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Visual Icon indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}>
                  <Icon size={18} />
                </div>

                {/* Notification Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-850 dark:text-zinc-250 truncate">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Dismiss Action Button */}
                <button
                  onClick={(e) => handleDelete(e, notif._id)}
                  className="p-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Dismiss alert"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <Suspense fallback={
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-zinc-150 dark:bg-zinc-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        }>
          <NotificationsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
