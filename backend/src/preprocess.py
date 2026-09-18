"""
src/preprocess.py
-----------------
Data Preprocessing & Cleaning Pipeline — ISIC 2024 / SLICE-3D dataset.

Implements all four phases described in the PRD:
    Phase 1 — Tabular metadata cleaning
                • Feature selection  (drop leakage columns)
                • Missing-value imputation (median / 'unknown')
                • Ordinal encoding of categorical variables
                • Optional benign-class downsampling for fast iteration
    Phase 2 — Patient-level data splitting
                • StratifiedGroupKFold (K=5) keyed on patient_id
                • Fold index written back into the DataFrame as column ``fold``
    Phase 3 — Augmentation factories (re-exported from dataset.py)
    Phase 4 — Imbalance helpers
                • WeightedRandomSampler weight vector
                • scale_pos_weight scalar for LightGBM

Typical usage
-------------
    from src.preprocess import run_preprocessing_pipeline

    clean_df = run_preprocessing_pipeline(
        csv_path="Data/metadata.csv",
        image_dirs=["Data/imgs_part_1", "Data/imgs_part_2", "Data/imgs_part_3"],
        benign_downsample_ratio=0.10,   # keep 10 % of benign for fast iteration
        tile_type_filter="3D: XP",      # None → keep all tile types
        n_folds=5,
        seed=42,
    )
    clean_df.to_csv("Data/train_clean.csv", index=False)
"""

from __future__ import annotations

import logging
import warnings
from pathlib import Path
from typing import Sequence

import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedGroupKFold

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Columns that exist in the raw ISIC-2024 / SLICE-3D CSV
# ---------------------------------------------------------------------------

# Columns available at inference time in a rural clinic setting (no biopsy)
INFERENCE_KEEP_COLS: list[str] = [
    # Identifiers (not features — kept for grouping / joining)
    "isic_id",
    "patient_id",
    "lesion_id",
    # Clinical metadata
    "age_approx",
    "sex",
    "anatom_site_general",
    "clin_size_long_diam_mm",
    # ABCDE proxies available from TBP image analysis
    "tbp_lv_A",        # asymmetry score (area ratio)
    "tbp_lv_Aext",
    "tbp_lv_B",        # border irregularity
    "tbp_lv_Bext",
    "tbp_lv_C",        # colour-variance (chroma)
    "tbp_lv_Cext",
    "tbp_lv_color_std_mean",
    "tbp_lv_deltaA",
    "tbp_lv_deltaB",
    "tbp_lv_deltaL",
    "tbp_lv_deltaLBnorm",
    "tbp_lv_eccentricity",
    "tbp_lv_minorAxisMM",
    "tbp_lv_nevi_confidence",   # automated (not clinician) confidence
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
    # Tile metadata (used for optional filtering, not a model feature)
    "tbp_tile_type",
    "image_type",
    # Target
    "target",
    # Path resolved later
    "image_path",
]

# Columns that must be dropped — post-biopsy / leakage
_LEAKAGE_COLS: list[str] = [
    "iddx_full",
    "iddx_1",
    "iddx_2",
    "iddx_3",
    "iddx_4",
    "iddx_5",
    "mel_thick_mm",
    "mel_mitotic_index",
    "mel_ulcer",
    "lesion_id",        # internal ID not available at inference
    "attribution",
    "copyright_license",
]

