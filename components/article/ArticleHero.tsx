import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ReadingTime } from "@/components/ui/ReadingTime";
import { formatDate } from "@/utils/dates";

interface ArticleHeroProps {
  title: string;
  category: string;
  readingTime: number;
  generatedAt: string;
  heroImage: string | null;
}

export function ArticleHero({
  title,
  category,
  readingTime,
  generatedAt,
  heroImage,
}: ArticleHeroProps) {
  return (
    <div className="relative mb-10">
      <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-surface-100">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <PlaceholderImage className="h-full w-full" text="Article hero image" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="mb-3 flex items-center gap-3">
          <CategoryBadge category={category} />
          <ReadingTime minutes={readingTime} />
          <span className="text-sm text-white/70">·</span>
          <time className="text-sm text-white/70" dateTime={generatedAt}>
            {formatDate(generatedAt)}
          </time>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
