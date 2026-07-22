import { getArticles, getArticleCard } from "@/lib/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "All Articles",
  description: "Browse all articles on PocketSurge — tech insights, guides, and reviews.",
});

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <Container className="py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900">All Articles</h1>
        <p className="mt-2 text-surface-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""} published
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p className="text-lg">No articles published yet.</p>
          <p className="mt-1 text-sm">
            Add article folders to the <code className="rounded bg-surface-100 px-1 py-0.5 text-xs">content/</code> directory.
          </p>
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
