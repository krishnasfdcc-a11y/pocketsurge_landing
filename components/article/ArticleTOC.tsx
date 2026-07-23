import { slugify } from "@/utils/strings";

function parseHeadings(contentHtml: string): { level: number; text: string; id: string }[] {
  const headingRegex = /<h([1-6])(\s[^>]*)?>(.+?)<\/h\1>/gi;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[3].replace(/<[^>]*>/g, "");
    const id = slugify(text);
    headings.push({ level, text, id });
  }
  return headings;
}

export function ArticleTOC({
  contentHtml,
  sidebar = false,
}: {
  contentHtml: string;
  sidebar?: boolean;
}) {
  const headings = parseHeadings(contentHtml);
  if (!headings.length) return null;

  if (sidebar) {
    return (
      <aside className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto xl:block">
        <nav>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-surface-400">
            On this page
          </h2>
          <ul className="space-y-2 border-l-2 border-surface-200">
            {headings.map((heading, i) => (
              <li key={i}>
                <a
                  href={`#${heading.id}`}
                  className="block border-l-2 border-transparent px-4 py-1 text-sm text-surface-500 transition-all hover:border-brand-500 hover:text-brand-600 -ml-[2px]"
                  style={{ paddingLeft: `${12 + (heading.level - 2) * 16}px` }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

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
