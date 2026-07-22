import Link from "next/link";

interface NavArticle {
  slug: string;
  title: string;
}

export function ArticleNav({
  prev,
  next,
}: {
  prev?: NavArticle;
  next?: NavArticle;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 grid gap-4 border-t border-surface-200 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/article/${prev.slug}`}
          className="group rounded-xl border border-surface-200 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
            ← Previous
          </span>
          <p className="mt-1 text-sm font-medium text-surface-700 group-hover:text-brand-600">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/article/${next.slug}`}
          className="group rounded-xl border border-surface-200 p-4 text-right transition-colors hover:border-brand-200 hover:bg-brand-50/50"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
            Next →
          </span>
          <p className="mt-1 text-sm font-medium text-surface-700 group-hover:text-brand-600">
            {next.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
