"""
src/train_meta.py
-----------------
LightGBM meta-learner training script (OOF stacking Stage 2).

Consumes the ``oof_predictions.csv`` produced by ``train_vision.py``,
combines the ``p_cnn_score`` column with clinical tabular features, and
trains a LightGBM binary classifier to produce the final malignancy
probability used by the decision threshold engine.

Key design decisions
--------------------
* ``scale_pos_weight`` is computed from the training fold split — not the
  overall dataset — matching the LightGBM documentation recommendation.
* Early stopping on a held-out validation split guards against overfitting.
* The final booster is serialised as ``.lgb`` (native LightGBM format) so it
  can be loaded with ``lgb.Booster(model_file=path)`` in ``api/service.py``.

Usage
-----
    python -m src.train_meta \\
        --oof-csv weights/oof_predictions.csv \\
        --output-dir weights
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import lightgbm as lgb
import wandb
import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import StratifiedKFold, train_test_split

from src.dataset import (
    _SEX_MAP,
    _SITE_MAP,
    TABULAR_FEATURE_COLUMNS,
    preprocess_dataframe,
)

# ---------------------------------------------------------------------------
# Constants (PRD §4.3)
# ---------------------------------------------------------------------------

SEED: int = 42
N_FOLDS: int = 5

LGBM_BASE_PARAMS: dict = {
    "objective": "binary",
    "metric": "auc",
    "learning_rate": 0.03,
    "num_leaves": 63,
    "max_depth": -1,
    "min_child_samples": 20,
    "subsample": 0.8,
    "subsample_freq": 1,
    "colsample_bytree": 0.8,
    "reg_alpha": 0.1,
    "reg_lambda": 0.1,
    "verbose": -1,
    "n_jobs": -1,
    "seed": SEED,
}

# Feature order fed into LightGBM (excludes target / non-numeric columns)
# Using available TBP-LV (Total Body Photography Lesion Variance) features
FEATURE_COLS: list[str] = [
    "p_cnn_score",
    "age_approx",
    "sex_enc",
    "site_enc",
    "clin_size_long_diam_mm",
    # TBP-LV color features
    "tbp_lv_color_std_mean",
    "tbp_lv_norm_color",
    "tbp_lv_radial_color_std_max",
    "tbp_lv_stdL",
    # TBP-LV border/shape features
    "tbp_lv_norm_border",
    "tbp_lv_symm_2axis",
    "tbp_lv_eccentricity",
    # TBP-LV size features
    "tbp_lv_perimeterMM",
    "tbp_lv_minorAxisMM",
]


# ---------------------------------------------------------------------------
# Feature engineering
# ---------------------------------------------------------------------------


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Encode categorical columns and return a copy with all ``FEATURE_COLS``
    present as numeric dtype.

    Parameters
    ----------
    df : pd.DataFrame
        Must contain the raw columns produced by ``train_vision.py`` OOF CSV.

    Returns
    -------
    pd.DataFrame
        Original columns plus ``sex_enc`` and ``site_enc`` integer encodings.
    """
    df = df.copy()
    df["sex_enc"] = df["sex"].str.lower().map(_SEX_MAP).fillna(-1).astype(int)
    df["site_enc"] = (
        df["anatom_site_general"].str.lower().map(_SITE_MAP).fillna(-1).astype(int)
    )
    # Ensure all feature columns are present and numeric
    for col in FEATURE_COLS:
        if col not in df.columns:
            raise ValueError(
                f"Expected feature column '{col}' missing from OOF DataFrame. "
                "Check that train_vision.py has run successfully."
            )
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


# ---------------------------------------------------------------------------
# LightGBM OOF training
# ---------------------------------------------------------------------------


