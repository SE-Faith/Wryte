"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, useToastStore } from "../../lib/store";
import api from "../../lib/api";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.success) {
        const { user, token } = res.data.result;
        login(user, token);
        addToast("Logged in successfully! Welcome back.", "success");
        router.push("/");
      } else {
        addToast(res.data.message || "Login failed", "error");
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.response?.data?.message || "Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-white dark:bg-zinc-950">
        <div className="max-w-md w-full p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl glass-panel animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to your account to continue writing and reading.
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                <Lock className="absolute left-4 text-zinc-400" size={16} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Prompt */}
          <div className="text-center mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
