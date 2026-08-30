"use client";

import React, { Suspense } from "react";
import useSWR from "swr";
import api from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BlogCard from "../../components/BlogCard";
import { GridSkeleton } from "../../components/Skeletons";
import { Heart, ShieldAlert, Compass } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

function LikedContent() {
  const { user } = useAuthStore();

  const { data: likesData, error, isLoading, mutate } = useSWR(
    user ? "/profile/history/likes" : null,
    fetcher
  );

  const likedHistory = likesData?.history || [];
  
  // Extract and format post objects from history records
  const posts = likedHistory.map((lh) => ({
    ...lh.post,
    isLikedByMe: true, // we know they are liked by user since they are in this list
  })).filter((p) => p && p._id);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Access Denied</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Please log in to view your liked stories.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-rose-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-rose-500">Failed to load likes</h2>
        <p className="text-sm text-zinc-500 mt-2">
          Could not retrieve your liked history. Try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Heart size={28} className="text-rose-500 fill-rose-500" />
          Liked Stories
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review posts you have appreciated and liked.
        </p>
      </div>

      {isLoading ? (
        <GridSkeleton count={3} />
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm mx-auto flex flex-col items-center gap-3">
          <Compass size={40} className="text-zinc-300 dark:text-zinc-700" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No liked stories yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Likes help authors grow and keep your favorite articles in one clean list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              post={post}
              onLikeToggle={() => mutate()} // reload list when liked status changes
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LikedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <GridSkeleton count={3} />
          </div>
        }>
          <LikedContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
