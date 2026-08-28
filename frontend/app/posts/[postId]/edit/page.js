"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../../../../lib/api";
import { useAuthStore, useToastStore } from "../../../../lib/store";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { SinglePostSkeleton } from "../../../../components/Skeletons";

import { Compass, Send, Calendar, LayoutDashboard, Image as ImageIcon, ChevronRight } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function EditPostPage({ params }) {
  const router = useRouter();
  const { postId } = use(params);
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState("write"); // write | preview

  // 1. Fetch Post Details
  const { data: postData, isLoading: postLoading } = useSWR(
    postId ? `/post/${postId}` : null,
    fetcher
  );

  const post = postData?.post;

  // 2. Prepopulate existing values
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSubTitle(post.subTitle || "");
      setContent(post.content || "");
      setCategoryId(post.category?._id || post.category || "");
      setCoverImage(post.image || "");
      setStatus(post.status || "draft");

      if (post.tags && post.tags.length > 0) {
        // extract string tag names
        const extractedTags = post.tags.map((t) => t.name || t).join(", ");
        setTagInput(extractedTags);
      }
    }
  }, [post]);

  // 3. Fetch categories
  const { data: categoriesData } = useSWR("/category/all", fetcher);
  const categories = categoriesData?.categories || [];

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to perform this action", "warning");
      return;
    }
    if (!title || !content || !categoryId) {
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);

    const parsedTags = tagInput
      ? tagInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    try {
      const updatedData = {
        title,
        subTitle,
        content,
        category: categoryId,
        tags: parsedTags,
        status: status.toLowerCase(),
        image: coverImage || null,
      };

      await api.put(`/post/${postId}`, updatedData);
      
      addToast("Post updated successfully!", "success");
      router.push(`/posts/${postId}`);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update post", "error");
    } finally {
      setLoading(false);
    }
  };

  if (postLoading) return <SinglePostSkeleton />;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-zinc-50 dark:bg-zinc-950">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
          <span>Wryte</span>
          <ChevronRight size={12} />
          <span>Editor</span>
          <ChevronRight size={12} />
          <span className="text-zinc-900 dark:text-zinc-50">Edit post</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit article
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Modify and polish your shared article.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Block */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
              {/* Title */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-black text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none"
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <input
                  type="text"
                  placeholder="Enter compelling description..."
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-zinc-500 dark:text-zinc-400 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none"
                />
              </div>

              {/* Editor Tabs */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800 pb-2 gap-4">
                <button
                  type="button"
                  onClick={() => setEditorMode("write")}
                  className={`text-xs font-bold pb-1.5 border-b-2 transition-all ${
                    editorMode === "write"
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  Write Content
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`text-xs font-bold pb-1.5 border-b-2 transition-all ${
                    editorMode === "preview"
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  Live Preview
                </button>
              </div>

              {/* Rich Content Editor Textarea vs Preview Pane */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-450 dark:text-zinc-550 block">
                  {editorMode === "write" ? "Write your story (HTML / plain text supported)" : "Story Preview"}
                </label>
                {editorMode === "write" ? (
                  <textarea
                    id="content"
                    placeholder="Body content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[400px] resize-y leading-relaxed"
                    required
                  />
                ) : (
                  <div
                    className="rich-text p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl min-h-[400px] text-zinc-800 dark:text-zinc-200 overflow-y-auto leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: content || "<p class='text-zinc-400 italic'>Nothing to preview yet. Start writing in the 'Write Content' tab...</p>"
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar setting */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <LayoutDashboard size={16} className="text-blue-500" />
                Update Settings
              </h3>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-2.5 px-4 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-500 font-bold mt-1.5 animate-pulse">
                    ⚠️ No categories found. An admin must create categories before you can update stories.
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="ideas, news, tech"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-2.5 px-4 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Cover Image URL
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <ImageIcon className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="https://example.com/cover.png"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-2.5 px-4 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Immediately</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-all duration-200 disabled:opacity-50 text-sm mt-4 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} />
                    Update Article
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
