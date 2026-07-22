import Link from "next/link";
import { SITE } from "@/config/site";

const NAV_LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/latest", label: "Latest" },
  { href: "/trending", label: "Trending" },
  { href: "/search", label: "Search" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-surface-900 transition-colors hover:text-brand-600"
        >
          {SITE.name}
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
