import Link from "next/link";
import { getTagsWithMeta } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Tags",
  description: "Browse PocketSurge articles by tag.",
});

export default function TagsPage() {
  const tags = getTagsWithMeta();
  const max = Math.max(...tags.map((t) => t.count), 1);

  return (
    <Container className="py-10 sm:py-14">
      <Reveal className="mb-10">
        <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-white">
          Tags
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          {tags.length} tags across our library
        </p>
      </Reveal>

      {tags.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No tags yet.</p>
        </div>
      ) : (
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => {
              const weight = 0.85 + (tag.count / max) * 0.45;
              return (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-200 bg-white px-4 py-2 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-600 dark:hover:bg-brand-950"
                  style={{ fontSize: `${weight}rem` }}
                >
                  <span className="font-medium text-surface-800 dark:text-surface-100">
                    {tag.name}
                  </span>
                  <span className="text-xs text-surface-400">{tag.count}</span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      )}
    </Container>
  );
}
