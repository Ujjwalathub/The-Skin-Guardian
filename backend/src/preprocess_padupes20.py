"""
src/preprocess_padupes20.py
----------------------------
Preprocessing Pipeline for PAD-UFES-20 Dataset.

Adapts PAD-UFES-20 schema to match the expected ISIC format for downstream
training pipelines. Implements:
    1. Schema mapping (PAD-UFES-20 → ISIC-compatible)
    2. Target creation (diagnostic → binary malignant/benign)
    3. Missing value handling
    4. Categorical encoding
    5. Patient-level stratified splitting

Typical usage:
--------------
    from src.preprocess_padupes20 import run_padupes20_preprocessing

    clean_df = run_padupes20_preprocessing(
        csv_path="Data/metadata.csv",
        image_dirs=["Data/imgs_part_1", "Data/imgs_part_2", "Data/imgs_part_3"],
        benign_downsample_ratio=1.0,
        n_folds=5,
        seed=42,
    )
    clean_df.to_csv("Data/train_clean.csv", index=False)
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Sequence

import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedGroupKFold

logger = logging.getLogger(__name__)

# Diagnostic labels in PAD-UFES-20
# Malignant: MEL (Melanoma), BCC (Basal Cell Carcinoma), SCC (Squamous Cell Carcinoma)
# Benign: NEV (Nevus), ACK (Actinic Keratosis), SEK (Seborrheic Keratosis)
MALIGNANT_DIAGNOSTICS = {"MEL", "BCC", "SCC"}
BENIGN_DIAGNOSTICS = {"NEV", "ACK", "SEK"}

# Gender mapping (PAD-UFES-20 uses MALE/FEMALE)
GENDER_MAP = {"MALE": "male", "FEMALE": "female"}

# Region mapping to anatom_site_general
REGION_TO_SITE_MAP = {
    "FACE": "head/neck",
    "NECK": "head/neck",
    "NOSE": "head/neck",
    "SCALP": "head/neck",
    "EAR": "head/neck",
    "ARM": "upper extremity",
    "FOREARM": "upper extremity",
    "HAND": "upper extremity",
    "LEG": "lower extremity",
    "THIGH": "lower extremity",
    "FOOT": "lower extremity",
    "CHEST": "anterior torso",
    "ABDOMEN": "anterior torso",
    "BACK": "posterior torso",
    # Add more mappings as needed
}


def create_binary_target(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create binary target column from 'diagnostic' field.
    
    Malignant (1): MEL, BCC, SCC
    Benign (0): NEV, ACK, SEK
    
    Parameters
    ----------
    df : pd.DataFrame
        Must contain 'diagnostic' column
        
    Returns
    -------
    pd.DataFrame
        Copy with 'target' column added
    """
    df = df.copy()
    
    if "diagnostic" not in df.columns:
        raise KeyError("'diagnostic' column not found in dataset")
    
    # Normalize diagnostic values
    df["diagnostic"] = df["diagnostic"].str.upper().str.strip()
    
    # Create binary target
    df["target"] = df["diagnostic"].apply(
        lambda x: 1 if x in MALIGNANT_DIAGNOSTICS else (
            0 if x in BENIGN_DIAGNOSTICS else np.nan
        )
    ).astype("Int64")
    
    # Log class distribution
    n_malignant = (df["target"] == 1).sum()
    n_benign = (df["target"] == 0).sum()
    n_unknown = df["target"].isna().sum()
    
    logger.info(
        "Target distribution: %d malignant (%.1f%%), %d benign (%.1f%%), %d unknown",
        n_malignant, n_malignant / len(df) * 100,
        n_benign, n_benign / len(df) * 100,
        n_unknown,
    )
    
    # Drop rows with unknown diagnostic
    if n_unknown > 0:
        logger.warning("Dropping %d rows with unknown diagnostic", n_unknown)
        df = df.dropna(subset=["target"]).reset_index(drop=True)
    
    df["target"] = df["target"].astype(int)
    return df


