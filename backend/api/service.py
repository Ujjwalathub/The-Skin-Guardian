"""
api/service.py
--------------
Model loader and inference execution service.

Responsibilities
----------------
1. Load EfficientNet-B0 and LightGBM artefacts from disk once at startup
   (singleton pattern via module-level cache).
2. Preprocess an incoming PIL image through the Albumentations validation
   transform.
3. Run two-stage inference (CNN → LightGBM) and return raw probability scores.
4. Implement CUDA → CPU fallback so the API never returns HTTP 500 due to
   GPU driver failures (PRD §6.2).

Thread safety
-------------
Model objects are read-only after loading; concurrent async calls to
``run_inference`` are safe without additional locking.
"""

from __future__ import annotations

import io
import logging
import time
from functools import lru_cache
from pathlib import Path
from typing import TypedDict

import lightgbm as lgb
import numpy as np
import torch
from PIL import Image, UnidentifiedImageError

from api.schemas import ClinicalMetadata
from src.dataset import _SEX_MAP, _SITE_MAP, build_val_transform
from src.models import EfficientNetB0Classifier, load_model

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Paths (relative to project root)
# ---------------------------------------------------------------------------

# Use ensemble of 5 folds for better robustness
EFFNET_WEIGHTS_PATHS: list[Path] = [
    Path("weights/effnet_b0_fold0.pth"),
    Path("weights/effnet_b0_fold1.pth"),
    Path("weights/effnet_b0_fold2.pth"),
    Path("weights/effnet_b0_fold3.pth"),
    Path("weights/effnet_b0_fold4.pth"),
]
LGBM_WEIGHTS_PATH: Path = Path("weights/lightgbm_meta.lgb")

# ---------------------------------------------------------------------------
# Decision threshold engine (PRD §5.3)
# ---------------------------------------------------------------------------

_RED_THRESHOLD: float = 0.75
_YELLOW_THRESHOLD: float = 0.35


def map_score_to_triage(final_score: float) -> dict[str, str]:
    """
    Map a LightGBM malignancy probability to a referral triage decision.

    Parameters
    ----------
    final_score : float
        Combined malignancy probability ``S ∈ [0, 1]``.

    Returns
    -------
    dict with keys ``flag``, ``action``, ``urgency_level``.
    """
    if final_score >= _RED_THRESHOLD:
        return {
            "flag": "RED",
            "action": "Urgent Referral for Physical Biopsy",
            "urgency_level": "CRITICAL",
        }
    if final_score >= _YELLOW_THRESHOLD:
        return {
            "flag": "YELLOW",
            "action": "Consult District Specialist via Tele-Dermatology",
            "urgency_level": "MODERATE",
        }
    return {
        "flag": "GREEN",
        "action": "Routine Local Monitoring (Re-check in 6 Months)",
        "urgency_level": "LOW",
    }


# ---------------------------------------------------------------------------
# Model singletons
# ---------------------------------------------------------------------------


class _ModelBundle(TypedDict):
    cnn_models: list[EfficientNetB0Classifier]  # 5-fold ensemble
    lgbm: lgb.Booster
    device: torch.device
    transform: object  # albumentations.Compose


@lru_cache(maxsize=1)
def _load_models() -> _ModelBundle:
    """
    Load and cache both models.  Called once at API startup via lifespan event.

    CUDA → CPU fallback: if CUDA is unavailable or the VRAM allocation fails,
    we silently fall back to CPU (PRD §6.2).
    """
    # Determine compute device with graceful fallback
    if torch.cuda.is_available():
        try:
            device = torch.device("cuda")
            _ = torch.zeros(1, device=device)  # Smoke-test CUDA allocation
            logger.info("Inference device: CUDA (%s)", torch.cuda.get_device_name(device))
        except RuntimeError:
            device = torch.device("cpu")
            logger.warning("CUDA allocation failed — falling back to CPU inference.")
    else:
        device = torch.device("cpu")
        logger.info("Inference device: CPU (no CUDA available)")

    # Load all 5 CNN models for ensemble
    cnn_models = []
    for fold_path in EFFNET_WEIGHTS_PATHS:
        if not fold_path.exists():
            raise FileNotFoundError(
                f"EfficientNet weights not found at {fold_path}. "
                "Run src/train_vision.py first."
            )
        cnn_model = load_model(str(fold_path), device=device, pretrained=False)
        cnn_models.append(cnn_model)
    
    if not LGBM_WEIGHTS_PATH.exists():
        raise FileNotFoundError(
            f"LightGBM weights not found at {LGBM_WEIGHTS_PATH}. "
            "Run src/train_meta.py first."
        )

    lgbm_booster = lgb.Booster(model_file=str(LGBM_WEIGHTS_PATH))
    transform = build_val_transform()

    total_params = sum(sum(p.numel() for p in model.parameters()) for model in cnn_models)
    logger.info(
        "Models loaded — CNN ensemble: %d models, total params=%d  LGB trees=%d",
        len(cnn_models),
        total_params,
        lgbm_booster.num_trees(),
    )

    return _ModelBundle(
        cnn_models=cnn_models,
        lgbm=lgbm_booster,
        device=device,
        transform=transform,
    )


