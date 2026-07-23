import type { CSSProperties } from "react";
import Link from "next/link";
import { SITE } from "@/config/site";

export function HomeHero({ articleCount }: { articleCount: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-surface-200">
      {/* Full-bleed atmospheric plane */}
      <div className="absolute inset-0 -z-10 bg-[#0a1628]" aria-hidden>
        <div
          className="hero-mesh absolute inset-[-15%] opacity-90"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 55% at 18% 35%, rgba(37, 99, 235, 0.55), transparent 60%),
              radial-gradient(ellipse 55% 50% at 82% 20%, rgba(14, 165, 233, 0.28), transparent 55%),
              radial-gradient(ellipse 60% 45% at 70% 85%, rgba(29, 78, 216, 0.35), transparent 50%),
              linear-gradient(165deg, #07101c 0%, #0f1f3a 45%, #0a1628 100%)
            `,
          }}
        />
        <div
          className="hero-glow absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
          }}
          aria-hidden
        />
      </div>

      <div className="container-page flex min-h-[min(88vh,52rem)] flex-col justify-center py-20 sm:py-28">
        <p
          className="hero-anim font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ "--hero-delay": "60ms" } as CSSProperties}
        >
          {SITE.name}
        </p>

        <h1
          className="hero-anim mt-6 max-w-2xl font-display text-2xl font-semibold leading-snug tracking-tight text-white/95 sm:text-3xl md:text-4xl"
          style={{ "--hero-delay": "180ms" } as CSSProperties}
        >
          Deep reads on tech, science, finance, and culture — built for curious minds.
        </h1>

        <p
          className="hero-anim mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          style={{ "--hero-delay": "300ms" } as CSSProperties}
        >
          {SITE.description}
        </p>

        <div
          className="hero-anim mt-10 flex flex-wrap items-center gap-4"
          style={{ "--hero-delay": "420ms" } as CSSProperties}
        >
          <Link
            href="/articles"
            className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-surface-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Explore articles
          </Link>
          <Link
            href="/latest"
            className="inline-flex items-center rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
          >
            What&apos;s new
          </Link>
          <span className="text-sm text-white/45">
            {articleCount} guide{articleCount !== 1 ? "s" : ""} &amp; reviews
          </span>
        </div>
      </div>
    </section>
  );
}
