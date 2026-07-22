#!/usr/bin/env python3
"""Create missing config files for mzbac FLUX 4-bit MLX model."""
import json
import os
from pathlib import Path

model_dir = Path(os.path.expanduser("~/.cache/huggingface/hub/models--mzbac--flux1.dev.4bit.mlx/snapshots"))
snapshots = list(model_dir.iterdir()) if model_dir.exists() else []
if not snapshots:
    print("Model cache not found")
    exit(1)

base = snapshots[0]
print(f"Model at: {base}")

# Create text_encoder config (CLIP)
te_dir = base / "text_encoder"
te_dir.mkdir(exist_ok=True)

# CLIP config for FLUX — deduce from weight files
clip_config = {
    "model_type": "clip_text_model",
    "vocab_size": 49408,
    "hidden_size": 768,
    "intermediate_size": 3072,
    "num_attention_heads": 12,
    "num_hidden_layers": 12,
    "max_position_embeddings": 77,
    "layer_norm_eps": 1e-5,
}
with open(te_dir / "config.json", "w") as f:
    json.dump(clip_config, f, indent=2)
print(f"Created {te_dir / 'config.json'}")

# Create text_encoder_2 config (T5-XXL for FLUX)
te2_dir = base / "text_encoder_2"
te2_dir.mkdir(exist_ok=True)

t5_config = {
    "vocab_size": 32128,
    "num_layers": 24,
    "num_heads": 64,
    "relative_attention_num_buckets": 32,
    "d_kv": 64,
    "d_model": 4096,
    "feed_forward_proj": "gated-gelu",
    "tie_word_embeddings": False,
    "d_ff": 10240,
    "relative_attention_max_distance": 128,
    "layer_norm_epsilon": 1e-6,
}
with open(te2_dir / "config.json", "w") as f:
    json.dump(t5_config, f, indent=2)
print(f"Created {te2_dir / 'config.json'}")

print("\nDone! Config files created.")
