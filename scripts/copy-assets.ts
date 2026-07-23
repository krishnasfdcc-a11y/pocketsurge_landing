import fs from "node:fs";
import path from "node:path";

const contentDir = path.join(process.cwd(), "content");
const outDir = path.join(process.cwd(), "out", "content");

if (!fs.existsSync(contentDir)) {
  console.log("No content directory found. Skipping asset copy.");
  process.exit(0);
}

const entries = fs.readdirSync(contentDir, { withFileTypes: true });
const articleDirs = entries.filter((e) => e.isDirectory());

let copied = 0;

for (const dir of articleDirs) {
  const imagesDir = path.join(contentDir, dir.name, "images");
  if (!fs.existsSync(imagesDir)) continue;

  const destDir = path.join(outDir, dir.name, "images");
  fs.mkdirSync(destDir, { recursive: true });

  const imageFiles = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".webp"));
  for (const file of imageFiles) {
    fs.copyFileSync(path.join(imagesDir, file), path.join(destDir, file));
    copied++;
  }
}

console.log(`\n📦 Copied ${copied} image(s) to out/content/\n`);
