import Link from "next/link";
import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">
              {SITE.name}
            </h3>
            <p className="mt-2 text-sm text-surface-500">{SITE.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Links</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/articles"
                className="text-sm text-surface-500 transition-colors hover:text-surface-900"
              >
                All Articles
              </Link>
              <Link
                href="/latest"
                className="text-sm text-surface-500 transition-colors hover:text-surface-900"
              >
                Latest
              </Link>
              <Link
                href="/trending"
                className="text-sm text-surface-500 transition-colors hover:text-surface-900"
              >
                Trending
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Feeds</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/feed.xml"
                className="text-sm text-surface-500 transition-colors hover:text-surface-900"
              >
                RSS Feed
              </Link>
              <Link
                href="/sitemap.xml"
                className="text-sm text-surface-500 transition-colors hover:text-surface-900"
              >
                Sitemap
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-10 border-t border-surface-200 pt-6 text-center text-sm text-surface-400">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
