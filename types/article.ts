export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  readingTime: number;
  wordCount: number;
  category: string;
  researchId: string;
  topicId: string;
  generatedAt: string;
  metadata: ArticleMetadata;
  seo: SEOData;
  faq: FAQItem[];
  images: ArticleImages;
}

export interface ArticleMetadata {
  title: string;
  description: string;
  excerpt: string;
  category: string;
  keywords: string[];
  language: string;
  status: "published" | "draft";
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
  schemaOrg: Record<string, unknown>;
  generatedAt: string;
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  locale?: string;
}

export interface TwitterCardData {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  creator?: string;
}

export interface SEOLink {
  url: string;
  text: string;
}

export interface SEOHeading {
  level: number;
  text: string;
}

export interface SEOData {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  headings: SEOHeading[];
  internalLinks: SEOLink[];
  externalLinks: SEOLink[];
  structuredData: Record<string, unknown>;
  canonicalUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleImages {
  hero: string | null;
  gallery: string[];
}

export interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  keywords: string[];
  readingTime: number;
  generatedAt: string;
  heroImage: string | null;
}

export interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  category: string;
}
