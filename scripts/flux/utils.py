# Copyright © 2024 Apple Inc.

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Union

import mlx.core as mx
from huggingface_hub import hf_hub_download

from .autoencoder import AutoEncoder, AutoEncoderParams
from .clip import CLIPTextModel, CLIPTextModelConfig
from .model import Flux, FluxParams
from .t5 import T5Config, T5Encoder
from .tokenizers import CLIPTokenizer, T5Tokenizer


@dataclass
class ModelSpec:
    params: FluxParams
    ae_params: AutoEncoderParams
    ckpt_path: Optional[str]
    ae_path: Optional[str]
    repo_id: Optional[str]
    repo_flow: Optional[str]
    repo_ae: Optional[str]


# Cache for local model directory (for mzbac sharded models)
_model_cache_dir: str | None = None


def set_model_cache_dir(path: str):
    """Set the local model cache directory for sharded models."""
    global _model_cache_dir
    _model_cache_dir = path


def _mzbac_path(subpath: str) -> str | None:
    """Resolve a file path for mzbac model from local cache."""
    if _model_cache_dir is None:
        return None
    p = os.path.join(_model_cache_dir, subpath)
    return p if os.path.exists(p) else None


configs = {
    "flux-dev": ModelSpec(
        repo_id="black-forest-labs/FLUX.1-dev",
        repo_flow="flux1-dev.safetensors",
        repo_ae="ae.safetensors",
        ckpt_path=os.getenv("FLUX_DEV"),
        params=FluxParams(
            in_channels=64,
            vec_in_dim=768,
            context_in_dim=4096,
            hidden_size=3072,
            mlp_ratio=4.0,
            num_heads=24,
            depth=19,
            depth_single_blocks=38,
            axes_dim=[16, 56, 56],
            theta=10_000,
            qkv_bias=True,
            guidance_embed=True,
        ),
        ae_path=os.getenv("AE"),
        ae_params=AutoEncoderParams(
            resolution=256,
            in_channels=3,
            ch=128,
            out_ch=3,
            ch_mult=[1, 2, 4, 4],
            num_res_blocks=2,
            z_channels=16,
            scale_factor=0.3611,
            shift_factor=0.1159,
        ),
    ),
    "flux-schnell": ModelSpec(
        repo_id="black-forest-labs/FLUX.1-schnell",
        repo_flow="flux1-schnell.safetensors",
        repo_ae="ae.safetensors",
        ckpt_path=os.getenv("FLUX_SCHNELL"),
        params=FluxParams(
            in_channels=64,
            vec_in_dim=768,
            context_in_dim=4096,
            hidden_size=3072,
            mlp_ratio=4.0,
            num_heads=24,
            depth=19,
            depth_single_blocks=38,
            axes_dim=[16, 56, 56],
            theta=10_000,
            qkv_bias=True,
            guidance_embed=False,
        ),
        ae_path=os.getenv("AE"),
        ae_params=AutoEncoderParams(
            resolution=256,
            in_channels=3,
            ch=128,
            out_ch=3,
            ch_mult=[1, 2, 4, 4],
            num_res_blocks=2,
            z_channels=16,
            scale_factor=0.3611,
            shift_factor=0.1159,
        ),
    ),
}


def load_flow_model(name: str, hf_download: bool = True):
    # Get the safetensors file to load
    ckpt_path = configs[name].ckpt_path

    # Download if needed
    if (
        ckpt_path is None
        and configs[name].repo_id is not None
        and configs[name].repo_flow is not None
        and hf_download
    ):
        ckpt_path = hf_hub_download(configs[name].repo_id, configs[name].repo_flow)

    # Make the model
    model = Flux(configs[name].params)

    # Load the checkpoint if needed
    if ckpt_path is not None:
        # Handle sharded mzbac format (transformer/flux1_mlx_model-*.safetensors)
        weights = {}
        if ckpt_path.endswith(".safetensors") and os.path.exists(ckpt_path):
            weights = mx.load(ckpt_path)
        else:
            # Try loading multiple shards from model cache dir
            base = _model_cache_dir or os.path.dirname(ckpt_path) if ckpt_path else None
            if base:
                shard_dir = os.path.join(base, "transformer")
                if os.path.isdir(shard_dir):
                    shards = sorted([
                        os.path.join(shard_dir, f)
                        for f in os.listdir(shard_dir)
                        if f.endswith(".safetensors")
                    ])
                    for shard in shards:
                        weights.update(mx.load(shard))
        if weights:
            weights = model.sanitize(weights)
            model.load_weights(list(weights.items()))

    return model


