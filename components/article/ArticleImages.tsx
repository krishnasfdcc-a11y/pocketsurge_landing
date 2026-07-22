import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function ArticleImages({ images }: { images: string[] }) {
  if (!images.length) return null;

  return (
    <div className="mt-10 border-t border-surface-200 pt-10">
      <h2 className="mb-6 text-2xl font-bold text-surface-900">Gallery</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-100"
          >
            {src ? (
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="h-full w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
