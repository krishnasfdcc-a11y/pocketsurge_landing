import Link from "next/link";
import Image from "next/image";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ReadingTime } from "@/components/ui/ReadingTime";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatDate } from "@/utils/dates";
import { truncate } from "@/utils/strings";

interface FeaturedCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  generatedAt: string;
  heroImage: string | null;
}

export function FeaturedCard({ article }: { article: FeaturedCardData }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl dark:border-surface-800 dark:bg-surface-900 dark:hover:border-brand-700 lg:flex-row"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-100 lg:aspect-square lg:w-[45%]">
        {article.heroImage ? (
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
        ) : (
          <PlaceholderImage className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-col justify-center p-6 lg:p-10">
        <div className="mb-4 flex items-center gap-3">
          <CategoryBadge category={article.category} />
          <ReadingTime minutes={article.readingTime} />
        </div>
        <h2 className="mb-3 font-display text-2xl font-bold leading-tight text-surface-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 lg:text-3xl">
          {article.title}
        </h2>
        <p className="mb-4 text-base leading-relaxed text-surface-500 dark:text-surface-400">
          {truncate(article.excerpt, 180)}
        </p>
        <time
          className="text-sm text-surface-400"
          dateTime={article.generatedAt}
        >
          {formatDate(article.generatedAt)}
        </time>
      </div>
    </Link>
  );
}