def map_schema_to_isic(df: pd.DataFrame) -> pd.DataFrame:
    """
    Map PAD-UFES-20 column names to ISIC-compatible schema.
    
    Mappings:
    - age → age_approx
    - gender → sex (with lowercase normalization)
    - region → anatom_site_general (with mapping)
    - img_id → isic_id (for compatibility)
    
    Parameters
    ----------
    df : pd.DataFrame
        
    Returns
    -------
    pd.DataFrame
        With renamed and transformed columns
    """
    df = df.copy()
    
    # Rename columns
    rename_map = {
        "age": "age_approx",
        "img_id": "isic_id",
    }
    df = df.rename(columns=rename_map)
    
    # Map gender to sex (normalize to lowercase)
    if "gender" in df.columns:
        df["sex"] = df["gender"].str.upper().map(GENDER_MAP).fillna("unknown")
        logger.debug("Mapped gender → sex: %s", df["sex"].value_counts().to_dict())
    
    # Map region to anatom_site_general
    if "region" in df.columns:
        df["anatom_site_general"] = (
            df["region"]
            .str.upper()
            .map(REGION_TO_SITE_MAP)
            .fillna("unknown")
        )
        logger.debug(
            "Mapped region → anatom_site_general: %s",
            df["anatom_site_general"].value_counts().to_dict(),
        )
    
    return df


