"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  COMPANY_LINKS,
  EXPLORE_LINKS,
  LEGAL_LINKS,
  SITE,
} from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const PRIMARY_NAV = [
  { href: "/categories", label: "Categories" },
  { href: "/latest", label: "Latest" },
  { href: "/trending", label: "Trending" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-surface-600 transition-colors hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-x-0 top-0 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-surface-200 bg-white px-4 py-6 shadow-xl dark:border-surface-800 dark:bg-surface-950">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider text-surface-400">
                Menu
              </p>
              <ThemeToggle />
            </div>

            <ul className="mt-4 space-y-1">
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "text-surface-800 hover:bg-surface-100 dark:text-surface-100 dark:hover:bg-surface-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/search"
                  className="block rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-100 dark:text-surface-100 dark:hover:bg-surface-900"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="block rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-100 dark:text-surface-100 dark:hover:bg-surface-900"
                >
                  All Articles
                </Link>
              </li>
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-400">
                  Company
                </p>
                <ul className="space-y-1">
                  {COMPANY_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-2 py-2 text-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-400">
                  Explore
                </p>
                <ul className="space-y-1">
                  {EXPLORE_LINKS.slice(0, 4).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-2 py-2 text-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-surface-200 pt-4 dark:border-surface-800">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-400">
                Legal
              </p>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-2 py-1.5 text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-xs text-surface-400">{SITE.name}</p>
          </nav>
        </div>
      )}
    </>
  );
}
