"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore, useToastStore } from "../lib/store";
import api from "../lib/api";
import { Heart, Bookmark, Eye, User } from "lucide-react";

export default function BlogCard({ post, onLikeToggle, onBookmarkToggle }) {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [liked, setLiked] = useState(post.isLikedByMe || false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarkedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast("Please login to like articles", "warning");
      return;
    }
    try {
      if (liked) {
        await api.post(`/like/unlike/${post._id}`);
        setLiked(false);
        setLikesCount(Math.max(0, likesCount - 1));
        addToast("Post unliked", "success");
      } else {
        await api.post(`/like/like/${post._id}`);
        setLiked(true);
        setLikesCount(likesCount + 1);
        addToast("Post liked", "success");
      }
      if (onLikeToggle) onLikeToggle(post._id);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to toggle like", "error");
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast("Please login to bookmark articles", "warning");
      return;
    }
    try {
      if (bookmarked) {
        await api.delete(`/bookmark/post/${post._id}`);
        setBookmarked(false);
        addToast("Bookmark removed", "success");
      } else {
        await api.post(`/bookmark/post/${post._id}`);
        setBookmarked(true);
        addToast("Post bookmarked", "success");
      }
      if (onBookmarkToggle) onBookmarkToggle(post._id);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to toggle bookmark", "error");
    }
  };

  const categoryName = post.category?.name || post.categoryName || "General";
  const authorName = post.author?.name || post.authorName || "Wryte Author";
  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Recent";

  const coverImage =
    post.image ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Link href={`/posts/${post._id}`} className="block overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <img
          src={coverImage}
          alt={post.title}
          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          {categoryName}
        </span>

        <h3 className="text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          <Link href={`/posts/${post._id}`}>{post.title}</Link>
        </h3>

        {post.content && (
          <p className="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.content.replace(/<[^>]*>/g, "")}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <div className="flex min-w-0 items-center gap-2">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={authorName}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                <User size={12} />
              </div>
            )}
            <div className="min-w-0 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="block truncate">{authorName}</span>
              <span className="block">{dateStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {post.views || 0}
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${liked ? "text-rose-500" : "text-zinc-500 dark:text-zinc-400"}`}
              aria-label="Like post"
            >
              <Heart size={13} className={liked ? "fill-rose-500" : ""} />
              {likesCount}
            </button>
            <button
              onClick={handleBookmark}
              className={`inline-flex items-center ${bookmarked ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 dark:text-zinc-400"}`}
              aria-label="Bookmark post"
            >
              <Bookmark size={13} className={bookmarked ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
