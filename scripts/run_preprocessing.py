"""
scripts/run_preprocessing.py
-----------------------------
CLI orchestrator for the full ISIC-2024 / SLICE-3D data preprocessing pipeline.

Runs all four phases defined in the PRD and writes the cleaned, fold-annotated
metadata CSV to disk, ready for training:

    Phase 1 — Tabular metadata cleaning
    Phase 2 — Patient-level StratifiedGroupKFold splitting
    Phase 3 — Augmentation factories (validated via a dry-run on one image)
    Phase 4 — Imbalance summary (WeightedRandomSampler weights + scale_pos_weight)

Usage
-----
    python scripts/run_preprocessing.py \\
        --csv  Data/metadata.csv \\
        --img-dirs Data/imgs_part_1 Data/imgs_part_2 Data/imgs_part_3 \\
        --output Data/train_clean.csv

    # Fast-iteration mode: keep only 10% of benign, filter tile type
    python scripts/run_preprocessing.py \\
        --csv  Data/metadata.csv \\
        --img-dirs Data/imgs_part_1 \\
        --output Data/train_fast.csv \\
        --downsample-ratio 0.10 \\
        --tile-type "3D: XP"
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Make sure the backend package is importable when running from the repo root
# ---------------------------------------------------------------------------
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT / "backend") not in sys.path:
    sys.path.insert(0, str(_ROOT / "backend"))

import numpy as np
import pandas as pd
import torch

from src.dataset import (
    TABULAR_FEATURE_COLUMNS,
    SkinLesionDataset,
    build_train_transform,
    build_val_transform,
)
from src.preprocess import (
    assign_folds,
    compute_scale_pos_weight,
    compute_sample_weights,
    downsample_benign,
    encode_categoricals,
    impute_missing,
    run_preprocessing_pipeline,
    select_features,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _print_section(title: str) -> None:
    bar = "─" * 60
    print(f"\n{bar}")
    print(f"  {title}")
    print(bar)


def _validate_transforms(image_path: str | None) -> None:
    """
    Dry-run the augmentation pipeline on one real image (or a synthetic one if
    no image path is supplied) to confirm Albumentations is correctly installed.
    """
    _print_section("Phase 3 — Augmentation pipeline dry-run")

    dummy = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)

    if image_path:
        try:
            from PIL import Image
            img = Image.open(image_path).convert("RGB")
            dummy = np.array(img, dtype=np.uint8)
            logger.info("Loaded sample image: %s  shape=%s", image_path, dummy.shape)
        except Exception as exc:
            logger.warning("Could not load sample image (%s) — using synthetic array.", exc)

    train_tfm = build_train_transform()
    val_tfm   = build_val_transform()

    train_out = train_tfm(image=dummy)["image"]
    val_out   = val_tfm(image=dummy)["image"]

    assert isinstance(train_out, torch.Tensor), "build_train_transform must return a tensor"
    assert isinstance(val_out,   torch.Tensor), "build_val_transform must return a tensor"
    assert train_out.shape == (3, 224, 224), f"Unexpected train shape: {train_out.shape}"
    assert val_out.shape   == (3, 224, 224), f"Unexpected val shape: {val_out.shape}"

    print(f"  ✓ Train transform output: {tuple(train_out.shape)}  dtype={train_out.dtype}")
    print(f"  ✓ Val   transform output: {tuple(val_out.shape)}   dtype={val_out.dtype}")
    print(f"  ✓ Pixel range after norm: [{train_out.min():.2f}, {train_out.max():.2f}]")


def _print_imbalance_summary(df: pd.DataFrame) -> None:
    """Phase 4 — print sampler weight and scale_pos_weight statistics."""
    _print_section("Phase 4 — Imbalance handling summary")

    labels = df["target"].values.astype(int)
    n_pos = int(labels.sum())
    n_neg = len(labels) - n_pos
    ratio = n_neg / max(n_pos, 1)

    scale_pw = compute_scale_pos_weight(labels)
    weights  = compute_sample_weights(labels)

    print(f"  Benign  (class 0): {n_neg:>8,}")
    print(f"  Malignant (class 1): {n_pos:>6,}")
    print(f"  Imbalance ratio:     {ratio:>8.1f}:1")
    print()
    print(f"  LightGBM  scale_pos_weight : {scale_pw:.2f}")
    print(f"  BCEWithLogitsLoss pos_weight: {scale_pw:.2f}")
    print()
    print(f"  WeightedRandomSampler weights:")
    print(f"    benign    weight = {weights[labels == 0][0]:.6f}")
    print(f"    malignant weight = {weights[labels == 1][0]:.6f}")
    print()
    print("  → In each DataLoader batch with WeightedRandomSampler,")
    print("    malignant images are oversampled to achieve ~1:1 ratio.")


def _print_fold_summary(df: pd.DataFrame) -> None:
    """Print per-fold class distribution."""
    _print_section("Phase 2 — Fold distribution (StratifiedGroupKFold)")

    summary = (
        df.groupby("fold")["target"]
        .agg(total="count", malignant="sum")
        .assign(
            benign=lambda x: x["total"] - x["malignant"],
            mal_pct=lambda x: (x["malignant"] / x["total"] * 100).round(3),
        )
    )
    print(summary.to_string())

    if "patient_id" in df.columns:
        patients_per_fold = df.groupby("fold")["patient_id"].nunique()
        print("\n  Unique patients per fold:")
        print(patients_per_fold.to_string())


def _print_feature_summary(df: pd.DataFrame) -> None:
    """Print missing-value and encoding statistics."""
    _print_section("Phase 1 — Cleaned feature summary")

    keep_cols = [c for c in TABULAR_FEATURE_COLUMNS if c in df.columns]
    if keep_cols:
        miss = df[keep_cols].isna().mean() * 100
        miss = miss[miss > 0]
        if miss.empty:
            print("  ✓ No missing values in tabular feature columns after imputation.")
        else:
            print("  Remaining missing value rates:")
            print(miss.to_string())
    else:
        print("  (No TABULAR_FEATURE_COLUMNS present in this CSV schema.)")

    for col in ("sex_enc", "site_enc"):
        if col in df.columns:
            print(f"\n  {col} distribution:")
            print(df[col].value_counts().sort_index().to_string())


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="ISIC-2024 / SLICE-3D data preprocessing pipeline (PRD v1.0)."
    )
    parser.add_argument(
        "--csv",
        type=Path,
        required=True,
        help="Path to raw ISIC-2024 train-metadata.csv (or local PAD-UFES-20 metadata.csv).",
    )
    parser.add_argument(
        "--img-dirs",
        type=Path,
        nargs="*",
        default=None,
        help="One or more directories containing tile PNG/JPG files.  "
             "If omitted, image_path column is not resolved.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("Data/train_clean.csv"),
        help="Destination path for the cleaned CSV.  Default: Data/train_clean.csv",
    )
    parser.add_argument(
        "--downsample-ratio",
        type=float,
        default=1.0,
        help="Fraction of benign rows to keep (0 < ratio ≤ 1.0).  "
             "Malignant rows are always retained.  Default: 1.0 (no downsampling).",
    )
    parser.add_argument(
        "--tile-type",
        type=str,
        default=None,
        help="Value of tbp_tile_type to keep (e.g. '3D: XP').  "
             "Applied to benign rows only.  Default: keep all.",
    )
    parser.add_argument(
        "--n-folds",
        type=int,
        default=5,
        help="Number of StratifiedGroupKFold splits.  Default: 5.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Global random seed.  Default: 42.",
    )
    parser.add_argument(
        "--no-images",
        action="store_true",
        help="Skip image resolution and existence checks (useful for metadata-only runs).",
    )
    parser.add_argument(
        "--skip-augmentation-check",
        action="store_true",
        help="Skip the Phase 3 augmentation dry-run.",
    )
    args = parser.parse_args()

    print("\n" + "═" * 60)
    print("  Derm-Referral AI  —  Data Preprocessing Pipeline  v1.0")
    print("═" * 60)
    print(f"  CSV          : {args.csv}")
    print(f"  Image dirs   : {args.img_dirs}")
    print(f"  Output       : {args.output}")
    print(f"  Downsample   : {args.downsample_ratio}")
    print(f"  Tile filter  : {args.tile_type!r}")
    print(f"  Folds        : {args.n_folds}")
    print(f"  Seed         : {args.seed}")

    # ---- Phase 1 + 2: Run the full pipeline ----
    _print_section("Phase 1 — Tabular metadata cleaning  |  Phase 2 — Fold assignment")

    clean_df = run_preprocessing_pipeline(
        csv_path=args.csv,
        image_dirs=args.img_dirs if not args.no_images else None,
        benign_downsample_ratio=args.downsample_ratio,
        tile_type_filter=args.tile_type,
        n_folds=args.n_folds,
        seed=args.seed,
        drop_missing_images=not args.no_images,
    )

    print(f"\n  ✓ Cleaned dataset: {len(clean_df):,} rows  "
          f"|  {int(clean_df['target'].sum())} malignant  "
          f"|  {int((clean_df['target'] == 0).sum())} benign")

    # ---- Print diagnostics ----
    _print_feature_summary(clean_df)
    _print_fold_summary(clean_df)
    _print_imbalance_summary(clean_df)

    # ---- Phase 3: Augmentation dry-run ----
    if not args.skip_augmentation_check:
        sample_image = None
        if "image_path" in clean_df.columns:
            existing = clean_df["image_path"].dropna()
            if len(existing):
                candidate = str(existing.iloc[0])
                if Path(candidate).exists():
                    sample_image = candidate
        _validate_transforms(sample_image)

    # ---- Write output ----
    args.output.parent.mkdir(parents=True, exist_ok=True)
    clean_df.to_csv(args.output, index=False)
    print(f"\n  ✓ Cleaned CSV written to: {args.output}")
    print(f"    Columns: {list(clean_df.columns)}")
    print(f"    Shape  : {clean_df.shape}")
    print("\n" + "═" * 60)
    print("  Pipeline complete.")
    print("═" * 60 + "\n")


if __name__ == "__main__":
    main()
