"use client";

import React, { useState, Suspense } from "react";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { DashboardSkeleton } from "../../../components/Skeletons";
import {
  ShieldCheck,
  Users,
  FileText,
  Ban,
  AlertTriangle,
  ShieldAlert,
  Award,
  Mail,
  FolderPlus,
  Tag as TagIcon,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Layers,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Copy,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

const fetcher = (url) => api.get(url).then((res) => res.data);

function AdminDashboardContent() {
  const { user: currentUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState("categories"); // categories | users | tags | posts | newsletter
  const [searchUser, setSearchUser] = useState("");
  const [searchPost, setSearchPost] = useState("");

  // Category Modal / Form State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  // Tag Modal / Form State
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState("");
  const [tagDesc, setTagDesc] = useState("");
  const [tagLoading, setTagLoading] = useState(false);

  const [copiedEmails, setCopiedEmails] = useState(false);

  // --- SWR Data Fetching ---
  const isAdmin = currentUser?.role === "admin";

  const { data: usersData, isLoading: usersLoading, mutate: mutateUsers } = useSWR(
    isAdmin ? "/admin/all" : null,
    fetcher
  );

  const { data: categoriesData, isLoading: categoriesLoading, mutate: mutateCategories } = useSWR(
    "/category/all",
    fetcher
  );

  const { data: tagsData, isLoading: tagsLoading, mutate: mutateTags } = useSWR(
    "/tag",
    fetcher
  );

  const { data: postsData, isLoading: postsLoading, mutate: mutatePosts } = useSWR(
    isAdmin ? "/post/all?limit=1000" : null,
    fetcher
  );

  const { data: newsletterData, isLoading: newsletterLoading, mutate: mutateNewsletter } = useSWR(
    isAdmin ? "/newsletter/admin/subscribers" : null,
    fetcher
  );

  const usersList = usersData?.users || [];
  const categoriesList = categoriesData?.categories || [];
  const tagsList = tagsData?.tags || tagsData || [];
  const postsList = postsData?.posts?.posts || postsData?.posts || [];
  const subscribersList = newsletterData?.subscribers || [];

  // Platform statistics
  const totalUsers = usersList.length;
  const totalPosts = postsList.length;
  const adminCount = usersList.filter((u) => u.role === "admin").length;
  const activeCount = usersList.filter((u) => u.isActive !== false).length;
  const totalCategories = categoriesList.length;

  // --- User Management Actions ---
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/role/${userId}`, { role: newRole });
      addToast(`User role updated to ${newRole}`, "success");
      mutateUsers();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update role", "error");
    }
  };

  const handleToggleSuspend = async (usr) => {
    const action = usr.isSuspended ? "unsuspend" : "suspend";
    if (window.confirm(`Are you sure you want to ${action} ${usr.name}?`)) {
      try {
        await api.put(`/admin/${action}/${usr._id}`);
        addToast(`User ${action}ed successfully`, "success");
        mutateUsers();
      } catch (err) {
        addToast(err.response?.data?.message || `Failed to ${action} user`, "error");
      }
    }
  };

  const handleToggleBan = async (usr) => {
    const action = usr.isBanned ? "unban" : "ban";
    if (window.confirm(`Are you sure you want to ${action.toUpperCase()} ${usr.name}?`)) {
      try {
        await api.put(`/admin/${action}/${usr._id}`);
        addToast(`User ${action}ned successfully`, "success");
        mutateUsers();
      } catch (err) {
        addToast(err.response?.data?.message || `Failed to ${action} user`, "error");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("PERMANENT ACTION: Are you sure you want to delete this user account?")) {
      try {
        await api.delete(`/admin/user/${userId}`);
        addToast("User deleted permanently", "success");
        mutateUsers();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to delete user", "error");
      }
    }
  };

  // --- Category Actions ---
  const openCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatName(cat.name);
      setCatDesc(cat.description || "");
    } else {
      setEditingCat(null);
      setCatName("");
      setCatDesc("");
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName || !catDesc) {
      addToast("Please provide category name and description", "warning");
      return;
    }
    setCatLoading(true);
    try {
      if (editingCat) {
        await api.put(`/category/${editingCat._id}`, { name: catName, description: catDesc });
        addToast("Category updated successfully", "success");
      } else {
        await api.post("/category/create", { name: catName, description: catDesc });
        addToast("Category created successfully", "success");
      }
      setIsCatModalOpen(false);
      mutateCategories();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save category", "error");
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/category/${catId}`);
        addToast("Category deleted successfully", "success");
        mutateCategories();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to delete category", "error");
      }
    }
  };

  // --- Tag Actions ---
  const openTagModal = (tg = null) => {
    if (tg) {
      setEditingTag(tg);
      setTagName(tg.name);
      setTagDesc(tg.description || "");
    } else {
      setEditingTag(null);
      setTagName("");
      setTagDesc("");
    }
    setIsTagModalOpen(true);
  };

  const handleSaveTag = async (e) => {
    e.preventDefault();
    if (!tagName || !tagDesc) {
      addToast("Please provide tag name and description", "warning");
      return;
    }
    setTagLoading(true);
    try {
      if (editingTag) {
        await api.put(`/tag/${editingTag._id}`, { name: tagName, description: tagDesc });
        addToast("Tag updated successfully", "success");
      } else {
        await api.post("/tag", { name: tagName, description: tagDesc });
        addToast("Tag created successfully", "success");
      }
      setIsTagModalOpen(false);
      mutateTags();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save tag", "error");
    } finally {
      setTagLoading(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await api.delete(`/tag/${tagId}`);
        addToast("Tag deleted successfully", "success");
        mutateTags();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to delete tag", "error");
      }
    }
  };

  // --- Post Moderation Actions ---
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to remove this post from the platform?")) {
      try {
        await api.delete(`/post/${postId}`);
        addToast("Post deleted successfully", "success");
        mutatePosts();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to delete post", "error");
      }
    }
  };

  // --- Newsletter Actions ---
  const handleDeleteSubscriber = async (subId) => {
    if (window.confirm("Remove subscriber from list?")) {
      try {
        await api.delete(`/newsletter/admin/subscribers/${subId}`);
        addToast("Subscriber removed", "success");
        mutateNewsletter();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to remove subscriber", "error");
      }
    }
  };

  const handleCopyEmails = () => {
    const emails = subscribersList.filter((s) => s.isActive).map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    addToast("Subscribers emails copied to clipboard", "success");
    setTimeout(() => setCopiedEmails(false), 2000);
  };

  // Access Denial Guard
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert size={48} className="text-rose-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Access Denied</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          You do not have administrative privileges to access the console dashboard.
        </p>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredPosts = postsList.filter((p) =>
    p.title?.toLowerCase().includes(searchPost.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck size={32} className="text-zinc-900 dark:text-zinc-50" />
            Admin Command Console
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage categories, tags, user privileges, content moderation, and subscribers.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl flex items-center justify-center shrink-0">
            <FolderPlus size={20} />
          </div>
          <div>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Categories</p>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">{totalCategories}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Stories</p>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">{totalPosts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl flex items-center justify-center shrink-0">
            <Crown size={20} />
          </div>
          <div>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Admins</p>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">Subscribers</p>
            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">{subscribersList.length}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "categories"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850"
          }`}
        >
          <FolderPlus size={16} />
          Categories ({categoriesList.length})
        </button>

        <button
          onClick={() => setActiveTab("tags")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "tags"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850"
          }`}
        >
          <TagIcon size={16} />
          Tags ({tagsList.length})
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "users"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850"
          }`}
        >
          <Users size={16} />
          User Access ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "posts"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850"
          }`}
        >
          <FileText size={16} />
          Posts ({postsList.length})
        </button>

        <button
          onClick={() => setActiveTab("newsletter")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "newsletter"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850"
          }`}
        >
          <Mail size={16} />
          Newsletter ({subscribersList.length})
        </button>
      </div>

      {/* --- TAB 1: CATEGORIES --- */}
      {activeTab === "categories" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <FolderPlus size={20} className="text-blue-500" />
                Category Management
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Admins create categories required by authors when drafting stories.
              </p>
            </div>
            <button
              onClick={() => openCategoryModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-bold text-xs hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={16} />
              Create Category
            </button>
          </div>

          {categoriesLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesList.map((cat) => {
                const postCount = postsList.filter(
                  (p) => p.category === cat._id || p.category?._id === cat._id
                ).length;
                return (
                  <div
                    key={cat._id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-700">
                          {postCount} {postCount === 1 ? "story" : "stories"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                        {cat.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <button
                        onClick={() => openCategoryModal(cat)}
                        className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {categoriesList.length === 0 && (
                <div className="col-span-full p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
                  <FolderPlus size={36} className="mx-auto text-zinc-400 mb-2" />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No categories created yet.</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Click "Create Category" to add your first category so users can start publishing stories.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: TAGS --- */}
      {activeTab === "tags" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TagIcon size={20} className="text-purple-500" />
                Tag Management
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Manage global tags used for indexing and content discovery across Wryte.
              </p>
            </div>
            <button
              onClick={() => openTagModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-bold text-xs hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={16} />
              Create Tag
            </button>
          </div>

          {tagsLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagsList.map((tg) => (
                <div
                  key={tg._id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  <div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="text-zinc-400 font-mono">#</span>
                      {tg.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                      {tg.description || "No tag description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => openTagModal(tg)}
                      className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tg._id)}
                      className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {tagsList.length === 0 && (
                <div className="col-span-full p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
                  <TagIcon size={36} className="mx-auto text-zinc-400 mb-2" />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No tags created yet.</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Click "Create Tag" to define global tags.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: USER ACCESS MANAGEMENT --- */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Search */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <Users size={20} className="text-emerald-500" />
                User Access & Role Controls
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Manage user privileges, assign admin roles, suspend, ban, or delete accounts.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Search user or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* User Table Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-850/40 text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">User details</th>
                    <th className="py-4 px-6">Role Privilege</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm text-zinc-700 dark:text-zinc-350">
                  {filteredUsers.map((usr) => (
                    <tr key={usr._id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                      {/* Name / Email */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={usr.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          alt={usr.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-800 dark:text-zinc-100 truncate flex items-center gap-1.5">
                            {usr.displayName || usr.name}
                            {usr.role === "admin" && (
                              <Crown size={13} className="text-amber-500 shrink-0" />
                            )}
                          </p>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">{usr.email}</p>
                        </div>
                      </td>

                      {/* Role Selector Dropdown */}
                      <td className="py-4 px-6">
                        <select
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                          disabled={usr._id === currentUser._id}
                          className={`text-xs font-bold uppercase px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            usr.role === "admin"
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-800 dark:border-zinc-200"
                              : "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              usr.isBanned
                                ? "bg-rose-600"
                                : usr.isSuspended
                                ? "bg-amber-500"
                                : usr.isActive === false
                                ? "bg-zinc-400"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            {usr.isBanned
                              ? "Banned"
                              : usr.isSuspended
                              ? "Suspended"
                              : usr.isActive === false
                              ? "Unverified"
                              : "Active"}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleSuspend(usr)}
                            disabled={usr._id === currentUser._id || usr.isBanned}
                            className={`flex items-center gap-1 font-bold text-[10px] uppercase px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                              usr.isSuspended
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-amber-500 hover:bg-amber-600 text-white"
                            } disabled:opacity-30 disabled:pointer-events-none`}
                          >
                            <AlertTriangle size={11} />
                            {usr.isSuspended ? "Unsuspend" : "Suspend"}
                          </button>

                          <button
                            onClick={() => handleToggleBan(usr)}
                            disabled={usr._id === currentUser._id}
                            className={`flex items-center gap-1 font-bold text-[10px] uppercase px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                              usr.isBanned
                                ? "bg-zinc-600 hover:bg-zinc-700 text-white"
                                : "bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                            } disabled:opacity-30 disabled:pointer-events-none`}
                          >
                            <Ban size={11} />
                            {usr.isBanned ? "Unban" : "Ban"}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(usr._id)}
                            disabled={usr._id === currentUser._id}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                            title="Delete User Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-zinc-400 text-sm">
                        No users matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: POSTS MODERATION --- */}
      {activeTab === "posts" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Search */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Post Moderation Console
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Monitor and moderate all stories published across Wryte.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Search story title..."
                value={searchPost}
                onChange={(e) => setSearchPost(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-850/40 text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Story Title</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm text-zinc-700 dark:text-zinc-350">
                  {filteredPosts.map((post) => {
                    const categoryObj = categoriesList.find(
                      (c) => c._id === (post.category?._id || post.category)
                    );
                    const authorObj = post.author;
                    return (
                      <tr key={post._id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                        {/* Title */}
                        <td className="py-4 px-6">
                          <p className="font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                            {post.subTitle || post.content?.slice(0, 60)}...
                          </p>
                        </td>

                        {/* Author */}
                        <td className="py-4 px-6 text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                          {typeof authorObj === "object" ? authorObj?.name : "Author"}
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-700">
                            {categoryObj?.name || "General"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                              post.status === "published"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            }`}
                          >
                            {post.status || "published"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/posts/${post._id}`}
                              target="_blank"
                              className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                              title="View Post"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Delete Story as Admin"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-zinc-400 text-sm">
                        No posts matching your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: NEWSLETTER SUBSCRIBERS --- */}
      {activeTab === "newsletter" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Mail size={20} className="text-indigo-500" />
                Newsletter Broadcast List
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Manage subscribers and export email lists for audience communications.
              </p>
            </div>

            {subscribersList.filter((s) => s.isActive).length > 0 && (
              <button
                onClick={handleCopyEmails}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                {copiedEmails ? <Check size={16} /> : <Copy size={16} />}
                {copiedEmails ? "Copied to Clipboard" : "Copy Active Emails"}
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-850/40 text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Subscription Status</th>
                    <th className="py-4 px-6">Subscribed On</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm text-zinc-700 dark:text-zinc-350">
                  {subscribersList.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-zinc-800 dark:text-zinc-100">
                        {subscriber.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            subscriber.isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {subscriber.isActive ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-zinc-400">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(subscriber._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Remove Subscriber"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribersList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-zinc-400 text-sm">
                        No newsletter subscribers yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- CATEGORY CREATION / EDIT MODAL --- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <FolderPlus size={18} className="text-blue-500" />
                {editingCat ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Technology, Design, Lifestyle"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Short description of stories falling into this category..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none min-h-[100px] resize-y"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={catLoading}
                  className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {catLoading ? "Saving..." : editingCat ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TAG CREATION / EDIT MODAL --- */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TagIcon size={18} className="text-purple-500" />
                {editingTag ? "Edit Tag" : "Create New Tag"}
              </h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTag} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  Tag Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. react, productivity, AI"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Tag summary..."
                  value={tagDesc}
                  onChange={(e) => setTagDesc(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none min-h-[90px] resize-y"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTagModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tagLoading}
                  className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {tagLoading ? "Saving..." : editingTag ? "Save Changes" : "Create Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <DashboardSkeleton />
          </div>
        }>
          <AdminDashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
