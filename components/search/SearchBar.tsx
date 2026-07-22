"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { searchEntries } from "@/lib/search";
import type { SearchEntry } from "@/lib/search";

export function SearchBar({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchEntries(entries, query),
    [entries, query]
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400"
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
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles by title, excerpt, keywords, or category…"
          className="w-full rounded-xl border border-surface-200 bg-white py-4 pl-12 pr-4 text-surface-900 shadow-sm transition-shadow placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          autoFocus
        />
      </div>

      {query && (
        <div className="mt-4 text-sm text-surface-500">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
          {query}&rdquo;
        </div>
      )}

      <div className="mt-6 divide-y divide-surface-100">
        {results.map((entry) => (
          <Link
            key={entry.slug}
            href={`/article/${entry.slug}`}
            className="block rounded-lg px-4 py-4 transition-colors hover:bg-surface-50"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                {entry.category}
              </span>
            </div>
            <h3 className="mt-1 font-medium text-surface-900">{entry.title}</h3>
            <p className="mt-1 text-sm text-surface-500">{entry.excerpt}</p>
          </Link>
        ))}
        {query && results.length === 0 && (
          <p className="py-12 text-center text-surface-400">
            No articles found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}
