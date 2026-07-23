import { getArticles } from "@/lib/content";
import { ArticleGrid } from "@/components/cards/ArticleGrid";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "All Articles",
  description: "Browse all articles on PocketSurge — insights, guides, and reviews across technology, science, finance, gaming, and more.",
});

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <Container className="py-10">
      <Reveal className="mb-10">
        <h1 className="font-display text-3xl font-bold text-surface-900">
          All Articles
        </h1>
        <p className="mt-2 text-surface-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""} published
        </p>
      </Reveal>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p className="text-lg">No articles published yet.</p>
          <p className="mt-1 text-sm">
            Add article folders to the{" "}
            <code className="rounded bg-surface-100 px-1 py-0.5 text-xs">
              content/
            </code>{" "}
            directory.
          </p>
        </div>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </Container>
  );
}