def train_lgbm_oof(
    df: pd.DataFrame,
    output_dir: Path,
) -> tuple[lgb.Booster, float]:
    """
    Train LightGBM via 5-Fold Stratified K-Fold and save OOF predictions.

    The fold structure mirrors ``train_vision.py`` (same ``SEED``) so that
    the LightGBM validation folds do **not** overlap with the folds used to
    generate the CNN OOF predictions — preventing any form of data leakage.

    Returns
    -------
    final_booster : lgb.Booster
        Model retrained on the full dataset with the best ``n_estimators``
        found during OOF cross-validation.
    mean_oof_auc : float
        Average ROC-AUC across all 5 folds.
    """
    X = df[FEATURE_COLS].values
    y = df["target"].values.astype(int)

    skf = StratifiedKFold(n_splits=N_FOLDS, shuffle=True, random_state=SEED)
    oof_preds = np.zeros(len(df), dtype=np.float64)
    best_n_estimators_list: list[int] = []
    fold_aucs: list[float] = []

    wandb.init(
        project="derm-referral-meta",
        name="lgbm_oof",
        config={
            **LGBM_BASE_PARAMS,
            "n_folds": N_FOLDS,
            "features": FEATURE_COLS,
        },
    )

    try:
        for fold_idx, (train_idx, val_idx) in enumerate(skf.split(X, y)):
            X_tr, X_val = X[train_idx], X[val_idx]
            y_tr, y_val = y[train_idx], y[val_idx]

            # Dynamic scale_pos_weight from this fold's class distribution
            n_neg = int((y_tr == 0).sum())
            n_pos = max(int((y_tr == 1).sum()), 1)
            fold_scale_pos_weight = n_neg / n_pos

            params = {
                **LGBM_BASE_PARAMS,
                "scale_pos_weight": fold_scale_pos_weight,
            }

            dtrain = lgb.Dataset(X_tr, label=y_tr, feature_name=FEATURE_COLS)
            dval = lgb.Dataset(X_val, label=y_val, reference=dtrain)

            callbacks = [
                lgb.early_stopping(stopping_rounds=50, verbose=False),
                lgb.log_evaluation(period=100),
            ]

            booster = lgb.train(
                params,
                dtrain,
                num_boost_round=2000,
                valid_sets=[dval],
                callbacks=callbacks,
            )

            fold_preds = booster.predict(X_val)
            oof_preds[val_idx] = fold_preds
            fold_auc = roc_auc_score(y_val, fold_preds)
            fold_aucs.append(fold_auc)
            best_n_estimators_list.append(booster.best_iteration)

            print(
                f"  Fold {fold_idx + 1}/{N_FOLDS}  "
                f"scale_pos_weight={fold_scale_pos_weight:.1f}  "
                f"best_iter={booster.best_iteration}  "
                f"val_auc={fold_auc:.4f}"
            )
            wandb.log({f"fold{fold_idx}_val_auc": fold_auc})

        mean_oof_auc = float(roc_auc_score(y, oof_preds))
        wandb.log({"mean_oof_auc": mean_oof_auc})
        print(f"\n  Mean OOF AUC: {mean_oof_auc:.4f}")
    finally:
        wandb.finish()

    # ------------------------------------------------------------------
    # Retrain on the full dataset using the mean best iteration
    # ------------------------------------------------------------------
    best_n_estimators = int(np.mean(best_n_estimators_list))
    n_neg_full = int((y == 0).sum())
    n_pos_full = max(int((y == 1).sum()), 1)
    final_params = {
        **LGBM_BASE_PARAMS,
        "scale_pos_weight": n_neg_full / n_pos_full,
    }

    dtrain_full = lgb.Dataset(X, label=y, feature_name=FEATURE_COLS)
    final_booster = lgb.train(
        final_params,
        dtrain_full,
        num_boost_round=best_n_estimators,
    )

    # Save artefacts
    output_dir.mkdir(parents=True, exist_ok=True)
    booster_path = output_dir / "lightgbm_meta.lgb"
    final_booster.save_model(str(booster_path))
    print(f"\n  LightGBM booster saved → {booster_path}")

    # Persist OOF predictions alongside the booster for post-hoc calibration
    oof_out = df[["target"]].copy()
    oof_out["lgbm_oof_score"] = oof_preds
    oof_out.to_csv(output_dir / "lgbm_oof_predictions.csv", index=False)

    # Save feature importance
    importance = dict(
        zip(FEATURE_COLS, final_booster.feature_importance(importance_type="gain").tolist())
    )
    importance_sorted = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
    with open(output_dir / "feature_importance.json", "w") as fh:
        json.dump(importance_sorted, fh, indent=2)

    print("  Feature importance (gain):")
    for feat, score in importance_sorted.items():
        print(f"    {feat:<30}  {score:>10.1f}")

    return final_booster, mean_oof_auc


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train LightGBM meta-learner on OOF CNN predictions."
    )
    parser.add_argument(
        "--oof-csv",
        type=Path,
        required=True,
        help="Path to OOF CSV produced by train_vision.py (contains p_cnn_score).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("weights"),
        help="Directory to save booster and diagnostic files.",
    )
    return parser.parse_args()


def main() -> None:
    args = _parse_args()

    df = pd.read_csv(args.oof_csv)
    df = preprocess_dataframe(df)
    df = engineer_features(df)

    print(f"Meta-learner dataset: {len(df):,} rows")
    print(f"  Malignant: {df['target'].sum():,}  ({100*df['target'].mean():.2f}%)")
    print(f"  Features : {FEATURE_COLS}")

    _, mean_auc = train_lgbm_oof(df=df, output_dir=args.output_dir)

    print(f"\nFinal mean OOF AUC: {mean_auc:.4f}")
    if mean_auc >= 0.93:
        print("  ✓ Target AUC ≥ 0.93 achieved.")
    elif mean_auc >= 0.88:
        print("  ~ Minimum threshold AUC ≥ 0.88 achieved.")
    else:
        print("  ✗ AUC below minimum threshold — review hyperparameters.")


if __name__ == "__main__":
    main()
