"use client";

import React, { Suspense } from "react";
import useSWR from "swr";
import api from "../../../lib/api";
import { useAuthStore, useToastStore } from "../../../lib/store";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { DashboardSkeleton } from "../../../components/Skeletons";
import { Mail, Trash2, ShieldAlert, Copy, CheckCircle } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

function NewsletterAdminContent() {
    const { user: currentUser } = useAuthStore();
    const { addToast } = useToastStore();
    const [copied, setCopied] = React.useState(null);

    const { data: newsletterData, isLoading, mutate } = useSWR(
        currentUser?.role === "admin" ? "/newsletter/admin/subscribers" : null,
        fetcher
    );

    const subscribers = newsletterData?.subscribers || [];

    const handleDelete = async (subscriberId) => {
        if (window.confirm("Remove this subscriber from the list?")) {
            try {
                await api.delete(`/newsletter/admin/subscribers/${subscriberId}`);
                addToast("Subscriber removed successfully", "success");
                mutate();
            } catch (err) {
                addToast(err.response?.data?.message || "Failed to remove subscriber", "error");
            }
        }
    };

    const handleCopyEmails = () => {
        const emails = subscribers.filter(s => s.isActive).map(s => s.email).join(", ");
        navigator.clipboard.writeText(emails);
        setCopied(true);
        addToast("Copied to clipboard", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!currentUser || currentUser.role !== "admin") {
        return (
            <div className="max-w-md mx-auto py-24 px-4 text-center">
                <ShieldAlert size={48} className="text-rose-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Access Denied</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    You do not have administrative privileges to access this page.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                    <Mail size={32} className="text-zinc-900 dark:text-zinc-50" />
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Newsletter</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Manage subscribers and newsletter campaigns
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Total Subscribers
                    </p>
                    <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {subscribers.length}
                    </p>
                </div>
                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Active
                    </p>
                    <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {subscribers.filter(s => s.isActive).length}
                    </p>
                </div>
            </div>

            {/* Action Button */}
            {subscribers.filter(s => s.isActive).length > 0 && (
                <button
                    onClick={handleCopyEmails}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg font-medium text-sm hover:opacity-90 transition"
                >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? "Copied to Clipboard" : "Copy All Active Emails"}
                </button>
            )}

            {/* Subscribers List */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                        Loading subscribers...
                    </div>
                ) : subscribers.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                        <Mail size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No newsletter subscribers yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                                        Subscribed
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-50">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((subscriber) => (
                                    <tr
                                        key={subscriber._id}
                                        className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition"
                                    >
                                        <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50 break-all">
                                            {subscriber.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${subscriber.isActive
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                                    }`}
                                            >
                                                {subscriber.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                                            {new Date(subscriber.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(subscriber._id)}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950 rounded transition"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NewsletterAdminPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
            <Navbar />
            <main className="flex-1">
                <Suspense fallback={<DashboardSkeleton />}>
                    <NewsletterAdminContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
