"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex rounded-lg border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition hover:bg-surface-50 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-900"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
