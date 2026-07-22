import { slugify } from "@/utils/strings";

function parseHeadings(contentHtml: string): { level: number; text: string; id: string }[] {
  const headingRegex = /<h([1-6])(\s[^>]*)?>(.+?)<\/h\1>/gi;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[3].replace(/<[^>]*>/g, ""); // strip any inner HTML
    const id = slugify(text);
    headings.push({ level, text, id });
  }
  return headings;
}

export function ArticleTOC({ contentHtml }: { contentHtml: string }) {
  const headings = parseHeadings(contentHtml);
  if (!headings.length) return null;

  return (
    <nav className="mb-10 rounded-xl border border-surface-200 bg-surface-50 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Table of Contents
      </h2>
      <ul className="space-y-1.5">
        {headings.map((heading, i) => (
          <li key={i} style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-surface-600 transition-colors hover:text-brand-600"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
