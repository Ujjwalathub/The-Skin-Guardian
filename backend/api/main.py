"""
api/main.py
-----------
FastAPI application initialisation, route handlers, and global exception hooks.

Startup behaviour
-----------------
* The ``lifespan`` context manager warms up the model singleton on the first
  request instead of blocking startup, so Uvicorn reports healthy immediately
  even in environments where GPU driver initialisation is slow.
* Two exception handlers convert well-known failure modes into the correct
  HTTP status codes without ever leaking a 500 (PRD §6.2).

Running locally
---------------
    uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

Production (multi-worker)
--------------------------
    uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 2
"""

from __future__ import annotations

import json
import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncGenerator

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from api.schemas import (
    ClinicalMetadata,
    ErrorDetail,
    ExecutionMetrics,
    ModelScores,
    ReferralTriage,
    TriageResponse,
)
from api.service import map_score_to_triage, run_inference

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# Maximum allowed image upload size: 10 MB (PRD §5.2)
MAX_IMAGE_BYTES: int = 10 * 1024 * 1024


# ---------------------------------------------------------------------------
# Application lifespan
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
    """Pre-warm model singletons at startup to avoid cold-start latency."""
    logger.info("Derm-Referral AI — warming up model singletons …")
    try:
        from api.service import _load_models

        _load_models()
        logger.info("Models ready.")
    except FileNotFoundError as exc:
        logger.warning(
            "Model weights not found at startup (%s). "
            "Inference will fail until weights are placed in weights/.",
            exc,
        )
    yield
    logger.info("Derm-Referral AI — shutdown complete.")


# ---------------------------------------------------------------------------
# Application instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Derm-Referral AI Engine",
    description=(
        "Automated skin-lesion triage API for primary healthcare environments. "
        "Combines EfficientNet-B0 image scoring with LightGBM clinical metadata "
        "analysis to produce actionable referral flags (🟢 / 🟡 / 🔴)."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS middleware configuration
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handlers (PRD §6.2)
# ---------------------------------------------------------------------------


@app.exception_handler(RequestValidationError)
async def _validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Pydantic / FastAPI validation errors → HTTP 400 Bad Request.

    The response body lists every invalid field so that the client can
    identify and fix all errors in a single request-response cycle.
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorDetail(
            error="Validation Error",
            detail=exc.errors(),
        ).model_dump(mode="json"),
    )


@app.exception_handler(ValidationError)
async def _pydantic_exception_handler(
    request: Request, exc: ValidationError
) -> JSONResponse:
    """Handle Pydantic v2 ValidationError raised during manual model parsing."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorDetail(
            error="Metadata Validation Error",
            detail=exc.errors(),
        ).model_dump(mode="json"),
    )


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------


@app.get("/health", tags=["Utility"])
async def health_check() -> dict[str, str]:
    """Liveness probe — returns 200 when the service is running."""
    return {"status": "ok", "service": "derm-referral-ai"}


# ---------------------------------------------------------------------------
# Triage endpoint
# ---------------------------------------------------------------------------


@app.post(
    "/api/v1/triage",
    response_model=TriageResponse,
    status_code=status.HTTP_200_OK,
    summary="Skin-lesion triage (image + clinical metadata)",
    tags=["Triage"],
    responses={
        400: {"model": ErrorDetail, "description": "Invalid clinical metadata"},
        422: {"model": ErrorDetail, "description": "Corrupted or unreadable image"},
        413: {"description": "Image file exceeds 10 MB limit"},
    },
)
async def triage(
    image: UploadFile = File(
        ...,
        description="Lesion photograph (image/jpeg or image/png, max 10 MB).",
    ),
    metadata: str = Form(
        ...,
        description="JSON string conforming to the ClinicalMetadata schema.",
    ),
) -> TriageResponse:
    """
    Perform two-stage skin-lesion malignancy triage.

    **Request** (multipart/form-data):
    - `image` — JPEG or PNG lesion photograph.
    - `metadata` — JSON string with patient clinical data.

    **Response** — triage flag (RED / YELLOW / GREEN) with model scores and
    latency metrics.
    """
    # ------------------------------------------------------------------
    # 1. Validate content type
    # ------------------------------------------------------------------
    if image.content_type not in ("image/jpeg", "image/png"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unsupported image format. Only image/jpeg and image/png are accepted.",
        )

    # ------------------------------------------------------------------
    # 2. Read and size-check image bytes
    # ------------------------------------------------------------------
    image_bytes = await image.read()
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image exceeds maximum allowed size of {MAX_IMAGE_BYTES // (1024*1024)} MB.",
        )

    # ------------------------------------------------------------------
    # 3. Parse and validate clinical metadata
    # ------------------------------------------------------------------
    try:
        raw_meta = json.loads(metadata)
        clinical_meta = ClinicalMetadata.model_validate(raw_meta)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"metadata field is not valid JSON: {exc}",
        ) from exc
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=exc.errors(),
        ) from exc

    # ------------------------------------------------------------------
    # 4. Run inference pipeline
    # ------------------------------------------------------------------
    try:
        result = run_inference(image_bytes=image_bytes, metadata=clinical_meta)
    except ValueError as exc:
        # Image decode failure (PRD §6.2 — malformed image guard)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Corrupted or unreadable image file.",
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected inference error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal inference error. Please retry.",
        ) from exc

    # ------------------------------------------------------------------
    # 5. Assemble and return structured response
    # ------------------------------------------------------------------
    triage_decision = map_score_to_triage(result["p_lgbm"])
    request_id = f"req_{uuid.uuid4().hex[:9]}"

    logger.info(
        "request_id=%s  p_cnn=%.4f  p_lgbm=%.4f  flag=%s  latency_ms=%.1f",
        request_id,
        result["p_cnn"],
        result["p_lgbm"],
        triage_decision["flag"],
        result["inference_time_ms"],
    )

    return TriageResponse(
        request_id=request_id,
        timestamp=datetime.now(tz=timezone.utc),
        referral_triage=ReferralTriage(**triage_decision),
        model_scores=ModelScores(
            combined_malignancy_probability=round(result["p_lgbm"], 6),
            vision_subscore=round(result["p_cnn"], 6),
            tabular_subscore=round(result["p_lgbm"], 6),
        ),
        execution_metrics=ExecutionMetrics(
            inference_time_ms=round(result["inference_time_ms"], 2)
        ),
    )
