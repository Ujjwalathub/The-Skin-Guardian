"""
src/train_vision.py
-------------------
EfficientNet-B0 training script with:
    - 5-Fold Stratified K-Fold cross-validation (OOF stacking)
    - PyTorch Automatic Mixed Precision (AMP)
    - Gradient accumulation (micro-batch 16, effective batch 64)
    - 8-bit AdamW optimizer (bitsandbytes)
    - Weighted BCEWithLogitsLoss for class imbalance
    - Weights & Biases (W&B) experiment tracking

Usage
-----
    python -m src.train_vision \\
        --csv data/train.csv \\
        --image-dir data/images \\
        --output-dir weights \\
        --epochs 15

Environment variable recommended before launching:
    PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
"""

from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

import wandb
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import StratifiedGroupKFold
from torch.cuda.amp import GradScaler, autocast
from torch.utils.data import DataLoader

# bitsandbytes is optional at import time; falls back to standard AdamW
try:
    import bitsandbytes as bnb  # type: ignore

    _BNB_AVAILABLE = True
except ImportError:
    _BNB_AVAILABLE = False

from src.dataset import (
    SkinLesionDataset,
    build_train_transform,
    build_val_transform,
    preprocess_dataframe,
)
from src.models import EfficientNetB0Classifier, save_model

# ---------------------------------------------------------------------------
# Constants (PRD §4.5)
# ---------------------------------------------------------------------------

MICRO_BATCH_SIZE: int = 16       # fits in 6 GB VRAM
ACCUMULATION_STEPS: int = 4      # effective batch = 16 × 4 = 64
N_FOLDS: int = 5
LEARNING_RATE: float = 1e-4
POS_WEIGHT_FLOOR: float = 10.0   # PRD §4.2 — w ≥ 10.0
SEED: int = 42


def _seed_everything(seed: int) -> None:
    import random

    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


def _build_optimizer(
    model: EfficientNetB0Classifier, lr: float
) -> torch.optim.Optimizer:
    """Return 8-bit AdamW when bitsandbytes is available, else standard AdamW."""
    if _BNB_AVAILABLE:
        return bnb.optim.AdamW8bit(model.parameters(), lr=lr, weight_decay=1e-4)
    return torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)


# ---------------------------------------------------------------------------
# Single fold training
# ---------------------------------------------------------------------------


def train_one_fold(
    fold_idx: int,
    train_df: pd.DataFrame,
    val_df: pd.DataFrame,
    device: torch.device,
    epochs: int,
    output_dir: Path,
) -> tuple[np.ndarray, float]:
    """
    Train EfficientNet-B0 on one fold, return OOF predictions and best AUC.

    Returns
    -------
    oof_preds : np.ndarray of shape (len(val_df),)
        Sigmoid probabilities for the validation fold.
    best_auc : float
        Best validation ROC-AUC across all epochs.
    """
    train_ds = SkinLesionDataset(train_df, transform=build_train_transform())
    val_ds = SkinLesionDataset(val_df, transform=build_val_transform())

    sampler = train_ds.get_sampler()
    pos_weight_val = max(train_ds.get_pos_weight(), POS_WEIGHT_FLOOR)

    train_loader = DataLoader(
        train_ds,
        batch_size=MICRO_BATCH_SIZE,
        sampler=sampler,
        num_workers=4,
        pin_memory=True,
        drop_last=True,
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=MICRO_BATCH_SIZE * 2,
        shuffle=False,
        num_workers=4,
        pin_memory=True,
    )

    model = EfficientNetB0Classifier(pretrained=True).to(device)
    optimizer = _build_optimizer(model, LEARNING_RATE)
    scaler = GradScaler()
    criterion = nn.BCEWithLogitsLoss(
        pos_weight=torch.tensor([pos_weight_val], device=device)
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=epochs, eta_min=1e-6
    )

    best_auc: float = 0.0
    best_weight_path = output_dir / f"effnet_b0_fold{fold_idx}.pth"

    print(f"\n{'='*60}")
    print(f"  Fold {fold_idx + 1}/{N_FOLDS}  |  pos_weight={pos_weight_val:.1f}")
    print(f"{'='*60}")

    for epoch in range(1, epochs + 1):
        # ---- Training ----
        model.train()
        running_loss = 0.0
        optimizer.zero_grad()

        for step, (images, _tabular, labels) in enumerate(train_loader, start=1):
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            with autocast():
                logits = model(images)
                loss = criterion(logits, labels) / ACCUMULATION_STEPS

            scaler.scale(loss).backward()

            if step % ACCUMULATION_STEPS == 0:
                scaler.step(optimizer)
                scaler.update()
                optimizer.zero_grad()

            running_loss += loss.item() * ACCUMULATION_STEPS
            wandb.log({"batch_loss": loss.item() * ACCUMULATION_STEPS})

        scheduler.step()
        avg_loss = running_loss / len(train_loader)

        # ---- Validation ----
        model.eval()
        all_probs: list[float] = []
        all_labels: list[int] = []

        with torch.no_grad():
            for images, _tabular, labels in val_loader:
                images = images.to(device, non_blocking=True)
                with autocast():
                    logits = model(images)
                probs = torch.sigmoid(logits).cpu().numpy()
                all_probs.extend(probs.tolist())
                all_labels.extend(labels.numpy().tolist())

        val_auc = roc_auc_score(all_labels, all_probs)

        print(
            f"  Epoch {epoch:02d}/{epochs}  "
            f"loss={avg_loss:.4f}  val_auc={val_auc:.4f}"
        )
        wandb.log(
            {f"fold{fold_idx}_train_loss": avg_loss, f"fold{fold_idx}_val_auc": val_auc,
             "epoch": epoch},
        )

        if val_auc > best_auc:
            best_auc = val_auc
            save_model(model, str(best_weight_path))
            print(f"    ↳ New best  AUC={best_auc:.4f}  →  {best_weight_path}")

    # Re-run inference with the best checkpoint to obtain clean OOF predictions
    model.load_state_dict(torch.load(best_weight_path, map_location=device))
    model.eval()
    oof_probs: list[float] = []

    with torch.no_grad():
        for images, _tabular, _ in val_loader:
            images = images.to(device, non_blocking=True)
            with autocast():
                logits = model(images)
            oof_probs.extend(torch.sigmoid(logits).cpu().numpy().tolist())

    return np.array(oof_probs), best_auc


