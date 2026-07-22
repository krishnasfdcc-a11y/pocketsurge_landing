import fs from "node:fs";
import path from "node:path";
import { discoverArticles } from "../lib/content/loaders";

const SITE_URL = "https://pocketsurge.com";
const SITE_NAME = "PocketSurge";
const SITE_DESCRIPTION = "Your daily dose of tech insights, guides, and reviews.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

console.log("📡 Generating RSS feed...\n");

const articles = discoverArticles();

const items = articles
  .map(
    (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/article/${a.slug}</link>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.generatedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/article/${a.slug}</guid>
      <category>${escapeXml(a.category)}</category>
    </item>`
  )
  .join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

const outPath = path.join(process.cwd(), "public", "feed.xml");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rss, "utf-8");

console.log(`✅ RSS feed written to public/feed.xml (${articles.length} articles)\n`);
