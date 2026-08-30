"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { SinglePostSkeleton } from "../../../components/Skeletons";
import { Heart, Bookmark, Eye, Calendar, MessageSquare, Send, ArrowLeft, Trash2, CornerDownRight, ShieldAlert, Award } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

function PostDetailContent({ params }) {
  const router = useRouter();
  const { postId } = use(params);
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [commentText, setCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // 1. Fetch Post Details
  const { data: postData, error: postError, isLoading: postLoading, mutate: mutatePost } = useSWR(
    postId ? `/post/${postId}` : null,
    fetcher
  );

  const post = postData?.post;

  // 2. Log post view history on mount
  useEffect(() => {
    if (postId && user) {
      api.post(`/profile/view/${postId}`).catch((err) => {
        console.error("Failed to log post view history:", err);
      });
    }
  }, [postId, user]);

  // 3. Sync local likes and bookmarks state with database
  useEffect(() => {
    if (post) {
      setLiked(post.isLikedByMe || false);
      setBookmarked(post.isBookmarkedByMe || false);
      setLikesCount(post.likes || 0);
    }
  }, [post]);

  // 4. Fetch Comments for this Post
  const { data: commentsData, mutate: mutateComments } = useSWR(
    postId ? `/comment?postId=${postId}` : null,
    fetcher
  );

  const rawComments = commentsData?.comments || [];

  // Group comments: find parents vs nested replies
  const parentComments = rawComments.filter((c) => !c.parent);
  const commentReplies = rawComments.filter((c) => c.parent);

  const handleLike = async () => {
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
      mutatePost();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to toggle like", "error");
    }
  };

  const handleBookmark = async () => {
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
      mutatePost();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to toggle bookmark", "error");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this article? This action is permanent.")) {
      try {
        await api.delete(`/post/${post._id}`);
        addToast("Post deleted successfully", "success");
        router.push("/");
      } catch (err) {
        addToast("Failed to delete post", "error");
      }
    }
  };

  const handleAddComment = async (e, parentId = null) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to participate in discussions", "warning");
      return;
    }

    const content = parentId ? replyText : commentText;
    if (!content.trim()) {
      addToast("Comment content cannot be empty", "warning");
      return;
    }

    try {
      await api.post("/comment", {
        content,
        post: post._id,
        author: user._id,
        parent: parentId,
      });

      addToast("Comment posted successfully!", "success");
      if (parentId) {
        setReplyText("");
        setActiveReplyId(null);
      } else {
        setCommentText("");
      }
      mutateComments();
    } catch (err) {
      addToast("Failed to post comment", "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await api.delete(`/comment/${commentId}`);
        addToast("Comment removed", "success");
        mutateComments();
      } catch (err) {
        addToast("Failed to delete comment", "error");
      }
    }
  };

  if (postLoading) return <SinglePostSkeleton />;
  if (postError || !post) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Article not found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          The post you are trying to view does not exist or has been archived.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-5 py-2 rounded-full font-bold text-xs mt-6"
        >
          Return Home
        </button>
      </div>
    );
  }

  const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : "Recent";

  const authorName = post.author?.name || post.authorName || "Wryte Author";
  const authorAvatar = post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* 1. Header Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to stories
      </button>

      {/* 2. Headline & Metadata */}
      <div className="space-y-4">
        <span className="bg-blue-500 text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-sm inline-block">
          {post.category?.name || "General"}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          {post.subTitle}
        </p>

        <div className="flex items-center justify-between border-y border-zinc-200 dark:border-zinc-800 py-4 mt-6">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{authorName}</p>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {dateStr}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={11} /> {post.views || 0} views
                </span>
              </div>
            </div>
          </div>

          {/* Social Interactions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 transition-all ${
                liked
                  ? "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/30"
                  : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <Heart size={14} className={liked ? "fill-rose-500" : ""} />
              {likesCount} Likes
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full border border-zinc-200 dark:border-zinc-800 transition-all ${
                bookmarked
                  ? "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-950/20 dark:border-blue-900/30"
                  : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              }`}
              aria-label="Bookmark article"
            >
              <Bookmark size={14} className={bookmarked ? "fill-blue-500" : ""} />
            </button>

            {/* Author Controls */}
            {user && (user._id === post.author?._id || user._id === post.author) && (
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => router.push(`/posts/${post._id}/edit`)}
                  className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 hover:opacity-85 text-xs font-bold px-4 py-2 rounded-full transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeletePost}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold p-2.5 rounded-full transition-all"
                  aria-label="Delete post"
                >
                  <Trash2 size={13.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Cover Image */}
      {post.image && (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* 4. Article Body Content */}
      <div
        className="rich-text py-4 dark:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 5. Tag List */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-6 border-b border-zinc-200 dark:border-zinc-800">
          {post.tags.map((tag) => (
            <span
              key={tag._id || tag}
              className="text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full"
            >
              #{tag.name || tag}
            </span>
          ))}
        </div>
      )}

      {/* 6. Discussion Section (Comment System) */}
      <section className="space-y-6 pt-6">
        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" />
          Discussions ({rawComments.length})
        </h3>

        {/* Add Comment Box */}
        {user ? (
          <form onSubmit={handleAddComment} className="flex gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
            />
            <div className="flex-1 space-y-3">
              <textarea
                placeholder="Share your thoughts or feedback on this article..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-800 dark:text-zinc-200 min-h-[100px] resize-none"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full text-xs shadow-md transition-all duration-200"
                >
                  <Send size={12} />
                  Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center p-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Please{" "}
              <Link href="/login" className="font-semibold text-blue-500 hover:text-blue-600">
                log in
              </Link>
              {" "}to join the discussion and share your thoughts.
            </p>
          </div>
        )}

        {/* Render Comment Threads */}
        <div className="space-y-6 pt-4">
          {parentComments.map((comment) => {
            const replies = commentReplies.filter((r) => r.parent === comment._id);
            const isOwner = user && (user._id === comment.author?._id || user._id === comment.author);

            return (
              <div key={comment._id} className="space-y-4 border-b border-zinc-100 dark:border-zinc-900 pb-6 last:border-0 last:pb-0">
                {/* Parent Comment */}
                <div className="flex gap-4">
                  <img
                    src={comment.author?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={comment.author?.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                          {comment.author?.displayName || comment.author?.name || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {user && (
                          <button
                            onClick={() => {
                              setActiveReplyId(comment._id);
                              setReplyText("");
                            }}
                            className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            Reply
                          </button>
                        )}
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Reply Form */}
                {activeReplyId === comment._id && (
                  <form onSubmit={(e) => handleAddComment(e, comment._id)} className="flex gap-4 pl-12">
                    <div className="flex-1 space-y-2">
                      <textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-800 dark:text-zinc-200 min-h-[60px] resize-none"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="text-[11px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-3 py-1.5 rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-full text-[11px]"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Nested Replies Rendering */}
                {replies.length > 0 && (
                  <div className="pl-12 space-y-4">
                    {replies.map((reply) => {
                      const isReplyOwner = user && (user._id === reply.author?._id || user._id === reply.author);
                      return (
                        <div key={reply._id} className="flex gap-3 pt-2">
                          <CornerDownRight size={14} className="text-zinc-300 dark:text-zinc-700 mt-2 shrink-0" />
                          <img
                            src={reply.author?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={reply.author?.name}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                  {reply.author?.displayName || reply.author?.name || "Anonymous"}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  {new Date(reply.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {isReplyOwner && (
                                <button
                                  onClick={() => handleDeleteComment(reply._id)}
                                  className="text-zinc-400 hover:text-rose-500 transition-colors"
                                  aria-label="Delete comment"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {parentComments.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl text-zinc-400 text-sm">
              No discussions yet. Be the first to start the conversation!
            </div>
          )}
        </div>
      </section>
    </article>
  );
}

export default function PostDetailPage({ params }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <Suspense fallback={<SinglePostSkeleton />}>
          <PostDetailContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
