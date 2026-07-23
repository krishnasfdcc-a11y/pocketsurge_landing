import { ArticleCard } from "@/components/cards/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";
import { getArticleCard } from "@/lib/content";
import type { Article } from "@/types/article";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a, index) => (
        <Reveal key={a.slug} delay={(index % 6) * 60}>
          <ArticleCard article={getArticleCard(a)} />
        </Reveal>
      ))}
    </div>
  );
}
