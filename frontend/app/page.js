"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { GridSkeleton } from "../components/Skeletons";
import { ArrowLeft, ArrowRight, Compass, Users, FileText, User, X } from "lucide-react";
import Link from "next/link";

const fetcher = (url) => api.get(url).then((res) => res.data);

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [peoplePage, setPeoplePage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTab, setSearchTab] = useState("articles"); // articles | people

  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";

  useEffect(() => {
    setSelectedCategory(categoryFilter);
    setCurrentPage(1);
    setPeoplePage(1);
  }, [categoryFilter, searchQuery]);

  // Categories query
  const { data: categoriesData } = useSWR("/category/all", fetcher);
  const categories = categoriesData?.categories || [];

  // Build posts search URL
  const buildPostUrl = () => {
    let url = `/post/all?page=${currentPage}&limit=6`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory && selectedCategory !== "all") {
      url += `&category=${selectedCategory}`;
    }
    return url;
  };

  // Fetch articles/posts
  const { data: postsData, error: postsError, isLoading: postsLoading } = useSWR(buildPostUrl(), fetcher);
  const posts = postsData?.posts?.posts || postsData?.posts || [];
  const totalPostsPages = postsData?.posts?.totalPages || 1;
  const totalPostsCount = postsData?.posts?.total || posts.length;

  // Build people search URL (only when searching)
  const buildPeopleUrl = () => {
    if (!searchQuery) return null;
    return `/search/people?search=${encodeURIComponent(searchQuery)}&page=${peoplePage}&limit=6`;
  };

  // Fetch people/users
  const { data: peopleData, error: peopleError, isLoading: peopleLoading } = useSWR(buildPeopleUrl(), fetcher);
  const peopleList = peopleData?.result?.people || [];
  const totalPeoplePages = peopleData?.result?.totalPages || 1;
  const totalPeopleCount = peopleData?.result?.total || 0;

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${catId}`);
    }
  };

  const handleClearSearch = () => {
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              {searchQuery ? "Full-Text Search" : "Journal"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl flex items-center gap-3">
              {searchQuery ? (
                <>
                  <span>Results for “{searchQuery}”</span>
                  <button
                    onClick={handleClearSearch}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                  >
                    <X size={12} />
                    Clear
                  </button>
                </>
              ) : (
                "Latest stories"
              )}
            </h1>
          </div>

          {!searchQuery && categories.length > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {categories.length} topics available
            </p>
          )}
        </div>

        {/* Categories Pills (when not searching or for filtering articles) */}
        {!searchQuery && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                selectedCategory === "all"
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
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  selectedCategory === cat._id
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Result Mode Switcher (Articles vs People) */}
        {searchQuery && (
          <div className="mt-5 flex border-b border-zinc-200 dark:border-zinc-800 gap-4">
            <button
              onClick={() => setSearchTab("articles")}
              className={`flex items-center gap-2 pb-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                searchTab === "articles"
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <FileText size={16} />
              Articles ({totalPostsCount})
            </button>

            <button
              onClick={() => setSearchTab("people")}
              className={`flex items-center gap-2 pb-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                searchTab === "people"
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <Users size={16} />
              People ({totalPeopleCount})
            </button>
          </div>
        )}
      </section>

      {/* --- ARTICLES TAB --- */}
      {(!searchQuery || searchTab === "articles") && (
        <>
          {postsLoading ? (
            <GridSkeleton count={6} />
          ) : postsError ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-sm font-medium text-rose-500">Could not load articles.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950 mx-auto">
              <Compass size={36} className="text-zinc-400" />
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No articles found</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Try searching for different keywords or clear current search.
                </p>
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {totalPostsPages > 1 && (
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
                Page {currentPage} of {totalPostsPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPostsPages, currentPage + 1))}
                disabled={currentPage === totalPostsPages}
                className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Next
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* --- PEOPLE TAB --- */}
      {searchQuery && searchTab === "people" && (
        <>
          {peopleLoading ? (
            <GridSkeleton count={4} />
          ) : peopleError ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-sm font-medium text-rose-500">Could not load people search results.</p>
            </div>
          ) : peopleList.length === 0 ? (
            <div className="flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950 mx-auto">
              <Users size={36} className="text-zinc-400" />
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No people found</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  No registered users match “{searchQuery}”.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {peopleList.map((person) => (
                <div
                  key={person._id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={person.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">
                        {person.displayName || person.name}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {person.followers?.length || 0} followers
                      </p>
                      {person.bio && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {person.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    <Link
                      href={`/profile/${person._id}`}
                      className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      <User size={13} />
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPeoplePages > 1 && (
            <div className="flex items-center justify-center gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <button
                onClick={() => setPeoplePage(Math.max(1, peoplePage - 1))}
                disabled={peoplePage === 1}
                className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                <ArrowLeft size={14} />
                Prev
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {peoplePage} of {totalPeoplePages}
              </span>
              <button
                onClick={() => setPeoplePage(Math.min(totalPeoplePages, peoplePage + 1))}
                disabled={peoplePage === totalPeoplePages}
                className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Next
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
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
