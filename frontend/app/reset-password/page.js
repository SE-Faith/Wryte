"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToastStore } from "../../lib/store";
import api from "../../lib/api";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token, // this is the OTP code from email
        newPassword,
      });

      if (res.data.success) {
        addToast("Password reset successfully! You can now log in.", "success");
        router.push("/login");
      } else {
        addToast(res.data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.response?.data?.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl glass-panel animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Reset password
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Enter the recovery code sent to <strong className="text-zinc-700 dark:text-zinc-300">{email || "your email"}</strong> and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recovery Code (OTP) */}
        <div className="space-y-1.5">
          <label htmlFor="token" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            6-Digit Recovery OTP
          </label>
          <input
            id="token"
            type="text"
            maxLength={6}
            placeholder="123456"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-800 dark:text-zinc-200"
            required
          />
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            New Password
          </label>
          <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
            <Lock className="absolute left-4 text-zinc-400" size={16} />
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-transparent pl-11 pr-12 py-3 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Confirm New Password
          </label>
          <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
            <Lock className="absolute left-4 text-zinc-400" size={16} />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent pl-11 pr-12 py-3 text-sm focus:outline-none text-zinc-800 dark:text-zinc-200"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Reset Password
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-white dark:bg-zinc-950">
        <Suspense fallback={
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
