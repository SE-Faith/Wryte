"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import { User, Settings, Image as ImageIcon, Link as LinkIcon, Compass, Award, Save } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function EditProfilePage() {
  const router = useRouter();
  const { user: currentUser, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch current profile from backend to ensure we have the absolute latest
  const { data: profileData } = useSWR(currentUser ? "/profile/get" : null, fetcher);
  const profile = profileData?.user;

  // 2. Prepopulate state
  useEffect(() => {
    const userToUse = profile || currentUser;
    if (userToUse) {
      setName(userToUse.name || "");
      setDisplayName(userToUse.displayName || "");
      setBio(userToUse.bio || "");
      setAvatar(userToUse.avatar || "");
      
      if (userToUse.socialLinks) {
        setWebsite(userToUse.socialLinks.website || "");
        setGithub(userToUse.socialLinks.github || "");
        setTwitter(userToUse.socialLinks.twitter || "");
        setInstagram(userToUse.socialLinks.instagram || "");
      }
    }
  }, [profile, currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      addToast("Please login to update your profile settings", "warning");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name,
        displayName,
        bio,
        avatar,
        socialLinks: {
          website,
          github,
          twitter,
          instagram,
        },
      };

      const res = await api.put("/profile/update", updateData);
      
      // Update local Zustand store
      updateUser({
        name,
        displayName,
        bio,
        avatar,
        socialLinks: { website, github, twitter, instagram },
      });

      addToast("Profile updated successfully!", "success");
      router.push(`/profile/${currentUser._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-white dark:bg-zinc-950 animate-fade-in">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Settings size={28} className="text-blue-500" />
            Profile Settings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Customize how you appear to others on the Wryte platform.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Core details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <User size={16} className="text-blue-500" />
              About Me
            </h3>

            {/* Profile Avatar Url */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Avatar Image URL
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                />
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex-1">
                  <ImageIcon className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.png"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>
            </div>

            {/* Display Name & Username (name) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-2.5 px-4 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-2.5 px-4 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Short Biography
              </label>
              <textarea
                placeholder="Tell the Wryte community about yourself, your skills, or passions..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-800 dark:text-zinc-200 min-h-[120px] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Card 2: Social Links */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <LinkIcon size={16} className="text-blue-500" />
              Social Profiles & Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Personal Website / Link
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <LinkIcon className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="https://johndoe.me"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  GitHub Username
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Award className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="johndoe-git"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Twitter Handle
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Compass className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="johndoe-tweets"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Instagram Handle
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <ImageIcon className="absolute left-4 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="johndoe-pics"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-bold px-5 py-3 rounded-full cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
