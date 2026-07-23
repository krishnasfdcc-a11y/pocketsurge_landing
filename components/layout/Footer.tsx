import Link from "next/link";
import {
  COMPANY_LINKS,
  EXPLORE_LINKS,
  LEGAL_LINKS,
  SITE,
} from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-surface-900 dark:text-white">
              {SITE.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
              {SITE.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white">
              Explore
            </h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {EXPLORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white">
              Company
            </h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/feed.xml"
                className="text-sm text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
              >
                RSS Feed
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white">
              Legal
            </h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-surface-200 pt-6 text-center text-sm text-surface-400 dark:border-surface-800">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
