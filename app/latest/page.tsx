import { getLatestArticles, getArticleCard } from "@/lib/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Latest Articles",
  description: "The newest articles on PocketSurge, sorted by publication date.",
});

export default function LatestPage() {
  const articles = getLatestArticles(50);

  return (
    <Container className="py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900">Latest</h1>
        <p className="mt-2 text-surface-500">
          The most recently published articles
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No articles published yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={getArticleCard(a)} />
          ))}
        </div>
      )}
    </Container>
  );
}
