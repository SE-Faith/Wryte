"use client";

import React, { useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BlogCard from "../../../components/BlogCard";
import { GridSkeleton } from "../../../components/Skeletons";
import { UserCheck, UserPlus, FileText, Users, Link as LinkIcon, ShieldAlert } from "lucide-react";

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);


const fetcher = (url) => api.get(url).then((res) => res.data);

function ProfileContent({ params }) {
  const router = useRouter();
  const { userId } = use(params);
  const { user: currentUser, updateUser } = useAuthStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState("posts"); // posts | followers | following
  const [followLoading, setFollowLoading] = useState(false);

  const isSelf = currentUser && currentUser._id === userId;

  // 1. Fetch Profile Details
  const profileUrl = isSelf ? "/profile/get" : `/profile/get/${userId}`;
  const { data: profileData, error: profileError, isLoading: profileLoading, mutate: mutateProfile } = useSWR(
    userId ? profileUrl : null,
    fetcher
  );

  const profile = profileData?.user;

  // 2. Fetch User's Published Posts
  const { data: postsData, isLoading: postsLoading } = useSWR(
    userId ? `/post/all?author=${userId}` : null,
    fetcher
  );

  const posts = postsData?.posts?.posts || postsData?.posts || [];

  // 3. Fetch Followers list
  const { data: followersData, mutate: mutateFollowers } = useSWR(
    userId ? `/profile/followers/${userId}` : null,
    fetcher
  );
  
  const followersList = followersData?.followers || [];

  // 4. Fetch Following list
  const { data: followingData, mutate: mutateFollowing } = useSWR(
    userId ? `/profile/following/${userId}` : null,
    fetcher
  );

  const followingList = followingData?.following || [];

  const isFollowing = currentUser && profile?.followers?.includes(currentUser._id);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      addToast("Please login to follow creators", "warning");
      return;
    }
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/profile/unfollow/${userId}`);
        addToast(`Unfollowed ${profile.name}`, "success");
      } else {
        await api.post(`/profile/follow/${userId}`);
        addToast(`Following ${profile.name}`, "success");
      }
      mutateProfile();
      mutateFollowers();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to toggle follow status", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <GridSkeleton count={3} />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">User not found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          The requested profile does not exist or has been suspended.
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Premium Visual Profile Header Card */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* User Avatar */}
        <div className="shrink-0 relative">
          <img
            src={profile.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt={profile.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-zinc-100 dark:border-zinc-800 shadow-md"
          />
        </div>

        {/* Bio & Details */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-zinc-50">
                {profile.displayName || profile.name}
              </h1>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                @{profile.name.toLowerCase().replace(/\s+/g, "")} &bull; Joined{" "}
                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* CTA action buttons */}
            <div className="flex justify-center gap-3 shrink-0">
              {isSelf ? (
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold px-5 py-2.5 rounded-full border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer ${
                    isFollowing
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={14} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Follow Creator
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bio text */}
          {profile.bio ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium max-w-xl">
              {profile.bio}
            </p>
          ) : (
            <p className="text-xs italic text-zinc-400">No bio provided yet.</p>
          )}

          {/* Followers Counts & Social Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {profile.followers?.length || 0}{" "}
              <span className="font-normal text-zinc-400">followers</span>
            </span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {profile.following?.length || 0}{" "}
              <span className="font-normal text-zinc-400">following</span>
            </span>

            {/* Social linkages */}
            {profile.socialLinks && (
              <div className="flex items-center gap-3 shrink-0 ml-2">
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-blue-500 transition-colors"
                  >
                    <LinkIcon size={16} />
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a
                    href={`https://github.com/${profile.socialLinks.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors"
                  >
                    <GithubIcon size={16} />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${profile.socialLinks.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-blue-400 transition-colors"
                  >
                    <TwitterIcon size={16} />
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a
                    href={`https://instagram.com/${profile.socialLinks.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-pink-500 transition-colors"
                  >
                    <InstagramIcon size={16} />
                  </a>
                )}

              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Interactive Navigation Tabs */}
      <section className="space-y-6">
        <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 px-4 transition-all ${
              activeTab === "posts"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            <FileText size={16} />
            Stories ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 px-4 transition-all ${
              activeTab === "followers"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            <Users size={16} />
            Followers ({followersList.length})
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 px-4 transition-all ${
              activeTab === "following"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            <Users size={16} />
            Following ({followingList.length})
          </button>
        </div>

        {/* Tab content rendering */}
        <div className="pt-2">
          {/* Active Tab: POSTS */}
          {activeTab === "posts" && (
            <>
              {postsLoading ? (
                <GridSkeleton count={3} />
              ) : posts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm mx-auto text-zinc-400 text-sm">
                  This user hasn&apos;t published any stories yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Active Tab: FOLLOWERS */}
          {activeTab === "followers" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {followersList.map((fUser) => (
                <div
                  key={fUser._id}
                  onClick={() => router.push(`/profile/${fUser._id}`)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center gap-3 hover:shadow-md cursor-pointer transition-shadow"
                >
                  <img
                    src={fUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={fUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
                  />
                  <div className="truncate">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
                      {fUser.displayName || fUser.name}
                    </p>
                    <p className="text-xs text-zinc-400">@{fUser.name.toLowerCase().replace(/\s+/g, "")}</p>
                  </div>
                </div>
              ))}
              {followersList.length === 0 && (
                <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 col-span-full max-w-sm mx-auto text-zinc-400 text-sm w-full">
                  No followers yet.
                </div>
              )}
            </div>
          )}

          {/* Active Tab: FOLLOWING */}
          {activeTab === "following" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {followingList.map((fUser) => (
                <div
                  key={fUser._id}
                  onClick={() => router.push(`/profile/${fUser._id}`)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center gap-3 hover:shadow-md cursor-pointer transition-shadow"
                >
                  <img
                    src={fUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={fUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
                  />
                  <div className="truncate">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
                      {fUser.displayName || fUser.name}
                    </p>
                    <p className="text-xs text-zinc-400">@{fUser.name.toLowerCase().replace(/\s+/g, "")}</p>
                  </div>
                </div>
              ))}
              {followingList.length === 0 && (
                <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 col-span-full max-w-sm mx-auto text-zinc-400 text-sm w-full">
                  Not following anyone yet.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage({ params }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <GridSkeleton count={3} />
          </div>
        }>
          <ProfileContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