# ---------------------------------------------------------------------------
# Public inference entry point
# ---------------------------------------------------------------------------


class InferenceResult(TypedDict):
    """All numeric outputs of a single inference pass."""

    p_cnn: float
    p_lgbm: float
    inference_time_ms: float


def run_inference(
    image_bytes: bytes,
    metadata: ClinicalMetadata,
) -> InferenceResult:
    """
    Execute the full two-stage inference pipeline for a single request.

    Stage 1 — CNN
        Decode image bytes → Albumentations val transform → EfficientNet-B0
        → sigmoid probability ``p_cnn``.

    Stage 2 — LightGBM
        Build feature vector [p_cnn, age, sex_enc, site_enc, size,
        asymmetry, border, color] → LightGBM binary predict → ``p_lgbm``.

    Parameters
    ----------
    image_bytes : bytes
        Raw binary content of the uploaded image file.
    metadata : ClinicalMetadata
        Validated Pydantic metadata model.

    Returns
    -------
    InferenceResult
        Contains ``p_cnn``, ``p_lgbm``, and ``inference_time_ms``.

    Raises
    ------
    ValueError
        If the image bytes cannot be decoded.  The caller is responsible for
        mapping this to HTTP 422 (PRD §6.2).
    """
    t_start = time.perf_counter()
    bundle = _load_models()

    # ------------------------------------------------------------------
    # Stage 1: CNN image feature extraction (ensemble of 5 models)
    # ------------------------------------------------------------------
    image_np = _decode_image(image_bytes)
    tensor = bundle["transform"](image=image_np)["image"]  # (3, 224, 224) float32
    tensor = tensor.unsqueeze(0).to(bundle["device"])       # (1, 3, 224, 224)

    # Get predictions from all 5 models and average them
    cnn_probs = []
    with torch.no_grad():
        for cnn_model in bundle["cnn_models"]:
            if bundle["device"].type == "cuda":
                from torch.amp import autocast
                with autocast("cuda"):
                    logit = cnn_model(tensor)
            else:
                logit = cnn_model(tensor)
            cnn_probs.append(float(torch.sigmoid(logit).cpu().item()))
    
    # Average ensemble prediction
    p_cnn = float(np.mean(cnn_probs))

    # ------------------------------------------------------------------
    # Stage 2: LightGBM meta-learner
    # ------------------------------------------------------------------
    feature_vector = _build_feature_vector(p_cnn, metadata)
    p_lgbm = float(bundle["lgbm"].predict(feature_vector.reshape(1, -1))[0])

    inference_time_ms = (time.perf_counter() - t_start) * 1000.0

    return InferenceResult(
        p_cnn=p_cnn,
        p_lgbm=p_lgbm,
        inference_time_ms=inference_time_ms,
    )


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------


def _decode_image(image_bytes: bytes) -> np.ndarray:
    """
    Decode raw image bytes to an RGB numpy uint8 array.

    Raises
    ------
    ValueError
        With a user-facing message if the bytes cannot be decoded.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return np.array(img, dtype=np.uint8)
    except (UnidentifiedImageError, Exception) as exc:
        raise ValueError(f"Corrupted or unreadable image file: {exc}") from exc


def _build_feature_vector(p_cnn: float, meta: ClinicalMetadata) -> np.ndarray:
    """
    Assemble the 14-element feature vector for LightGBM inference.

    Feature order must match ``src/train_meta.py::FEATURE_COLS``:
        [p_cnn_score, age_approx, sex_enc, site_enc, clin_size_long_diam_mm,
         tbp_lv_color_std_mean, tbp_lv_norm_color, tbp_lv_radial_color_std_max,
         tbp_lv_stdL, tbp_lv_norm_border, tbp_lv_symm_2axis, tbp_lv_eccentricity,
         tbp_lv_perimeterMM, tbp_lv_minorAxisMM]
    """
    sex_enc = float(_SEX_MAP.get(meta.sex.lower(), -1))
    site_enc = float(_SITE_MAP.get(meta.anatom_site_general.lower(), -1))

    # Map clinician ABCDE inputs (0-5 scale) and diameter to TBP-LV feature proxies
    color_norm = float(meta.color_variation) / 5.0
    border_norm = float(meta.border_irregularity) / 5.0
    asymm_norm = float(meta.asymmetry_score) / 5.0
    perimeter_mm = float(meta.clin_size_long_diam_mm) * 3.14159
    minor_axis_mm = float(meta.clin_size_long_diam_mm) * 0.7

    return np.array(
        [
            p_cnn,
            meta.age_approx,
            sex_enc,
            site_enc,
            meta.clin_size_long_diam_mm,
            color_norm,        # tbp_lv_color_std_mean
            color_norm,        # tbp_lv_norm_color
            0.0,               # tbp_lv_radial_color_std_max
            0.0,               # tbp_lv_stdL
            border_norm,       # tbp_lv_norm_border
            asymm_norm,        # tbp_lv_symm_2axis
            0.0,               # tbp_lv_eccentricity
            perimeter_mm,      # tbp_lv_perimeterMM
            minor_axis_mm,     # tbp_lv_minorAxisMM
        ],
        dtype=np.float64,
    )
