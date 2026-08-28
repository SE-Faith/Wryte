"use client";

import React from "react";
import { useToastStore } from "../lib/store";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800";
        let Icon = Info;
        let iconColor = "text-blue-500";

        if (toast.type === "success") {
          Icon = CheckCircle;
          iconColor = "text-emerald-500";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          iconColor = "text-amber-500";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "text-rose-500";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border glass-panel animate-fade-in transition-all duration-300 ${bgColor}`}
            role="alert"
          >
            <div className={`shrink-0 ${iconColor}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
