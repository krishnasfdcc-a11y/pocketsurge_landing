import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { formatDate } from "@/utils/dates";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalPageLayout({
  title,
  description,
  updatedAt,
  sections,
}: {
  title: string;
  description?: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <Container size="article" className="py-12 sm:py-16">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Legal
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg leading-relaxed text-surface-500 dark:text-surface-400">
            {description}
          </p>
        )}
        <p className="mt-3 text-sm text-surface-400">
          Last updated:{" "}
          <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
        </p>
      </Reveal>

      <div className="mt-12 space-y-10">
        {sections.map((section, index) => (
          <Reveal key={section.heading} delay={Math.min(index, 6) * 40} as="section">
            <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="leading-relaxed text-surface-600 dark:text-surface-300"
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
