import { Suspense } from "react";
import { getArticles } from "@/lib/content";
import { SearchBar } from "@/components/search/SearchBar";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import type { SearchEntry } from "@/lib/search";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description:
    "Search articles on PocketSurge by title, excerpt, keywords, tags, or category.",
});

export default function SearchPage() {
  const articles = getArticles();

  const searchEntries: SearchEntry[] = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    keywords: a.keywords,
    tags: a.tags,
    category: a.category,
  }));

  return (
    <Container className="py-10">
      <Reveal className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-white">
          Search
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Find articles by title, excerpt, keywords, tags, or category
        </p>
      </Reveal>
      <Reveal delay={100}>
        <Suspense
          fallback={
            <div className="mx-auto h-14 max-w-2xl animate-pulse rounded-xl bg-surface-100 dark:bg-surface-900" />
          }
        >
          <SearchBar entries={searchEntries} />
        </Suspense>
      </Reveal>
    </Container>
  );
}
