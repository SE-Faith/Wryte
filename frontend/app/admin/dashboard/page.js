"use client";

import React, { Suspense } from "react";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { DashboardSkeleton } from "../../../components/Skeletons";
import { ShieldCheck, Users, FileText, Ban, AlertTriangle, ShieldAlert, Award, Mail } from "lucide-react";
import Link from "next/link";

const fetcher = (url) => api.get(url).then((res) => res.data);

function AdminDashboardContent() {
  const { user: currentUser } = useAuthStore();
  const { addToast } = useToastStore();

  // 1. Fetch all users
  const { data: usersData, isLoading: usersLoading, mutate: mutateUsers } = useSWR(
    currentUser?.role === "admin" ? "/admin/all" : null,
    fetcher
  );

  const usersList = usersData?.users || [];

  // 2. Fetch all posts (to compute stats)
  const { data: postsData, isLoading: postsLoading } = useSWR(
    currentUser?.role === "admin" ? "/post/all?limit=1000" : null,
    fetcher
  );

  const postsList = postsData?.posts?.posts || postsData?.posts || [];

  // Calculate platform statistics
  const totalUsers = usersList.length;
  const totalPosts = postsList.length;
  const adminCount = usersList.filter((u) => u.role === "admin").length;
  const activeCount = usersList.filter((u) => u.isActive !== false).length;

  const handleSuspend = async (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      try {
        await api.put(`/admin/suspend/${userId}`);
        addToast("User suspended successfully", "success");
        mutateUsers();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to suspend user", "error");
      }
    }
  };

  const handleBan = async (userId) => {
    if (window.confirm("Are you sure you want to BAN this user? This blocks their access completely.")) {
      try {
        await api.put(`/admin/ban/${userId}`);
        addToast("User banned successfully", "success");
        mutateUsers();
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to ban user", "error");
      }
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck size={28} className="text-blue-500" />
            Admin Console
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor user accounts, post metrics, and platform operations.
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg font-medium text-sm hover:opacity-90 transition whitespace-nowrap"
        >
          <Mail size={16} />
          Newsletter
        </Link>
      </div>

      {usersLoading || postsLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Statistical Grid Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Widget 1 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 font-semibold uppercase">Total Users</p>
                <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{totalUsers}</p>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 font-semibold uppercase">Total Stories</p>
                <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{totalPosts}</p>
              </div>
            </div>

            {/* Widget 3 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-full flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 font-semibold uppercase">Administrators</p>
                <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{adminCount}</p>
              </div>
            </div>

            {/* Widget 4 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 font-semibold uppercase">Active Accounts</p>
                <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{activeCount}</p>
              </div>
            </div>
          </div>

          {/* User management table card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                Manage User Access
              </h3>
              <span className="text-xs font-semibold text-zinc-400 bg-zinc-50 dark:bg-zinc-850 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                {usersList.length} registered accounts
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-850/40 text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">User details</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-sm text-zinc-700 dark:text-zinc-350">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/20 transition-colors">
                      {/* Name / Email */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={usr.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          alt={usr.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0 animate-fade-in"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{usr.displayName || usr.name}</p>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">{usr.email}</p>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${usr.role === "admin"
                            ? "bg-blue-50 text-blue-500 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30"
                            : "bg-zinc-50 text-zinc-500 border border-zinc-200 dark:bg-zinc-850 dark:border-zinc-800"
                          }`}>
                          {usr.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${usr.isBanned
                              ? "bg-rose-500"
                              : usr.isSuspended
                                ? "bg-amber-500"
                                : usr.isActive === false
                                  ? "bg-zinc-300 dark:bg-zinc-700"
                                  : "bg-emerald-500"
                            }`} />
                          <span className="text-xs font-semibold text-zinc-500">
                            {usr.isBanned
                              ? "Banned"
                              : usr.isSuspended
                                ? "Suspended"
                                : usr.isActive === false
                                  ? "Inactive"
                                  : "Active"}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSuspend(usr._id)}
                            disabled={usr.isSuspended || usr.isBanned}
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-full transition-all cursor-pointer"
                          >
                            <AlertTriangle size={11} />
                            Suspend
                          </button>
                          <button
                            onClick={() => handleBan(usr._id)}
                            disabled={usr.isBanned}
                            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-full transition-all cursor-pointer"
                          >
                            <Ban size={11} />
                            Ban
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-zinc-400 text-sm">
                        No registered users found on the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