def add_placeholder_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add placeholder columns for features that don't exist in PAD-UFES-20
    but are expected by downstream pipelines.
    
    ABCDE proxy features (tbp_lv_*) are set to NaN - they will be handled
    by the imputation step in the main pipeline.
    
    Parameters
    ----------
    df : pd.DataFrame
        
    Returns
    -------
    pd.DataFrame
        With placeholder columns added
    """
    df = df.copy()
    
    # Add clinical size placeholder (will be imputed)
    if "clin_size_long_diam_mm" not in df.columns:
        # Use diameter_1 if available
        if "diameter_1" in df.columns:
            df["clin_size_long_diam_mm"] = pd.to_numeric(
                df["diameter_1"], errors="coerce"
            )
        else:
            df["clin_size_long_diam_mm"] = np.nan
    
    # Add ABCDE proxy placeholders (all will be imputed)
    abcde_features = [
        "tbp_lv_A", "tbp_lv_Aext", "tbp_lv_B", "tbp_lv_Bext",
        "tbp_lv_C", "tbp_lv_Cext", "tbp_lv_color_std_mean",
        "tbp_lv_deltaA", "tbp_lv_deltaB", "tbp_lv_deltaL", "tbp_lv_deltaLBnorm",
        "tbp_lv_eccentricity", "tbp_lv_minorAxisMM", "tbp_lv_nevi_confidence",
        "tbp_lv_norm_border", "tbp_lv_norm_color", "tbp_lv_perimeterMM",
        "tbp_lv_radial_color_std_max", "tbp_lv_stdL", "tbp_lv_stdLExt",
        "tbp_lv_symm_2axis", "tbp_lv_symm_2axis_angle",
        "tbp_lv_x", "tbp_lv_y", "tbp_lv_z",
    ]
    
    for feat in abcde_features:
        if feat not in df.columns:
            df[feat] = np.nan
    
    logger.info("Added %d placeholder ABCDE features (will be imputed)", len(abcde_features))
    
    return df


def resolve_image_paths(
    df: pd.DataFrame,
    image_dirs: Sequence[str | Path],
    drop_missing: bool = True,
) -> pd.DataFrame:
    """
    Resolve image file paths from img_id/isic_id.
    
    Parameters
    ----------
    df : pd.DataFrame
        Must contain 'isic_id' column (mapped from img_id)
    image_dirs : sequence
        Directories to search for images
    drop_missing : bool
        Whether to drop rows where image file is not found
        
    Returns
    -------
    pd.DataFrame
        With 'image_path' column added
    """
    df = df.copy()
    image_dirs_resolved = [Path(d) for d in image_dirs]
    
    if "isic_id" not in df.columns:
        raise KeyError("'isic_id' column required for image path resolution")
    
    def _resolve(fname: str) -> str:
        for d in image_dirs_resolved:
            candidate = d / fname
            if candidate.exists():
                return str(candidate.resolve())
        # Return placeholder path
        return str(image_dirs_resolved[0] / fname)
    
    df["image_path"] = df["isic_id"].astype(str).apply(_resolve)
    
    if drop_missing:
        before = len(df)
        df = df[df["image_path"].apply(lambda p: Path(p).exists())].reset_index(drop=True)
        dropped = before - len(df)
        if dropped > 0:
            logger.warning("Dropped %d rows — image file not found", dropped)
    
    logger.info("Resolved image paths for %d samples", len(df))
    return df


def downsample_benign(
    df: pd.DataFrame,
    ratio: float = 1.0,
    seed: int = 42,
) -> pd.DataFrame:
    """
    Downsample benign class to balance dataset.
    
    Parameters
    ----------
    df : pd.DataFrame
        Must contain 'target' column
    ratio : float
        Fraction of benign samples to keep (0.0 < ratio <= 1.0)
    seed : int
        Random state for sampling
        
    Returns
    -------
    pd.DataFrame
        Downsampled dataset
    """
    if ratio <= 0.0 or ratio > 1.0:
        raise ValueError(f"ratio must be in (0.0, 1.0], got {ratio}")
    
    if ratio == 1.0:
        return df
    
    df = df.copy()
    malignant = df[df["target"] == 1]
    benign = df[df["target"] == 0]
    
    n_keep = max(int(len(benign) * ratio), 1)
    benign_sampled = benign.sample(n=n_keep, random_state=seed)
    
    result = pd.concat([malignant, benign_sampled], ignore_index=True)
    result = result.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    
    logger.info(
        "Benign downsampling: %d → %d (%.1f%% kept)",
        len(benign), n_keep, ratio * 100,
    )
    logger.info(
        "Final distribution: %d malignant, %d benign (ratio %.2f:1)",
        len(malignant), len(benign_sampled),
        len(benign_sampled) / max(len(malignant), 1),
    )
    
    return result


def assign_stratified_folds(
    df: pd.DataFrame,
    n_folds: int = 5,
    seed: int = 42,
) -> pd.DataFrame:
    """
    Assign patient-level stratified folds.
    
    Uses StratifiedGroupKFold to ensure:
    - All images from same patient stay in same fold
    - Each fold has proportional malignant/benign split
    
    Parameters
    ----------
    df : pd.DataFrame
        Must contain 'patient_id' and 'target' columns
    n_folds : int
        Number of folds
    seed : int
        Random state
        
    Returns
    -------
    pd.DataFrame
        With 'fold' column added
    """
    df = df.copy()
    
    if "patient_id" not in df.columns or "target" not in df.columns:
        raise KeyError("'patient_id' and 'target' columns required for fold assignment")
    
    df["fold"] = -1
    
    groups = df["patient_id"].values
    labels = df["target"].values.astype(int)
    
    sgkf = StratifiedGroupKFold(n_splits=n_folds, shuffle=True, random_state=seed)
    
    for fold_idx, (_, val_idx) in enumerate(
        sgkf.split(np.zeros(len(df)), labels, groups=groups)
    ):
        df.iloc[val_idx, df.columns.get_loc("fold")] = fold_idx
    
    # Handle any unassigned rows (shouldn't happen, but safety check)
    if (df["fold"] == -1).any():
        logger.warning("Some rows not assigned to fold, assigning to fold 0")
        df.loc[df["fold"] == -1, "fold"] = 0
    
    df["fold"] = df["fold"].astype(int)
    
    # Log fold statistics
    fold_stats = (
        df.groupby("fold")["target"]
        .agg(["sum", "count"])
        .rename(columns={"sum": "malignant", "count": "total"})
    )
    fold_stats["benign"] = fold_stats["total"] - fold_stats["malignant"]
    fold_stats["mal_pct"] = (fold_stats["malignant"] / fold_stats["total"] * 100).round(2)
    
    logger.info("Fold distribution:\n%s", fold_stats.to_string())
    
    return df


def run_padupes20_preprocessing(
    csv_path: str | Path,
    image_dirs: Sequence[str | Path],
    *,
    benign_downsample_ratio: float = 1.0,
    n_folds: int = 5,
    seed: int = 42,
    drop_missing_images: bool = True,
) -> pd.DataFrame:
    """
    Complete preprocessing pipeline for PAD-UFES-20 dataset.
    
    Steps:
    1. Load raw CSV
    2. Create binary target from diagnostic
    3. Map schema to ISIC-compatible format
    4. Resolve image paths
    5. Add placeholder ABCDE features
    6. Downsample benign class (optional)
    7. Assign patient-level stratified folds
    
    Parameters
    ----------
    csv_path : str | Path
        Path to metadata.csv
    image_dirs : sequence
        List of directories containing images
    benign_downsample_ratio : float
        Fraction of benign samples to keep (1.0 = keep all)
    n_folds : int
        Number of cross-validation folds
    seed : int
        Random seed for reproducibility
    drop_missing_images : bool
        Whether to drop samples with missing image files
        
    Returns
    -------
    pd.DataFrame
        Cleaned dataset ready for training with columns:
        - patient_id, isic_id, image_path
        - age_approx, sex, anatom_site_general, clin_size_long_diam_mm
        - tbp_lv_* features (ABCDE proxies, set to NaN)
        - target (binary: 0=benign, 1=malignant)
        - fold (0-indexed fold assignment)
    """
    csv_path = Path(csv_path)
    
    logger.info("=" * 70)
    logger.info("PAD-UFES-20 Preprocessing Pipeline")
    logger.info("=" * 70)
    logger.info("Loading CSV from: %s", csv_path)
    
    # Load raw data
    df = pd.read_csv(csv_path, low_memory=False)
    logger.info("Loaded %d rows, %d columns", len(df), len(df.columns))
    
    # Step 1: Create binary target
    logger.info("\n[1/7] Creating binary target from 'diagnostic'...")
    df = create_binary_target(df)
    
    # Step 2: Map schema
    logger.info("\n[2/7] Mapping PAD-UFES-20 schema to ISIC format...")
    df = map_schema_to_isic(df)
    
    # Step 3: Resolve image paths
    logger.info("\n[3/7] Resolving image paths...")
    df = resolve_image_paths(df, image_dirs, drop_missing=drop_missing_images)
    
    # Step 4: Add placeholder features
    logger.info("\n[4/7] Adding placeholder ABCDE features...")
    df = add_placeholder_features(df)
    
    # Step 5: Downsample benign class
    if benign_downsample_ratio < 1.0:
        logger.info("\n[5/7] Downsampling benign class...")
        df = downsample_benign(df, ratio=benign_downsample_ratio, seed=seed)
    else:
        logger.info("\n[5/7] Skipping benign downsampling (ratio=1.0)")
    
    # Step 6: Assign folds
    logger.info("\n[6/7] Assigning patient-level stratified folds...")
    df = assign_stratified_folds(df, n_folds=n_folds, seed=seed)
    
    # Step 7: Final summary
    logger.info("\n[7/7] Preprocessing complete!")
    logger.info("=" * 70)
    logger.info("Final dataset shape: %s", df.shape)
    logger.info("Columns: %s", list(df.columns))
    
    n_mal = (df["target"] == 1).sum()
    n_ben = (df["target"] == 0).sum()
    logger.info(
        "Class distribution: %d malignant (%.1f%%), %d benign (%.1f%%)",
        n_mal, n_mal / len(df) * 100,
        n_ben, n_ben / len(df) * 100,
    )
    logger.info("Imbalance ratio: %.2f:1 (benign:malignant)", n_ben / max(n_mal, 1))
    logger.info("=" * 70)
    
    return df


if __name__ == "__main__":
    # Example usage
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    
    # Use absolute paths relative to script location
    script_dir = Path(__file__).parent.parent  # backend directory
    data_dir = script_dir.parent / "Data"  # e:\Skin\Data
    
    clean_df = run_padupes20_preprocessing(
        csv_path=data_dir / "metadata.csv",
        image_dirs=[
            data_dir / "imgs_part_1",
            data_dir / "imgs_part_2",
            data_dir / "imgs_part_3",
        ],
        benign_downsample_ratio=1.0,
        n_folds=5,
        seed=42,
    )
    
    output_path = data_dir / "train_clean.csv"
    clean_df.to_csv(output_path, index=False)
    print(f"\nSaved cleaned dataset to: {output_path}")
