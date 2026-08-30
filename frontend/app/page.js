"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { GridSkeleton } from "../components/Skeletons";
import { ArrowLeft, ArrowRight, BookOpen, Flame, Compass } from "lucide-react";

// Fetcher for SWR
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
    setCurrentPage(1); // Reset page on category or search change
  }, [categoryFilter, searchQuery]);

  // Fetch categories
  const { data: categoriesData } = useSWR("/category/all", fetcher);
  const categories = categoriesData?.categories || [];

  // Fetch posts with pagination, search and category
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

  // Filter trending posts locally for simplicity (sorted by views/likes)
  const trendingPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${catId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Hero / Welcome Banner */}
      {!searchQuery && selectedCategory === "all" && (
        <section className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 border border-zinc-200 dark:border-zinc-800 animate-fade-in">
          <div className="space-y-4 max-w-xl">
            <span className="bg-blue-600 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
              Featured Publication
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
              Publish your passions, your way.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base font-medium leading-relaxed">
              Create a unique and beautiful blog inside a premium workspace. Wryte is the easiest place to share powerful insights and discover fresh viewpoints.
            </p>
          </div>
          <div className="shrink-0 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 backdrop-blur-md max-w-xs w-full shadow-sm">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-zinc-900 dark:text-zinc-100">
              <Compass size={18} className="text-blue-500" /> Explore Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 border border-zinc-200 dark:border-zinc-600 px-2.5 py-1.5 rounded-full transition-colors font-medium text-zinc-700 dark:text-zinc-200"
                >
                  #{cat.name}
                </button>
              ))}
              {categories.length === 0 && (
                <span className="text-xs text-zinc-400">No categories found.</span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. Trending / Featured section */}
      {!searchQuery && selectedCategory === "all" && trendingPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <Flame className="text-amber-500 fill-amber-500" size={20} />
            <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-wider">
              Trending Articles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Feed Navigation & Filter Pills */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-500" size={20} />
            <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-wider">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Stories"}
            </h2>
          </div>

          {/* Categories Horizontal scrolling list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar shrink-0">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all shrink-0 border ${
                selectedCategory === "all"
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all shrink-0 border ${
                  selectedCategory === cat._id
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Posts Grid */}
        {postsLoading ? (
          <GridSkeleton count={6} />
        ) : postsError ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-rose-500 font-semibold mb-2">Error Loading Articles</p>
            <p className="text-sm text-zinc-500">Could not communicate with Express backend API.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-lg mx-auto flex flex-col items-center gap-4">
            <Compass size={48} className="text-zinc-300 dark:text-zinc-700 animate-bounce" />
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No stories found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              We couldn&apos;t find any posts. Try adjusting your category filters or search queries.
            </p>
            <button
              onClick={() => handleCategoryClick("all")}
              className="text-xs bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 rounded-full font-semibold mt-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* 5. Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Previous
            </button>
            <span className="text-sm font-semibold text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              Next
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <GridSkeleton count={6} />
          </div>
        }>
          <MainContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
