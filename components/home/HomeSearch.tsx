"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="border-y border-surface-200 bg-white py-14 dark:border-surface-800 dark:bg-surface-950">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
            Find an article
          </h2>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Search by title, topic, keyword, tag, or category
          </p>
          <form onSubmit={onSubmit} className="relative mt-6">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “cybersecurity”, “AI”, or a tag…"
              className="w-full rounded-xl border border-surface-200 bg-surface-50 py-4 pl-12 pr-28 text-surface-900 shadow-sm outline-none transition placeholder:text-surface-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:focus:bg-surface-950"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
