import { getArticles } from "@/lib/content";
import { SearchBar } from "@/components/search/SearchBar";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import type { SearchEntry } from "@/lib/search";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search articles on PocketSurge by title, excerpt, keywords, or category.",
});

export default function SearchPage() {
  const articles = getArticles();

  const searchEntries: SearchEntry[] = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    keywords: a.keywords,
    category: a.category,
  }));

  return (
    <Container className="py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-surface-900">Search</h1>
        <p className="mt-2 text-surface-500">
          Find articles by title, excerpt, keywords, or category
        </p>
      </div>
      <SearchBar entries={searchEntries} />
    </Container>
  );
}
