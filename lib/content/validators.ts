import { z } from "zod";

// --- Flexible keywords — accept flat array OR structured object ---
const KeywordsArray = z.array(z.string());
const KeywordsObject = z.object({
  primary: z.string().optional(),
  secondary: z.array(z.string()).optional().default([]),
  related: z.array(z.string()).optional().default([]),
});
export const KeywordsSchema = z
  .union([KeywordsArray, KeywordsObject])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    return [
      ...(val.primary ? [val.primary] : []),
      ...(val.secondary ?? []),
      ...(val.related ?? []),
    ];
  });

// --- Flexible headings — accept array OR {h1, h2[], h3[]} ---
export const SEOHeadingSchema = z.object({
  level: z.number().int().min(1).max(6),
  text: z.string(),
});

const HeadingsObject = z
  .object({
    h1: z.string().optional(),
    h2: z.array(z.string()).optional().default([]),
    h3: z.array(z.string()).optional().default([]),
    h4: z.array(z.string()).optional().default([]),
    h5: z.array(z.string()).optional().default([]),
    h6: z.array(z.string()).optional().default([]),
  })
  .transform((val) => {
    const result: { level: number; text: string }[] = [];
    if (val.h1) result.push({ level: 1, text: val.h1 });
    for (const h of val.h2) result.push({ level: 2, text: h });
    for (const h of val.h3) result.push({ level: 3, text: h });
    for (const h of val.h4) result.push({ level: 4, text: h });
    for (const h of val.h5) result.push({ level: 5, text: h });
    for (const h of val.h6) result.push({ level: 6, text: h });
    return result;
  });

export const HeadingsSchema = z
  .union([z.array(SEOHeadingSchema), HeadingsObject])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    return val; // Already transformed by HeadingsObject
  })
  .default([]);

// --- Flexible internal/external links ---
const LinkSchema = z.object({
  url: z.string().optional(),
  suggestedUrl: z.string().optional(),
  text: z.string().optional(),
  anchor: z.string().optional(),
});

const LinkArrayToSEOLinks = z
  .array(LinkSchema)
  .transform((links) =>
    links.map((l) => ({
      url: l.url ?? l.suggestedUrl ?? "#",
      text: l.text ?? l.anchor ?? "",
    }))
  );

// --- Optional metadata types ---
export const OpenGraphSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  type: z.string().optional(),
  locale: z.string().optional(),
});

export const TwitterCardSchema = z.object({
  card: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  creator: z.string().optional(),
});

// --- FAQ: accept both [{question, answer}] and { faq: [{question, answer}] } ---
export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const FAQWrapped = z.object({
  faq: z.array(FAQItemSchema),
});

export const FAQDataSchema = z
  .union([z.array(FAQItemSchema), FAQWrapped])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    return val.faq;
  })
  .default([]);

// --- SEO data — permissive, everything optional ---
const SEODataRaw = z.object({
  title: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional().default(""),
  keywords: KeywordsSchema.optional().default([]),
  headings: HeadingsSchema,
  internalLinks: LinkArrayToSEOLinks.optional().default([]),
  externalLinks: LinkArrayToSEOLinks.optional().default([]),
  structuredData: z.record(z.unknown()).optional().default({}),
  canonicalUrl: z.string().optional(),
});

export const SEODataSchema = SEODataRaw.transform((raw) => ({
  seoTitle: raw.seoTitle ?? raw.title ?? "",
  metaDescription: raw.metaDescription,
  keywords: raw.keywords,
  headings: raw.headings,
  internalLinks: raw.internalLinks,
  externalLinks: raw.externalLinks,
  structuredData: raw.structuredData,
  canonicalUrl: raw.canonicalUrl ?? "",
}));

// --- Metadata — permissive, maps aliased field names ---
const MetadataRaw = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  language: z.string().optional(),
  status: z.string().optional(),
  og: OpenGraphSchema.optional(),
  openGraph: OpenGraphSchema.optional(),
  twitter: TwitterCardSchema.optional(),
  schemaOrg: z.record(z.unknown()).optional(),
  generatedAt: z.string().optional(),
});

export const MetadataSchema = MetadataRaw.transform((raw) => ({
  title: raw.title ?? "",
  description: raw.description ?? "",
  excerpt: raw.excerpt ?? "",
  category: raw.category ?? "Uncategorized",
  keywords: raw.keywords ?? [],
  language: raw.language ?? "en",
  status:
    raw.status === "approved" || raw.status === "published"
      ? ("published" as const)
      : ("draft" as const),
  openGraph: (raw.og ?? raw.openGraph ?? {}) as {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    locale?: string;
  },
  twitter: (raw.twitter ?? {}) as {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  },
  schemaOrg: raw.schemaOrg ?? {},
  generatedAt: raw.generatedAt ?? "",
}));

// --- Article data — title required, content OR contentHtml required ---
export const ArticleDataSchema = z
  .object({
    slug: z.string().optional(),
    title: z.string(),
    excerpt: z.string().optional().default(""),
    content: z.string().optional(),
    contentHtml: z.string().optional(),
    keywords: KeywordsSchema.optional().default([]),
    readingTime: z.number().optional().default(0),
    wordCount: z.number().optional().default(0),
    category: z.string().optional().default("Uncategorized"),
    researchId: z.string().optional().default(""),
    topicId: z.string().optional().default(""),
    generatedAt: z.string().optional().default(new Date().toISOString()),
  })
  .refine((d) => d.contentHtml || d.content, {
    message: "Either 'content' or 'contentHtml' is required.",
  })
  .transform((d) => ({
    ...d,
    content: d.contentHtml ?? d.content ?? "",
  }));
