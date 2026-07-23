import { getRelatedArticles } from "@/lib/related";
import { getArticles, getArticleCard } from "@/lib/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Article } from "@/types/article";

export function RelatedArticles({ article }: { article: Article }) {
  const allArticles = getArticles();
  const related = getRelatedArticles(article, allArticles, 3);

  if (!related.length) return null;

  return (
    <div className="mt-12 border-t border-surface-200 pt-10">
      <Reveal>
        <h2 className="mb-6 font-display text-2xl font-bold text-surface-900">
          Related Articles
        </h2>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((a, index) => (
          <Reveal key={a.slug} delay={index * 80}>
            <ArticleCard article={getArticleCard(a)} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
