"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToastStore } from "../../lib/store";
import api from "../../lib/api";
import { Mail, HelpCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast("Please enter your email", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        addToast("Reset code sent! Redirecting you to input the code.", "success");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        addToast(res.data.message || "Failed to trigger recovery", "error");
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.response?.data?.message || "Failed to send reset code", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-md w-full p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl glass-panel animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={28} />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Recover password
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Enter your email and we&apos;ll send you an OTP code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Email Address
              </label>
              <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                <Mail className="absolute left-4 text-zinc-400" size={16} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Send Recovery OTP
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              Return to log in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
