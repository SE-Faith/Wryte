import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Wryte
            </Link>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              A simple place to write and read.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
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
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          © {new Date().getFullYear()} Wryte
        </div>
      </div>
    </footer>
  );
}
