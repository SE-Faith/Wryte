"use client";

import React, { useEffect } from "react";
import { SWRConfig } from "swr";
import { useAuthStore, useThemeStore, useNotificationStore, useToastStore } from "../lib/store";
import { getSocket, disconnectSocket } from "../lib/socket";
import { getCsrfToken } from "../lib/api";
import ToastContainer from "./Toast";

export default function Providers({ children }) {
  const { user } = useAuthStore();
  const { initTheme } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    // 1. Initialize light/dark theme preference
    initTheme();

    // 2. Fetch double-submit cookie CSRF token in background
    getCsrfToken().catch(() => {});
  }, [initTheme]);

  useEffect(() => {
    // 3. Socket.IO connection handling
    if (user && user._id) {
      const socket = getSocket(user._id);

      if (socket) {
        socket.off("notification"); // Clean double-registers
        socket.on("notification", (notif) => {
          // Push notification to store
          addNotification(notif);
          // Fire premium floating toast
          addToast(notif.message || "New activity detected!", "success");
        });
      }
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, addNotification, addToast]);

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
      }}
    >
      {children}
      <ToastContainer />
    </SWRConfig>
  );
}
