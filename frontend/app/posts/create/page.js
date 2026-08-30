"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import { Compass, Send, FileText, Calendar, LayoutDashboard, Image as ImageIcon, ChevronRight } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("draft"); // draft | published | archived
  const [publishDate, setPublishDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState("write"); // write | preview

  // Fetch categories for dropdown
  const { data: categoriesData } = useSWR("/category/all", fetcher);
  const categories = categoriesData?.categories || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to create a post", "warning");
      return;
    }
    if (!title || !content || !categoryId) {
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);

    // Split tag strings by comma into Array
    const parsedTags = tagInput
      ? tagInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    try {
      // Create post payload matching Post schema
      const postData = {
        title,
        subTitle,
        content,
        category: categoryId,
        tags: parsedTags, // the backend can resolve name or ids, let's pass array
        status: status.toLowerCase(),
        image: coverImage || null,
        author: user._id,
        publishedAt: status === "scheduled" ? new Date(publishDate) : new Date(),
      };

      const res = await api.post("/post/create", postData);
      
      addToast(`Post ${status === "draft" ? "saved as draft" : "created"} successfully!`, "success");
      router.push("/");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-white dark:bg-zinc-950">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
          <span>Wryte</span>
          <ChevronRight size={12} />
          <span>Editor</span>
          <ChevronRight size={12} />
          <span className="text-zinc-900 dark:text-zinc-50">New post</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Write a new story
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create an inspiring and beautifully structured article.
          </p>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Section (Title, subtitle, content) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
              {/* Title Input */}
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

              {/* Subtitle / Short description */}
              <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <input
                  type="text"
                  placeholder="Enter a compelling subtitle or description..."
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
                    placeholder="Once upon a time..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[400px] resize-y leading-relaxed"
                    required
                  />
                ) : (
                  <div
                    className="rich-text p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl min-h-[400px] text-zinc-800 dark:text-zinc-200 overflow-y-auto leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: content || "<p class='text-zinc-400 italic'>Nothing to preview yet. Start writing in the 'Write Content' tab...</p>"
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar controls (category, tags, cover image, status) */}
          <div className="space-y-6">
            {/* Publish controls card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <LayoutDashboard size={16} className="text-blue-500" />
                Publish Settings
              </h3>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Category <span className="text-rose-500">*</span>
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
                    ⚠️ No categories found. An admin must create categories before you can publish stories.
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Tags (Comma separated)
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Compass className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="ideas, news, productivity"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Cover Image Input */}
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
                  <option value="scheduled">Schedule Post</option>
                </select>
              </div>

              {/* Scheduled date field */}
              {status === "scheduled" && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Schedule Publish Date
                  </label>
                  <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <Calendar className="absolute left-4 text-zinc-400" size={16} />
                    <input
                      type="datetime-local"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Action Submit */}
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
                    {status === "draft"
                      ? "Save Draft"
                      : status === "scheduled"
                      ? "Schedule Post"
                      : "Publish Article"}
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
