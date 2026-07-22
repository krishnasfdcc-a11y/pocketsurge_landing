import { getCategories, getArticlesByCategory, getArticleCard } from "@/lib/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({ category: c.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const displayCategory = getCategories().find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );

  if (!displayCategory) return {};

  return buildMetadata({
    title: displayCategory,
    description: `Browse all ${displayCategory} articles on PocketSurge.`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const displayCategory = getCategories().find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );

  if (!displayCategory) notFound();

  const articles = getArticlesByCategory(category);

  return (
    <Container className="py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900">
          {displayCategory}
        </h1>
        <p className="mt-2 text-surface-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""} in this category
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No articles in this category yet.</p>
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
