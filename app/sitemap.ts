import {
  getArticles,
  getCategories,
  getTags,
  getCategoriesWithMeta,
} from "@/lib/content";
import { SITE, LEGAL_LINKS, COMPANY_LINKS } from "@/config/site";
import { tagSlug } from "@/utils/strings";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const categories = getCategories();
  const tags = getTags();
  const categoryMeta = getCategoriesWithMeta();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE.url}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/latest`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...COMPANY_LINKS.map((link) => ({
      url: `${SITE.url}${link.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...LEGAL_LINKS.map((link) => ({
      url: `${SITE.url}${link.href}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE.url}/article/${a.slug}`,
    lastModified: new Date(a.updatedAt || a.generatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE.url}/category/${c.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Ensure category meta descriptions exist (side-effect free read)
  void categoryMeta;

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${SITE.url}/tag/${tagSlug(t)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...tagRoutes];
}
