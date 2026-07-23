/**
 * Generate urls.txt — a flat list of every URL on the site.
 * Useful for Google Search Console bulk inspection, indexing tools, and tracking.
 */

import { getArticles, getCategories, getTags } from "@/lib/content";
import { SITE, LEGAL_LINKS, COMPANY_LINKS } from "@/config/site";
import { tagSlug } from "@/utils/strings";
import fs from "fs";
import path from "path";

const urls: string[] = [];

// Static pages
urls.push(SITE.url);
urls.push(`${SITE.url}/articles`);
urls.push(`${SITE.url}/latest`);
urls.push(`${SITE.url}/trending`);
urls.push(`${SITE.url}/search`);
urls.push(`${SITE.url}/categories`);
urls.push(`${SITE.url}/tags`);
urls.push(`${SITE.url}/sitemap.xml`);

// Company & legal pages
for (const link of COMPANY_LINKS) urls.push(`${SITE.url}${link.href}`);
for (const link of LEGAL_LINKS) urls.push(`${SITE.url}${link.href}`);

// Article pages
const articles = getArticles();
for (const a of articles) urls.push(`${SITE.url}/article/${a.slug}`);

// Category pages
const categories = getCategories();
for (const c of categories) urls.push(`${SITE.url}/category/${c.toLowerCase()}`);

// Tag pages
const tags = getTags();
for (const t of tags) urls.push(`${SITE.url}/tag/${tagSlug(t)}`);

// Write to public/urls.txt
const outPath = path.join(process.cwd(), "public", "urls.txt");
fs.writeFileSync(outPath, urls.join("\n") + "\n", "utf-8");
console.log(`✅ Generated ${urls.length} URLs → public/urls.txt`);