import Link from "next/link";

export function ArticleBreadcrumb({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-surface-400">
      <Link
        href="/"
        className="transition-colors hover:text-surface-600"
      >
        Home
      </Link>
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <Link
        href={`/category/${category.toLowerCase()}`}
        className="transition-colors hover:text-surface-600"
      >
        {category}
      </Link>
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <span className="truncate text-surface-600">{title}</span>
    </nav>
  );
}
