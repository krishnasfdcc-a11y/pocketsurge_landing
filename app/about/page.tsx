import Link from "next/link";
import { SITE } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `Learn about ${SITE.name} — a publishing platform for practical guides, reviews, and deep dives across technology, science, finance, gaming, and culture.`,
});

export default function AboutPage() {
  return (
    <Container size="article" className="py-12 sm:py-16">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
          About
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
          Why {SITE.name} exists
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-surface-500 dark:text-surface-400">
          {SITE.description}
        </p>
      </Reveal>

      <div className="mt-12 space-y-10">
        <Reveal as="section" delay={60}>
          <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white">
            What we publish
          </h2>
          <p className="mt-3 leading-relaxed text-surface-600 dark:text-surface-300">
            Long-form guides, reviews, and explainers you can act on — spanning
            AI, cybersecurity, web and mobile development, data, devops,
            finance, science, gaming, and entertainment. We care about honest
            trade-offs and clear takeaways, not fluff.
          </p>
        </Reveal>

        <Reveal as="section" delay={100}>
          <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white">
            Who publishes
          </h2>
          <p className="mt-3 leading-relaxed text-surface-600 dark:text-surface-300">
            PocketSurge is the publisher and editorial owner. Writing is
            attributed to the{" "}
            <Link
              href="/author"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {SITE.author.name}
            </Link>
            . Learn how we work in our{" "}
            <Link
              href="/editorial-policy"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Editorial Policy
            </Link>
            .
          </p>
        </Reveal>

        <Reveal as="section" delay={140}>
          <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white">
            Get in touch
          </h2>
          <p className="mt-3 leading-relaxed text-surface-600 dark:text-surface-300">
            Questions, corrections, or partnerships — reach us via{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Contact
            </Link>{" "}
            or email{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {SITE.email}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </Container>
  );
}
