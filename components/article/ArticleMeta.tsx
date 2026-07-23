import Link from "next/link";
import { SITE } from "@/config/site";
import { formatDate } from "@/utils/dates";

export function ArticleMeta({
  excerpt,
  generatedAt,
  updatedAt,
  readingTime,
  wordCount,
}: {
  excerpt: string;
  generatedAt: string;
  updatedAt: string;
  readingTime: number;
  wordCount: number;
}) {
  const showUpdated =
    updatedAt &&
    new Date(updatedAt).getTime() !== new Date(generatedAt).getTime();

  return (
    <div className="mb-8 space-y-5">
      {excerpt && (
        <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-300">
          {excerpt}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500 dark:text-surface-400">
        <Link
          href="/author"
          className="font-medium text-surface-800 transition-colors hover:text-brand-600 dark:text-surface-200 dark:hover:text-brand-400"
        >
          {SITE.author.name}
        </Link>
        <span className="text-surface-300 dark:text-surface-600" aria-hidden>
          ·
        </span>
        <span>
          Published{" "}
          <time dateTime={generatedAt}>{formatDate(generatedAt)}</time>
        </span>
        {showUpdated && (
          <>
            <span className="text-surface-300 dark:text-surface-600" aria-hidden>
              ·
            </span>
            <span>
              Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </span>
          </>
        )}
        <span className="text-surface-300 dark:text-surface-600" aria-hidden>
          ·
        </span>
        <span>{readingTime} min read</span>
        {wordCount > 0 && (
          <>
            <span className="text-surface-300 dark:text-surface-600" aria-hidden>
              ·
            </span>
            <span>{wordCount.toLocaleString()} words</span>
          </>
        )}
      </div>
    </div>
  );
}
