import { getTags, getTagBySlug, getArticlesByTag } from "@/lib/content";
import { ArticleGrid } from "@/components/cards/ArticleGrid";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import { tagSlug } from "@/utils/strings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getTags().map((t) => ({ tag: tagSlug(t) }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const displayTag = getTagBySlug(tag);
  if (!displayTag) return {};

  return buildMetadata({
    title: `#${displayTag}`,
    description: `Articles tagged “${displayTag}” on PocketSurge.`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const displayTag = getTagBySlug(tag);
  if (!displayTag) notFound();

  const articles = getArticlesByTag(displayTag);

  return (
    <Container className="py-10">
      <Reveal className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Tag
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-surface-900 dark:text-white">
          {displayTag}
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
      </Reveal>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No articles with this tag yet.</p>
        </div>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </Container>
  );
}
