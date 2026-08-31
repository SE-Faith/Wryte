"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="mt-auto w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              <span>Wryte</span>
              <span>.</span>
            </Link>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              A simple place to write and read.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <label htmlFor="newsletter-email" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Join
              </button>
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Thanks for signing up.
              </p>
            )}
          </form>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Home
            </Link>
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Login
            </Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Register
            </Link>
          </div>
          <span>© {new Date().getFullYear()} Wryte.</span>
        </div>
      </div>
    </footer>
  );
}
