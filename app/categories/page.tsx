import Link from "next/link";
import { getCategoriesWithMeta } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description:
    "Browse PocketSurge articles by category — technology, science, finance, gaming, and more.",
});

export default function CategoriesPage() {
  const categories = getCategoriesWithMeta();

  return (
    <Container className="py-10 sm:py-14">
      <Reveal className="mb-10">
        <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-white">
          Categories
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Explore {categories.length} topic areas across PocketSurge
        </p>
      </Reveal>

      {categories.length === 0 ? (
        <div className="py-20 text-center text-surface-400">
          <p>No categories yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <Reveal key={cat.slug} delay={(index % 6) * 50}>
              <Link
                href={`/category/${cat.slug}`}
                className="group block h-full rounded-2xl border border-surface-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-surface-800 dark:bg-surface-900 dark:hover:border-brand-700"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-surface-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                    {cat.name}
                  </h2>
                  <span className="shrink-0 text-sm text-surface-400">
                    {cat.count}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                  {cat.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Container>
  );
}
