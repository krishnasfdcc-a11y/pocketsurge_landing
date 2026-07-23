import { Reveal } from "@/components/ui/Reveal";

const POINTS = [
  {
    title: "Practical, not puff",
    body: "Guides and reviews you can act on — clear takeaways, honest trade-offs, and context that respects your time.",
  },
  {
    title: "Wide lens, sharp focus",
    body: "From AI and cybersecurity to finance, gaming, and science — one place for the topics that shape how we build and live.",
  },
  {
    title: "Built for reading",
    body: "Long-form layouts with table of contents, FAQs, and related reads so you can skim, dive deep, or keep exploring.",
  },
] as const;

export function WhySpecial() {
  return (
    <section className="border-b border-surface-200 bg-surface-50 py-20 dark:border-surface-800 dark:bg-surface-900/50 sm:py-24">
      <div className="container-page">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
            Why PocketSurge
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-surface-500 dark:text-surface-400">
            We publish the kind of articles you bookmark — insightful, searchable, and
            worth finishing.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {POINTS.map((point, index) => (
            <Reveal key={point.title} delay={index * 100} as="article">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-surface-900 dark:text-white">
                {point.title}
              </h3>
              <p className="mt-3 leading-relaxed text-surface-500 dark:text-surface-400">
                {point.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
