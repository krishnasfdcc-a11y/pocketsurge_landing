import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { GalleryImage } from "@/types/article";

export function ArticleImages({ images }: { images: GalleryImage[] }) {
  if (!images.length) return null;

  return (
    <div className="mt-10 border-t border-surface-200 pt-10 dark:border-surface-800">
      <h2 className="mb-6 font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
        Gallery
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <figure key={image.src || i} className="space-y-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800">
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt || `Gallery image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <PlaceholderImage className="h-full w-full" />
              )}
            </div>
            {image.caption && (
              <figcaption className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
