import type { Article } from "@/types/article";

export function getRelatedArticles(
  article: Article,
  all: Article[],
  limit = 3
): Article[] {
  return all
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      article: a,
      score:
        (a.category.toLowerCase() === article.category.toLowerCase() ? 3 : 0) +
        a.keywords.filter((k) =>
          article.keywords.map((x) => x.toLowerCase()).includes(k.toLowerCase())
        ).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.article);
}
