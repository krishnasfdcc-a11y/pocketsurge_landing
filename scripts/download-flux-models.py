#!/usr/bin/env python3
"""Download FLUX.1 Dev fp8 model files for ComfyUI."""
import os
import sys
from huggingface_hub import snapshot_download, hf_hub_download

COMFY_DIR = "/Applications/Data/Packages/ComfyUI"

files = [
    # UNET (fp8 - from Kijai, 76K downloads, proven ComfyUI compatible)
    {
        "repo": "Kijai/flux-fp8",
        "file": "flux1-dev-fp8.safetensors",
        "dest": "models/unet/",
    },
    # Text encoders
    {
        "repo": "comfyanonymous/flux_text_encoders",
        "file": "t5xxl_fp8_e4m3fn.safetensors",
        "dest": "models/clip/",
    },
    {
        "repo": "comfyanonymous/flux_text_encoders",
        "file": "clip_l.safetensors",
        "dest": "models/clip/",
    },
    # VAE
    {
        "repo": "Kijai/flux-fp8",
        "file": "flux-vae-bf16.safetensors",
        "dest": "models/vae/",
    },
]

def download():
    for f in files:
        dest_path = os.path.join(COMFY_DIR, f["dest"])
        os.makedirs(dest_path, exist_ok=True)
        dest_file = os.path.join(dest_path, f["file"])
        
        if os.path.exists(dest_file):
            size_gb = os.path.getsize(dest_file) / (1024**3)
            print(f"  ✅ {f['file']} already exists ({size_gb:.1f} GB)")
            continue
        
        print(f"  ⏳ Downloading {f['file']}...")
        try:
            hf_hub_download(
                repo_id=f["repo"],
                filename=f["file"],
                local_dir=dest_path,
                local_dir_use_symlinks=False,
                resume_download=True,
            )
            size_gb = os.path.getsize(dest_file) / (1024**3)
            print(f"  ✅ {f['file']} done ({size_gb:.1f} GB)")
        except Exception as e:
            print(f"  ❌ {f['file']} failed: {e}")
            # Try alternative approaches
            if "t5xxl_fp8" in f["file"]:
                alt_file = "t5xxl_fp16.safetensors"
                print(f"  Trying {alt_file} instead...")
                try:
                    hf_hub_download(
                        repo_id=f["repo"],
                        filename=alt_file,
                        local_dir=dest_path,
                        local_dir_use_symlinks=False,
                        resume_download=True,
                    )
                    size_gb = os.path.getsize(os.path.join(dest_path, alt_file)) / (1024**3)
                    print(f"  ✅ {alt_file} done ({size_gb:.1f} GB)")
                except Exception as e2:
                    print(f"  ❌ {alt_file} also failed: {e2}")

if __name__ == "__main__":
    print("Downloading FLUX.1 Dev fp8 files...")
    download()
    print("\nDone!")
