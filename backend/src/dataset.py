"""
src/dataset.py
--------------
PyTorch Dataset and Albumentations augmentation pipeline for the
ISIC 2024 / SLICE-3D skin-lesion dataset.

Design decisions
----------------
* ``SkinLesionDataset`` serves (image_tensor, tabular_vector, label) tuples
  so the training loop can feed both the EfficientNet-B0 image backbone and
  the LightGBM/MLP meta-learner from one unified DataLoader.
* ``build_train_transform`` simulates the mobile-camera domain shift described
  in PRD §4.2 using a full Albumentations pipeline.
* ``build_val_transform`` applies only resize + normalise for reproducible
  validation metrics.
* ``WeightedRandomSampler`` weights are computed once via
  ``SkinLesionDataset.get_sampler()`` and exposed for the DataLoader.
* ``get_pos_weight()`` returns the negative-to-positive ratio for use as
  ``pos_weight`` in ``BCEWithLogitsLoss`` or ``scale_pos_weight`` in LightGBM.

Phases implemented here
-----------------------
    Phase 3 — Image preprocessing & augmentation (PRD §4.1–4.2)
    Phase 4 — Imbalance handling: WeightedRandomSampler + pos_weight (PRD §5)
"""

from __future__ import annotations

from pathlib import Path
from typing import Callable, Optional

import albumentations as A
import cv2
import numpy as np
import pandas as pd
import torch
from albumentations.pytorch import ToTensorV2
from PIL import Image
from torch.utils.data import Dataset, WeightedRandomSampler

# Re-export for backward-compat and convenience
from src.preprocess import (
    SEX_MAP,
    SITE_MAP,
    compute_sample_weights,
    compute_scale_pos_weight,
    encode_categoricals,
    impute_missing,
    run_preprocessing_pipeline,
)

__all__ = [
    # Transforms
    "IMAGE_SIZE",
    "build_train_transform",
    "build_val_transform",
    # Dataset
    "SkinLesionDataset",
    "TABULAR_FEATURE_COLUMNS",
    # Helpers (backward-compat)
    "preprocess_dataframe",
    "encode_metadata_row",
    # Re-exported from preprocess
    "SEX_MAP",
    "SITE_MAP",
    "compute_sample_weights",
    "compute_scale_pos_weight",
]

# ---------------------------------------------------------------------------
# Phase 3 — Augmentation constants
# ---------------------------------------------------------------------------

IMAGE_SIZE: int = 224
_IMAGENET_MEAN = (0.485, 0.456, 0.406)
_IMAGENET_STD = (0.229, 0.224, 0.225)


# ---------------------------------------------------------------------------
# Phase 3a — Augmentation factories
# ---------------------------------------------------------------------------


def build_train_transform() -> A.Compose:
    """
    Full augmentation pipeline simulating mobile-camera domain shift (PRD §4.2).

    Pipeline order
    --------------
    1. Resize to 224 × 224
    2. Geometric invariances (rotation, flip, shift/scale/rotate)
    3. Mobile camera artifact simulation (blur, ISO noise)
    4. Lighting and colour variation (brightness/contrast, hue/saturation)
    5. Normalise to ImageNet statistics
    6. Convert HWC → CHW float32 tensor

    Notes
    -----
    * ``A.Flip`` replaced with explicit ``HorizontalFlip`` + ``VerticalFlip``
      to allow independent probability tuning.
    * ``A.OneOf`` for blur variants ensures exactly one blur kernel is applied
      per augmentation call, keeping gradients well-behaved.
    * All augmentations are probabilistic — a clean path is always possible,
      which prevents catastrophic distortion of small lesions.
    """
    return A.Compose(
        [
            # ---- 1. Resize ----
            A.Resize(IMAGE_SIZE, IMAGE_SIZE, interpolation=cv2.INTER_LINEAR),

            # ---- 2. Geometric (lesions are rotationally invariant) ----
            A.RandomRotate90(p=0.5),
            A.HorizontalFlip(p=0.5),
            A.VerticalFlip(p=0.5),
            A.ShiftScaleRotate(
                shift_limit=0.05,
                scale_limit=0.1,
                rotate_limit=15,
                border_mode=cv2.BORDER_REFLECT_101,
                p=0.5,
            ),

            # ---- 3. Simulate mobile camera artifacts ----
            A.OneOf(
                [
                    A.GaussianBlur(blur_limit=(3, 7)),
                    A.MotionBlur(blur_limit=5),
                    A.MedianBlur(blur_limit=5),
                ],
                p=0.3,
            ),
            A.ISONoise(
                color_shift=(0.01, 0.05),
                intensity=(0.1, 0.5),
                p=0.3,
            ),

            # ---- 4. Lighting and colour variation ----
            A.RandomBrightnessContrast(
                brightness_limit=0.2,
                contrast_limit=0.2,
                p=0.4,
            ),
            A.HueSaturationValue(
                hue_shift_limit=10,
                sat_shift_limit=20,
                val_shift_limit=10,
                p=0.4,
            ),

            # ---- 5. Normalise + 6. Tensor ----
            A.Normalize(mean=_IMAGENET_MEAN, std=_IMAGENET_STD),
            ToTensorV2(),
        ]
    )


