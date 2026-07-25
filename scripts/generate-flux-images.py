#!/usr/bin/env python3
"""
Generate article hero images using ComfyUI + FLUX.1-dev Q8 (GGUF).
Reads image-prompts.json from each article and generates only hero images.
"""

import json
import os
import time
import base64
import re
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

# --- Configuration ---
COMFY_API = "http://127.0.0.1:8188"
COMFY_PROMPT_URL = f"{COMFY_API}/prompt"
COMFY_QUEUE_URL = f"{COMFY_API}/queue"
COMFY_HISTORY_URL = f"{COMFY_API}/history"
COMFY_VIEW_URL = f"{COMFY_API}/view"

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"
OUTPUT_DIR = Path("/Applications/Data/Packages/ComfyUI/output")

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
HERO_WIDTH, HERO_HEIGHT = 1200, 514   # 21:9
GALLERY_WIDTH, GALLERY_HEIGHT = 1024, 768  # 4:3


def build_workflow(prompt, negative_prompt, width, height, seed):
    """Build a ComfyUI workflow JSON for FLUX txt2img."""
    workflow_id = 1  # node counter
    
    nodes = {}
    
    # 1. UnetLoaderGGUF (Q8 quantized FLUX.1-dev)
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "UnetLoaderGGUF",
        "inputs": {
            "unet_name": "flux1-dev-Q8_0.gguf",
            "weight_dtype": "default",
        }
    }
    unet_node = str(n)
    
    # 2. DualCLIPLoader
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "DualCLIPLoader",
        "inputs": {
            "clip_name1": "clip_l.safetensors",
            "clip_name2": "t5xxl_fp8_e4m3fn.safetensors",
            "type": "flux",
        }
    }
    clip_node = str(n)
    
    # 3. CLIPTextEncodeFlux (positive)
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "CLIPTextEncodeFlux",
        "inputs": {
            "clip": [clip_node, 0],
            "clip_l": prompt,
            "t5xxl": prompt,
            "guidance": GUIDANCE,
        }
    }
    pos_cond_node = str(n)
    
    # 4. CLIPTextEncodeFlux (negative)
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "CLIPTextEncodeFlux",
        "inputs": {
            "clip": [clip_node, 0],
            "clip_l": negative_prompt,
            "t5xxl": negative_prompt,
            "guidance": GUIDANCE,
        }
    }
    neg_cond_node = str(n)
    
    # 5. EmptyLatentImage (for FLUX we use standard EmptyLatentImage)
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "EmptyLatentImage",
        "inputs": {
            "width": width,
            "height": height,
            "batch_size": 1,
        }
    }
    latent_node = str(n)
    
    # 6. ModelSamplingFlux
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "ModelSamplingFlux",
        "inputs": {
            "model": [unet_node, 0],
            "max_shift": 1.15,
            "base_shift": 0.5,
            "width": width,
            "height": height,
        }
    }
    model_sampling_node = str(n)
    
    # 7. KSampler
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "KSampler",
        "inputs": {
            "model": [model_sampling_node, 0],
            "seed": seed,
            "steps": STEPS,
            "cfg": 1.0,
            "sampler_name": "euler",
            "scheduler": "simple",
            "positive": [pos_cond_node, 0],
            "negative": [neg_cond_node, 0],
            "latent_image": [latent_node, 0],
            "denoise": 1.0,
        }
    }
    sampler_node = str(n)
    
    # 8. VAELoader (separate FLUX VAE)
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "VAELoader",
        "inputs": {
            "vae_name": "flux-vae-bf16.safetensors",
        }
    }
    vae_node = str(n)
    
    # 9. VAEDecode
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": [sampler_node, 0],
            "vae": [vae_node, 0],
        }
    }
    vae_decode_node = str(n)
    
    # 10. SaveImage
    n = len(nodes)
    nodes[str(n)] = {
        "class_type": "SaveImage",
        "inputs": {
            "images": [vae_decode_node, 0],
            "filename_prefix": "pocketsurge_flux",
        }
    }
    
    return {
        "prompt": nodes,
        "client_id": "pocketsurge-image-gen",
    }


