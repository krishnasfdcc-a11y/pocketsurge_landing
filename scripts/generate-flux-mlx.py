#!/usr/bin/env python3
"""
FLUX.1 Schnell 4-bit MLX Image Generator for PocketSurge.
Uses Apple MLX framework — ~6.5 GB RAM, ~5 sec per image.

Reads image-prompts.json from each article, generates images via MLX FLUX schnell,
and saves as WebP images.

Usage:
  python scripts/generate-flux-mlx.py                  # Generate all missing images
  python scripts/generate-flux-mlx.py --article ART20260722-020  # Single article
"""

import json
import os
import sys
import time
from pathlib import Path

import mlx.core as mx
import numpy as np
from PIL import Image
from huggingface_hub import snapshot_download

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"
HERO_WIDTH, HERO_HEIGHT = 1200, 514
GALLERY_WIDTH, GALLERY_HEIGHT = 1024, 768


def ensure_model_downloaded():
    print("  [DL] Checking FLUX.1 Schnell 4-bit model...")
    return Path(snapshot_download(
        "argmaxinc/mlx-FLUX.1-schnell-4bit-quantized",
        allow_patterns=["*.safetensors"],
        resume_download=True,
    ))


def convert_to_webp(img, path, quality=85):
    img.save(path, "WEBP", quality=quality)
    return path.stat().st_size


def generate_image(pipe, prompt, width, height, seed):
    h = ((height + 15) // 16) * 16
    w = ((width + 15) // 16) * 16
    images = pipe.generate_images(
        prompt, n_images=1, num_steps=4, guidance=0.0,
        latent_size=(h // 8, w // 8), seed=seed,
        reload_text_encoders=False, progress=True,
    )
    img = (images[0] * 255).astype(np.uint8)
    return Image.fromarray(np.array(img)).resize((width, height), Image.LANCZOS)


def process_article(d, pipe):
    slug = d.name
    prompts_path = d / "image-prompts.json"
    if not prompts_path.exists():
        return
    with open(prompts_path) as f:
        imgs = json.load(f).get("images", [])
    if not imgs:
        return
    img_dir = d / "images"
    img_dir.mkdir(exist_ok=True)
    print(f"\n=== {slug} ({len(imgs)} images) ===")
    for c in imgs:
        is_hero = c.get("placement") == "hero"
        name = "hero.webp" if is_hero else f"{c['id']}.webp"
        w, h = (HERO_WIDTH, HERO_HEIGHT) if is_hero else (GALLERY_WIDTH, GALLERY_HEIGHT)
        out = img_dir / name
        if out.exists():
            print(f"  [SKIP] {name}")
            continue
        style = c.get("style", "")
        hints = {"cinematic": "cinematic lighting, dramatic composition", "photorealistic": "photorealistic, ultra detailed", "3d-render": "3D render, detailed textures, volumetric lighting", "illustration": "digital illustration, vector art, vibrant colors", "infographic": "infographic style, clean layout", "minimal": "minimalist, clean design", "diagram": "technical diagram, clean schematic"}
        prompt = f"{c['prompt']}, {hints[style]}" if style in hints else c["prompt"]
        print(f"  Gen {name} ({w}x{h})...")
        try:
            img = generate_image(pipe, prompt, w, h, int(time.time()) % 2**32)
            if img:
                print(f"    [OK] {convert_to_webp(img, out)/1024:.0f} KB")
        except Exception as e:
            print(f"    [FAIL] {e}")
        time.sleep(1)
    print(f"  -> {len(list(img_dir.glob('*.webp')))} images")


def main():
    print("=" * 60)
    print("  PocketSurge FLUX.1 Schnell 4-bit MLX Generator")
    print("=" * 60)
    md = ensure_model_downloaded()
    mf = next(md.rglob("flux-schnell-4bit-quantized.safetensors"))
    af = next(md.rglob("ae.safetensors"))
    
    # Set env vars BEFORE importing FluxPipeline (config reads at import time)
    os.environ["FLUX_SCHNELL"] = str(mf)
    os.environ["AE"] = str(af)
    
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from flux import FluxPipeline
    
    print(f"  Model: {mf.name} ({mf.stat().st_size/1024**3:.1f} GB)")
    print(f"  VAE:   {af.name} ({af.stat().st_size/1024**3:.2f} GB)")
    t0 = time.time()
    pipe = FluxPipeline("flux-schnell")
    pipe.ensure_models_are_loaded()
    print(f"  Loaded in {time.time()-t0:.1f}s\n")
    dirs = sorted(d for d in CONTENT_DIR.iterdir() if d.is_dir() and (d / "image-prompts.json").exists())
    if len(sys.argv) > 2 and sys.argv[1] == "--article":
        dirs = [d for d in dirs if d.name == sys.argv[2]]
    total = sum(len(json.load(open(d / "image-prompts.json")).get("images", [])) for d in dirs)
    exist = sum(1 for d in dirs for f in (d / "images").glob("*.webp") if (d / "images").exists())
    print(f"Articles: {len(dirs)} | Images: {total} ({exist} exist, {total-exist} to gen)\n")
    s = time.time()
    for d in dirs:
        process_article(d, pipe)
    print(f"\nCOMPLETE! {time.time()-s:.1f}s")


if __name__ == "__main__":
    main()