def build_val_transform() -> A.Compose:
    """
    Minimal deterministic transform for validation and inference.

    Applies only resize → normalise → tensor conversion.  No random ops.
    """
    return A.Compose(
        [
            A.Resize(IMAGE_SIZE, IMAGE_SIZE, interpolation=cv2.INTER_LINEAR),
            A.Normalize(mean=_IMAGENET_MEAN, std=_IMAGENET_STD),
            ToTensorV2(),
        ]
    )


# ---------------------------------------------------------------------------
# Tabular feature specification
# ---------------------------------------------------------------------------

# Ordered list of numeric tabular features fed to the LightGBM meta-learner.
# ``p_cnn_score`` is prepended at meta-learner training time (after OOF pass).
TABULAR_FEATURE_COLUMNS: list[str] = [
    "age_approx",
    "sex_enc",
    "site_enc",
    "clin_size_long_diam_mm",
    "tbp_lv_A",
    "tbp_lv_Aext",
    "tbp_lv_B",
    "tbp_lv_Bext",
    "tbp_lv_C",
    "tbp_lv_Cext",
    "tbp_lv_color_std_mean",
    "tbp_lv_deltaA",
    "tbp_lv_deltaB",
    "tbp_lv_deltaL",
    "tbp_lv_deltaLBnorm",
    "tbp_lv_eccentricity",
    "tbp_lv_minorAxisMM",
    "tbp_lv_nevi_confidence",
    "tbp_lv_norm_border",
    "tbp_lv_norm_color",
    "tbp_lv_perimeterMM",
    "tbp_lv_radial_color_std_max",
    "tbp_lv_stdL",
    "tbp_lv_stdLExt",
    "tbp_lv_symm_2axis",
    "tbp_lv_symm_2axis_angle",
    "tbp_lv_x",
    "tbp_lv_y",
    "tbp_lv_z",
]


# ---------------------------------------------------------------------------
# Phase 3b + 4 — Dataset
# ---------------------------------------------------------------------------


