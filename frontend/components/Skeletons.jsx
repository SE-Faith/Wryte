import React from "react";

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden p-5 flex flex-col gap-4 animate-pulse">
      {/* simulated cover image */}
      <div className="bg-zinc-200 dark:bg-zinc-800 aspect-video w-full rounded-2xl shrink-0" />
      {/* simulated category pills */}
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      {/* simulated title */}
      <div className="space-y-2">
        <div className="h-5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>
      {/* simulated user details footer */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-1 flex-1">
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-2 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SinglePostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 animate-pulse">
      {/* back button & categories */}
      <div className="flex gap-2 items-center">
        <div className="h-6 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      {/* title */}
      <div className="space-y-3">
        <div className="h-9 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-9 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>
      {/* author */}
      <div className="flex items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
      {/* simulated image */}
      <div className="bg-zinc-200 dark:bg-zinc-800 aspect-video w-full rounded-3xl" />
      {/* simulated content paragraphs */}
      <div className="space-y-4 pt-4">
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-11/12 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* grid values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        ))}
      </div>
      {/* table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="space-y-3">
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
