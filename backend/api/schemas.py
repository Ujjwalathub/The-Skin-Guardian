"""
api/schemas.py
--------------
Pydantic v2 data models for the Derm-Referral AI API.

All models use strict field validation so that an invalid payload is caught at
the boundary before it reaches any ML inference code.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Request schema
# ---------------------------------------------------------------------------

AnatomSite = Literal[
    "head/neck",
    "upper extremity",
    "lower extremity",
    "torso",
    "palms/soles",
    "oral/genital",
    "other",
]


class ClinicalMetadata(BaseModel):
    """
    Structured clinical metadata accompanying the lesion image.

    All fields are required; Pydantic will return a ``400 Bad Request`` (via
    the FastAPI exception handler) if any field is missing or out-of-range.
    """

    age_approx: float = Field(
        ...,
        ge=0.0,
        le=120.0,
        description="Patient age in years (0–120).",
    )
    sex: Literal["male", "female"] = Field(
        ...,
        description="Biological sex of the patient.",
    )
    anatom_site_general: AnatomSite = Field(
        ...,
        description="General anatomical region of the lesion.",
    )
    clin_size_long_diam_mm: float = Field(
        ...,
        ge=0.1,
        le=100.0,
        description="Longest diameter of the lesion in millimetres (0.1–100).",
    )
    asymmetry_score: int = Field(
        ...,
        ge=0,
        le=5,
        description="ABCDE asymmetry score (0 = symmetric, 5 = highly asymmetric).",
    )
    border_irregularity: int = Field(
        ...,
        ge=0,
        le=5,
        description="ABCDE border irregularity score (0 = smooth, 5 = ragged).",
    )
    color_variation: int = Field(
        ...,
        ge=0,
        le=5,
        description="ABCDE colour variation score (0 = uniform, 5 = highly varied).",
    )


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------


class ReferralTriage(BaseModel):
    """Triage decision produced by the decision threshold engine."""

    flag: Literal["RED", "YELLOW", "GREEN"]
    action: str
    urgency_level: Literal["CRITICAL", "MODERATE", "LOW"]


class ModelScores(BaseModel):
    """Raw probability outputs from both model stages."""

    combined_malignancy_probability: float = Field(
        ..., ge=0.0, le=1.0, description="Final LightGBM output score."
    )
    vision_subscore: float = Field(
        ..., ge=0.0, le=1.0, description="EfficientNet-B0 sigmoid probability."
    )
    tabular_subscore: float = Field(
        ..., ge=0.0, le=1.0, description="LightGBM output probability."
    )


class ExecutionMetrics(BaseModel):
    """Wall-clock timing for the full inference pipeline."""

    inference_time_ms: float = Field(..., description="End-to-end inference latency in ms.")


class TriageResponse(BaseModel):
    """
    Top-level API response schema for ``POST /api/v1/triage``.

    Example
    -------
    .. code-block:: json

        {
          "request_id": "req_9823f4a1c",
          "timestamp": "2026-07-23T14:30:00Z",
          "referral_triage": { "flag": "RED", ... },
          "model_scores": { "combined_malignancy_probability": 0.892, ... },
          "execution_metrics": { "inference_time_ms": 142.5 }
        }
    """

    request_id: str
    timestamp: datetime
    referral_triage: ReferralTriage
    model_scores: ModelScores
    execution_metrics: ExecutionMetrics


# ---------------------------------------------------------------------------
# Error response helper
# ---------------------------------------------------------------------------


class ErrorDetail(BaseModel):
    """Uniform error envelope returned for 400 / 422 responses."""

    error: str
    detail: str | list[dict]
