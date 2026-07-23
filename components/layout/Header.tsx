import Link from "next/link";
import { SITE } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";

const NAV_LINKS = [
  { href: "/categories", label: "Categories" },
  { href: "/latest", label: "Latest" },
  { href: "/trending", label: "Trending" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-800 dark:bg-surface-950/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-surface-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
        >
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-all duration-200 hover:-translate-y-px hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
          >
            <svg
              className="h-5 w-5"
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
          </Link>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
