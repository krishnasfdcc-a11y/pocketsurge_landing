import fs from "node:fs";
import path from "node:path";
import {
  ArticleDataSchema,
  MetadataSchema,
  SEODataSchema,
  FAQDataSchema,
} from "./validators";
import type {
  Article,
  ArticleMetadata,
  SEOData,
  FAQItem,
  ArticleImages,
  GalleryImage,
} from "@/types/article";
import { normalizeTagList } from "@/utils/strings";

function safeReadJSON<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(
      `  Failed to read/parse JSON: ${filePath} — ${(err as Error).message}`
    );
    return null;
  }
}

interface ImagePromptEntry {
  id?: string;
  caption?: string;
  altText?: string;
  placement?: string;
}

function loadImageCaptions(
  articleDir: string
): Map<string, { caption?: string; alt?: string }> {
  const map = new Map<string, { caption?: string; alt?: string }>();
  const prompts = safeReadJSON<{ images?: ImagePromptEntry[] }>(
    path.join(articleDir, "image-prompts.json")
  );
  if (!prompts?.images) return map;

  for (const img of prompts.images) {
    if (!img.id) continue;
    // image-1 → hero; image-2 → image-2.webp, etc.
    if (img.id === "image-1") {
      map.set("hero", { caption: img.caption, alt: img.altText });
    } else {
      const num = img.id.replace(/^image-/, "");
      map.set(`image-${num}.webp`, {
        caption: img.caption,
        alt: img.altText,
      });
    }
  }
  return map;
}

function discoverImages(articleDir: string): ArticleImages {
  const imagesDir = path.join(articleDir, "images");
  const heroPath = path.join(imagesDir, "hero.webp");
  const captions = loadImageCaptions(articleDir);

  const images: ArticleImages = {
    hero: null,
    gallery: [],
  };

  if (!fs.existsSync(imagesDir)) {
    return images;
  }

  if (fs.existsSync(heroPath)) {
    images.hero = `/content/${path.basename(articleDir)}/images/hero.webp`;
  }

  try {
    const files = fs.readdirSync(imagesDir);
    const galleryFiles = files
      .filter((f) => /^image-\d+\.webp$/.test(f))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)![0], 10);
        const bNum = parseInt(b.match(/\d+/)![0], 10);
        return aNum - bNum;
      });

    images.gallery = galleryFiles.map((f): GalleryImage => {
      const meta = captions.get(f);
      return {
        src: `/content/${path.basename(articleDir)}/images/${f}`,
        caption: meta?.caption,
        alt: meta?.alt,
      };
    });
  } catch {
    // Gallery discovery failed — non-fatal
  }

  return images;
}

export function loadArticle(slug: string): Article | null {
  const articleDir = path.join(process.cwd(), "content", slug);

  if (!fs.existsSync(articleDir)) {
    console.warn(`Article directory not found: ${articleDir}`);
    return null;
  }

  const articleRaw = safeReadJSON<Record<string, unknown>>(
    path.join(articleDir, "article.json")
  );
  if (!articleRaw) return null;

  const articleResult = ArticleDataSchema.safeParse(articleRaw);
  if (!articleResult.success) {
    console.warn(
      `  Invalid article.json in "${slug}":`,
      articleResult.error.flatten()
    );
    return null;
  }
  const articleData = articleResult.data;

  let metadata: ArticleMetadata = {
    title: articleData.title,
    description: articleData.excerpt,
    excerpt: articleData.excerpt,
    category: articleData.category,
    keywords: articleData.keywords,
    tags: [],
    language: "en",
    status: "published",
    openGraph: { title: articleData.title, description: articleData.excerpt },
    twitter: { title: articleData.title, description: articleData.excerpt },
    schemaOrg: {},
    generatedAt: articleData.generatedAt,
    updatedAt: articleData.generatedAt,
  };
  const metadataRaw = safeReadJSON<Record<string, unknown>>(
    path.join(articleDir, "metadata.json")
  );
  if (metadataRaw) {
    const metadataResult = MetadataSchema.safeParse(metadataRaw);
    if (metadataResult.success) {
      metadata = metadataResult.data;
    } else {
      console.warn(`  ⚠️  Invalid metadata.json in "${slug}" — using defaults`);
    }
  }

  let seo: SEOData = {
    seoTitle: articleData.title,
    metaDescription: articleData.excerpt,
    keywords: articleData.keywords,
    headings: [],
    internalLinks: [],
    externalLinks: [],
    structuredData: {},
    canonicalUrl: "",
  };
  const seoRaw = safeReadJSON<Record<string, unknown>>(
    path.join(articleDir, "seo.json")
  );
  if (seoRaw) {
    const seoResult = SEODataSchema.safeParse(seoRaw);
    if (seoResult.success) {
      seo = seoResult.data;
    } else {
      console.warn(`  ⚠️  Invalid seo.json in "${slug}" — using defaults`);
    }
  }

  let faq: FAQItem[] = [];
  const faqRaw = safeReadJSON<unknown[]>(path.join(articleDir, "faq.json"));
  if (faqRaw) {
    const faqResult = FAQDataSchema.safeParse(faqRaw);
    if (faqResult.success) {
      faq = faqResult.data;
    } else {
      console.warn(`  ⚠️  Invalid faq.json in "${slug}" — using empty FAQ`);
    }
  }

  const images = discoverImages(articleDir);

  const tags = normalizeTagList(
    metadata.tags.length > 0
      ? metadata.tags
      : articleData.keywords.length > 0
        ? articleData.keywords
        : metadata.keywords
  );

  const generatedAt = articleData.generatedAt || metadata.generatedAt;
  const updatedAt =
    metadata.updatedAt || metadata.generatedAt || articleData.generatedAt;

  return {
    slug: articleData.slug || slug,
    title: articleData.title,
    excerpt: articleData.excerpt || metadata.excerpt || metadata.description,
    content: articleData.content,
    keywords: articleData.keywords.length
      ? articleData.keywords
      : metadata.keywords,
    tags,
    readingTime: articleData.readingTime,
    wordCount: articleData.wordCount,
    category: articleData.category || metadata.category,
    researchId: articleData.researchId,
    topicId: articleData.topicId,
    generatedAt,
    updatedAt,
    metadata: { ...metadata, tags, updatedAt },
    seo,
    faq,
    images,
  };
}

export function discoverArticles(): Article[] {
  const contentDir = path.join(process.cwd(), "content");

  if (!fs.existsSync(contentDir)) {
    console.warn(
      "No content directory found. Creating empty content/ directory."
    );
    fs.mkdirSync(contentDir, { recursive: true });
    return [];
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const articleDirs = entries
    .filter((e) => e.isDirectory())
    .filter((e) =>
      fs.existsSync(path.join(contentDir, e.name, "article.json"))
    )
    .map((e) => e.name);

  console.log(`\n📦 Discovering articles in content/ ...`);
  console.log(`   Found ${articleDirs.length} folder(s)\n`);

  const articles: Article[] = [];

  for (const slug of articleDirs) {
    console.log(`  📄 ${slug}`);
    const article = loadArticle(slug);
    if (article) {
      articles.push(article);
    } else {
      console.warn(`  ⚠️  Skipping "${slug}" — validation failed\n`);
    }
  }

  articles.sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  console.log(`\n✅ Successfully loaded ${articles.length} article(s)\n`);

  return articles;
}
