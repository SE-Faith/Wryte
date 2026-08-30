"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, useToastStore } from "../../lib/store";
import api from "../../lib/api";
import { Mail, Lock, User, UserCheck, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (res.data.success) {
        // Authenticate user initially, then redirect to email verification page
        const { user, token } = res.data.user;
        login(user, token);
        
        addToast("Account created successfully! An OTP has been sent to your email.", "success");
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        addToast(res.data.message || "Registration failed", "error");
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.response?.data?.message || "Registration failed. Try again.", "error");
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
              Create an account
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Start sharing your stories and join the Wryte community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Full Name
              </label>
              <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                <User className="absolute left-4 text-zinc-400" size={16} />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="password" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Password
              </label>
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

            {/* Account Role Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Account Role
              </label>
              <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                <UserCheck className="absolute left-4 text-zinc-400" size={16} />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200 border-none rounded-2xl cursor-pointer"
                >
                  <option value="user" className="bg-white dark:bg-zinc-900">Reader (User)</option>
                  <option value="admin" className="bg-white dark:bg-zinc-900">Creator/Admin (Admin)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Prompt */}
          <div className="text-center mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
