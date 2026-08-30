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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Wryte<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Search Bar - Hidden on small mobile */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center max-w-md w-full relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300"
        >
          <Search className="absolute left-4 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search articles, tags, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-11 pr-4 py-2 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
          />
        </form>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Create Post button for authenticated users */}
          {currentUser && (
            <Link
              href="/posts/create"
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle size={14} />
              Write Post
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {currentUser ? (
            <>
              {/* Notification icon with count badge */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-zinc-950 scale-90 animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Avatar & Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <img
                    src={currentUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover shadow-sm"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-2 py-3 animate-fade-in">
                      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                          {currentUser.displayName || currentUser.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {currentUser.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-zinc-400" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href={`/profile/${currentUser._id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <User size={16} className="text-zinc-400" />
                        My Profile
                      </Link>

                      <Link
                        href="/bookmarks"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Bookmark size={16} className="text-zinc-400" />
                        Bookmarks
                      </Link>

                      <Link
                        href="/profile/edit"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Settings size={16} className="text-zinc-400" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors text-left"
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
              {/* Unauthenticated Actions */}
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
