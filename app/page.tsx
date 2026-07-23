import { getArticles, getArticleCard, getCategories, getCategoryCounts, getLatestArticles, getTrendingArticles } from "@/lib/content";
import { FeaturedCard } from "@/components/cards/FeaturedCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function HomePage() {
  const articles = getArticles();
  const featuredArticles = articles.slice(0, 1);
  const latestArticles = getLatestArticles(6);
  const trendingArticles = getTrendingArticles(6);
  const categories = getCategories();
  const categoryCounts = getCategoryCounts();

  return (
    <Container className="py-10">
      <h1 className="sr-only">PocketSurge — Your daily dose of insights, guides, and reviews across technology, science, finance, gaming, and more</h1>
      {/* Hero / Featured */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <FeaturedCard article={getArticleCard(featuredArticles[0])} />
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-surface-900">
            Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="rounded-xl border border-surface-200 bg-white px-5 py-3 transition-all hover:border-brand-200 hover:bg-brand-50 hover:shadow-sm"
              >
                <span className="font-medium text-surface-900">{cat}</span>
                <span className="ml-2 text-sm text-surface-400">
                  {categoryCounts.get(cat)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-900">
              Latest Articles
            </h2>
            <Link
              href="/latest"
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={getArticleCard(a)} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Articles */}
      {trendingArticles.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-900">
              Trending
            </h2>
            <Link
              href="/trending"
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingArticles.map((a) => (
              <ArticleCard key={a.slug} article={getArticleCard(a)} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Reads */}
      {articles.length > 6 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-surface-900">
            Popular Reads
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(6, 12).map((a) => (
              <ArticleCard key={a.slug} article={getArticleCard(a)} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
