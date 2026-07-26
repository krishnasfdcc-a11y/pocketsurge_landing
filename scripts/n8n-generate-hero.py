#!/usr/bin/env python3
"""
n8n-friendly script: generates ONLY hero image for ONE article.

Called by n8n Execute Command node.
Usage: python3 n8n-generate-hero.py <article_slug>

Expects:
  - SD Web UI running at host.docker.internal:7860
  - Content at /data/pocketsurge/content/<slug>/
  - image-prompts.json with at least one hero placement

Does:
  1. Reads image-prompts.json
  2. Extracts hero prompt (placement == "hero")
  3. Enriches with style hints
  4. Generates 1200x514 image via SD API
  5. Saves as images/hero.webp
  6. Renames folder from ART... -> ART...-i
  7. Updates slug in article.json
"""

import json
import os
import sys
import time
import base64
import re
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

# --- Configuration ---
SD_API_URL = "http://host.docker.internal:7860/sdapi/v1/txt2img"
CONTENT_DIR = Path("/data/pocketsurge/content")

# Universal negative prompt (DO NOT MODIFY)
NEGATIVE_PROMPT = (
    "worst quality, low quality, normal quality, low resolution, blurry, "
    "out of focus, soft focus, pixelated, jpeg artifacts, compression artifacts, "
    "noisy, grainy, oversaturated, undersaturated, overexposed, underexposed, "
    "washed out, dull colors, poor lighting, harsh shadows, poor composition, "
    "cropped, cut off, incomplete, duplicate, cloned, repeated elements, "
    "extra objects, floating objects, distorted perspective, warped, stretched, "
    "skewed, malformed, deformed, disfigured, bad anatomy, bad proportions, "
    "incorrect proportions, asymmetrical, unnatural pose, awkward pose, "
    "extra limbs, missing limbs, extra arms, extra legs, extra fingers, "
    "missing fingers, fused fingers, six fingers, malformed hands, bad hands, "
    "poorly drawn hands, twisted arms, broken limbs, long neck, mutated body, "
    "crossed eyes, lazy eye, deformed face, asymmetrical face, duplicate face, "
    "blurry eyes, bad eyes, bad teeth, malformed ears, ugly, expressionless, "
    "plastic skin, waxy skin, unrealistic skin texture, uncanny, messy hair, "
    "floating hair, dirty background, cluttered background, distracting background, "
    "frame, border, watermark, logo, signature, artist signature, artist name, "
    "branding, copyright mark, text, typography, letters, words, sentence, "
    "paragraph, caption, subtitle, title, heading, label, sticker, badge, "
    "speech bubble, comic text, handwritten text, printed text, calligraphy, "
    "font, glyphs, symbols, numbers, digits, dates, timestamps, QR code, "
    "barcode, serial number, UI elements, interface, menu, buttons, icons, "
    "overlays, HUD, notification, chat bubble, browser window, mobile UI"
)

# Style enrichment hints
STYLE_HINTS = {
    "cinematic": "cinematic lighting, dramatic composition, epic, professional photography",
    "photorealistic": "photorealistic, ultra detailed, sharp focus, 8K, professional photography",
    "3d-render": "3D render, octane render, detailed textures, volumetric lighting, isometric",
    "illustration": "digital illustration, vector art, clean lines, vibrant colors, stylized",
    "infographic": "infographic style, clean layout, professional diagram, data visualization",
    "minimal": "minimalist, clean design, simple composition, flat colors, elegant",
    "diagram": "technical diagram, clean schematic, blueprint style, labeled, structured",
}

# Generation parameters
SAMPLER = "DPM++ 2M SDE"
STEPS = 20
CFG_SCALE = 7
HERO_WIDTH = 1200
HERO_HEIGHT = 514


def set_sd_model(model_name="realisticVisionV60B1_v51HyperVAE"):
    """Set the SD model to use."""
    options_url = "http://host.docker.internal:7860/sdapi/v1/options"
    model_path = f"sd/{model_name}.safetensors"
    try:
        resp = requests.post(
            options_url,
            json={"sd_model_checkpoint": model_path},
            timeout=10,
        )
        resp.raise_for_status()
        print(f"  [OK] Model set to: {model_name}")
        return True
    except Exception as e:
        print(f"  [WARN] Could not set model: {e}")
        return False