# Continuous columns imputed with training-set median
_CONTINUOUS_COLS: list[str] = [
    "age_approx",
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

# Ordinal encoding maps  — 'unknown' is always the last entry
SEX_MAP: dict[str, int] = {"male": 0, "female": 1, "unknown": 2}
SITE_MAP: dict[str, int] = {
    "head/neck": 0,
    "upper extremity": 1,
    "lower extremity": 2,
    "torso": 3,
    "palms/soles": 4,
    "oral/genital": 5,
    "anterior torso": 6,
    "posterior torso": 7,
    "lateral torso": 8,
    "other": 9,
    "unknown": 10,
}


# ---------------------------------------------------------------------------
# Phase 1 — Tabular metadata cleaning
# ---------------------------------------------------------------------------


def select_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Drop post-biopsy / leakage columns and columns not present in the CSV.

    Parameters
    ----------
    df : pd.DataFrame
        Raw metadata loaded directly from the ISIC-2024 CSV.

    Returns
    -------
    pd.DataFrame
        Subset of columns that are safe for inference, preserving all
        columns that exist in ``INFERENCE_KEEP_COLS`` and dropping anything
        in ``_LEAKAGE_COLS``.
    """
    drop_present = [c for c in _LEAKAGE_COLS if c in df.columns]
    if drop_present:
        logger.info("Dropping leakage / post-biopsy columns: %s", drop_present)
        df = df.drop(columns=drop_present)

    # Warn if a leakage column is unexpectedly absent (useful during dev)
    unexpected_absent = [c for c in _LEAKAGE_COLS if c not in df.columns]
    if unexpected_absent:
        logger.debug(
            "Leakage columns already absent (OK): %s", unexpected_absent
        )
    return df


def impute_missing(
    df: pd.DataFrame,
    medians: dict[str, float] | None = None,
    *,
    mode_threshold: float = 0.01,
) -> tuple[pd.DataFrame, dict[str, float]]:
    """
    Impute missing values in place (on a copy).

    Continuous columns → median of the *training* set.
    Categorical columns → 'unknown'  (or mode when missing < ``mode_threshold``).

    Parameters
    ----------
    df : pd.DataFrame
    medians : dict[str, float] | None
        Pre-computed median map from the training fold.  Pass ``None`` to
        compute from ``df`` itself (training time).  At inference/val time,
        pass the map returned from the training call to avoid leakage.
    mode_threshold : float
        If a categorical column has fewer than this fraction of missing values,
        impute with the column mode instead of 'unknown'.

    Returns
    -------
    (df_clean, medians_map)
        ``df_clean``   — cleaned DataFrame copy.
        ``medians_map`` — ``{column: median}`` computed on ``df`` (useful for
                          applying consistently to validation/test splits).
    """
    df = df.copy()
    computed_medians: dict[str, float] = {}

    # --- Continuous imputation ---
    for col in _CONTINUOUS_COLS:
        if col not in df.columns:
            continue
        missing_frac = df[col].isna().mean()
        if missing_frac == 0.0:
            continue

        if medians is not None:
            fill_val = medians.get(col, df[col].median())
        else:
            fill_val = float(df[col].median())

        computed_medians[col] = fill_val
        df[col] = df[col].fillna(fill_val)
        logger.debug(
            "Imputed '%s': %.1f%% missing → median=%.4f", col, missing_frac * 100, fill_val
        )

    # --- Categorical imputation ---
    for col in ("sex", "anatom_site_general"):
        if col not in df.columns:
            continue
        df[col] = df[col].str.lower().str.strip()
        missing_frac = df[col].isna().mean()
        if missing_frac == 0.0:
            continue

        if missing_frac < mode_threshold:
            fill_val_cat = df[col].mode().iloc[0]
            logger.debug(
                "Imputed '%s': %.2f%% missing → mode='%s'",
                col, missing_frac * 100, fill_val_cat,
            )
        else:
            fill_val_cat = "unknown"
            logger.debug(
                "Imputed '%s': %.1f%% missing → 'unknown'",
                col, missing_frac * 100,
            )
        df[col] = df[col].fillna(fill_val_cat)

    return df, computed_medians


def encode_categoricals(df: pd.DataFrame) -> pd.DataFrame:
    """
    Ordinal-encode categorical string columns into integer indices.

    - ``sex``               → ``sex_enc``   (SEX_MAP)
    - ``anatom_site_general`` → ``site_enc`` (SITE_MAP)

    Unknown values (not in the map) are encoded as the 'unknown' entry
    rather than -1, so LightGBM can learn a meaningful split for them.

    Parameters
    ----------
    df : pd.DataFrame

    Returns
    -------
    pd.DataFrame
        Original columns plus ``sex_enc`` and ``site_enc``.
    """
    df = df.copy()

    if "sex" in df.columns:
        df["sex_enc"] = (
            df["sex"]
            .str.lower()
            .str.strip()
            .map(SEX_MAP)
            .fillna(SEX_MAP["unknown"])
            .astype(int)
        )
        logger.debug("Encoded 'sex' → 'sex_enc': %s", df["sex_enc"].value_counts().to_dict())

    if "anatom_site_general" in df.columns:
        df["site_enc"] = (
            df["anatom_site_general"]
            .str.lower()
            .str.strip()
            .map(SITE_MAP)
            .fillna(SITE_MAP["unknown"])
            .astype(int)
        )
        logger.debug(
            "Encoded 'anatom_site_general' → 'site_enc': %s",
            df["site_enc"].value_counts().to_dict(),
        )

    return df


def downsample_benign(
    df: pd.DataFrame,
    ratio: float = 1.0,
    *,
    tile_type_filter: str | None = None,
    seed: int = 42,
) -> pd.DataFrame:
    """
    Optionally reduce the benign class for faster iteration training.

    All malignant cases (``target == 1``) are **always preserved**.

    Parameters
    ----------
    df : pd.DataFrame
    ratio : float
        Fraction of benign cases to retain, in (0, 1].  1.0 → no downsampling.
    tile_type_filter : str | None
        If given, keep only rows where ``tbp_tile_type == tile_type_filter``
        **before** downsampling benign cases, while still keeping all malignant
        rows regardless of their tile type.
    seed : int
        Random state for reproducible sampling.

    Returns
    -------
    pd.DataFrame
        Filtered/downsampled copy, reset index.
    """
    if ratio <= 0.0 or ratio > 1.0:
        raise ValueError(f"ratio must be in (0, 1], got {ratio!r}")

    malignant = df[df["target"] == 1].copy()
    benign = df[df["target"] == 0].copy()

    # Apply tile-type filter to benign only (malignant always kept)
    if tile_type_filter is not None and "tbp_tile_type" in df.columns:
        benign = benign[benign["tbp_tile_type"] == tile_type_filter]
        logger.info(
            "Tile-type filter '%s': %d benign rows retained",
            tile_type_filter, len(benign),
        )

    if ratio < 1.0:
        n_keep = max(int(len(benign) * ratio), 1)
        benign = benign.sample(n=n_keep, random_state=seed)
        logger.info(
            "Benign downsampled: %d → %d (ratio=%.2f)",
            df["target"].eq(0).sum(), n_keep, ratio,
        )

    result = pd.concat([malignant, benign], ignore_index=True)
    result = result.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    logger.info(
        "Post-downsample: %d total  |  %d malignant  |  %d benign",
        len(result), malignant.shape[0], len(benign),
    )
    return result


# ---------------------------------------------------------------------------
# Phase 2 — Patient-level data splitting
# ---------------------------------------------------------------------------


def assign_folds(
    df: pd.DataFrame,
    n_folds: int = 5,
    seed: int = 42,
    *,
    group_col: str = "patient_id",
    target_col: str = "target",
) -> pd.DataFrame:
    """
    Assign stratified, patient-level K-Fold indices to the DataFrame.

    Uses ``StratifiedGroupKFold`` so that:
        - All images from the same patient stay in the same fold (no leakage).
        - Each fold's validation set has a proportional share of malignant cases.

    The fold index is written into a new column named ``fold`` (0-indexed).

    Parameters
    ----------
    df : pd.DataFrame
        Must contain ``group_col`` and ``target_col``.
    n_folds : int
        Number of folds.  Default 5.
    seed : int
        Random state for ``StratifiedGroupKFold``.
    group_col : str
        Column that defines a patient group (default ``'patient_id'``).
    target_col : str
        Binary label column (default ``'target'``).

    Returns
    -------
    pd.DataFrame
        Copy of ``df`` with a new ``fold`` column (int, 0 … n_folds-1).

    Raises
    ------
    KeyError
        If ``group_col`` or ``target_col`` is not present in ``df``.
    """
    for col in (group_col, target_col):
        if col not in df.columns:
            raise KeyError(
                f"Column '{col}' required for fold assignment but not found. "
                f"Available columns: {list(df.columns)}"
            )

    df = df.copy()
    df["fold"] = -1  # sentinel

    groups = df[group_col].values
    labels = df[target_col].values.astype(int)

    sgkf = StratifiedGroupKFold(n_splits=n_folds, shuffle=True, random_state=seed)

    for fold_idx, (_, val_idx) in enumerate(
        sgkf.split(np.zeros(len(df)), labels, groups=groups)
    ):
        df.iloc[val_idx, df.columns.get_loc("fold")] = fold_idx

    # Sanity check: every row assigned
    unassigned = (df["fold"] == -1).sum()
    if unassigned > 0:
        warnings.warn(
            f"{unassigned} rows were not assigned to any fold. "
            "This can happen when a patient has no variation in target. "
            "Setting these to fold 0.",
            UserWarning,
            stacklevel=2,
        )
        df.loc[df["fold"] == -1, "fold"] = 0

    df["fold"] = df["fold"].astype(int)

    # Log fold distribution
    fold_summary = (
        df.groupby("fold")[target_col]
        .agg(["sum", "count"])
        .rename(columns={"sum": "malignant", "count": "total"})
    )
    fold_summary["benign"] = fold_summary["total"] - fold_summary["malignant"]
    fold_summary["mal_pct"] = (fold_summary["malignant"] / fold_summary["total"] * 100).round(3)
    logger.info("Fold distribution:\n%s", fold_summary.to_string())

    return df


# ---------------------------------------------------------------------------
# Phase 4 — Imbalance helpers
# ---------------------------------------------------------------------------


def compute_sample_weights(labels: np.ndarray) -> np.ndarray:
    """
    Compute per-sample weights inversely proportional to class frequency.

    Used to build a ``WeightedRandomSampler`` for the PyTorch DataLoader so
    each training batch has a roughly 1:1 benign-to-malignant ratio.

    Parameters
    ----------
    labels : np.ndarray of int
        Binary label array (0 = benign, 1 = malignant).

    Returns
    -------
    np.ndarray of float32
        Per-sample weights of shape ``(len(labels),)``.
    """
    labels = labels.astype(int)
    class_counts = np.bincount(labels)
    if 0 in class_counts:
        raise ValueError(
            "One class has zero samples — cannot compute inverse-frequency weights. "
            f"Class counts: {class_counts}"
        )
    class_weights = 1.0 / class_counts.astype(np.float64)
    return class_weights[labels].astype(np.float32)


def compute_scale_pos_weight(labels: np.ndarray) -> float:
    """
    Compute the negative-to-positive ratio for use as LightGBM
    ``scale_pos_weight`` or PyTorch ``BCEWithLogitsLoss(pos_weight=...)``.

    Parameters
    ----------
    labels : np.ndarray of int
        Binary label array from the *training* fold only.

    Returns
    -------
    float
        ``n_negatives / n_positives``.  Clamped to a minimum of 1.0.
    """
    labels = labels.astype(int)
    n_pos = max(int(labels.sum()), 1)
    n_neg = len(labels) - n_pos
    return max(float(n_neg) / float(n_pos), 1.0)


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------


def run_preprocessing_pipeline(
    csv_path: str | Path,
    image_dirs: Sequence[str | Path] | None = None,
    *,
    benign_downsample_ratio: float = 1.0,
    tile_type_filter: str | None = None,
    n_folds: int = 5,
    seed: int = 42,
    mode_threshold: float = 0.01,
    drop_missing_images: bool = True,
) -> pd.DataFrame:
    """
    Full preprocessing pipeline — Phases 1 and 2.

    Parameters
    ----------
    csv_path : str | Path
        Path to the raw ISIC-2024 ``train-metadata.csv``.
    image_dirs : sequence of str | Path | None
        List of directories that contain the PNG tiles.  When provided,
        an ``image_path`` column is resolved for every row and rows whose
        image cannot be found are optionally dropped.
    benign_downsample_ratio : float
        Fraction of benign rows to retain (1.0 = keep all).
    tile_type_filter : str | None
        Value of ``tbp_tile_type`` to keep (e.g. ``'3D: XP'``).
        ``None`` → keep all tile types.
    n_folds : int
        K for StratifiedGroupKFold.
    seed : int
        Global random seed.
    mode_threshold : float
        Passed to :func:`impute_missing`.
    drop_missing_images : bool
        Drop rows whose resolved image file does not exist on disk.

    Returns
    -------
    pd.DataFrame
        Cleaned DataFrame with columns:
            - All retained clinical + ABCDE features (numeric)
            - ``sex_enc``, ``site_enc``  — ordinal-encoded categoricals
            - ``fold``                   — 0-indexed fold assignment
            - ``image_path``             — resolved absolute path (if image_dirs given)
            - ``target``                 — binary label
    """
    csv_path = Path(csv_path)
    logger.info("Loading raw CSV from %s", csv_path)
    df = pd.read_csv(csv_path, low_memory=False)
    logger.info("Raw shape: %s", df.shape)

    # ---- Resolve image paths ----
    if image_dirs is not None:
        image_dirs_resolved = [Path(d) for d in image_dirs]
        if "isic_id" in df.columns and "image_path" not in df.columns:
            df["image_path"] = df["isic_id"].astype(str) + ".jpg"
        elif "img_id" in df.columns and "image_path" not in df.columns:
            # PAD-UFES-20 schema compatibility
            df["image_path"] = df["img_id"].astype(str)

        def _resolve(fname: str) -> str:
            for d in image_dirs_resolved:
                candidate = d / fname
                if candidate.exists():
                    return str(candidate)
            return str(image_dirs_resolved[0] / fname)  # keep as placeholder

        df["image_path"] = df["image_path"].apply(_resolve)

        if drop_missing_images:
            before = len(df)
            df = df[df["image_path"].apply(lambda p: Path(p).exists())].reset_index(drop=True)
            dropped = before - len(df)
            if dropped:
                logger.warning("Dropped %d rows — image file not found on disk.", dropped)

    # ---- Phase 1a: Feature selection ----
    df = select_features(df)

    # ---- Phase 1b: Drop rows without target or image_path ----
    required_present = [c for c in ("target", "image_path") if c in df.columns]
    before = len(df)
    df = df.dropna(subset=required_present).reset_index(drop=True)
    logger.info("Dropped %d rows with null target/image_path.", before - len(df))

    # ---- Phase 1c: Impute missing values (fit on full training set) ----
    df, medians = impute_missing(df, medians=None, mode_threshold=mode_threshold)

    # ---- Phase 1d: Encode categoricals ----
    df = encode_categoricals(df)

    # ---- Phase 1e: Downsampling (optional) ----
    if benign_downsample_ratio < 1.0 or tile_type_filter is not None:
        df = downsample_benign(
            df,
            ratio=benign_downsample_ratio,
            tile_type_filter=tile_type_filter,
            seed=seed,
        )

    # ---- Phase 2: Fold assignment ----
    group_col = "patient_id" if "patient_id" in df.columns else None
    if group_col:
        df = assign_folds(df, n_folds=n_folds, seed=seed)
    else:
        logger.warning(
            "'patient_id' column not found — falling back to StratifiedKFold "
            "(no patient-level grouping; leakage possible)."
        )
        from sklearn.model_selection import StratifiedKFold
        skf = StratifiedKFold(n_splits=n_folds, shuffle=True, random_state=seed)
        df["fold"] = -1
        for fold_idx, (_, val_idx) in enumerate(
            skf.split(np.zeros(len(df)), df["target"].values)
        ):
            df.iloc[val_idx, df.columns.get_loc("fold")] = fold_idx
        df["fold"] = df["fold"].astype(int)

    # ---- Summary ----
    n_mal = int(df["target"].sum())
    n_ben = len(df) - n_mal
    logger.info(
        "Pipeline complete: %d rows  |  %d malignant  |  %d benign  |  "
        "imbalance ratio %.0f:1",
        len(df), n_mal, n_ben, n_ben / max(n_mal, 1),
    )
    return df
