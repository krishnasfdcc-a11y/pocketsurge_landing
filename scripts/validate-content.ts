import { discoverArticles } from "../lib/content/loaders";

console.log("🔍 PocketSurge — Pre-build Content Validation\n");

const articles = discoverArticles();

console.log(`\n📊 Summary:`);
console.log(`   Total valid articles: ${articles.length}`);
console.log(`   Categories: ${[...new Set(articles.map((a) => a.category))].join(", ")}`);
console.log(`   Latest: ${articles[0]?.title ?? "N/A"}`);

if (articles.length === 0) {
  console.warn("\n⚠️  WARNING: No valid articles found. The site will build with empty content.\n");
}

console.log("\n✅ Content validation complete.\n");
