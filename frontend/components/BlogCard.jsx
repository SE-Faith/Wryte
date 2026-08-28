"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore, useToastStore } from "../lib/store";
import api from "../lib/api";
import { Heart, Bookmark, Eye, Calendar, User } from "lucide-react";

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

  // Safe category/author details extract
  const categoryName = post.category?.name || post.categoryName || "General";
  const authorName = post.author?.name || post.authorName || "Wryte Author";
  const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) : "Recent";

  // Cover image fallback
  const coverImage = post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Cover Image Wrapper */}
      <Link href={`/posts/${post._id}`} className="block relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={coverImage}
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-zinc-50 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
          {categoryName}
        </span>
      </Link>

      {/* Main Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Title */}
        <h3 className="text-lg font-bold leading-snug text-zinc-800 dark:text-zinc-100 group-hover:text-blue-500 transition-colors line-clamp-2">
          <Link href={`/posts/${post._id}`}>{post.title}</Link>
        </h3>

        {/* Content Preview */}
        {post.content && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {post.content.replace(/<[^>]*>/g, "")}
          </p>
        )}

        {/* Bottom Metadata */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-auto">
          {/* Author info */}
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={authorName}
                className="w-6.5 h-6.5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
            ) : (
              <div className="w-6.5 h-6.5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <User size={12} />
              </div>
            )}
            <div className="text-[11.5px] font-medium text-zinc-600 dark:text-zinc-300 truncate max-w-[100px]">
              {authorName}
            </div>
          </div>

          {/* Social Stats & Action Toggles */}
          <div className="flex items-center gap-3">
            {/* Views counter */}
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Eye size={12.5} />
              {post.views || 0}
            </span>

            {/* Like Action */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                liked
                  ? "text-rose-500"
                  : "text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400"
              }`}
              aria-label="Like post"
            >
              <Heart size={13.5} className={liked ? "fill-rose-500" : ""} />
              {likesCount}
            </button>

            {/* Bookmark Action */}
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full border border-zinc-100 dark:border-zinc-800 transition-colors ${
                bookmarked
                  ? "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-950/20 dark:border-blue-900/30"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
              aria-label="Bookmark post"
            >
              <Bookmark size={13.5} className={bookmarked ? "fill-blue-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
