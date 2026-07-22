#!/usr/bin/env python3
"""
Generate all article images using Stable Diffusion Web UI API.

For each article with image-prompts.json:
 - Creates images/ folder inside the article directory
 - Generates hero image at 1200x514 (21:9)
 - Generates gallery images at 1024x768 (4:3)
 - Saves as WebP
 - Reuses hero.webp for other purposes (OG, cards, etc.)
"""

import json
import os
import sys
import time
import base64
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

# --- Configuration ---
SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
SD_MODEL_OPTIONS_URL = "http://127.0.0.1:7860/sdapi/v1/options"

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"

# Universal negative prompt
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

# Generation parameters
SAMPLER = "DPM++ 2M SDE"
STEPS = 20
CFG_SCALE = 7

# Resolution mapping
HERO_WIDTH, HERO_HEIGHT = 1200, 514  # 21:9
GALLERY_WIDTH, GALLERY_HEIGHT = 1024, 768  # 4:3


def set_sd_model(model_name):
    """Set the SD model to use."""
    model_path = f"sd/{model_name}.safetensors"
    try:
        resp = requests.post(
            SD_MODEL_OPTIONS_URL,
            json={"sd_model_checkpoint": model_path},
            timeout=10,
        )
        resp.raise_for_status()
        print(f"  [OK] Model set to: {model_name}")
        return True
    except Exception as e:
        print(f"  [WARN] Could not set model: {e}")
        return False


def generate_image(prompt, width, height, retries=3):
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


def convert_to_webp(img, output_path, quality=85):
    """Convert PIL Image to WebP and save."""
    img_rgb = img.convert("RGB")
    img_rgb.save(output_path, "WEBP", quality=quality)
    return output_path.stat().st_size


def process_article(article_dir):
    """Process all images for a single article."""
    slug = article_dir.name
    prompts_path = article_dir / "image-prompts.json"

    if not prompts_path.exists():
        print(f"\n=== SKIP {slug} (no image-prompts.json) ===")
        return

    with open(prompts_path, "r") as f:
        data = json.load(f)

    images_config = data.get("images", [])
    if not images_config:
        print(f"\n=== SKIP {slug} (no images in config) ===")
        return

    # Create images directory
    images_dir = article_dir / "images"
    images_dir.mkdir(exist_ok=True)

    print(f"\n{'='*60}")
    print(f"=== {slug} ({len(images_config)} images) ===")
    print(f"{'='*60}")

    for img_cfg in images_config:
        img_id = img_cfg["id"]
        prompt = img_cfg["prompt"]
        placement = img_cfg.get("placement", "")
        style = img_cfg.get("style", "")

        # Determine output filename and resolution
        is_hero = placement == "hero"
        if is_hero:
            output_name = "hero.webp"
            w, h = HERO_WIDTH, HERO_HEIGHT
        else:
            output_name = f"{img_id}.webp"
            w, h = GALLERY_WIDTH, GALLERY_HEIGHT

        output_path = images_dir / output_name

        # Skip if already exists (handy for restarting)
        if output_path.exists():
            size_kb = output_path.stat().st_size / 1024
            print(f"  [SKIP] {output_name} ({size_kb:.0f} KB - already exists)")
            continue

        # Enrich prompt with style hints
        full_prompt = prompt
        if style:
            style_hints = {
                "cinematic": "cinematic lighting, dramatic composition, epic, professional photography",
                "photorealistic": "photorealistic, ultra detailed, sharp focus, 8K, professional photography",
                "3d-render": "3D render, octane render, detailed textures, volumetric lighting, isometric",
                "illustration": "digital illustration, vector art, clean lines, vibrant colors, stylized",
                "infographic": "infographic style, clean layout, professional diagram, data visualization",
                "minimal": "minimalist, clean design, simple composition, flat colors, elegant",
                "diagram": "technical diagram, clean schematic, blueprint style, labeled, structured",
            }
            if style in style_hints:
                full_prompt = f"{prompt}, {style_hints[style]}"

        print(f"  Generating {output_name} ({w}x{h}) - style: {style}...")
        print(f"    Prompt: {prompt[:80]}...")

        img = generate_image(full_prompt, w, h)

        if img is None:
            print(f"    [FAIL] Could not generate {output_name}")
            continue

        # Save as WebP
        file_size = convert_to_webp(img, output_path)
        print(f"    [OK] Saved {output_name} ({file_size / 1024:.0f} KB)")

        # Small delay between generations
        time.sleep(1)

    # Count what was generated
    webp_files = list(images_dir.glob("*.webp"))
    print(f"  -> {len(webp_files)} images in {images_dir}")


def main():
    print(f"Scanning content directory: {CONTENT_DIR}")
    print(f"SD API: {SD_API_URL}")
    print(f"Sampler: {SAMPLER}, Steps: {STEPS}, CFG: {CFG_SCALE}")
    print()

    # Set model - use RealisticVision as primary
    set_sd_model("realisticVisionV60B1_v51HyperVAE")

    # Get all article directories
    article_dirs = sorted([
        d for d in CONTENT_DIR.iterdir()
        if d.is_dir() and (d / "image-prompts.json").exists()
    ])

    print(f"\nFound {len(article_dirs)} articles with image prompts\n")

    total_expected = 0
    for d in article_dirs:
        with open(d / "image-prompts.json") as f:
            data = json.load(f)
        total_expected += len(data.get("images", []))

    print(f"Total images expected: {total_expected}")
    print(f"\n{'#' * 60}")
    print(f"{'#' * 60}\n")

    start_time = time.time()

    for article_dir in article_dirs:
        process_article(article_dir)

    elapsed = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"COMPLETE! Total time: {elapsed / 60:.1f} minutes")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
