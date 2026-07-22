import json
import re
import sys

slug = sys.argv[1] if len(sys.argv) > 1 else "ART20260722-020"
base = "/Users/chaithrakrishna/Documents/PocketSurge/pocketsurge_landing/content"

with open(f"{base}/{slug}/article.json") as f:
    data = json.load(f)

html = data.get("contentHtml", "")
headings = re.findall(r"<h[1-6][^>]*>", html)
print("Headings in contentHtml:")
for h in headings:
    print(f"  {h}")

print()
with open(f"{base}/{slug}/seo.json") as f:
    seo = json.load(f)

print("SEO headings (ToC sources):")
for h in seo.get("headings", []):
    toc_id = h["text"].lower().replace(" ", "-").replace("'", "").replace(":", "").replace(",", "").replace("(", "").replace(")", "").replace("/", "-")
    print(f'  h{h["level"]} "{h["text"]}" -> #{toc_id}')

print()
print("CHECK: Do contentHtml headings have id attributes?")
ids = re.findall(r'<h[1-6][^>]*id="([^"]*)"', html)
print(f"  Found {len(ids)} heading ids in HTML: {ids}")
