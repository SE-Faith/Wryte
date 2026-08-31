import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, useThemeStore, useNotificationStore } from "../lib/store";
import { Sun, Moon, Bell, Search, LogOut, User, PlusCircle, LayoutDashboard, Bookmark, Settings } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? user : null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-1">
          <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Wryte
          </span>
          <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">.</span>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden w-full max-w-md items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 md:flex dark:border-zinc-800 dark:bg-zinc-900"
        >
          <Search className="mr-2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search articles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200"
          />
        </form>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {currentUser && (
            <Link
              href="/posts/create"
              className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-900 px-3 py-2 text-[11px] font-medium text-white sm:inline-flex dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
            >
              <PlusCircle size={14} />
              Write
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {currentUser ? (
            <>
              <Link
                href="/notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[9px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <img
                    src={currentUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full border border-zinc-200 object-cover dark:border-zinc-800"
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 z-50 mt-3 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="mb-2 border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {currentUser.displayName || currentUser.name}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {currentUser.email}
                        </p>
                      </div>

                      {currentUser.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <LayoutDashboard size={16} className="text-zinc-400" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href={`/profile/${currentUser._id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <User size={16} className="text-zinc-400" />
                        My Profile
                      </Link>

                      <Link
                        href="/bookmarks"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Bookmark size={16} className="text-zinc-400" />
                        Bookmarks
                      </Link>

                      <Link
                        href="/profile/edit"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Settings size={16} className="text-zinc-400" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
