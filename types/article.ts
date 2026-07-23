export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  tags: string[];
  readingTime: number;
  wordCount: number;
  category: string;
  researchId: string;
  topicId: string;
  generatedAt: string;
  updatedAt: string;
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
  tags: string[];
  language: string;
  status: "published" | "draft";
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
  schemaOrg: Record<string, unknown>;
  generatedAt: string;
  updatedAt: string;
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

export interface GalleryImage {
  src: string;
  caption?: string;
  alt?: string;
}

export interface ArticleImages {
  hero: string | null;
  gallery: GalleryImage[];
}

export interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  keywords: string[];
  tags: string[];
  readingTime: number;
  generatedAt: string;
  heroImage: string | null;
}

export interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  category: string;
}

export interface CategoryMeta {
  name: string;
  slug: string;
  count: number;
  description: string;
}

export interface TagMeta {
  name: string;
  slug: string;
  count: number;
}
