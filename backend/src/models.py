"""
src/models.py
-------------
EfficientNet-B0 image feature extractor.

The architecture wraps torchvision's pre-trained EfficientNet-B0 backbone,
replaces the classification head with a single sigmoid-activated output, and
exposes a `get_features()` method for extracting the 1280-dimensional pooled
representation — useful for future ablation experiments.

Design rationale
----------------
* ``EfficientNetB0Classifier`` is a thin wrapper so weight loading and
  fine-tuning configuration are co-located and testable in isolation.
* The forward pass returns a **raw logit** (not a sigmoid probability) so it
  can be passed directly into ``BCEWithLogitsLoss`` for numerically stable
  training.  Call ``torch.sigmoid(logit)`` to get a probability.
"""

from __future__ import annotations

import torch
import torch.nn as nn
from torchvision.models import EfficientNet_B0_Weights, efficientnet_b0


class EfficientNetB0Classifier(nn.Module):
    """
    EfficientNet-B0 binary classifier for skin-lesion malignancy prediction.

    Parameters
    ----------
    pretrained : bool
        If ``True`` (default), initialise the backbone with ImageNet-1K weights.
        Set to ``False`` only for unit tests or ablation runs without internet.
    dropout_rate : float
        Dropout probability inserted before the final linear layer.  Default
        ``0.3`` matches the original EfficientNet-B0 classifier head.
    freeze_backbone : bool
        If ``True``, freeze all backbone parameters so only the classification
        head is trained.  Useful for quick convergence checks on small datasets.
    """

    # Dimension of the EfficientNet-B0 pooled feature vector
    FEATURE_DIM: int = 1280

    def __init__(
        self,
        pretrained: bool = True,
        dropout_rate: float = 0.3,
        freeze_backbone: bool = False,
    ) -> None:
        super().__init__()

        weights = EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
        backbone = efficientnet_b0(weights=weights)

        # Extract feature layers (everything except the original classifier)
        self.features = backbone.features
        self.avgpool = backbone.avgpool

        # Custom binary classification head
        self.classifier = nn.Sequential(
            nn.Dropout(p=dropout_rate, inplace=True),
            nn.Linear(self.FEATURE_DIM, 1),  # logit output
        )

        if freeze_backbone:
            self._freeze_backbone()

    # ------------------------------------------------------------------
    # Forward pass
    # ------------------------------------------------------------------

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Parameters
        ----------
        x : torch.Tensor
            Shape ``(B, 3, 224, 224)``, normalised to ImageNet statistics.

        Returns
        -------
        torch.Tensor
            Raw logit of shape ``(B,)``.  Apply ``torch.sigmoid`` to get
            :math:`P_{\\text{CNN}} \\in [0, 1]`.
        """
        features = self.features(x)
        pooled = self.avgpool(features)
        flat = torch.flatten(pooled, 1)  # (B, 1280)
        logit = self.classifier(flat)    # (B, 1)
        return logit.squeeze(1)          # (B,)

    # ------------------------------------------------------------------
    # Feature extraction (for ablation / visualisation)
    # ------------------------------------------------------------------

    def get_features(self, x: torch.Tensor) -> torch.Tensor:
        """
        Extract the 1280-dimensional pooled embedding without the classifier.

        Parameters
        ----------
        x : torch.Tensor
            Shape ``(B, 3, 224, 224)``.

        Returns
        -------
        torch.Tensor
            Shape ``(B, 1280)``.
        """
        with torch.no_grad():
            features = self.features(x)
            pooled = self.avgpool(features)
            return torch.flatten(pooled, 1)

    # ------------------------------------------------------------------
    # Utility
    # ------------------------------------------------------------------

    def _freeze_backbone(self) -> None:
        """Freeze all backbone (features + avgpool) parameters."""
        for param in self.features.parameters():
            param.requires_grad = False
        for param in self.avgpool.parameters():
            param.requires_grad = False

    def unfreeze_backbone(self) -> None:
        """Unfreeze all backbone parameters (call before fine-tuning phase)."""
        for param in self.features.parameters():
            param.requires_grad = True
        for param in self.avgpool.parameters():
            param.requires_grad = True

    def count_parameters(self) -> dict[str, int]:
        """Return a summary of total vs. trainable parameter counts."""
        total = sum(p.numel() for p in self.parameters())
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        return {"total": total, "trainable": trainable}


# ---------------------------------------------------------------------------
# Weight I/O helpers
# ---------------------------------------------------------------------------


def save_model(model: EfficientNetB0Classifier, path: str) -> None:
    """Serialise model state-dict to ``path``."""
    torch.save(model.state_dict(), path)


def load_model(
    path: str,
    device: torch.device | str = "cpu",
    pretrained: bool = False,
) -> EfficientNetB0Classifier:
    """
    Deserialise a saved ``EfficientNetB0Classifier`` state-dict.

    Parameters
    ----------
    path : str
        Path to the ``.pth`` file written by :func:`save_model`.
    device : torch.device | str
        Target device for the loaded weights.
    pretrained : bool
        Passed to the model constructor — should be ``False`` when loading
        fine-tuned weights to avoid downloading unused ImageNet weights.

    Returns
    -------
    EfficientNetB0Classifier
        Model in ``eval()`` mode on the requested device.
    """
    model = EfficientNetB0Classifier(pretrained=pretrained)
    state = torch.load(path, map_location=device)
    model.load_state_dict(state)
    model.to(device)
    model.eval()
    return model
