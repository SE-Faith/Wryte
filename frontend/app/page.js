"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { GridSkeleton } from "../components/Skeletons";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";

  useEffect(() => {
    setSelectedCategory(categoryFilter);
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  const { data: categoriesData } = useSWR("/category/all", fetcher);
  const categories = categoriesData?.categories || [];

  const buildPostUrl = () => {
    let url = `/post/all?page=${currentPage}&limit=6`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory && selectedCategory !== "all") {
      url += `&category=${selectedCategory}`;
    }
    return url;
  };

  const { data: postsData, error: postsError, isLoading: postsLoading } = useSWR(buildPostUrl(), fetcher);

  const posts = postsData?.posts?.posts || postsData?.posts || [];
  const totalPages = postsData?.posts?.totalPages || 1;

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${catId}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              {searchQuery ? "Search" : "Journal"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {searchQuery ? `Results for “${searchQuery}”` : "Latest stories"}
            </h1>
          </div>
          {categories.length > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {categories.length} topics available
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${selectedCategory === "all"
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${selectedCategory === cat._id
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {postsLoading ? (
        <GridSkeleton count={6} />
      ) : postsError ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-rose-500">Could not load articles.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <Compass size={36} className="text-zinc-400" />
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No stories found</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Try a different filter or clear the current search.
            </p>
          </div>
          <button
            onClick={() => handleCategoryClick("all")}
            className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            <ArrowLeft size={14} />
            Prev
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Next
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <Suspense
          fallback={
            <div className="mx-auto max-w-5xl px-4 py-8">
              <GridSkeleton count={6} />
            </div>
          }
        >
          <MainContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