# ---------------------------------------------------------------------------
# Main OOF training loop
# ---------------------------------------------------------------------------


def run_oof_training(
    df: pd.DataFrame,
    device: torch.device,
    epochs: int,
    output_dir: Path,
) -> None:
    """
    Execute 5-Fold OOF training, save per-fold weights and OOF prediction CSV.

    The OOF CSV is consumed by ``train_meta.py`` to train the LightGBM
    meta-learner without data leakage (PRD §4.4).

    Writes
    ------
    weights/effnet_b0_fold{k}.pth      — best checkpoint per fold
    weights/oof_predictions.csv        — full training set OOF p_cnn_score column
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    # StratifiedGroupKFold: keep all images of a patient in the same fold
    # to prevent data leakage across the train/validation boundary.
    group_col = "patient_id" if "patient_id" in df.columns else None
    groups = df[group_col].values if group_col else np.arange(len(df))
    labels = df["target"].values

    sgkf = StratifiedGroupKFold(n_splits=N_FOLDS, shuffle=True, random_state=SEED)

    oof_preds = np.zeros(len(df), dtype=np.float32)
    fold_aucs: list[float] = []

    wandb.init(
        project="derm-referral-vision",
        name="oof_training",
        config={
            "n_folds": N_FOLDS,
            "micro_batch": MICRO_BATCH_SIZE,
            "accumulation_steps": ACCUMULATION_STEPS,
            "effective_batch": MICRO_BATCH_SIZE * ACCUMULATION_STEPS,
            "epochs": epochs,
            "lr": LEARNING_RATE,
            "pos_weight_floor": POS_WEIGHT_FLOOR,
            "optimizer": "AdamW8bit" if _BNB_AVAILABLE else "AdamW",
            "split_strategy": "StratifiedGroupKFold" if group_col else "StratifiedKFold",
        },
    )

    try:
        for fold_idx, (train_idx, val_idx) in enumerate(
            sgkf.split(np.zeros(len(df)), labels, groups=groups)
        ):
            train_df = df.iloc[train_idx].reset_index(drop=True)
            val_df = df.iloc[val_idx].reset_index(drop=True)

            fold_preds, fold_auc = train_one_fold(
                fold_idx=fold_idx,
                train_df=train_df,
                val_df=val_df,
                device=device,
                epochs=epochs,
                output_dir=output_dir,
            )
            oof_preds[val_idx] = fold_preds
            fold_aucs.append(fold_auc)
            wandb.log({f"fold{fold_idx}_best_auc": fold_auc})

        mean_auc = float(np.mean(fold_aucs))
        wandb.log({"mean_oof_auc": mean_auc})
    finally:
        wandb.finish()

    print(f"\n{'='*60}")
    print(f"  OOF Training complete")
    print(f"  Per-fold AUCs: {[f'{a:.4f}' for a in fold_aucs]}")
    print(f"  Mean OOF AUC:  {mean_auc:.4f}")
    print(f"{'='*60}")

    # Persist OOF predictions for LightGBM training
    oof_df = df.copy()
    oof_df["p_cnn_score"] = oof_preds
    oof_csv = output_dir / "oof_predictions.csv"
    oof_df.to_csv(oof_csv, index=False)
    print(f"  OOF predictions saved → {oof_csv}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train EfficientNet-B0 with 5-Fold OOF stacking."
    )
    parser.add_argument("--csv", type=Path, required=True, help="Path to training CSV.")
    parser.add_argument(
        "--image-dir", type=Path, required=True, help="Root directory of lesion images."
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("weights"),
        help="Directory to save model weights and OOF CSV.",
    )
    parser.add_argument("--epochs", type=int, default=15, help="Training epochs per fold.")
    parser.add_argument(
        "--device",
        type=str,
        default="auto",
        help="'cuda', 'cpu', or 'auto' (default: auto-detect).",
    )
    return parser.parse_args()


def main() -> None:
    # Recommended env var for CUDA memory fragmentation (PRD §4.5)
    os.environ.setdefault("PYTORCH_CUDA_ALLOC_CONF", "expandable_segments:True")

    args = _parse_args()
    _seed_everything(SEED)

    if args.device == "auto":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(args.device)

    print(f"Device: {device}")
    if device.type == "cuda":
        print(f"GPU   : {torch.cuda.get_device_name(device)}")

    df = pd.read_csv(args.csv)
    df["image_path"] = df["image_path"].apply(
        lambda p: str(args.image_dir / p) if not Path(p).is_absolute() else p
    )
    df = preprocess_dataframe(df)

    print(f"Dataset: {len(df):,} rows  |  malignant: {df['target'].sum():,}")

    t0 = time.time()
    run_oof_training(
        df=df,
        device=device,
        epochs=args.epochs,
        output_dir=args.output_dir,
    )
    print(f"\nTotal wall time: {(time.time() - t0) / 60:.1f} min")


if __name__ == "__main__":
    main()
