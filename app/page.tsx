import { getArticles, getArticleCard, getCategories, getCategoryCounts, getLatestArticles, getTrendingArticles } from "@/lib/content";
import { FeaturedCard } from "@/components/cards/FeaturedCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";
import { HomeHero } from "@/components/home/HomeHero";
import { WhySpecial } from "@/components/home/WhySpecial";
import { HomeSearch } from "@/components/home/HomeSearch";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

export default function HomePage() {
  const articles = getArticles();
  const featuredArticles = articles.slice(0, 1);
  const latestArticles = getLatestArticles(6);
  const trendingArticles = getTrendingArticles(6);
  const categories = getCategories();
  const categoryCounts = getCategoryCounts();

  return (
    <>
      <HomeHero articleCount={articles.length} />
      <WhySpecial />
      <HomeSearch />

      <Container className="py-16 sm:py-20">
        {featuredArticles.length > 0 && (
          <Reveal as="section" className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
                Featured
              </h2>
            </div>
            <FeaturedCard article={getArticleCard(featuredArticles[0])} />
          </Reveal>
        )}

        {categories.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
                  Browse by category
                </h2>
                <Link
                  href="/categories"
                  className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
                >
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, index) => (
                <Reveal key={cat} delay={index * 40}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="inline-flex rounded-xl border border-surface-200 bg-white px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:shadow-sm dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-600 dark:hover:bg-brand-950"
                  >
                    <span className="font-medium text-surface-900 dark:text-white">
                      {cat}
                    </span>
                    <span className="ml-2 text-sm text-surface-400">
                      {categoryCounts.get(cat)}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {latestArticles.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
                  Latest Articles
                </h2>
                <Link
                  href="/latest"
                  className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
                >
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((a, index) => (
                <Reveal key={a.slug} delay={(index % 3) * 80}>
                  <ArticleCard article={getArticleCard(a)} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {trendingArticles.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
                  Trending
                </h2>
                <Link
                  href="/trending"
                  className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
                >
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trendingArticles.map((a, index) => (
                <Reveal key={a.slug} delay={(index % 3) * 80}>
                  <ArticleCard article={getArticleCard(a)} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {articles.length > 6 && (
          <section>
            <Reveal>
              <h2 className="mb-6 font-display text-2xl font-bold text-surface-900 dark:text-white">
                Popular Reads
              </h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(6, 12).map((a, index) => (
                <Reveal key={a.slug} delay={(index % 3) * 80}>
                  <ArticleCard article={getArticleCard(a)} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>

      <NewsletterSignup />
    </>
  );
}
