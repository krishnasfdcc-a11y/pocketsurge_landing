#!/usr/bin/env python3
"""
Rename all content folders to ART20260722-NNN format and update slugs.
Sorted by generatedAt timestamp.
"""

import json
import os
import shutil
from datetime import datetime

CONTENT_DIR = os.path.join(os.path.dirname(__file__), "..", "content")

# Map: current slug -> new folder name
# Sorted by generatedAt timestamp ascending
MAPPING = [
    ("glow-emerges-from-stealth-at-dollar12-billion-to-tackle-ai-endpoint-threats", "ART20260722-001"),
    ("states-want-ice-agents-to-show-faces-trump-administration-says-no", "ART20260722-002"),
    ("openai-confirms-hugging-face-breach-caused-by-pre-release-models", "ART20260722-003"),
    ("dimension-capitals-dollar800m-fund-signals-the-science-compute-boom", "ART20260722-004"),
    ("obsidians-fallout-lead-rpgs-should-evoke-agony-not-power", "ART20260722-005"),
    ("run-poolside-laguna-s-21-locally-on-macos-with-mlx", "ART20260722-006"),
    ("liquid-components-a-glassmorphism-react-library-built-on-shadcnui", "ART20260722-007"),
    ("hidden-car-device-exposes-millions-to-remote-hacking", "ART20260722-008"),
    ("capital-one-earnings-questions-linger-on-discover-and-brex-deals", "ART20260722-009"),
    ("kalshi-launches-election-hub-for-midterm-prediction-markets", "ART20260722-010"),
    ("spacex-snaps-7-day-losing-streak-sets-first-earnings-date", "ART20260722-011"),
    ("strange-new-worlds-season-4-gimmicks-over-character", "ART20260722-012"),
    ("pwa-sense-bridge-privacy-first-sensor-access-for-progressive-web-apps", "ART20260722-013"),
    ("day-ahead-wind-power-forecasting-with-open-source-nwp-pipeline", "ART20260722-014"),
    ("chatgpt-configurator-open-source-api-configuration-made-easy", "ART20260722-015"),
    ("unlocking-cloud-storage-savings-with-tianjian518casgen", "ART20260722-016"),
    ("neural-mazes-production-ocr-course-build-scalable-pipelines-with-rust-and-vllm", "ART20260722-017"),
    ("neural-signals-a-powerful-c-library-for-neural-signal-processing-and-time-warping-analysis", "ART20260722-018"),
    ("ltts-true-4k-gaming-pc-build-guide-2026", "ART20260722-019"),
    ("antigravity-arcade-from-prompt-to-game-in-minutes", "ART20260722-020"),
]


def main():
    print("=" * 60)
    print("Renaming content folders and updating slugs")
    print("=" * 60)

    for old_slug, new_slug in MAPPING:
        old_dir = os.path.join(CONTENT_DIR, old_slug)
        new_dir = os.path.join(CONTENT_DIR, new_slug)

        if not os.path.isdir(old_dir):
            print(f"  [SKIP] {old_slug} — directory not found")
            continue

        if os.path.exists(new_dir):
            print(f"  [SKIP] {old_slug} → {new_slug} — target already exists")
            continue

        # Step 1: Update slug in article.json
        article_json = os.path.join(old_dir, "article.json")
        if os.path.exists(article_json):
            with open(article_json, "r") as f:
                data = json.load(f)
            old_slug_in_file = data.get("slug", "")
            data["slug"] = new_slug
            with open(article_json, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.write("\n")  # trailing newline
            print(f"  [SLUG] {old_slug_in_file} → {new_slug} (updated in article.json)")
        else:
            print(f"  [WARN] No article.json in {old_dir}")

        # Step 2: Rename the folder
        os.rename(old_dir, new_dir)
        print(f"  [RENAME] {old_slug} → {new_slug}")

    print(f"\n✅ {len(MAPPING)} folders renamed successfully")
    print("\n⚠️  Don't forget to restart the dev server after renaming!")


if __name__ == "__main__":
    main()
