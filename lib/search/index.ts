export interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  category: string;
}

export function searchEntries(
  entries: SearchEntry[],
  query: string
): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.excerpt.toLowerCase().includes(q) ||
      e.keywords.some((k) => k.toLowerCase().includes(q)) ||
      e.tags.some((t) => t.toLowerCase().includes(q)) ||
      e.category.toLowerCase().includes(q)
  );
}
