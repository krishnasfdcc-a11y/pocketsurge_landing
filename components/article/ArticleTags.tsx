import Link from "next/link";
import { tagSlug } from "@/utils/strings";

export function ArticleTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="mt-10 border-t border-surface-200 pt-8 dark:border-surface-800">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tagSlug(tag)}`}
            className="rounded-full border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-300"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