def generate_image(prompt, width=HERO_WIDTH, height=HERO_HEIGHT, retries=3):
    """Generate an image via SD API and return PIL Image."""
    payload = {
        "prompt": prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "sampler_name": SAMPLER,
        "steps": STEPS,
        "cfg_scale": CFG_SCALE,
        "width": width,
        "height": height,
        "batch_size": 1,
        "n_iter": 1,
        "save_images": False,
        "send_images": True,
    }

    for attempt in range(1, retries + 1):
        try:
            resp = requests.post(SD_API_URL, json=payload, timeout=120)
            resp.raise_for_status()
            data = resp.json()
            if not data.get("images"):
                print(f"    [FAIL] No images in response (attempt {attempt})")
                continue
            img_data = base64.b64decode(data["images"][0])
            img = Image.open(BytesIO(img_data))
            return img
        except Exception as e:
            print(f"    [FAIL] Attempt {attempt}/{retries}: {e}")
            if attempt < retries:
                time.sleep(3)
    return None


def main():
    if len(sys.argv) < 2:
        print("ERROR: Usage: python3 n8n-generate-hero.py <article_slug>")
        sys.exit(1)

    slug = sys.argv[1]
    article_dir = CONTENT_DIR / slug

    if not article_dir.exists():
        print(f"ERROR: Article directory not found: {article_dir}")
        sys.exit(1)

    # Read image-prompts.json
    prompts_path = article_dir / "image-prompts.json"
    if not prompts_path.exists():
        print(f"SKIP: {slug} has no image-prompts.json")
        sys.exit(0)

    with open(prompts_path) as f:
        data = json.load(f)

    # Find hero image
    hero = None
    for img in data.get("images", []):
        if img.get("placement") == "hero":
            hero = img
            break

    if not hero:
        print(f"SKIP: {slug} has no hero image in image-prompts.json")
        sys.exit(0)

    # Build prompt with style enrichment
    prompt = hero["prompt"]
    style = hero.get("style", "")
    if style and style in STYLE_HINTS:
        prompt = f"{prompt}, {STYLE_HINTS[style]}"

    # Create images directory
    images_dir = article_dir / "images"
    images_dir.mkdir(exist_ok=True)

    output_path = images_dir / "hero.webp"

    # Skip if already exists
    if output_path.exists():
        size_kb = output_path.stat().st_size / 1024
        print(f"SKIP: {slug} hero.webp already exists ({size_kb:.0f} KB)")
        sys.exit(0)

    # Set model
    set_sd_model()

    # Generate
    print(f"GENERATING: {slug} hero image...")
    print(f"  Prompt: {prompt[:100]}...")
    print(f"  Size: {HERO_WIDTH}x{HERO_HEIGHT}")

    img = generate_image(prompt)

    if img is None:
        print(f"ERROR: Failed to generate hero image for {slug}")
        sys.exit(1)

    # Save as WebP
    img_rgb = img.convert("RGB")
    img_rgb.save(output_path, "WEBP", quality=85)
    file_size = output_path.stat().st_size
    print(f"OK: {slug} hero.webp saved ({file_size / 1024:.0f} KB)")

    # Rename folder: append -i suffix
    if not slug.endswith("-i"):
        new_slug = f"{slug}-i"
        new_dir = CONTENT_DIR / new_slug

        # Check if target already exists
        if new_dir.exists():
            print(f"WARN: Target folder {new_slug} already exists, skipping rename")
        else:
            article_dir.rename(new_dir)
            print(f"RENAMED: {slug} -> {new_slug}")

            # Update slug in article.json
            article_json_path = new_dir / "article.json"
            if article_json_path.exists():
                with open(article_json_path) as f:
                    article_data = json.load(f)
                article_data["slug"] = new_slug
                with open(article_json_path, "w") as f:
                    json.dump(article_data, f, indent=2)
                print(f"UPDATED: slug in article.json to {new_slug}")

    print(f"DONE: {slug} processed successfully")


if __name__ == "__main__":
    main()