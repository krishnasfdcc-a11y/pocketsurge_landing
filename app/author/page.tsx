import Link from "next/link";
import { SITE } from "@/config/site";
import { getLatestArticles, getArticleCard } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: SITE.author.name,
  description: SITE.author.bio,
});

export default function AuthorPage() {
  const recent = getLatestArticles(3);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-display text-2xl font-bold text-white"
              aria-hidden
            >
              PS
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {SITE.author.role}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {SITE.author.name}
              </h1>
              <p className="mt-2 text-surface-500 dark:text-surface-400">
                Publisher: {SITE.name}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <p className="text-lg leading-relaxed text-surface-600 dark:text-surface-300">
            {SITE.author.bio}
          </p>
          <p className="mt-4 leading-relaxed text-surface-600 dark:text-surface-300">
            Every article on PocketSurge is attributed to this team. We follow
            our{" "}
            <Link
              href="/editorial-policy"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Editorial Policy
            </Link>{" "}
            and disclose AI-assisted production practices in our{" "}
            <Link
              href="/ai-content-disclosure"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              AI Content Disclosure
            </Link>
            .
          </p>
          <a
            href={`mailto:${SITE.author.email}`}
            className="mt-6 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {SITE.author.email}
          </a>
        </Reveal>
      </div>

      {recent.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
              Recent articles
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <ArticleCard article={getArticleCard(a)} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mt-8 text-center">
            <Link
              href="/articles"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View all articles →
            </Link>
          </Reveal>
        </section>
      )}
    </Container>
  );
}
