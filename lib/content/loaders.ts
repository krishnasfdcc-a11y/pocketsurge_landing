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
} from "@/types/article";

function safeReadJSON<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`  Failed to read/parse JSON: ${filePath} — ${(err as Error).message}`);
    return null;
  }
}

function discoverImages(articleDir: string): ArticleImages {
  const imagesDir = path.join(articleDir, "images");
  const heroPath = path.join(imagesDir, "hero.webp");

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

    images.gallery = galleryFiles.map(
      (f) => `/content/${path.basename(articleDir)}/images/${f}`
    );
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

  // Load and validate article.json
  const articleRaw = safeReadJSON<Record<string, unknown>>(
    path.join(articleDir, "article.json")
  );
  if (!articleRaw) return null;

  const articleResult = ArticleDataSchema.safeParse(articleRaw);
  if (!articleResult.success) {
    console.warn(`  Invalid article.json in "${slug}":`, articleResult.error.flatten());
    return null;
  }
  const articleData = articleResult.data;

  // Load metadata.json (optional — use article data as defaults)
  let metadata: ArticleMetadata = {
    title: articleData.title,
    description: articleData.excerpt,
    excerpt: articleData.excerpt,
    category: articleData.category,
    keywords: articleData.keywords,
    language: "en",
    status: "published",
    openGraph: { title: articleData.title, description: articleData.excerpt },
    twitter: { title: articleData.title, description: articleData.excerpt },
    schemaOrg: {},
    generatedAt: articleData.generatedAt,
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

  // Load seo.json (optional — use defaults if missing/invalid)
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

  // Load faq.json (optional)
  let faq: FAQItem[] = [];
  const faqRaw = safeReadJSON<unknown[]>(
    path.join(articleDir, "faq.json")
  );
  if (faqRaw) {
    const faqResult = FAQDataSchema.safeParse(faqRaw);
    if (faqResult.success) {
      faq = faqResult.data;
    } else {
      console.warn(`  ⚠️  Invalid faq.json in "${slug}" — using empty FAQ`);
    }
  }

  // Discover images
  const images = discoverImages(articleDir);

  return {
    slug: articleData.slug || slug,
    title: articleData.title,
    excerpt: articleData.excerpt,
    content: articleData.content,
    keywords: articleData.keywords,
    readingTime: articleData.readingTime,
    wordCount: articleData.wordCount,
    category: articleData.category,
    researchId: articleData.researchId,
    topicId: articleData.topicId,
    generatedAt: articleData.generatedAt,
    metadata,
    seo,
    faq,
    images,
  };
}

export function discoverArticles(): Article[] {
  const contentDir = path.join(process.cwd(), "content");

  if (!fs.existsSync(contentDir)) {
    console.warn("No content directory found. Creating empty content/ directory.");
    fs.mkdirSync(contentDir, { recursive: true });
    return [];
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const articleDirs = entries
    .filter((e) => e.isDirectory())
    .filter((e) => fs.existsSync(path.join(contentDir, e.name, "article.json")))
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

  // Sort by generatedAt descending (newest first)
  articles.sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  console.log(`\n✅ Successfully loaded ${articles.length} article(s)\n`);

  return articles;
}
