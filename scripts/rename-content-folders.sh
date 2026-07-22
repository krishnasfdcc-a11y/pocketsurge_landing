#!/bin/bash
# Rename content folders to ART20260722-NNN format and update slugs
# Sorted by generatedAt timestamp ascending

CONTENT_DIR="$(dirname "$0")/../content"

declare -A MAPPING=(
  ["glow-emerges-from-stealth-at-dollar12-billion-to-tackle-ai-endpoint-threats"]="ART20260722-001"
  ["states-want-ice-agents-to-show-faces-trump-administration-says-no"]="ART20260722-002"
  ["openai-confirms-hugging-face-breach-caused-by-pre-release-models"]="ART20260722-003"
  ["dimension-capitals-dollar800m-fund-signals-the-science-compute-boom"]="ART20260722-004"
  ["obsidians-fallout-lead-rpgs-should-evoke-agony-not-power"]="ART20260722-005"
  ["run-poolside-laguna-s-21-locally-on-macos-with-mlx"]="ART20260722-006"
  ["liquid-components-a-glassmorphism-react-library-built-on-shadcnui"]="ART20260722-007"
  ["hidden-car-device-exposes-millions-to-remote-hacking"]="ART20260722-008"
  ["capital-one-earnings-questions-linger-on-discover-and-brex-deals"]="ART20260722-009"
  ["kalshi-launches-election-hub-for-midterm-prediction-markets"]="ART20260722-010"
  ["spacex-snaps-7-day-losing-streak-sets-first-earnings-date"]="ART20260722-011"
  ["strange-new-worlds-season-4-gimmicks-over-character"]="ART20260722-012"
  ["pwa-sense-bridge-privacy-first-sensor-access-for-progressive-web-apps"]="ART20260722-013"
  ["day-ahead-wind-power-forecasting-with-open-source-nwp-pipeline"]="ART20260722-014"
  ["chatgpt-configurator-open-source-api-configuration-made-easy"]="ART20260722-015"
  ["unlocking-cloud-storage-savings-with-tianjian518casgen"]="ART20260722-016"
  ["neural-mazes-production-ocr-course-build-scalable-pipelines-with-rust-and-vllm"]="ART20260722-017"
  ["neural-signals-a-powerful-c-library-for-neural-signal-processing-and-time-warping-analysis"]="ART20260722-018"
  ["ltts-true-4k-gaming-pc-build-guide-2026"]="ART20260722-019"
  ["antigravity-arcade-from-prompt-to-game-in-minutes"]="ART20260722-020"
)

cd "$CONTENT_DIR" || { echo "ERROR: Cannot find content dir"; exit 1; }

for old_slug in "${!MAPPING[@]}"; do
  new_slug="${MAPPING[$old_slug]}"
  
  if [ ! -d "$old_slug" ]; then
    echo "  [SKIP] $old_slug — directory not found"
    continue
  fi

  if [ -d "$new_slug" ]; then
    echo "  [SKIP] $old_slug → $new_slug — target already exists"
    continue
  fi

  # Update slug in article.json using sed
  article_json="$old_slug/article.json"
  if [ -f "$article_json" ]; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s/\"slug\": \".*\"/\"slug\": \"$new_slug\"/" "$article_json"
    else
      sed -i "s/\"slug\": \".*\"/\"slug\": \"$new_slug\"/" "$article_json"
    fi
    echo "  [SLUG] $old_slug → $new_slug (updated in article.json)"
  else
    echo "  [WARN] No article.json in $old_slug"
  fi

  # Rename folder
  mv "$old_slug" "$new_slug"
  echo "  [RENAME] $old_slug → $new_slug"
done

echo ""
echo "✅ All folders renamed successfully!"
echo "⚠️  Restart your dev server for changes to take effect."
