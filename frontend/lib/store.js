import { create } from "zustand";

// Safe localStorage helper for SSR support
const getLocalStorageItem = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading localStorage key", key, error);
    return defaultValue;
  }
};

const setLocalStorageItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing localStorage key", key, error);
  }
};

// 1. Authentication Zustand Store
export const useAuthStore = create((set) => ({
  user: getLocalStorageItem("wryte_user", null),
  token: getLocalStorageItem("wryte_token", null),
  
  login: (user, token) => {
    set({ user, token });
    setLocalStorageItem("wryte_user", user);
    setLocalStorageItem("wryte_token", token);
  },
  
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("wryte_user");
      window.localStorage.removeItem("wryte_token");
    }
  },

  updateUser: (updatedUser) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedUser };
      setLocalStorageItem("wryte_user", newUser);
      return { user: newUser };
    });
  }
}));

// 2. Visual Theme & Accent Store
export const useThemeStore = create((set) => ({
  theme: getLocalStorageItem("wryte_theme", "light"),

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      setLocalStorageItem("wryte_theme", newTheme);
      
      // Update HTML classes
      if (typeof document !== "undefined") {
        const root = document.documentElement;
        if (newTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
      return { theme: newTheme };
    });
  },

  initTheme: () => {
    if (typeof window === "undefined") return;
    const currentTheme = getLocalStorageItem("wryte_theme", "light");
    const root = document.documentElement;
    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    set({ theme: currentTheme });
  }
}));

// 3. Global Notification Store
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    // Treat any notification that doesn't have isRead = true as unread
    const unread = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },

  addNotification: (notif) => {
    set((state) => {
      // Avoid duplicate keys
      const exists = state.notifications.some((n) => n._id === notif._id);
      if (exists) return {};
      return {
        notifications: [notif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  clearUnreadCount: () => {
    set({ unreadCount: 0 });
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  }
}));

// 4. Custom Floating Toast Store
export const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 4000);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

