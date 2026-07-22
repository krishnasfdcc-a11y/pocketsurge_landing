#!/usr/bin/env python3
"""
FLUX.1 Dev image generator using diffusers with MPS + CPU offload.
Works within 24GB RAM by offloading parts to CPU.

Usage:
  python scripts/generate-flux-diffusers.py
  python scripts/generate-flux-diffusers.py --article ART20260722-020
"""

import json
import os
import sys
import time
from io import BytesIO
from pathlib import Path

import torch
import numpy as np
from PIL import Image
from diffusers import FluxPipeline
from huggingface_hub import snapshot_download

# --- Configuration ---
CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"
MODEL_ID = "black-forest-labs/FLUX.1-dev"

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

# FLUX generation settings
STEPS = 25
GUIDANCE = 3.5

# Resolution mapping
HERO_WIDTH, HERO_HEIGHT = 1200, 514
GALLERY_WIDTH, GALLERY_HEIGHT = 1024, 768


def convert_to_webp(img, output_path, quality=85):
    img.save(output_path, "WEBP", quality=quality)
    return output_path.stat().st_size


def process_article(article_dir, pipe):
    slug = article_dir.name
    prompts_path = article_dir / "image-prompts.json"

    if not prompts_path.exists():
        print(f"\n=== SKIP {slug} (no image-prompts.json) ===")
        return

    with open(prompts_path) as f:
        data = json.load(f)

    images_config = data.get("images", [])
    if not images_config:
        print(f"\n=== SKIP {slug} (no images in config) ===")
        return

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

        is_hero = placement == "hero"
        if is_hero:
            output_name = "hero.webp"
            w, h = HERO_WIDTH, HERO_HEIGHT
        else:
            output_name = f"{img_id}.webp"
            w, h = GALLERY_WIDTH, GALLERY_HEIGHT

        output_path = images_dir / output_name

        if output_path.exists():
            print(f"  [SKIP] {output_name}")
            continue

        full_prompt = prompt
        style_hints = {
            "cinematic": "cinematic lighting, dramatic composition, epic",
            "photorealistic": "photorealistic, ultra detailed, sharp focus",
            "3d-render": "3D render, detailed textures, volumetric lighting",
            "illustration": "digital illustration, vector art, vibrant colors",
            "infographic": "infographic style, clean layout, data visualization",
            "minimal": "minimalist, clean design, simple composition",
            "diagram": "technical diagram, clean schematic, labeled",
        }
        if style in style_hints:
            full_prompt = f"{prompt}, {style_hints[style]}"

        print(f"  Generating {output_name} ({w}x{h}) - style: {style}...")

        try:
            result = pipe(
                prompt=full_prompt,
                negative_prompt=NEGATIVE_PROMPT,
                height=h,
                width=w,
                guidance_scale=GUIDANCE,
                num_inference_steps=STEPS,
                max_sequence_length=512,
                generator=torch.Generator("cpu").manual_seed(int(time.time()) % (2**32)),
            )
            img = result.images[0]
            file_size = convert_to_webp(img, output_path)
            print(f"    [OK] Saved {output_name} ({file_size / 1024:.0f} KB)")
        except Exception as e:
            print(f"    [FAIL] {e}")
            continue

        time.sleep(1)

    webp_files = list(images_dir.glob("*.webp"))
    print(f"  -> {len(webp_files)} images in {images_dir}")


def main():
    print(f"{'='*60}")
    print(f"  PocketSurge FLUX.1 Dev Diffusers Generator")
    print(f"{'='*60}")
    print()

    # Check for HF token
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        print("  ⚠️  FLUX.1-dev requires accepting the license at:")
        print("     https://huggingface.co/black-forest-labs/FLUX.1-dev")
        print("  Set HF_TOKEN environment variable after accepting.\n")
        print("  Trying to load anyway (may fail if not authenticated)...\n")

    print("  Loading FLUX.1-dev (bf16, with CPU offload for 24GB RAM)...")
    print("  (First load downloads ~24GB model — this takes time)\n")
    t0 = time.time()
    
    pipe = FluxPipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.bfloat16,
        token=hf_token,
    )
    pipe.enable_model_cpu_offload()
    pipe.vae.enable_slicing()
    print(f"  Model loaded in {time.time() - t0:.1f}s\n")

    # Get articles
    article_dirs = sorted([
        d for d in CONTENT_DIR.iterdir()
        if d.is_dir() and (d / "image-prompts.json").exists()
    ])

    if len(sys.argv) > 2 and sys.argv[1] == "--article":
        article_dirs = [d for d in article_dirs if d.name == sys.argv[2]]
        if not article_dirs:
            print(f"Article '{sys.argv[2]}' not found")
            return

    print(f"Found {len(article_dirs)} articles\n")
    start_time = time.time()

    for article_dir in article_dirs:
        process_article(article_dir, pipe)

    elapsed = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"  COMPLETE! Total time: {elapsed / 60:.1f} minutes")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
