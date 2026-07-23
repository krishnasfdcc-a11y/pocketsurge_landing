import { getTrendingArticles } from "@/lib/content";
import { ArticleGrid } from "@/components/cards/ArticleGrid";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
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
      <Reveal className="mb-10">
        <h1 className="font-display text-3xl font-bold text-surface-900">
          Trending
        </h1>
        <p className="mt-2 text-surface-500">Popular articles on PocketSurge</p>
      </Reveal>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No articles published yet.</p>
        </div>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </Container>
  );
}
