import type { CSSProperties } from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="text-center">
        <p className="hero-anim font-display text-6xl font-bold text-surface-200 dark:text-surface-800">
          404
        </p>
        <h1
          className="hero-anim mt-4 font-display text-2xl font-bold text-surface-900 dark:text-white"
          style={{ "--hero-delay": "100ms" } as CSSProperties}
        >
          Page Not Found
        </h1>
        <p
          className="hero-anim mt-2 text-surface-500 dark:text-surface-400"
          style={{ "--hero-delay": "180ms" } as CSSProperties}
        >
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="hero-anim mt-8 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-brand-700"
          style={{ "--hero-delay": "260ms" } as CSSProperties}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
