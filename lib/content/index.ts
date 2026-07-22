import { discoverArticles } from "./loaders";
import type { Article } from "@/types/article";

let _articles: Article[] | null = null;
let _loaded = false;

export function getArticles(): Article[] {
  if (!_loaded) {
    _articles = discoverArticles();
    _loaded = true;
  }
  return _articles ?? [];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getCategories(): string[] {
  const categories = new Set(getArticles().map((a) => a.category));
  return Array.from(categories).sort();
}

export function getArticlesByCategory(category: string): Article[] {
  return getArticles().filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );
}

export function getLatestArticles(count = 6): Article[] {
  return getArticles().slice(0, count);
}

export function getTrendingArticles(count = 6): Article[] {
  return getArticles()
    .slice()
    .sort((a, b) => {
      const scoreA = a.readingTime * 2 + a.wordCount / 1000;
      const scoreB = b.readingTime * 2 + b.wordCount / 1000;
      const recencyA = new Date(a.generatedAt).getTime();
      const recencyB = new Date(b.generatedAt).getTime();
      return scoreB - scoreA + (recencyB - recencyA) / 1e12;
    })
    .slice(0, count);
}

export function getCategoryCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const article of getArticles()) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return counts;
}

export function getArticleCard(article: Article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    keywords: article.keywords,
    readingTime: article.readingTime,
    generatedAt: article.generatedAt,
    heroImage: article.images.hero,
  };
}
