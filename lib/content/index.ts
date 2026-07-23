import { discoverArticles } from "./loaders";
import { CATEGORY_DESCRIPTIONS } from "@/config/site";
import { slugify, tagSlug } from "@/utils/strings";
import type { Article, CategoryMeta, TagMeta } from "@/types/article";

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

export function getCategoriesWithMeta(): CategoryMeta[] {
  const counts = getCategoryCounts();
  return getCategories().map((name) => {
    const slug = name.toLowerCase();
    return {
      name,
      slug,
      count: counts.get(name) ?? 0,
      description:
        CATEGORY_DESCRIPTIONS[slug] ??
        `Articles and guides about ${name} on PocketSurge.`,
    };
  });
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

export function getTags(): string[] {
  const tags = new Set<string>();
  for (const article of getArticles()) {
    for (const tag of article.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function getTagCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const article of getArticles()) {
    for (const tag of article.tags) {
      const key = tag.toLowerCase();
      // Preserve first-seen casing as display key via reverse lookup
      const existing = [...counts.keys()].find((k) => k.toLowerCase() === key);
      if (existing) {
        counts.set(existing, (counts.get(existing) ?? 0) + 1);
      } else {
        counts.set(tag, 1);
      }
    }
  }
  return counts;
}

export function getTagsWithMeta(): TagMeta[] {
  const counts = getTagCounts();
  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      slug: tagSlug(name),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getArticlesByTag(tag: string): Article[] {
  const needle = tag.toLowerCase();
  const needleSlug = slugify(tag);
  return getArticles().filter((a) =>
    a.tags.some(
      (t) => t.toLowerCase() === needle || tagSlug(t) === needleSlug
    )
  );
}

export function getTagBySlug(slug: string): string | undefined {
  return getTags().find((t) => tagSlug(t) === slug.toLowerCase());
}

export function getArticleCard(article: Article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    keywords: article.keywords,
    tags: article.tags,
    readingTime: article.readingTime,
    generatedAt: article.generatedAt,
    heroImage: article.images.hero,
  };
}
