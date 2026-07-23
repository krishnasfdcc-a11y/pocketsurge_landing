"use client";

import { useEffect } from "react";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center">
        <p className="font-display text-5xl font-bold text-surface-200 dark:text-surface-800">
          Error
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-surface-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          We couldn&apos;t load this article. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