class SkinLesionDataset(Dataset):
    """
    Multimodal PyTorch Dataset serving ``(image, tabular, label)`` tuples.

    Parameters
    ----------
    dataframe : pd.DataFrame
        Must contain at minimum:
            - ``image_path``  — absolute or relative path to the PNG/JPG tile.
            - ``target``      — binary label (0 = benign, 1 = malignant).
        When ``tabular_cols`` is non-empty, all listed columns must also be
        present and numeric.
    transform : Callable | None
        Albumentations ``Compose`` pipeline.  ``None`` returns raw numpy arrays
        (useful for debugging).
    image_dir : Path | None
        Optional base directory prepended to relative ``image_path`` values.
    tabular_cols : list[str] | None
        Ordered list of numeric metadata columns to return as the tabular
        feature vector.  Defaults to ``TABULAR_FEATURE_COLUMNS``.
        Pass an empty list ``[]`` to disable tabular output (returns a
        zero-length tensor).

    Returns (per __getitem__)
    -------------------------
    image_tensor : torch.Tensor, shape (3, 224, 224), dtype float32
    tabular_tensor : torch.Tensor, shape (len(tabular_cols),), dtype float32
    label : torch.Tensor, shape (), dtype float32
    """

    def __init__(
        self,
        dataframe: pd.DataFrame,
        transform: Optional[Callable] = None,
        image_dir: Optional[Path] = None,
        tabular_cols: Optional[list[str]] = None,
    ) -> None:
        self.df = dataframe.reset_index(drop=True)
        self.transform = transform
        self.image_dir = image_dir
        self.tabular_cols: list[str] = (
            tabular_cols if tabular_cols is not None else TABULAR_FEATURE_COLUMNS
        )
        # Validate tabular columns presence up-front
        missing_cols = [c for c in self.tabular_cols if c not in self.df.columns]
        if missing_cols:
            # Gracefully fill missing cols with NaN rather than crashing —
            # LightGBM handles NaN natively; caller should ideally fix upstream.
            for c in missing_cols:
                self.df[c] = np.nan

    # ------------------------------------------------------------------
    # Dunder helpers
    # ------------------------------------------------------------------

    def __len__(self) -> int:
        return len(self.df)

    def __getitem__(
        self, idx: int
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        row = self.df.iloc[idx]

        # ---- Load image ----
        img_path = Path(row["image_path"])
        if self.image_dir is not None and not img_path.is_absolute():
            img_path = self.image_dir / img_path
        image = self._load_image(img_path)

        # ---- Apply transform (Phase 3) ----
        if self.transform is not None:
            image = self.transform(image=image)["image"]  # → (C, H, W) float32
        else:
            image = torch.from_numpy(image.transpose(2, 0, 1)).float() / 255.0

        # ---- Build tabular vector (Phase 4 feeds this into LightGBM) ----
        if self.tabular_cols:
            tabular = torch.tensor(
                row[self.tabular_cols].values.astype(np.float32),
                dtype=torch.float32,
            )
        else:
            tabular = torch.zeros(0, dtype=torch.float32)

        # ---- Label ----
        label = torch.tensor(float(row["target"]), dtype=torch.float32)

        return image, tabular, label  # type: ignore[return-value]

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _load_image(path: Path) -> np.ndarray:
        """Load image as RGB HWC uint8 numpy array; raise on corrupt data."""
        try:
            img = Image.open(path).convert("RGB")
            return np.array(img, dtype=np.uint8)
        except Exception as exc:
            raise ValueError(f"Cannot read image at {path}: {exc}") from exc

    # ------------------------------------------------------------------
    # Phase 4 — Imbalance helpers
    # ------------------------------------------------------------------

    def get_sampler(self) -> WeightedRandomSampler:
        """
        Build a ``WeightedRandomSampler`` that equalises class frequency per
        batch (PRD §5.1).

        Each sample is assigned a weight inversely proportional to its class
        size, so the DataLoader oversamples the rare malignant class until the
        effective batch distribution is ~1:1 benign:malignant.

        Returns
        -------
        WeightedRandomSampler
        """
        labels = self.df["target"].values.astype(int)
        weights = compute_sample_weights(labels)
        return WeightedRandomSampler(
            weights=torch.from_numpy(weights),
            num_samples=len(weights),
            replacement=True,
        )

    def get_pos_weight(self) -> float:
        """
        Negative-to-positive ratio for ``BCEWithLogitsLoss(pos_weight=...)``
        or LightGBM ``scale_pos_weight`` (PRD §5.2).

        Returns
        -------
        float
            ``n_negatives / n_positives``, clamped to ≥ 1.0.
        """
        labels = self.df["target"].values.astype(int)
        return compute_scale_pos_weight(labels)


# ---------------------------------------------------------------------------
# Backward-compatibility shims
# (consumed by train_vision.py / train_meta.py without changes)
# ---------------------------------------------------------------------------

# Private alias kept for import by train_meta.py
_SEX_MAP = SEX_MAP
_SITE_MAP = SITE_MAP


def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Lightweight cleaning shim for backward compatibility with train_vision.py.

    For production use, prefer :func:`src.preprocess.run_preprocessing_pipeline`
    which runs the full Phase 1-2 pipeline.

    Operations
    ----------
    1. Impute missing ``age_approx`` and ``clin_size_long_diam_mm`` with median.
    2. Lowercase string columns (``sex``, ``anatom_site_general``).
    3. Drop rows where ``image_path`` or ``target`` is null.
    """
    df = df.copy()
    df, _ = impute_missing(df)
    subset = [c for c in ("image_path", "target") if c in df.columns]
    if subset:
        df = df.dropna(subset=subset).reset_index(drop=True)
    return df


def encode_metadata_row(row: pd.Series) -> np.ndarray:
    """
    Encode a single raw metadata row into a numeric numpy vector.

    Used at inference time in ``api/service.py``.

    Returns
    -------
    np.ndarray of shape (7,)
        [age_approx, sex_enc, site_enc, clin_size,
         asymmetry_score, border_irregularity, color_variation]
    """
    return np.array(
        [
            float(row.get("age_approx", np.nan)),
            float(SEX_MAP.get(str(row.get("sex", "")).lower().strip(), SEX_MAP["unknown"])),
            float(SITE_MAP.get(str(row.get("anatom_site_general", "")).lower().strip(), SITE_MAP["unknown"])),
            float(row.get("clin_size_long_diam_mm", np.nan)),
            float(row.get("asymmetry_score", np.nan)),
            float(row.get("border_irregularity", np.nan)),
            float(row.get("color_variation", np.nan)),
        ],
        dtype=np.float32,
    )