def queue_prompt(workflow):
    """Queue a prompt on ComfyUI and return the prompt_id."""
    resp = requests.post(COMFY_PROMPT_URL, json=workflow, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    prompt_id = data.get("prompt_id")
    if not prompt_id:
        raise Exception(f"No prompt_id in response: {data}")
    return prompt_id


def wait_for_completion(prompt_id, poll_interval=3, timeout=300):
    """Wait for a ComfyUI prompt to complete."""
    elapsed = 0
    while elapsed < timeout:
        resp = requests.get(COMFY_QUEUE_URL, timeout=10)
        resp.raise_for_status()
        queue_data = resp.json()
        
        # Check if prompt_id is in running or pending
        running = queue_data.get("queue_running", [])
        pending = queue_data.get("queue_pending", [])
        
        # Check history for completion
        hist_resp = requests.get(COMFY_HISTORY_URL, timeout=10)
        hist_resp.raise_for_status()
        history = hist_resp.json()
        
        if prompt_id in history:
            return history[prompt_id]
        
        # Check if still in queue (queue items are lists: [number, prompt_id, ...])
        still_queued = any(
            (isinstance(item, dict) and item.get("prompt_id") == prompt_id) or
            (isinstance(item, list) and len(item) > 1 and item[1] == prompt_id)
            for item in running + pending
        )
        if not still_queued and prompt_id not in history:
            # Not in queue and not in history — might have failed
            print(f"    Prompt {prompt_id} not found in queue or history")
            return None
        
        time.sleep(poll_interval)
        elapsed += poll_interval
    
    raise TimeoutError(f"Prompt {prompt_id} did not complete within {timeout}s")


def get_output_images(history_result):
    """Extract output filenames from ComfyUI history result."""
    outputs = history_result.get("outputs", {})
    images = []
    for node_id, node_output in outputs.items():
        for img in node_output.get("images", []):
            images.append(img)
    return images


def download_image(filename, subfolder, folder_type):
    """Download a generated image from ComfyUI."""
    params = {
        "filename": filename,
        "subfolder": subfolder,
        "type": folder_type,
    }
    resp = requests.get(COMFY_VIEW_URL, params=params, timeout=30)
    resp.raise_for_status()
    return Image.open(BytesIO(resp.content))


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
        
        # Only generate hero images
        is_hero = placement == "hero"
        if not is_hero:
            output_name = f"{img_id}.webp"
            output_path = images_dir / output_name
            if output_path.exists():
                print(f"  [SKIP] {output_name} (non-hero - skipped)")
            continue
        
        output_name = "hero.webp"
        w, h = HERO_WIDTH, HERO_HEIGHT
        
        output_path = images_dir / output_name
        
        # Skip if already exists
        if output_path.exists():
            size_kb = output_path.stat().st_size / 1024
            print(f"  [SKIP] {output_name} ({size_kb:.0f} KB - already exists)")
            continue
        
        # Enrich prompt with style hints
        full_prompt = prompt
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
        
        seed = int(time.time()) % (2**32)
        workflow = build_workflow(full_prompt, NEGATIVE_PROMPT, w, h, seed)
        
        try:
            prompt_id = queue_prompt(workflow)
            print(f"    Queued: {prompt_id}")
            
            history_result = wait_for_completion(prompt_id)
            if not history_result:
                print(f"    [FAIL] No completion result")
                continue
            
            output_images = get_output_images(history_result)
            if not output_images:
                print(f"    [FAIL] No output images found")
                continue
            
            # Download the first output image
            img_info = output_images[0]
            img = download_image(
                img_info["filename"],
                img_info.get("subfolder", ""),
                img_info.get("type", "output"),
            )
            
            if img is None:
                print(f"    [FAIL] Could not download image")
                continue
            
            file_size = convert_to_webp(img, output_path)
            print(f"    [OK] Saved {output_name} ({file_size / 1024:.0f} KB)")
            
        except Exception as e:
            print(f"    [FAIL] {e}")
            continue
    
    webp_files = list(images_dir.glob("*.webp"))
    print(f"  -> {len(webp_files)} images in {images_dir}")


def main():
    print(f"Scanning content directory: {CONTENT_DIR}")
    print(f"ComfyUI: {COMFY_API}")
    print(f"FLUX.1-dev Q8 GGUF, Steps: {STEPS}, Guidance: {GUIDANCE}")
    print()
    
    article_dirs = sorted([
        d for d in CONTENT_DIR.iterdir()
        if d.is_dir() and (d / "image-prompts.json").exists()
    ])
    
    print(f"Found {len(article_dirs)} articles with image prompts\n")
    
    total_expected = 0
    for d in article_dirs:
        with open(d / "image-prompts.json") as f:
            data = json.load(f)
        total_expected += len(data.get("images", []))
    
    print(f"Total images expected: {total_expected}")
    
    start_time = time.time()
    
    for article_dir in article_dirs:
        process_article(article_dir)
    
    elapsed = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"COMPLETE! Total time: {elapsed / 60:.1f} minutes")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
