"use client";

import React, { Suspense } from "react";
import useSWR from "swr";
import api from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BlogCard from "../../components/BlogCard";
import { GridSkeleton } from "../../components/Skeletons";
import { Bookmark, ShieldAlert, Compass } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

function BookmarksContent() {
  const { user } = useAuthStore();

  const { data: bookmarksData, error, isLoading, mutate } = useSWR(
    user ? `/bookmark/user/${user._id}` : null,
    fetcher
  );

  const bookmarks = bookmarksData?.bookmarks || [];
  // Extract the inner post objects from bookmarks list
  const posts = bookmarks.map((b) => ({
    ...b.post,
    isBookmarkedByMe: true, // we know they are bookmarked since they are in this list
  })).filter((p) => p && p._id); // filter out deleted posts

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Access Denied</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Please log in to view your personal bookmarks library.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-rose-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-rose-500">Failed to load bookmarks</h2>
        <p className="text-sm text-zinc-500 mt-2">
          Could not communicate with the database API. Try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Bookmark size={28} className="text-blue-500 fill-blue-500" />
          My Bookmarks
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review stories you have saved to read later.
        </p>
      </div>

      {isLoading ? (
        <GridSkeleton count={3} />
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm mx-auto flex flex-col items-center gap-3">
          <Compass size={40} className="text-zinc-300 dark:text-zinc-700" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No bookmarks yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Bookmark posts you enjoy to save them in this visual library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              post={post}
              onBookmarkToggle={() => mutate()} // reload list when unbookmarked
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <GridSkeleton count={3} />
          </div>
        }>
          <BookmarksContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