def load_ae(name: str, hf_download: bool = True):
    # Get the safetensors file to load
    ckpt_path = configs[name].ae_path

    # Download if needed
    if (
        ckpt_path is None
        and configs[name].repo_id is not None
        and configs[name].repo_ae is not None
        and hf_download
    ):
        ckpt_path = hf_hub_download(configs[name].repo_id, configs[name].repo_ae)

    # Make the autoencoder
    ae = AutoEncoder(configs[name].ae_params)

    # Load the checkpoint if needed
    if ckpt_path is not None:
        weights = {}
        if os.path.isfile(ckpt_path):
            weights = mx.load(ckpt_path)
        else:
            # mzbac: look in vae/ subdirectory
            base = _model_cache_dir or ckpt_path
            vae_dir = os.path.join(base, "vae") if not os.path.isfile(base) else None
            if vae_dir and os.path.isdir(vae_dir):
                vae_files = [f for f in os.listdir(vae_dir) if f.endswith(".safetensors")]
                if vae_files:
                    weights = mx.load(os.path.join(vae_dir, vae_files[0]))
        if weights:
            weights = ae.sanitize(weights)
            ae.load_weights(list(weights.items()), strict=False)

    return ae


def load_clip(name: str):
    # Determine base directory
    base = _model_cache_dir

    # Look for config in mzbac format first, then fall back to HF
    config_path = _mzbac_path("text_encoder/config.json") if base else None
    if config_path is None:
        config_path = hf_hub_download(configs[name].repo_id, "text_encoder/config.json")
    
    with open(config_path) as f:
        config = CLIPTextModelConfig.from_dict(json.load(f))

    # Make the clip text encoder
    clip = CLIPTextModel(config)

    # Load the weights — mzbac format or standard
    ckpt_path = _mzbac_path("text_encoder/flux1_mlx_model.safetensors") if base else None
    if ckpt_path is None:
        ckpt_path = hf_hub_download(configs[name].repo_id, "text_encoder/model.safetensors")
    
    weights = mx.load(ckpt_path)
    weights = clip.sanitize(weights)
    clip.load_weights(list(weights.items()))

    return clip


def load_t5(name: str):
    # Determine base directory
    base = _model_cache_dir

    # Look for config
    config_path = _mzbac_path("text_encoder_2/config.json") if base else None
    if config_path is None:
        config_path = hf_hub_download(configs[name].repo_id, "text_encoder_2/config.json")
    
    with open(config_path) as f:
        config = T5Config.from_dict(json.load(f))

    # Make the T5 model
    t5 = T5Encoder(config)

    # Load the weights — either from index or from shards
    if base:
        # mzbac format: text_encoder_2/flux1_mlx_model-*.safetensors
        te2_dir = os.path.join(base, "text_encoder_2")
        shards = sorted([
            os.path.join(te2_dir, f)
            for f in os.listdir(te2_dir)
            if f.endswith(".safetensors")
        ]) if os.path.isdir(te2_dir) else []
        
        weights = {}
        for shard in shards:
            weights.update(mx.load(shard))
    else:
        # Standard HF format: load via index file
        model_index = hf_hub_download(
            configs[name].repo_id, "text_encoder_2/model.safetensors.index.json"
        )
        weight_files = set()
        with open(model_index) as f:
            for _, w in json.load(f)["weight_map"].items():
                weight_files.add(w)
        weights = {}
        for w in weight_files:
            w = f"text_encoder_2/{w}"
            w = hf_hub_download(configs[name].repo_id, w)
            weights.update(mx.load(w))
    
    if weights:
        weights = t5.sanitize(weights)
        t5.load_weights(list(weights.items()))

    return t5


def load_clip_tokenizer(name: str):
    base = _model_cache_dir
    
    vocab_file = _mzbac_path("tokenizer/vocab.json") if base else None
    if vocab_file is None:
        vocab_file = hf_hub_download(configs[name].repo_id, "tokenizer/vocab.json")
    with open(vocab_file, encoding="utf-8") as f:
        vocab = json.load(f)

    merges_file = _mzbac_path("tokenizer/merges.txt") if base else None
    if merges_file is None:
        merges_file = hf_hub_download(configs[name].repo_id, "tokenizer/merges.txt")
    with open(merges_file, encoding="utf-8") as f:
        bpe_merges = f.read().strip().split("\n")[1 : 49152 - 256 - 2 + 1]
    bpe_merges = [tuple(m.split()) for m in bpe_merges]
    bpe_ranks = dict(map(reversed, enumerate(bpe_merges)))

    return CLIPTokenizer(bpe_ranks, vocab, max_length=77)


def load_t5_tokenizer(name: str, pad: bool = True):
    base = _model_cache_dir
    model_file = _mzbac_path("tokenizer_2/spiece.model") if base else None
    if model_file is None:
        model_file = hf_hub_download(configs[name].repo_id, "tokenizer_2/spiece.model")
    return T5Tokenizer(model_file, 256 if "schnell" in name else 512)


def save_config(
    config: dict,
    config_path: Union[str, Path],
) -> None:
    """Save the model configuration to the ``config_path``.

    The final configuration will be sorted before saving for better readability.

    Args:
        config (dict): The model configuration.
        config_path (Union[str, Path]): Model configuration file path.
    """
    # Sort the config for better readability
    config = dict(sorted(config.items()))

    # Write the config to the provided file
    with open(config_path, "w") as fid:
        json.dump(config, fid, indent=4)
