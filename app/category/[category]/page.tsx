import {
  getCategories,
  getArticlesByCategory,
  getCategoriesWithMeta,
} from "@/lib/content";
import { ArticleGrid } from "@/components/cards/ArticleGrid";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
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
  const meta = getCategoriesWithMeta().find(
    (c) => c.slug === category.toLowerCase()
  );
  if (!meta) return {};

  return buildMetadata({
    title: meta.name,
    description: meta.description,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = getCategoriesWithMeta().find(
    (c) => c.slug === category.toLowerCase()
  );

  if (!meta) notFound();

  const articles = getArticlesByCategory(category);

  return (
    <Container className="py-10">
      <Reveal className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Category
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-surface-900 dark:text-white">
          {meta.name}
        </h1>
        <p className="mt-3 max-w-2xl text-surface-500 dark:text-surface-400">
          {meta.description}
        </p>
        <p className="mt-2 text-sm text-surface-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
      </Reveal>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No articles in this category yet.</p>
        </div>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </Container>
  );
}
