"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToastStore } from "../../lib/store";
import api from "../../lib/api";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      addToast("No email provided for verification.", "warning");
    }
  }, [searchParams, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      addToast("Please enter the verification code", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email", { email, code });
      if (res.data.success) {
        addToast("Email verified successfully! Your account is active.", "success");
        router.push("/login");
      } else {
        addToast(res.data.message || "Invalid verification code", "error");
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.response?.data?.message || "Invalid verification code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/forgot-password", { email });
      addToast("A new verification code has been sent to your email", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to resend code", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md w-full p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl glass-panel animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Verify your email
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          We sent a 6-digit OTP code to <strong className="text-zinc-700 dark:text-zinc-300">{email || "your inbox"}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-2">
          <label htmlFor="code" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block text-center">
            Enter 6-Digit OTP Code
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-800 dark:text-zinc-200"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Verify OTP
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Resend and return options */}
      <div className="text-center mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 mx-auto"
        >
          {resending ? (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <RefreshCw size={14} />
              Resend verification code
            </>
          )}
        </button>
        <p className="text-xs text-zinc-400">
          Didn&apos;t receive it? Check your spam folder or trigger a code above.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-white dark:bg-zinc-950">
        <Suspense fallback={
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        }>
          <VerifyEmailForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
