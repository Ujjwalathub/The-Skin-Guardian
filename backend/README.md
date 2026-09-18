# Derm-Referral AI Engine

> Automated skin-lesion triage for primary healthcare environments.  
> Two-stage AI pipeline: **EfficientNet-B0** (image) + **LightGBM** (clinical metadata) → 🟢 / 🟡 / 🔴 referral flag.

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Quick Start — API Only](#quick-start--api-only)
4. [Training Pipeline](#training-pipeline)
5. [API Reference](#api-reference)
6. [Configuration & Environment Variables](#configuration--environment-variables)
7. [Performance Targets](#performance-targets)

---

## Overview

Non-specialist clinicians in resource-constrained primary health centres photograph a skin lesion with a smartphone.
The Derm-Referral AI API processes the image and a brief clinical questionnaire and returns one of three decisions:

| Flag | Meaning | Action |
|------|---------|--------|
| 🔴 **RED** | High malignancy probability (≥ 0.75) | Urgent Referral for Physical Biopsy |
| 🟡 **YELLOW** | Moderate concern (0.35 – 0.75) | Consult District Specialist via Tele-Dermatology |
| 🟢 **GREEN** | Low concern (< 0.35) | Routine Local Monitoring (Re-check in 6 Months) |

---

## Repository Structure

```text
Derm-Referral-AI/
│
├── weights/                      # Serialised model artefacts (git-ignored binaries)
│   ├── effnet_b0_v1.pth          # EfficientNet-B0 PyTorch state-dict
│   └── lightgbm_meta_v1.lgb      # LightGBM native booster
│
├── src/                          # ML Training Pipeline
│   ├── __init__.py
│   ├── dataset.py                # SkinLesionDataset + Albumentations transforms
│   ├── models.py                 # EfficientNetB0Classifier architecture
│   ├── train_vision.py           # Stage 1: OOF CNN training (AMP + grad accum)
│   └── train_meta.py             # Stage 2: LightGBM OOF meta-learner
│
├── api/                          # FastAPI Backend
│   ├── __init__.py
│   ├── main.py                   # FastAPI app, routes, exception handlers
│   ├── schemas.py                # Pydantic v2 request / response models
│   └── service.py                # Model loader + two-stage inference engine
│
├── pyproject.toml                # Dependency spec (managed via uv)
├── requirements.txt              # Exported lock file
└── README.md
```

---

## Quick Start — API Only

### 1. Install dependencies

```bash
# Recommended: blazing-fast Rust-based package manager
pip install uv
uv pip install -r requirements.txt
```

Or with standard pip:

```bash
pip install -r requirements.txt
```

### 2. Place trained weights

Copy your trained model artefacts into the `weights/` directory:

```
weights/effnet_b0_v1.pth
weights/lightgbm_meta_v1.lgb
```

### 3. Launch the API server

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

Multi-worker (production):

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 2
```

### 4. Interactive API docs

Open **http://localhost:8000/docs** in your browser for the auto-generated Swagger UI.

### 5. Example request (curl)

```bash
curl -X POST http://localhost:8000/api/v1/triage \
  -F "image=@/path/to/lesion.jpg" \
  -F 'metadata={
        "age_approx": 54.0,
        "sex": "female",
        "anatom_site_general": "torso",
        "clin_size_long_diam_mm": 8.5,
        "asymmetry_score": 3,
        "border_irregularity": 4,
        "color_variation": 3
      }'
```

Example **200 OK** response:

```json
{
  "request_id": "req_9823f4a1c",
  "timestamp": "2026-07-23T14:30:00Z",
  "referral_triage": {
    "flag": "RED",
    "action": "Urgent Referral for Physical Biopsy",
    "urgency_level": "CRITICAL"
  },
  "model_scores": {
    "combined_malignancy_probability": 0.892,
    "vision_subscore": 0.815,
    "tabular_subscore": 0.910
  },
  "execution_metrics": {
    "inference_time_ms": 142.5
  }
}
```

---

## Training Pipeline

### Prerequisites

- NVIDIA GPU with ≥ 6 GB VRAM (e.g. RTX 3050) or a CPU fallback.
- Dataset: SLICE-3D (ISIC 2024) or PAD-UFES-20 with a CSV index file.

CSV format expected by the training scripts:

| Column | Type | Description |
|--------|------|-------------|
| `image_path` | str | Relative or absolute path to the lesion image |
| `target` | int | 0 = benign, 1 = malignant |
| `age_approx` | float | Patient age in years |
| `sex` | str | `male` / `female` |
| `anatom_site_general` | str | One of the 7 anatomical site categories |
| `clin_size_long_diam_mm` | float | Longest lesion diameter (mm) |
| `asymmetry_score` | int | 0–5 |
| `border_irregularity` | int | 0–5 |
| `color_variation` | int | 0–5 |

### Stage 1 — Train EfficientNet-B0 (OOF)

```bash
# Set VRAM allocation optimisation (prevents OOM crashes on 6 GB GPUs)
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True

python -m src.train_vision \
    --csv data/train.csv \
    --image-dir data/images \
    --output-dir weights \
    --epochs 15
```

Outputs:
- `weights/effnet_b0_fold{0..4}.pth` — best checkpoint per fold
- `weights/oof_predictions.csv` — full training set CNN OOF scores (no leakage)

### Stage 2 — Train LightGBM Meta-Learner

```bash
python -m src.train_meta \
    --oof-csv weights/oof_predictions.csv \
    --output-dir weights
```

Outputs:
- `weights/lightgbm_meta_v1.lgb` — final booster (rename or symlink from best fold)
- `weights/lgbm_oof_predictions.csv` — LightGBM OOF scores for calibration
- `weights/feature_importance.json` — gain-based feature importance

> **Tip:** Rename the best fold checkpoint to `effnet_b0_v1.pth` so the API
> picks it up automatically:
> ```bash
> cp weights/effnet_b0_fold2.pth weights/effnet_b0_v1.pth  # use your best fold
> ```

### Experiment Tracking (MLflow)

Both training scripts log to MLflow automatically.  Launch the UI with:

```bash
mlflow ui --port 5000
```

---

## API Reference

### `POST /api/v1/triage`

**Content-Type:** `multipart/form-data`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `image` | file | JPEG/PNG, ≤ 10 MB | Lesion photograph |
| `metadata` | string (JSON) | See schema below | Clinical patient data |

**Metadata JSON schema:**

```json
{
  "age_approx": 54.0,
  "sex": "female",
  "anatom_site_general": "torso",
  "clin_size_long_diam_mm": 8.5,
  "asymmetry_score": 3,
  "border_irregularity": 4,
  "color_variation": 3
}
```

| Field | Type | Range / Values |
|-------|------|----------------|
| `age_approx` | float | 0 – 120 |
| `sex` | string | `"male"` \| `"female"` |
| `anatom_site_general` | string | `"head/neck"`, `"upper extremity"`, `"lower extremity"`, `"torso"`, `"palms/soles"`, `"oral/genital"`, `"other"` |
| `clin_size_long_diam_mm` | float | 0.1 – 100.0 |
| `asymmetry_score` | int | 0 – 5 |
| `border_irregularity` | int | 0 – 5 |
| `color_variation` | int | 0 – 5 |

**Error responses:**

| Code | Trigger |
|------|---------|
| `400 Bad Request` | Invalid / missing metadata fields |
| `413 Request Entity Too Large` | Image > 10 MB |
| `422 Unprocessable Entity` | Corrupted or unreadable image file |

### `GET /health`

Liveness probe.  Returns `{"status": "ok"}` when the service is running.

---

## Configuration & Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTORCH_CUDA_ALLOC_CONF` | _(unset)_ | Set to `expandable_segments:True` during training to prevent OOM crashes |
| `MLFLOW_TRACKING_URI` | `./mlruns` | MLflow experiment store location |

Model weight paths are resolved relative to the working directory from which
Uvicorn is launched and are configurable in [`api/service.py`](api/service.py):

```python
EFFNET_WEIGHTS_PATH = Path("weights/effnet_b0_v1.pth")
LGBM_WEIGHTS_PATH   = Path("weights/lightgbm_meta_v1.lgb")
```

---

## Performance Targets

| Metric | Minimum | Target |
|--------|---------|--------|
| ROC-AUC | ≥ 0.88 | ≥ 0.93 |
| Malignant Sensitivity (Recall) | ≥ 0.95 | ≥ 0.98 |
| P95 Latency (GPU) | ≤ 300 ms | ≤ 180 ms |
| P95 Latency (CPU) | ≤ 800 ms | — |
| VRAM during inference | ≤ 1.8 GB | — |
| Type coverage (API routes) | 100% | 100% |

---

*Derm-Referral AI — v1.0.0*
