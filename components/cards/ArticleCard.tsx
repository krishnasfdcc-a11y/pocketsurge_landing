import Link from "next/link";
import Image from "next/image";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ReadingTime } from "@/components/ui/ReadingTime";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatDate } from "@/utils/dates";
import { truncate } from "@/utils/strings";
import { cn } from "@/utils/cn";

interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  generatedAt: string;
  heroImage: string | null;
}

export function ArticleCard({
  article,
  className,
}: {
  article: ArticleCardData;
  className?: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-surface-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-surface-800 dark:bg-surface-900 dark:hover:border-brand-700",
        className
      )}
    >
      <div className="aspect-[16/9] overflow-hidden bg-surface-100 dark:bg-surface-800">
        {article.heroImage ? (
          <Image
            src={article.heroImage}
            alt={article.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage className="h-full w-full" />
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <CategoryBadge category={article.category} />
          <ReadingTime minutes={article.readingTime} />
        </div>
        <h3 className="mb-2 text-lg font-semibold leading-tight text-surface-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {article.title}
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
          {truncate(article.excerpt, 120)}
        </p>
        <time className="text-xs text-surface-400" dateTime={article.generatedAt}>
          {formatDate(article.generatedAt)}
        </time>
      </div>
    </Link>
  );
}
