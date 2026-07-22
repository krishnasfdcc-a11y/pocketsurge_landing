import { getTrendingArticles, getArticleCard } from "@/lib/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Trending",
  description: "What's trending on PocketSurge — popular and noteworthy articles.",
});

export default function TrendingPage() {
  const articles = getTrendingArticles(50);

  return (
    <Container className="py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900">Trending</h1>
        <p className="mt-2 text-surface-500">
          Popular articles on PocketSurge
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
